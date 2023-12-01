const express = require('express');
const app = express();
const port = 8080;

const http = require('http').Server(app);
const fs = require('fs');
const io = require('socket.io')(http);
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());

import { __dirname } from './utils.js';
import { errorHandler } from './middlewares/errorHandler.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import viewsRouter from './routes/views.router.js';
import MessagesManager from './managers/messages.manager.js';
const msgManager = new MessagesManager(__dirname+'/db/messages.json');

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


const socketServer = new Server(httpServer);

socketServer.on('connection', async(socket)=>{
    console.log('🟢 ¡Nueva conexión!', socket.id);
    socketServer.emit('messages', await msgManager.getAll());

    socket.on('disconnect', ()=>console.log(' ¡Usuario desconectado!', socket.id));
    socket.on('newUser', (user)=>console.log(`⏩ ${user} inició sesión`));

    socket.on('chat:message', async(msg)=>{
        await msgManager.createMsg(msg);
        socketServer.emit('messages', await msgManager.getAll());
    })

    socket.on('newUser', (user)=>{
        socket.broadcast.emit('newUser', user)
    })

    socket.on('chat:typing', (data)=>{
        socket.broadcast.emit('chat:typing', data)
    })
})