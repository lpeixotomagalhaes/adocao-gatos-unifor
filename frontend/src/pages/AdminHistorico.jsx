import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Mesma trava de segurança aqui
import './AdminHistorico.css'; 
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

function AdminHistorico() {
  const [logs, setLogs] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navegarPara = useNavigate();

  useEffect(() => {
    const carregarLogs = async () => {
      try {
        const token = localStorage.getItem('tokenAdmin');
        const resposta = await fetch('http://localhost:5000/api/admin/logs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // TRAVA 1
        if (!resposta.ok) {
          if (resposta.status === 401 || resposta.status === 403) {
            localStorage.removeItem('tokenAdmin');
            navegarPara('/admin');
          }
          setLogs([]);
          return;
        }

        const dados = await resposta.json();
        
        // TRAVA 2
        setLogs(Array.isArray(dados) ? dados : []);

      } catch (erro) {
        console.error("Erro ao carregar histórico", erro);
        setLogs([]);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarLogs();
  }, [navegarPara]);

  const renderBadgeAcao = (acao) => {
    if (!acao) return <span className="badge-acao badge-acao-padrao">Ação Oculta</span>;
    
    let classeCor = 'badge-acao-padrao';
    if (acao.includes('Aprovou')) classeCor = 'badge-acao-verde';
    if (acao.includes('Arquivou') || acao.includes('Reprovou')) classeCor = 'badge-acao-vermelha';
    if (acao.includes('Cadastrou')) classeCor = 'badge-acao-azul';
    
    return <span className={`badge-acao ${classeCor}`}>{acao}</span>;
  };

  return (
    <div className="loca-dashboard-container">
      <AdminSidebar />
      <main className="loca-main-content">
        <AdminHeader />
        <div className="dashboard-content animar-subida atraso-1">
          <div className="page-header">
            <div>
              <h1 className="page-title">Trilha de Auditoria</h1>
              <p className="page-subtitle">Histórico completo de operações e alterações no sistema.</p>
            </div>
          </div>

          <div className="tabela-container">
            {carregando ? (
              <p className="loading-text">Carregando auditoria...</p>
            ) : (
              <table className="loca-tabela">
                <thead>
                  <tr>
                    <th>Data e Hora</th>
                    <th>Usuário (Admin)</th>
                    <th>Ação Realizada</th>
                    <th>Detalhes Técnicos</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span className="info-secundaria font-mono">
                          {log.data ? new Date(log.data).toLocaleString('pt-BR') : '-'}
                        </span>
                      </td>
                      <td className="col-nome" style={{ fontSize: '1rem' }}>{log.adminNome || 'Desconhecido'}</td>
                      <td>{renderBadgeAcao(log.acao)}</td>
                      <td><span className="info-secundaria">{log.detalhes || 'Nenhum detalhe'}</span></td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr><td colSpan="4" className="nenhum-registro">Nenhum evento registrado no sistema.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminHistorico;