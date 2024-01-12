import bcrypt from "bcrypt";

const users = [];

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = users.find((user) => user.email === email);
        if (existingUser) {
            return res.status(400).json({ error: "ValidationError", message: errorMessages.userAlreadyExists });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { email, password: hashedPassword, role: "usuario" };
        users.push(newUser);

        res.redirect('/login');
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ error: "ServerError", message: "Error en el servidor." });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = users.find((user) => user.email === email);
        if (!user) {
            return res.status(401).json({ error: "AuthenticationError", message: errorMessages.incorrectCredentials });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "AuthenticationError", message: errorMessages.incorrectCredentials });
        }

        req.session.userRole = user.role;

        res.redirect('/routes/products');
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).json({ error: "ServerError", message: "Error en el servidor." });
    }
};

export const logout = (req, res) => {
    try {
        // Destruye la sesión:
        req.session.destroy((err) => {
            if (err) {
                console.error("Error al cerrar sesión:", err);
                return res.status(500).json({ message: "Error al cerrar sesión." });
            }

            // Redirige al usuario a la página de login después de cerrar sesión:
            res.redirect('/login');
        });
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        res.status(500).json({ message: "Error al cerrar sesión." });
    }
};

const errorMessages = {
    userAlreadyExists: "El usuario ya está registrado.",
    incorrectCredentials: "Credenciales incorrectas.",
};
