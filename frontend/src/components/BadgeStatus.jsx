import React from 'react';

const BadgeStatus = ({ status }) => {
  const configurar = {
    'Disponível': { classe: 'status-disponivel', texto: 'Disponível' },
    'Adotado': { classe: 'status-adotado', texto: 'Adotado' },
    'Pendente': { classe: 'status-pendente', texto: 'Análise' }
  };

  const config = configurar[status] || { classe: 'status-padrao', texto: status };

  return <span className={`badge ${config.classe}`}>{config.texto}</span>;
};

export default BadgeStatus;