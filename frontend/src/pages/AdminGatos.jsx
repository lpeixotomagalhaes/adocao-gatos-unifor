import React, { useEffect, useState } from 'react';
import './AdminGatos.css';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

function AdminGatos() {
  const [gatos, setGatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalArquivarAberto, setModalArquivarAberto] = useState(false);
  const [gatoAlvo, setGatoAlvo] = useState(null); 
  const [editando, setEditando] = useState(false);
  
  const [formGato, setFormGato] = useState({
    nome: '', sexo: 'Macho', idade: '', foto: null, status: 'Disponível', 
    castrado: false, vacinado: false, descricao: ''
  });

  const [formArquivar, setFormArquivar] = useState({ motivo: 'Óbito', justificativa: '' });

  const carregarGatos = async () => {
    try {
      const resposta = await fetch('http://127.0.0.1:5000/api/gatos');
      const dados = await resposta.json();
      setGatos(Array.isArray(dados) ? dados : []);
    } catch (erro) { console.error("Erro ao carregar gatos", erro); } 
    finally { setCarregando(false); }
  };

  useEffect(() => { carregarGatos(); }, []); 

  // --- CONTROLE DOS MODAIS ---
  const abrirModalCadastro = () => {
    setEditando(false);
    setGatoAlvo(null);
    setFormGato({ nome: '', sexo: 'Macho', idade: '', foto: null, status: 'Disponível', castrado: false, vacinado: false, descricao: '' });
    setModalAberto(true);
  };

  const abrirModalEdicao = (gato) => {
    setEditando(true);
    setGatoAlvo(gato);
    setFormGato({
      nome: gato.nome,
      sexo: gato.sexo,
      idade: gato.idade,
      status: gato.status,
      castrado: gato.castrado,
      vacinado: gato.vacinado,
      descricao: gato.descricao,
      foto: null // A foto só muda se o usuário escolher um novo arquivo
    });
    setModalAberto(true);
  };

  // --- LÓGICA DE SALVAMENTO (POST OU PUT) ---
  const lidarMudancaForm = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormGato({
      ...formGato,
      [name]: type === 'file' ? files[0] : (type === 'checkbox' ? checked : value)
    });
  };

  const salvarGato = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('tokenAdmin');
      const tokenPayload = JSON.parse(atob(token.split('.')[1])); 

      const formData = new FormData();
      Object.keys(formGato).forEach(key => {
        if (key === 'foto') {
            if (formGato.foto) formData.append('foto', formGato.foto);
        } else {
            formData.append(key, formGato[key]);
        }
      });
      formData.append('adminNome', tokenPayload.nome);

      const url = editando ? `http://127.0.0.1:5000/api/gatos/${gatoAlvo._id}` : 'http://127.0.0.1:5000/api/gatos';
      const metodo = editando ? 'PUT' : 'POST';

      const resposta = await fetch(url, {
        method: metodo,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (resposta.ok) {
        setModalAberto(false);
        carregarGatos(); 
      }
    } catch (erro) { console.error("Erro ao processar gato", erro); }
  };

  const excluirPermanente = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja EXCLUIR PERMANENTEMENTE o gato ${nome}? Esta ação não pode ser desfeita.`)) {
      try {
        const token = localStorage.getItem('tokenAdmin');
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const resposta = await fetch(`http://127.0.0.1:5000/api/gatos/${id}?adminNome=${tokenPayload.nome}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resposta.ok) carregarGatos();
      } catch (erro) { console.error(erro); }
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
              <h1 className="page-title">Gestão de Felinos</h1>
              <p className="page-subtitle">Cadastre, edite ou remova gatos do sistema.</p>
            </div>
            <button className="btn-primario" onClick={abrirModalCadastro}>+ Novo Cadastro</button>
          </div>

          <div className="tabela-container">
            {carregando ? <p className="loading-text">Carregando...</p> : (
              <table className="loca-tabela">
                <thead>
                  <tr>
                    <th>Gato</th><th>Status</th><th>Saúde</th><th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {gatos.map((gato) => (
                    <tr key={gato._id}>
                      <td className="col-nome">
                        <div style={{fontWeight: 'bold'}}>{gato.nome}</div>
                        <div className="info-secundaria">{gato.sexo} • {gato.idade}</div>
                      </td>
                      <td><span className={`badge status-${gato.status.toLowerCase().replace('í', 'i')}`}>{gato.status}</span></td>
                      <td>
                        <span title="Castrado">{gato.castrado ? '✂️' : '❌'}</span>
                        <span title="Vacinado" style={{marginLeft: '8px'}}>{gato.vacinado ? '💉' : '❌'}</span>
                      </td>
                      <td className="col-acoes">
                        <button className="btn-acao" onClick={() => abrirModalEdicao(gato)} title="Editar">✏️</button>
                        <button className="btn-acao" onClick={() => {setGatoAlvo(gato); setModalArquivarAberto(true);}} title="Arquivar">🗄️</button>
                        <button className="btn-acao deletar" onClick={() => excluirPermanente(gato._id, gato.nome)} title="Excluir Definitivo">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* MODAL DE CADASTRO / EDIÇÃO */}
        {modalAberto && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-header">
                <h2>{editando ? `Editar Gato: ${gatoAlvo.nome}` : 'Cadastrar Novo Gatinho'}</h2>
                <button className="btn-fechar" onClick={() => setModalAberto(false)}>✖</button>
              </div>
              <form onSubmit={salvarGato} className="modal-form">
                <div className="input-group">
                  <label>Nome</label>
                  <input type="text" name="nome" value={formGato.nome} onChange={lidarMudancaForm} required />
                </div>
                <div className="input-group">
                  <label>Foto {editando && "(Deixe vazio para manter a atual)"}</label>
                  <input type="file" name="foto" accept="image/*" onChange={lidarMudancaForm} required={!editando} />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Sexo</label>
                    <select name="sexo" value={formGato.sexo} onChange={lidarMudancaForm}>
                      <option value="Macho">Macho</option><option value="Fêmea">Fêmea</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Idade</label>
                    <input type="text" name="idade" value={formGato.idade} onChange={lidarMudancaForm} required />
                  </div>
                </div>
                <div className="input-group">
                    <label>Status</label>
                    <select name="status" value={formGato.status} onChange={lidarMudancaForm}>
                        <option value="Disponível">Disponível</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Adotado">Adotado</option>
                    </select>
                </div>
                <div className="form-row-checkbox">
                  <label><input type="checkbox" name="castrado" checked={formGato.castrado} onChange={lidarMudancaForm} /> Castrado</label>
                  <label><input type="checkbox" name="vacinado" checked={formGato.vacinado} onChange={lidarMudancaForm} /> Vacinado</label>
                </div>
                <div className="input-group">
                  <label>Descrição</label>
                  <textarea name="descricao" rows="3" value={formGato.descricao} onChange={lidarMudancaForm} required></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secundario" onClick={() => setModalAberto(false)}>Cancelar</button>
                  <button type="submit" className="btn-primario">{editando ? 'Salvar Alterações' : 'Cadastrar Gato'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DE ARQUIVAMENTO (Soft Delete) */}
        {modalArquivarAberto && (
          <div className="modal-overlay">
            <div className="modal-box" style={{maxWidth: '450px'}}>
              <div className="modal-header">
                <h2>Arquivar {gatoAlvo?.nome}</h2>
                <button className="btn-fechar" onClick={() => setModalArquivarAberto(false)}>✖</button>
              </div>
              <div className="modal-form">
                <div className="input-group">
                  <label>Motivo</label>
                  <select onChange={(e) => setFormArquivar({...formArquivar, motivo: e.target.value})}>
                    <option value="Óbito">Óbito</option>
                    <option value="Fuga">Fuga</option>
                    <option value="Transferência">Transferência</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Justificativa</label>
                  <textarea rows="3" onChange={(e) => setFormArquivar({...formArquivar, justificativa: e.target.value})} required></textarea>
                </div>
                <div className="modal-footer">
                  <button className="btn-secundario" onClick={() => setModalArquivarAberto(false)}>Cancelar</button>
                  <button className="btn-primario" style={{backgroundColor: '#ef4444'}} onClick={async () => {
                      const token = localStorage.getItem('tokenAdmin');
                      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                      await fetch(`http://127.0.0.1:5000/api/gatos/${gatoAlvo._id}/arquivar`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({...formArquivar, adminNome: tokenPayload.nome})
                      });
                      setModalArquivarAberto(false);
                      carregarGatos();
                  }}>Confirmar Arquivamento</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminGatos;