import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const navegarPara = useNavigate();

  return (
    <header className="loca-header animar-subida">
      <div className="user-profile" onClick={() => navegarPara('/admin/perfil')}>
        <span>Lucas Peixoto</span>
        <div className="avatar">L</div>
        
        {/* BALÃOZINHO DO HOVER */}
        <div className="perfil-dropdown">
          <p className="dropdown-email">lucas@unifor.br</p>
          <p className="dropdown-cargo">ADMINISTRADOR</p>
          <hr />
          <p className="dropdown-acao">Meu Perfil <span>➔</span></p>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;