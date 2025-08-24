class AuthManager {
    constructor() {
        this.db = new Database();
        this.currentUser = null;
        this.checkAuth();
    }

    // Cek status autentikasi
    checkAuth() {
        const store = this.db.getStore();
        if (store && store.username) {
            this.currentUser = store.username;
            this.updateUIForAuth();
        }
    }

    // Update UI setelah login
    updateUIForAuth() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn && this.currentUser) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${this.currentUser}`;
        }
    }

    // Login admin
    login(username, password) {
        const store = this.db.getStore();
        
        if (!store) {
            alert('Toko belum di-setup. Silakan setup toko terlebih dahulu.');
            this.showSetupForm();
            return false;
        }
        
        if (store.username === username && store.password === password) {
            this.currentUser = username;
            this.updateUIForAuth();
	    // REDIRECT KE HALAMAN ADMIN SETELAH LOGIN BERHASIL
            setTimeout(() => {
            	window.location.href = 'pages/admin.html';
            }, 500);		

            return true;
        } else {
            alert('Username atau password salah.');
            return false;
        }
    }

    // Setup toko baru
    setupStore(storeData) {
        if (storeData.password !== storeData.confirmPassword) {
            alert('Password dan konfirmasi password tidak cocok.');
            return false;
        }
        
        const store = {
            username: storeData.username,
            password: storeData.password,
            name: storeData.storeName,
            address: storeData.storeAddress,
            owner: storeData.storeOwner,
            phone: storeData.storePhone
        };
        
        this.db.saveStore(store);
        this.currentUser = storeData.username;
        this.updateUIForAuth();
        
        // Update nama toko di header
        const storeNameElement = document.getElementById('storeName');
        if (storeNameElement) {
            storeNameElement.textContent = storeData.storeName;
        }
        
        return true;
    }

    // Tampilkan form setup
    showSetupForm() {
        const loginForm = document.getElementById('loginForm');
        const setupForm = document.getElementById('setupForm');
        
        if (loginForm && setupForm) {
            loginForm.style.display = 'none';
            setupForm.style.display = 'block';
        }
    }

    // Tampilkan form login
    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const setupForm = document.getElementById('setupForm');
        
        if (loginForm && setupForm) {
            loginForm.style.display = 'block';
            setupForm.style.display = 'none';
        }
    }

    // Logout
    logout() {
        this.currentUser = null;
        
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> Admin Login`;
        }
        
        // Redirect ke halaman admin jika diperlukan
        if (window.location.pathname.includes('admin.html')) {
            window.location.href = 'index.html';
        }
    }

    // Cek apakah user sudah login
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// TAMBAHKAN CLASS DATABASE DI BAWAH INI (di akhir file)
class Database {
    constructor() {
        this.productsKey = 'warung_products';
        this.storeKey = 'warung_store';
        this.ordersKey = 'warung_orders';
    }

    // Produk methods
    getProducts() {
        const products = localStorage.getItem(this.productsKey);
        return products ? JSON.parse(products) : [];
    }

    saveProducts(products) {
        localStorage.setItem(this.productsKey, JSON.stringify(products));
    }

    // Store methods
    getStore() {
        const store = localStorage.getItem(this.storeKey);
        return store ? JSON.parse(store) : null;
    }

    saveStore(store) {
        localStorage.setItem(this.storeKey, JSON.stringify(store));
    }

    // Orders methods
    getOrders() {
        const orders = localStorage.getItem(this.ordersKey);
        return orders ? JSON.parse(orders) : [];
    }

    saveOrders(orders) {
        localStorage.setItem(this.ordersKey, JSON.stringify(orders));
    }

    saveOrder(order) {
        const orders = this.getOrders();
        order.id = Date.now().toString();
        order.date = new Date().toISOString();
        orders.push(order);
        this.saveOrders(orders);
        return order;
    }
	
}

// Inisialisasi data produk default jika belum ada
function initializeDefaultProducts() {
    const db = new Database();
    const existingProducts = db.getProducts();
    
    if (existingProducts.length === 0) {
        const defaultProducts = [
            {
                id: 1,
                name: "Beras Pandan Wangi 5kg",
                price: 65000,
                image: "https://via.placeholder.com/300x300?text=Beras+5kg",
                category: "sembako",
                stock: 20
            },
            {
                id: 2,
                name: "Minyak Goreng Fortune 2L",
                price: 28000,
                image: "https://via.placeholder.com/300x300?text=Minyak+Goreng",
                category: "sembako",
                stock: 15
            },
            {
                id: 3,
                name: "Gula Pasir 1kg",
                price: 12500,
                image: "https://via.placeholder.com/300x300?text=Gula+Pasir",
                category: "sembako",
                stock: 25
            },
            {
                id: 4,
                name: "Teh Celup Sariwangi 25s",
                price: 10500,
                image: "https://via.placeholder.com/300x300?text=Teh+Celup",
                category: "minuman",
                stock: 18
            },
            {
                id: 5,
                name: "Kopi Kapal Api 100gr",
                price: 8500,
                image: "https://via.placeholder.com/300x300?text=Kopi+Kapal+Api",
                category: "minuman",
                stock: 22
            },
            {
                id: 6,
                name: "Indomie Goreng 1 dus",
                price: 35000,
                image: "https://via.placeholder.com/300x300?text=Indomie+Goreng",
                category: "makanan",
                stock: 10
            },
            {
                id: 7,
                name: "Susu Kental Manis Frisian Flag",
                price: 9500,
                image: "https://via.placeholder.com/300x300?text=Susu+Kental+Manis",
                category: "susu",
                stock: 16
            },
            {
                id: 8,
                name: "Sabun Lifebuoy 100gr",
                price: 4500,
                image: "https://via.placeholder.com/300x300?text=Sabun+Lifebuoy",
                category: "sabun-pembersih",
                stock: 30
            },
            {
                id: 9,
                name: "Rokok Sampoerna Mild 16 batang",
                price: 30000,
                image: "https://via.placeholder.com/300x300?text=Rokok+Sampoerna",
                category: "rokok",
                stock: 40
            },
            {
                id: 10,
                name: "Kecap Bango 135ml",
                price: 9500,
                image: "https://via.placeholder.com/300x300?text=Kecap+Bango",
                category: "bumbu",
                stock: 20
            },
            {
                id: 11,
                name: "Pensil 2B Faber Castell",
                price: 2500,
                image: "https://via.placeholder.com/300x300?text=Pensil+2B",
                category: "atk",
                stock: 50
            },
            {
                id: 12,
                name: "Chitato 35gr",
                price: 8500,
                image: "https://via.placeholder.com/300x300?text=Chitato",
                category: "makanan",
                stock: 35
            },
            {
                id: 13,
                name: "Paracetamol 500mg",
                price: 8000,
                image: "https://via.placeholder.com/300x300?text=Paracetamol",
                category: "obat",
                stock: 25
            }
        ];
        
        db.saveProducts(defaultProducts);
    }
}

// Panggil fungsi inisialisasi saat load
document.addEventListener('DOMContentLoaded', initializeDefaultProducts);
