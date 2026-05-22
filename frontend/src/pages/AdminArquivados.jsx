import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive } from 'lucide-react';
import './AdminGatos.css';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { SkeletonTable } from '../components/Skeleton';
import { apiFetch } from '../api';

function AdminArquivados() {
  const [arquivados, setArquivados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navegarPara = useNavigate();

  useEffect(() => {
    const carregarArquivados = async () => {
      try {
        const resposta = await apiFetch('/api/gatos/arquivados');

        if (!resposta.ok) {
          if (resposta.status === 401 || resposta.status === 403) {
            localStorage.removeItem('tokenAdmin');
            navegarPara('/admin');
          }
          setArquivados([]);
          return;
        }

        const dados = await resposta.json();
        setArquivados(Array.isArray(dados) ? dados : []);
      } catch {
        setArquivados([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarArquivados();
  }, [navegarPara]);

  return (
    <div className="loca-dashboard-container">
      <AdminSidebar />
      <main className="loca-main-content">
        <AdminHeader />
        <div className="dashboard-content animar-subida atraso-1">
          <div className="page-header">
            <div>
              <h1 className="page-title">Arquivados</h1>
              <p className="page-subtitle">Gatos removidos do sistema por óbito, fuga ou transferência.</p>
            </div>
          </div>

          <div className="tabela-container">
            <table className="loca-tabela">
              <thead>
                <tr>
                  <th>Gato</th>
                  <th>Motivo</th>
                  <th>Justificativa</th>
                  <th>Arquivado Por</th>
                  <th>Data</th>
                </tr>
              </thead>
              {carregando ? (
                <SkeletonTable linhas={4} colunas={5} />
              ) : arquivados.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="5">
                      <EmptyState
                        icone={Archive}
                        titulo="Nenhum registro arquivado"
                        descricao="Gatos arquivados pela página de gestão aparecerão aqui."
                      />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {arquivados.map((gato) => (
                    <tr key={gato._id}>
                      <td className="col-nome"><div className="cell-titulo">{gato.nome}</div></td>
                      <td><StatusBadge cor="danger">{gato.motivoArquivamento || 'Não informado'}</StatusBadge></td>
                      <td><span className="info-secundaria">{gato.justificativaArquivamento || 'Sem detalhes'}</span></td>
                      <td><span className="info-secundaria">{gato.arquivadoPor || 'Desconhecido'}</span></td>
                      <td>{gato.dataArquivamento ? new Date(gato.dataArquivamento).toLocaleDateString('pt-BR') : '-'}</td>
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

export default AdminArquivados;
