import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css'; 

const AdminHeader = () => {
  const navegarPara = useNavigate();

  return (
    <header className="loca-header animar-subida">
      <div className="loca-header-container">
        <div className="user-profile" onClick={() => navegarPara('/admin/perfil')}>
          
          <div className="user-info-text">
            <span className="user-name">Lucas Peixoto</span>
            <span className="user-role">Administrador</span>
          </div>
          
          <div className="avatar">L</div>
          
          {/* DROPDOWN DO PERFIL */}
          <div className="perfil-dropdown">
            <p className="dropdown-email">lucas@unifor.br</p>
            <p className="dropdown-curso">Ciências da Computação</p>
            <hr />
            <p className="dropdown-acao">Meu Perfil <span style={{ color: 'var(--unifor-blue-light)' }}>➔</span></p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;