import React from 'react';
import { useNavigate } from 'react-router-dom';
import BadgeStatus from './BadgeStatus';

const GatoCard = ({ gato }) => {
  const navigate = useNavigate();

  return (
    <div className="destaque-card">
      <div className="card-badge-pos">
        <BadgeStatus status={gato.status} />
      </div>
      <img 
        src={gato.foto || 'https://via.placeholder.com/300'} 
        alt={gato.nome} 
        className="destaque-foto"
      />
      <div className="destaque-info">
        <h3>{gato.nome}</h3>
        <p>{gato.sexo} • {gato.idade}</p>
        <button 
          className="btn-saiba-mais-mini" 
          onClick={() => navigate(`/gato/${gato._id}`)}
        >
          Conhecer {gato.nome}
        </button>
      </div>
    </div>
  );
};

export default GatoCard;