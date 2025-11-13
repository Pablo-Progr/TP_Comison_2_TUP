const prisma = require('../config/prisma');

// Listar todas las asignaciones
exports.getAll = async (req, res) => {
  try {
    const asignaciones = await prisma.socios_deportes.findMany({
      include: {
        socios: {
          select: {
            id: true,
            nombre: true,
            dni: true,
          },
        },
        deportes: {
          select: {
            id: true,
            nombre: true,
            cuota_mensual: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Transformar la respuesta para que coincida con el formato anterior
    const resultado = asignaciones.map(a => ({
      id: a.id,
      socio_id: a.socios.id,
      socio_nombre: a.socios.nombre,
      dni: a.socios.dni,
      deporte_id: a.deportes.id,
      deporte_nombre: a.deportes.nombre,
      cuota_mensual: a.deportes.cuota_mensual,
      fecha_inscripcion: a.fecha_inscripcion,
    }));

    res.json(resultado);
  } catch (err) {
    console.error("Error en getAll:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Obtener deportes de un socio
exports.getDeportesDeSocio = async (req, res) => {
  try {
    const { socio_id } = req.params;
    
    const asignaciones = await prisma.socios_deportes.findMany({
      where: {
        socio_id: parseInt(socio_id),
      },
      include: {
        deportes: {
          select: {
            id: true,
            nombre: true,
            cuota_mensual: true,
          },
        },
      },
    });

    const deportes = asignaciones.map(a => ({
      id: a.deportes.id,
      nombre: a.deportes.nombre,
      cuota_mensual: a.deportes.cuota_mensual,
      fecha_inscripcion: a.fecha_inscripcion,
    }));

    res.json(deportes);
  } catch (err) {
    console.error("Error en getDeportesDeSocio:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Obtener socios de un deporte
exports.getSociosDeDeporte = async (req, res) => {
  try {
    const { deporte_id } = req.params;
    
    const asignaciones = await prisma.socios_deportes.findMany({
      where: {
        deporte_id: parseInt(deporte_id),
      },
      include: {
        socios: {
          select: {
            id: true,
            nombre: true,
            dni: true,
            telefono: true,
            email: true,
          },
        },
      },
    });

    const socios = asignaciones.map(a => ({
      id: a.socios.id,
      nombre: a.socios.nombre,
      dni: a.socios.dni,
      telefono: a.socios.telefono,
      email: a.socios.email,
      fecha_inscripcion: a.fecha_inscripcion,
    }));

    res.json(socios);
  } catch (err) {
    console.error("Error en getSociosDeDeporte:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Asignar un socio a un deporte
exports.asignar = async (req, res) => {
  try {
    const { socio_id, deporte_id } = req.body;
    if (!socio_id || !deporte_id) {
      return res.status(400).json({ error: 'socio_id y deporte_id son requeridos' });
    }

    await prisma.socios_deportes.create({
      data: {
        socio_id: parseInt(socio_id),
        deporte_id: parseInt(deporte_id),
      },
    });

    res.json({ ok: true, mensaje: 'Socio asignado al deporte correctamente' });
  } catch (err) {
    console.error("Error en asignar:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Desasignar un socio de un deporte
exports.desasignar = async (req, res) => {
  try {
    const { socio_id, deporte_id } = req.body;
    if (!socio_id || !deporte_id) {
      return res.status(400).json({ error: 'socio_id y deporte_id son requeridos' });
    }

    const result = await prisma.socios_deportes.deleteMany({
      where: {
        socio_id: parseInt(socio_id),
        deporte_id: parseInt(deporte_id),
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'No existía esa asignación' });
    }

    res.json({ ok: true, mensaje: 'Socio desasignado del deporte correctamente' });
  } catch (err) {
    console.error("Error en desasignar:", err);
    res.status(500).json({ error: "Error interno" });
  }
};
