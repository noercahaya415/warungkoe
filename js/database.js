// Simpan data di localStorage sebagai pengganti database
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

    saveOrder(order) {
        const orders = this.getOrders();
        order.id = Date.now().toString();
        order.date = new Date().toISOString();
        orders.push(order);
        localStorage.setItem(this.ordersKey, JSON.stringify(orders));
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