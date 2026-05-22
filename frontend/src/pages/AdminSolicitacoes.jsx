import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Check, X, Inbox } from 'lucide-react';
import './AdminSolicitacoes.css';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { SkeletonTable } from '../components/Skeleton';
import { apiFetch } from '../api';

function AdminSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarSolicitacoes = async () => {
    try {
      const resposta = await apiFetch('/api/formularios');
      if (!resposta.ok) { setSolicitacoes([]); return; }
      const dados = await resposta.json();
      setSolicitacoes(Array.isArray(dados) ? dados : []);
    } catch {
      toast.error('Erro ao carregar solicitações.');
      setSolicitacoes([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregarSolicitacoes(); }, []);

  const alterarStatus = async (formId, gatoId, novoStatus) => {
    if (!window.confirm(`Tem certeza que deseja ${novoStatus.toLowerCase()} esta solicitação?`)) return;

    try {
      await apiFetch(`/api/formularios/${formId}`, {
        method: 'PUT',
        body: JSON.stringify({ statusAnalise: novoStatus })
      });

      if (novoStatus === 'Aprovado' && gatoId) {
        await apiFetch(`/api/gatos/${gatoId}`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'Adotado' })
        });
      }

      toast.success(novoStatus === 'Aprovado' ? 'Adoção aprovada.' : 'Solicitação reprovada.');
      carregarSolicitacoes();
    } catch {
      toast.error('Erro ao atualizar status.');
    }
  };

  return (
    <div className="loca-dashboard-container">
      <AdminSidebar />
      <main className="loca-main-content">
        <AdminHeader />

        <div className="dashboard-content animar-subida atraso-1">
          <div className="page-header">
            <div>
              <h1 className="page-title">Caixa de Solicitações</h1>
              <p className="page-subtitle">Analise os pedidos de adoção enviados pelo site.</p>
            </div>
          </div>

          <div className="tabela-container">
            <table className="loca-tabela">
              <thead>
                <tr>
                  <th>Candidato</th>
                  <th>Vínculo / Contato</th>
                  <th>Gato Desejado</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              {carregando ? (
                <SkeletonTable linhas={4} colunas={5} />
              ) : solicitacoes.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="5">
                      <EmptyState
                        icone={Inbox}
                        titulo="Nenhuma solicitação"
                        descricao="Os formulários enviados pelo site aparecerão aqui."
                      />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {solicitacoes.map((form) => (
                    <tr key={form._id}>
                      <td className="col-nome"><div className="cell-titulo">{form.nomeCandidato || 'Sem Nome'}</div></td>
                      <td>
                        <div className="cell-vinculo">{form.vinculoUnifor || 'N/A'}</div>
                        <span className="info-secundaria small">{form.telefone || 'Sem contato'}</span>
                      </td>
                      <td className="col-destaque">{form.gatoId ? form.gatoId.nome : 'Gato Removido'}</td>
                      <td><StatusBadge status={form.statusAnalise || 'Pendente'} /></td>
                      <td className="col-acoes-decisao">
                        {form.statusAnalise === 'Pendente' ? (
                          <>
                            <button className="btn-decisao aprovar" onClick={() => alterarStatus(form._id, form.gatoId?._id, 'Aprovado')}>
                              <Check size={14} /> Aprovar
                            </button>
                            <button className="btn-decisao rejeitar" onClick={() => alterarStatus(form._id, null, 'Reprovado')}>
                              <X size={14} /> Rejeitar
                            </button>
                          </>
                        ) : (
                          <span className="decisao-tomada">Finalizado</span>
                        )}
                      </td>
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

export default AdminSolicitacoes;
