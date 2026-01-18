import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api'
});

// 1. Interceptor de Petición (Request)
// Se mantiene igual, es automático para el Token
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Función para configurar los Interceptores de Respuesta
// Esta función la ejecutamos en App.jsx para tener acceso a addToast y logout de React
export const setupInterceptors = (addToast, logout) => {
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error.response?.status;
            const message = error.response?.data?.message || "Error de conexión con el servidor";

            if (status === 401) {
                // Solo avisamos si no es el login (para no molestar al usuario al entrar)
                if (!window.location.pathname.includes('/login')) {
                    addToast("Sesión expirada o inválida", "error");
                }
                logout(); // Usamos la función del contexto, no window.location
            } 
            else if (status === 403) {
                addToast("No tienes permisos para esta acción", "warning");
            } 
            else if (status >= 500) {
                addToast("Error interno del servidor 🛠️", "error");
            }
            else if (status === 400) {
                addToast(message, "warning");
            }

            return Promise.reject(error);
        }
    );
};

export default api;