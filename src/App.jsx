import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Prestamos from "./pages/Prestamos";
import Cobros from "./pages/Cobros";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RecuperarPassword from "./pages/RecuperarPassword";

import "./styles/App.css";

function App() {
  return (
    <Routes>

      {/* Rutas Públicas */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/recuperar"
        element={<RecuperarPassword />}
      />

      {/* Rutas Protegidas */}

      <Route
        path="*"
        element={
          <ProtectedRoute>
            <div className="layout">
              <Navbar />

              <main className="content">
                <Routes>
                  <Route
                    path="/"
                    element={<Dashboard />}
                  />
                  
                  <Route
                    path="/clientes"
                    element={<Clientes />}
                  />

                  <Route
                    path="/prestamos"
                    element={<Prestamos />}
                  />

                  <Route
                    path="/cobros"
                    element={<Cobros />}
                  />

                  <Route
                    path="/reportes"
                    element={<Reportes />}
                  />

                  <Route
                    path="/configuracion"
                    element={<Configuracion />}
                  />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;