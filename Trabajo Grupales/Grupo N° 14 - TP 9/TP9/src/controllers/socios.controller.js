const db = require('../config/DB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================================
//  Obtener todos los socios
// ================================
const getAll = async (req, res) => {
  try {
    const [socios] = await db.query(
      'SELECT id, nombre, dni, telefono, email FROM socios ORDER BY id DESC'
    );
    res.json(socios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
//  Obtener un socio por ID
// ================================
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const [socios] = await db.query(
      'SELECT id, nombre, dni, telefono, email FROM socios WHERE id = ?',
      [parseInt(id)]
    );
    
    if (socios.length === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    
    res.json(socios[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
//  Crear socio (con hash de contraseña)
// ================================
const create = async (req, res) => {
  try {
    const { nombre, dni, telefono, email, password } = req.body;
    if (!nombre || !dni || !email || !password) {
      return res.status(400).json({ error: 'Nombre, DNI, email y password son obligatorios' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO socios (nombre, dni, telefono, email, password) VALUES (?, ?, ?, ?, ?)',
      [nombre, dni, telefono, email, hashedPassword]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      dni,
      email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear socio' });
  }
};

// ================================
//  Actualizar socio
// ================================
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, dni, telefono, email, password } = req.body;

    let query = 'UPDATE socios SET nombre = ?, dni = ?, telefono = ?, email = ?';
    let params = [nombre, dni, telefono, email];

    if (password) {
      // Si envían password, hashéala
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(parseInt(id));

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    res.json({ ok: true, mensaje: 'Socio actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar socio' });
  }
};

// ================================
//  Eliminar socio
// ================================
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      'DELETE FROM socios WHERE id = ?',
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    res.json({ ok: true, mensaje: 'Socio eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
//  Login de socio (generar JWT)
// ================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios' });
    }

    const [users] = await db.query(
      'SELECT id, nombre, email, password FROM socios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  login
};