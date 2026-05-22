import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollText } from 'lucide-react';
import './AdminHistorico.css';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import EmptyState from '../components/EmptyState';
import { SkeletonTable } from '../components/Skeleton';
import { apiFetch } from '../api';

function AdminHistorico() {
  const [logs, setLogs] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navegarPara = useNavigate();

  useEffect(() => {
    const carregarLogs = async () => {
      try {
        const resposta = await apiFetch('/api/admin/logs?pagina=1&limite=100');

        if (!resposta.ok) {
          if (resposta.status === 401 || resposta.status === 403) {
            localStorage.removeItem('tokenAdmin');
            navegarPara('/admin');
          }
          setLogs([]);
          return;
        }

        const dados = await resposta.json();
        const lista = Array.isArray(dados) ? dados : (dados.logs || []);
        setLogs(lista);
      } catch {
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
    if (acao.includes('Aprovou') || acao.includes('Login')) classeCor = 'badge-acao-verde';
    if (acao.includes('Arquivou') || acao.includes('Reprovou') || acao.includes('Excluiu')) classeCor = 'badge-acao-vermelha';
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
            <table className="loca-tabela">
              <thead>
                <tr>
                  <th>Data e Hora</th>
                  <th>Admin</th>
                  <th>Ação</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              {carregando ? (
                <SkeletonTable linhas={6} colunas={4} />
              ) : logs.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="4">
                      <EmptyState
                        icone={ScrollText}
                        titulo="Nenhum evento registrado"
                        descricao="Todas as ações administrativas serão registradas aqui."
                      />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td className="col-data">
                        <span className="info-secundaria font-mono">
                          {log.data ? new Date(log.data).toLocaleString('pt-BR') : '-'}
                        </span>
                      </td>
                      <td className="col-nome">
                        <div className="cell-titulo">{log.adminNome || 'Desconhecido'}</div>
                      </td>
                      <td>{renderBadgeAcao(log.acao)}</td>
                      <td><span className="info-secundaria">{log.detalhes || 'Nenhum detalhe'}</span></td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminHistorico;
