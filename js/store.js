/**
 * CureSync - Pharmacy Platform State Store
 * Technology Partner: SynXCloud
 *
 * Manages LocalStorage interaction, data mutations, and dispatches state update events.
 */

const DB_KEYS = {
    MEDICINES: "curesync_medicines",
    CUSTOMERS: "curesync_customers",
    ORDERS: "curesync_orders",
    CART: "curesync_cart",
    SESSION_USER: "curesync_current_user",
    FAVORITES: "curesync_favorites",
    THEME: "curesync_theme"
};

const CureSyncStore = {
    // --- INITIALIZATION ---
    init() {
        // Seed database if empty
        if (!localStorage.getItem(DB_KEYS.MEDICINES)) {
            localStorage.setItem(DB_KEYS.MEDICINES, JSON.stringify(window.CureSyncData.medicines));
        }
        if (!localStorage.getItem(DB_KEYS.CUSTOMERS)) {
            localStorage.setItem(DB_KEYS.CUSTOMERS, JSON.stringify(window.CureSyncData.customers));
        }
        if (!localStorage.getItem(DB_KEYS.ORDERS)) {
            const initialOrders = window.CureSyncData.getGeneratedOrders();
            localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(initialOrders));
        }

        // Initialize user session
        if (!localStorage.getItem(DB_KEYS.SESSION_USER)) {
            const customers = this.getCustomers();
            if (customers.length > 0) {
                this.setCurrentUser(customers[0]); // Default to first customer
            }
        }

        // Initialize cart
        if (!localStorage.getItem(DB_KEYS.CART)) {
            this.clearCart(false);
        }

        // Initialize favorites
        if (!localStorage.getItem(DB_KEYS.FAVORITES)) {
            localStorage.setItem(DB_KEYS.FAVORITES, JSON.stringify([]));
        }

        // Initialize theme
        if (!localStorage.getItem(DB_KEYS.THEME)) {
            localStorage.setItem(DB_KEYS.THEME, "light");
        }
    },

    // --- DATA GETTERS & SETTERS (CRUD) ---
    getMedicines() {
        return JSON.parse(localStorage.getItem(DB_KEYS.MEDICINES)) || [];
    },

    saveMedicines(medicines) {
        localStorage.setItem(DB_KEYS.MEDICINES, JSON.stringify(medicines));
        this.dispatch("inventoryUpdated");
    },

    getMedicineById(id) {
        return this.getMedicines().find(m => m.id === id);
    },

    saveMedicine(med) {
        const medicines = this.getMedicines();
        const index = medicines.findIndex(m => m.id === med.id);
        
        if (index > -1) {
            // Update
            medicines[index] = { ...medicines[index], ...med };
        } else {
            // Insert
            medicines.push(med);
        }
        this.saveMedicines(medicines);
    },

    deleteMedicine(id) {
        let medicines = this.getMedicines();
        medicines = medicines.filter(m => m.id !== id);
        this.saveMedicines(medicines);
    },

    getCustomers() {
        return JSON.parse(localStorage.getItem(DB_KEYS.CUSTOMERS)) || [];
    },

    saveCustomers(customers) {
        localStorage.setItem(DB_KEYS.CUSTOMERS, JSON.stringify(customers));
        this.dispatch("customersUpdated");
    },

    getCustomerById(id) {
        return this.getCustomers().find(c => c.id === id);
    },

    saveCustomer(cust) {
        const customers = this.getCustomers();
        const index = customers.findIndex(c => c.id === cust.id);
        if (index > -1) {
            customers[index] = { ...customers[index], ...cust };
        } else {
            customers.push(cust);
        }
        this.saveCustomers(customers);
        
        // Sync current user if it's the one modified
        const curUser = this.getCurrentUser();
        if (curUser && curUser.id === cust.id) {
            this.setCurrentUser(cust);
        }
    },

    getOrders() {
        return JSON.parse(localStorage.getItem(DB_KEYS.ORDERS)) || [];
    },

    saveOrders(orders) {
        localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
        this.dispatch("ordersUpdated");
    },

    getOrderById(id) {
        return this.getOrders().find(o => o.id === id);
    },

    saveOrder(order) {
        const orders = this.getOrders();
        const index = orders.findIndex(o => o.id === order.id);
        if (index > -1) {
            orders[index] = { ...orders[index], ...order };
        } else {
            orders.unshift(order); // New orders first
        }
        this.saveOrders(orders);
    },

    updateOrderStatus(orderId, newStatus) {
        const order = this.getOrderById(orderId);
        if (order) {
            order.status = newStatus;
            this.saveOrder(order);
            
            // Trigger customized notification for user/system
            this.addNotification({
                id: `notif-${Date.now()}`,
                title: `Order ${orderId} Updated`,
                message: `Your order is now: ${newStatus}.`,
                type: "info",
                timestamp: new Date().toISOString(),
                unread: true
            });
        }
    },

    // --- SESSION & USER ACCOUNT ---
    getCurrentUser() {
        return JSON.parse(localStorage.getItem(DB_KEYS.SESSION_USER));
    },

    setCurrentUser(user) {
        localStorage.setItem(DB_KEYS.SESSION_USER, JSON.stringify(user));
        this.dispatch("userSessionChanged");
    },

    // --- CART SYSTEM ---
    getCart() {
        return JSON.parse(localStorage.getItem(DB_KEYS.CART)) || { items: [], subtotal: 0, deliveryFee: 0, discount: 0, total: 0, loyaltyPointsEarned: 0 };
    },

    saveCart(cart) {
        localStorage.setItem(DB_KEYS.CART, JSON.stringify(cart));
        this.dispatch("cartUpdated");
    },

    addToCart(productId, quantity = 1) {
        const med = this.getMedicineById(productId);
        if (!med || med.stock <= 0) return false;

        const cart = this.getCart();
        const existingItem = cart.items.find(item => item.productId === productId);

        if (existingItem) {
            // Check stock limit
            const newQty = existingItem.quantity + quantity;
            if (newQty > med.stock) {
                existingItem.quantity = med.stock;
            } else {
                existingItem.quantity = newQty;
            }
        } else {
            cart.items.push({
                productId: med.id,
                name: med.name,
                brand: med.brand,
                category: med.category,
                price: med.price,
                quantity: Math.min(quantity, med.stock),
                unit: med.unit,
                rxRequired: med.rxRequired
            });
        }

        this.calculateCart(cart);
        
        this.addNotification({
            id: `notif-${Date.now()}`,
            title: "Added to Cart",
            message: `${med.name} added to shopping cart.`,
            type: "success",
            timestamp: new Date().toISOString(),
            unread: true
        });

        return true;
    },

    updateCartQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.items.find(i => i.productId === productId);
        const med = this.getMedicineById(productId);

        if (item && med) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
                return;
            }
            item.quantity = Math.min(quantity, med.stock);
            this.calculateCart(cart);
        }
    },

    removeFromCart(productId) {
        const cart = this.getCart();
        cart.items = cart.items.filter(item => item.productId !== productId);
        this.calculateCart(cart);
    },

    clearCart(notify = true) {
        const cart = {
            items: [],
            subtotal: 0,
            deliveryFee: 0,
            discount: 0,
            total: 0,
            loyaltyPointsEarned: 0
        };
        this.saveCart(cart);
        if (notify) {
            this.dispatch("cartCleared");
        }
    },

    calculateCart(cart) {
        let subtotal = 0;
        cart.items.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        cart.subtotal = Math.round(subtotal * 100) / 100;
        cart.deliveryFee = cart.subtotal > 35 || cart.items.length === 0 ? 0 : 4.99;
        cart.total = Math.round((cart.subtotal + cart.deliveryFee - cart.discount) * 100) / 100;
        cart.loyaltyPointsEarned = Math.floor(cart.total * 0.1);

        this.saveCart(cart);
    },

    applyDiscountCode(code) {
        const cart = this.getCart();
        let discount = 0;

        if (code === "DR20") {
            discount = Math.round(cart.subtotal * 0.2 * 100) / 100; // 20% off
            cart.discount = discount;
            this.calculateCart(cart);
            return { success: true, message: "Promo code DR20 (20% Off) applied!" };
        } else if (code === "WELCOME10") {
            discount = Math.round(cart.subtotal * 0.1 * 100) / 100; // 10% off
            cart.discount = discount;
            this.calculateCart(cart);
            return { success: true, message: "Welcome promo applied!" };
        } else if (code === "FREEHIP") {
            cart.deliveryFee = 0;
            cart.discount = 0; // standard reset
            this.calculateCart(cart);
            return { success: true, message: "Free delivery code applied!" };
        }

        return { success: false, message: "Invalid promo code." };
    },

    checkoutCart(shippingDetails, paymentMethod, prescriptionUrl = null) {
        const cart = this.getCart();
        const user = this.getCurrentUser();
        
        if (cart.items.length === 0) return null;

        // Deduct inventory quantities
        const medicines = this.getMedicines();
        cart.items.forEach(cartItem => {
            const med = medicines.find(m => m.id === cartItem.productId);
            if (med) {
                med.stock = Math.max(0, med.stock - cartItem.quantity);
                med.sales += cartItem.quantity;
            }
        });
        this.saveMedicines(medicines);

        // Update customer loyalty points
        if (user) {
            user.loyaltyPoints += cart.loyaltyPointsEarned;
            this.saveCustomer(user);
        }

        // Create Order Object
        const newOrderId = `ORD-${1000 + this.getOrders().length}`;
        const newOrder = {
            id: newOrderId,
            customerId: user ? user.id : "guest",
            customerName: shippingDetails.fullName,
            customerPhone: shippingDetails.phone,
            customerEmail: shippingDetails.email,
            customerAddress: `${shippingDetails.address}, ${shippingDetails.city}, NY ${shippingDetails.zip}`,
            date: new Date().toISOString(),
            items: cart.items,
            subtotal: cart.subtotal,
            deliveryFee: cart.deliveryFee,
            discount: cart.discount,
            total: cart.total,
            status: "Ordered",
            paymentMethod: paymentMethod,
            prescriptionUrl: prescriptionUrl,
            loyaltyPointsEarned: cart.loyaltyPointsEarned,
            deliverySlot: shippingDetails.deliverySlot
        };

        this.saveOrder(newOrder);
        this.clearCart(false);

        // Notify
        this.addNotification({
            id: `notif-${Date.now()}`,
            title: "Order Placed Successfully",
            message: `Thank you! Your order ${newOrderId} has been created.`,
            type: "success",
            timestamp: new Date().toISOString(),
            unread: true
        });

        // Trigger stock warnings for low items
        this.checkLowStockWarnings();

        return newOrder;
    },

    // --- FAVORITES SYSTEM ---
    getFavorites() {
        return JSON.parse(localStorage.getItem(DB_KEYS.FAVORITES)) || [];
    },

    toggleFavorite(productId) {
        let favorites = this.getFavorites();
        const index = favorites.indexOf(productId);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(productId);
        }
        localStorage.setItem(DB_KEYS.FAVORITES, JSON.stringify(favorites));
        this.dispatch("favoritesUpdated");
    },

    isFavorite(productId) {
        return this.getFavorites().includes(productId);
    },

    // --- THEME ---
    getTheme() {
        return localStorage.getItem(DB_KEYS.THEME) || "light";
    },

    setTheme(theme) {
        localStorage.setItem(DB_KEYS.THEME, theme);
        this.dispatch("themeChanged", theme);
    },

    // --- NOTIFICATIONS ---
    getNotifications() {
        return JSON.parse(localStorage.getItem("curesync_notifications")) || [
            {
                id: "notif-0",
                title: "Welcome to CureSync!",
                message: "Explore our medicine store and discover digital health ordering.",
                type: "info",
                timestamp: new Date().toISOString(),
                unread: true
            }
        ];
    },

    addNotification(notif) {
        const notifs = this.getNotifications();
        notifs.unshift(notif);
        localStorage.setItem("curesync_notifications", JSON.stringify(notifs.slice(0, 50))); // Cap at 50
        this.dispatch("notificationsUpdated", notif);
    },

    markNotificationsRead() {
        const notifs = this.getNotifications();
        notifs.forEach(n => n.unread = false);
        localStorage.setItem("curesync_notifications", JSON.stringify(notifs));
        this.dispatch("notificationsUpdated");
    },

    checkLowStockWarnings() {
        const lowStockItems = this.getMedicines().filter(m => m.stock < 5);
        lowStockItems.forEach(item => {
            this.addNotification({
                id: `notif-stock-${item.id}-${Date.now()}`,
                title: "Low Inventory Alert",
                message: `Medicine "${item.name}" is running low on stock (${item.stock} left).`,
                type: "warning",
                timestamp: new Date().toISOString(),
                unread: true
            });
        });
    },

    // --- ANALYTICS ENGINE ---
    getAnalytics() {
        const orders = this.getOrders();
        const customers = this.getCustomers();
        const medicines = this.getMedicines();

        // Basic cards
        const totalOrders = orders.length;
        const totalCustomers = customers.length;
        const totalRevenue = Math.round(orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0) * 100) / 100;
        const lowStockCount = medicines.filter(m => m.stock < 5).length;

        // Categories split
        const categories = { Prescription: 0, OTC: 0, Wellness: 0, "Personal Care": 0 };
        orders.forEach(o => {
            if (o.status !== "Cancelled") {
                o.items.forEach(item => {
                    const catName = item.category || "OTC";
                    if (categories[catName] !== undefined) {
                        categories[catName] += item.price * item.quantity;
                    }
                });
            }
        });
        Object.keys(categories).forEach(k => {
            categories[k] = Math.round(categories[k] * 100) / 100;
        });

        // Top medicines (sort by sales)
        const topMedicines = [...medicines]
            .sort((a, b) => (b.sales || 0) - (a.sales || 0))
            .slice(0, 5);

        // Revenue by month
        const monthlyRevenue = {};
        orders.forEach(o => {
            if (o.status !== "Cancelled") {
                const dateObj = new Date(o.date);
                const monthYear = dateObj.toLocaleString("default", { month: "short", year: "numeric" });
                monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + o.total;
            }
        });
        
        // Sort keys chronologically
        const sortedMonths = Object.keys(monthlyRevenue).sort((a, b) => {
            return new Date(a) - new Date(b);
        });
        const monthlyRevenueSorted = {};
        sortedMonths.forEach(m => {
            monthlyRevenueSorted[m] = Math.round(monthlyRevenue[m] * 100) / 100;
        });

        return {
            totalOrders,
            totalCustomers,
            totalRevenue,
            lowStockCount,
            categorySplit: categories,
            topMedicines,
            monthlyRevenue: monthlyRevenueSorted
        };
    },

    // --- EVENT SYSTEM ---
    dispatch(event, detail = null) {
        const customEv = new CustomEvent(event, { detail });
        window.dispatchEvent(customEv);
    }
};

// Auto init on import
CureSyncStore.init();
window.CureSyncStore = CureSyncStore;
