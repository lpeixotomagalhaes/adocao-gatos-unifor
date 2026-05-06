import React, { useState } from 'react';
import './FormularioAdocao.css';

const FormularioAdocao = ({ gatoId, gatoNome, gatoStatus }) => {
  const [etapa, setEtapa] = useState(1);
  const [enviado, setEnviado] = useState(false);
  const [erroValidacao, setErroValidacao] = useState('');

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
    } catch (err) {}
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
    try {
      const response = await fetch('http://localhost:5000/api/formularios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ...termos, gatoId: gatoId }) 
      });
      if (response.ok) setEnviado(true);
      else setErroValidacao('Erro ao enviar. Tente novamente.');
    } catch (error) { setErroValidacao('Erro de servidor.'); }
  };

  if (gatoStatus === 'Adotado') return (
    <div className="form-adocao-wrapper text-center">
      <h3 style={{ color: '#aaa', fontSize: '1.6rem' }}>Gatinho adotado! ❤️</h3>
      <p style={{ marginTop: '10px' }}>O {gatoNome} já encontrou uma família.</p>
    </div>
  );

  if (enviado) return (
    <div className="form-adocao-wrapper text-center" style={{ border: '2px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
      <h2 style={{ color: '#16a34a', fontSize: '1.8rem' }}>🎉 Enviado!</h2>
      <p style={{ marginTop: '10px', color: '#15803d' }}>Agradecemos o interesse no <strong>{gatoNome}</strong>!</p>
    </div>
  );

  return (
    <div className="form-adocao-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h3 className="form-adocao-titulo" style={{ margin: 0, border: 'none' }}>Interesse de Adoção</h3>
        <div style={{ fontSize: '0.9rem', color: '#888', fontWeight: 'bold' }}>Passo {etapa} de 3</div>
      </div>
      
      {erroValidacao && <p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '20px', padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>⚠ {erroValidacao}</p>}
      
      <form onSubmit={handleSubmit}>
        
        {etapa === 1 && (
          <div className="animar-fade">
            <h4 className="form-adocao-secao">1. Dados Pessoais</h4>
            <input className="input-padrao" style={{ marginBottom: '20px' }} type="text" name="nomeCandidato" placeholder="Nome Completo" value={formData.nomeCandidato} onChange={handleInputChange} />
            <input className="input-padrao" style={{ marginBottom: '20px' }} type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleInputChange} />
            <input className="input-padrao" style={{ marginBottom: '20px' }} type="text" name="telefone" placeholder="WhatsApp" value={formData.telefone} onChange={handleInputChange} />
            <select className="input-padrao" style={{ marginBottom: '10px' }} name="vinculoUnifor" value={formData.vinculoUnifor} onChange={handleInputChange}>
              <option value="Aluno">Sou Aluno Unifor</option>
              <option value="Funcionario">Funcionário/Professor</option>
              <option value="Externo">Comunidade Externa</option>
            </select>
            
            <div className="form-navegacao">
              <button type="button" onClick={avancarParaEtapa2} className="btn-seta" title="Avançar para o Endereço">➔</button>
            </div>
          </div>
        )}

        {etapa === 2 && (
          <div className="animar-fade">
            <h4 className="form-adocao-secao">2. Endereço</h4>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <input className="input-padrao" style={{ width: '140px' }} type="text" name="cep" placeholder="CEP" maxLength="9" value={formData.cep} onChange={handleInputChange} />
              <input className="input-padrao" style={{ flex: 1 }} type="text" name="rua" placeholder="Rua" value={formData.rua} onChange={handleInputChange} />
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <input className="input-padrao" style={{ width: '120px' }} type="text" name="numero" placeholder="Nº" value={formData.numero} onChange={handleInputChange} />
              <input className="input-padrao" style={{ flex: 1 }} type="text" name="complemento" placeholder="Complemento (Opcional)" value={formData.complemento} onChange={handleInputChange} />
            </div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
              <input className="input-padrao" style={{ flex: 1 }} type="text" name="bairro" placeholder="Bairro" value={formData.bairro} onChange={handleInputChange} />
              <input className="input-padrao" style={{ flex: 1 }} type="text" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleInputChange} />
            </div>
            
            <div className="form-navegacao">
              <button type="button" onClick={() => { setEtapa(1); setErroValidacao(''); }} className="btn-seta" title="Voltar">←</button>
              <button type="button" onClick={avancarParaEtapa3} className="btn-seta" title="Avançar para Sobre o Lar">➔</button>
            </div>
          </div>
        )}

        {etapa === 3 && (
          <div className="animar-fade">
            <h4 className="form-adocao-secao">3. Sobre o Lar</h4>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <select className="input-padrao" style={{ flex: 1 }} name="tipoMoradia" value={formData.tipoMoradia} onChange={handleInputChange}>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
              </select>
              <select className="input-padrao" style={{ flex: 1 }} name="telasProtecao" value={formData.telasProtecao} onChange={handleInputChange}>
                <option value="Sim">Possui telas</option>
                <option value="Nao">Sem telas</option>
              </select>
            </div>
            <textarea className="input-padrao textarea-padrao" style={{ marginBottom: '20px' }} name="outrosAnimais" placeholder="Outros animais (Opcional)" rows="1" value={formData.outrosAnimais} onChange={handleInputChange}></textarea>
            <textarea className="input-padrao textarea-padrao" style={{ marginBottom: '15px' }} name="rotinaGato" placeholder="Rotina do gato (viagens, etc)" rows="2" value={formData.rotinaGato} onChange={handleInputChange}></textarea>

            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label className="checkbox-termos">
                <input type="checkbox" name="custos" checked={termos.custos} onChange={handleTermosChange} /> 
                <span>Ciente dos custos diários e veterinário.</span>
              </label>
              <label className="checkbox-termos">
                <input type="checkbox" name="interno" checked={termos.interno} onChange={handleTermosChange} /> 
                <span>Garantia de acesso APENAS interno (sem rua).</span>
              </label>
            </div>

            <div className="form-navegacao" style={{ marginTop: '35px' }}>
              <button type="button" onClick={() => { setEtapa(2); setErroValidacao(''); }} className="btn-seta" title="Voltar">←</button>
              <button type="submit" className="btn-finalizar-mini">Enviar ✔</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormularioAdocao;