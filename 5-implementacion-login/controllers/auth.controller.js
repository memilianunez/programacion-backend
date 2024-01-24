import bcrypt from "bcrypt";
import passport from "passport";
import UserModel from '../src/mongodb/models/user.model';


export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'ValidationError', message: errorMessages.userAlreadyExists });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ email, password: hashedPassword, role: 'usuario' });
        await newUser.save();

        res.redirect('/login');
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'ServerError', message: 'Error en el servidor.' });
    }
};

export const login = passport.authenticate("local", {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true,
});

export const logout = (req, res) => {
    try {
        req.logout();
        res.redirect('/login');
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        res.status(500).json({ message: "Error al cerrar sesión." });
    }
};

const errorMessages = {
    userAlreadyExists: "El usuario ya está registrado.",
    incorrectCredentials: "Credenciales incorrectas.",
};
