import React from 'react';
import { Inbox } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ icone: Icone = Inbox, titulo, descricao, acao = null, compacto = false }) => (
  <div className={`ui-empty ${compacto ? 'ui-empty--compacto' : ''}`}>
    <div className="ui-empty__icone">
      <Icone size={compacto ? 28 : 36} strokeWidth={1.5} />
    </div>
    <h3 className="ui-empty__titulo">{titulo}</h3>
    {descricao && <p className="ui-empty__descricao">{descricao}</p>}
    {acao}
  </div>
);

export default EmptyState;
