import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Pencil,
  Archive,
  Trash2,
  Plus,
  Scissors,
  Syringe,
  X,
  Cat as CatIcon,
} from 'lucide-react';
import './AdminGatos.css';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { SkeletonTable } from '../components/Skeleton';
import { apiFetch, apiUrl } from '../api';

const ESTADO_FORM_INICIAL = {
  nome: '', sexo: 'Macho', idade: '', foto: null, status: 'Disponível',
  castrado: false, vacinado: false, descricao: ''
};

function AdminGatos() {
  const [gatos, setGatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalArquivarAberto, setModalArquivarAberto] = useState(false);
  const [gatoAlvo, setGatoAlvo] = useState(null);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [formGato, setFormGato] = useState(ESTADO_FORM_INICIAL);
  const [formArquivar, setFormArquivar] = useState({ motivo: 'Óbito', justificativa: '' });

  const carregarGatos = async () => {
    try {
      const resposta = await fetch(apiUrl('/api/gatos'));
      const dados = await resposta.json();
      setGatos(Array.isArray(dados) ? dados : []);
    } catch (erro) {
      toast.error('Não foi possível carregar os gatos.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregarGatos(); }, []);

  const abrirModalCadastro = () => {
    setEditando(false);
    setGatoAlvo(null);
    setFormGato(ESTADO_FORM_INICIAL);
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
      foto: null
    });
    setModalAberto(true);
  };

  const lidarMudancaForm = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormGato({
      ...formGato,
      [name]: type === 'file' ? files[0] : (type === 'checkbox' ? checked : value)
    });
  };

  const salvarGato = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const formData = new FormData();
      Object.keys(formGato).forEach(key => {
        if (key === 'foto') {
          if (formGato.foto) formData.append('foto', formGato.foto);
        } else {
          formData.append(key, formGato[key]);
        }
      });

      const url = editando ? `/api/gatos/${gatoAlvo._id}` : '/api/gatos';
      const metodo = editando ? 'PUT' : 'POST';

      const resposta = await apiFetch(url, { method: metodo, body: formData });

      if (resposta.ok) {
        toast.success(editando ? `${formGato.nome} atualizado.` : `${formGato.nome} cadastrado.`);
        setModalAberto(false);
        carregarGatos();
      } else {
        const dados = await resposta.json().catch(() => ({}));
        toast.error(dados.mensagem || 'Erro ao salvar.');
      }
    } catch (erro) {
      toast.error('Erro de conexão.');
    } finally {
      setSalvando(false);
    }
  };

  const arquivarGato = async () => {
    if (!formArquivar.justificativa.trim()) {
      toast.error('Preencha a justificativa.');
      return;
    }
    try {
      const resposta = await apiFetch(`/api/gatos/${gatoAlvo._id}/arquivar`, {
        method: 'PUT',
        body: JSON.stringify(formArquivar)
      });
      if (resposta.ok) {
        toast.success(`${gatoAlvo.nome} arquivado.`);
        setModalArquivarAberto(false);
        setFormArquivar({ motivo: 'Óbito', justificativa: '' });
        carregarGatos();
      } else {
        toast.error('Erro ao arquivar.');
      }
    } catch {
      toast.error('Erro de conexão.');
    }
  };

  const excluirPermanente = async (id, nome) => {
    if (!window.confirm(`Excluir PERMANENTEMENTE o gato ${nome}? Esta ação não pode ser desfeita.`)) return;
    try {
      const resposta = await apiFetch(`/api/gatos/${id}`, { method: 'DELETE' });
      if (resposta.ok) {
        toast.success(`${nome} removido permanentemente.`);
        carregarGatos();
      } else {
        toast.error('Erro ao excluir.');
      }
    } catch {
      toast.error('Erro de conexão.');
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
            <button className="btn-primario" onClick={abrirModalCadastro}>
              <Plus size={16} /> Novo Cadastro
            </button>
          </div>

          <div className="tabela-container">
            <table className="loca-tabela">
              <thead>
                <tr>
                  <th>Gato</th><th>Status</th><th>Saúde</th><th>Ações</th>
                </tr>
              </thead>
              {carregando ? (
                <SkeletonTable linhas={5} colunas={4} />
              ) : gatos.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="4">
                      <EmptyState
                        icone={CatIcon}
                        titulo="Nenhum gato cadastrado"
                        descricao="Comece cadastrando o primeiro felino do projeto."
                      />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {gatos.map((gato) => (
                    <tr key={gato._id}>
                      <td className="col-nome">
                        <div className="cell-titulo">{gato.nome}</div>
                        <div className="info-secundaria">{gato.sexo} • {gato.idade}</div>
                      </td>
                      <td><StatusBadge status={gato.status} /></td>
                      <td>
                        <div className="saude-tags">
                          <span className={`saude-pill ${gato.castrado ? 'on' : 'off'}`} title="Castrado">
                            <Scissors size={14} /> {gato.castrado ? 'Sim' : 'Não'}
                          </span>
                          <span className={`saude-pill ${gato.vacinado ? 'on' : 'off'}`} title="Vacinado">
                            <Syringe size={14} /> {gato.vacinado ? 'Sim' : 'Não'}
                          </span>
                        </div>
                      </td>
                      <td className="col-acoes">
                        <button className="btn-icone" onClick={() => abrirModalEdicao(gato)} title="Editar"><Pencil size={16} /></button>
                        <button className="btn-icone" onClick={() => {setGatoAlvo(gato); setModalArquivarAberto(true);}} title="Arquivar"><Archive size={16} /></button>
                        <button className="btn-icone btn-icone--danger" onClick={() => excluirPermanente(gato._id, gato.nome)} title="Excluir definitivo"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>

        {modalAberto && (
          <div className="modal-overlay" onClick={() => setModalAberto(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editando ? `Editar Gato: ${gatoAlvo.nome}` : 'Cadastrar Novo Gatinho'}</h2>
                <button className="btn-fechar" onClick={() => setModalAberto(false)} aria-label="Fechar"><X size={18} /></button>
              </div>
              <form onSubmit={salvarGato} className="modal-form">
                <div className="input-group">
                  <label>Nome</label>
                  <input type="text" name="nome" value={formGato.nome} onChange={lidarMudancaForm} required />
                </div>
                <div className="input-group">
                  <label>Foto {editando && <span className="hint">(opcional)</span>}</label>
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
                  <button type="submit" className="btn-primario" disabled={salvando}>
                    {salvando ? 'Salvando...' : (editando ? 'Salvar Alterações' : 'Cadastrar Gato')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalArquivarAberto && (
          <div className="modal-overlay" onClick={() => setModalArquivarAberto(false)}>
            <div className="modal-box modal-box--sm" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Arquivar {gatoAlvo?.nome}</h2>
                <button className="btn-fechar" onClick={() => setModalArquivarAberto(false)} aria-label="Fechar"><X size={18} /></button>
              </div>
              <div className="modal-form">
                <div className="input-group">
                  <label>Motivo</label>
                  <select value={formArquivar.motivo} onChange={(e) => setFormArquivar({...formArquivar, motivo: e.target.value})}>
                    <option value="Óbito">Óbito</option>
                    <option value="Fuga">Fuga</option>
                    <option value="Transferência">Transferência</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Justificativa</label>
                  <textarea rows="3" value={formArquivar.justificativa} onChange={(e) => setFormArquivar({...formArquivar, justificativa: e.target.value})} required></textarea>
                </div>
                <div className="modal-footer">
                  <button className="btn-secundario" onClick={() => setModalArquivarAberto(false)}>Cancelar</button>
                  <button className="btn-primario btn-primario--danger" onClick={arquivarGato}>Confirmar Arquivamento</button>
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
