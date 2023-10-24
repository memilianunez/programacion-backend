import http from "http";

import productos from './productos';

import { users } from './users.js';

const server = http.createServer((req, res)=>{
    console.log(req.url);
    if(req.url === '/products'){
        res.end(JSON.stringify(products));
    }
    if(req.url === '/users'){
        res.end(JSON.stringify(users));
    }

    if(req.url === '/home'){
        res.end('Bienvenidx');
    }

});

server.listen(8080, ()=>console.log('Server ok en puerto 8080'))