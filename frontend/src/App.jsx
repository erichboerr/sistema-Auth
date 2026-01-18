import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* RUTA PÚBLICA */}
          <Route path="/login" element={<Login />} />

          {/* RUTAS PROTEGIDAS (Anidadas) */}
          <Route element={<ProtectedRoute />}>
            {/* Todas las rutas aquí adentro usarán el Outlet del ProtectedRoute */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Aquí podrías agregar más rutas privadas en el futuro:
               <Route path="/perfil" element={<Perfil />} /> 
            */}
          </Route>

          {/* REDIRECCIÓN INICIAL */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          {/* 404 */}
          <Route path="*" element={<div className="p-10 text-center"><h1>404 - No encontrado</h1></div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;