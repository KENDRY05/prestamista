import { useState } from "react";
import ClientForm from "../components/ClientForm";
import { useLocalStorage } from "../hooks/useLocalStorage";

function Clientes() {
  const [clientes, setClientes] =
    useLocalStorage("clientes", []);

  const [busqueda, setBusqueda] =
    useState("");

  const [editandoId, setEditandoId] =
    useState(null);

  const [nombreEdit, setNombreEdit] =
    useState("");

  const [telefonoEdit, setTelefonoEdit] =
    useState("");

  const [direccionEdit, setDireccionEdit] =
    useState("");

  const agregarCliente = (cliente) => {
  const sesion = JSON.parse(
    localStorage.getItem("sesion")
  );

  const nuevoCliente = {
    ...cliente,
    usuarioId: sesion.id,
  };

  setClientes([
    ...clientes,
    nuevoCliente,
  ]);
};

  const eliminarCliente = (id) => {
    const confirmar = window.confirm(
      "¿Eliminar cliente?"
    );

    if (!confirmar) return;

    setClientes(
      clientes.filter((c) => c.id !== id)
    );
  };

  const iniciarEdicion = (cliente) => {
    setEditandoId(cliente.id);
    setNombreEdit(cliente.nombre);
    setTelefonoEdit(cliente.telefono);
    setDireccionEdit(cliente.direccion);
  };

  const guardarEdicion = () => {
    const nuevosClientes =
      clientes.map((cliente) => {
        if (cliente.id === editandoId) {
          return {
            ...cliente,
            nombre: nombreEdit,
            telefono: telefonoEdit,
            direccion: direccionEdit,
          };
        }

        return cliente;
      });

    setClientes(nuevosClientes);

    setEditandoId(null);
    setNombreEdit("");
    setTelefonoEdit("");
    setDireccionEdit("");
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
  };

 const sesion = JSON.parse(
  localStorage.getItem("sesion")
);

const filtrados = clientes.filter(
  (c) =>
    c.usuarioId === sesion.id &&
    c.nombre
      .toLowerCase()
      .includes(
        busqueda.toLowerCase()
      )
);

  return (
    <div className="clientes-container">
      <h1>Clientes</h1>

      <div className="form-card">
        <ClientForm onAdd={agregarCliente} />
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="🔍 Buscar cliente..."
        value={busqueda}
        onChange={(e) =>
          setBusqueda(e.target.value)
        }
      />

      <div className="table-card">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>
                  {editandoId === cliente.id ? (
                    <input
                      value={nombreEdit}
                      onChange={(e) =>
                        setNombreEdit(
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    cliente.nombre
                  )}
                </td>

                <td>
                  {editandoId === cliente.id ? (
                    <input
                      value={telefonoEdit}
                      onChange={(e) =>
                        setTelefonoEdit(
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    cliente.telefono
                  )}
                </td>

                <td>
                  {editandoId === cliente.id ? (
                    <input
                      value={direccionEdit}
                      onChange={(e) =>
                        setDireccionEdit(
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    cliente.direccion
                  )}
                </td>

                <td>
                  {editandoId === cliente.id ? (
                    <>
                      <button
                        className="btn-primary"
                        onClick={
                          guardarEdicion
                        }
                      >
                        Guardar
                      </button>

                      <button
                        className="btn-delete"
                        onClick={
                          cancelarEdicion
                        }
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-edit"
                        onClick={() =>
                          iniciarEdicion(
                            cliente
                          )
                        }
                      >
                        Editar
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() =>
                          eliminarCliente(
                            cliente.id
                          )
                        }
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clientes;