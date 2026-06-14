import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarios =
      JSON.parse(
        localStorage.getItem("usuarios")
      ) || [];

    const usuario = usuarios.find(
      (u) =>
        u.email.toLowerCase() ===
          email.toLowerCase() &&
        u.password === password
    );

    if (!usuario) {
      alert(
        "Correo o contraseña incorrectos"
      );
      return;
    }

    localStorage.setItem(
      "sesion",
      JSON.stringify({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      })
    );

    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💰 Prestamista Pro</h1>

        <p className="login-subtitle">
          Inicia sesión para continuar
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            Iniciar Sesión
          </button>
        </form>

        <div className="login-links">
          <Link to="/recuperar">
            Recuperar contraseña
          </Link>

          <Link to="/register">
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;