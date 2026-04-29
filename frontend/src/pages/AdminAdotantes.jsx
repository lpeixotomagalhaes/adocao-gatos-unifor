import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminGatos.css'; // Podemos reaproveitar o estilo da tabela

function AdminAdotantes() {
  const [adotantes, setAdotantes] = useState([]);
  const navegarPara = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    if (!token) return navegarPara('/admin');

    const carregarAdotantes = async () => {
      try {
        const resposta = await fetch('http://localhost:5000/api/formularios', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dados = await resposta.json();
        
        // Filtra apenas as solicitações que foram 'Aprovadas'
        const apenasAprovados = dados.filter(form => form.statusAnalise === 'Aprovado');
        setAdotantes(apenasAprovados);
      } catch (erro) {
        console.error("Erro ao carregar adotantes", erro);
      }
    };
    carregarAdotantes();
  }, [navegarPara]);

  return (
    <div className="loca-dashboard-container">
      <aside className="loca-sidebar">
        <div className="sidebar-header"><span className="logo-icon">🐾</span><h2>Admin Unifor</h2></div>
        <div className="sidebar-menu-group">
          <span className="menu-title">OPERAÇÃO</span>
          <button className="menu-btn" onClick={() => navegarPara('/admin/dashboard')}>📊 Dashboard</button>
          <button className="menu-btn" onClick={() => navegarPara('/admin/solicitacoes')}>📋 Solicitações</button>
        </div>
        <div className="sidebar-menu-group">
          <span className="menu-title">GESTÃO</span>
          <button className="menu-btn" onClick={() => navegarPara('/admin/gatos')}>🐈 Gatos Resgatados</button>
          <button className="menu-btn active">👥 Adotantes</button>
        </div>
        <button className="btn-sair-loca" onClick={() => { localStorage.removeItem('tokenAdmin'); navegarPara('/admin'); }}>Sair do Sistema</button>
      </aside>

      <main className="loca-main-content">
        <header className="loca-header animar-subida">
          <div className="user-profile"><span>Administrador</span><div className="avatar">A</div></div>
        </header>

        <div className="dashboard-content animar-subida atraso-1">
          <div className="page-header">
            <div>
              <h1 className="page-title">Histórico de Adotantes</h1>
              <p className="page-subtitle">Lista de adoções aprovadas para acompanhamento.</p>
            </div>
          </div>

          <div className="tabela-container">
            <table className="loca-tabela">
              <thead>
                <tr>
                  <th>Nome do Adotante</th><th>Contato</th><th>Vínculo</th><th>Gato Adotado</th>
                </tr>
              </thead>
              <tbody>
                {adotantes.map((adotante) => (
                  <tr key={adotante._id}>
                    <td className="col-nome">{adotante.nomeCandidato}</td>
                    <td>{adotante.telefone}</td>
                    <td><span className="info-secundaria">{adotante.vinculoUnifor}</span></td>
                    <td className="col-destaque">{adotante.gatoId ? adotante.gatoId.nome : 'Removido'}</td>
                  </tr>
                ))}
                {adotantes.length === 0 && (
                  <tr><td colSpan="4" className="nenhum-registro">Nenhuma adoção finalizada ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminAdotantes;