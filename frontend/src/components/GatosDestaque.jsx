import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GatosDestaque.css';

const GatosDestaque = () => {
  const navigate = useNavigate();
  const [gatosDestaque, setGatosDestaque] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDestaques() {
      try {
        const resposta = await fetch('http://localhost:5000/api/gatos');
        const dados = await resposta.json();
        
        // Pega apenas os disponíveis e corta para mostrar só os 3 mais recentes
        const disponiveis = dados.filter(gato => gato.status === 'Disponível').slice(0, 3);
        setGatosDestaque(disponiveis);
        setCarregando(false);
      } catch (erro) {
        console.error("Erro ao carregar destaques", erro);
        setCarregando(false);
      }
    }
    carregarDestaques();
  }, []);

  return (
    <section className="destaque-section">
      <h2 className="destaque-titulo">Adote um resgatinho</h2>
      
      <div className="destaque-grid">
        {carregando ? (
          <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>Buscando destaques...</p>
        ) : (
          gatosDestaque.map((gato) => (
            <div key={gato._id} className="destaque-card">
              <img 
                src={gato.foto || 'https://via.placeholder.com/320x260?text=Sem+Foto'} 
                alt={`Foto do gato ${gato.nome}`} 
                className="destaque-foto"
              />
              <div className="destaque-info">
                <h3>{gato.nome}</h3>
                <button 
                  className="btn-saiba-mais-mini" 
                  onClick={() => navigate(`/gato/${gato._id}`)}
                >
                  Saiba Mais
                </button>
              </div>
            </div>
          ))
        )}
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