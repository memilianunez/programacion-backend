const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());


const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);


const cartsRouter = require('./routes/carts');
app.use('/api/carts', cartsRouter);


app.get('/', (req, res) => {
    res.send('¡Bienvenidx!'); 
});


app.listen(port, () => {
    console.log(`Servidor corriendo correctamente en el puerto ${port}`);
});
