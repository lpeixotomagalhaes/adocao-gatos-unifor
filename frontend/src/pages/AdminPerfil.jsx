import React, { useEffect, useState } from 'react';
import './AdminGatos.css'; 
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

const AdminPerfil = () => {
  const [metricas, setMetricas] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [admin, setAdmin] = useState({ nome: 'Carregando...', email: '', inicial: '' });

  useEffect(() => {
    // 1. Puxa os dados pessoais do localStorage
    const nomeSalvo = localStorage.getItem('adminNome') || 'Administrador';
    const emailSalvo = localStorage.getItem('adminEmail') || 'admin@unifor.br';
    setAdmin({ nome: nomeSalvo, email: emailSalvo, inicial: nomeSalvo.charAt(0).toUpperCase() });

    // 2. Puxa as métricas do banco de dados (Backend)
    const buscarDadosImpacto = async () => {
      const token = localStorage.getItem('tokenAdmin');
      try {
        const resposta = await fetch('http://127.0.0.1:5000/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dados = await resposta.json();
        setMetricas(dados);
      } catch (erro) {
        console.error("Erro ao buscar métricas do perfil:", erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarDadosImpacto();
  }, []);

  if (carregando) return <div className="loading-dashboard">Carregando perfil...</div>;

  return (
    <div className="loca-dashboard-container">
      <AdminSidebar />
      <main className="loca-main-content">
        <AdminHeader />
        <div className="dashboard-content animar-subida atraso-1">
          <div className="page-header" style={{ marginBottom: '30px' }}>
            <h1 className="page-title">Meu Perfil Profissional</h1>
            <p className="page-subtitle">Acompanhe seu desempenho na gestão do projeto.</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', border: '1px solid #e2e8f0', display: 'flex', gap: '25px', alignItems: 'center', marginBottom: '30px' }}>
            {/* Avatar Dinâmico com a cor azul oficial */}
            <div style={{ width: '80px', height: '80px', backgroundColor: '#0b45d2', color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
              {admin.inicial}
            </div>
            <div>
              <h2 style={{ margin: 0, color: '#1e293b' }}>{admin.nome}</h2>
              <p style={{ margin: '5px 0', color: '#64748b' }}>{admin.email}</p>
              <span style={{ fontSize: '0.8rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>ADMINISTRADOR</span>
            </div>
          </div>

          <h3 style={{ color: '#1e293b', marginBottom: '20px' }}>Métricas de Atividade</h3>
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
        </div>
      </main>
    </div>
  );
};

export default AdminPerfil;