import { useState } from "react";

function ClientForm({ onAdd }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoCliente = {
      id: Date.now(),
      nombre,
      telefono,
      direccion,
    };

    onAdd(nuevoCliente);

    setNombre("");
    setTelefono("");
    setDireccion("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nuevo Cliente</h2>

      <div className="form-group">
        <label>Nombre</label>

        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
          required
        />
      </div>

      <div className="form-group">
        <label>Teléfono</label>

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) =>
            setTelefono(e.target.value)
          }
        />
      </div>

      <div className="form-group">
        <label>Dirección</label>

        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) =>
            setDireccion(e.target.value)
          }
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
      >
        Guardar Cliente
      </button>
    </form>
  );
}

export default ClientForm;