class ProductManager {
    constructor() {
        this.products = [];
    }

    addProduct(nombre, descripcion, price, thumbnail, codigo, stock) {
        const newProduct = {
            id: this.#getMaxId() + 1,
            nombre,
            descripcion,
            price: price,
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

    getProduct(idProduct) {
        return this.products.find((product) => product.id === idProduct);
    }

    addUser(idProduct, idUser) {
        const foundProduct = this.getProduct(idProduct);
        if (foundProduct) {
        } else {
            return 'El producto solicitado no existe.';
        }
    }

    addProductbyId(idProduct) {
        const foundProduct = this.getProduct(idProduct);
        if (foundProduct) {
            const newProduct = {
                ...foundProduct,
                id: this.#getMaxId() + 1,
            };
            this.products.push(newProduct);
        } else {
            return 'El producto solicitado no existe.';
        }
    }
}

const productManager = new ProductManager();

productManager.addProduct('Mochila', 'Ideal para llevar tus objetos favoritos', 32000, 'thumbnail.jpg', 'MOCH001', 1000);
productManager.addUser(1, 'Joaquina');


console.log(productManager.getProducts());
