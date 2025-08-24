class ProductManager {
    constructor() {
        this.db = new Database();
        this.products = this.db.getProducts();
        this.filteredProducts = [...this.products];
        this.currentCategory = 'all';
        this.currentSort = 'newest';
        this.minPrice = null;
        this.maxPrice = null;
        this.searchTerm = '';
    }

    // Filter produk berdasarkan kategori
    filterByCategory(category) {
        this.currentCategory = category;
        this.applyFilters();
    }

    // Filter produk berdasarkan harga
    filterByPrice(min, max) {
        this.minPrice = min ? parseInt(min) : null;
        this.maxPrice = max ? parseInt(max) : null;
        this.applyFilters();
    }

    // Cari produk berdasarkan kata kunci
    searchProducts(term) {
        this.searchTerm = term.toLowerCase();
        this.applyFilters();
    }

    // Urutkan produk
    sortProducts(sortBy) {
        this.currentSort = sortBy;
        this.applyFilters();
    }

    // Terapkan semua filter dan pengurutan
    applyFilters() {
        let filtered = [...this.products];

        // Filter kategori
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(product => product.category === this.currentCategory);
        }

        // Filter harga
        if (this.minPrice !== null) {
            filtered = filtered.filter(product => product.price >= this.minPrice);
        }

        if (this.maxPrice !== null) {
            filtered = filtered.filter(product => product.price <= this.maxPrice);
        }

        // Filter pencarian
        if (this.searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(this.searchTerm)
            );
        }

        // Pengurutan
        switch (this.currentSort) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'newest':
            default:
                // Default: urutkan berdasarkan ID (terbaru)
                filtered.sort((a, b) => b.id - a.id);
                break;
        }

        this.filteredProducts = filtered;
        this.renderProducts();
    }

    // Render produk ke grid
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        
        if (this.filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">Tidak ada produk yang ditemukan</p>';
            return;
        }

        productsGrid.innerHTML = this.filteredProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                    <div class="product-stock">Stok: ${product.stock}</div>
                    <div class="quantity-controls">
                        <div>
                            <button class="qty-btn minus" data-id="${product.id}">-</button>
                            <input type="number" class="qty-input" id="qty-${product.id}" value="0" min="0" max="${product.stock}">
                            <button class="qty-btn plus" data-id="${product.id}">+</button>
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Tambahkan event listeners untuk tombol quantity dan add to cart
        this.addProductEventListeners();
    }

    // Tambahkan event listeners untuk interaksi produk
    addProductEventListeners() {
        // Tombol tambah quantity
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                this.increaseQuantity(productId);
            });
        });

        // Tombol kurang quantity
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                this.decreaseQuantity(productId);
            });
        });

        // Input quantity manual
        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.id.replace('qty-', '');
                this.updateQuantity(productId, e.target.value);
            });
        });

        // Tombol tambah ke keranjang
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id') || 
                                 e.target.parentElement.getAttribute('data-id');
                this.addToCart(productId);
            });
        });
    }

    // Fungsi untuk menambah jumlah produk
    increaseQuantity(productId) {
        const input = document.getElementById(`qty-${productId}`);
        const product = this.products.find(p => p.id == productId);
        
        if (parseInt(input.value) < parseInt(product.stock)) {
            input.value = parseInt(input.value) + 1;
        }
    }

    // Fungsi untuk mengurangi jumlah produk
    decreaseQuantity(productId) {
        const input = document.getElementById(`qty-${productId}`);
        if (parseInt(input.value) > 0) {
            input.value = parseInt(input.value) - 1;
        }
    }

    // Fungsi untuk update quantity melalui input
    updateQuantity(productId, value) {
        const input = document.getElementById(`qty-${productId}`);
        const product = this.products.find(p => p.id == productId);
        
        if (parseInt(value) > product.stock) {
            input.value = product.stock;
        } else if (parseInt(value) < 0) {
            input.value = 0;
        }
    }

    // Fungsi untuk menambahkan produk ke keranjang
    addToCart(productId) {
        const input = document.getElementById(`qty-${productId}`);
        const quantity = parseInt(input.value);
        
        if (quantity <= 0) {
            alert('Silakan tentukan jumlah produk yang ingin dibeli');
            return;
        }
        
        const product = this.products.find(p => p.id == productId);
        window.cartManager.addToCart(product, quantity);
        
        // Reset quantity input
        input.value = 0;
        
        // Tampilkan notifikasi
        this.showNotification(`Ditambahkan ke keranjang: ${product.name}`);
    }

    // Tampilkan notifikasi
    showNotification(message) {
        // Buat elemen notifikasi
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        
        // Tambahkan ke body
        document.body.appendChild(notification);
        
        // Hapus setelah 3 detik
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}