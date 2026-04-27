import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  // Animação de Scroll para o Footer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mostrar');
        } else {
          entry.target.classList.remove('mostrar');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.footer-esconder');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* A marca desliza da esquerda */}
        <div className="footer-brand footer-esconder desliza-esquerda">
          <h3 className="footer-logo">🐾 Resgatinhos Unifor</h3>
          <p>Projeto dedicado ao bem-estar e adoção responsável dos gatinhos do campus. Parceiro da Medicina Veterinária.</p>
        </div>
        
        {/* O resto sobe em cascata */}
        <div className="footer-links footer-esconder atraso-1">
          <h4>Acesso Rápido</h4>
          <ul>
            <li><Link to="/">Página Inicial</Link></li>
            <li><Link to="/adote">Quero Adotar</Link></li>
            <li><Link to="/contato">Fale Conosco</Link></li>
          </ul>
        </div>

        <div className="footer-contact footer-esconder atraso-2">
          <h4>Contato Direto</h4>
          <ul>
            <li><a href="mailto:veterinaria@unifor.br">📧 veterinaria@unifor.br</a></li>
            <li><a href="tel:+5585999999999">📞 (85) 9999-9999</a></li>
            <li><a href="https://wa.me/5585999999999" target="_blank" rel="noreferrer">📱 WhatsApp</a></li>
          </ul>
        </div>
        
        <div className="footer-social footer-esconder atraso-3">
          <h4>Nossas Redes</h4>
          <div className="social-links">
            <a href="https://instagram.com/uniforcomunica" target="_blank" rel="noreferrer">
              {/* Ícone do Instagram em SVG */}
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Instagram
            </a>
            <a href="https://facebook.com/unifor" target="_blank" rel="noreferrer">
              {/* Ícone do Facebook em SVG */}
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
              Facebook
            </a>
          </div>
        </div>

      </div>
      
      <div className="footer-bottom">
        <p>© 2026 Resgatinhos Unifor. Desenvolvido com muito 💙 para os felinos.</p>
      </div>
    </footer>
  );
};

export default Footer;