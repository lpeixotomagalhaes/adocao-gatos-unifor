import React from 'react';

const AdminCard = ({ titulo, valor, corTexto }) => {
  return (
    <div className="loca-card">
      <span className="loca-card-title">{titulo}</span>
      <span className={`loca-card-value ${corTexto}`}>{valor}</span>
    </div>
  );
};

export default AdminCard;