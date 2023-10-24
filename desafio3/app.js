import http from "http";
import { products } from "./productos.js";
import { usuarios } from "./usuarios.js";

const server = http.createServer((req, res) => {
    console.log(req.url);
    
if (req.url === "/products"){
res.end (JSON.stringify(products));
}
if (req.url === "./usuarios") {
    res.end (JSON.stringify(usuarios));
}

});

server.listen(8080, ()=> console.log ("Servidor ok"))