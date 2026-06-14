import LoanForm from "../components/LoanForm";
import { useLocalStorage } from "../hooks/useLocalStorage";

function Prestamos() {
  const [clientes] = useLocalStorage(
    "clientes",
    []
  );

  const [prestamos, setPrestamos] =
    useLocalStorage("prestamos", []);

  const sesion = JSON.parse(
    localStorage.getItem("sesion")
  );

  const agregarPrestamo = (prestamo) => {
    const nuevoPrestamo = {
      ...prestamo,
      usuarioId: sesion.id,
    };

    setPrestamos([
      ...prestamos,
      nuevoPrestamo,
    ]);
  };

  const eliminarPrestamo = (id) => {
    const nuevosPrestamos =
      prestamos.filter(
        (prestamo) => prestamo.id !== id
      );

    setPrestamos(nuevosPrestamos);
  };

  const obtenerNombreCliente = (
    clienteId
  ) => {
    const cliente = clientes.find(
      (c) =>
        String(c.id) ===
        String(clienteId)
    );

    return cliente
      ? cliente.nombre
      : "Cliente no encontrado";
  };

  const clientesUsuario =
    clientes.filter(
      (c) => c.usuarioId === sesion.id
    );

  const prestamosUsuario =
    prestamos.filter(
      (p) => p.usuarioId === sesion.id
    );

  return (
    <div>
      <h1 className="page-header">
        Préstamos
      </h1>

      <div className="form-card">
        <LoanForm
          clientes={clientesUsuario}
          onAdd={agregarPrestamo}
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
            {prestamosUsuario.length ===
            0 ? (
              <tr>
                <td colSpan="10">
                  No hay préstamos registrados
                </td>
              </tr>
            ) : (
              prestamosUsuario.map(
                (prestamo) => (
                  <tr key={prestamo.id}>
                    <td>
                      {obtenerNombreCliente(
                        prestamo.clienteId
                      )}
                    </td>

                    <td>
                      $
                      {prestamo.monto.toFixed(
                        2
                      )}
                    </td>

                    <td>
                      $
                      {prestamo.interesGenerado.toFixed(
                        2
                      )}
                    </td>

                    <td>
                      $
                      {prestamo.totalPagar.toFixed(
                        2
                      )}
                    </td>

                    <td>
                      $
                      {prestamo.valorCuota.toFixed(
                        2
                      )}
                    </td>

                    <td>
                      $
                      {prestamo.saldoPendiente.toFixed(
                        2
                      )}
                    </td>

                    <td>
                      {prestamo.cuotas}
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
                        {prestamo.estado}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn-delete"
                        onClick={() =>
                          eliminarPrestamo(
                            prestamo.id
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