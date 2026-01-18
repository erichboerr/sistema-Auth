import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

// 🔹 ESTA ES LA PIEZA QUE FALTA:
// Se encarga de PEGAR el token en cada llamada que hagas
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Tu función de interceptores de respuesta se mantiene igual
export const setupInterceptors = (addToast, logout) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.message || "Error inesperado en el servidor";
      
      if (error.response?.status === 401) {
        addToast("Sesión expirada. Por favor, reingresa.", "error");
        logout();
      } else if (error.response?.status === 403) {
        // 🔹 Nota: Si el error 403 es por el verify inicial, 
        // podrías querer llamar a logout() aquí también para limpiar la app
        addToast("Acceso denegado", "warning");
        logout(); 
      } else {
        addToast(message, "error");
      }

      return Promise.reject(error);
    }
  );
};

export default api;