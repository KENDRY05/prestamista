import { useLocalStorage } from "../hooks/useLocalStorage";
import { jsPDF } from "jspdf";

function Reportes() {
  const [clientes] =
    useLocalStorage("clientes", []);

  const [prestamos] =
    useLocalStorage("prestamos", []);

  const [pagos] =
    useLocalStorage("pagos", []);

  const sesion = JSON.parse(
    localStorage.getItem("sesion")
  );

  const clientesUsuario =
    clientes.filter(
      (c) => c.usuarioId === sesion.id
    );

  const prestamosUsuario =
    prestamos.filter(
      (p) => p.usuarioId === sesion.id
    );

  const pagosUsuario =
    pagos.filter(
      (p) => p.usuarioId === sesion.id
    );

  const totalPrestado =
    prestamosUsuario.reduce(
      (acc, p) => acc + p.monto,
      0
    );

  const totalCobrado =
    pagosUsuario.reduce(
      (acc, p) => acc + p.monto,
      0
    );

  const totalPendiente =
    prestamosUsuario.reduce(
      (acc, p) =>
        acc + p.saldoPendiente,
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
      `Prestamista: ${sesion.nombre}`,
      20,
      40
    );

    doc.text(
      `Clientes: ${clientesUsuario.length}`,
      20,
      60
    );

    doc.text(
      `Prestamos: ${prestamosUsuario.length}`,
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
      `reporte-${sesion.nombre}.pdf`
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
            {
              clientesUsuario.length
            }
          </p>
        </div>

        <div className="card">
          <h3>Préstamos</h3>
          <p>
            {
              prestamosUsuario.length
            }
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