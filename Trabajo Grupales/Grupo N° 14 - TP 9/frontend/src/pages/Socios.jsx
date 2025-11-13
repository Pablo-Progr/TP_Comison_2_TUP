import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import usePagination from "../hooks/usePagination";
import useModal from "../hooks/useModal";
import clubService from "../services/clubService";
import "../styles/LoginPage.css";
import "../styles/DashboardPage.css";
import "../styles/HomePage.css";

function Socios() {
  // Hook para obtener todos los socios
  const {
    data: socios,
    loading,
    error,
    refetch,
  } = useFetch({
    autoFetch: true,
    fetchFn: clubService.getSocios,
  });

  // Hook para paginación (5 socios por página)
  const {
    currentData: sociosPaginados,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
  } = usePagination(socios || [], 5);

  // Hook para el modal de crear/editar
  const { isOpen, modalData, openModal, closeModal } = useModal();

  // Estados para búsqueda por ID
  const [searchId, setSearchId] = useState("");
  const {
    data: socioById,
    loading: searchLoading,
    error: searchError,
    fetchData: searchSocio,
  } = useFetch({
    autoFetch: false,
    fetchFn: () => clubService.getSocioById(searchId),
  });

  // Estados para el formulario
  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    email: "",
    password: "",
  });
  const {
    loading: formLoading,
    error: formError,
    fetchData: submitForm,
  } = useFetch({
    autoFetch: false,
    method: "POST",
  });
  const [formSuccess, setFormSuccess] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) return;
    await searchSocio();
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    setForm({ nombre: "", dni: "", telefono: "", email: "", password: "" });
    setFormSuccess("");
    openModal(null);
  };

  const handleEdit = (socio) => {
    setForm({
      nombre: socio.nombre || "",
      dni: socio.dni || "",
      telefono: socio.telefono || "",
      email: socio.email || "",
      password: "",
    });
    setFormSuccess("");
    openModal(socio);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSuccess("");

    try {
      if (modalData) {
        // Actualizar socio
        await clubService.updateSocio(modalData.id, form);
        setFormSuccess("Socio actualizado correctamente");
      } else {
        // Crear socio
        await clubService.createSocio(form);
        setFormSuccess("Socio creado correctamente");
      }
      setForm({ nombre: "", dni: "", telefono: "", email: "", password: "" });
      closeModal();
      refetch(); // Recargar la lista de socios
    } catch (err) {
      console.error("Error al guardar socio:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que desea eliminar este socio?")) return;

    try {
      await clubService.deleteSocio(id);
      refetch();
    } catch (err) {
      console.error("Error al eliminar socio:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👥 Gestión de Socios</h1>
        <button className="login-button" onClick={handleCreate}>
          ➕ Nuevo Socio
        </button>
      </div>
      <div className="dashboard-content">
        {/* Modal de crear/editar */}
        {isOpen && (
          <div className="welcome-card">
            <h2>{modalData ? "Editar socio" : "Crear nuevo socio"}</h2>
            <form
              className="login-form"
              onSubmit={handleFormSubmit}
              style={{ maxWidth: 400, margin: "0 auto" }}
            >
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={form.nombre}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dni">DNI</label>
                <input
                  type="text"
                  name="dni"
                  id="dni"
                  value={form.dni}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  id="telefono"
                  value={form.telefono}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  Password {modalData && "(dejar vacío para no cambiar)"}
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={form.password}
                  onChange={handleFormChange}
                  required={!modalData}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="login-button"
                  type="submit"
                  disabled={formLoading}
                >
                  {modalData ? "Actualizar" : "Crear"}
                </button>
                <button
                  className="logout-button"
                  type="button"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
            {formError && <div className="error-message">{formError}</div>}
            {formSuccess && (
              <div
                className="info-card"
                style={{ marginTop: 10, color: "green" }}
              >
                {formSuccess}
              </div>
            )}
          </div>
        )}

        {/* Búsqueda por ID */}
        <div className="welcome-card" style={{ marginTop: 30 }}>
          <h2>Buscar socio por ID</h2>
          <form
            className="login-form"
            onSubmit={handleSearch}
            style={{ maxWidth: 400, margin: "0 auto" }}
          >
            <div className="form-group">
              <label htmlFor="searchId">ID de Socio</label>
              <input
                type="text"
                id="searchId"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Ingrese el ID"
              />
            </div>
            <button
              className="login-button"
              type="submit"
              disabled={searchLoading || !searchId}
            >
              Buscar
            </button>
          </form>
          {searchError && (
            <div className="error-message">Socio no encontrado</div>
          )}
          {socioById && (
            <div className="info-card" style={{ marginTop: 20 }}>
              <h3>Socio encontrado</h3>
              <ul>
                <li>
                  <strong>ID:</strong> {socioById.id}
                </li>
                <li>
                  <strong>Nombre:</strong> {socioById.nombre}
                </li>
                <li>
                  <strong>Email:</strong> {socioById.email}
                </li>
                <li>
                  <strong>DNI:</strong> {socioById.dni}
                </li>
                <li>
                  <strong>Teléfono:</strong> {socioById.telefono}
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Tabla de socios con paginación */}
        <div className="modules-section">
          <h2>Todos los socios</h2>
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <p>Cargando socios...</p>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#667eea", color: "white" }}>
                      <th style={{ padding: "10px" }}>ID</th>
                      <th style={{ padding: "10px" }}>Nombre</th>
                      <th style={{ padding: "10px" }}>Email</th>
                      <th style={{ padding: "10px" }}>DNI</th>
                      <th style={{ padding: "10px" }}>Teléfono</th>
                      <th style={{ padding: "10px" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sociosPaginados.map((socio) => (
                      <tr key={socio.id} style={{ background: "white" }}>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {socio.id}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {socio.nombre}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {socio.email}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {socio.dni}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {socio.telefono}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <button
                            className="login-button"
                            style={{
                              marginRight: 8,
                              padding: "6px 12px",
                              fontSize: 14,
                            }}
                            onClick={() => handleEdit(socio)}
                          >
                            Editar
                          </button>
                          <button
                            className="logout-button"
                            style={{ padding: "6px 12px", fontSize: 14 }}
                            onClick={() => handleDelete(socio.id)}
                          >
                            Eliminar
                          </button>
                        </td>
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
                    className="login-button"
                    onClick={previousPage}
                    disabled={currentPage === 1}
                    style={{ padding: "6px 12px" }}
                  >
                    ← Anterior
                  </button>
                  <span style={{ color: "white" }}>
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    className="login-button"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    style={{ padding: "6px 12px" }}
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Socios;
