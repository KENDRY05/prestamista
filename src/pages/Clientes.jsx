import { useState, useEffect } from "react";

import ClientForm from "../components/ClientForm";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";

function Clientes() {
  const [clientes, setClientes] = useState([]);

  const [busqueda, setBusqueda] =
    useState("");

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

    const snapshot =
      await getDocs(q);

    const lista =
      snapshot.docs.map((documento) => ({
        ...documento.data(),
        firestoreId: documento.id,
      }));

    setClientes(lista);
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    cargarClientes();
  }, []);

  const agregarCliente =
    async (cliente) => {
      try {
        await addDoc(
          collection(db, "clientes"),
          {
            ...cliente,
            usuarioId:
              sesion.uid,
          }
        );

        cargarClientes();
      } catch (error) {
        console.log(error);
      }
    };

  const eliminarCliente =
  async (id) => {
    try {
      await deleteDoc(
        doc(
          db,
          "clientes",
          id
        )
      );

      cargarClientes();
    } catch (error) {
      console.log(error);
    }
  };

  const filtrados =
    clientes.filter((c) =>
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
        <ClientForm
          onAdd={agregarCliente}
        />
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="🔍 Buscar cliente..."
        value={busqueda}
        onChange={(e) =>
          setBusqueda(
            e.target.value
          )
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
            {filtrados.map(
              (cliente) => (
                <tr
                  key={cliente.id}
                >
                  <td>
                    {cliente.nombre}
                  </td>

                  <td>
                    {
                      cliente.telefono
                    }
                  </td>

                  <td>
                    {
                      cliente.direccion
                    }
                  </td>

                  <td>
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
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clientes;