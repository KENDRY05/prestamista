import { useState, useEffect } from "react";
import PaymentForm from "../components/PaymentForm";
import { jsPDF } from "jspdf";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";

function Cobros() {
  const [clientes, setClientes] =
    useState([]);

  const [prestamos, setPrestamos] =
    useState([]);

  const [pagos, setPagos] =
    useState([]);

  const sesion = JSON.parse(
    localStorage.getItem("sesion")
  );

  const cargarClientes =
    async () => {
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

      setClientes(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };

  const cargarPrestamos = async () => {
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

  setPrestamos(
    snapshot.docs.map((documento) => ({
      ...documento.data(),
      firestoreId: documento.id,
    }))
  );
};

 const cargarPagos = async () => {
  const q = query(
    collection(db, "pagos"),
    where(
      "usuarioId",
      "==",
      sesion.uid
    )
  );

  const snapshot =
    await getDocs(q);

  setPagos(
    snapshot.docs.map((documento) => ({
      ...documento.data(),
      firestoreId: documento.id,
    }))
  );
};

  useEffect(() => {
    cargarClientes();
    cargarPrestamos();
    cargarPagos();
  }, []);

  const obtenerNombreCliente = (
    prestamoId
  ) => {
    const prestamo = prestamos.find(
      (p) =>
        String(p.id) ===
        String(prestamoId)
    );

    if (!prestamo)
      return "Cliente no encontrado";

    const cliente = clientes.find(
      (c) =>
        String(c.id) ===
        String(prestamo.clienteId)
    );

    return cliente
      ? cliente.nombre
      : "Cliente no encontrado";
  };

  const generarReciboPDF = (
    pago,
    prestamo,
    cliente
  ) => {
    const saldoRestante =
      Math.max(
        0,
        prestamo.saldoPendiente -
          pago.monto
      );

    const estado =
      saldoRestante <= 0
        ? "Pagado"
        : "Activo";

    const docPDF = new jsPDF();

    docPDF.setFontSize(18);

    docPDF.text(
      "RECIBO DE PAGO",
      65,
      20
    );

    docPDF.setFontSize(12);

    docPDF.text(
      `Recibo No: ${pago.id}`,
      20,
      40
    );

    docPDF.text(
      `Fecha: ${pago.fecha}`,
      20,
      50
    );

    docPDF.text(
      `Cliente: ${cliente.nombre}`,
      20,
      60
    );

    docPDF.text(
      `Monto Prestamo: $${Number(
        prestamo.monto
      ).toFixed(2)}`,
      20,
      70
    );

    docPDF.text(
      `Pago Realizado: $${Number(
        pago.monto
      ).toFixed(2)}`,
      20,
      80
    );

    docPDF.text(
      `Saldo Pendiente: $${saldoRestante.toFixed(
        2
      )}`,
      20,
      90
    );

    docPDF.text(
      `Estado: ${estado}`,
      20,
      100
    );

    docPDF.line(
      20,
      130,
      80,
      130
    );

    docPDF.text(
      "Firma Prestamista",
      20,
      140
    );

    docPDF.save(
      `recibo-${cliente.nombre}.pdf`
    );
  };

  const registrarPago =
    async (pago) => {
      const prestamoActual =
        prestamos.find(
          (p) =>
            String(p.id) ===
            String(
              pago.prestamoId
            )
        );

      if (!prestamoActual)
        return;

      const clienteActual =
        clientes.find(
          (c) =>
            String(c.id) ===
            String(
              prestamoActual.clienteId
            )
        );

      const nuevoSaldo =
        prestamoActual.saldoPendiente -
        pago.monto;

      await updateDoc(
        doc(
          db,
          "prestamos",
      prestamoActual.firestoreId
        ),
        {
          saldoPendiente:
            nuevoSaldo <= 0
              ? 0
              : nuevoSaldo,

          cuotasPagadas:
            (prestamoActual.cuotasPagadas ||
              0) + 1,

          estado:
            nuevoSaldo <= 0
              ? "Pagado"
              : "Activo",
        }
      );

      await addDoc(
        collection(db, "pagos"),
        {
          ...pago,
          usuarioId:
            sesion.uid,
        }
      );

      generarReciboPDF(
        pago,
        prestamoActual,
        clienteActual
      );

      cargarPrestamos();
      cargarPagos();
    };

 const eliminarPago =
  async (pagoEliminar) => {
    const confirmar =
      window.confirm(
        "¿Desea eliminar este cobro?"
      );

    if (!confirmar)
      return;

    const prestamo =
      prestamos.find(
        (p) =>
          String(p.id) ===
          String(
            pagoEliminar.prestamoId
          )
      );

    if (prestamo) {
      await updateDoc(
        doc(
          db,
          "prestamos",
          prestamo.firestoreId
        ),
        {
          saldoPendiente:
            prestamo.saldoPendiente +
            pagoEliminar.monto,

          cuotasPagadas:
            Math.max(
              0,
              (prestamo.cuotasPagadas ||
                0) - 1
            ),

          estado: "Activo",
        }
      );
    }
    
    await deleteDoc(
      doc(
        db,
        "pagos",
        pagoEliminar.firestoreId
      )
    );

    cargarPrestamos();
    cargarPagos();
  };
    const convertirFecha = (fecha) => {
    if (!fecha) return new Date(0);

    const partes = fecha
      .split("/")
      .map(Number);

    if (partes.length !== 3) {
      return new Date(0);
    }

    const [dia, mes, anio] = partes;

    return new Date(
      anio,
      mes - 1,
      dia
    );
  };

  const pagosOrdenados = [...pagos].sort(
    (a, b) =>
      convertirFecha(b.fecha) -
      convertirFecha(a.fecha)
  );
  return (
    <div>
      <h1 className="page-header">
        Cobros
      </h1>

      <div className="form-card">
        <PaymentForm
          prestamos={prestamos}
          clientes={clientes}
          onAdd={registrarPago}
        />
      </div>

      <div className="table-card">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pagosOrdenados.length ===
            0 ? (
              <tr>
                <td colSpan="4">
                  No hay cobros
                  registrados
                </td>
              </tr>
            ) : (
              pagosOrdenados.map(
                (pago) => (
                  <tr key={pago.id}>
                    <td>
                      {pago.fecha}
                    </td>

                    <td>
                      {obtenerNombreCliente(
                        pago.prestamoId
                      )}
                    </td>

                    <td>
                      $
                      {Number(
                        pago.monto
                      ).toFixed(2)}
                    </td>

                    <td>
                      <button
                        className="btn-delete"
                        onClick={() =>
                          eliminarPago(
                            pago
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

export default Cobros;
