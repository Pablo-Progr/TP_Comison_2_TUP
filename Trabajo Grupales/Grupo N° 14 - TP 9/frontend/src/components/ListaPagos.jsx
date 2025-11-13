import React, { useMemo, useState } from "react";

const ListaPagos = ({ pagos = [], socios = [], deportes = [] }) => {
  const [filterSocio, setFilterSocio] = useState("");
  const [filterDeporte, setFilterDeporte] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const getPagoDate = (pago) => {
    const fechaRaw = pago.fecha_pago || pago.fecha || pago.fechaPago || null;
    if (fechaRaw) {
      const d = new Date(fechaRaw);
      if (!isNaN(d.getTime())) return d;
    }
    if (pago.mes && pago.anio) {
      const y = String(pago.anio).padStart(4, "0");
      const m = String(pago.mes).padStart(2, "0");
      const d = new Date(`${y}-${m}-01`);
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  };

  const getPagoSocioId = (pago) => {
    // Try common id fields
    const candidates = [
      pago.socio_id,
      pago.socioId,
      pago.socio_id_raw,
      pago.socioid,
      pago.socioID,
      pago.socioId,
    ];
    for (const c of candidates) {
      if (c !== undefined && c !== null && c !== "") return c;
    }

    // If pago.socio is object, try many possible id keys
    if (pago.socio && typeof pago.socio === "object") {
      const o = pago.socio;
      const keys = ["id", "Id", "ID", "socio_id", "socioId", "id_socio", "idSocio"];
      for (const k of keys) {
        if (o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k];
      }
    }

    // If we only have a name, try to lookup the id from the provided socios list
    const name = pago.socio_nombre || (typeof pago.socio === "string" ? pago.socio : null);
    if (name && Array.isArray(socios)) {
      const found = socios.find((s) => String(s.nombre).toLowerCase() === String(name).toLowerCase());
      if (found) return found.id;
    }

    return null;
  };

  const getPagoDeporteId = (pago) => {
    const candidates = [
      pago.deporte_id,
      pago.deporteId,
      pago.deporte_id_raw,
      pago.deporteid,
      pago.deporteID,
    ];
    for (const c of candidates) {
      if (c !== undefined && c !== null && c !== "") return c;
    }

    if (pago.deporte && typeof pago.deporte === "object") {
      const o = pago.deporte;
      const keys = ["id", "Id", "ID", "deporte_id", "deporteId", "id_deporte", "idDeporte"];
      for (const k of keys) {
        if (o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k];
      }
    }

    const name = pago.deporte_nombre || (typeof pago.deporte === "string" ? pago.deporte : null);
    if (name && Array.isArray(deportes)) {
      const found = deportes.find((d) => String(d.nombre).toLowerCase() === String(name).toLowerCase());
      if (found) return found.id;
    }

    return null;
  };

  const getPagoSocioNombre = (pago) => {
    if (pago.socio && typeof pago.socio === "object") return pago.socio.nombre || pago.socio.nombre_completo || String(pago.socio.id || "");
    return pago.socio_nombre || pago.socio || "-";
  };

  const getPagoDeporteNombre = (pago) => {
    if (pago.deporte && typeof pago.deporte === "object") return pago.deporte.nombre || String(pago.deporte.id || "");
    return pago.deporte_nombre || pago.deporte || "-";
  };

  const filtered = useMemo(() => {
    // prepare date bounds once
    let startBound = null;
    let endBound = null;
    if (filterStartDate) {
      startBound = new Date(filterStartDate);
      startBound.setHours(0, 0, 0, 0);
      if (isNaN(startBound.getTime())) startBound = null;
    }
    if (filterEndDate) {
      endBound = new Date(filterEndDate);
      endBound.setHours(23, 59, 59, 999);
      if (isNaN(endBound.getTime())) endBound = null;
    }

    return pagos.filter((pago) => {
      // socio filter
      if (filterSocio) {
        const pagoSocioId = getPagoSocioId(pago);
        if (pagoSocioId == null || String(pagoSocioId) !== String(filterSocio)) return false;
      }

      // deporte filter
      if (filterDeporte) {
        const pagoDeporteId = getPagoDeporteId(pago);
        if (pagoDeporteId == null || String(pagoDeporteId) !== String(filterDeporte)) return false;
      }

      // fecha filter (range: start/end inclusive)
      if (startBound || endBound) {
        const pagoDate = getPagoDate(pago);
        if (!pagoDate) return false;
        if (startBound && pagoDate < startBound) return false;
        if (endBound && pagoDate > endBound) return false;
      }

      return true;
    });
  }, [pagos, filterSocio, filterDeporte, filterStartDate, filterEndDate]);

  const resetFilters = () => {
    setFilterSocio("");
    setFilterDeporte("");
    setFilterStartDate("");
    setFilterEndDate("");
  };

  return (
    <div className="modules-section">
      <h2>Lista de Pagos</h2>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <div>
          <label>Filtrar por Socio</label>
          <br />
          <select value={filterSocio} onChange={(e) => setFilterSocio(e.target.value)}>
            <option value="">Todos</option>
            {socios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Filtrar por Deporte</label>
          <br />
          <select value={filterDeporte} onChange={(e) => setFilterDeporte(e.target.value)}>
            <option value="">Todos</option>
            {deportes.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Fecha desde</label>
          <br />
          <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} />
        </div>

        <div>
          <label>Fecha hasta</label>
          <br />
          <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button className="logout-button" type="button" onClick={resetFilters}>
            Limpiar filtros
          </button>
        </div>
      </div>

      {filtered && filtered.length > 0 ? (
        <table className="deportes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Socio</th>
              <th>Deporte</th>
              <th>Monto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((pago) => (
              <tr key={pago.id}>
                <td>{pago.id}</td>
                <td>{getPagoSocioNombre(pago)}</td>
                <td>{getPagoDeporteNombre(pago)}</td>
                <td>${Number(pago.monto || 0).toFixed(2)}</td>
                <td>{(() => {
                  const pagoDate = getPagoDate(pago);
                  return pagoDate ? pagoDate.toLocaleDateString() : `${pago.mes || ""}/${pago.anio || ""}`;
                })()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="info-card">No hay pagos disponibles.</p>
      )}
    </div>
  );
};

export default ListaPagos;