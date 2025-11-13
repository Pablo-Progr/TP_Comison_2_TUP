const prisma = require('../config/prisma');

// Obtener todos los deportes
exports.getAll = async (req, res) => {
  try {
    const deportes = await prisma.deportes.findMany({
      orderBy: {
        id: 'desc',
      },
    });
    res.json(deportes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un deporte por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const deporte = await prisma.deportes.findUnique({
      where: { id: parseInt(id) },
    });

    if (!deporte) {
      return res.status(404).json({ error: 'Deporte no encontrado' });
    }

    res.json(deporte);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear deporte
exports.create = async (req, res) => {
  try {
    const { nombre, cuota_mensual } = req.body;
    if (!nombre || cuota_mensual == null) {
      return res.status(400).json({ error: 'El nombre y la cuota_mensual son obligatorios' });
    }

    const deporte = await prisma.deportes.create({
      data: {
        nombre,
        cuota_mensual,
      },
    });

    res.status(201).json(deporte);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar deporte
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cuota_mensual } = req.body;

    await prisma.deportes.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        cuota_mensual,
      },
    });

    res.json({ ok: true, mensaje: 'Deporte actualizado correctamente' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Deporte no encontrado' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Eliminar deporte
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.deportes.delete({
      where: { id: parseInt(id) },
    });

    res.json({ ok: true, mensaje: 'Deporte eliminado correctamente' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Deporte no encontrado' });
    }
    res.status(500).json({ error: err.message });
  }
};
