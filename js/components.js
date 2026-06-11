/**
 * CureSync - Reusable HTML Components & Renderers
 * Technology Partner: SynXCloud
 *
 * Contains functions that return structured HTML strings and SVG icons
 * for dynamic client-side rendering.
 */

const CureSyncComponents = {
    // --- SVG ILLUSTRATION GENERATORS ---
    // Returns inline responsive SVG based on category type
    getCategorySVG(category, size = 64) {
        const colors = {
            "Prescription": { primary: "var(--danger-color)", bg: "rgba(239, 68, 68, 0.08)" },
            "OTC": { primary: "var(--primary-color)", bg: "rgba(2, 132, 199, 0.08)" },
            "Wellness": { primary: "var(--secondary-color)", bg: "rgba(16, 185, 129, 0.08)" },
            "Personal Care": { primary: "#a855f7", bg: "rgba(168, 85, 247, 0.08)" }
        };

        const themeColor = colors[category] || colors["OTC"];

        let svgContent = "";
        if (category === "Prescription") {
            // Medicine bottle with prescription symbol
            svgContent = `
                <rect x="22" y="24" width="20" height="32" rx="4" fill="none" stroke="${themeColor.primary}" stroke-width="2.5"/>
                <path d="M26 14 H38" stroke="${themeColor.primary}" stroke-width="2.5" stroke-linecap="round"/>
                <rect x="29" y="17" width="6" height="7" fill="${themeColor.primary}"/>
                <line x1="32" y1="34" x2="32" y2="44" stroke="${themeColor.primary}" stroke-width="2.5" stroke-linecap="round"/>
                <line x1="27" y1="39" x2="37" y2="39" stroke="${themeColor.primary}" stroke-width="2.5" stroke-linecap="round"/>
            `;
        } else if (category === "OTC") {
            // Blister pack / pills
            svgContent = `
                <rect x="18" y="16" width="28" height="36" rx="6" fill="none" stroke="${themeColor.primary}" stroke-width="2.5"/>
                <rect x="24" y="22" width="6" height="6" rx="3" fill="${themeColor.primary}"/>
                <rect x="34" y="22" width="6" height="6" rx="3" fill="${themeColor.primary}"/>
                <rect x="24" y="32" width="6" height="6" rx="3" fill="${themeColor.primary}"/>
                <rect x="34" y="32" width="6" height="6" rx="3" fill="${themeColor.primary}"/>
                <rect x="24" y="42" width="6" height="6" rx="3" fill="${themeColor.primary}"/>
                <rect x="34" y="42" width="6" height="6" rx="3" fill="${themeColor.primary}"/>
            `;
        } else if (category === "Wellness") {
            // Herb / leaf / vitamin container
            svgContent = `
                <path d="M32 14 C42 14 46 22 46 32 C46 42 38 48 32 48 C26 48 18 42 18 32 C18 22 22 14 32 14 Z" fill="none" stroke="${themeColor.primary}" stroke-width="2.5"/>
                <path d="M32 20 C32 20 37 26 32 34 C27 26 32 20 32 20 Z" fill="${themeColor.primary}"/>
                <path d="M32 30 C32 30 40 34 32 42 C24 34 32 30 32 30 Z" fill="${themeColor.primary}" opacity="0.6"/>
            `;
        } else {
            // Personal Care - Soap Pump Bottle
            svgContent = `
                <rect x="22" y="26" width="20" height="26" rx="5" fill="none" stroke="${themeColor.primary}" stroke-width="2.5"/>
                <path d="M32 16 V26" stroke="${themeColor.primary}" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M32 16 H24" stroke="${themeColor.primary}" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M32 20 H38" stroke="${themeColor.primary}" stroke-width="2.5" stroke-linecap="round"/>
            `;
        }

        return `
            <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="background: ${themeColor.bg}; border-radius: 12px; padding: 10px;">
                ${svgContent}
            </svg>
        `;
    },

    // --- MEDICINE CARD ---
    renderProductCard(med) {
        const isFav = CureSyncStore.isFavorite(med.id);
        const rxBadge = med.rxRequired ? 
            `<span class="badge-rx mb-2 d-inline-block"><i class="fa-solid fa-file-prescription me-1"></i> Rx Required</span>` :
            `<span class="badge-otc mb-2 d-inline-block"><i class="fa-solid fa-circle-check me-1"></i> OTC</span>`;

        const stockWarning = med.stock <= 0 ? 
            `<span class="text-danger small fw-semibold"><i class="fa-solid fa-triangle-exclamation me-1"></i> Out of Stock</span>` :
            med.stock < 5 ? 
            `<span class="text-warning small fw-semibold"><i class="fa-solid fa-triangle-exclamation me-1"></i> Only ${med.stock} left</span>` :
            `<span class="text-success small"><i class="fa-solid fa-check me-1"></i> In Stock (${med.stock})</span>`;

        const cartBtn = med.stock <= 0 ?
            `<button class="btn btn-secondary w-100 rounded-pill py-2 small" disabled>Out of Stock</button>` :
            `<button class="btn btn-primary w-100 rounded-pill py-2 small btn-add-cart-trigger" data-product-id="${med.id}"><i class="fa-solid fa-cart-shopping me-1"></i> Add to Cart</button>`;

        return `
            <div class="col-md-4 col-sm-6 catalog-card-item" data-category="${med.category}" data-med-name="${med.name.toLowerCase()}">
                <div class="custom-card p-3 h-100 d-flex flex-column justify-content-between">
                    <div>
                        <!-- Card Header details -->
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            ${rxBadge}
                            <button class="btn btn-link btn-fav p-0 ${isFav ? 'active' : ''}" data-product-id="${med.id}">
                                <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart fa-lg"></i>
                            </button>
                        </div>
                        
                        <!-- Card Image / SVG -->
                        <div class="text-center my-3">
                            <a href="#product/${med.id}">
                                ${this.getCategorySVG(med.category, 80)}
                            </a>
                        </div>
 
                        <!-- Card Body -->
                        <a href="#product/${med.id}" class="text-decoration-none text-primary">
                            <h6 class="fw-bold mb-1 mt-2 text-truncate">${med.name}</h6>
                        </a>
                        <small class="text-muted d-block mb-1">${med.brand} &bull; ${med.unit}</small>
                        <div class="mb-3">
                            ${stockWarning}
                        </div>
                    </div>
                    
                    <!-- Card Footer (Price + Add to Cart) -->
                    <div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <span class="fs-5 fw-extrabold text-success">$${med.price.toFixed(2)}</span>
                            </div>
                            <div class="text-warning small">
                                <i class="fa-solid fa-star"></i> <span class="fw-semibold">${med.rating}</span>
                            </div>
                        </div>
                        ${cartBtn}
                    </div>
                </div>
            </div>
        `;
    },

    // --- DETAILED MEDICINE VIEW ---
    renderProductDetail(med) {
        const isFav = CureSyncStore.isFavorite(med.id);
        const rxBadge = med.rxRequired ? 
            `<span class="badge bg-danger px-3 py-2 rounded-pill fw-semibold"><i class="fa-solid fa-file-prescription me-1"></i> Prescription Required</span>` :
            `<span class="badge bg-primary px-3 py-2 rounded-pill fw-semibold"><i class="fa-solid fa-circle-check me-1"></i> Over the Counter (OTC)</span>`;

        const stockWarning = med.stock <= 0 ? 
            `<span class="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill"><i class="fa-solid fa-triangle-exclamation me-1"></i> Out of Stock</span>` :
            med.stock < 5 ? 
            `<span class="badge bg-warning-subtle text-warning px-3 py-2 rounded-pill"><i class="fa-solid fa-triangle-exclamation me-1"></i> Low Stock (Only ${med.stock} left)</span>` :
            `<span class="badge bg-success-subtle text-success px-3 py-2 rounded-pill"><i class="fa-solid fa-check me-1"></i> In Stock (${med.stock} units available)</span>`;

        const actionBtn = med.stock <= 0 ?
            `<button class="btn btn-secondary btn-lg rounded-pill px-5" disabled>Out of Stock</button>` :
            `<div class="d-flex align-items-center gap-3">
                <div class="input-group" style="max-width: 130px;">
                    <button class="btn btn-outline-secondary" type="button" id="btn-qty-dec">-</button>
                    <input type="number" class="form-control text-center fw-bold" id="detail-qty" value="1" min="1" max="${med.stock}">
                    <button class="btn btn-outline-secondary" type="button" id="btn-qty-inc">+</button>
                </div>
                <button class="btn btn-primary btn-lg rounded-pill px-5 shadow-sm" id="btn-detail-add-cart" data-product-id="${med.id}">
                    <i class="fa-solid fa-cart-shopping me-2"></i> Add to Cart
                </button>
            </div>`;

        return `
            <div class="col-md-5 text-center">
                <div class="p-5 custom-card bg-surface d-flex align-items-center justify-content-center" style="min-height: 350px; border-radius: 24px;">
                    ${this.getCategorySVG(med.category, 160)}
                </div>
            </div>
            <div class="col-md-7">
                <div class="d-flex flex-wrap gap-2 mb-3">
                    ${rxBadge}
                    ${stockWarning}
                </div>
                
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h1 class="display-6 fw-extrabold mb-1">${med.name}</h1>
                        <p class="text-secondary fs-5 mb-0">${med.brand} &bull; ${med.unit}</p>
                    </div>
                    <button class="btn btn-link btn-fav p-0 ${isFav ? 'active' : ''} fs-3" data-product-id="${med.id}">
                        <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                </div>
                
                <div class="d-flex align-items-center gap-2 my-3">
                    <div class="text-warning">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star-half-stroke"></i>
                    </div>
                    <span class="fw-semibold text-secondary">${med.rating} / 5.0</span>
                    <span class="text-muted">(${med.sales} orders placed)</span>
                </div>

                <div class="my-4">
                    <span class="display-5 fw-extrabold text-success">$${med.price.toFixed(2)}</span>
                </div>

                <hr class="my-4">

                <h5 class="fw-bold mb-2">Product Description</h5>
                <p class="text-secondary mb-4">${med.description}</p>

                <h5 class="fw-bold mb-2">Usage & Dosage</h5>
                <p class="text-secondary mb-4">${med.usage}</p>

                <h5 class="fw-bold mb-2">Side Effects</h5>
                <p class="text-secondary mb-4">${med.sideEffects}</p>

                <hr class="my-4">

                ${actionBtn}
            </div>
        `;
    },

    // --- CART ITEM ROW ---
    renderCartItem(item) {
        return `
            <div class="custom-card p-3 mb-3" data-cart-item-id="${item.productId}">
                <div class="row align-items-center g-3">
                    <div class="col-md-2 col-4 text-center text-md-start">
                        ${this.getCategorySVG(item.category, 64)}
                    </div>
                    <div class="col-md-4 col-8">
                        <h6 class="fw-bold mb-1">${item.name}</h6>
                        <small class="text-muted d-block">${item.brand} &bull; ${item.unit}</small>
                        ${item.rxRequired ? '<span class="badge bg-danger-subtle text-danger" style="font-size:0.7rem;">Rx required</span>' : ''}
                    </div>
                    <div class="col-md-2 col-4 text-md-center">
                        <span class="fs-5 fw-bold text-success">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="col-md-2 col-4">
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-secondary btn-cart-qty-dec" data-product-id="${item.productId}">-</button>
                            <input type="number" class="form-control text-center fw-semibold p-0" value="${item.quantity}" readonly>
                            <button class="btn btn-outline-secondary btn-cart-qty-inc" data-product-id="${item.productId}">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 col-4 text-end">
                        <button class="btn btn-outline-danger btn-sm rounded-circle btn-cart-remove" data-product-id="${item.productId}">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // --- DASHBOARD ORDER HISTORY ITEM ---
    renderOrderRow(order) {
        const statusColors = {
            "Ordered": "bg-info-subtle text-info border",
            "Verified": "bg-primary-subtle text-primary border",
            "Packed": "bg-warning-subtle text-warning border",
            "Out for Delivery": "bg-secondary-subtle text-secondary border",
            "Delivered": "bg-success-subtle text-success border",
            "Cancelled": "bg-danger-subtle text-danger border"
        };
        const dateFormatted = new Date(order.date).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
        });

        const statusBadge = statusColors[order.status] || "bg-secondary-subtle";
        
        let itemNames = order.items.map(item => `${item.name} (x${item.quantity})`).join(", ");
        if (itemNames.length > 50) {
            itemNames = itemNames.substring(0, 50) + "...";
        }

        return `
            <div class="custom-card p-3 shadow-sm border border-color">
                <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <h6 class="fw-bold mb-0">${order.id}</h6>
                            <span class="badge ${statusBadge}" style="font-size: 0.75rem;">${order.status}</span>
                        </div>
                        <small class="text-muted d-block">${dateFormatted}</small>
                        <small class="text-secondary mt-1 d-block">${itemNames}</small>
                    </div>
                    <div class="text-end">
                        <span class="fs-5 fw-extrabold text-success d-block">$${order.total.toFixed(2)}</span>
                        <a href="#tracking/${order.id}" class="btn btn-outline-primary btn-sm rounded-pill px-3 mt-2">
                            <i class="fa-solid fa-map-location-dot me-1"></i> Track Order
                        </a>
                    </div>
                </div>
            </div>
        `;
    },

    // --- ADMIN CRM ORDER ROW ---
    renderAdminOrderRow(order) {
        const statuses = ["Ordered", "Verified", "Packed", "Out for Delivery", "Delivered", "Cancelled"];
        const rxIcon = order.prescriptionUrl ? 
            `<a href="${order.prescriptionUrl}" target="_blank" class="btn btn-outline-danger btn-sm p-1 rounded px-2" title="View Prescription"><i class="fa-solid fa-file-prescription"></i> View</a>` : 
            `<span class="text-muted small">None Required</span>`;
        
        const dateFormatted = new Date(order.date).toLocaleDateString("en-US", {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
        });

        const statusOptions = statuses.map(st => {
            return `<option value="${st}" ${order.status === st ? 'selected' : ''}>${st}</option>`;
        }).join("");

        return `
            <tr>
                <td class="fw-bold">${order.id}</td>
                <td>
                    <div class="fw-semibold">${order.customerName}</div>
                    <small class="text-muted">${order.customerPhone}</small>
                </td>
                <td class="small">${dateFormatted}</td>
                <td>
                    <div class="small text-truncate" style="max-width: 150px;">
                        ${order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}
                    </div>
                </td>
                <td class="fw-bold text-success">$${order.total.toFixed(2)}</td>
                <td>${rxIcon}</td>
                <td>
                    <span class="badge bg-secondary-subtle text-secondary border border-secondary" id="admin-status-badge-${order.id}">${order.status}</span>
                </td>
                <td>
                    <select class="form-select form-select-sm select-status-trigger rounded-pill" data-order-id="${order.id}">
                        ${statusOptions}
                    </select>
                </td>
            </tr>
        `;
    },

    // --- ADMIN INVENTORY ROW ---
    renderAdminMedicineRow(med) {
        const rxBadge = med.rxRequired ? 
            `<span class="badge bg-danger-subtle text-danger">Rx Required</span>` : 
            `<span class="badge bg-primary-subtle text-primary">OTC</span>`;

        const stockClass = med.stock === 0 ? "text-danger fw-bold" : med.stock < 5 ? "text-warning fw-semibold" : "text-success";

        return `
            <tr id="admin-inv-row-${med.id}">
                <td>
                    <div class="d-flex align-items-center gap-2">
                        ${this.getCategorySVG(med.category, 40)}
                        <div>
                            <div class="fw-bold">${med.name}</div>
                            <small class="text-muted">${med.brand}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge bg-light text-dark border">${med.category}</span></td>
                <td class="fw-bold text-success">$${med.price.toFixed(2)}</td>
                <td class="${stockClass}">${med.stock} <small class="text-muted">(${med.unit})</small></td>
                <td>${rxBadge}</td>
                <td>
                    ${med.stock > 0 ? '<span class="badge bg-success">In Stock</span>' : '<span class="badge bg-danger">Out of Stock</span>'}
                </td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary btn-sm rounded btn-edit-med-trigger" data-product-id="${med.id}" data-bs-toggle="modal" data-bs-target="#addMedModal">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm rounded btn-delete-med-trigger" data-product-id="${med.id}">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    // --- ADMIN CUSTOMER ROW ---
    renderAdminCustomerRow(cust) {
        return `
            <tr>
                <td><img src="${cust.avatar}" class="rounded-circle border" width="36" height="36" alt="Avatar"></td>
                <td class="fw-bold">${cust.name}</td>
                <td class="small">
                    <div><i class="fa-solid fa-envelope text-muted"></i> ${cust.email}</div>
                    <div><i class="fa-solid fa-phone text-muted"></i> ${cust.phone}</div>
                </td>
                <td>
                    <span class="badge bg-success-subtle text-success border border-success px-2 py-1"><i class="fa-solid fa-coins me-1"></i> ${cust.loyaltyPoints} pts</span>
                </td>
                <td class="small text-secondary text-truncate" style="max-width: 200px;" title="${cust.address}">${cust.address}</td>
            </tr>
        `;
    }
};

window.CureSyncComponents = CureSyncComponents;
