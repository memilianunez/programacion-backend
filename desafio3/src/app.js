import express from 'express';
import { products } from './products.js';
import ProductManager from './ProductManager.js';

const app = express();
const PORT = 8080;

const productManager = new ProductManager('productos.json');

app.get('/products', (req, res) => {
    const limit = req.query.limit;
    let result = products;
    if (limit) {
        result = products.slice(0, limit);
    }
    res.json(result);
});

app.get('/products/:pid', (req, res) => {
    const pid = req.params.pid;
    const product = productManager.getProductById(Number(pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor Express corriendo correctamente en el puerto ${PORT}`);
});
