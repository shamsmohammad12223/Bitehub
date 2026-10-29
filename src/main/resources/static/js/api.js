/**
 * BiteHub - Core Frontend API & Client Utility Library
 */

const API_BASE_URL = '/api';

// --- Authentication & Local Storage ---
const Auth = {
    getToken() {
        return localStorage.getItem('bh_token');
    },
    setToken(token) {
        localStorage.setItem('bh_token', token);
    },
    getUser() {
        const userStr = localStorage.getItem('bh_user');
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            return null;
        }
    },
    setUser(user) {
        localStorage.setItem('bh_user', JSON.stringify(user));
    },
    isLoggedIn() {
        return !!this.getToken() && !!this.getUser();
    },
    hasRole(role) {
        const user = this.getUser();
        return user && user.role === role;
    },
    logout() {
        localStorage.removeItem('bh_token');
        localStorage.removeItem('bh_user');
        window.location.href = '/login.html';
    },
    requireAuth(allowedRoles = []) {
        if (!this.isLoggedIn()) {
            window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
            return false;
        }
        if (allowedRoles.length > 0) {
            const user = this.getUser();
            if (!allowedRoles.includes(user.role)) {
                alert('Access Denied: You do not have permission to view this page.');
                window.location.href = '/index.html';
                return false;
            }
        }
        return true;
    }
};

