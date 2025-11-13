import React, { useState } from "react";

const RegistrarPagoForm = ({ onRegistrarPago, socios, deportes = [] }) => {
  const [monto, setMonto] = useState("");
  const [socioId, setSocioId] = useState("");
  const [deporteId, setDeporteId] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!monto || !socioId) {
      setValidationError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    if (!deporteId) {
      setValidationError("Por favor, seleccione un deporte.");
      return;
    }

    console.log("Socio ID seleccionado:", socioId); // Depuración
    console.log("Lista de socios:", socios); // Depuración

    const socioSeleccionado = socios.find((socio) => String(socio.id) === String(socioId));

    if (!socioSeleccionado) {
      setValidationError("El socio seleccionado no es válido.");
      return;
    }

    // Validaciones adicionales: monto >= 0, fecha año entre 2000 y 2100
    const parsedMonto = Number(monto);
    if (isNaN(parsedMonto) || parsedMonto < 0) {
      setValidationError("Monto inválido. Debe ser un número mayor o igual a 0.");
      return;
    }

    setValidationError("");

    const nuevoPago = {
      monto: parseFloat(monto), // Convertir monto a número
      socioId: socioSeleccionado.id, // Enviar solo los campos esenciales
      deporteId: deporteId,
    };

    console.log("Datos enviados:", nuevoPago); // Depuración
    onRegistrarPago(nuevoPago);

    setMonto("");
    setSocioId("");
    setDeporteId("");
    setValidationError("");
  };

  return (
    <div className="modules-section">
      <h2>Registrar Pago</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="socio">Socio</label>
          <select
            id="socio"
            value={socioId}
            onChange={(e) => setSocioId(e.target.value)}
            required
          >
            <option value="">Seleccione un socio</option>
            {socios.map((socio) => (
              <option key={socio.id} value={socio.id}>
                {socio.nombre}
              </option>
            ))}
          </select>
        </div>
          <div className="form-group">
            <label htmlFor="deporte">Deporte</label>
            <select
              id="deporte"
              value={deporteId}
              onChange={(e) => setDeporteId(e.target.value)}
              required
            >
              <option value="">Seleccione un deporte</option>
              {deportes.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>
        <div className="form-group">
          <label htmlFor="monto">Monto</label>
          <input
            type="number"
            id="monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
          />
        </div>
        {/* Fecha eliminada: el backend asigna la fecha actual */}
        {validationError && (
          <div className="error-message" style={{ marginTop: 8 }}>
            {validationError}
          </div>
        )}
        <button type="submit" className="login-button">
          Registrar Pago
        </button>
      </form>
    </div>
  );
};

export default RegistrarPagoForm;