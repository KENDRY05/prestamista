import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmar, setConfirmar] =
    useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmar) {
      alert(
        "Las contraseñas no coinciden"
      );
      return;
    }

    const usuarios =
      JSON.parse(
        localStorage.getItem("usuarios")
      ) || [];

    const existeUsuario =
      usuarios.find(
        (u) =>
          u.email.toLowerCase() ===
          email.toLowerCase()
      );

    if (existeUsuario) {
      alert(
        "Ya existe una cuenta con ese correo"
      );
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      email,
      password,
      fechaRegistro:
        new Date().toISOString(),
    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem(
      "usuarios",
      JSON.stringify(usuarios)
    );

    alert(
      "Cuenta creada correctamente"
    );

    navigate("/login");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Crear Prestamista</h1>

        <p className="login-subtitle">
          Registra una nueva cuenta
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) =>
              setNombre(e.target.value)
            }
            required
          />

          <input
            type="email"
            placeholder="Correo"
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

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmar}
            onChange={(e) =>
              setConfirmar(
                e.target.value
              )
            }
            required
          />

          <button type="submit">
            Crear Cuenta
          </button>
        </form>

        <div className="login-links">
          <Link to="/login">
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;