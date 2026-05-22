import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './AdminDashboard.css';
import { apiFetch } from '../api';

import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminCard from '../components/AdminCard';
import AdminSplitCard from '../components/AdminSplitCard';
import { SkeletonCard } from '../components/Skeleton';

const CORES_STATUS = ['#16a34a', '#00aaff', '#f59e0b'];

function AdminDashboard() {
  const [estatisticas, setEstatisticas] = useState(null);
  const navegarPara = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resposta = await apiFetch('/api/admin/dashboard');

        if (!resposta.ok) {
          localStorage.removeItem('tokenAdmin');
          return navegarPara('/admin');
        }

        const dados = await resposta.json();
        setEstatisticas({
          totalGatos: dados.totalGatos || 0,
          formulariosPendentes: dados.formulariosPendentes || 0,
          gatosAdotados: dados.gatosAdotados || 0,
          gatosDisponiveis: dados.gatosDisponiveis || 0,
          gatosCastrados: dados.saude?.castrados || 0,
          faltamCastrar: dados.saude?.naoCastrados || 0,
          gatosVacinados: dados.saude?.vacinados || 0,
          faltamVacinar: dados.saude?.naoVacinados || 0,
          graficoAdocoes: dados.graficoAdocoes || []
        });
      } catch (erro) {
        console.error("Erro ao conectar com a API:", erro);
      }
    };
    carregarDados();
  }, [navegarPara]);

  if (!estatisticas) {
    return (
      <div className="loca-dashboard-container">
        <AdminSidebar />
        <main className="loca-main-content">
          <AdminHeader />
          <div className="dashboard-content">
            <div className="loca-cards-grid">
              <SkeletonCard altura="110px" />
              <SkeletonCard altura="110px" />
              <SkeletonCard altura="110px" />
              <SkeletonCard altura="110px" />
            </div>
            <div className="loca-charts-grid" style={{ marginTop: '24px' }}>
              <SkeletonCard altura="280px" />
              <SkeletonCard altura="280px" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="loca-dashboard-container">
      <AdminSidebar />
      <main className="loca-main-content">
        <AdminHeader />
        <div className="dashboard-content">

          <div className="loca-cards-grid animar-subida atraso-1">
            <AdminCard titulo="Total Resgatados" valor={estatisticas.totalGatos} corTexto="text-dark" />
            <AdminCard titulo="Gatos Adotados" valor={estatisticas.gatosAdotados} corTexto="text-green" />
            <AdminCard titulo="Gatos Disponíveis" valor={estatisticas.gatosDisponiveis} corTexto="text-blue" />
            <AdminCard titulo="Adoções Pendentes" valor={estatisticas.formulariosPendentes} corTexto="text-orange" />
          </div>

          <div className="loca-cards-grid secondary-grid animar-subida atraso-2">
            <AdminSplitCard
              titulo="Controle de Castração"
              valorEsq={estatisticas.gatosCastrados} labelEsq="Realizadas" corEsq="text-blue"
              valorDir={estatisticas.faltamCastrar} labelDir="Pendentes" corDir="text-orange"
            />
            <AdminSplitCard
              titulo="Controle de Vacinação"
              valorEsq={estatisticas.gatosVacinados} labelEsq="Imunizados" corEsq="text-green"
              valorDir={estatisticas.faltamVacinar} labelDir="Faltam" corDir="text-orange"
            />
          </div>

          <div className="loca-charts-grid animar-subida atraso-3">
            <div className="loca-chart-box">
              <h3>Evolução Mensal</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={estatisticas.graficoAdocoes} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <defs>
                    <linearGradient id="gradAdotados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16a34a" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#16a34a" stopOpacity={0.4}/>
                    </linearGradient>
                    <linearGradient id="gradCastrados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00aaff" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#00aaff" stopOpacity={0.4}/>
                    </linearGradient>
                    <linearGradient id="gradVacinados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9', radius: 6 }}
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      boxShadow: '0 8px 20px rgba(15,23,42,0.08)',
                      fontSize: '0.85rem',
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "0.82rem", paddingBottom: "10px" }}/>

                  <Bar dataKey="adotados" name="Adotados" fill="url(#gradAdotados)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="castrados" name="Castrados" fill="url(#gradCastrados)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="vacinados" name="Vacinados" fill="url(#gradVacinados)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="loca-chart-box">
              <h3>Distribuição por Status</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Adotados', value: estatisticas.gatosAdotados },
                      { name: 'Disponíveis', value: estatisticas.gatosDisponiveis },
                      { name: 'Pendentes', value: estatisticas.formulariosPendentes }
                    ]}
                    innerRadius={56}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {CORES_STATUS.map((cor, indice) => (
                      <Cell key={`cell-${indice}`} fill={cor} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      boxShadow: '0 8px 20px rgba(15,23,42,0.08)',
                      fontSize: '0.85rem',
                    }}
                  />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: "12px", fontSize: "0.82rem" }} />
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
