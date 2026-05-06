import React from 'react';
import './SobreNos.css'; // Chamando o arquivo de estilos que vamos criar

const SobreNos = () => {
  return (
    <section className="sobre-section">
      <h2 className="sobre-titulo">Sobre o Projeto</h2>
      
      {/* Linha decorativa para dar um toque de design */}
      <div className="sobre-linha"></div>

      <p className="sobre-texto">
        O principal objetivo do nosso projeto é sensibilizar a comunidade acadêmica sobre a 
        adoção e posse responsável. Através de uma parceria com o curso de Medicina Veterinária, 
        cuidamos dos gatinhos que vivem no campus, garantindo saúde e bem-estar até que 
        encontrem um lar definitivo e cheio de amor.
      </p>
    </section>
  );
};

export default SobreNos;