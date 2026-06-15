import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";

function Reportes() {
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
      (acc, p) =>
        acc + Number(p.monto || 0),
      0
    );

  const totalCobrado =
    pagos.reduce(
      (acc, p) =>
        acc + Number(p.monto || 0),
      0
    );

  const totalPendiente =
    prestamos.reduce(
      (acc, p) =>
        acc +
        Number(
          p.saldoPendiente || 0
        ),
      0
    );

  const exportarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Reporte General",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Usuario: ${sesion.email}`,
      20,
      40
    );

    doc.text(
      `Clientes: ${clientes.length}`,
      20,
      60
    );

    doc.text(
      `Prestamos: ${prestamos.length}`,
      20,
      75
    );

    doc.text(
      `Total Prestado: $${totalPrestado.toFixed(
        2
      )}`,
      20,
      90
    );

    doc.text(
      `Total Cobrado: $${totalCobrado.toFixed(
        2
      )}`,
      20,
      105
    );

    doc.text(
      `Saldo Pendiente: $${totalPendiente.toFixed(
        2
      )}`,
      20,
      120
    );

    doc.save(
      `reporte-${sesion.email}.pdf`
    );
  };

  return (
    <div>
      <h1 className="page-header">
        Reportes
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
          <h3>Cobrado</h3>
          <p>
            $
            {totalCobrado.toFixed(
              2
            )}
          </p>
        </div>

        <div className="card">
          <h3>Pendiente</h3>
          <p>
            $
            {totalPendiente.toFixed(
              2
            )}
          </p>
        </div>

      </div>

      <br />

      <button
        className="btn-primary"
        onClick={exportarPDF}
      >
        Exportar PDF
      </button>
    </div>
  );
}

export default Reportes;