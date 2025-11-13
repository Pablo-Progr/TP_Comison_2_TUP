# 🪝 Custom Hooks - Club Deportivo

## Hooks Disponibles

### 1. **useAuth** - Autenticación

Hook para acceder fácilmente al estado de autenticación.

```javascript
import useAuth from "../hooks/useAuth";

function MiComponente() {
  const { user, token, isAuthenticated, login, logout, isAdmin, isOperador } =
    useAuth();

  // Verificar si está autenticado
  if (!isAuthenticated) {
    return <p>No autenticado</p>;
  }

  // Verificar rol
  if (isAdmin) {
    return <p>Acceso de administrador</p>;
  }

  return <p>Hola {user.email}</p>;
}
```

**Propiedades:**

- `user` - Datos del usuario
- `token` - Token JWT
- `isAuthenticated` - Boolean de autenticación
- `loading` - Estado de carga
- `error` - Mensaje de error
- `isAdmin` - Boolean si es admin
- `isOperador` - Boolean si es operador
- `userEmail` - Email del usuario
- `userType` - Tipo de usuario

**Métodos:**

- `login(email, password)` - Iniciar sesión
- `logout()` - Cerrar sesión
- `clearError()` - Limpiar errores

---

### 2. **useFetch** - Peticiones HTTP

Hook para hacer peticiones a la API con manejo de estados.

```javascript
import useFetch from "../hooks/useFetch";

function ListaSocios() {
  // Auto-fetch al montar
  const { data, loading, error, refetch } = useFetch("/socios");

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {data?.map((socio) => (
        <div key={socio.id}>{socio.nombre}</div>
      ))}
      <button onClick={refetch}>Recargar</button>
    </div>
  );
}

// POST con datos
function CrearSocio() {
  const { fetchData, loading } = useFetch("/socios", {
    autoFetch: false,
    method: "POST",
  });

  const handleSubmit = async () => {
    try {
      await fetchData({
        nombre: "Juan",
        email: "juan@example.com",
      });
      alert("Socio creado");
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleSubmit}>Crear</button>;
}
```

**Opciones:**

- `url` - Endpoint de la API
- `autoFetch` - Ejecutar al montar (default: true)
- `method` - Método HTTP (GET, POST, PUT, DELETE)
- `body` - Datos para POST/PUT

**Retorna:**

- `data` - Datos de la respuesta
- `loading` - Estado de carga
- `error` - Mensaje de error
- `fetchData(body)` - Ejecutar petición manualmente
- `refetch()` - Recargar datos
- `reset()` - Limpiar estado

---

### 3. **useModal** - Gestión de Modales

Hook para manejar el estado de modales.

```javascript
import useModal from "../hooks/useModal";

function MiComponente() {
  const { isOpen, modalData, openModal, closeModal } = useModal();

  const handleEdit = (socio) => {
    openModal(socio); // Pasar datos al modal
  };

  return (
    <>
      <button onClick={() => openModal()}>Abrir Modal</button>

      {isOpen && (
        <div className="modal">
          <h2>Modal</h2>
          {modalData && <p>Editando: {modalData.nombre}</p>}
          <button onClick={closeModal}>Cerrar</button>
        </div>
      )}
    </>
  );
}
```

**Retorna:**

- `isOpen` - Estado del modal (abierto/cerrado)
- `modalData` - Datos pasados al modal
- `openModal(data)` - Abrir modal con datos opcionales
- `closeModal()` - Cerrar modal
- `toggleModal()` - Alternar estado

---

### 4. **usePagination** - Paginación

Hook para paginar arrays de datos.

```javascript
import usePagination from "../hooks/usePagination";

function ListaPaginada({ socios }) {
  const {
    currentData,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    hasNextPage,
    hasPreviousPage,
    startItem,
    endItem,
    totalItems,
  } = usePagination(socios, 10); // 10 items por página

  return (
    <div>
      {/* Mostrar datos de la página actual */}
      {currentData.map((socio) => (
        <div key={socio.id}>{socio.nombre}</div>
      ))}

      {/* Información de paginación */}
      <p>
        Mostrando {startItem} - {endItem} de {totalItems}
      </p>

      {/* Controles de navegación */}
      <button onClick={previousPage} disabled={!hasPreviousPage}>
        Anterior
      </button>

      <span>
        Página {currentPage} de {totalPages}
      </span>

      <button onClick={nextPage} disabled={!hasNextPage}>
        Siguiente
      </button>

      {/* Ir a página específica */}
      <input type="number" onChange={(e) => goToPage(Number(e.target.value))} />
    </div>
  );
}
```

**Parámetros:**

- `data` - Array de datos a paginar
- `itemsPerPage` - Items por página (default: 10)

**Retorna:**

- `currentData` - Datos de la página actual
- `currentPage` - Página actual
- `totalPages` - Total de páginas
- `itemsPerPage` - Items por página
- `totalItems` - Total de items
- `startItem` - Índice del primer item
- `endItem` - Índice del último item
- `hasNextPage` - Hay página siguiente
- `hasPreviousPage` - Hay página anterior
- `isFirstPage` - Es la primera página
- `isLastPage` - Es la última página
- `goToPage(page)` - Ir a página específica
- `nextPage()` - Página siguiente
- `previousPage()` - Página anterior
- `firstPage()` - Primera página
- `lastPage()` - Última página
- `reset()` - Resetear a primera página

---

## 💡 Ejemplos Combinados

### Ejemplo completo: Lista de socios con paginación y modal

```javascript
import useFetch from "../hooks/useFetch";
import usePagination from "../hooks/usePagination";
import useModal from "../hooks/useModal";

function GestionSocios() {
  const { data: socios, loading, refetch } = useFetch("/socios");
  const { isOpen, modalData, openModal, closeModal } = useModal();
  const { currentData, currentPage, totalPages, nextPage, previousPage } =
    usePagination(socios || [], 10);

  const handleEdit = (socio) => {
    openModal(socio);
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Socios</h1>

      {/* Lista */}
      {currentData.map((socio) => (
        <div key={socio.id}>
          <span>{socio.nombre}</span>
          <button onClick={() => handleEdit(socio)}>Editar</button>
        </div>
      ))}

      {/* Paginación */}
      <button onClick={previousPage}>Anterior</button>
      <span>
        {currentPage} / {totalPages}
      </span>
      <button onClick={nextPage}>Siguiente</button>

      {/* Modal */}
      {isOpen && (
        <div className="modal">
          <h2>Editar Socio</h2>
          <p>{modalData?.nombre}</p>
          <button onClick={closeModal}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
```