// --- Dark / Light Theme Manager ---
const Theme = {
    KEY: 'bh_theme',
    get() {
        const saved = localStorage.getItem(this.KEY);
        if (saved) return saved;
        return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    },
    set(mode) {
        localStorage.setItem(this.KEY, mode);
        document.documentElement.setAttribute('data-bs-theme', mode);
        if (mode === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        this.updateIcon();
    },
    toggle() {
        const current = this.get();
        this.set(current === 'dark' ? 'light' : 'dark');
    },
    init() {
        const mode = this.get();
        document.documentElement.setAttribute('data-bs-theme', mode);
        if (document.body) {
            if (mode === 'dark') document.body.classList.add('dark-mode');
            else document.body.classList.remove('dark-mode');
        }
        this.updateIcon();
    },
    updateIcon() {
        const btns = document.querySelectorAll('.theme-toggle-btn');
        const isDark = this.get() === 'dark';
        btns.forEach(btn => {
            btn.innerHTML = isDark 
                ? '<i class="bi bi-sun-fill text-warning fs-5"></i>' 
                : '<i class="bi bi-moon-stars-fill text-secondary fs-5"></i>';
            btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        });
    }
};

// Initialize theme immediately on script load
try {
    const _initialTheme = localStorage.getItem('bh_theme') || ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
    document.documentElement.setAttribute('data-bs-theme', _initialTheme);
} catch (e) {}

// --- Language & Internationalization (I18n) Manager ---
const I18n = {
    KEY: 'bh_lang',
    translations: {
        en: {
            nav_home: 'Home',
            nav_restaurants: 'Restaurants',
            nav_orders: 'My Orders',
            nav_dashboard: 'Dashboard',
            nav_portal_rest: 'Restaurant Portal',
            nav_portal_rider: 'Delivery Portal',
            nav_portal_admin: 'Admin Control',
            nav_analytics: 'Analytics',
            nav_reports: 'Reports',
            nav_browse: 'Browse Site',
            nav_login: 'Log In',
            nav_signup: 'Sign Up',
            nav_logout: 'Log Out',
            nav_profile: 'My Profile',
            nav_manage_store: 'Manage Store',
            nav_routes: 'My Routes',
            nav_admin_panel: 'Admin Panel',
            hero_badge: '<i class="bi bi-fire me-1"></i> Special Offer: Use code <strong>BITE50</strong> for 50% OFF!',
            hero_title: 'Craving Good Food? <br><span style="color: var(--bh-primary);">Delivered in Minutes.</span>',
            hero_desc: 'Discover top campus eateries, gourmet burgers, wood-fired pizzas, and traditional biryani delivered right to your doorstep.',
            hero_search_ph: 'Search burgers, pizzas, restaurants...',
            hero_search_btn: 'Search',
            cat_heading: '<i class="bi bi-grid-fill text-primary me-2"></i>Explore Categories',
            cat_view_all: 'View All <i class="bi bi-arrow-right"></i>',
            cat_burgers: 'Burgers',
            cat_burgers_sub: 'American, Fries',
            cat_pizzas: 'Pizzas',
            cat_pizzas_sub: 'Italian, Pasta',
            cat_biryani: 'Biryani & Curry',
            cat_biryani_sub: 'Indian, Spices',
            cat_japanese: 'Japanese',
            cat_japanese_sub: 'Sushi & Ramen',
            cat_fastfood: 'Fast Food',
            cat_fastfood_sub: 'Crispy Wings',
            cat_beverages: 'Beverages',
            cat_beverages_sub: 'Shakes & Tea',
            featured_heading: '<i class="bi bi-star-fill text-warning me-2"></i>Top Rated Restaurants',
            featured_sub: 'Popular verified kitchens around campus',
            featured_see_all: 'See All Restaurants',
            how_title: 'How BiteHub Works',
            how_step1_title: '1. Select Food',
            how_step1_desc: 'Browse verified local restaurants and mouth-watering menus.',
            how_step2_title: '2. Place Order',
            how_step2_desc: 'Customize with coupons and choose simulated cards, mobile banking, or COD.',
            how_step3_title: '3. Real-time Tracking',
            how_step3_desc: 'Watch status change live from kitchen preparation to rider pickup.',
            how_step4_title: '4. Enjoy & Review',
            how_step4_desc: 'Receive fresh, hot food and share your feedback with the community.',
            promo_title: 'Own a Restaurant or Want to Deliver?',
            promo_desc: 'Partner with BiteHub to grow your sales or register as a delivery rider with flexible hours.',
            promo_btn_rest: 'Register Restaurant',
            promo_btn_rider: 'Join as Rider'
        },
        bn: {
            nav_home: 'হোম',
            nav_restaurants: 'রেস্তোরাঁ',
            nav_orders: 'আমার অর্ডার',
            nav_dashboard: 'ড্যাশবোর্ড',
            nav_portal_rest: 'রেস্তোরাঁ পোর্টাল',
            nav_portal_rider: 'ডেলিভারি পোর্টাল',
            nav_portal_admin: 'অ্যাডমিন কন্ট্রোল',
            nav_analytics: 'অ্যানালিটিক্স',
            nav_reports: 'রিপোর্ট',
            nav_browse: 'সাইট ব্রাউজ',
            nav_login: 'লগইন',
            nav_signup: 'সাইন আপ',
            nav_logout: 'লগআউট',
            nav_profile: 'আমার প্রোফাইল',
            nav_manage_store: 'স্টোর পরিচালনা',
            nav_routes: 'আমার রুট',
            nav_admin_panel: 'অ্যাডমিন প্যানেল',
            hero_badge: '<i class="bi bi-fire me-1"></i> বিশেষ অফার: <strong>BITE50</strong> কোড ব্যবহারে ৫০% ছাড়!',
            hero_title: 'সুস্বাদু খাবার খুঁজছেন? <br><span style="color: var(--bh-primary);">পৌঁছে যাবে নিমেষেই।</span>',
            hero_desc: 'আপনার ক্যাম্পাসের সেরা রেস্তোরাঁ, সুস্বাদু বার্গার, পিজ্জা এবং ঐতিহ্যবাহী কাচ্চি-বিরিয়ানি সরাসরি আপনার দরজায়।',
            hero_search_ph: 'বার্গার, পিজ্জা, রেস্তোরাঁ খুঁজুন...',
            hero_search_btn: 'অনুসন্ধান',
            cat_heading: '<i class="bi bi-grid-fill text-primary me-2"></i>ক্যাটাগরি সমূহ',
            cat_view_all: 'সবগুলো দেখুন <i class="bi bi-arrow-right"></i>',
            cat_burgers: 'বার্গার',
            cat_burgers_sub: 'আমেরিকান, ফ্রাইস',
            cat_pizzas: 'পিজ্জা',
            cat_pizzas_sub: 'ইতালীয়, পাস্তা',
            cat_biryani: 'বিরিয়ানি ও কারি',
            cat_biryani_sub: 'মসলাদার খাবার',
            cat_japanese: 'জাপানিজ',
            cat_japanese_sub: 'সুশি ও রামেন',
            cat_fastfood: 'ফাস্ট ফুড',
            cat_fastfood_sub: 'খাস্তা উইংস',
            cat_beverages: 'পানীয়',
            cat_beverages_sub: 'শেক ও চা',
            featured_heading: '<i class="bi bi-star-fill text-warning me-2"></i>সেরা রেস্তোরাঁসমূহ',
            featured_sub: 'ক্যাম্পাসের জনপ্রিয় ও বিশ্বস্ত কিচেনসমূহ',
            featured_see_all: 'সব রেস্তোরাঁ দেখুন',
            how_title: 'বাইটহাব কীভাবে কাজ করে',
            how_step1_title: '১. খাবার বাছুন',
            how_step1_desc: 'ক্যাম্পাসের সেরা রেস্তোরাঁর লোভনীয় মেনু থেকে পছন্দ করুন।',
            how_step2_title: '২. অর্ডার দিন',
            how_step2_desc: 'কুপন ছাড় ব্যবহার করে ক্যাশ অন ডেলিভারি বা মোবাইলে পেমেন্ট করুন।',
            how_step3_title: '৩. লাইভ ট্র্যাকিং',
            how_step3_desc: 'রান্না থেকে শুরু করে রাইডারের ডেলিভারি স্ট্যাটাস সরাসরি ট্র্যাক করুন।',
            how_step4_title: '৪. উপভোগ ও রিভিউ',
            how_step4_desc: 'গরম খাবার গ্রহণ করুন এবং আপনার অভিজ্ঞতা রিভিউ আকারে শেয়ার করুন।',
            promo_title: 'রেস্তোরাঁর মালিক কিংবা রাইডার হতে চান?',
            promo_desc: 'বাইটহাবে আপনার রেস্তোরাঁ যুক্ত করে ব্যবসা বৃদ্ধি করুন অথবা রাইডার হয়ে আয় করুন।',
            promo_btn_rest: 'রেস্তোরাঁ যুক্ত করুন',
            promo_btn_rider: 'রাইডার হিসেবে যোগ দিন'
        }
    },
    get() {
        return localStorage.getItem(this.KEY) || 'en';
    },
    set(lang) {
        localStorage.setItem(this.KEY, lang);
        document.documentElement.setAttribute('lang', lang);
        this.updateButton();
        this.apply();
        if (typeof renderNavbar === 'function') {
            const activePage = window.__bhActivePage || 'home';
            renderNavbar(activePage);
        }
    },
    toggle() {
        const next = this.get() === 'en' ? 'bn' : 'en';
        this.set(next);
    },
    t(key) {
        const lang = this.get();
        return (this.translations[lang] && this.translations[lang][key]) || 
               (this.translations.en && this.translations.en[key]) || key;
    },
    updateButton() {
        const lang = this.get();
        const textSpan = document.getElementById('currentLangText');
        if (textSpan) {
            textSpan.textContent = lang === 'en' ? 'EN' : 'বাং';
        }
        const btn = document.getElementById('langToggleBtn');
        if (btn) {
            btn.setAttribute('title', lang === 'en' ? 'বাংলা ভাষায় দেখুন' : 'Switch to English');
        }
    },
    apply() {
        const lang = this.get();
        const dict = this.translations[lang] || this.translations.en;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = dict[key];
                } else {
                    el.innerHTML = dict[key];
                }
            }
        });
    },
    init() {
        const lang = this.get();
        document.documentElement.setAttribute('lang', lang);
        this.updateButton();
        this.apply();
    }
};

