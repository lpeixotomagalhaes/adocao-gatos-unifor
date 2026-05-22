import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Cat,
  Users,
  Archive,
  ScrollText,
  CircleUser,
  LogOut,
  PawPrint,
  Menu,
  X,
} from 'lucide-react';
import './AdminSidebar.css';

const GRUPOS = [
  {
    titulo: 'Operação',
    itens: [
      { rota: '/admin/dashboard',    label: 'Dashboard',    Icone: LayoutDashboard },
      { rota: '/admin/solicitacoes', label: 'Solicitações', Icone: Inbox },
    ],
  },
  {
    titulo: 'Gestão de Animais',
    itens: [
      { rota: '/admin/gatos',      label: 'No Campus',  Icone: Cat },
      { rota: '/admin/adotantes',  label: 'Adotados',   Icone: Users },
      { rota: '/admin/arquivados', label: 'Arquivados', Icone: Archive },
    ],
  },
  {
    titulo: 'Sistema',
    itens: [
      { rota: '/admin/historico', label: 'Auditoria',  Icone: ScrollText },
      { rota: '/admin/perfil',    label: 'Meu Perfil', Icone: CircleUser },
    ],
  },
];

const AdminSidebar = () => {
  const navegarPara = useNavigate();
  const localizacao = useLocation();
  const [aberto, setAberto] = useState(false);

  const ativo = (rota) => localizacao.pathname === rota;

  const irPara = (rota) => {
    navegarPara(rota);
    setAberto(false);
  };

  const sair = () => {
    localStorage.removeItem('tokenAdmin');
    localStorage.removeItem('adminNome');
    localStorage.removeItem('adminEmail');
    navegarPara('/admin');
  };

  return (
    <>
      <button
        className="sidebar-hamburger"
        onClick={() => setAberto(true)}
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      {aberto && <div className="sidebar-backdrop" onClick={() => setAberto(false)} />}

      <aside className={`loca-sidebar ${aberto ? 'loca-sidebar--aberta' : ''}`}>
        <div className="sidebar-header">
          <span className="logo-icon"><PawPrint size={20} /></span>
          <h2 className="logo-texto">Admin Unifor</h2>
          <button
            className="sidebar-fechar"
            onClick={() => setAberto(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        {GRUPOS.map((grupo) => (
          <div className="sidebar-menu-group" key={grupo.titulo}>
            <span className="menu-title">{grupo.titulo}</span>
            {grupo.itens.map(({ rota, label, Icone }) => (
              <button
                key={rota}
                data-tooltip={label}
                className={`menu-btn ${ativo(rota) ? 'active' : ''}`}
                onClick={() => irPara(rota)}
              >
                <span className="icone"><Icone size={18} /></span>
                <span className="texto">{label}</span>
              </button>
            ))}
          </div>
        ))}

        <button data-tooltip="Sair" className="btn-sair-loca" onClick={sair}>
          <span className="icone"><LogOut size={18} /></span>
          <span className="texto">Sair do Sistema</span>
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;
