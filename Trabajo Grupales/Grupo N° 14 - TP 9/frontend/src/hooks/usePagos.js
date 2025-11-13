import { useState, useEffect, useCallback } from "react";

const usePagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registroError, setRegistroError] = useState(null);

  const token = localStorage.getItem("token"); // Obtener el token del almacenamiento local

  const fetchPagos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/pagos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los pagos");
      }
      const data = await response.json();
      setPagos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPagos();
  }, [fetchPagos]);

  const registrarPago = async (nuevoPago) => {
    try {
      // Transformar datos al formato que espera el backend
      // Backend acepta: { socio_id, deporte_id, monto } y puede asignar la fecha actual si no se envían mes/anio
      const payload = {
        socio_id: parseInt(nuevoPago.socioId || nuevoPago.socio_id, 10),
        deporte_id: parseInt(nuevoPago.deporteId || nuevoPago.deporte_id, 10),
        monto: Number(nuevoPago.monto),
      };

      // Asegurar que siempre enviamos mes y anio (el backend los requiere).
      // Si el frontend aportó `fecha` usarla, si no usar la fecha actual.
      const fechaPara = nuevoPago.fecha ? new Date(nuevoPago.fecha) : new Date();
      if (!isNaN(fechaPara.getTime())) {
        payload.mes = parseInt(fechaPara.getMonth() + 1, 10);
        payload.anio = parseInt(fechaPara.getFullYear(), 10);
      }

      const response = await fetch("http://localhost:3000/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorResponse = null;
        try {
          errorResponse = await response.json(); // Capturar el cuerpo de la respuesta
        } catch {
          // ignore parse error
        }
        console.error("Error del servidor:", errorResponse || response.statusText);
        // lanzar el mensaje devuelto por el servidor o el status text
        throw new Error((errorResponse && (errorResponse.error || errorResponse.message)) || response.statusText || "Error al registrar el pago");
      }

      await response.json();
      // Refrescar la lista completa desde el backend para obtener los datos asociados (socio, deporte, etc.)
      await fetchPagos();
      setRegistroError(null);
    } catch (err) {
      setRegistroError(err.message);
    }
  };

  const obtenerPagosDeSocio = async (socioId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/pagos/socio/${socioId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los pagos del socio");
      }

      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const obtenerDeudaDeSocio = async (socioId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/pagos/deuda/${socioId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener la deuda del socio");
      }

      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const obtenerSocios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/socios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener la lista de socios");
      }

      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const obtenerDeportes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/deportes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener la lista de deportes");
      }

      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    pagos,
    loading,
    error,
    registrarPago,
    obtenerPagosDeSocio,
    obtenerDeudaDeSocio,
    registroError,
    obtenerSocios, // Agregado para obtener la lista de socios
    obtenerDeportes,
  };
};

export default usePagos;