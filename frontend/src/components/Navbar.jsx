import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar" key={location.pathname}>
      <div className="logo">
        <Link to="/"><PawPrint size={20} /> Resgatinhos Unifor</Link>
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
