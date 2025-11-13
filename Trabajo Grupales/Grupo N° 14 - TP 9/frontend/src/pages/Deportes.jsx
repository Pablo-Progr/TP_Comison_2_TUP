import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import usePagination from "../hooks/usePagination";
import useModal from "../hooks/useModal";
import clubService from "../services/clubService";
import "../styles/deportes.css";

const Deportes = () => {
  // Hook para obtener todos los deportes
  const {
    data: deportes,
    loading,
    error,
    refetch,
  } = useFetch({
    autoFetch: true,
    fetchFn: clubService.getDeportes,
  });

  // Hook para paginación (5 deportes por página)
  const {
    currentData: deportesPaginados,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
  } = usePagination(deportes || [], 5);

  // Hook para el modal de crear/editar
  const { isOpen, modalData, openModal, closeModal } = useModal();

  // Estado para el formulario
  const [form, setForm] = useState({ nombre: "", cuota_mensual: "" });
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    setForm({ nombre: "", cuota_mensual: "" });
    setFormSuccess("");
    setFormError("");
    openModal(null);
  };

  const handleEdit = (deporte) => {
    setForm({
      nombre: deporte.nombre || "",
      cuota_mensual: deporte.cuota_mensual || "",
    });
    setFormSuccess("");
    setFormError("");
    openModal(deporte);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSuccess("");
    setFormError("");

    if (!form.nombre || !form.cuota_mensual) {
      setFormError("Nombre y cuota mensual son obligatorios.");
      return;
    }

    try {
      const deporteData = {
        nombre: form.nombre,
        cuota_mensual: parseFloat(form.cuota_mensual),
      };

      if (modalData) {
        // Actualizar deporte
        await clubService.updateDeporte(modalData.id, deporteData);
        setFormSuccess("Deporte actualizado con éxito");
      } else {
        // Crear deporte
        await clubService.createDeporte(deporteData);
        setFormSuccess("Deporte creado con éxito");
      }

      setForm({ nombre: "", cuota_mensual: "" });
      closeModal();
      refetch();
    } catch (err) {
      console.error("Error al procesar el deporte:", err);
      setFormError(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este deporte?")) {
      return;
    }

    try {
      await clubService.deleteDeporte(id);
      refetch();
    } catch (err) {
      console.error("Error al eliminar el deporte:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleView = async (id) => {
    try {
      const deporte = await clubService.getDeporteById(id);
      alert(`Deporte: ${JSON.stringify(deporte, null, 2)}`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading)
    return (
      <div className="deportes-container">
        <p>Cargando deportes...</p>
      </div>
    );
  if (error)
    return (
      <div className="deportes-container">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <div className="deportes-container">
      <div className="deportes-header">
        <h1>Lista de Deportes</h1>
        <button className="create-button" onClick={handleCreate}>
          Crear Deporte
        </button>
      </div>

      <table className="deportes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cuota Mensual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {deportesPaginados.map((deporte, index) => (
            <tr key={deporte.id || index}>
              <td>{deporte.id}</td>
              <td>{deporte.nombre}</td>
              <td>${deporte.cuota_mensual}</td>
              <td>
                <button
                  className="action-button"
                  onClick={() => handleView(deporte.id)}
                >
                  Ver
                </button>
                <button
                  className="action-button"
                  onClick={() => handleEdit(deporte)}
                >
                  Modificar
                </button>
                <button
                  className="action-button"
                  onClick={() => handleDelete(deporte.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
            className="action-button"
            onClick={previousPage}
            disabled={currentPage === 1}
          >
            ← Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="action-button"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Modal para crear/editar */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{modalData ? "Modificar Deporte" : "Crear Deporte"}</h2>
            <form onSubmit={handleFormSubmit}>
              <label>Nombre:</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleFormChange}
                required
              />
              <label>Cuota Mensual:</label>
              <input
                name="cuota_mensual"
                type="number"
                step="0.01"
                value={form.cuota_mensual}
                onChange={handleFormChange}
                required
              />
              {formError && (
                <div style={{ color: "red", margin: "10px 0" }}>
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div style={{ color: "green", margin: "10px 0" }}>
                  {formSuccess}
                </div>
              )}
              <div className="modal-actions">
                <button type="submit">Guardar</button>
                <button type="button" onClick={closeModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deportes;
