import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero-cat.jpg';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  // O observador bidirecional (aparece ao descer, some ao subir)
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

    const hiddenElements = document.querySelectorAll('.hero-esconder');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero-container">
      {/* Adicionamos o hero-esconder aqui */}
      <div className="hero-content hero-esconder">
        <h1>
          Não compre, <br />
          <span className="highlight">adote.</span>
        </h1>
        <p>
          Mude a vida de um gatinho da faculdade. Adoção responsável em parceria com a Medicina Veterinária.
        </p>
        <button className="hero-btn" onClick={() => navigate('/adote')}>
          Conhecer Gatinhos
        </button>
      </div>
      
      {/* E aqui com um leve atraso */}
      <div className="hero-image-wrapper hero-esconder atraso-1">
        <img src={heroImg} alt="Gatinho em destaque" />
      </div>
    </section>
  );
};

export default Hero;