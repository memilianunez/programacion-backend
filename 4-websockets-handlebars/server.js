const express = require('express');
const app = express();
const port = 8080;

const http = require('http').Server(app);
const fs = require('fs');
const io = require('socket.io')(http);
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());

app.set('view engine', 'handlebars');


app.use(express.json());

const productList = [
    { name: 'Producto 1', price: 100 },
    { name: 'Producto 2', price: 200 },
    { name: 'Producto 3', price: 300 },
    { name: 'Producto 4', price: 400 },
    { name: 'Producto 5', price: 500 },
    { name: 'Producto 6', price: 600 },
    { name: 'Producto 7', price: 700 },
    { name: 'Producto 8', price: 800 },
    { name: 'Producto 9', price: 900 },
    { name: 'Producto 10', price: 1000 }
];

app.get('/', (req, res) => {
    res.send('¡Bienvenidx!');
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: productList });
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.emit('updateProductList', productList);

    socket.on('updateProductList', () => {
        io.emit('updateProductList', productList);
    });
});

http.listen(port, () => {
    console.log(`Servidor corriendo correctamente en el puerto ${port}`);
});
