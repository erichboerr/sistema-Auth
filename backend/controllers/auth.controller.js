import authService from '../services/auth.service.js';

export const login = async (req, res) => {
    try {
        const { user, password } = req.body; // Cambiado de username a user

        if (!user || !password) {
            return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
        }

        const result = await authService.login(user, password);
        
        return res.status(200).json({
            message: "Login exitoso",
            ...result // Esto trae el token y el objeto user {id, user, rol}
        });

    } catch (error) {
        // Si el error es de credenciales, mandamos 401, si es otra cosa 500
        const status = error.message === 'Credenciales inválidas' ? 401 : 500;
        return res.status(status).json({ message: error.message });
    }
};

export const verify = async (req, res) => {
    try {
        // El req.user viene cargado desde el middleware verifyToken
        const userData = await authService.verifyUser(req.user.id);
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};