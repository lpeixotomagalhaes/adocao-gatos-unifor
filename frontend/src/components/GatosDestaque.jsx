import React from 'react';

const GatosDestaque = () => {
  // Dados provisórios (mock) até conectarmos o PostgreSQL
  const gatos = [
  { id: 1, nome: 'Mingau', foto: 'https://placekitten.com/300/300' },
  { id: 2, nome: 'Luna', foto: 'https://placekitten.com/305/305' },
  { id: 3, nome: 'Frajola', foto: 'https://placekitten.com/310/310' },
 ];
  return (
    <section style={{ padding: '50px 5%', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
      <h2 style={{ color: '#003366', marginBottom: '30px' }}>Adote um resgatinho</h2>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {gatos.map((gato) => (
          <div key={gato.id} style={{ 
            backgroundColor: '#fff', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            width: '250px'
          }}>
            <div style={{ 
              width: '100%', 
              height: '200px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '8px', 
              marginBottom: '15px' 
            }}>
              {/* Imagem do gato virá aqui */}
            </div>
            <h3 style={{ color: '#333' }}>{gato.nome}</h3>
          </div>
        ))}
      </div>

      <button style={{
        marginTop: '40px',
        padding: '15px 30px',
        backgroundColor: '#0056b3',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer'
      }}>
        Conheça os gatinhos disponíveis
      </button>
    </section>
  );
};

export default GatosDestaque;