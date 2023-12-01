// const express = require('express');
// const app = express();
// const port = 8080;

// const http = require('http').Server(app);
// const fs = require('fs');
// const io = require('socket.io')(http);
// const exphbs = require('express-handlebars');
// app.engine('handlebars', exphbs());

// import { __dirname } from './utils.js';
// import { errorHandler } from './middlewares/errorHandler.js';
// import handlebars from 'express-handlebars';
// import { Server } from 'socket.io';
// import viewsRouter from './routes/views.router.js';
// import MessagesManager from './managers/messages.manager.js';
// const msgManager = new MessagesManager(__dirname+'/db/messages.json');

// app.set('view engine', 'handlebars');


// app.use(express.json());

// const productList = [
//     { name: 'Producto 1', price: 100 },
//     { name: 'Producto 2', price: 200 },
//     { name: 'Producto 3', price: 300 },
//     { name: 'Producto 4', price: 400 },
//     { name: 'Producto 5', price: 500 },
//     { name: 'Producto 6', price: 600 },
//     { name: 'Producto 7', price: 700 },
//     { name: 'Producto 8', price: 800 },
//     { name: 'Producto 9', price: 900 },
//     { name: 'Producto 10', price: 1000 }
// ];

// app.get('/', (req, res) => {
//     res.send('¡Bienvenidx!');
// });

// app.get('/realtimeproducts', (req, res) => {
//     res.render('realTimeProducts', { products: productList });
// });

// io.on('connection', (socket) => {
//     console.log('Cliente conectado');

//     socket.emit('updateProductList', productList);

//     socket.on('updateProductList', () => {
//         io.emit('updateProductList', productList);
//     });
// });

// http.listen(port, () => {
//     console.log(`Servidor corriendo correctamente en el puerto ${port}`);
// });


// const socketServer = new Server(httpServer);

// socketServer.on('connection', async(socket)=>{
//     console.log('🟢 ¡Nueva conexión!', socket.id);
//     socketServer.emit('messages', await msgManager.getAll());

//     socket.on('disconnect', ()=>console.log(' ¡Usuario desconectado!', socket.id));
//     socket.on('newUser', (user)=>console.log(`⏩ ${user} inició sesión`));

//     socket.on('chat:message', async(msg)=>{
//         await msgManager.createMsg(msg);
//         socketServer.emit('messages', await msgManager.getAll());
//     })

//     socket.on('newUser', (user)=>{
//         socket.broadcast.emit('newUser', user)
//     })

//     socket.on('chat:typing', (data)=>{
//         socket.broadcast.emit('chat:typing', data)
//     })
// })


import express from "express";
import productsRouter from "./routes/products.router.js";
import chatRouter from "./routes/chat.router.js";
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.router.js";
import __dirname from "./utils.js";
import { errorHandler } from "./middlewares/errorHanlder.js";
import { Server } from "socket.io";
import * as service from "./services/chat.service.js";
import { initMongoDB } from "./daos/mongodb/connection.js";

const persistence = "MONGO";

const PORT = 8080;
const app = express();
const httpServer = app.listen(PORT, () => {
  console.log("Server corriendo en puerto ", PORT);
});
if (persistence === "MONGO") await initMongoDB();

const socketServer = new Server(httpServer);
app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/chat", chatRouter);

let usuariosConectado = [];

socketServer.on("connection", async (socket) => {
  // socketServer.emit("usuariosConectados",usuariosConectado)
  console.log("🟢 ¡New connection!", socket.id);
  socketServer.emit("messages", await service.getAll());

  socket.on("disconnect", () => {
    console.log("🔴 ¡User disconnect!", socket.id);
    const sockeidBuscado = socket.id;
    usuariosConectado = usuariosConectado.filter(
      (e) => e.socketID !== sockeidBuscado
    );
    socketServer.emit("usuariosConectados", usuariosConectado);
  });
  socket.on("newUser", (user) => {
    console.log(`⏩ ${user} inició sesión`);
    usuariosConectado.push(user);
    socketServer.emit("usuariosConectados", usuariosConectado);
  });

  socket.on("chat:message", async (msg) => {
    await service.createMessage(msg);
    socketServer.emit("messages", await service.getAll());
  });

  socket.on("newUser", (user) => {
    socket.broadcast.emit("newUser", user);
  });

  socket.on("chat:typing", (data) => {
    socket.broadcast.emit("chat:typing", data);
  });
});

export default socketServer;