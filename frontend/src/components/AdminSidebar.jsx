import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminSidebar.css'; 

const AdminSidebar = () => {
  const navegarPara = useNavigate();
  const localizacao = useLocation();

  const taAtivo = (caminho) => localizacao.pathname === caminho ? 'active' : '';

  return (
    <aside className="loca-sidebar">
      <div className="sidebar-header">
        <span className="logo-icon animar-pulso">🐾</span>
        <h2 className="logo-texto">Admin Unifor</h2>
      </div>
      
      <div className="sidebar-menu-group">
        <span className="menu-title">OPERAÇÃO</span>
        <button className={`menu-btn ${taAtivo('/admin/dashboard')}`} onClick={() => navegarPara('/admin/dashboard')}>
          <span className="icone">📊</span> <span className="texto">Dashboard</span>
        </button>
        <button className={`menu-btn ${taAtivo('/admin/solicitacoes')}`} onClick={() => navegarPara('/admin/solicitacoes')}>
          <span className="icone">📋</span> <span className="texto">Solicitações</span>
        </button>
      </div>

      <div className="sidebar-menu-group">
        <span className="menu-title">GESTÃO DE ANIMAIS</span>
        <button className={`menu-btn ${taAtivo('/admin/gatos')}`} onClick={() => navegarPara('/admin/gatos')}>
          <span className="icone">🐈</span> <span className="texto">No Campus</span>
        </button>
        <button className={`menu-btn ${taAtivo('/admin/adotantes')}`} onClick={() => navegarPara('/admin/adotantes')}>
          <span className="icone">👥</span> <span className="texto">Adotados</span>
        </button>
        {/* NOVO BOTÃO */}
        <button className={`menu-btn ${taAtivo('/admin/arquivados')}`} onClick={() => navegarPara('/admin/arquivados')}>
          <span className="icone">🗄️</span> <span className="texto">Arquivados</span>
        </button>
      </div>

      <div className="sidebar-menu-group">
        <span className="menu-title">SISTEMA</span>
        {/* NOVO BOTÃO */}
        <button className={`menu-btn ${taAtivo('/admin/historico')}`} onClick={() => navegarPara('/admin/historico')}>
          <span className="icone">📜</span> <span className="texto">Auditoria</span>
        </button>
        <button className={`menu-btn ${taAtivo('/admin/perfil')}`} onClick={() => navegarPara('/admin/perfil')}>
          <span className="icone">👤</span> <span className="texto">Meu Perfil</span>
        </button>
      </div>

      {/* Rota fantasma corrigida aqui: */}
      <button className="btn-sair-loca" onClick={() => { localStorage.removeItem('tokenAdmin'); navegarPara('/admin'); }}>
        <span className="icone">🚪</span> <span className="texto">Sair do Sistema</span>
      </button>
    </aside>
  );
};

export default AdminSidebar;