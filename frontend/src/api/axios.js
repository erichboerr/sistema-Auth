import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api'
});

// Interceptor para enviar el token en cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar errores 401 (Token expirado o inválido)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Si el servidor nos rebota por auth, limpiamos y redirigimos
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;