const db = require('../config/DB');

// Listar todos los pagos
const getAll = async (req, res) => {
  try {
    const [pagos] = await db.query(`
      SELECT 
        p.id,
        s.nombre AS socio,
        d.nombre AS deporte,
        p.mes,
        p.anio,
        p.monto,
        p.fecha_pago
      FROM pagos p
      JOIN socios s ON p.socio_id = s.id
      JOIN deportes d ON p.deporte_id = d.id
      ORDER BY p.id DESC
    `);

    res.json(pagos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Registrar un pago
const create = async (req, res) => {
  try {
    const { socio_id, deporte_id, mes, anio, monto } = req.body;

    if (!socio_id || !deporte_id || !mes || !anio || !monto) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const [result] = await db.query(
      'INSERT INTO pagos (socio_id, deporte_id, mes, anio, monto) VALUES (?, ?, ?, ?, ?)',
      [parseInt(socio_id), parseInt(deporte_id), parseInt(mes), parseInt(anio), parseFloat(monto)]
    );

    res.status(201).json({
      ok: true,
      id: result.insertId,
      socio_id: parseInt(socio_id),
      deporte_id: parseInt(deporte_id),
      mes: parseInt(mes),
      anio: parseInt(anio),
      monto: parseFloat(monto)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Consultar pagos de un socio
const getPagosDeSocio = async (req, res) => {
  try {
    const { socio_id } = req.params;
    
    const [pagos] = await db.query(`
      SELECT 
        p.id,
        d.nombre AS deporte,
        p.mes,
        p.anio,
        p.monto,
        p.fecha_pago
      FROM pagos p
      JOIN deportes d ON p.deporte_id = d.id
      WHERE p.socio_id = ?
      ORDER BY p.anio DESC, p.mes ASC
    `, [parseInt(socio_id)]);

    res.json(pagos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Consultar deuda de un socio (año actual)
const getDeudaSocio = async (req, res) => {
  try {
    const { socio_id } = req.params;
    const anioActual = new Date().getFullYear();

    const [resultado] = await db.query(`
      SELECT 
        d.nombre AS deporte,
        d.cuota_mensual,
        COUNT(p.id) AS meses_pagados,
        (12 - COUNT(p.id)) AS meses_adeudados,
        (12 - COUNT(p.id)) * d.cuota_mensual AS total_deuda
      FROM deportes d
      JOIN socios_deportes sd ON sd.deporte_id = d.id
      LEFT JOIN pagos p ON p.deporte_id = d.id AND p.socio_id = sd.socio_id AND p.anio = ?
      WHERE sd.socio_id = ?
      GROUP BY d.id
    `, [anioActual, parseInt(socio_id)]);

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  create,
  getPagosDeSocio,
  getDeudaSocio
};