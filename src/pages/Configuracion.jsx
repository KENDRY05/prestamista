import { useNavigate } from "react-router-dom";

function Configuracion() {
  const navigate = useNavigate();

  const sesion = JSON.parse(
    localStorage.getItem("sesion")
  );

  const cerrarSesion = () => {
    localStorage.removeItem("sesion");

    navigate("/login");
  };

  const exportarRespaldo = () => {
    const respaldo = {
      usuarios: JSON.parse(
        localStorage.getItem("usuarios")
      ) || [],

      clientes: JSON.parse(
        localStorage.getItem("clientes")
      ) || [],

      prestamos: JSON.parse(
        localStorage.getItem("prestamos")
      ) || [],

      pagos: JSON.parse(
        localStorage.getItem("pagos")
      ) || [],
    };

    const blob = new Blob(
      [JSON.stringify(respaldo, null, 2)],
      {
        type: "application/json",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      "prestamista-backup.json";

    a.click();
  };

  const importarRespaldo = (e) => {
    const archivo =
      e.target.files[0];

    if (!archivo) return;

    const reader = new FileReader();

    reader.onload = (evento) => {
      const datos = JSON.parse(
        evento.target.result
      );

      localStorage.setItem(
        "usuarios",
        JSON.stringify(
          datos.usuarios || []
        )
      );

      localStorage.setItem(
        "clientes",
        JSON.stringify(
          datos.clientes || []
        )
      );

      localStorage.setItem(
        "prestamos",
        JSON.stringify(
          datos.prestamos || []
        )
      );

      localStorage.setItem(
        "pagos",
        JSON.stringify(
          datos.pagos || []
        )
      );

      alert(
        "Respaldo restaurado correctamente"
      );

      window.location.reload();
    };

    reader.readAsText(archivo);
  };

  return (
    <div>
      <h1 className="page-header">
        Configuración
      </h1>

      <div className="form-card">
        <h3>Información</h3>

        <p>
          <strong>Nombre:</strong>{" "}
          {sesion?.nombre}
        </p>

        <p>
          <strong>Correo:</strong>{" "}
          {sesion?.email}
        </p>
      </div>

      <br />

      <div className="form-card">
        <h3>Respaldo</h3>

        <button
          className="btn-primary"
          onClick={exportarRespaldo}
        >
          Exportar Respaldo
        </button>

        <br />
        <br />

        <input
          type="file"
          accept=".json"
          onChange={
            importarRespaldo
          }
        />
      </div>

      <br />

      <button
        className="btn-logout"
        onClick={cerrarSesion}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Configuracion;