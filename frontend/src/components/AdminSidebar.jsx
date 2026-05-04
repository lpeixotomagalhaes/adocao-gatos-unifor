import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const navegarPara = useNavigate();
  const localizacao = useLocation(); // Espião de URL

  // Função para verificar se o botão deve estar ativo
  const taAtivo = (caminho) => localizacao.pathname === caminho ? 'active' : '';

  return (
    <aside className="loca-sidebar">
      <div className="sidebar-header">
        <span className="logo-icon">🐾</span>
        <h2>Admin Unifor</h2>
      </div>
      
      <div className="sidebar-menu-group">
        <span className="menu-title">OPERAÇÃO</span>
        <button className={`menu-btn ${taAtivo('/admin/dashboard')}`} onClick={() => navegarPara('/admin/dashboard')}>📊 Dashboard</button>
        <button className={`menu-btn ${taAtivo('/admin/solicitacoes')}`} onClick={() => navegarPara('/admin/solicitacoes')}>📋 Solicitações</button>
      </div>

      <div className="sidebar-menu-group">
        <span className="menu-title">GESTÃO</span>
        <button className={`menu-btn ${taAtivo('/admin/gatos')}`} onClick={() => navegarPara('/admin/gatos')}>🐈 Gatos Resgatados</button>
        <button className={`menu-btn ${taAtivo('/admin/adotantes')}`} onClick={() => navegarPara('/admin/adotantes')}>👥 Adotantes</button>
        <button className={`menu-btn ${taAtivo('/admin/perfil')}`} onClick={() => navegarPara('/admin/perfil')}>👤 Meu Perfil</button>
      </div>

      <button className="btn-sair-loca" onClick={() => { localStorage.removeItem('tokenAdmin'); navegarPara('/admin/login'); }}>
        Sair do Sistema
      </button>
    </aside>
  );
};

export default AdminSidebar;