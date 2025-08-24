class CartManager {
    constructor() {
        this.db = new Database();
        this.cart = [];
        this.loadCart();
    }

    // Muat keranjang dari localStorage
    loadCart() {
        const savedCart = localStorage.getItem('warung_cart');
        this.cart = savedCart ? JSON.parse(savedCart) : [];
        this.updateCartUI();
    }

    // Simpan keranjang ke localStorage
    saveCart() {
        localStorage.setItem('warung_cart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    // Tambahkan produk ke keranjang
    addToCart(product, quantity) {
        const existingItem = this.cart.find(item => item.product.id == product.id);
        
        if (existingItem) {
            // Jika produk sudah ada, tambahkan quantity
            if (existingItem.quantity + quantity > product.stock) {
                alert(`Stok tidak mencukupi. Hanya tersedia ${product.stock} item.`);
                return;
            }
            existingItem.quantity += quantity;
        } else {
            // Jika produk belum ada, tambahkan item baru
            if (quantity > product.stock) {
                alert(`Stok tidak mencukupi. Hanya tersedia ${product.stock} item.`);
                return;
            }
            this.cart.push({
                product: product,
                quantity: quantity
            });
        }
        
        this.saveCart();
    }

    // Hapus item dari keranjang
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.product.id != productId);
        this.saveCart();
    }

    // Update quantity item di keranjang
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.product.id == productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else if (quantity > item.product.stock) {
                alert(`Stok tidak mencukupi. Hanya tersedia ${item.product.stock} item.`);
                item.quantity = item.product.stock;
                this.saveCart();
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    // Hitung total keranjang
    calculateTotal() {
        let total = 0;
        let totalItems = 0;
        
        this.cart.forEach(item => {
            total += item.product.price * item.quantity;
            totalItems += item.quantity;
        });
        
        return { total, totalItems };
    }

    // Update tampilan keranjang
    updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const totalItems = document.getElementById('totalItems');
        const cartCount = document.querySelector('.cart-count');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        
        const { total, totalItems: itemsCount } = this.calculateTotal();
        
        // Update cart count di header
        cartCount.textContent = itemsCount;
        
        // Update total
        cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        totalItems.textContent = itemsCount;
        
        // Kosongkan atau isi keranjang
        if (this.cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItems.innerHTML = '';
            cartItems.appendChild(emptyCartMessage);
        } else {
            emptyCartMessage.style.display = 'none';
            
            let cartHTML = '';
            this.cart.forEach(item => {
                const itemTotal = item.product.price * item.quantity;
                
                cartHTML += `
                    <div class="cart-item">
                        <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.product.name}</div>
                            <div class="cart-item-price">Rp ${itemTotal.toLocaleString('id-ID')}</div>
                            <div class="cart-item-quantity">
                                <button class="cart-qty-btn" data-id="${item.product.id}" data-action="decrease">-</button>
                                <input type="number" class="cart-qty-input" value="${item.quantity}" 
                                    data-id="${item.product.id}" min="1" max="${item.product.stock}">
                                <button class="cart-qty-btn" data-id="${item.product.id}" data-action="increase">+</button>
                                <button class="remove-item" data-id="${item.product.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            cartItems.innerHTML = cartHTML;
            
            // Tambahkan event listeners untuk interaksi keranjang
            this.addCartEventListeners();
        }
    }

    // Tambahkan event listeners untuk interaksi keranjang
    addCartEventListeners() {
        // Tombol kurang quantity
        document.querySelectorAll('.cart-qty-btn[data-action="decrease"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const item = this.cart.find(item => item.product.id == productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        // Tombol tambah quantity
        document.querySelectorAll('.cart-qty-btn[data-action="increase"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const item = this.cart.find(item => item.product.id == productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        // Input quantity manual
        document.querySelectorAll('.cart-qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.getAttribute('data-id');
                this.updateQuantity(productId, parseInt(e.target.value));
            });
        });

        // Tombol hapus item
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id') || 
                                 e.target.parentElement.getAttribute('data-id');
                this.removeFromCart(productId);
            });
        });
    }

    // Kosongkan keranjang
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // Proses checkout
    checkout(customerData) {
        const { total } = this.calculateTotal();
        
        if (this.cart.length === 0) {
            alert('Keranjang belanja kosong. Silakan tambahkan produk terlebih dahulu.');
            return false;
        }
        
        if (!customerData.name || !customerData.phone || !customerData.address) {
            alert('Silakan lengkapi data pemesanan (nama, WhatsApp, dan alamat).');
            return false;
        }
        
        // Simpan pesanan
        const order = {
            items: [...this.cart],
            customer: customerData,
            total: total,
            status: 'pending'
        };
        
        this.db.saveOrder(order);
        
        // Kirim pesan WhatsApp
        this.sendWhatsAppMessage(order);
        
        // Kosongkan keranjang
        this.clearCart();
        
        return true;
    }

    // Kirim pesan WhatsApp
    sendWhatsAppMessage(order) {
        const store = this.db.getStore();
        let message = `Halo, saya ingin memesan:\n\n`;
        
        order.items.forEach(item => {
            message += `${item.product.name} - ${item.quantity} x Rp ${item.product.price.toLocaleString('id-ID')}\n`;
        });
        
        message += `\nTotal: Rp ${order.total.toLocaleString('id-ID')}\n`;
        message += `\nData Pemesan:\n`;
        message += `Nama: ${order.customer.name}\n`;
        message += `WhatsApp: ${order.customer.phone}\n`;
        message += `Alamat: ${order.customer.address}\n`;
        
        if (order.customer.location) {
            message += `Lokasi: ${order.customer.location.lat}, ${order.customer.location.lng}\n`;
        }
        
        message += `\nTerima kasih.`;
        
        // Encode message untuk URL
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = store ? store.phone : '6281234567890'; // Default number
        
        // Buka WhatsApp
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    }
}