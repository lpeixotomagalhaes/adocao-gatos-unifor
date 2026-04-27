import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation(); // Descobre em qual página estamos

  return (
    // O key={location.pathname} força a animação a rodar de novo ao mudar de página
    <nav className="navbar" key={location.pathname}>
      <div className="logo">
        <Link to="/">🐾 Resgatinhos Unifor</Link>
      </div>
      <ul className="nav-links">
        <li className="nav-item anim-1"><Link to="/">Sobre Nós</Link></li>
        <li className="nav-item anim-2"><Link to="/adote">Adote</Link></li>
        <li className="nav-item anim-3"><Link to="/contato">Contato</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;