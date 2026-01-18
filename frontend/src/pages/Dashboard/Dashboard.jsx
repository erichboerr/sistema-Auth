import { useAuth } from "../../common/hooks/useAuth";
import { LogOut, Package } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Simple */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-blue-600">
          <Package /> <span>StockPro</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-600 text-sm">
            Bienvenido, <strong>{user?.user}</strong>
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium"
          >
            <LogOut size={16} /> Salir
          </button>
        </div>
      </nav>

      {/* Contenido */}
      <main className="p-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <h1 className="text-3xl font-bold text-slate-800">
            👋 ¡Hola de nuevo, {user?.user}!
          </h1>
          <p className="text-slate-500 mt-2">Has ingresado correctamente.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjetas de ejemplo */}
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg text-blue-700">
              <h3 className="font-bold">Total Productos</h3>
              <p className="text-2xl">124</p>
            </div>
            <div className="p-6 bg-green-50 border border-green-100 rounded-lg text-green-700">
              <h3 className="font-bold">Ventas hoy</h3>
              <p className="text-2xl">$45.000</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
