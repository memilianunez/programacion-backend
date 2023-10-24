import express from 'express';
import { products } from './products.js';
import ProductManager from './ProductManager.js';

const app = express();
const PORT = 8080;

const productManager = new ProductManager();

app.get('/products', (req, res) => {
    const limit = req.query.limit;
    let result = products;
    if (limit) {
        result = products.slice(0, limit);
    }
    res.json(result);
});


app.get('/products/:pid', async(req, res)=>{
    const pid = req.params.pid;
    try {
        const { id } = req.params;
        const product = await userManager.getUserById(Number(id));
        if(!product) res.status(404).json({ message: 'No se encontró el producto solicitado' });
        else res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor Express está corriendo correctamente en el puerto ${PORT}`);
});
