import { useState, useEffect } from "react";

import ClientForm from "../components/ClientForm";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [clienteEditando, setClienteEditando] =
    useState(null);

  const sesion = JSON.parse(
    localStorage.getItem("sesion")
  );

  const cargarClientes = async () => {
    try {
      const q = query(
        collection(db, "clientes"),
        where(
          "usuarioId",
          "==",
          sesion.uid
        )
      );

      const snapshot = await getDocs(q);

      const lista = snapshot.docs.map(
        (documento) => ({
          ...documento.data(),
          firestoreId: documento.id,
        })
      );

      setClientes(lista);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const agregarCliente = async (cliente) => {
    try {
      await addDoc(
        collection(db, "clientes"),
        {
          ...cliente,
          usuarioId: sesion.uid,
        }
      );

      await cargarClientes();
    } catch (error) {
      console.log(error);
    }
  };

  const actualizarCliente = async (
    clienteActualizado
  ) => {
    try {
      await updateDoc(
        doc(
          db,
          "clientes",
          clienteActualizado.firestoreId
        ),
        {
          nombre: clienteActualizado.nombre,
          telefono:
            clienteActualizado.telefono,
          direccion:
            clienteActualizado.direccion,
        }
      );

      setClienteEditando(null);
      await cargarClientes();
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarCliente = async (id) => {
    const confirmar = window.confirm(
      "¿Desea eliminar este cliente?"
    );

    if (!confirmar) return;

    try {
      await deleteDoc(
        doc(db, "clientes", id)
      );

      if (
        clienteEditando?.firestoreId === id
      ) {
        setClienteEditando(null);
      }

      await cargarClientes();
    } catch (error) {
      console.log(error);
    }
  };

  const iniciarEdicion = (cliente) => {
    setClienteEditando(cliente);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelarEdicion = () => {
    setClienteEditando(null);
  };

  const filtrados = clientes.filter((c) =>
    c.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="clientes-container">
      <h1>Clientes</h1>

      <div className="form-card">
        <ClientForm
          onAdd={agregarCliente}
          clienteEditando={clienteEditando}
          onUpdate={actualizarCliente}
          onCancelEdit={cancelarEdicion}
        />
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
              <th>Fecha de ingreso</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan="4">
                  No hay clientes registrados
                </td>
              </tr>
            ) : (
              filtrados.map((cliente) => (
                <tr
                  key={cliente.firestoreId}
                >
                  <td>{cliente.nombre}</td>

                  <td>{cliente.telefono}</td>

                  <td>{cliente.direccion}</td>

                  <td>
                    <button
                      className="btn-edit"
                      onClick={() =>
                        iniciarEdicion(cliente)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() =>
                        eliminarCliente(
                          cliente.firestoreId
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clientes;
