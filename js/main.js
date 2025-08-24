// Inisialisasi manager
let productManager;
let cartManager;
let authManager;

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi manager
    productManager = new ProductManager();
    cartManager = new CartManager();
    authManager = new AuthManager();
    
    // Render produk
    productManager.renderProducts();
    
    // Setup event listeners
    setupEventListeners();
    
    // Inisialisasi peta mini
    initMiniMap();
});

// Setup semua event listeners
function setupEventListeners() {
    // Kategori
    document.querySelectorAll('.category-item-horizontal').forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class from all items
            document.querySelectorAll('.category-item-horizontal').forEach(i => {
                i.classList.remove('active');
            });
            
            // Add active class to clicked item
            e.currentTarget.classList.add('active');
            
            // Filter by category
            const category = e.currentTarget.getAttribute('data-category');
            productManager.filterByCategory(category);
        });
    });
    
    // Pencarian
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', () => {
            productManager.searchProducts(searchInput.value);
        });
        
        // Search on enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                productManager.searchProducts(searchInput.value);
            }
        });
    }
    
    // Sorting
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            productManager.sortProducts(e.target.value);
        });
    }
    
    // Filter harga
    const applyPriceFilter = document.getElementById('applyPriceFilter');
    if (applyPriceFilter) {
        applyPriceFilter.addEventListener('click', () => {
            const minPrice = document.getElementById('minPrice').value;
            const maxPrice = document.getElementById('maxPrice').value;
            productManager.filterByPrice(minPrice, maxPrice);
        });
    }
    
    // Modal keranjang
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCartModal = document.getElementById('closeCartModal');
    
    if (cartIcon && cartModal && closeCartModal) {
        cartIcon.addEventListener('click', () => {
            cartModal.style.display = 'flex';
        });
        
        closeCartModal.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }
    
    // Modal login
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    
    if (loginBtn && loginModal && closeLoginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'flex';
        });
        
        closeLoginModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }
    
    // Login form
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (authManager.login(username, password)) {
                document.getElementById('loginModal').style.display = 'none';
                // Redirect to admin page if needed
                // window.location.href = 'pages/admin.html';
            }
        });
    }
    
    // Setup toko links
    const setupStoreLink = document.getElementById('setupStoreLink');
    const backToLoginLink = document.getElementById('backToLoginLink');
    
    if (setupStoreLink) {
        setupStoreLink.addEventListener('click', (e) => {
            e.preventDefault();
            authManager.showSetupForm();
        });
    }
    
    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            authManager.showLoginForm();
        });
    }
    
    // Setup toko form
    const saveStoreSetupBtn = document.getElementById('saveStoreSetupBtn');
    if (saveStoreSetupBtn) {
        saveStoreSetupBtn.addEventListener('click', () => {
            const storeData = {
                username: document.getElementById('storeUsername').value,
                password: document.getElementById('storePassword').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                storeName: document.getElementById('storeDisplayName').value,
                storeAddress: document.getElementById('storeAddress').value,
                storeOwner: document.getElementById('storeOwner').value,
                storePhone: document.getElementById('storePhone').value
            };
            
            if (authManager.setupStore(storeData)) {
                document.getElementById('loginModal').style.display = 'none';
            }
        });
    }
    
    // Checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const customerData = {
                name: document.getElementById('customerName').value,
                phone: document.getElementById('customerPhone').value,
                address: document.getElementById('customerAddress').value,
                location: window.currentLocation || null
            };
            
            if (cartManager.checkout(customerData)) {
                document.getElementById('cartModal').style.display = 'none';
                alert('Pesanan berhasil dibuat! Anda akan diarahkan ke WhatsApp.');
            }
        });
    }
    
    // Dapatkan lokasi
    const getLocationBtn = document.getElementById('getLocationBtn');
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getCurrentLocation);
    }
}

// Inisialisasi peta mini
function initMiniMap() {
    const miniMap = document.getElementById('miniMap');
    if (miniMap) {
        miniMap.innerHTML = '<p>Klik "Dapatkan Lokasi Saya" untuk menampilkan peta</p>';
    }
}

// Dapatkan lokasi saat ini
function getCurrentLocation() {
    const miniMap = document.getElementById('miniMap');
    
    if (!navigator.geolocation) {
        miniMap.innerHTML = '<p>Geolocation tidak didukung oleh browser Anda</p>';
        return;
    }
    
    miniMap.innerHTML = '<p>Mendapatkan lokasi...</p>';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Simpan lokasi saat ini
            window.currentLocation = { lat, lng };
            
            // Tampilkan peta statis
            miniMap.innerHTML = `
                <img src="https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=300x150&markers=color:red%7C${lat},${lng}&key=AIzaSyCWH2D2f4Vl5pZh-lk4d6k-1Vc6yb2z6eE" 
                     alt="Lokasi Anda" style="width: 100%; height: 100%; border-radius: 4px;">
            `;
            
            // Tambahkan link ke Google Maps
            const mapsLink = document.createElement('a');
            mapsLink.href = `https://www.google.com/maps?q=${lat},${lng}`;
            mapsLink.target = '_blank';
            mapsLink.textContent = 'Buka di Google Maps';
            mapsLink.style.display = 'block';
            mapsLink.style.marginTop = '10px';
            mapsLink.style.textAlign = 'center';
            
            miniMap.appendChild(mapsLink);
        },
        (error) => {
            console.error('Error getting location:', error);
            miniMap.innerHTML = '<p>Gagal mendapatkan lokasi. Pastikan Anda mengizinkan akses lokasi.</p>';
        }
    );
}