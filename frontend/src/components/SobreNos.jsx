// src/components/SobreNos.jsx
import React from 'react';

const SobreNos = () => {
  return (
    <section style={{ 
      padding: '100px 10%', 
      backgroundColor: 'var(--white)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <h2 style={{ 
        color: 'var(--unifor-blue-dark)', 
        fontSize: '2.8rem', 
        margin: '0 0 15px 0',
        fontWeight: '700'
      }}>
        Sobre o Projeto
      </h2>
      
      {/* Linha decorativa para dar um toque de design */}
      <div style={{
        width: '80px',
        height: '5px',
        backgroundColor: 'var(--unifor-blue-light)',
        borderRadius: '5px',
        marginBottom: '40px'
      }}></div>

      <p style={{ 
        lineHeight: '1.8', 
        color: 'var(--text-color)', 
        fontSize: '1.2rem',
        maxWidth: '850px',
        margin: 0
      }}>
        O principal objetivo do nosso projeto é sensibilizar a comunidade acadêmica sobre a 
        adoção e posse responsável. Através de uma parceria com o curso de Medicina Veterinária, 
        cuidamos dos gatinhos que vivem no campus, garantindo saúde e bem-estar até que 
        encontrem um lar definitivo e cheio de amor.
      </p>
    </section>
  );
};

export default SobreNos;