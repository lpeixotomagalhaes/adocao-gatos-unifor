import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminHeader.css';

const TITULOS_POR_ROTA = {
  '/admin/dashboard':    { titulo: 'Dashboard',      sub: 'Visão geral do projeto Resgatinhos' },
  '/admin/solicitacoes': { titulo: 'Solicitações',   sub: 'Formulários de adoção recebidos' },
  '/admin/gatos':        { titulo: 'No Campus',      sub: 'Gatos disponíveis para adoção' },
  '/admin/adotantes':    { titulo: 'Adotados',       sub: 'Histórico de adoções concluídas' },
  '/admin/arquivados':   { titulo: 'Arquivados',     sub: 'Registros removidos do catálogo' },
  '/admin/historico':    { titulo: 'Auditoria',      sub: 'Logs de atividade do sistema' },
  '/admin/perfil':       { titulo: 'Meu Perfil',     sub: 'Configurações da conta' },
};

const AdminHeader = () => {
  const navegarPara = useNavigate();
  const localizacao = useLocation();
  const [admin, setAdmin] = useState({ nome: 'Administrador', email: '', inicial: 'A' });

  useEffect(() => {
    const nomeSalvo = localStorage.getItem('adminNome') || 'Administrador';
    const emailSalvo = localStorage.getItem('adminEmail') || 'admin@unifor.br';

    setAdmin({
      nome: nomeSalvo,
      email: emailSalvo,
      inicial: nomeSalvo.charAt(0).toUpperCase()
    });
  }, []);

  const pagina = TITULOS_POR_ROTA[localizacao.pathname] || { titulo: 'Painel', sub: '' };
  const dataHoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <header className="loca-header animar-subida">
      <div className="loca-header-container">

        <div className="header-titulo">
          <h1 className="header-titulo-principal">{pagina.titulo}</h1>
          <p className="header-titulo-sub">
            {pagina.sub && <span>{pagina.sub}</span>}
            {pagina.sub && <span className="header-sep">•</span>}
            <span className="header-data">{dataHoje}</span>
          </p>
        </div>

        <div className="user-profile" onClick={() => navegarPara('/admin/perfil')}>

          <div className="avatar-wrap">
            <div className="avatar">{admin.inicial}</div>
            <span className="avatar-status" />
          </div>

          <div className="user-info-text">
            <span className="user-name">{admin.nome}</span>
            <span className="user-role">Administrador</span>
          </div>

          <svg className="user-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>

          {/* DROPDOWN DO PERFIL */}
          <div className="perfil-dropdown">
            <p className="dropdown-email">{admin.email}</p>
            <p className="dropdown-curso">Gestão do Sistema</p>
            <hr />
            <p className="dropdown-acao">Meu Perfil <span style={{ color: 'var(--unifor-blue-light)' }}>➔</span></p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
