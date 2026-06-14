import { useState } from "react";

function LoanForm({ clientes, onAdd }) {
  const [clienteId, setClienteId] = useState("");
  const [monto, setMonto] = useState("");
  const [interes, setInteres] = useState("");
  const [cuotas, setCuotas] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const montoNum = Number(monto);
    const interesNum = Number(interes);
    const cuotasNum = Number(cuotas);

    const interesGenerado =
      montoNum * (interesNum / 100);

    const totalPagar =
      montoNum + interesGenerado;

    const valorCuota =
      totalPagar / cuotasNum;

    const prestamo = {
  id: Date.now(),
  clienteId,
  monto: montoNum,
  interes: interesNum,
  cuotas: cuotasNum,
  interesGenerado,
  totalPagar,
  valorCuota,
  saldoPendiente: totalPagar,
  cuotasPagadas: 0,
  estado: "Activo",

  fechaCreacion: new Date().toISOString(),
};

    onAdd(prestamo);

    setClienteId("");
    setMonto("");
    setInteres("");
    setCuotas("");
  };

  return (
  <form onSubmit={handleSubmit}>
    <div className="form-row">
      <select
        value={clienteId}
        onChange={(e) =>
          setClienteId(e.target.value)
        }
        required
      >
        <option value="">
          Seleccione cliente
        </option>

        {clientes.map((cliente) => (
          <option
            key={cliente.id}
            value={cliente.id}
          >
            {cliente.nombre}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Monto"
        value={monto}
        onChange={(e) =>
          setMonto(e.target.value)
        }
        required
      />

      <input
        type="number"
        placeholder="Interés %"
        value={interes}
        onChange={(e) =>
          setInteres(e.target.value)
        }
        required
      />

      <input
        type="number"
        placeholder="Cuotas"
        value={cuotas}
        onChange={(e) =>
          setCuotas(e.target.value)
        }
        required
      />
    </div>

    <br />

    <button
      type="submit"
      className="btn-primary"
    >
      Crear Préstamo
    </button>
  </form>
);
}

export default LoanForm;