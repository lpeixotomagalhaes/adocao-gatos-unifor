import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminSolicitacoes.css';

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
      const dados = await resposta.json();
      setSolicitacoes(dados);
      setCarregando(false);
    } catch (erro) {
      console.error("Erro ao carregar solicitações", erro);
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
      
      // 1. Atualiza o status do formulário
      await fetch(`http://localhost:5000/api/formularios/${formId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ statusAnalise: novoStatus })
      });

      // 2. Se aprovou, já atualiza o status do gato para 'Adotado' no banco
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

      // Recarrega a tela para mostrar os dados atualizados
      carregarSolicitacoes();
    } catch (erro) {
      console.error("Erro ao atualizar status", erro);
    }
  };

  return (
    <div className="loca-dashboard-container">
      {/* SIDEBAR */}
      <aside className="loca-sidebar">
        <div className="sidebar-header">
          <span className="logo-icon">🐾</span>
          <h2>Admin Unifor</h2>
        </div>
        
        <div className="sidebar-menu-group">
          <span className="menu-title">OPERAÇÃO</span>
          <button className="menu-btn" onClick={() => navegarPara('/admin/dashboard')}>📊 Dashboard</button>
          <button className="menu-btn active" onClick={() => navegarPara('/admin/solicitacoes')}>📋 Solicitações</button>
        </div>

        <div className="sidebar-menu-group">
          <span className="menu-title">GESTÃO</span>
          <button className="menu-btn" onClick={() => navegarPara('/admin/gatos')}>🐈 Gatos Resgatados</button>
          <button className="menu-btn" onClick={() => navegarPara('/admin/adotantes')}>👥 Adotantes</button>
        </div>

        <button className="btn-sair-loca" onClick={() => { localStorage.removeItem('tokenAdmin'); navegarPara('/admin'); }}>
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
                  {solicitacoes.map((form) => (
                    <tr key={form._id}>
                      <td className="col-nome">{form.nomeCandidato}</td>
                      <td>
                        <span className="info-secundaria">{form.vinculoUnifor}</span><br/>
                        <span className="info-secundaria small">{form.telefone}</span>
                      </td>
                      <td className="col-destaque">
                        {form.gatoId ? form.gatoId.nome : 'Gato Removido'}
                      </td>
                      <td>
                        <span className={`badge status-${form.statusAnalise.toLowerCase()}`}>
                          {form.statusAnalise}
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
                  {solicitacoes.length === 0 && (
                    <tr>
                      <td colSpan="5" className="nenhum-registro">Nenhuma solicitação pendente no momento.</td>
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