import bcrypt from "bcrypt";
import passport from "passport";
import LocalStrategy from "passport-local";

const users = [];

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = users.find((user) => user.email === username);

            if (!user) {
                return done(null, false, { message: "Credenciales incorrectas." });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return done(null, false, { message: "Credenciales incorrectas." });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    const user = users.find((user) => user.email === email);
    done(null, user);
});

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = users.find((user) => user.email === email);
        if (existingUser) {
            return res.status(400).json({
                error: "ValidationError",
                message: errorMessages.userAlreadyExists,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { email, password: hashedPassword, role: "usuario" };
        users.push(newUser);

        res.redirect("/login");
    } catch (error) {
        console.error("Error en el registro:", error);
        res
            .status(500)
            .json({ error: "ServerError", message: "Error en el servidor." });
    }
};

export const login = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/products",
        failureRedirect: "/login",
        failureFlash: true,
    })(req, res, next);
};

export const logout = (req, res) => {
    try {
        req.logout();
        res.redirect("/login");
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        res.status(500).json({ message: "Error al cerrar sesión." });
    }
};

const errorMessages = {
    userAlreadyExists: "El usuario ya está registrado.",
    incorrectCredentials: "Credenciales incorrectas.",
};

export default passport;
