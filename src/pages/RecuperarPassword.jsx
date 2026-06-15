import { useState } from "react";
import { Link } from "react-router-dom";

import {
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase/config";

function RecuperarPassword() {
  const [email, setEmail] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(
        auth,
        email
      );

      alert(
        "Se envió un correo para restablecer tu contraseña."
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>🔑 Recuperar Contraseña</h1>

        <p className="login-subtitle">
          Ingresa tu correo electrónico
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

          <button type="submit">
            Enviar enlace
          </button>

        </form>

        <div className="login-links">
          <Link to="/login">
            Volver al login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default RecuperarPassword;