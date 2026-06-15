import { useState } from "react";

function PaymentForm({
  prestamos,
  clientes,
  onAdd,
}) {
  const [prestamoId, setPrestamoId] =
    useState("");

  const [monto, setMonto] =
    useState("");

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
      : "Cliente";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const pago = {
      id: Date.now(),
      prestamoId,
      monto: Number(monto),
      fecha:
        new Date().toLocaleDateString(),
    };

    onAdd(pago);

    setPrestamoId("");
    setMonto("");
  };

  return (
    <form
      className="form-row"
      onSubmit={handleSubmit}
    >
      <select
        value={prestamoId}
        onChange={(e) =>
          setPrestamoId(
            e.target.value
          )
        }
        required
      >
        <option value="">
          Seleccione préstamo
        </option>

        {prestamos
          .filter(
            (p) =>
              p.estado !== "Pagado"
          )
          .map((prestamo) => (
            <option
              key={prestamo.id}
              value={prestamo.id}
            >
              {obtenerNombreCliente(
                prestamo.clienteId
              )}
              {" - Saldo: $"}
              {prestamo.saldoPendiente.toFixed(
                2
              )}
            </option>
          ))}
      </select>

      <input
        type="number"
        placeholder="Monto pagado"
        value={monto}
        onChange={(e) =>
          setMonto(e.target.value)
        }
        required
      />

      <button
        className="btn-primary"
        type="submit"
      >
        Registrar Pago
      </button>
    </form>
  );
}

export default PaymentForm;