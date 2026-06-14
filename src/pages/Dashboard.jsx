import { useLocalStorage } from "../hooks/useLocalStorage";

function Dashboard() {
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

  const pagosUsuario = pagos.filter(
    (p) => p.usuarioId === sesion.id
  );

  const totalPrestado =
    prestamosUsuario.reduce(
      (total, prestamo) =>
        total + prestamo.monto,
      0
    );

  const totalCobrado =
    pagosUsuario.reduce(
      (total, pago) =>
        total + pago.monto,
      0
    );

  return (
    <>
      <h1>
        Bienvenido,
        {" "}
        {sesion.nombre}
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
          <h3>Cobros</h3>
          <p>
            {pagosUsuario.length}
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