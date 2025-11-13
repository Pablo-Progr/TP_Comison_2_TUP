import React from "react";
import { Link} from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {



  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Club Deportivo Los Halcones</h1>
        <p>
          Bienvenido a nuestra comunidad deportiva. Promovemos el trabajo en
          equipo, el esfuerzo y la pasión por el deporte.
        </p>
      </header>

      <nav className="homepage-nav">
        <Link to="/login" className="nav-link login-link">
          🔐 Iniciar Sesión
        </Link>
      </nav>

      <main className="homepage-main">
        <section className="intro-section">
          <h2>Un lugar para crecer juntos</h2>
          <p>
            En el Club Deportivo Los Halcones encontrarás entrenamientos de
            fútbol, básquet, natación y muchas más disciplinas. Nuestra misión
            es formar deportistas y personas íntegras.
          </p>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
