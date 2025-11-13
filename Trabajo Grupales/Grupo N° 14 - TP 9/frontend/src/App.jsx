import "./App.css";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProtectedRoute from "./proteccionRutas/ProtectedRoutes.jsx";
import Asignaciones from "./pages/Asignaciones.jsx";
import Deportes from "./pages/Deportes.jsx";
import Socios from "./pages/Socios.jsx";
import Pagos from "./pages/pagos.jsx"; // Corregí la importación para que apunte al archivo correcto.
import RegistrarPagoForm from "./components/RegistrarPagoForm.jsx";
import ListaPagos from "./components/ListaPagos.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Pagos"
            element={
              <ProtectedRoute>
                <Pagos />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/asignaciones"
            element={
              <ProtectedRoute>
                <Asignaciones />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route
            path="/deportes"
            element={
              <ProtectedRoute>
                <Deportes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/socios"
            element={
              <ProtectedRoute>
                <Socios />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
