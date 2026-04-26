import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Isso avisa o React para usar o estilo que você criou

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">🐾 Resgatinhos Unifor</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Sobre Nós</Link></li>
        <li><Link to="/adote">Adote</Link></li>
        <li><Link to="/contato">Contato</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;