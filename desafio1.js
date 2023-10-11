class ProductManager {
    constructor() {
        this.products = [];
    }

    addProduct(nombre, descripcion, price, thumbnail, codigo, stock) {
        if (!nombre || !descripcion || !price || !thumbnail || !codigo || !stock) {
            throw new Error('Todos los campos son obligatorios');
        }

        const codigoExiste = this.products.some(product => product.codigo === codigo);

        if (codigoExiste) {
            throw new Error('El código ya está en uso');
        }

        const newProduct = {
            id: this.#getMaxId() + 1,
            nombre,
            descripcion,
            price,
            thumbnail,
            codigo,
            stock
        };

        this.products.push(newProduct);
    }

    #getMaxId() {
        let maxId = 0;
        this.products.forEach((product) => {
            if (product.id > maxId) maxId = product.id;
        });
        return maxId;
    }

    getProducts() {
        return this.products;
    }

    getProductById(idProduct) {
        const product = this.products.find((product) => product.id === idProduct);
        if (!product) {
            throw new Error('Not found');
        }
        return product;
    }
}

const productManager = new ProductManager();

productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);

console.log(productManager.getProducts());

try {
    productManager.addProduct('producto prueba', 'Otro producto prueba', 300, 'Sin imagen', 'abc123', 10);
} catch (error) {
    console.error(error.message);
}

try {
    const product = productManager.getProductById(999);
    console.log(product);
} catch (error) {
    console.error(error.message);
}