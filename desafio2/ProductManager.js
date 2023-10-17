const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.loadData();

        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, '[]', 'utf8');
        }
    }

    addProduct(nombre, descripcion, price, thumbnail, codigo, stock) {
        if (!nombre || !descripcion || !price || !thumbnail || !codigo || !stock) {
            throw new Error('Todos los campos son obligatorios');
        }

        if (this.products.some(product => product.codigo === codigo)) {
            throw new Error('El código ya está en uso. Inténtalo nuevamente con otro código.');
        }

        const newProduct = {
            id: this.getNextId(),
            nombre,
            descripcion,
            price,
            thumbnail,
            codigo,
            stock
        };

        this.products.push(newProduct);
        this.saveData();
    }

    getNextId() {
        return this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;
    }

    loadData() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    saveData() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
    }

    getProducts() {
        return this.products;
    }

    getProductById(idProduct) {
        const product = this.products.find(product => product.id === idProduct);
        return product || null;
    }

    updateProduct(idProduct, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === idProduct);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
            this.saveData();
        }
    }

    deleteProduct(idProduct) {
        const productIndex = this.products.findIndex(product => product.id === idProduct);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            this.saveData();
        }
    }
}

module.exports = ProductManager;
