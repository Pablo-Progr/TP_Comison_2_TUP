 TP 9 – Sistema de Gestión de Club Deportivo
Un club social necesita un backend para manejar socios, deportes y pagos de cuotas. El sistema
debe permitir: registrar socios (nombre, DNI, contacto); registrar deportes (fútbol, natación, etc.);
asignar socios a un deporte; registrar pagos mensuales y calcular deudas pendientes. Objetivo:
relacionar múltiples entidades y practicar agregaciones SQL.
Informe de ajustes realizados 


Durante la integración del módulo de autenticación se detectaron tres puntos críticos:

Ausencia de base de datos: fue necesario crearla desde cero.

Modelo de usuario sin contraseña: se incorporó el campo y, a partir de ello, se implementó el hash de contraseña con bcrypt.

Emisión de tokens: se agregó autenticación con JWT para sesiones seguras.

"CAMBIOS REALIZADOS"

Base de datos creada desde cero

Definición del esquema inicial.

Migración/seed de datos mínimos para pruebas.

Conexión y pool configurados en el backend.

Campo password agregado al modelo de Usuario

Validaciones básicas (requerido, longitud mínima).

Manejo seguro: nunca se devuelve el hash en respuestas de API.

Hash de contraseña con bcrypt

Hash al registrar/actualizar contraseña.

Comparación segura en el login (bcrypt.compare).

JWT (JSON Web Token)

Generación de token al iniciar sesión.

Middleware para proteger rutas privadas.

Expiración y verificación del token.

