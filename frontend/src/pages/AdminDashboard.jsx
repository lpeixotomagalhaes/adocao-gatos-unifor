import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './AdminDashboard.css';
import { apiFetch } from '../api';

import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminCard from '../components/AdminCard';
import AdminSplitCard from '../components/AdminSplitCard';

function AdminDashboard() {
  const [estatisticas, setEstatisticas] = useState(null);
  const navegarPara = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resposta = await apiFetch('/api/admin/dashboard');

        if (!resposta.ok) {
          console.error("Sessão expirada ou erro no servidor.");
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

  const coresGrafico = ['#1E8E3E', '#00AAFF', '#F29900'];

  if (!estatisticas) return <div className="loading-dashboard">Carregando painel...</div>;

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
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={estatisticas.graficoAdocoes}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f4f7f6'}} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "0.85rem", paddingBottom: "10px" }}/>

                  <Bar dataKey="adotados" name="Adotados" fill="#1E8E3E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="castrados" name="Castrados" fill="#00AAFF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="vacinados" name="Vacinados" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="loca-chart-box">
              <h3>Distribuição por Status</h3>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Adotados', value: estatisticas.gatosAdotados },
                      { name: 'Disponíveis', value: estatisticas.gatosDisponiveis },
                      { name: 'Pendentes', value: estatisticas.formulariosPendentes }
                    ]}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {coresGrafico.map((cor, indice) => (
                      <Cell key={`cell-${indice}`} fill={cor} />
                    ))}
                  </Pie>
                  <Tooltip />
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
