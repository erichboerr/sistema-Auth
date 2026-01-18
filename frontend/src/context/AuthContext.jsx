import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verificación robusta al cargar la app
    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Llamamos a la ruta encapsulada que creamos antes
                const response = await api.get('/auth/verify');
                setUser(response.data); // Seteamos el {id, user, rol}
            } catch (error) {
                console.error("Sesión inválida o expirada");
                logout(); // Si el token no sirve, limpiamos todo
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, []);

    // Función de Login actualizada con los nuevos nombres de campos
    const login = async (userValue, password) => {
        // CAMBIO CLAVE: Enviamos 'user' en lugar de 'username'
        const response = await api.post('/auth/login', { user: userValue, password });
        
        const { token, user: userData } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;