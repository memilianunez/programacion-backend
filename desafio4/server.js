const express = require('express');
const app = express();
const port = 8080;

const http = require('http').Server(app);
const io = require('socket.io')(http); 
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.json());

const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

const cartsRouter = require('./routes/carts');
app.use('/api/carts', cartsRouter);

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
