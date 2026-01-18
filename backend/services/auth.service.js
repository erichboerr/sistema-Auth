import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const login = async (username, password) => {
    // 1. Buscar usuario e incluir su Rol
    const usuario = await db.Usuario.findOne({
        where: { user: username },
        include: [{ model: db.Rol, as: 'rol' }]
    });

    if (!usuario) throw new Error('Credenciales inválidas'); // Mensaje genérico por seguridad
    if (!usuario.flagHabilitado) throw new Error('Usuario deshabilitado');

    // 2. Verificar password
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) throw new Error('Credenciales inválidas');

    // 3. Generar JWT con información del Rol
    const token = jwt.sign(
        { 
            id: usuario.id, 
            user: usuario.user, 
            rol: usuario.rol.nombre 
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    return { 
        token, 
        user: { 
            id: usuario.id, 
            user: usuario.user, 
            rol: usuario.rol.nombre 
        } 
    };
};

const verifyUser = async (id) => {
    const usuario = await db.Usuario.findByPk(id, {
        include: [{ model: db.Rol, as: 'rol' }]
    });
    if (!usuario || !usuario.flagHabilitado) throw new Error('No autorizado');
    
    return {
        id: usuario.id,
        user: usuario.user,
        rol: usuario.rol.nombre
    };
};

export default { login, verifyUser };