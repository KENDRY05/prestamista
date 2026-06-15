import { useEffect, useState } from "react";

import LoanForm from "../components/LoanForm";

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

function Prestamos() {
  const [clientes, setClientes] =
    useState([]);

  const [prestamos, setPrestamos] =
    useState([]);

  const sesion = JSON.parse(
    localStorage.getItem("sesion")
  );

  const cargarClientes =
    async () => {
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
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setClientes(lista);
      } catch (error) {
        console.log(error);
      }
    };

  const cargarPrestamos =
  async () => {
    try {
      const q = query(
        collection(db, "prestamos"),
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
          firestoreId:
            documento.id,
        }));

      setPrestamos(lista);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    cargarClientes();
    cargarPrestamos();
  }, []);

  const agregarPrestamo =
    async (prestamo) => {
      try {
        await addDoc(
          collection(
            db,
            "prestamos"
          ),
          {
            ...prestamo,
            usuarioId:
              sesion.uid,
          }
        );

        cargarPrestamos();
      } catch (error) {
        console.log(error);
      }
    };

  const eliminarPrestamo =
  async (id) => {
    try {
      await deleteDoc(
        doc(
          db,
          "prestamos",
          id
        )
      );

      cargarPrestamos();
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerNombreCliente =
    (clienteId) => {
      const cliente =
        clientes.find(
          (c) =>
            String(c.id) ===
            String(clienteId)
        );

      return cliente
        ? cliente.nombre
        : "Cliente no encontrado";
    };

  return (
    <div>
      <h1 className="page-header">
        Préstamos
      </h1>

      <div className="form-card">
        <LoanForm
          clientes={clientes}
          onAdd={
            agregarPrestamo
          }
        />
      </div>

      <div className="table-card">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Interés</th>
              <th>Total</th>
              <th>Cuota</th>
              <th>Saldo</th>
              <th>Cuotas</th>
              <th>Pagadas</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {prestamos.length ===
            0 ? (
              <tr>
                <td colSpan="10">
                  No hay préstamos
                  registrados
                </td>
              </tr>
            ) : (
              prestamos.map(
                (prestamo) => (
                  <tr
                    key={
                      prestamo.id
                    }
                  >
                    <td>
                      {obtenerNombreCliente(
                        prestamo.clienteId
                      )}
                    </td>

                    <td>
                      $
                      {Number(
                        prestamo.monto
                      ).toFixed(2)}
                    </td>

                    <td>
                      $
                      {Number(
                        prestamo.interesGenerado
                      ).toFixed(2)}
                    </td>

                    <td>
                      $
                      {Number(
                        prestamo.totalPagar
                      ).toFixed(2)}
                    </td>

                    <td>
                      $
                      {Number(
                        prestamo.valorCuota
                      ).toFixed(2)}
                    </td>

                    <td>
                      $
                      {Number(
                        prestamo.saldoPendiente
                      ).toFixed(2)}
                    </td>

                    <td>
                      {
                        prestamo.cuotas
                      }
                    </td>

                    <td>
                      {prestamo.cuotasPagadas ||
                        0}
                    </td>

                    <td>
                      <span
                        className={
                          prestamo.estado ===
                          "Pagado"
                            ? "estado-pagado"
                            : "estado-activo"
                        }
                      >
                        {
                          prestamo.estado
                        }
                      </span>
                    </td>

                    <td>
                      <button
  className="btn-delete"
  onClick={() =>
    eliminarPrestamo(
      prestamo.firestoreId
    )
  }
>
  Eliminar
</button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Prestamos;