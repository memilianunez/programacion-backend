import express from 'express';
import ProductManager from './ProductManager.js';


const app = express();
const PORT = 8080;
const productManager = new ProductManager("./src/products.js");

app.get("/products", async (req, res) => {
    const products = await productManager.getProducts();
    console.log(products);
})

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
