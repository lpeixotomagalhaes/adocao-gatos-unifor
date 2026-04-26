import React from 'react';
import heroImg from '../assets/hero-cat.jpg';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-container">
      <div className="hero-content">
        <h1>
          Não compre, <br />
          <span className="highlight">adote.</span>
        </h1>
        <p>
          Mude a vida de um gatinho da faculdade. Adoção responsável em parceria com a Medicina Veterinária.
        </p>
        <button className="hero-btn">
          Conhecer Gatinhos
        </button>
      </div>
      
      <div className="hero-image-wrapper">
        <img src={heroImg} alt="Gatinho em destaque" />
      </div>
    </section>
  );
};

export default Hero;