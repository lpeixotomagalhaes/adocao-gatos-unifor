import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminSolicitacoes.css';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

function AdminSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navegarPara = useNavigate();

  const carregarSolicitacoes = async () => {
    try {
      const token = localStorage.getItem('tokenAdmin');
      const resposta = await fetch('http://localhost:5000/api/formularios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // TRAVA DE SEGURANÇA 1: Se o servidor der o erro 400 da sua foto, a gente para por aqui e não quebra a tela.
      if (!resposta.ok) {
        console.error("Servidor retornou erro:", resposta.status);
        setSolicitacoes([]); // Deixa a tabela vazia
        setCarregando(false);
        return;
      }

      const dados = await resposta.json();
      
      // TRAVA DE SEGURANÇA 2: Garante que os dados são realmente uma lista antes de salvar
      if (Array.isArray(dados)) {
        setSolicitacoes(dados);
      } else {
        setSolicitacoes([]);
      }
      
      setCarregando(false);
    } catch (erro) {
      console.error("Erro ao carregar solicitações", erro);
      setSolicitacoes([]);
      setCarregando(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    if (!token) {
      navegarPara('/admin');
      return;
    }
    carregarSolicitacoes();
  }, [navegarPara]);

  const alterarStatus = async (formId, gatoId, novoStatus) => {
    if (!window.confirm(`Tem certeza que deseja ${novoStatus.toLowerCase()} esta solicitação?`)) return;

    try {
      const token = localStorage.getItem('tokenAdmin');
      
      await fetch(`http://localhost:5000/api/formularios/${formId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ statusAnalise: novoStatus })
      });

      if (novoStatus === 'Aprovado' && gatoId) {
        await fetch(`http://localhost:5000/api/gatos/${gatoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'Adotado' })
        });
      }

      carregarSolicitacoes();
    } catch (erro) {
      console.error("Erro ao atualizar status", erro);
    }
  };

  // TRAVA DE SEGURANÇA 3: O React só vai fazer o .map() numa lista válida
  const listaSegura = Array.isArray(solicitacoes) ? solicitacoes : [];

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
            {carregando ? (
              <p className="loading-text">Buscando formulários...</p>
            ) : (
              <table className="loca-tabela">
                <thead>
                  <tr>
                    <th>Candidato</th>
                    <th>Vínculo / Contato</th>
                    <th>Gato Desejado</th>
                    <th>Status</th>
                    <th>Ações (Decisão)</th>
                  </tr>
                </thead>
                <tbody>
                  {listaSegura.map((form) => (
                    <tr key={form._id}>
                      <td className="col-nome">{form.nomeCandidato || 'Sem Nome'}</td>
                      <td>
                        <span className="info-secundaria">{form.vinculoUnifor || 'N/A'}</span><br/>
                        <span className="info-secundaria small">{form.telefone || 'Sem contato'}</span>
                      </td>
                      <td className="col-destaque">
                        {form.gatoId ? form.gatoId.nome : 'Gato Removido'}
                      </td>
                      <td>
                        <span className={`badge status-${form.statusAnalise?.toLowerCase() || 'pendente'}`}>
                          {form.statusAnalise || 'Pendente'}
                        </span>
                      </td>
                      <td className="col-acoes-decisao">
                        {form.statusAnalise === 'Pendente' ? (
                          <>
                            <button className="btn-decisao aprovar" onClick={() => alterarStatus(form._id, form.gatoId?._id, 'Aprovado')}>✔️ Aprovar</button>
                            <button className="btn-decisao rejeitar" onClick={() => alterarStatus(form._id, null, 'Reprovado')}>❌ Rejeitar</button>
                          </>
                        ) : (
                          <span className="decisao-tomada">Finalizado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {listaSegura.length === 0 && (
                    <tr>
                      <td colSpan="5" className="nenhum-registro">Nenhuma solicitação encontrada no momento.</td>
                    </tr>
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

export default AdminSolicitacoes;