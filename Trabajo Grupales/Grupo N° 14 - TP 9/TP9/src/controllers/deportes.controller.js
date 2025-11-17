const db = require('../config/DB');

// Obtener todos los deportes
const getAll = async (req, res) => {
  try {
    const [deportes] = await db.query(
      'SELECT id, nombre, cuota_mensual FROM deportes ORDER BY id DESC'
    );
    res.json(deportes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un deporte por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const [deportes] = await db.query(
      'SELECT id, nombre, cuota_mensual FROM deportes WHERE id = ?',
      [parseInt(id)]
    );

    if (deportes.length === 0) {
      return res.status(404).json({ error: 'Deporte no encontrado' });
    }

    res.json(deportes[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear deporte
const create = async (req, res) => {
  try {
    const { nombre, cuota_mensual } = req.body;
    if (!nombre || cuota_mensual == null) {
      return res.status(400).json({ error: 'El nombre y la cuota_mensual son obligatorios' });
    }

    const [result] = await db.query(
      'INSERT INTO deportes (nombre, cuota_mensual) VALUES (?, ?)',
      [nombre, cuota_mensual]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      cuota_mensual
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar deporte
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cuota_mensual } = req.body;

    const [result] = await db.query(
      'UPDATE deportes SET nombre = ?, cuota_mensual = ? WHERE id = ?',
      [nombre, cuota_mensual, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Deporte no encontrado' });
    }

    res.json({ ok: true, mensaje: 'Deporte actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar deporte
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM deportes WHERE id = ?',
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Deporte no encontrado' });
    }

    res.json({ ok: true, mensaje: 'Deporte eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};