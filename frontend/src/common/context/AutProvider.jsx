import { useState, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await api.get('/auth/verify');
                setUser(response.data);
            } catch (error) {
                console.log(error);
                console.error("Sesión inválida o expirada");
                logout();
            } finally {
                setLoading(false);
            }
        };
        verifySession();
    }, []);

    const login = async (userValue, password) => {
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