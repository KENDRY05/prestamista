import PaymentForm from "../components/PaymentForm";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { jsPDF } from "jspdf";

function Cobros() {
  const [clientes] =
    useLocalStorage("clientes", []);

  const [prestamos, setPrestamos] =
    useLocalStorage("prestamos", []);

  const [pagos, setPagos] =
    useLocalStorage("pagos", []);

  const sesion = JSON.parse(
    localStorage.getItem("sesion")
  );

  const prestamosUsuario =
    prestamos.filter(
      (p) => p.usuarioId === sesion.id
    );

  const pagosUsuario = pagos.filter(
    (p) => p.usuarioId === sesion.id
  );

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
    const saldoRestante = Math.max(
      0,
      prestamo.saldoPendiente - pago.monto
    );

    const estado =
      saldoRestante <= 0
        ? "Pagado"
        : "Activo";

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(
      "RECIBO DE PAGO",
      65,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Recibo No: ${pago.id}`,
      20,
      40
    );

    doc.text(
      `Fecha: ${pago.fecha}`,
      20,
      50
    );

    doc.text(
      `Cliente: ${cliente.nombre}`,
      20,
      60
    );

    doc.text(
      `Monto Prestamo: $${prestamo.monto.toFixed(
        2
      )}`,
      20,
      70
    );

    doc.text(
      `Pago Realizado: $${pago.monto.toFixed(
        2
      )}`,
      20,
      80
    );

    doc.text(
      `Saldo Pendiente: $${saldoRestante.toFixed(
        2
      )}`,
      20,
      90
    );

    doc.text(
      `Estado: ${estado}`,
      20,
      100
    );

    doc.line(
      20,
      130,
      80,
      130
    );

    doc.text(
      "Firma Prestamista",
      20,
      140
    );

    doc.save(
      `recibo-${cliente.nombre}-${pago.id}.pdf`
    );
  };

  const registrarPago = (pago) => {
    const prestamoActual =
      prestamos.find(
        (p) =>
          String(p.id) ===
          String(pago.prestamoId)
      );

    if (!prestamoActual) return;

    const clienteActual =
      clientes.find(
        (c) =>
          String(c.id) ===
          String(
            prestamoActual.clienteId
          )
      );

    const nuevosPrestamos =
      prestamos.map((prestamo) => {
        if (
          String(prestamo.id) ===
          String(pago.prestamoId)
        ) {
          const nuevoSaldo =
            prestamo.saldoPendiente -
            pago.monto;

          return {
            ...prestamo,

            saldoPendiente:
              nuevoSaldo <= 0
                ? 0
                : nuevoSaldo,

            cuotasPagadas:
              (prestamo.cuotasPagadas ||
                0) + 1,

            estado:
              nuevoSaldo <= 0
                ? "Pagado"
                : "Activo",
          };
        }

        return prestamo;
      });

    setPrestamos(
      nuevosPrestamos
    );

    const pagoConUsuario = {
      ...pago,
      usuarioId: sesion.id,
    };

    setPagos([
      ...pagos,
      pagoConUsuario,
    ]);

    generarReciboPDF(
      pago,
      prestamoActual,
      clienteActual
    );
  };

  const eliminarPago = (
    pagoEliminar
  ) => {
    const confirmar =
      window.confirm(
        "¿Desea eliminar este cobro?"
      );

    if (!confirmar) return;

    const nuevosPrestamos =
      prestamos.map((prestamo) => {
        if (
          String(prestamo.id) ===
          String(
            pagoEliminar.prestamoId
          )
        ) {
          return {
            ...prestamo,

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
          };
        }

        return prestamo;
      });

    setPrestamos(
      nuevosPrestamos
    );

    setPagos(
      pagos.filter(
        (p) =>
          p.id !== pagoEliminar.id
      )
    );
  };

  return (
    <div>
      <h1 className="page-header">
        Cobros
      </h1>

      <div className="form-card">
        <PaymentForm
          prestamos={
            prestamosUsuario
          }
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
            {pagosUsuario.length ===
            0 ? (
              <tr>
                <td colSpan="4">
                  No hay cobros
                  registrados
                </td>
              </tr>
            ) : (
              pagosUsuario.map(
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
                      {pago.monto.toFixed(
                        2
                      )}
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