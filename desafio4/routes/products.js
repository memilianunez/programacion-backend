const express = require('express');
const router = express.Router();
const fs = require('fs');


function generateUniqueID(products) {
    let newID;
    do {
        newID = generateRandomID();
    } while (products.some(product => product.id === newID));
    return newID;
}


function generateRandomID() {
    return Math.floor(Math.random() * 1000000);
}


router.get('/', (req, res) => {
    const productsData = JSON.parse(fs.readFileSync('src/products.json', 'utf-8'));
    res.status(200).json({ status: 'success', payload: productsData });
});


router.get('/:pid', (req, res) => {
    const productId = req.params.pid;
    const productsData = JSON.parse(fs.readFileSync('src/products.json', 'utf-8'));
    const product = productsData.find(p => p.id === productId);
    if (product) {
        res.status(200).json({ status: 'success', payload: product });
    } else {
        res.status(404).json({ status: 'error', error: 'No se pudo encontrar el producto' });
    }
});


router.post('/', (req, res) => {
    const productsData = JSON.parse(fs.readFileSync('src/products.json', 'utf-8'));
    const newProduct = req.body;
    newProduct.id = generateUniqueID(productsData);
    productsData.push(newProduct);
    fs.writeFileSync('src/products.json', JSON.stringify(productsData, null, 2));
    res.status(201).json({ status: 'success', message: 'Se agregó correctamente el producto', payload: newProduct });
});


router.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const productsData = JSON.parse(fs.readFileSync('src.products.json', 'utf-8'));
    const productIndex = productsData.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
        productsData[productIndex] = { ...productsData[productIndex], ...updatedProduct };
        fs.writeFileSync('src/products.json', JSON.stringify(productsData, null, 2));
        res.status(200).json({ status: 'success', message: 'Se actualizó con éxito el producto', payload: productsData });
    } else {
        res.status(404).json({ status: 'error', error: 'No se encuentra el producto' });
    }
});


router.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    const productsData = JSON.parse(fs.readFileSync('src/products.json', 'utf-8'));
    const updatedProducts = productsData.filter(product => product.id !== productId);

    if (updatedProducts.length < productsData.length) {
        fs.writeFileSync('src/products.json', JSON.stringify(updatedProducts, null, 2));
        res.status(200).json({ status: 'success', message: 'Se eliminó correctamente el producto', payload: updatedProducts });
    } else {
        res.status(404).json({ status: 'error', error: 'No se encontró el producto' });
    }
});


module.exports = router;
