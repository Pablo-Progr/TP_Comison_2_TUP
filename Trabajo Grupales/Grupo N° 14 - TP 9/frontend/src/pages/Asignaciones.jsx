import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import usePagination from "../hooks/usePagination";
import clubService from "../services/clubService";
import "../styles/Asignaciones.css";

export default function Asignaciones() {
  const navigate = useNavigate();

  // Hook para obtener todas las asignaciones
  const {
    data: asignaciones,
    loading,
    error,
    refetch,
  } = useFetch({
    autoFetch: true,
    fetchFn: clubService.getAsignaciones,
  });

  // Hook para paginación (10 asignaciones por página)
  const {
    currentData: asignacionesPaginadas,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
  } = usePagination(asignaciones || [], 10);

  // Estados para búsqueda de deportes por socio
  const [socioIdBuscar, setSocioIdBuscar] = useState("");
  const {
    data: deportesSocio,
    loading: loadingSearch,
    fetchData: buscarDeportes,
  } = useFetch({
    autoFetch: false,
    fetchFn: () => clubService.getDeportesBySocio(socioIdBuscar),
  });

  // Estados para asignar/desasignar
  const [socioId, setSocioId] = useState("");
  const [deporteId, setDeporteId] = useState("");
  const [operationSuccess, setOperationSuccess] = useState("");
  const [operationError, setOperationError] = useState("");

  const handleBuscarDeportes = async () => {
    if (!socioIdBuscar) return;
    await buscarDeportes();
  };

  const handleAsignar = async () => {
    if (!socioId || !deporteId) {
      setOperationError("Debe ingresar ID de socio y deporte");
      return;
    }

    try {
      setOperationError("");
      setOperationSuccess("");
      await clubService.assignDeporte(socioId, deporteId);
      setOperationSuccess("Deporte asignado con éxito");
      setSocioId("");
      setDeporteId("");
      refetch();
    } catch (err) {
      console.error("Error al asignar:", err);
      setOperationError(`Error: ${err.message}`);
    }
  };

  const handleDesasignar = async () => {
    if (!socioId || !deporteId) {
      setOperationError("Debe ingresar ID de socio y deporte");
      return;
    }

    try {
      setOperationError("");
      setOperationSuccess("");
      await clubService.unassignDeporte(socioId, deporteId);
      setOperationSuccess("Deporte desasignado con éxito");
      setSocioId("");
      setDeporteId("");
      refetch();
    } catch (err) {
      console.error("Error al desasignar:", err);
      setOperationError(`Error: ${err.message}`);
    }
  };

  return (
    <div className="asignaciones-container">
      <div className="asignaciones-header">
        <h1>🔗 Asignaciones Socios - Deportes</h1>
        <button onClick={() => navigate("/dashboard")} className="back-button">
          ← Volver al Dashboard
        </button>
      </div>

      <div className="asignaciones-content">
        {/* Listado general */}
        <div className="asignaciones-card">
          <h2>📋 Todas las Asignaciones</h2>
          {loading ? (
            <p>Cargando asignaciones...</p>
          ) : error ? (
            <p className="empty-message" style={{ color: "red" }}>
              Error al cargar asignaciones
            </p>
          ) : asignacionesPaginadas.length > 0 ? (
            <>
              <div className="table-wrapper">
                <table className="asignaciones-table">
                  <thead>
                    <tr>
                      <th>Socio</th>
                      <th>DNI</th>
                      <th>Deporte</th>
                      <th>Cuota Mensual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asignacionesPaginadas.map((a) => (
                      <tr key={a.id}>
                        <td>{a.socio_nombre}</td>
                        <td>{a.dni}</td>
                        <td>{a.deporte_nombre}</td>
                        <td>${a.cuota_mensual}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Controles de paginación */}
              {totalPages > 1 && (
                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <button
                    className="search-button"
                    onClick={previousPage}
                    disabled={currentPage === 1}
                  >
                    ← Anterior
                  </button>
                  <span>
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    className="search-button"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="empty-message">No hay asignaciones registradas</p>
          )}
        </div>

        {/* deportes de un socio */}
        <div className="asignaciones-card">
          <h2>🔍 Buscar Deportes de un Socio</h2>
          <div className="search-section">
            <div className="search-controls">
              <input
                className="search-input"
                placeholder="Ingresa el ID del socio"
                value={socioIdBuscar}
                onChange={(e) => setSocioIdBuscar(e.target.value)}
              />
              <button
                onClick={handleBuscarDeportes}
                className="search-button"
                disabled={loadingSearch || !socioIdBuscar}
              >
                Buscar
              </button>
            </div>

            {deportesSocio && deportesSocio.length > 0 && (
              <ul className="deportes-list">
                {deportesSocio.map((d) => (
                  <li key={d.id}>
                    <strong>{d.nombre}</strong> - ${d.cuota_mensual}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* asignar o desasignar */}
        <div className="asignaciones-card">
          <h2>⚙️ Asignar / Desasignar Deportes</h2>
          <div className="action-section">
            <div className="action-controls">
              <input
                className="action-input"
                placeholder="ID del Socio"
                value={socioId}
                onChange={(e) => setSocioId(e.target.value)}
              />
              <input
                className="action-input"
                placeholder="ID del Deporte"
                value={deporteId}
                onChange={(e) => setDeporteId(e.target.value)}
              />
              <div className="action-buttons">
                <button onClick={handleAsignar} className="assign-button">
                  ✓ Asignar
                </button>
                <button onClick={handleDesasignar} className="unassign-button">
                  ✗ Desasignar
                </button>
              </div>
            </div>
            {operationSuccess && (
              <p style={{ color: "green", marginTop: "10px" }}>
                {operationSuccess}
              </p>
            )}
            {operationError && (
              <p style={{ color: "red", marginTop: "10px" }}>
                {operationError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
