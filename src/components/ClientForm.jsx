import { useEffect, useState } from "react";

function ClientForm({
  onAdd,
  clienteEditando,
  onUpdate,
  onCancelEdit,
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  useEffect(() => {
    if (clienteEditando) {
      setNombre(clienteEditando.nombre || "");
      setTelefono(clienteEditando.telefono || "");
      setDireccion(clienteEditando.direccion || "");
    } else {
      setNombre("");
      setTelefono("");
      setDireccion("");
    }
  }, [clienteEditando]);

  const limpiarFormulario = () => {
    setNombre("");
    setTelefono("");
    setDireccion("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosCliente = {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
    };

    if (clienteEditando) {
      await onUpdate({
        ...clienteEditando,
        ...datosCliente,
      });
    } else {
      await onAdd({
        id: Date.now(),
        ...datosCliente,
      });
    }

    limpiarFormulario();
  };

  const cancelarEdicion = () => {
    limpiarFormulario();
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        {clienteEditando
          ? "Editar Cliente"
          : "Nuevo Cliente"}
      </h2>

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
        <label>Fecha de ingreso</label>

        <input
          type="text"
          placeholder="Fecha de ingreso"
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
        {clienteEditando
          ? "Actualizar Cliente"
          : "Guardar Cliente"}
      </button>

      {clienteEditando && (
        <button
          type="button"
          className="btn-delete"
          onClick={cancelarEdicion}
          style={{ marginLeft: "10px" }}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}

export default ClientForm;
