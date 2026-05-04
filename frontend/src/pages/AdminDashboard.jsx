import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './AdminDashboard.css';

// Importando nossos componentes
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminCard from '../components/AdminCard';
import AdminSplitCard from '../components/AdminSplitCard';

function AdminDashboard() {
  const [estatisticas, setEstatisticas] = useState(null);
  const navegarPara = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      const token = localStorage.getItem('tokenAdmin');
      if (!token) return navegarPara('/admin/login');

      try {
        const resposta = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resposta.ok) {
          console.error("Erro no servidor. Faça login novamente.");
          localStorage.removeItem('tokenAdmin');
          return navegarPara('/admin/login');
        }

        const dados = await resposta.json();
        
        const total = dados.totalGatos || 0; 
        const castrados = Math.floor(total * 0.8);
        const vacinados = Math.floor(total * 0.9);

        setEstatisticas({
            totalGatos: total,
            formulariosPendentes: dados.formulariosPendentes || 0,
            gatosAdotados: dados.gatosAdotados || 0,
            gatosDisponiveis: dados.gatosDisponiveis || 0,
            gatosCastrados: castrados,
            faltamCastrar: total - castrados,
            gatosVacinados: vacinados,
            faltamVacinar: total - vacinados,
            graficoAdocoes: dados.graficoAdocoes || [] // Puxando o gráfico do Backend!
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
            <AdminCard titulo="Adoções Pendentes" valor={estatisticas.formulariosPendentes} corTexto="text-orange" />
            <AdminCard titulo="Gatos Adotados" valor={estatisticas.gatosAdotados} corTexto="text-green" />
            <AdminCard titulo="Gatos Disponíveis" valor={estatisticas.gatosDisponiveis} corTexto="text-blue" />
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
              <h3>Evolução de Adoções Mensais</h3>
              <ResponsiveContainer width="100%" height={250}>
                {/* AQUI O GRÁFICO É CONECTADO AO BANCO */}
                <BarChart data={estatisticas.graficoAdocoes}>
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