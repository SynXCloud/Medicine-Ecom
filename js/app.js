/**
 * CureSync - Core Application Controller
 * Technology Partner: SynXCloud
 *
 * Directs event listeners, page render loops, modal states, OCR/Voice simulations,
 * and feeds the Chart.js visual analytics dashboards.
 */

const CureSyncApp = {
    // Chart instances references
    charts: {
        revenue: null,
        category: null,
        products: null
    },

    // Current tracking simulation interval reference
    trackingSimulationTimer: null,

    // Define render triggers for router views
    renderers: {
        home: () => CureSyncApp.renderHome(),
        catalog: () => CureSyncApp.renderCatalog(),
        product: (id) => CureSyncApp.renderProductDetail(id),
        prescription: () => CureSyncApp.renderPrescription(),
        cart: () => CureSyncApp.renderCart(),
        checkout: () => CureSyncApp.renderCheckout(),
        dashboard: () => CureSyncApp.renderDashboard(),
        tracking: (orderId) => CureSyncApp.renderTracking(orderId),
        admin: () => CureSyncApp.renderAdmin(),
        "why-digital": () => {} // Pure static text view
    },

    init() {
        // --- GLOBAL TRIGGERS ---
        this.setupThemeToggle();
        this.setupNotifications();
        this.setupSessionUser();
        this.setupGlobalCart();
        this.setupSearchAutocomplete();
        this.setupVoiceSearch();
        this.setupZipChecking();
        this.setupAIRecommendations();
        this.setupPrescriptionPortal();
        
        // --- ADMIN PORTAL CONTROLS ---
        this.setupAdminControls();

        // Start routing
        window.CureSyncRouter.addRoute("home", this.renderers.home);
        window.CureSyncRouter.addRoute("catalog", this.renderers.catalog);
        window.CureSyncRouter.addRoute("product", this.renderers.product);
        window.CureSyncRouter.addRoute("prescription", this.renderers.prescription);
        window.CureSyncRouter.addRoute("cart", this.renderers.cart);
        window.CureSyncRouter.addRoute("checkout", this.renderers.checkout);
        window.CureSyncRouter.addRoute("dashboard", this.renderers.dashboard);
        window.CureSyncRouter.addRoute("tracking", this.renderers.tracking);
        window.CureSyncRouter.addRoute("admin", this.renderers.admin);
        
        window.CureSyncRouter.init();
    },

    // --- LIGHT/DARK THEME CONFIG ---
    setupThemeToggle() {
        const toggleBtn = document.getElementById("theme-toggle");
        const html = document.documentElement;

        const applyTheme = (theme) => {
            html.setAttribute("data-theme", theme);
            html.setAttribute("data-bs-theme", theme);
            if (theme === "dark") {
                toggleBtn.innerHTML = `<i class="fa-solid fa-sun text-warning"></i>`;
            } else {
                toggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
            }
        };

        // Sync initial state
        applyTheme(window.CureSyncStore.getTheme());

        toggleBtn.addEventListener("click", () => {
            const current = window.CureSyncStore.getTheme();
            const next = current === "dark" ? "light" : "dark";
            window.CureSyncStore.setTheme(next);
        });

        window.addEventListener("themeChanged", (e) => {
            applyTheme(e.detail);
        });
    },

    // --- SESSION / CUSTOMER SWITCHING ---
    setupSessionUser() {
        const renderNavbarUser = () => {
            const user = window.CureSyncStore.getCurrentUser();
            if (user) {
                document.getElementById("nav-user-name").textContent = user.name;
                document.getElementById("nav-user-avatar").src = user.avatar;
            }
        };

        const renderCustomerPicker = () => {
            const picker = document.getElementById("demo-customer-picker");
            const customers = window.CureSyncStore.getCustomers();
            
            picker.innerHTML = customers.map(cust => `
                <li>
                    <button class="dropdown-item py-2 small d-flex align-items-center gap-2 btn-switch-customer" data-cust-id="${cust.id}">
                        <img src="${cust.avatar}" class="rounded-circle border" width="24" height="24">
                        <span class="text-truncate" style="max-width:140px;">${cust.name}</span>
                        ${cust.id === window.CureSyncStore.getCurrentUser()?.id ? '<i class="fa-solid fa-check text-success ms-auto"></i>' : ''}
                    </button>
                </li>
            `).join("");

            // Add pick events
            document.querySelectorAll(".btn-switch-customer").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const custId = btn.getAttribute("data-cust-id");
                    const selected = window.CureSyncStore.getCustomerById(custId);
                    if (selected) {
                        window.CureSyncStore.setCurrentUser(selected);
                        this.showToast("Account Switched", `Logged in as ${selected.name} (Loyalty: ${selected.loyaltyPoints} pts)`, "info");
                        // Refresh current view
                        window.CureSyncRouter.handleRoute();
                    }
                });
            });
        };

        renderNavbarUser();
        renderCustomerPicker();

        window.addEventListener("userSessionChanged", () => {
            renderNavbarUser();
            renderCustomerPicker();
        });
    },

    // --- CART STATE MANAGMENT & WHATSAPP SYNC ---
    setupGlobalCart() {
        const updateNavbarCart = () => {
            const cart = window.CureSyncStore.getCart();
            const badge = document.getElementById("cart-badge-count");
            
            let totalItems = 0;
            cart.items.forEach(i => totalItems += i.quantity);

            if (totalItems > 0) {
                badge.textContent = totalItems;
                badge.classList.remove("d-none");
            } else {
                badge.classList.add("d-none");
            }

            // Sync Floating WhatsApp button text message with current cart
            const waBtn = document.getElementById("btn-whatsapp-chat");
            let message = "";
            
            if (cart.items.length > 0) {
                let itemsList = cart.items.map(i => `- ${i.name} (${i.unit}) x${i.quantity} [$${(i.price * i.quantity).toFixed(2)}]`).join("\n");
                message = `Hello CureSync, I would like to order the following medicines from your catalog:\n\n${itemsList}\n\n*Subtotal:* $${cart.subtotal.toFixed(2)}\n*Delivery Fee:* $${cart.deliveryFee.toFixed(2)}\n*Total:* $${cart.total.toFixed(2)}\n\nPlease verify my digital order.`;
            } else {
                message = "Hello CureSync, I have a query regarding my medicine refills.";
            }
            waBtn.href = `https://api.whatsapp.com/send?phone=15553784766&text=${encodeURIComponent(message)}`;
        };

        updateNavbarCart();
        window.addEventListener("cartUpdated", updateNavbarCart);
        window.addEventListener("cartCleared", updateNavbarCart);

        // Delegation listener for "Add to Cart" triggers globally
        document.addEventListener("click", (e) => {
            const btn = e.target.closest(".btn-add-cart-trigger");
            if (btn) {
                const prodId = btn.getAttribute("data-product-id");
                window.CureSyncStore.addToCart(prodId, 1);
            }
        });
    },

    // --- NOTIFICATION & TOAST ENGINE ---
    setupNotifications() {
        const dot = document.getElementById("notif-badge-dot");
        const list = document.getElementById("notif-items-container");

        const updateNotifUI = () => {
            const notifs = window.CureSyncStore.getNotifications();
            const hasUnread = notifs.some(n => n.unread);

            if (hasUnread) {
                dot.classList.remove("d-none");
            } else {
                dot.classList.add("d-none");
            }

            if (notifs.length === 0) {
                list.innerHTML = `<li><span class="dropdown-item text-center text-muted small py-3">No notifications</span></li>`;
                return;
            }

            list.innerHTML = notifs.map(n => {
                const date = new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const icon = n.type === "success" ? "fa-circle-check text-success" : 
                             n.type === "warning" ? "fa-triangle-exclamation text-warning" : 
                             n.type === "danger" ? "fa-circle-exclamation text-danger" : 
                             "fa-circle-info text-info";

                return `
                    <li class="p-2 border-bottom ${n.unread ? 'bg-light-subtle font-weight-bold' : ''}" style="font-size: 0.8rem;">
                        <div class="d-flex align-items-start gap-2">
                            <i class="fa-solid ${icon} mt-1"></i>
                            <div>
                                <div class="fw-semibold text-primary">${n.title}</div>
                                <div class="text-secondary" style="font-size:0.75rem;">${n.message}</div>
                                <span class="text-muted" style="font-size:0.7rem;">${date}</span>
                            </div>
                        </div>
                    </li>
                `;
            }).join("");
        };

        updateNotifUI();

        // Clear triggers
        document.getElementById("btn-clear-notifs").addEventListener("click", (e) => {
            e.stopPropagation();
            window.CureSyncStore.markNotificationsRead();
        });

        window.addEventListener("notificationsUpdated", (e) => {
            updateNotifUI();
            
            // If new notification detail is passed, trigger a browser visual Toast notification!
            if (e.detail) {
                this.showToast(e.detail.title, e.detail.message, e.detail.type);
            }
        });
    },

    showToast(title, message, type = "info") {
        const container = document.getElementById("toast-container");
        const id = `toast-${Date.now()}`;
        
        const typeClasses = {
            "success": "toast-success",
            "warning": "toast-warning",
            "danger": "toast-danger",
            "info": "toast-info"
        };
        const toastTypeClass = typeClasses[type] || "toast-info";

        const iconMap = {
            "success": "fa-circle-check text-success",
            "warning": "fa-triangle-exclamation text-warning",
            "danger": "fa-circle-exclamation text-danger",
            "info": "fa-circle-info text-primary"
        };
        const icon = iconMap[type] || "fa-circle-info text-primary";

        const toastHtml = `
            <div id="${id}" class="custom-toast ${toastTypeClass}">
                <div class="d-flex gap-2">
                    <i class="fa-solid ${icon} fa-lg mt-1"></i>
                    <div>
                        <h6 class="fw-bold mb-1" style="font-size:0.85rem;">${title}</h6>
                        <small class="text-secondary" style="font-size:0.75rem;">${message}</small>
                    </div>
                </div>
                <button type="button" class="btn-close ms-3 small" onclick="document.getElementById('${id}').classList.add('hide'); setTimeout(() => document.getElementById('${id}').remove(), 300)"></button>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", toastHtml);

        // Auto dismiss after 4 seconds
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add("hide");
                setTimeout(() => el.remove(), 300);
            }
        }, 4000);
    },

    // --- AUTOCOMPLETE SEARCH ENGINE ---
    setupSearchAutocomplete() {
        const input = document.getElementById("nav-search-input");
        const dropdown = document.getElementById("autocomplete-results");

        input.addEventListener("input", () => {
            const query = input.value.trim().toLowerCase();
            if (query.length < 2) {
                dropdown.style.display = "none";
                return;
            }

            const medicines = window.CureSyncStore.getMedicines();
            const matches = medicines.filter(m => 
                m.name.toLowerCase().includes(query) || 
                m.brand.toLowerCase().includes(query) || 
                m.category.toLowerCase().includes(query)
            ).slice(0, 5); // Limit 5 suggestions

            if (matches.length === 0) {
                dropdown.innerHTML = `<div class="p-3 text-center text-muted small">No medicines found matching "${input.value}"</div>`;
                dropdown.style.display = "block";
                return;
            }

            dropdown.innerHTML = matches.map(med => `
                <div class="autocomplete-item btn-autocomplete-row" data-product-id="${med.id}">
                    <div class="me-3">
                        ${window.CureSyncComponents.getCategorySVG(med.category, 36)}
                    </div>
                    <div>
                        <div class="fw-bold text-primary small">${med.name}</div>
                        <small class="text-muted" style="font-size:0.75rem;">${med.brand} &bull; $${med.price.toFixed(2)}</small>
                    </div>
                    ${med.rxRequired ? '<span class="badge bg-danger-subtle text-danger ms-auto px-2" style="font-size:0.65rem;">Rx</span>' : ''}
                </div>
            `).join("");

            dropdown.style.display = "block";

            // Click triggers routing
            document.querySelectorAll(".btn-autocomplete-row").forEach(row => {
                row.addEventListener("click", () => {
                    const pid = row.getAttribute("data-product-id");
                    input.value = "";
                    dropdown.style.display = "none";
                    window.CureSyncRouter.navigate(`product/${pid}`);
                });
            });
        });

        // Hide when clicking outside
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".search-container")) {
                dropdown.style.display = "none";
            }
        });
    },

    // --- VOICE SEARCH SIMULATOR ---
    setupVoiceSearch() {
        const btn = document.getElementById("btn-voice-search");
        const stopBtn = document.getElementById("btn-stop-voice");
        const modalEl = document.getElementById("voiceSearchModal");
        const titleEl = document.getElementById("voice-modal-title");
        const descEl = document.getElementById("voice-modal-desc");
        const waveContainer = document.getElementById("voice-waves-container");
        
        let bsModal = null;
        let voiceTimeout = null;

        btn.addEventListener("click", () => {
            if (!bsModal) {
                bsModal = new bootstrap.Modal(modalEl);
            }
            bsModal.show();
            
            // Reset modal states
            titleEl.textContent = "Listening for Medicine...";
            descEl.textContent = "Speak clearly into your device microphone.";
            waveContainer.classList.add("recording");

            // Mock recognition phrases
            const mockPhrases = [
                "Amoxicillin 500mg",
                "Tylenol Extra Strength",
                "Ashwagandha capsules",
                "CeraVe Moisturizing Cream",
                "Albuterol Inhaler"
            ];

            // Simulation loop: 2.5 seconds scanning
            voiceTimeout = setTimeout(() => {
                const picked = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
                titleEl.textContent = `Recognized: "${picked}"`;
                descEl.textContent = "Matching medicine catalog entries...";
                waveContainer.classList.remove("recording");
                
                // Complete simulation after another 1s
                setTimeout(() => {
                    bsModal.hide();
                    const navSearch = document.getElementById("nav-search-input");
                    navSearch.value = picked;
                    // Trigger autocomplete filter manually
                    navSearch.dispatchEvent(new Event("input"));
                }, 1000);
            }, 2500);
        });

        stopBtn.addEventListener("click", () => {
            clearTimeout(voiceTimeout);
            if (bsModal) bsModal.hide();
        });
    },

    // --- COVERAGE AREA CHECKING ---
    setupZipChecking() {
        const input = document.getElementById("delivery-zip-input");
        const btn = document.getElementById("btn-check-zip");
        const result = document.getElementById("zip-check-result");

        btn.addEventListener("click", () => {
            const zip = input.value.trim();
            if (!zip) return;

            // Simple demo check: if zip starts with 100 or 112 (NY) -> Active, else mock warning
            if (/^(100|101|102|112)\d{2}$/.test(zip)) {
                result.className = "fw-semibold text-success mt-2";
                result.innerHTML = `<i class="fa-solid fa-circle-check"></i> Service Active! Express delivery available in ZIP ${zip}.`;
            } else {
                result.className = "fw-semibold text-warning mt-2";
                result.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Standard delivery only. Express slot offline for ZIP ${zip}.`;
            }
        });
    },

    // --- AI RECOMMENDATION ALGORITHMS ---
    setupAIRecommendations() {
        const aiInput = document.getElementById("ai-input");
        const aiBtn = document.getElementById("btn-ai-query");
        const resultContainer = document.getElementById("ai-suggestion-result");
        const list = document.getElementById("ai-suggestions-list");

        aiBtn.addEventListener("click", () => {
            const text = aiInput.value.trim().toLowerCase();
            if (!text) return;

            const medicines = window.CureSyncStore.getMedicines();
            let matches = [];

            if (text.includes("cough") || text.includes("cold") || text.includes("throat")) {
                matches = medicines.filter(m => ["Mucinex DM 600mg", "Robitussin Dry Cough Syrup", "Benadryl Allergy Liqui-Gels"].includes(m.name));
            } else if (text.includes("fever") || text.includes("pain") || text.includes("headache")) {
                matches = medicines.filter(m => ["Paracetamol 500mg", "Tylenol Extra Strength 500mg", "Advil Ibuprofen 200mg", "Aleve Naproxen Sodium 220mg"].includes(m.name));
            } else if (text.includes("allergy") || text.includes("sneez")) {
                matches = medicines.filter(m => ["Claritin Loratadine 10mg", "Zyrtec Cetirizine 10mg", "Allegra Allergy 180mg", "Flonase Sensimist Allergy Spray"].includes(m.name));
            } else if (text.includes("stress") || text.includes("sleep") || text.includes("anxiety")) {
                matches = medicines.filter(m => ["Ashwagandha KSM-66 600mg", "Melatonin 5mg Sleep Gummies", "Magnesium Glycinate 400mg"].includes(m.name));
            } else if (text.includes("skin") || text.includes("dry") || text.includes("cleanser")) {
                matches = medicines.filter(m => ["CeraVe Moisturizing Cream", "Hydro Boost Water Gel", "Gentle Skin Cleanser"].includes(m.name));
            }

            // Fallback general health products if no direct match
            if (matches.length === 0) {
                matches = medicines.filter(m => m.category === "Wellness").slice(0, 3);
            }

            list.innerHTML = matches.map(med => `
                <div class="d-flex align-items-center justify-content-between p-2 border-bottom">
                    <div class="d-flex align-items-center gap-2">
                        ${window.CureSyncComponents.getCategorySVG(med.category, 36)}
                        <div>
                            <div class="fw-bold small text-primary">${med.name}</div>
                            <small class="text-muted" style="font-size:0.75rem;">$${med.price.toFixed(2)} &bull; ${med.brand}</small>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-success rounded-pill btn-add-cart-trigger" data-product-id="${med.id}">Add</button>
                </div>
            `).join("");

            resultContainer.classList.remove("d-none");
        });
    },

    // --- DRAG AND DROP PRESCRIPTION INTEGRATION ---
    setupPrescriptionPortal() {
        const zone = document.getElementById("rx-upload-zone");
        const fileInput = document.getElementById("rx-file-input");
        const previewBox = document.getElementById("rx-preview-container");
        const matchedBox = document.getElementById("rx-matched-items-box");
        const bar = document.getElementById("rx-scan-progress");
        const statusBadge = document.getElementById("rx-status-badge");
        const logOcr = document.getElementById("rx-log-ocr");
        const extractedList = document.getElementById("rx-extracted-list");

        // Drag/Drop visual toggles
        ["dragenter", "dragover"].forEach(eventName => {
            zone.addEventListener(eventName, (e) => {
                e.preventDefault();
                zone.classList.add("dragover");
            }, false);
        });

        ["dragleave", "drop"].forEach(eventName => {
            zone.addEventListener(eventName, (e) => {
                e.preventDefault();
                zone.classList.remove("dragover");
            }, false);
        });

        zone.addEventListener("drop", (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                processRxFile(files[0]);
            }
        });

        fileInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                processRxFile(e.target.files[0]);
            }
        });

        const processRxFile = (file) => {
            // Set filenames and show mock loading state
            document.getElementById("rx-filename").textContent = file.name;
            document.getElementById("rx-preview-img").src = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=200";
            
            previewBox.classList.remove("d-none");
            matchedBox.classList.add("d-none");
            
            bar.style.width = "15%";
            statusBadge.className = "badge bg-warning-subtle text-warning";
            statusBadge.textContent = "Processing File...";
            logOcr.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Running SynXCloud OCR analysis on medical handwriting...`;

            // Timeline simulations
            setTimeout(() => {
                bar.style.width = "50%";
                logOcr.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Handwriting parsed. Extracting medical terms...`;
            }, 1000);

            setTimeout(() => {
                bar.style.width = "100%";
                statusBadge.className = "badge bg-success-subtle text-success";
                statusBadge.textContent = "Analysis Complete";
                logOcr.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> Prescription details validated against drug registry DB.`;
                
                // Show matched items (typically Amoxicillin + Losartan for demo)
                const medicines = window.CureSyncStore.getMedicines();
                const matchedMeds = medicines.filter(m => ["med-rx-01", "med-rx-08"].includes(m.id));

                extractedList.innerHTML = matchedMeds.map(med => `
                    <div class="form-check border p-3 rounded shadow-sm d-flex align-items-center justify-content-between">
                        <div>
                            <input class="form-check-input ms-0 me-3 checkbox-rx-item" type="checkbox" value="${med.id}" id="rx-check-${med.id}" checked>
                            <label class="form-check-label fw-bold text-primary" for="rx-check-${med.id}">${med.name}</label>
                            <span class="badge bg-danger-subtle text-danger ms-2" style="font-size:0.7rem;">Rx</span>
                            <div class="text-secondary small mt-1">${med.brand} &bull; Dosage: 1 daily &bull; ${med.unit}</div>
                        </div>
                        <span class="fs-5 fw-extrabold text-success">$${med.price.toFixed(2)}</span>
                    </div>
                `).join("");

                matchedBox.classList.remove("d-none");
            }, 2500);
        };

        // Add selected items to cart
        document.getElementById("btn-add-rx-cart").addEventListener("click", () => {
            const checkboxes = document.querySelectorAll(".checkbox-rx-item:checked");
            if (checkboxes.length === 0) {
                this.showToast("Selection Empty", "Please check at least one medicine to proceed.", "warning");
                return;
            }

            checkboxes.forEach(box => {
                window.CureSyncStore.addToCart(box.value, 1);
            });

            this.showToast("Items Imported", "Prescription medicines loaded into your active cart.", "success");
            window.CureSyncRouter.navigate("cart");
        });
    },

    // --- HOME PAGE VIEWS RENDERER ---
    renderHome() {
        const grid = document.getElementById("featured-medicines-grid");
        const medicines = window.CureSyncStore.getMedicines();
        
        // Pick top 4 products by sales
        const featured = [...medicines].sort((a,b) => b.sales - a.sales).slice(0, 4);
        grid.innerHTML = featured.map(med => window.CureSyncComponents.renderProductCard(med)).join("");
    },

    // --- CATALOG VIEWS RENDERER ---
    renderCatalog() {
        const grid = document.getElementById("catalog-grid");
        const searchInput = document.getElementById("catalog-search");
        const sortSelect = document.getElementById("catalog-sort");
        const filterStock = document.getElementById("filter-stock-only");
        const filterRx = document.getElementById("filter-rx-only");
        const favBtn = document.getElementById("btn-show-favorites");
        
        let medicines = window.CureSyncStore.getMedicines();
        let currentCategory = window.catalogCategoryFilter || "All";
        let showOnlyFavs = false;

        const performRender = () => {
            let filtered = [...medicines];

            // Category filter
            if (currentCategory !== "All") {
                filtered = filtered.filter(m => m.category === currentCategory);
            }

            // Favorites Filter
            if (showOnlyFavs) {
                const favs = window.CureSyncStore.getFavorites();
                filtered = filtered.filter(m => favs.includes(m.id));
            }

            // Text search
            const query = searchInput.value.trim().toLowerCase();
            if (query) {
                filtered = filtered.filter(m => 
                    m.name.toLowerCase().includes(query) || 
                    m.brand.toLowerCase().includes(query)
                );
            }

            // Stock availability check
            if (filterStock.checked) {
                filtered = filtered.filter(m => m.stock > 0);
            }

            // Rx Filter
            if (filterRx.checked) {
                filtered = filtered.filter(m => !m.rxRequired);
            }

            // Sorting
            const sortVal = sortSelect.value;
            if (sortVal === "price-asc") {
                filtered.sort((a,b) => a.price - b.price);
            } else if (sortVal === "price-desc") {
                filtered.sort((a,b) => b.price - a.price);
            } else if (sortVal === "rating-desc") {
                filtered.sort((a,b) => b.rating - a.rating);
            } else if (sortVal === "name-asc") {
                filtered.sort((a,b) => a.name.localeCompare(b.name));
            } else { // popularity / sales
                filtered.sort((a,b) => b.sales - a.sales);
            }

            // Update Counts in sidebar filters
            document.getElementById("count-all-meds").textContent = medicines.length;
            document.getElementById("count-rx-meds").textContent = medicines.filter(m => m.category === "Prescription").length;
            document.getElementById("count-otc-meds").textContent = medicines.filter(m => m.category === "OTC").length;
            document.getElementById("count-wellness-meds").textContent = medicines.filter(m => m.category === "Wellness").length;
            document.getElementById("count-pc-meds").textContent = medicines.filter(m => m.category === "Personal Care").length;

            if (filtered.length === 0) {
                grid.innerHTML = `<div class="col-12 py-5 text-center text-muted">No medicines match the selected filter criteria.</div>`;
                return;
            }

            grid.innerHTML = filtered.map(m => window.CureSyncComponents.renderProductCard(m)).join("");

            // Setup favorite buttons inside cards
            document.querySelectorAll("#catalog-grid .btn-fav").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const pid = btn.getAttribute("data-product-id");
                    window.CureSyncStore.toggleFavorite(pid);
                    btn.classList.toggle("active");
                    
                    // Re-render if favorites filter is active
                    if (showOnlyFavs) performRender();
                });
            });
        };

        // Sidebar click triggers
        document.querySelectorAll(".filter-cat-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".filter-cat-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentCategory = btn.getAttribute("data-category");
                window.catalogCategoryFilter = currentCategory; // Store globally
                showOnlyFavs = false; // Reset favorites
                favBtn.classList.remove("active");
                performRender();
            });
        });

        // Setup filter button active toggles
        const activeSidebarButton = document.querySelector(`.filter-cat-btn[data-category="${currentCategory}"]`);
        if (activeSidebarButton) {
            document.querySelectorAll(".filter-cat-btn").forEach(b => b.classList.remove("active"));
            activeSidebarButton.classList.add("active");
        }

        // Favorites filter button
        favBtn.addEventListener("click", () => {
            showOnlyFavs = !showOnlyFavs;
            favBtn.classList.toggle("active");
            performRender();
        });

        // Search & change listeners
        searchInput.addEventListener("input", performRender);
        sortSelect.addEventListener("change", performRender);
        filterStock.addEventListener("change", performRender);
        filterRx.addEventListener("change", performRender);

        performRender();
    },

    // --- PRODUCT DETAILS PAGE VIEW ---
    renderProductDetail(id) {
        const container = document.getElementById("product-detail-container");
        const med = window.CureSyncStore.getMedicineById(id);

        if (!med) {
            container.innerHTML = `<div class="col-12 py-5 text-center text-muted">Medicine not found in catalog.</div>`;
            return;
        }

        container.innerHTML = window.CureSyncComponents.renderProductDetail(med);

        // Quantity controls
        const qtyInput = document.getElementById("detail-qty");
        const decBtn = document.getElementById("btn-qty-dec");
        const incBtn = document.getElementById("btn-qty-inc");

        if (qtyInput) {
            decBtn.addEventListener("click", () => {
                const val = parseInt(qtyInput.value) || 1;
                if (val > 1) qtyInput.value = val - 1;
            });
            incBtn.addEventListener("click", () => {
                const val = parseInt(qtyInput.value) || 1;
                if (val < med.stock) qtyInput.value = val + 1;
            });
        }

        // Add to cart click
        const addBtn = document.getElementById("btn-detail-add-cart");
        if (addBtn) {
            addBtn.addEventListener("click", () => {
                const qty = parseInt(qtyInput.value) || 1;
                window.CureSyncStore.addToCart(med.id, qty);
            });
        }

        // Favorite Toggle
        const favBtn = container.querySelector(".btn-fav");
        favBtn.addEventListener("click", () => {
            window.CureSyncStore.toggleFavorite(med.id);
            favBtn.classList.toggle("active");
        });

        // Render Related Products
        const relatedGrid = document.getElementById("related-medicines-grid");
        const allMeds = window.CureSyncStore.getMedicines();
        const related = allMeds
            .filter(m => m.category === med.category && m.id !== med.id)
            .slice(0, 3);

        relatedGrid.innerHTML = related.map(m => window.CureSyncComponents.renderProductCard(m)).join("");
    },

    // --- SHOPPING CART VIEW ---
    renderCart() {
        const container = document.getElementById("cart-outer-container");
        const cart = window.CureSyncStore.getCart();

        if (cart.items.length === 0) {
            container.innerHTML = `
                <div class="col-12 py-5 text-center">
                    <i class="fa-solid fa-basket-shopping text-muted mb-4" style="font-size: 5rem;"></i>
                    <h3 class="fw-bold">Your Cart is Empty</h3>
                    <p class="text-secondary">Explore our pharmacy catalog to add items.</p>
                    <a href="#catalog" class="btn btn-primary rounded-pill px-4 py-2 mt-3">Continue Shopping</a>
                </div>
            `;
            return;
        }

        // Generate items list + summaries
        let itemsHtml = cart.items.map(i => window.CureSyncComponents.renderCartItem(i)).join("");

        container.innerHTML = `
            <div class="col-lg-8">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold mb-0">Cart Items (${cart.items.length})</h5>
                    <button class="btn btn-sm btn-outline-danger rounded-pill px-3" id="btn-clear-cart-items"><i class="fa-solid fa-trash-can me-1"></i> Clear Cart</button>
                </div>
                ${itemsHtml}
            </div>
            
            <div class="col-lg-4">
                <div class="custom-card p-4 position-sticky" style="top: 100px;">
                    <h4 class="fw-bold mb-4">Cart Summary</h4>
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-secondary">Subtotal</span>
                        <span class="fw-semibold">$${cart.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-secondary">Delivery Fee</span>
                        <span class="fw-semibold">${cart.deliveryFee > 0 ? `$${cart.deliveryFee.toFixed(2)}` : 'FREE'}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2 text-danger ${cart.discount > 0 ? '' : 'd-none'}" id="cart-discount-row">
                        <span>Discount Applied</span>
                        <span class="fw-semibold">-$${cart.discount.toFixed(2)}</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <span class="fw-bold fs-5">Estimated Total</span>
                        <span class="fw-extrabold fs-4 text-success" id="cart-grand-total">$${cart.total.toFixed(2)}</span>
                    </div>

                    <!-- Discount code input -->
                    <div class="input-group mb-4">
                        <input type="text" id="promo-code-input" class="form-control" placeholder="Promo Code (DR20 / WELCOME10)">
                        <button class="btn btn-outline-secondary" type="button" id="btn-apply-promo">Apply</button>
                    </div>

                    <a href="#checkout" class="btn btn-success btn-lg w-100 rounded-pill py-2 shadow-sm">Proceed to Checkout</a>
                </div>
            </div>
        `;

        // Bind items adjustment buttons
        document.querySelectorAll(".btn-cart-qty-inc").forEach(btn => {
            btn.addEventListener("click", () => {
                const pid = btn.getAttribute("data-product-id");
                const item = cart.items.find(i => i.productId === pid);
                if (item) window.CureSyncStore.updateCartQuantity(pid, item.quantity + 1);
                this.renderCart();
            });
        });

        document.querySelectorAll(".btn-cart-qty-dec").forEach(btn => {
            btn.addEventListener("click", () => {
                const pid = btn.getAttribute("data-product-id");
                const item = cart.items.find(i => i.productId === pid);
                if (item) window.CureSyncStore.updateCartQuantity(pid, item.quantity - 1);
                this.renderCart();
            });
        });

        document.querySelectorAll(".btn-cart-remove").forEach(btn => {
            btn.addEventListener("click", () => {
                const pid = btn.getAttribute("data-product-id");
                window.CureSyncStore.removeFromCart(pid);
                this.renderCart();
            });
        });

        document.getElementById("btn-clear-cart-items").addEventListener("click", () => {
            window.CureSyncStore.clearCart();
            this.renderCart();
        });

        // Apply promo code event
        document.getElementById("btn-apply-promo").addEventListener("click", () => {
            const code = document.getElementById("promo-code-input").value.trim().toUpperCase();
            const result = window.CureSyncStore.applyDiscountCode(code);
            
            if (result.success) {
                this.showToast("Promo Applied", result.message, "success");
            } else {
                this.showToast("Promo Failed", result.message, "danger");
            }
            this.renderCart();
        });
    },

    // --- CHECKOUT VIEW PAGE RENDER ---
    renderCheckout() {
        const cart = window.CureSyncStore.getCart();
        const user = window.CureSyncStore.getCurrentUser();

        if (cart.items.length === 0) {
            window.CureSyncRouter.navigate("cart");
            return;
        }

        // Populate Summary details
        document.getElementById("checkout-subtotal").textContent = `$${cart.subtotal.toFixed(2)}`;
        document.getElementById("checkout-delivery").textContent = cart.deliveryFee > 0 ? `$${cart.deliveryFee.toFixed(2)}` : "FREE";
        
        if (cart.discount > 0) {
            document.getElementById("checkout-discount").textContent = `-$${cart.discount.toFixed(2)}`;
            document.getElementById("checkout-discount-row").classList.remove("d-none");
        } else {
            document.getElementById("checkout-discount-row").classList.add("d-none");
        }

        document.getElementById("checkout-total").textContent = `$${cart.total.toFixed(2)}`;
        document.getElementById("checkout-points").textContent = cart.loyaltyPointsEarned;

        // Render mini items list in summary
        document.getElementById("checkout-summary-items").innerHTML = cart.items.map(item => `
            <div class="d-flex justify-content-between align-items-center mb-2 small text-secondary">
                <span class="text-truncate" style="max-width:250px;">${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join("");

        // Check if Rx items are inside checkout cart
        const containsRx = cart.items.some(i => i.rxRequired);
        const rxWarning = document.getElementById("checkout-rx-warning");
        if (containsRx) {
            rxWarning.classList.remove("d-none");
        } else {
            rxWarning.classList.add("d-none");
        }

        // Prepopulate contact details from currentUser
        if (user) {
            document.getElementById("checkout-name").value = user.name;
            document.getElementById("checkout-phone").value = user.phone;
            document.getElementById("checkout-email").value = user.email;

            // Simple split of Address: "123 St, City, State ZIP"
            const addrParts = user.address.split(", ");
            if (addrParts.length >= 3) {
                document.getElementById("checkout-address").value = addrParts[0];
                document.getElementById("checkout-city").value = addrParts[1];
                
                // Extract zip code
                const zipParts = addrParts[2].split(" ");
                if (zipParts.length >= 2) {
                    document.getElementById("checkout-zip").value = zipParts[1];
                }
            }
        }

        // Submit form placing order
        const checkoutForm = document.getElementById("checkout-form");
        
        // Remove previous listeners
        const newForm = checkoutForm.cloneNode(true);
        checkoutForm.parentNode.replaceChild(newForm, checkoutForm);

        newForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const shipping = {
                fullName: document.getElementById("checkout-name").value.trim(),
                phone: document.getElementById("checkout-phone").value.trim(),
                email: document.getElementById("checkout-email").value.trim(),
                address: document.getElementById("checkout-address").value.trim(),
                city: document.getElementById("checkout-city").value.trim(),
                zip: document.getElementById("checkout-zip").value.trim(),
                deliverySlot: document.querySelector("input[name=delivery-slot]:checked").value
            };

            const payMethod = document.querySelector("input[name=payment-method]:checked").value;
            
            // Mock prescription validation image
            let rxMockUrl = null;
            if (containsRx) {
                rxMockUrl = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600";
            }

            const orderPlaced = window.CureSyncStore.checkoutCart(shipping, payMethod, rxMockUrl);
            if (orderPlaced) {
                // Route to tracking page for this order!
                window.CureSyncRouter.navigate(`tracking/${orderPlaced.id}`);
            }
        });
    },

    // --- CUSTOMER DASHBOARD VIEWS RENDERER ---
    renderDashboard() {
        const user = window.CureSyncStore.getCurrentUser();
        if (!user) return;

        // Render Info
        document.getElementById("dash-avatar").src = user.avatar;
        document.getElementById("dash-user-name").textContent = user.name;
        document.getElementById("dash-user-email").textContent = user.email;
        document.getElementById("dash-phone").textContent = user.phone;
        document.getElementById("dash-address").textContent = user.address;
        
        // Loyalty cash equivalence (1 point = $0.05 store discount credit)
        document.getElementById("dash-loyalty-points").textContent = user.loyaltyPoints;
        document.getElementById("dash-loyalty-cash").textContent = (user.loyaltyPoints * 0.05).toFixed(2);

        // Fetch User's Orders
        const orders = window.CureSyncStore.getOrders();
        const userOrders = orders.filter(o => o.customerId === user.id);

        const list = document.getElementById("dash-orders-list");
        if (userOrders.length === 0) {
            list.innerHTML = `<div class="py-4 text-center text-muted">No previous orders on record.</div>`;
        } else {
            list.innerHTML = userOrders.map(o => window.CureSyncComponents.renderOrderRow(o)).join("");
        }

        // Render Stored Prescriptions (Orders containing prescriptions)
        const rxList = document.getElementById("dash-rx-list");
        const rxOrders = userOrders.filter(o => o.prescriptionUrl);
        
        if (rxOrders.length === 0) {
            rxList.innerHTML = `<div class="col-12 py-4 text-center text-muted">No prescriptions saved.</div>`;
        } else {
            rxList.innerHTML = rxOrders.map(o => `
                <div class="col-md-6">
                    <div class="custom-card p-3 shadow-sm border border-color">
                        <div class="d-flex align-items-center gap-3">
                            <img src="${o.prescriptionUrl}" class="rounded border" width="64" height="64" style="object-fit:cover;">
                            <div>
                                <h6 class="fw-bold mb-1">Upload for Order ${o.id}</h6>
                                <small class="text-muted d-block">${new Date(o.date).toLocaleDateString()}</small>
                                <a href="${o.prescriptionUrl}" target="_blank" class="small text-decoration-none text-primary"><i class="fa-solid fa-arrow-up-right-from-square me-1"></i> View Document</a>
                            </div>
                        </div>
                    </div>
                </div>
            `).join("");
        }

        // Edit Profile Trigger (MOCK details swap)
        const editBtn = document.getElementById("btn-edit-profile-mock");
        // Remove previous listeners
        const newBtn = editBtn.cloneNode(true);
        editBtn.parentNode.replaceChild(newBtn, editBtn);
        
        newBtn.addEventListener("click", () => {
            const promptName = prompt("Enter New Account Name:", user.name);
            if (promptName) {
                user.name = promptName;
                window.CureSyncStore.saveCustomer(user);
                this.showToast("Account Updated", "Customer profile detail modified successfully.", "success");
                this.renderDashboard();
            }
        });
    },

    // --- TIMELINE TRACKER PAGE RENDERER ---
    renderTracking(orderId) {
        // Clear previous simulation timer
        if (this.trackingSimulationTimer) {
            clearInterval(this.trackingSimulationTimer);
            this.trackingSimulationTimer = null;
        }

        const order = window.CureSyncStore.getOrderById(orderId);
        if (!order) {
            document.getElementById("tracking-order-id").textContent = "ORDER NOT FOUND";
            return;
        }

        document.getElementById("tracking-order-id").textContent = order.id;
        document.getElementById("tracking-status-badge").textContent = order.status;
        document.getElementById("tracking-est-text").textContent = order.deliverySlot || "Express Delivery (Within 2 Hours)";

        // Set list items
        document.getElementById("tracking-items-list").innerHTML = order.items.map(item => `
            <div class="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                <div>
                    <span class="fw-bold text-primary">${item.name}</span>
                    <small class="text-muted d-block">${item.category} &bull; Qty: ${item.quantity}</small>
                </div>
                <span class="fw-bold text-success">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join("");

        // Highlight timeline steps
        const statuses = ["Ordered", "Verified", "Packed", "Out for Delivery", "Delivered"];
        const currentIndex = statuses.indexOf(order.status);

        const updateTimelineUI = (statusIndex) => {
            // Update badge
            document.getElementById("tracking-status-badge").textContent = statuses[statusIndex];

            // Progress bar mapping
            const bar = document.getElementById("tracking-bar");
            // Check viewport layout direction: standard is horizontal width, mobile is vertical height
            if (window.innerWidth <= 768) {
                bar.style.width = "4px";
                bar.style.height = `${(statusIndex / 4) * 100}%`;
            } else {
                bar.style.height = "4px";
                bar.style.width = `${(statusIndex / 4) * 90}%`; // Cap offset matches alignment margin
            }

            statuses.forEach((st, idx) => {
                const elId = `step-${st.replace(/\s+/g, '-')}`;
                const stepEl = document.getElementById(elId);
                
                if (stepEl) {
                    stepEl.classList.remove("active", "completed");
                    
                    if (idx < statusIndex) {
                        stepEl.classList.add("completed");
                    } else if (idx === statusIndex) {
                        stepEl.classList.add("active");
                    }
                }
            });
        };

        if (currentIndex > -1) {
            updateTimelineUI(currentIndex);
        }

        // REPEAT ORDER TRIGGER
        const repeatBtn = document.getElementById("btn-tracking-reorder");
        const newRepeatBtn = repeatBtn.cloneNode(true);
        repeatBtn.parentNode.replaceChild(newRepeatBtn, repeatBtn);

        newRepeatBtn.addEventListener("click", () => {
            order.items.forEach(i => {
                window.CureSyncStore.addToCart(i.productId, i.quantity);
            });
            this.showToast("Refill Loaded", "Items from order duplicated into cart.", "success");
            window.CureSyncRouter.navigate("cart");
        });

        // SIMULATION: If order is in "Ordered" status, auto progress stages to demonstrate dashboard updating!
        if (order.status === "Ordered") {
            let tempIndex = 0;
            this.showToast("Tracking Simulation", "Demo: Watch the order transition stages in real-time.", "info");

            this.trackingSimulationTimer = setInterval(() => {
                tempIndex++;
                if (tempIndex < statuses.length) {
                    window.CureSyncStore.updateOrderStatus(order.id, statuses[tempIndex]);
                    updateTimelineUI(tempIndex);
                } else {
                    clearInterval(this.trackingSimulationTimer);
                }
            }, 6000); // Progress stage every 6 seconds for high impact demo
        }
    },

    // --- ADMIN CRM / ANALYTICS CONTROLLER ---
    setupAdminControls() {
        // Handle Sidebar Tab switching
        const links = document.querySelectorAll(".admin-nav-link");
        const panels = document.querySelectorAll(".admin-panel-view");

        links.forEach(link => {
            link.addEventListener("click", () => {
                links.forEach(l => l.classList.remove("active"));
                link.classList.add("active");

                const targetPanel = link.getAttribute("data-admin-panel");
                
                panels.forEach(p => {
                    if (p.id === `admin-${targetPanel}`) {
                        p.classList.remove("d-none");
                        p.classList.add("active-panel");
                    } else {
                        p.classList.add("d-none");
                        p.classList.remove("active-panel");
                    }
                });

                // If Analytics Panel triggered, load Chart.js canvases
                if (targetPanel === "analytics-panel") {
                    setTimeout(() => CureSyncApp.renderAnalyticsCharts(), 100);
                }
            });
        });

        // Add Medicine Form controller
        document.getElementById("admin-add-med-form").addEventListener("submit", () => {
            const id = document.getElementById("form-med-id").value || `med-${Date.now()}`;
            const name = document.getElementById("form-med-name").value.trim();
            const brand = document.getElementById("form-med-brand").value.trim();
            const category = document.getElementById("form-med-category").value;
            const price = parseFloat(document.getElementById("form-med-price").value) || 0;
            const stock = parseInt(document.getElementById("form-med-stock").value) || 0;
            const unit = document.getElementById("form-med-unit").value.trim();
            const rxRequired = document.getElementById("form-med-rx").checked;
            const description = document.getElementById("form-med-desc").value.trim();

            const newMed = {
                id, name, brand, category, price, stock, unit, rxRequired,
                description: description || "No detailed description provided.",
                usage: "Follow packaging instructions or direct orders of medical professional.",
                sideEffects: "Consult doctor if unusual reactions occur.",
                rating: 4.5,
                sales: 0
            };

            window.CureSyncStore.saveMedicine(newMed);
            
            // Hide modal
            const modalEl = document.getElementById("addMedModal");
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();

            this.showToast("Catalog Saved", `Medicine "${name}" saved to directory.`, "success");
            this.renderAdmin(); // Re-render tables
        });

        // Simulate order seeding from Admin dashboard
        document.getElementById("btn-seed-new-order").addEventListener("click", () => {
            const customers = window.CureSyncStore.getCustomers();
            const medicines = window.CureSyncStore.getMedicines();
            
            if (customers.length === 0 || medicines.length === 0) return;

            const randomCust = customers[Math.floor(Math.random() * customers.length)];
            const randomMed = medicines[Math.floor(Math.random() * medicines.length)];
            
            // Perform simulated checkout
            const ship = {
                fullName: randomCust.name,
                phone: randomCust.phone,
                email: randomCust.email,
                address: randomCust.address.split(", ")[0] || "101 Doctor Row",
                city: "New York",
                zip: "10001",
                deliverySlot: "Express (Within 2 Hours)"
            };

            // Set cart mock items
            const cart = window.CureSyncStore.getCart();
            cart.items = [{
                productId: randomMed.id,
                name: randomMed.name,
                brand: randomMed.brand,
                category: randomMed.category,
                price: randomMed.price,
                quantity: 1,
                unit: randomMed.unit,
                rxRequired: randomMed.rxRequired
            }];
            window.CureSyncStore.calculateCart(cart);

            const seededOrder = window.CureSyncStore.checkoutCart(ship, "Credit Card", randomMed.rxRequired ? "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600" : null);
            if (seededOrder) {
                this.showToast("Simulation Ingestion", `New Guest Order ${seededOrder.id} placed by ${seededOrder.customerName}.`, "success");
                this.renderAdmin();
            }
        });
    },

    renderAdmin() {
        const orders = window.CureSyncStore.getOrders();
        const customers = window.CureSyncStore.getCustomers();
        const medicines = window.CureSyncStore.getMedicines();

        const stats = window.CureSyncStore.getAnalytics();

        // 1. Render KPIs
        document.getElementById("kpi-revenue").textContent = `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
        document.getElementById("kpi-orders").textContent = stats.totalOrders;
        document.getElementById("kpi-customers").textContent = stats.totalCustomers;
        document.getElementById("kpi-low-stock").textContent = stats.lowStockCount;

        // 2. Render Recent Orders (dashboard panel)
        const recent = orders.slice(0, 5);
        document.getElementById("admin-recent-orders").innerHTML = recent.map(o => `
            <tr>
                <td class="fw-bold">${o.id}</td>
                <td>${o.customerName}</td>
                <td class="fw-semibold text-success">$${o.total.toFixed(2)}</td>
                <td><span class="badge bg-secondary-subtle text-secondary border">${o.status}</span></td>
                <td><a href="#tracking/${o.id}" class="btn btn-sm btn-outline-primary rounded-pill px-2 py-0"><i class="fa-solid fa-magnifying-glass"></i></a></td>
            </tr>
        `).join("");

        // 3. Render full Orders list manager
        document.getElementById("admin-full-orders-list").innerHTML = orders.map(o => window.CureSyncComponents.renderAdminOrderRow(o)).join("");

        // Bind status selectors in Orders Manager
        document.querySelectorAll(".select-status-trigger").forEach(select => {
            select.addEventListener("change", (e) => {
                const oid = select.getAttribute("data-order-id");
                const nextStatus = select.value;
                window.CureSyncStore.updateOrderStatus(oid, nextStatus);
                
                // Update text indicator badge next to select row
                const badge = document.getElementById(`admin-status-badge-${oid}`);
                if (badge) badge.textContent = nextStatus;

                this.showToast("Status Synchronized", `Order ${oid} set to ${nextStatus}.`, "success");
            });
        });

        // 4. Render Inventory lists table
        document.getElementById("admin-inventory-list").innerHTML = medicines.map(m => window.CureSyncComponents.renderAdminMedicineRow(m)).join("");

        // Bind Edit buttons
        document.querySelectorAll(".btn-edit-med-trigger").forEach(btn => {
            btn.addEventListener("click", () => {
                const pid = btn.getAttribute("data-product-id");
                const med = window.CureSyncStore.getMedicineById(pid);
                
                if (med) {
                    document.getElementById("addMedModalLabel").textContent = "Edit Catalog Item";
                    document.getElementById("form-med-id").value = med.id;
                    document.getElementById("form-med-name").value = med.name;
                    document.getElementById("form-med-brand").value = med.brand;
                    document.getElementById("form-med-category").value = med.category;
                    document.getElementById("form-med-price").value = med.price;
                    document.getElementById("form-med-stock").value = med.stock;
                    document.getElementById("form-med-unit").value = med.unit;
                    document.getElementById("form-med-rx").checked = med.rxRequired;
                    document.getElementById("form-med-desc").value = med.description;
                }
            });
        });

        // Clean Add modal form when closing or opening empty
        document.getElementById("addMedModal").addEventListener("hide.bs.modal", () => {
            document.getElementById("addMedModalLabel").textContent = "Add New Medicine";
            document.getElementById("form-med-id").value = "";
            document.getElementById("admin-add-med-form").reset();
        });

        // Bind Delete buttons
        document.querySelectorAll(".btn-delete-med-trigger").forEach(btn => {
            btn.addEventListener("click", () => {
                const pid = btn.getAttribute("data-product-id");
                const med = window.CureSyncStore.getMedicineById(pid);
                
                if (med && confirm(`Are you sure you want to remove ${med.name} from the catalog?`)) {
                    window.CureSyncStore.deleteMedicine(pid);
                    document.getElementById(`admin-inv-row-${pid}`).remove();
                    this.showToast("Product Deleted", "Removed medicine catalog registry.", "warning");
                }
            });
        });

        // 5. Render customer CRM list
        document.getElementById("admin-customer-crm-list").innerHTML = customers.map(c => window.CureSyncComponents.renderAdminCustomerRow(c)).join("");
    },

    // --- CHARTJS VISUAL TRENDS GRAPHICS ---
    renderAnalyticsCharts() {
        const stats = window.CureSyncStore.getAnalytics();

        // Theme check: adjust colors for dark mode text grid lines
        const isDark = window.CureSyncStore.getTheme() === "dark";
        const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
        const textColor = isDark ? "#94a3b8" : "#475569";

        // Chart 1: Revenue Line Graph
        const revCtx = document.getElementById("chart-revenue").getContext("2d");
        if (this.charts.revenue) this.charts.revenue.destroy();
        
        const revMonths = Object.keys(stats.monthlyRevenue);
        const revData = Object.values(stats.monthlyRevenue);

        this.charts.revenue = new Chart(revCtx, {
            type: "line",
            data: {
                labels: revMonths,
                datasets: [{
                    label: "Monthly Net Revenue ($)",
                    data: revData,
                    borderColor: "#0284c7",
                    backgroundColor: "rgba(2, 132, 199, 0.1)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: textColor } }
                },
                scales: {
                    x: { grid: { color: gridColor }, ticks: { color: textColor } },
                    y: { grid: { color: gridColor }, ticks: { color: textColor } }
                }
            }
        });

        // Chart 2: Category Pie Split
        const catCtx = document.getElementById("chart-category").getContext("2d");
        if (this.charts.category) this.charts.category.destroy();

        const catLabels = Object.keys(stats.categorySplit);
        const catData = Object.values(stats.categorySplit);

        this.charts.category = new Chart(catCtx, {
            type: "doughnut",
            data: {
                labels: catLabels,
                datasets: [{
                    data: catData,
                    backgroundColor: ["#ef4444", "#0284c7", "#10b981", "#a855f7"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "right", labels: { color: textColor } }
                }
            }
        });

        // Chart 3: Top Selling products
        const prodCtx = document.getElementById("chart-products").getContext("2d");
        if (this.charts.products) this.charts.products.destroy();

        const prodLabels = stats.topMedicines.map(m => m.name);
        const prodSales = stats.topMedicines.map(m => m.sales || 0);

        this.charts.products = new Chart(prodCtx, {
            type: "bar",
            data: {
                labels: prodLabels,
                datasets: [{
                    label: "Total Units Sold",
                    data: prodSales,
                    backgroundColor: "#10b981",
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: textColor } },
                    y: { grid: { color: gridColor }, ticks: { color: textColor } }
                }
            }
        });
    }
};

// Start script on load
window.addEventListener("DOMContentLoaded", () => {
    CureSyncApp.init();
    window.CureSyncApp = CureSyncApp;
});
