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
import { register, login } from "./src/controllers/auth.controller.js";
import { logout } from "./src/controllers/auth.controller.js";
import passport from "passport";
import session from "express-session";
import passport from "./auth/auth.controller.js";
import GitHubStrategy from "passport-github2";


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

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/chat", chatRouter);
app.post("/register", register);
app.post("/login", login);
app.post("/logout", logout);
app.post("/register", register);
app.post("/login", login);


// Configurar sesión y Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: "tu-secreto-aqui", resave: false, saveUninitialized: false }));




let usuariosConectados = [];

socketServer.on("connection", async (socket) => {
    console.log("Nueva conexión", socket.id);
    socketServer.emit("usuariosConectados", usuariosConectados);

    socket.on("disconnect", () => {
        console.log("Usuario desconectado", socket.id);
        usuariosConectados = usuariosConectados.filter(
            (e) => e.socketID !== socket.id
        );
        socketServer.emit("usuariosConectados", usuariosConectados);
    });

    socket.on("newUser", (user) => {
        console.log(`${user} inició sesión`);
        usuariosConectados.push({ socketID: socket.id, username: user });
        socketServer.emit("usuariosConectados", usuariosConectados);
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


// Configuración de la estrategia de GitHub
passport.use(
    new GitHubStrategy(
        {
            clientID: "Iv1.477f7651eb3941ac",
            clientSecret: "GITHUB_CLIENT_SECRET",
            callbackURL: "http://localhost:8080/auth/github/callback",
        },
        (accessToken, refreshToken, profile, done) => {

            require('dotenv').config();
            const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;


            const user = {
                githubId: profile.id,
                username: profile.username,
            };

            return done(null, user);
        }
    )
);

app.use(passport.authenticate("github"));

// Ruta de retorno después de la autenticación de GitHub
app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    (req, res) => {
        // Redirección exitosa después de la autenticación de GitHub
        res.redirect("/products");
    }
);
