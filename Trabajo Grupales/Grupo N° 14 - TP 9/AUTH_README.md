# 🔐 Sistema de Autenticación - Club Deportivo

## 📁 Estructura creada

```
src/
├── services/
│   ├── api.js              # Configuración de Axios con interceptores
│   ├── authService.js      # Servicio de autenticación
│   └── clubService.js      # Servicios del club (socios, deportes, etc.)
├── store/
│   └── useAuthStore.js     # Store de Zustand para autenticación
├── pages/
│   ├── LoginPage.jsx       # Componente de login
│   └── DashboardPage.jsx   # Dashboard protegido
├── proteccionRutas/
│   └── ProtectedRoutes.jsx # Componente para rutas protegidas
└── styles/
    ├── LoginPage.css       # Estilos del login
    └── DashboardPage.css   # Estilos del dashboard
```

## 🚀 Cómo usar

### 1. Iniciar sesión

Ve a `/login` e inicia sesión con:

- **Email:** admin@club.com
- **Password:** admin123

El token JWT se guarda automáticamente en `localStorage`.

### 2. Token automático en peticiones

El interceptor de Axios agrega el token automáticamente a todas las peticiones:

```javascript
import api from "./services/api";

// El token se incluye automáticamente
const socios = await api.get("/socios");
```

### 3. Usar el store de autenticación

```javascript
import useAuthStore from "./store/useAuthStore";

function MiComponente() {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();

  // Verificar si está autenticado
  if (isAuthenticated) {
    console.log("Usuario:", user);
    console.log("Token:", token);
  }

  // Hacer login
  const handleLogin = async () => {
    try {
      await login("admin@club.com", "admin123");
      console.log("Login exitoso");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    logout();
  };
}
```

### 4. Usar los servicios del club

```javascript
import clubService from "./services/clubService";

// Obtener socios
const socios = await clubService.getSocios();

// Crear socio
const nuevoSocio = await clubService.createSocio({
  nombre: "Juan Pérez",
  dni: "40123456",
  telefono: "381-1234567",
  email: "juan@example.com",
  password: "password123",
});

// Obtener deportes
const deportes = await clubService.getDeportes();

// Asignar socio a deporte
await clubService.asignarSocioDeporte(1, 2);

// Registrar pago
const pago = await clubService.createPago({
  socio_id: 1,
  deporte_id: 2,
  mes: 11,
  anio: 2025,
  monto: 15000.0,
});
```

### 5. Proteger rutas

```javascript
import ProtectedRoute from "./proteccionRutas/ProtectedRoutes";

<Route
  path="/mi-ruta-protegida"
  element={
    <ProtectedRoute>
      <MiComponente />
    </ProtectedRoute>
  }
/>;
```

## 🔑 Características

### Interceptor de Axios

- ✅ Agrega el token automáticamente a todas las peticiones
- ✅ Maneja errores 401 (token expirado) redirigiendo al login
- ✅ Guarda y recupera el token de localStorage

### Store de Zustand

- ✅ Estado global de autenticación
- ✅ Métodos para login/logout
- ✅ Persistencia en localStorage
- ✅ Manejo de errores

### Rutas protegidas

- ✅ Redirige al login si no está autenticado
- ✅ Fácil de usar con cualquier componente

## 📝 Notas importantes

1. **Token JWT:** Expira en 12 horas (configurado en el backend)
2. **LocalStorage:** El token se guarda en localStorage automáticamente
3. **Redirección automática:** Si el token expira, se redirige al login
4. **CORS:** El backend debe estar corriendo en `http://localhost:3000`

## 🛠️ Próximos pasos

Ya puedes:

1. ✅ Iniciar sesión y obtener el token
2. ✅ Usar el token en todas las peticiones automáticamente
3. ✅ Crear componentes para gestionar socios, deportes, pagos, etc.
4. ✅ Proteger rutas que requieran autenticación

## 🔗 Endpoints disponibles

Ver el archivo `UrlsFrontend.MD` para la lista completa de endpoints.
