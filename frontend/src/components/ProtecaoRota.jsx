import React from 'react';
import { Navigate } from 'react-router-dom';

const decodificarJwt = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
};

const tokenExpirado = (token) => {
  const dados = decodificarJwt(token);
  if (!dados?.exp) return true;
  return Date.now() >= dados.exp * 1000;
};

const ProtecaoRota = ({ children }) => {
  const token = localStorage.getItem('tokenAdmin');

  if (!token || tokenExpirado(token)) {
    localStorage.removeItem('tokenAdmin');
    localStorage.removeItem('adminNome');
    localStorage.removeItem('adminEmail');
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtecaoRota;
