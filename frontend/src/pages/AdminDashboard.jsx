import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './AdminDashboard.css';


function AdminDashboard() {
  const [estatisticas, setEstatisticas] = useState(null);
  const navegarPara = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      const token = localStorage.getItem('tokenAdmin');
      if (!token) {
        navegarPara('/admin/login');
        return;
      }

      try {
        const resposta = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dados = await resposta.json();
        
        const castrados = Math.floor(dados.totalGatos * 0.8);
        const vacinados = Math.floor(dados.totalGatos * 0.9);

        setEstatisticas({
            ...dados,
            gatosCastrados: castrados,
            faltamCastrar: dados.totalGatos - castrados,
            gatosVacinados: vacinados,
            faltamVacinar: dados.totalGatos - vacinados
        });
      } catch (erro) {
        console.error(erro);
      }
    };
    carregarDados();
  }, [navegarPara]);

  const dadosGraficoBarras = [
    { mes: 'Jan', adotados: 2 },
    { mes: 'Fev', adotados: 5 },
    { mes: 'Mar', adotados: 4 },
    { mes: 'Abr', adotados: 8 },
  ];

  const coresGrafico = ['#1E8E3E', '#00AAFF', '#F29900'];

  if (!estatisticas) return <div className="loading-dashboard">Carregando painel...</div>;

  return (
    <div className="loca-dashboard-container">
      <aside className="loca-sidebar">
        <div className="sidebar-header">
          <span className="logo-icon">🐾</span>
          <h2>Admin Unifor</h2>
        </div>
        
        <div className="sidebar-menu-group">
          <span className="menu-title">OPERAÇÃO</span>
          <button className="menu-btn active">📊 Dashboard</button>
          <button className="menu-btn" onClick={() => navegarPara('/admin/solicitacoes')}>📋 Solicitações</button>
        </div>

        <div className="sidebar-menu-group">
          <span className="menu-title">GESTÃO</span>
          <button className="menu-btn" onClick={() => navegarPara('/admin/gatos')}>🐈 Gatos Resgatados</button>
          <button className="menu-btn" onClick={() => navegarPara('/admin/adotantes')}>👥 Adotantes</button>
        </div>

        <button className="btn-sair-loca" onClick={() => { localStorage.removeItem('tokenAdmin'); navegarPara('/admin/login'); }}>
          Sair do Sistema
        </button>
      </aside>

      <main className="loca-main-content">
        <header className="loca-header animar-subida">
          <div className="user-profile">
            <span>Administrador Resgatinhos</span>
            <div className="avatar">A</div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="loca-cards-grid animar-subida atraso-1">
            <div className="loca-card">
              <span className="loca-card-title">Total Resgatados</span>
              <span className="loca-card-value text-dark">{estatisticas.totalGatos}</span>
            </div>
            <div className="loca-card">
              <span className="loca-card-title">Adoções Pendentes</span>
              <span className="loca-card-value text-orange">{estatisticas.formulariosPendentes}</span>
            </div>
            <div className="loca-card">
              <span className="loca-card-title">Gatos Adotados</span>
              <span className="loca-card-value text-green">{estatisticas.gatosAdotados}</span>
            </div>
            <div className="loca-card">
              <span className="loca-card-title">Gatos Disponíveis</span>
              <span className="loca-card-value text-blue">{estatisticas.gatosDisponiveis}</span>
            </div>
          </div>

          <div className="loca-cards-grid secondary-grid animar-subida atraso-2">
            <div className="loca-card">
              <span className="loca-card-title">Controle de Castração</span>
              <div className="split-metric">
                <div className="metric-part">
                  <span className="loca-card-value text-blue">{estatisticas.gatosCastrados}</span>
                  <small>Realizadas</small>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-part">
                  <span className="loca-card-value text-orange">{estatisticas.faltamCastrar}</span>
                  <small>Pendentes</small>
                </div>
              </div>
            </div>
            
            <div className="loca-card">
              <span className="loca-card-title">Controle de Vacinação</span>
              <div className="split-metric">
                <div className="metric-part">
                  <span className="loca-card-value text-green">{estatisticas.gatosVacinados}</span>
                  <small>Imunizados</small>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-part">
                  <span className="loca-card-value text-orange">{estatisticas.faltamVacinar}</span>
                  <small>Faltam</small>
                </div>
              </div>
            </div>
          </div>

          <div className="loca-charts-grid animar-subida atraso-3">
            <div className="loca-chart-box">
              <h3>Evolução de Adoções Mensais</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dadosGraficoBarras}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f4f7f6'}} />
                  <Bar dataKey="adotados" fill="#00AAFF" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="loca-chart-box">
              <h3>Distribuição por Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Adotados', value: estatisticas.gatosAdotados },
                      { name: 'Disponíveis', value: estatisticas.gatosDisponiveis },
                      { name: 'Pendentes', value: estatisticas.formulariosPendentes }
                    ]}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {coresGrafico.map((cor, indice) => (
                      <Cell key={`cell-${indice}`} fill={cor} />
                    ))}
                  </Pie>
                  <Tooltip />
                  {/* NOVA LEGENDA NATIVA AQUI */}
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: "15px", fontSize: "0.85rem" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;