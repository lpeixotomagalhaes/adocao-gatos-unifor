import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtecaoRota = ({ children }) => {
  // Pega o token do armazenamento local
  const token = localStorage.getItem('tokenAdmin');

  // Se NÃO tiver o token, redireciona imediatamente para a tela de login (/admin)
  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  // Se tiver o token, deixa a pessoa entrar na página que ela pediu (children)
  return children;
};

export default ProtecaoRota;