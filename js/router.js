/**
 * CureSync - Pharmacy Platform Hash Router
 * Technology Partner: SynXCloud
 *
 * Intercepts url hash changes and toggles page view visibility, executing
 * targeted render routines for the active layout.
 */

const CureSyncRouter = {
    routes: {},

    // Register a route and its associated render callback
    addRoute(route, callback) {
        this.routes[route] = callback;
    },

    init() {
        window.addEventListener("hashchange", () => this.handleRoute());
        // Handle initial load
        this.handleRoute();
    },

    navigate(hash) {
        window.location.hash = hash;
    },

    parseHash() {
        const hash = window.location.hash.substring(1) || "home";
        
        // Simple regex route parsing, e.g., product/med-rx-01 or tracking/ORD-1002
        const parts = hash.split("/");
        return {
            path: parts[0],
            param: parts[1] || null,
            subParam: parts[2] || null
        };
    },

    handleRoute() {
        const routeData = this.parseHash();
        const path = routeData.path;
        
        // Hide autocomplete dropdowns on navigation
        const dropdown = document.getElementById("autocomplete-results");
        if (dropdown) dropdown.style.display = "none";

        // Scroll to top of window
        window.scrollTo(0, 0);

        // Map paths to HTML View IDs
        const viewIdMap = {
            "home": "view-home",
            "catalog": "view-catalog",
            "product": "view-product-detail",
            "prescription": "view-prescription",
            "cart": "view-cart",
            "checkout": "view-checkout",
            "dashboard": "view-dashboard",
            "tracking": "view-tracking",
            "admin": "view-admin",
            "why-digital": "view-why-digital"
        };

        const targetViewId = viewIdMap[path] || "view-home";

        // Toggle visibility classes
        const views = document.querySelectorAll(".app-view");
        views.forEach(view => {
            view.classList.remove("active-view");
        });

        const activeView = document.getElementById(targetViewId);
        if (activeView) {
            activeView.classList.add("active-view");
        }

        // Highlight active navbar links
        const navLinks = document.querySelectorAll(".nav-link[href]");
        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            if (href === `#${path}`) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        // Trigger renderer callbacks
        if (typeof window.CureSyncApp !== "undefined" && window.CureSyncApp.renderers) {
            const renderer = window.CureSyncApp.renderers[path];
            if (renderer) {
                renderer(routeData.param, routeData.subParam);
            }
        }
    }
};

window.CureSyncRouter = CureSyncRouter;
