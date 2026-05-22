import React, { useEffect, useState } from 'react';
import './AdminGatos.css';
import './AdminPerfil.css';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { SkeletonCard } from '../components/Skeleton';
import { apiFetch } from '../api';

const AdminPerfil = () => {
  const [metricas, setMetricas] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [admin, setAdmin] = useState({ nome: 'Carregando...', email: '', inicial: '' });

  useEffect(() => {
    const nomeSalvo = localStorage.getItem('adminNome') || 'Administrador';
    const emailSalvo = localStorage.getItem('adminEmail') || 'admin@unifor.br';
    setAdmin({ nome: nomeSalvo, email: emailSalvo, inicial: nomeSalvo.charAt(0).toUpperCase() });

    const buscar = async () => {
      try {
        const resposta = await apiFetch('/api/admin/dashboard');
        const dados = await resposta.json();
        setMetricas(dados);
      } catch (erro) {
        console.error("Erro ao buscar métricas:", erro);
      } finally {
        setCarregando(false);
      }
    };

    buscar();
  }, []);

  return (
    <div className="loca-dashboard-container">
      <AdminSidebar />
      <main className="loca-main-content">
        <AdminHeader />
        <div className="dashboard-content animar-subida atraso-1">
          <div className="page-header">
            <div>
              <h1 className="page-title">Meu Perfil</h1>
              <p className="page-subtitle">Acompanhe seu desempenho na gestão do projeto.</p>
            </div>
          </div>

          <div className="perfil-card">
            <div className="perfil-avatar">{admin.inicial}</div>
            <div className="perfil-info">
              <h2>{admin.nome}</h2>
              <p>{admin.email}</p>
              <span className="perfil-tag">ADMINISTRADOR</span>
            </div>
          </div>

          <h3 className="perfil-secao-titulo">Métricas de Atividade</h3>

          {carregando ? (
            <div className="loca-cards-grid">
              <SkeletonCard altura="92px" />
              <SkeletonCard altura="92px" />
              <SkeletonCard altura="92px" />
            </div>
          ) : (
            <div className="loca-cards-grid">
              <div className="loca-card">
                <span className="loca-card-title">Gatos sob sua Gestão</span>
                <span className="loca-card-value text-dark">{metricas?.totalGatos || 0}</span>
              </div>
              <div className="loca-card">
                <span className="loca-card-title">Adoções Aprovadas</span>
                <span className="loca-card-value text-green">{metricas?.gatosAdotados || 0}</span>
              </div>
              <div className="loca-card">
                <span className="loca-card-title">Processos Concluídos</span>
                <span className="loca-card-value text-blue">{(metricas?.gatosAdotados || 0) + (metricas?.formulariosPendentes || 0)}</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPerfil;
