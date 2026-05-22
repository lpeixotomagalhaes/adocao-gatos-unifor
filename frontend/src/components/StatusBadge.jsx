import React from 'react';
import './StatusBadge.css';

const MAPA = {
  disponivel: { cor: 'success', label: 'Disponível' },
  pendente: { cor: 'warning', label: 'Pendente' },
  adotado: { cor: 'info', label: 'Adotado' },
  arquivado: { cor: 'neutral', label: 'Arquivado' },
  aprovado: { cor: 'success', label: 'Aprovado' },
  reprovado: { cor: 'danger', label: 'Reprovado' },
};

const StatusBadge = ({ status, children, cor }) => {
  const chave = (status || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const conf = MAPA[chave] || { cor: cor || 'neutral', label: status };
  return (
    <span className={`ui-badge ui-badge--${conf.cor}`}>
      <span className="ui-badge__dot" />
      {children || conf.label || status}
    </span>
  );
};

export default StatusBadge;