// Initialize language immediately on script load
try {
    const _initialLang = localStorage.getItem('bh_lang') || 'en';
    document.documentElement.setAttribute('lang', _initialLang);
} catch (e) {}


// --- HTTP Request Client ---
async function apiRequest(endpoint, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = Auth.getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        const isPublicAuthRequest = endpoint === '/auth/login' || endpoint === '/auth/register';
        if (response.status === 401 && !isPublicAuthRequest) {
            // Token expired or invalid
            if (Auth.isLoggedIn()) {
                Auth.logout();
            }
            throw new Error('Session expired or unauthorized. Please log in again.');
        }

        if (response.status === 204) {
            return null;
        }

        // Some errors (e.g. a CORS/security rejection) return plain text, not JSON.
        // Parse defensively so the real message is surfaced instead of a JSON parse error.
        const raw = await response.text();
        let resData = null;
        if (raw) {
            try {
                resData = JSON.parse(raw);
            } catch (e) {
                resData = null;
            }
        }

        if (!response.ok) {
            // JSON payloads are the norm. Anything else (gateway/proxy HTML, plain
            // text) is summarised so the UI never dumps a whole page into an alert.
            let errorMsg = `Request failed (HTTP ${response.status})`;
            if (resData && typeof resData === 'object') {
                errorMsg = resData.message || Object.values(resData).join(', ') || errorMsg;
            } else {
                const text = (raw || '').trim();
                const isHtml = /^<!doctype html|^<html/i.test(text);
                if (text && !isHtml) {
                    errorMsg = text.length > 200 ? text.slice(0, 200) + '...' : text;
                } else if (isHtml) {
                    errorMsg = `Server error (HTTP ${response.status}). Please try again in a moment.`;
                }
            }
            throw new Error(errorMsg);
        }

        return resData;
    } catch (error) {
        console.error(`API Error [${method} ${endpoint}]:`, error);
        throw error;
    }
}

