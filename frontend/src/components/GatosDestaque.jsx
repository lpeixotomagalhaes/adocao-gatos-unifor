import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GatosDestaque.css'; // Chamando o arquivo de estilos

const GatosDestaque = () => {
  const navigate = useNavigate();

  const gatos = [
    { id: 1, nome: 'Mingau', foto: 'https://loremflickr.com/320/260/cat?lock=1' },
    { id: 2, nome: 'Luna', foto: 'https://loremflickr.com/320/260/cat?lock=2' },
    { id: 3, nome: 'Frajola', foto: 'https://loremflickr.com/320/260/cat?lock=3' },
  ];

  return (
    <section className="destaque-section">
      <h2 className="destaque-titulo">Adote um resgatinho</h2>
      
      <div className="destaque-grid">
        {gatos.map((gato) => (
          <div key={gato.id} className="destaque-card">
            <img 
              src={gato.foto} 
              alt={`Foto do gato ${gato.nome}`} 
              className="destaque-foto"
            />
            <div className="destaque-info">
              <h3>{gato.nome}</h3>
              <button 
                className="btn-saiba-mais-mini" 
                onClick={() => navigate(`/gato/${gato.id}`)}
              >
                Saiba Mais
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="btn-ver-todos"
        onClick={() => navigate('/adote')}
      >
        Conheça os gatinhos disponíveis
      </button>
    </section>
  );
};

export default GatosDestaque;