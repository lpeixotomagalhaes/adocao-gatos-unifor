import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import SobreNos from '../components/SobreNos';
import GatosDestaque from '../components/GatosDestaque';

const Home = () => {
useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mostrar'); // Aparece quando desce
        } else {
          entry.target.classList.remove('mostrar'); // Some quando sobe!
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.esconder');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  return (
    <>
      <Hero />
      {/* Adicionamos a classe 'esconder' para eles sumirem no começo */}
      <div className="esconder">
        <SobreNos />
      </div>
      <div className="esconder">
        <GatosDestaque />
      </div>
    </>
  );
};

export default Home;