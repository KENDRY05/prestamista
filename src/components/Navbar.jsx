import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("sesion");

    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2>💰 Prestamista Pro</h2>

      <nav>
        <Link to="/">Dashboard</Link>

        <Link to="/clientes">
          Clientes
        </Link>

        <Link to="/prestamos">
          Préstamos
        </Link>

        <Link to="/cobros">
          Cobros
        </Link>

        <Link to="/reportes">
          Reportes
        </Link>

        <Link to="/configuracion">
          Configuración
        </Link>

        <button
          className="btn-logout"
          onClick={cerrarSesion}
        >
          🚪 Cerrar Sesión
        </button>
      </nav>
    </aside>
  );
}

export default Navbar;