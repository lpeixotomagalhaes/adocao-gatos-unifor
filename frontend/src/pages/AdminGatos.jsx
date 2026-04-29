import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminGatos.css';

function AdminGatos() {
  const [gatos, setGatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  
  // Estado para o formulário do novo gato
  const [formGato, setFormGato] = useState({
    nome: '', sexo: 'Macho', idade: '', status: 'Disponível', 
    castrado: false, vacinado: false, descricao: ''
  });

  const navegarPara = useNavigate();

  const carregarGatos = async () => {
    try {
      const resposta = await fetch('http://localhost:5000/api/gatos');
      const dados = await resposta.json();
      setGatos(dados);
      setCarregando(false);
    } catch (erro) {
      console.error("Erro ao carregar gatos", erro);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    if (!token) return navegarPara('/admin');
    carregarGatos();
  }, [navegarPara]);

  const deletarGato = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este gatinho do sistema?')) return;
    try {
      const token = localStorage.getItem('tokenAdmin');
      await fetch(`http://localhost:5000/api/gatos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setGatos(gatos.filter(gato => gato._id !== id));
    } catch (erro) {
      console.error(erro);
    }
  };

  const lidarMudancaForm = (e) => {
    const { name, value, type, checked } = e.target;
    setFormGato({
      ...formGato,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const salvarGato = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('tokenAdmin');
      const resposta = await fetch('http://localhost:5000/api/gatos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formGato)
      });

      if (resposta.ok) {
        setModalAberto(false);
        carregarGatos(); // Recarrega a tabela
        // Limpa o form
        setFormGato({ nome: '', sexo: 'Macho', idade: '', status: 'Disponível', castrado: false, vacinado: false, descricao: ''});
      }
    } catch (erro) {
      console.error("Erro ao salvar gato", erro);
    }
  };

  return (
    <div className="loca-dashboard-container">
      <aside className="loca-sidebar">
        <div className="sidebar-header">
          <span className="logo-icon">🐾</span>
          <h2>Admin Unifor</h2>
        </div>
        <div className="sidebar-menu-group">
          <span className="menu-title">OPERAÇÃO</span>
          <button className="menu-btn" onClick={() => navegarPara('/admin/dashboard')}>📊 Dashboard</button>
          <button className="menu-btn" onClick={() => navegarPara('/admin/solicitacoes')}>📋 Solicitações</button>
        </div>
        <div className="sidebar-menu-group">
          <span className="menu-title">GESTÃO</span>
          <button className="menu-btn active">🐈 Gatos Resgatados</button>
          <button className="menu-btn" onClick={() => navegarPara('/admin/adotantes')}>👥 Adotantes</button>
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
              <h1 className="page-title">Gatos Resgatados</h1>
              <p className="page-subtitle">Gerencie o inventário de felinos do campus.</p>
            </div>
            <button className="btn-primario" onClick={() => setModalAberto(true)}>+ Cadastrar Gato</button>
          </div>

          <div className="tabela-container">
            {carregando ? (
              <p className="loading-text">Carregando gatinhos...</p>
            ) : (
              <table className="loca-tabela">
                <thead>
                  <tr>
                    <th>Nome</th><th>Sexo / Idade</th><th>Status</th><th>Saúde</th><th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {gatos.map((gato) => (
                    <tr key={gato._id}>
                      <td className="col-nome">{gato.nome}</td>
                      <td><span className="info-secundaria">{gato.sexo} • {gato.idade}</span></td>
                      <td><span className={`badge status-${gato.status.toLowerCase().replace('í', 'i')}`}>{gato.status}</span></td>
                      <td>
                        <div className="saude-icones">
                          <span title="Castrado" className={gato.castrado ? 'icone-ok' : 'icone-pendente'}>✂️</span>
                          <span title="Vacinado" className={gato.vacinado ? 'icone-ok' : 'icone-pendente'}>💉</span>
                        </div>
                      </td>
                      <td className="col-acoes">
                        <button className="btn-acao deletar" onClick={() => deletarGato(gato._id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* MODAL DE CADASTRO */}
        {modalAberto && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-header">
                <h2>Cadastrar Novo Gatinho</h2>
                <button className="btn-fechar" onClick={() => setModalAberto(false)}>✖</button>
              </div>
              <form onSubmit={salvarGato} className="modal-form">
                <div className="input-group">
                  <label>Nome do Gato</label>
                  <input type="text" name="nome" value={formGato.nome} onChange={lidarMudancaForm} required />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Sexo</label>
                    <select name="sexo" value={formGato.sexo} onChange={lidarMudancaForm}>
                      <option value="Macho">Macho</option>
                      <option value="Fêmea">Fêmea</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Idade Estimada</label>
                    <input type="text" name="idade" placeholder="Ex: 2 anos" value={formGato.idade} onChange={lidarMudancaForm} required />
                  </div>
                </div>
                <div className="form-row-checkbox">
                  <label className="checkbox-label">
                    <input type="checkbox" name="castrado" checked={formGato.castrado} onChange={lidarMudancaForm} /> Castrado
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" name="vacinado" checked={formGato.vacinado} onChange={lidarMudancaForm} /> Vacinado
                  </label>
                </div>
                <div className="input-group">
                  <label>Descrição breve</label>
                  <textarea name="descricao" rows="3" value={formGato.descricao} onChange={lidarMudancaForm} required></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secundario" onClick={() => setModalAberto(false)}>Cancelar</button>
                  <button type="submit" className="btn-primario">Salvar Gato</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminGatos;