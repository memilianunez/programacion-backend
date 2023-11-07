const express = require('express');
const router = express.Router();
const fs = require('fs');
const io = require('socket.io')(); 

function generateUniqueCartID(carts) {
    let newID;
    do {
        newID = generateRandomID();
    } while (carts.some(cart => cart.id === newID));
    return newID;
}


function generateRandomID() {
    return Math.floor(Math.random() * 1000000);
}


router.post('/', (req, res) => {
    const cartsData = JSON.parse(fs.readFileSync('src/carrito.json', 'utf-8'));
    const newCart = req.body;
    newCart.id = generateUniqueCartID(cartsData);
    newCart.products = [];
    cartsData.push(newCart);
    fs.writeFileSync('src/carrito.json', JSON.stringify(cartsData, null, 2));
    io.emit('updateProductList');
    res.status(201).json({ status: 'success', message: 'Se creó con éxito el carrito', payload: newCart });
});


router.post('/:cid/products/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    const cartsData = JSON.parse(fs.readFileSync('src/carrito.json', 'utf-8'));

    const cart = cartsData.find(c => c.id === cartId);
    if (!cart) {
        res.status(404).json({ status: 'error', error: 'No se encontró el carrito' });
        return;
    }

    const existingProduct = cart.products.find(product => product.id === productId);

    if (existingProduct) {
        if (quantity > 0) {
            existingProduct.quantity += quantity;
        }
    } else {
        if (quantity > 0) {
            cart.products.push({ id: productId, quantity });
        }
    }

    fs.writeFileSync('src/carrito.json', JSON.stringify(cartsData, null, 2));
    io.emit('updateProductList');
    res.status(200).json({ status: 'success', message: 'Se agregó correctamente el producto al carrito', payload: cart });
});


module.exports = router;
