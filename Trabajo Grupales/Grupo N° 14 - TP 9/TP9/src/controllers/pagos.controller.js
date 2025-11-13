const prisma = require('../config/prisma');

// Listar todos los pagos
exports.getAll = async (req, res) => {
  try {
    const pagos = await prisma.pagos.findMany({
      include: {
        socios: {
          select: {
            nombre: true,
          },
        },
        deportes: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    const resultado = pagos.map(p => ({
      id: p.id,
      socio: p.socios.nombre,
      deporte: p.deportes.nombre,
      mes: p.mes,
      anio: p.anio,
      monto: p.monto,
      fecha_pago: p.fecha_pago,
    }));

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Registrar un pago
exports.create = async (req, res) => {
  try {
    const { socio_id, deporte_id, mes, anio, monto } = req.body;

    if (!socio_id || !deporte_id || !mes || !anio || !monto) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const pago = await prisma.pagos.create({
      data: {
        socio_id: parseInt(socio_id),
        deporte_id: parseInt(deporte_id),
        mes: parseInt(mes),
        anio: parseInt(anio),
        monto: parseFloat(monto),
      },
    });

    res.status(201).json({
      ok: true,
      id: pago.id,
      socio_id: pago.socio_id,
      deporte_id: pago.deporte_id,
      mes: pago.mes,
      anio: pago.anio,
      monto: pago.monto,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Consultar pagos de un socio
exports.getPagosDeSocio = async (req, res) => {
  try {
    const { socio_id } = req.params;
    
    const pagos = await prisma.pagos.findMany({
      where: {
        socio_id: parseInt(socio_id),
      },
      include: {
        deportes: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: [
        { anio: 'desc' },
        { mes: 'asc' },
      ],
    });

    const resultado = pagos.map(p => ({
      id: p.id,
      deporte: p.deportes.nombre,
      mes: p.mes,
      anio: p.anio,
      monto: p.monto,
      fecha_pago: p.fecha_pago,
    }));

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Consultar deuda de un socio (año actual)
exports.getDeudaSocio = async (req, res) => {
  try {
    const { socio_id } = req.params;
    const anioActual = new Date().getFullYear();

    // Esta query es compleja, usaremos $queryRaw para mantener la lógica SQL
    const resultado = await prisma.$queryRaw`
      SELECT d.nombre AS deporte,
             d.cuota_mensual,
             COUNT(p.id) AS meses_pagados,
             (12 - COUNT(p.id)) AS meses_adeudados,
             (12 - COUNT(p.id)) * d.cuota_mensual AS total_deuda
      FROM deportes d
      JOIN socios_deportes sd ON sd.deporte_id = d.id
      LEFT JOIN pagos p
        ON p.deporte_id = d.id AND p.socio_id = sd.socio_id AND p.anio = ${anioActual}
      WHERE sd.socio_id = ${parseInt(socio_id)}
      GROUP BY d.id
    `;

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};