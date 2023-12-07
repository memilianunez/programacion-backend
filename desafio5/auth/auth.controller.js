import bcrypt from "bcrypt";

const users = [];

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = users.find((user) => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya está registrado." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { email, password: hashedPassword };
        users.push(newUser);

        res.status(201).json({ message: "Usuario registrado exitosamente." });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = users.find((user) => user.email === email);
        if (!user) {
            return res.status(401).json({ message: "Credenciales incorrectas." });
        }

        // Verifica la contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Credenciales incorrectas." });
        }

        // req.session.userId = user.id;

        res.status(200).json({ message: "Inicio de sesión exitoso." });
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};