// --- Real-time order updates (authenticated Server-Sent Events) ---
const OrderUpdates = {
    started: false,
    reconnectTimer: null,
    start() {
        if (this.started || !Auth.isLoggedIn()) return;
        this.started = true;
        this.connect();
    },
    async connect() {
        const token = Auth.getToken();
        if (!token) return;
        try {
            const response = await fetch('/api/orders/stream', {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'text/event-stream' }
            });
            if (!response.ok || !response.body) throw new Error('Order stream unavailable');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const events = buffer.split(/\r?\n\r?\n/);
                buffer = events.pop();
                events.forEach(event => {
                    const data = event.split(/\r?\n/).find(line => line.startsWith('data:'));
                    if (!data) return;
                    try {
                        window.dispatchEvent(new CustomEvent('bitehub:order-updated', {
                            detail: JSON.parse(data.substring(5).trim())
                        }));
                    } catch (_) { /* connection heartbeat */ }
                });
            }
        } catch (error) {
            console.warn('Order update stream disconnected', error);
        } finally {
            if (Auth.isLoggedIn()) this.reconnectTimer = setTimeout(() => this.connect(), 3000);
        }
    }
};

const BrowserNotifications = {
    knownStatuses: new Map(),
    isSupported() {
        return 'Notification' in window;
    },
    async enable() {
        if (!this.isSupported()) {
            showToast('Browser notifications are not supported here.', 'warning');
            return;
        }
        const permission = await Notification.requestPermission();
        showToast(permission === 'granted' ? 'Order notifications enabled.' : 'Notifications were not enabled.', permission === 'granted' ? 'success' : 'warning');
        renderNavbar();
    },
    handleOrderUpdate(order) {
        const previousStatus = this.knownStatuses.get(order.id);
        this.knownStatuses.set(order.id, order.orderStatus);
        if (previousStatus === order.orderStatus || !this.isSupported() || Notification.permission !== 'granted') return;
        const notification = new Notification(`Order ${order.orderNumber} updated`, {
            body: `New status: ${String(order.orderStatus).replace(/_/g, ' ')}`,
            icon: '/images/bitehub-logo.jpg'
        });
        notification.onclick = () => {
            window.focus();
            window.location.href = `/order-tracking.html?id=${order.id}`;
        };
    }
};

window.addEventListener('bitehub:order-updated', event => BrowserNotifications.handleOrderUpdate(event.detail));

