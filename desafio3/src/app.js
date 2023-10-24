import express from 'express';
import { products } from './products.js';
import ProductManager from './ProductManager.js';

const app = express();
const PORT = 8080;
const productManager = new ProductManager();

app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    let result = await products;
    if (limit) {
        result = products.slice(0, limit);
    }
    res.json(result);
});

app.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(parseInt(pid));

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).json({ error: "Error al obtener producto por ID" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor Express está corriendo correctamente en el puerto ${PORT}`);
});
