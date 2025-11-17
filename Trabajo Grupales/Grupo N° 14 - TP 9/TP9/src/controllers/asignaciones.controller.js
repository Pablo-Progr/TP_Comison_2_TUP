const db = require('../config/DB');

// Listar todas las asignaciones
const getAll = async (req, res) => {
  try {
    const [asignaciones] = await db.query(`
      SELECT 
        sd.id,
        sd.socio_id,
        s.nombre AS socio_nombre,
        s.dni,
        sd.deporte_id,
        d.nombre AS deporte_nombre,
        d.cuota_mensual,
        sd.fecha_inscripcion
      FROM socios_deportes sd
      JOIN socios s ON sd.socio_id = s.id
      JOIN deportes d ON sd.deporte_id = d.id
      ORDER BY sd.id DESC
    `);

    res.json(asignaciones);
  } catch (err) {
    console.error("Error en getAll:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Obtener deportes de un socio
const getDeportesDeSocio = async (req, res) => {
  try {
    const { socio_id } = req.params;
    
    const [deportes] = await db.query(`
      SELECT 
        d.id,
        d.nombre,
        d.cuota_mensual,
        sd.fecha_inscripcion
      FROM socios_deportes sd
      JOIN deportes d ON sd.deporte_id = d.id
      WHERE sd.socio_id = ?
    `, [parseInt(socio_id)]);

    res.json(deportes);
  } catch (err) {
    console.error("Error en getDeportesDeSocio:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Obtener socios de un deporte
const getSociosDeDeporte = async (req, res) => {
  try {
    const { deporte_id } = req.params;
    
    const [socios] = await db.query(`
      SELECT 
        s.id,
        s.nombre,
        s.dni,
        s.telefono,
        s.email,
        sd.fecha_inscripcion
      FROM socios_deportes sd
      JOIN socios s ON sd.socio_id = s.id
      WHERE sd.deporte_id = ?
    `, [parseInt(deporte_id)]);

    res.json(socios);
  } catch (err) {
    console.error("Error en getSociosDeDeporte:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Asignar un socio a un deporte
const asignar = async (req, res) => {
  try {
    const { socio_id, deporte_id } = req.body;
    if (!socio_id || !deporte_id) {
      return res.status(400).json({ error: 'socio_id y deporte_id son requeridos' });
    }

    await db.query(
      'INSERT INTO socios_deportes (socio_id, deporte_id) VALUES (?, ?)',
      [parseInt(socio_id), parseInt(deporte_id)]
    );

    res.json({ ok: true, mensaje: 'Socio asignado al deporte correctamente' });
  } catch (err) {
    console.error("Error en asignar:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Desasignar un socio de un deporte
const desasignar = async (req, res) => {
  try {
    const { socio_id, deporte_id } = req.body;
    if (!socio_id || !deporte_id) {
      return res.status(400).json({ error: 'socio_id y deporte_id son requeridos' });
    }

    const [result] = await db.query(
      'DELETE FROM socios_deportes WHERE socio_id = ? AND deporte_id = ?',
      [parseInt(socio_id), parseInt(deporte_id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No existía esa asignación' });
    }

    res.json({ ok: true, mensaje: 'Socio desasignado del deporte correctamente' });
  } catch (err) {
    console.error("Error en desasignar:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

module.exports = {
  getAll,
  getDeportesDeSocio,
  getSociosDeDeporte,
  asignar,
  desasignar
};