// --- Shopping Cart Manager ---
const Cart = {
    KEY: 'bh_cart',
    get() {
        const cartStr = localStorage.getItem(this.KEY);
        try {
            return cartStr ? JSON.parse(cartStr) : { restaurantId: null, restaurantName: '', items: [] };
        } catch (e) {
            return { restaurantId: null, restaurantName: '', items: [] };
        }
    },
    save(cart) {
        localStorage.setItem(this.KEY, JSON.stringify(cart));
        this.updateBadge();
    },
    addItem(restaurantId, restaurantName, item) {
        let cart = this.get();

        // If items exist from another restaurant, ask user to confirm clearing
        if (cart.restaurantId && cart.restaurantId !== restaurantId && cart.items.length > 0) {
            const confirmReplace = confirm(
                `Your cart contains items from "${cart.restaurantName}". Would you like to clear your cart and start a new order with "${restaurantName}"?`
            );
            if (!confirmReplace) return false;
            cart = { restaurantId, restaurantName, items: [] };
        }

        cart.restaurantId = restaurantId;
        cart.restaurantName = restaurantName;

        const existingIndex = cart.items.findIndex(i => i.menuItemId === item.id);
        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += 1;
        } else {
            cart.items.push({
                menuItemId: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                quantity: 1
            });
        }

        this.save(cart);
        showToast(`Added "${item.name}" to cart!`, 'success');
        return true;
    },
    updateQuantity(menuItemId, delta) {
        const cart = this.get();
        const item = cart.items.find(i => i.menuItemId === menuItemId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                cart.items = cart.items.filter(i => i.menuItemId !== menuItemId);
            }
        }
        if (cart.items.length === 0) {
            cart.restaurantId = null;
            cart.restaurantName = '';
        }
        this.save(cart);
    },
    removeItem(menuItemId) {
        const cart = this.get();
        cart.items = cart.items.filter(i => i.menuItemId !== menuItemId);
        if (cart.items.length === 0) {
            cart.restaurantId = null;
            cart.restaurantName = '';
        }
        this.save(cart);
    },
    clear() {
        localStorage.removeItem(this.KEY);
        this.updateBadge();
    },
    getSubtotal() {
        const cart = this.get();
        return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    getCount() {
        const cart = this.get();
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    updateBadge() {
        const badges = document.querySelectorAll('.cart-count-badge');
        const count = this.getCount();
        badges.forEach(b => {
            b.textContent = count;
            b.style.display = count > 0 ? 'inline-block' : 'none';
        });
    }
};

// --- Toast Notifications ---
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : type === 'warning' ? 'bg-warning text-dark' : 'bg-primary';

    toast.className = `toast align-items-center text-white ${bgClass} border-0 show shadow-lg mb-2`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body fw-semibold">
                ${Utils.escapeHTML(message)}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// --- Formatters ---
function formatCurrency(amount) {
    if (amount === null || amount === undefined) return 'Tk 0.00';
    return 'Tk ' + Number(amount).toFixed(2);
}

function formatDate(isoStr) {
    if (!isoStr) return 'N/A';
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusBadge(status) {
    const s = (status || '').toUpperCase();
    switch (s) {
        case 'PLACED':
            return '<span class="badge badge-placed px-2 py-1"><i class="bi bi-clock me-1"></i>Order Placed</span>';
        case 'CONFIRMED':
            return '<span class="badge badge-confirmed px-2 py-1"><i class="bi bi-check-circle me-1"></i>Confirmed</span>';
        case 'PREPARING':
            return '<span class="badge badge-preparing px-2 py-1"><i class="bi bi-fire me-1"></i>Preparing</span>';
        case 'READY_FOR_PICKUP':
            return '<span class="badge badge-ready_for_pickup px-2 py-1"><i class="bi bi-box-seam me-1"></i>Ready for Pickup</span>';
        case 'OUT_FOR_DELIVERY':
            return '<span class="badge badge-out_for_delivery px-2 py-1"><i class="bi bi-bicycle me-1"></i>Out for Delivery</span>';
        case 'DELIVERED':
            return '<span class="badge badge-delivered px-2 py-1"><i class="bi bi-check2-all me-1"></i>Delivered</span>';
        case 'CANCELLED':
            return '<span class="badge badge-cancelled px-2 py-1"><i class="bi bi-x-circle me-1"></i>Cancelled</span>';
        default:
            return `<span class="badge bg-secondary">${Utils.escapeHTML(status)}</span>`;
    }
}

const Utils = { 
    escapeHTML: function(str) { 
        if (!str) return ''; 
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); 
    }, 
    formatCurrency: function(amt) { 
        return 'Tk ' + parseFloat(amt).toFixed(2); 
    }, 
    DELIVERY_FEE: 40.0 
};

// --- Dynamic Navbar Generator ---
function renderNavbar(activePage = '') {
    window.__bhActivePage = activePage;
    const navPlaceholder = document.getElementById('navbar-container');
    if (!navPlaceholder) return;

    const user = Auth.getUser();
    let authNavHtml = '';
    let roleNavLinks = '';

    if (user) {
        if (user.role === 'ROLE_CUSTOMER') {
            roleNavLinks = `
                <li class="nav-item"><a class="nav-link ${activePage === 'restaurants' ? 'active' : ''}" href="/restaurants.html"><i class="bi bi-shop me-1"></i>${I18n.t('nav_restaurants')}</a></li>
                <li class="nav-item"><a class="nav-link ${activePage === 'orders' ? 'active' : ''}" href="/order-history.html"><i class="bi bi-receipt me-1"></i>${I18n.t('nav_orders')}</a></li>
                <li class="nav-item"><a class="nav-link ${activePage === 'dashboard' ? 'active' : ''}" href="/customer-dashboard.html"><i class="bi bi-person me-1"></i>${I18n.t('nav_dashboard')}</a></li>
            `;
        } else if (user.role === 'ROLE_RESTAURANT') {
            roleNavLinks = `
                <li class="nav-item"><a class="nav-link ${activePage === 'restaurant-dash' ? 'active' : ''}" href="/restaurant-dashboard.html"><i class="bi bi-speedometer2 me-1"></i>${I18n.t('nav_portal_rest')}</a></li>
                <li class="nav-item"><a class="nav-link ${activePage === 'reports' ? 'active' : ''}" href="/reports.html"><i class="bi bi-bar-chart-line me-1"></i>${I18n.t('nav_analytics')}</a></li>
            `;
        } else if (user.role === 'ROLE_DELIVERY') {
            roleNavLinks = `
                <li class="nav-item"><a class="nav-link ${activePage === 'delivery-dash' ? 'active' : ''}" href="/delivery-dashboard.html"><i class="bi bi-bicycle me-1"></i>${I18n.t('nav_portal_rider')}</a></li>
            `;
        } else if (user.role === 'ROLE_ADMIN') {
            roleNavLinks = `
                <li class="nav-item"><a class="nav-link ${activePage === 'admin-dash' ? 'active' : ''}" href="/admin-dashboard.html"><i class="bi bi-shield-check me-1"></i>${I18n.t('nav_portal_admin')}</a></li>
                <li class="nav-item"><a class="nav-link ${activePage === 'reports' ? 'active' : ''}" href="/reports.html"><i class="bi bi-bar-chart-line me-1"></i>${I18n.t('nav_reports')}</a></li>
                <li class="nav-item"><a class="nav-link" href="/restaurants.html"><i class="bi bi-shop me-1"></i>${I18n.t('nav_browse')}</a></li>
            `;
        }

        const avatarHtml = user.profileImageUrl 
            ? `<img src="${Utils.escapeHTML(user.profileImageUrl)}" alt="${Utils.escapeHTML(user.name)}" class="rounded-circle border" style="width: 26px; height: 26px; object-fit: cover;">`
            : `<i class="bi bi-person-circle fs-5 text-primary"></i>`;

        authNavHtml = `
            <div class="dropdown ms-lg-3">
                <button class="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-2 py-1" type="button" data-bs-toggle="dropdown">
                    ${avatarHtml}
                    <span class="fw-semibold text-truncate" style="max-width: 140px;">${Utils.escapeHTML(user.name)}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                    <li class="dropdown-header">
                        <small class="text-muted d-block">${Utils.escapeHTML(user.email)}</small>
                        <span class="badge bg-primary mt-1">${Utils.escapeHTML(user.role.replace('ROLE_', ''))}</span>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    ${user.role === 'ROLE_CUSTOMER' ? `<li><a class="dropdown-item" href="/customer-dashboard.html"><i class="bi bi-gear me-2"></i>${I18n.t('nav_profile')}</a></li>` : ''}
                    ${user.role === 'ROLE_RESTAURANT' ? `<li><a class="dropdown-item" href="/restaurant-dashboard.html"><i class="bi bi-shop me-2"></i>${I18n.t('nav_manage_store')}</a></li>` : ''}
                    ${user.role === 'ROLE_DELIVERY' ? `<li><a class="dropdown-item" href="/delivery-dashboard.html"><i class="bi bi-geo-alt me-2"></i>${I18n.t('nav_routes')}</a></li>` : ''}
                    ${user.role === 'ROLE_ADMIN' ? `<li><a class="dropdown-item" href="/admin-dashboard.html"><i class="bi bi-speedometer2 me-2"></i>${I18n.t('nav_admin_panel')}</a></li>` : ''}
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="Auth.logout()"><i class="bi bi-box-arrow-right me-2"></i>${I18n.t('nav_logout')}</a></li>
                </ul>
            </div>
        `;
    } else {
        roleNavLinks = `
            <li class="nav-item"><a class="nav-link ${activePage === 'home' ? 'active' : ''}" href="/index.html">${I18n.t('nav_home')}</a></li>
            <li class="nav-item"><a class="nav-link ${activePage === 'restaurants' ? 'active' : ''}" href="/restaurants.html">${I18n.t('nav_restaurants')}</a></li>
        `;
        authNavHtml = `
            <div class="d-flex gap-2 ms-lg-3">
                <a href="/login.html" class="btn btn-outline-secondary px-3">${I18n.t('nav_login')}</a>
                <a href="/register.html" class="btn btn-bh-primary px-3">${I18n.t('nav_signup')}</a>
            </div>
        `;
    }

    const currentLang = typeof I18n !== 'undefined' ? I18n.get() : 'en';

    navPlaceholder.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-bh sticky-top">
            <div class="container">
                <a class="navbar-brand py-0" href="/index.html">
                    <img src="/images/bitehub-logo.jpg" alt="BiteHub" style="height: 52px; width: auto; object-fit: contain;">
                </a>
                
                <div class="d-flex align-items-center order-lg-3 gap-2">
                    ${BrowserNotifications.isSupported() && Notification.permission !== 'granted' ? '<button class="btn btn-light rounded-pill px-2 border" onclick="BrowserNotifications.enable()" title="Enable order notifications" aria-label="Enable order notifications"><i class="bi bi-bell fs-5 text-primary"></i></button>' : ''}
                    <button class="btn btn-light rounded-pill px-2 border theme-toggle-btn" onclick="Theme.toggle()" title="Toggle Dark/Light Mode" aria-label="Toggle Theme">
                        <i class="bi bi-moon-stars-fill text-secondary fs-5"></i>
                    </button>
                    <!-- Language Toggle Pill Button (Foodpanda Style) -->
                    <button id="langToggleBtn" class="btn btn-light rounded-pill px-2.5 py-1 border d-inline-flex align-items-center gap-1 lang-toggle-btn" onclick="I18n.toggle()" title="${currentLang === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন' : 'Switch to English'}" aria-label="Toggle Language">
                        <i class="bi bi-globe2 text-secondary"></i>
                        <span id="currentLangText" class="fw-bold text-secondary small">${currentLang === 'en' ? 'EN' : 'বাং'}</span>
                    </button>
                    <a href="/cart.html" class="btn btn-light position-relative rounded-pill px-3 border">
                        <i class="bi bi-cart3 fs-5 text-dark"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-count-badge" style="display: none;">0</span>
                    </a>
                    <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#bitehubNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="d-none d-lg-block">
                        ${authNavHtml}
                    </div>
                </div>

                <div class="collapse navbar-collapse order-lg-2" id="bitehubNav">
                    <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                        ${roleNavLinks}
                    </ul>
                    <div class="d-lg-none mt-3 pt-3 border-top">
                        ${authNavHtml}
                    </div>
                </div>
            </div>
        </nav>
    `;

    Cart.updateBadge();
    Theme.updateIcon();
    if (typeof I18n !== 'undefined') {
        I18n.updateButton();
        I18n.apply();
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
    Cart.updateBadge();
    OrderUpdates.start();
});

// Global image error fallback
document.addEventListener('error', function(e) { if (e.target.tagName.toLowerCase() === 'img') { e.target.src = '/images/bitehub-logo.jpg'; } }, true);
