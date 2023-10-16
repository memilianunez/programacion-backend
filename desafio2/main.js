// const ProductManager = require('./ProductManager');

// const productManager = new ProductManager('./productos.json'); 

// productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);
// console.log(productManager.getProducts());

// try {
//     productManager.addProduct('producto prueba', 'Otro producto prueba', 300, 'Sin imagen', 'abc124', 10);
// } catch (error) {
//     console.error(error.message);
// }

// try {
//     const product = productManager.getProductById(1); 
//     console.log(product);
// } catch (error) {
//     console.error(error.message);
// }

// productManager.updateProduct(1, { price: 250 });

// try {
//     productManager.deleteProduct(1);
//     console.log(productManager.getProducts());
// } catch (error) {
//     console.error(error.message);
// }


const ProductManager = require('./ProductManager');

const productManager = new ProductManager('./productos.json'); 

productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);
console.log(productManager.getProducts());

try {
    productManager.addProduct('producto prueba', 'Otro producto prueba', 300, 'Sin imagen', 'abc124', 10);
} catch (error) {
    console.error(error.message);
}

const product = productManager.getProductById(1); 
if (product) {
    console.log(product);
} else {
    console.log('Producto no encontrado');
}

productManager.updateProduct(1, { price: 250 });

if (productManager.deleteProduct(1)) {
    console.log(productManager.getProducts());
} else {
    console.log('Producto no encontrado');
}
