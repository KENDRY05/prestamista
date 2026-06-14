import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

function RecuperarPassword() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const actualizarPassword = (
    e
  ) => {
    e.preventDefault();

    const usuario = JSON.parse(
      localStorage.getItem("usuario")
    );

    if (!usuario) {
      alert(
        "No existe usuario registrado"
      );
      return;
    }

    if (usuario.email !== email) {
      alert(
        "El correo no coincide"
      );
      return;
    }

    usuario.password = password;

    localStorage.setItem(
      "usuario",
      JSON.stringify(usuario)
    );

    alert(
      "Contraseña actualizada"
    );

    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>
          Recuperar Contraseña
        </h1>

        <form
          onSubmit={
            actualizarPassword
          }
        >
          <input
            type="email"
            placeholder="Correo registrado"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
          />

          <button
            className="btn-primary"
            type="submit"
          >
            Actualizar
          </button>
        </form>

        <br />

        <Link to="/login">
          Volver al Login
        </Link>
      </div>
    </div>
  );
}

export default RecuperarPassword;