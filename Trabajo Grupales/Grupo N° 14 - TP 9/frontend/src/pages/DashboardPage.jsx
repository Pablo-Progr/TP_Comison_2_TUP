import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const { user, logout, token, userEmail, userType, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🏆 Dashboard - Club Deportivo</h1>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>¡Bienvenido{isAdmin ? " Administrador" : ""}!</h2>
          <div className="user-info">
            <p>
              <strong>Email:</strong> {userEmail || user?.email}
            </p>
            <p>
              <strong>Tipo:</strong> {userType || user?.user_type}
            </p>
            {user?.rol && (
              <p>
                <strong>Rol:</strong> {user.rol}
              </p>
            )}
          </div>
        </div>

        <div className="modules-section">
          <h2>� Módulos de Gestión</h2>
          <div className="modules-grid">
            <button
              className="module-button socios"
              onClick={() => navigate("/socios")}
            >
              <span className="module-icon">👥</span>
              <span className="module-title">Socios</span>
              <span className="module-desc">Gestión de socios</span>
            </button>

            <button
              className="module-button deportes"
              onClick={() => navigate("/deportes")}
            >
              <span className="module-icon">⚽</span>
              <span className="module-title">Deportes</span>
              <span className="module-desc">Gestión de deportes</span>
            </button>

            <button
              className="module-button pagos"
              onClick={() => navigate("/pagos")}
            >
              <span className="module-icon">💰</span>
              <span className="module-title">Pagos</span>
              <span className="module-desc">Registro de pagos</span>
            </button>

            <button
              className="module-button asignaciones"
              onClick={() => navigate("/asignaciones")}
            >
              <span className="module-icon">🔗</span>
              <span className="module-title">Asignaciones</span>
              <span className="module-desc">Socios y deportes</span>
            </button>
          </div>
        </div>

        <div className="token-card">
          <h3>🔑 Token JWT</h3>
          <div className="token-display">
            <code>{token}</code>
          </div>
          <p className="token-hint">
            Este token se incluye automáticamente en todas las peticiones a la
            API.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
