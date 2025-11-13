# URLs de la API para el Frontend

Base URL:

    	http://localhost:3000

## Rutas públicas

- Login (obtener token JWT)

  POST - /api/login

  Body (JSON):

  {
  "email": "admin@club.com",
  "password": "admin123"
  }

- Reset de contraseña — solicitar token por email

  POST - /api/reset/request

  Body (JSON):

  {
  "email": "usuario@example.com"
  }

- Reset de contraseña — confirmar con token

  POST - /api/reset/confirm

  Body (JSON):

  {
  "token": "TOKEN_RECIBIDO_POR_EMAIL",
  "newPassword": "nuevaPassword123"
  }

---

## Rutas protegidas (requieren header Authorization)

Header obligatorio en todas las rutas protegidas:

    	Authorization: Bearer TU_TOKEN_AQUI

### Socios

- Obtener todos los socios

  GET - http://localhost:3000/api/socios

- Obtener socio por id

  GET - http://localhost:3000/api/socios/:id

- Crear socio

  POST - /api/socios

  Body (JSON):

  {
  "nombre": "Juan Pérez",
  "dni": "40123456",
  "telefono": "381-1234567",
  "email": "juan@example.com",
  "password": "password123"
  }

- Actualizar socio

  PUT - /api/socios/:id

- Eliminar socio

  DELETE - /api/socios/:id

### Deportes

- Obtener todos los deportes

  GET - http://localhost:3000/api/deportes

- Obtener deporte por id

  GET - http://localhost:3000/api/deportes/:id

- Crear deporte

  POST - http://localhost:3000/api/deportes

  Body (JSON):

  {
  "nombre": "Fútbol",
  "cuota_mensual": 15000.00
  }

- Actualizar deporte

  PUT - http://localhost:3000/api/deportes/:id

- Eliminar deporte

  DELETE - http://localhost:3000/api/deportes/:id

### Asignaciones (Socio <-> Deporte)

- Obtener todas las asignaciones

  GET - /api/asignaciones

- Deportes de un socio

  GET - /api/asignaciones/socio/:socio_id

- Socios de un deporte

  GET - /api/asignaciones/deporte/:deporte_id

- Asignar socio a deporte

  POST - /api/asignaciones

  Body (JSON):

  {
  "socio_id": 1,
  "deporte_id": 2
  }

- Desasignar socio de deporte

  DELETE - /api/asignaciones

  Body (JSON):

  {
  "socio_id": 1,
  "deporte_id": 2
  }

### Pagos

- Obtener todos los pagos

  GET - http://localhost:3000/api/pagos

- Registrar pago

  POST - http://localhost:3000/api/pagos



- Pagos de un socio
 
  GET - http://localhost:3000/api/pagos/socio/:socio_id

- Deuda de un socio (año actual)

  GET - http://localhost:3000/api/pagos/deuda/:socio_id

---

## Ejemplos rápidos (fetch)

1. Login y uso del token

```javascript
// Login
const res = await fetch("http://localhost:3000/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@club.com", password: "admin123" }),
});
const data = await res.json();
const token = data.token;

// Usar token para obtener socios
const r2 = await fetch("http://localhost:3000/api/socios", {
  headers: { Authorization: `Bearer ${token}` },
});
const socios = await r2.json();
```

2. Crear socio

```javascript
await fetch("http://localhost:3000/api/socios", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    nombre: "Nuevo",
    dni: "40123456",
    telefono: "381-000000",
    email: "nuevo@ej.com",
    password: "pass123",
  }),
});
```

---

## Notas

- El token expira (configuración: 12h en el auth.controller). Si recibes `401` o `Token expirado`, vuelve a hacer login.
- CORS está habilitado en el backend; si el frontend corre en otro puerto no debería haber problemas.
- Asegurate de usar el header `Authorization` EXACTAMENTE con el formato `Bearer <token>` (espacio entre Bearer y el token).

Si querés, lo agrego también en el README del frontend o genero un archivo JS con funciones helper para consumir la API.
