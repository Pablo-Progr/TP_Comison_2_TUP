import React, { useEffect, useState } from "react";
import usePagos from "../hooks/usePagos";
import ListaPagos from "../components/ListaPagos.jsx";
import RegistrarPagoForm from "../components/RegistrarPagoForm.jsx";
import "../styles/pagos.css";

const Pagos = () => {
  const { pagos, loading, error, registrarPago, obtenerSocios, obtenerDeportes, registroError } = usePagos();
  const [socios, setSocios] = useState([]);
  const [deportes, setDeportes] = useState([]);

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const sociosData = await obtenerSocios();
        setSocios(sociosData);
      } catch (err) {
        console.error("Error al obtener socios:", err);
      }
    };

    const fetchDeportes = async () => {
      try {
        if (obtenerDeportes) {
          const deportesData = await obtenerDeportes();
          setDeportes(deportesData);
        }
      } catch (err) {
        console.error("Error al obtener deportes:", err);
      }
    };

    fetchSocios();
    fetchDeportes();
  }, [obtenerSocios, obtenerDeportes]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>💳 Gestión de Pagos</h1>
      </div>

      <div className="dashboard-content">
        <RegistrarPagoForm onRegistrarPago={registrarPago} socios={socios} deportes={deportes} />
        {registroError && (
          <div className="error-message" style={{ marginTop: 12 }}>
            {registroError}
          </div>
        )}
        {loading ? (
          <p className="loading-message">Cargando pagos...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : (
          <ListaPagos pagos={pagos} socios={socios} deportes={deportes} />
        )}
      </div>
    </div>
  );
};

export default Pagos;