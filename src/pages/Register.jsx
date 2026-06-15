import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase/config";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert(
        "Cuenta creada correctamente"
      );

      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>💰 Prestamista Pro</h1>

        <p className="login-subtitle">
          Crear cuenta de prestamista
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
              setPassword(
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