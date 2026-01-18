import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";

// Contextos y Providers (Ajustados a la nueva estructura)
import { AuthProvider } from "./common/context/AutProvider"; // El componente envolvente
import { ToastContext } from "./common/context/ToastContext";
import { ToastProvider } from "./common/context/ToastProvider";
import MainLayout from "./common/components/MainLayout";

// Servicios y Utilidades
import { setupInterceptors } from "./common/services/api";
// Usaremos el logout que viene directamente del contexto para mayor consistencia
import { useAuth } from "./common/hooks/useAuth";

// Componentes y Páginas
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./common/components/ProtectedRoute";

function AppContent() {
  // 🔹 Usamos los contextos centralizados
  const { logout } = useAuth();
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    // 🔹 Pasamos la función logout del contexto al interceptor
    // Esto asegura que si el servidor da 401, se limpie el estado global
    setupInterceptors(addToast, logout);
  }, [addToast, logout]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rutas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Aquí irán tus futuras rutas como /insumos, /reportes, etc. */}
        </Route>
      </Route>

      {/* Redirecciones y Errores */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route
        path="*"
        element={
          <div className="p-10 text-center">
            <h1>404 - Pagina No Encontrada</h1>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* 1. ToastProvider envuelve todo (incluso si falla el Auth, los Toasts funcionan) */}
      <ToastProvider>
        {/* 2. AuthProvider maneja la sesión */}
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
