Se realizó la migración del acceso a datos del proyecto para implementar Prisma como ORM (Object-Relational Mapping).

Instalación y Configuración: Se instalaron las dependencias prisma y @prisma/client. Luego, se ejecutó npx prisma init para crear la carpeta /prisma y el archivo de esquema inicial.

Conexión: Se configuró la variable DATABASE_URL en el archivo .env para apuntar a la base de datos MySQL existente.

Introspección : Se utilizó el comando npx prisma db pull. Este comando analizó la estructura de la base de datos MySQL (tablas, columnas, tipos de datos, relaciones) y generó automáticamente los modelos correspondientes dentro del archivo schema.prisma.

Generación del Cliente: Una vez definidos los modelos, se ejecutó npx prisma generate. Esto creó el cliente de Prisma optimizado (@prisma/client) que nos permite interactuar con la base de datos usando JavaScript/TypeScript de forma moderna y segura.

Centralización: (Opcional) Se creó un archivo /config/prisma.js que exporta una única instancia de PrismaClient. Esto nos permite importar y reutilizar la misma conexión en todos los controladores, siguiendo las buenas prácticas.

Captira de npx prisma db pull y npx prisma generate
![](image.png)

---

## Correcciones y Ajustes Realizados

### 1. Migración a CommonJS

- **Problema:** El proyecto mezclaba sintaxis ES Modules (`import`/`export`) con CommonJS (`require`/`module.exports`).
- **Solución:** Se convirtió todo el proyecto a CommonJS para mantener consistencia y compatibilidad con Node.js sin configuraciones adicionales.
- **Archivos afectados:** `src/app.js`, `src/routes/index.js`, `prisma.config.js`
  s

### 2. Configuración de Prisma Client

- **Problema:** El archivo `src/config/prisma.js` importaba desde una ruta incorrecta (`../generated/prisma`).
- **Solución:** Se corrigió la importación para usar `@prisma/client` directamente desde node_modules.
- **Código corregido:**
  ```javascript
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  module.exports = prisma;
  ```

### 3. Esquema de Prisma

- **Problema:** El `schema.prisma` contenía modelos de otro proyecto (accesorios, repuestos, consultas) que no correspondían al club deportivo.
- **Solución:** Se reemplazó completamente el esquema con los modelos correctos: `usuarios`, `socios`, `deportes`, `socios_deportes`, `pagos`, y `password_resets`.
- **Ajuste adicional:** Se cambió el tipo de `fecha_inscripcion` de `Date` a `DateTime` para compatibilidad con `DEFAULT NOW()` en MySQL.

### 4. Variables de Entorno

- **Problema:** Faltaban variables de entorno esenciales para JWT y el servicio de email.
- **Solución:** Se completó el archivo `.env` con:
  - `JWT_SECRET` para autenticación
  - Configuración SMTP (host, port, user, pass)
  - `FRONTEND_URL` para enlaces de recuperación de contraseña
  - `RESET_TOKEN_EXP_MIN` para expiración de tokens

### 5. Arquitectura de Rutas

- **Problema:** Las rutas de autenticación causaban conflicto (`/api/auth/login` no encontrada).
- **Solución:** Se reorganizó `src/routes/index.js` para importar los controladores de auth directamente y exponerlos como `/api/login` en lugar de `/api/auth/login`.
- **Estructura modularizada:**
  ```
  index.js (raíz)      → Inicia el servidor
  src/app.js           → Configura Express y middlewares
  src/routes/index.js  → Centraliza todas las rutas
  ```










