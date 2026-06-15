import { useState, useEffect } from "react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";

function Dashboard() {
  const [clientes, setClientes] =
    useState([]);

  const [prestamos, setPrestamos] =
    useState([]);

  const [pagos, setPagos] =
    useState([]);

  const sesion = JSON.parse(
    localStorage.getItem("sesion")
  );

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos =
    async () => {

      const clientesQuery = query(
        collection(db, "clientes"),
        where(
          "usuarioId",
          "==",
          sesion.uid
        )
      );

      const prestamosQuery = query(
        collection(db, "prestamos"),
        where(
          "usuarioId",
          "==",
          sesion.uid
        )
      );

      const pagosQuery = query(
        collection(db, "pagos"),
        where(
          "usuarioId",
          "==",
          sesion.uid
        )
      );

      const clientesSnap =
        await getDocs(
          clientesQuery
        );

      const prestamosSnap =
        await getDocs(
          prestamosQuery
        );

      const pagosSnap =
        await getDocs(
          pagosQuery
        );

      setClientes(
        clientesSnap.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        )
      );

      setPrestamos(
        prestamosSnap.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        )
      );

      setPagos(
        pagosSnap.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        )
      );
    };

  const totalPrestado =
    prestamos.reduce(
      (total, prestamo) =>
        total +
        Number(
          prestamo.monto || 0
        ),
      0
    );

  const totalCobrado =
    pagos.reduce(
      (total, pago) =>
        total +
        Number(
          pago.monto || 0
        ),
      0
    );

  return (
    <>
      <h1>
        Bienvenido,
        {" "}
        {sesion.email}
      </h1>

      <div className="cards">

        <div className="card">
          <h3>Clientes</h3>
          <p>
            {clientes.length}
          </p>
        </div>

        <div className="card">
          <h3>Préstamos</h3>
          <p>
            {prestamos.length}
          </p>
        </div>

        <div className="card">
          <h3>Cobros</h3>
          <p>
            {pagos.length}
          </p>
        </div>

        <div className="card">
          <h3>Total Prestado</h3>
          <p>
            $
            {totalPrestado.toFixed(
              2
            )}
          </p>
        </div>

        <div className="card">
          <h3>Total Cobrado</h3>
          <p>
            $
            {totalCobrado.toFixed(
              2
            )}
          </p>
        </div>

      </div>
    </>
  );
}

export default Dashboard;