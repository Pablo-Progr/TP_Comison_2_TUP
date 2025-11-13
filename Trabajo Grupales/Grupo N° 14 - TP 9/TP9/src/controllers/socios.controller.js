const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================================
//  Obtener todos los socios
// ================================
exports.getAll = async (req, res) => {
  try {
    const socios = await prisma.socios.findMany({
      select: {
        id: true,
        nombre: true,
        dni: true,
        telefono: true,
        email: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
    res.json(socios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
//  Obtener un socio por ID
// ================================
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const socio = await prisma.socios.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nombre: true,
        dni: true,
        telefono: true,
        email: true,
      },
    });
    
    if (!socio) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    
    res.json(socio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
//  Crear socio (con hash de contraseña)
// ================================
exports.create = async (req, res) => {
  try {
    const { nombre, dni, telefono, email, password } = req.body;
    if (!nombre || !dni || !email || !password) {
      return res.status(400).json({ error: 'Nombre, DNI, email y password son obligatorios' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const socio = await prisma.socios.create({
      data: {
        nombre,
        dni,
        telefono,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        nombre: true,
        dni: true,
        email: true,
      },
    });

    res.status(201).json(socio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear socio' });
  }
};

// ================================
//  Actualizar socio
// ================================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, dni, telefono, email, password } = req.body;

    const dataToUpdate = {
      nombre,
      dni,
      telefono,
      email,
    };

    if (password) {
      // Si envían password, hashéala
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      dataToUpdate.password = hashedPassword;
    }

    const socio = await prisma.socios.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    res.json({ ok: true, mensaje: 'Socio actualizado correctamente' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar socio' });
  }
};

// ================================
//  Eliminar socio
// ================================
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.socios.delete({
      where: { id: parseInt(id) },
    });

    res.json({ ok: true, mensaje: 'Socio eliminado correctamente' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ================================
//  Login de socio (generar JWT)
// ================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios' });
    }

    const user = await prisma.socios.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

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
