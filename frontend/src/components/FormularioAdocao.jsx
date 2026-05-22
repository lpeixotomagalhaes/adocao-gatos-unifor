import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, PartyPopper, Heart, CircleAlert } from 'lucide-react';
import './FormularioAdocao.css';
import { apiFetch } from '../api';

const FormularioAdocao = ({ gatoId, gatoNome, gatoStatus }) => {
  const [etapa, setEtapa] = useState(1);
  const [enviado, setEnviado] = useState(false);
  const [erroValidacao, setErroValidacao] = useState('');
  const [enviando, setEnviando] = useState(false);

  const [formData, setFormData] = useState({
    nomeCandidato: '', email: '', telefone: '', vinculoUnifor: 'Aluno',
    cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
    tipoMoradia: 'Casa', telasProtecao: 'Sim', outrosAnimais: '', rotinaGato: ''
  });

  const [termos, setTermos] = useState({ custos: false, interno: false });

  const aplicarMascaraTelefone = (valor) => {
    let v = valor.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length > 10) v = `${v.slice(0, 10)}-${v.slice(10)}`;
    return v;
  };

  const aplicarMascaraCEP = (valor) => {
    let v = valor.replace(/\D/g, '');
    if (v.length > 8) v = v.slice(0, 8);
    if (v.length > 5) v = `${v.slice(0, 5)}-${v.slice(5)}`;
    return v;
  };

  const buscarCep = async (cepLimpo) => {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const endereco = await res.json();
      if (!endereco.erro) {
        setFormData(prev => ({
          ...prev, rua: endereco.logradouro, bairro: endereco.bairro, cidade: endereco.localidade, estado: endereco.uf
        }));
        setErroValidacao('');
      } else {
        setErroValidacao('CEP não encontrado.');
      }
    } catch (err) {
      setErroValidacao('Não foi possível validar o CEP agora.');
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'telefone') value = aplicarMascaraTelefone(value);
    if (name === 'cep') {
      value = aplicarMascaraCEP(value);
      const cepLimpo = value.replace(/\D/g, '');
      if (cepLimpo.length === 8) buscarCep(cepLimpo);
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleTermosChange = (e) => setTermos({ ...termos, [e.target.name]: e.target.checked });

  const avancarParaEtapa2 = () => {
    if (!formData.nomeCandidato.trim()) return setErroValidacao('Preencha seu Nome Completo.');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(formData.email)) return setErroValidacao('Insira um E-mail válido.');
    if (formData.telefone.replace(/\D/g, '').length < 10) return setErroValidacao('Telefone incompleto.');
    setErroValidacao('');
    setEtapa(2);
  };

  const avancarParaEtapa3 = () => {
    if (formData.cep.replace(/\D/g, '').length !== 8) return setErroValidacao('CEP incompleto.');
    if (!formData.rua.trim() || !formData.numero.trim() || !formData.bairro.trim() || !formData.cidade.trim()) {
      return setErroValidacao('Preencha os dados do endereço (inclusive o Número).');
    }
    setErroValidacao('');
    setEtapa(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rotinaGato.trim()) return setErroValidacao('Por favor, descreva a rotina.');
    if (!termos.custos || !termos.interno) return setErroValidacao('Concorde com os termos marcando as caixinhas.');

    setErroValidacao('');
    setEnviando(true);
    try {
      const response = await apiFetch('/api/formularios', {
        method: 'POST',
        body: JSON.stringify({ ...formData, ...termos, gatoId })
      });
      if (response.ok) setEnviado(true);
      else {
        const dados = await response.json().catch(() => ({}));
        setErroValidacao(dados.mensagem || 'Erro ao enviar. Tente novamente.');
      }
    } catch (error) {
      setErroValidacao('Erro de servidor.');
    } finally {
      setEnviando(false);
    }
  };

  if (gatoStatus === 'Adotado') return (
    <div className="form-adocao-wrapper form-adocao-estado">
      <Heart size={40} className="form-adocao-estado__icone" fill="currentColor" />
      <h3>Gatinho adotado!</h3>
      <p>O {gatoNome} já encontrou uma família.</p>
    </div>
  );

  if (enviado) return (
    <div className="form-adocao-wrapper form-adocao-estado form-adocao-estado--sucesso">
      <PartyPopper size={40} className="form-adocao-estado__icone" />
      <h2>Enviado!</h2>
      <p>Agradecemos o interesse no <strong>{gatoNome}</strong>!</p>
    </div>
  );

  return (
    <div className="form-adocao-wrapper">
      <div className="form-adocao-header">
        <h3 className="form-adocao-titulo">Interesse de Adoção</h3>
        <div className="form-adocao-passo">Passo {etapa} de 3</div>
      </div>

      <div className="form-adocao-progresso">
        <span className={`progresso-dot ${etapa >= 1 ? 'on' : ''}`} />
        <span className={`progresso-line ${etapa >= 2 ? 'on' : ''}`} />
        <span className={`progresso-dot ${etapa >= 2 ? 'on' : ''}`} />
        <span className={`progresso-line ${etapa >= 3 ? 'on' : ''}`} />
        <span className={`progresso-dot ${etapa >= 3 ? 'on' : ''}`} />
      </div>

      {erroValidacao && (
        <p className="form-adocao-erro">
          <CircleAlert size={16} /> {erroValidacao}
        </p>
      )}

      <form onSubmit={handleSubmit}>

        {etapa === 1 && (
          <div className="animar-fade">
            <h4 className="form-adocao-secao">Dados Pessoais</h4>
            <div className="form-adocao-campos">
              <input className="input-padrao" type="text" name="nomeCandidato" placeholder="Nome Completo" value={formData.nomeCandidato} onChange={handleInputChange} />
              <input className="input-padrao" type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleInputChange} />
              <input className="input-padrao" type="text" name="telefone" placeholder="WhatsApp" value={formData.telefone} onChange={handleInputChange} />
              <select className="input-padrao" name="vinculoUnifor" value={formData.vinculoUnifor} onChange={handleInputChange}>
                <option value="Aluno">Sou Aluno Unifor</option>
                <option value="Funcionario">Funcionário/Professor</option>
                <option value="Externo">Comunidade Externa</option>
              </select>
            </div>

            <div className="form-navegacao">
              <button type="button" onClick={avancarParaEtapa2} className="btn-seta" title="Avançar"><ArrowRight size={18} /></button>
            </div>
          </div>
        )}

        {etapa === 2 && (
          <div className="animar-fade">
            <h4 className="form-adocao-secao">Endereço</h4>
            <div className="form-adocao-campos">
              <div className="form-linha">
                <input className="input-padrao form-cep" type="text" name="cep" placeholder="CEP" maxLength="9" value={formData.cep} onChange={handleInputChange} />
                <input className="input-padrao form-flex" type="text" name="rua" placeholder="Rua" value={formData.rua} onChange={handleInputChange} />
              </div>
              <div className="form-linha">
                <input className="input-padrao form-num" type="text" name="numero" placeholder="Nº" value={formData.numero} onChange={handleInputChange} />
                <input className="input-padrao form-flex" type="text" name="complemento" placeholder="Complemento (opcional)" value={formData.complemento} onChange={handleInputChange} />
              </div>
              <div className="form-linha">
                <input className="input-padrao form-flex" type="text" name="bairro" placeholder="Bairro" value={formData.bairro} onChange={handleInputChange} />
                <input className="input-padrao form-flex" type="text" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-navegacao">
              <button type="button" onClick={() => { setEtapa(1); setErroValidacao(''); }} className="btn-seta btn-seta--secundario" title="Voltar"><ArrowLeft size={18} /></button>
              <button type="button" onClick={avancarParaEtapa3} className="btn-seta" title="Avançar"><ArrowRight size={18} /></button>
            </div>
          </div>
        )}

        {etapa === 3 && (
          <div className="animar-fade">
            <h4 className="form-adocao-secao">Sobre o Lar</h4>
            <div className="form-adocao-campos">
              <div className="form-linha">
                <select className="input-padrao form-flex" name="tipoMoradia" value={formData.tipoMoradia} onChange={handleInputChange}>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                </select>
                <select className="input-padrao form-flex" name="telasProtecao" value={formData.telasProtecao} onChange={handleInputChange}>
                  <option value="Sim">Possui telas</option>
                  <option value="Nao">Sem telas</option>
                </select>
              </div>
              <textarea className="input-padrao textarea-padrao" name="outrosAnimais" placeholder="Outros animais (Opcional)" rows="1" value={formData.outrosAnimais} onChange={handleInputChange}></textarea>
              <textarea className="input-padrao textarea-padrao" name="rotinaGato" placeholder="Rotina do gato (viagens, etc)" rows="2" value={formData.rotinaGato} onChange={handleInputChange}></textarea>
            </div>

            <div className="form-adocao-termos">
              <label className="checkbox-termos">
                <input type="checkbox" name="custos" checked={termos.custos} onChange={handleTermosChange} />
                <span>Ciente dos custos diários e veterinário.</span>
              </label>
              <label className="checkbox-termos">
                <input type="checkbox" name="interno" checked={termos.interno} onChange={handleTermosChange} />
                <span>Garantia de acesso APENAS interno (sem rua).</span>
              </label>
            </div>

            <div className="form-navegacao">
              <button type="button" onClick={() => { setEtapa(2); setErroValidacao(''); }} className="btn-seta btn-seta--secundario" title="Voltar"><ArrowLeft size={18} /></button>
              <button type="submit" className="btn-finalizar-mini" disabled={enviando}>
                {enviando ? 'Enviando...' : (<><Check size={16} /> Enviar</>)}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormularioAdocao;
