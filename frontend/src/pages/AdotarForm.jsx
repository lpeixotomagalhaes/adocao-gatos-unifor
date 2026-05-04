import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AdotarForm.css';

const AdotarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gato, setGato] = useState(null);
  const [etapa, setEtapa] = useState(1);
  const [enviado, setEnviado] = useState(false);

  const [formData, setFormData] = useState({
    nomeCandidato: '', email: '', telefone: '', vinculoUnifor: 'Aluno',
    tipoMoradia: 'Casa', telasProtecao: 'Sim', outrosAnimais: '',
    rotinaGato: '', concordanciaCastracao: true, compromissoFinanceiro: true
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/gatos/${id}`)
      .then(res => res.json())
      .then(data => setGato(data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/formularios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, gatoId: id })
      });
      if (response.ok) setEnviado(true);
    } catch (error) {
      alert("Erro ao enviar formulário.");
    }
  };

  if (enviado) return (
    <div className="form-sucesso-container">
      <div className="sucesso-card">
        <span>🎉</span>
        <h2>Solicitação Enviada!</h2>
        <p>Obrigado por querer dar um lar para o <strong>{gato?.nome}</strong>. Analisaremos sua proposta e entraremos em contato via WhatsApp/E-mail em breve.</p>
        <button onClick={() => navigate('/adote')} className="btn-voltar">Voltar para Início</button>
      </div>
    </div>
  );

  return (
    <div className="form-adocao-master">
      <header className="form-header">
        <button onClick={() => navigate(-1)}>← Voltar</button>
        <div className="progresso-bar">
          <div className={`step ${etapa >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step ${etapa >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step ${etapa >= 3 ? 'active' : ''}`}>3</div>
        </div>
      </header>

      <main className="form-main">
        <div className="gato-header-mini">
          <img src={gato?.foto} alt="" />
          <div>
            <h1>Formulário de Adoção</h1>
            <p>Você está se candidatando para adotar o <strong>{gato?.nome}</strong></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="adocao-form">
          {etapa === 1 && (
            <section className="form-section animar">
              <h2>1. Dados Pessoais</h2>
              <input type="text" placeholder="Seu Nome Completo" required onChange={e => setFormData({...formData, nomeCandidato: e.target.value})} />
              <input type="email" placeholder="E-mail" required onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="text" placeholder="WhatsApp (DDD + Número)" required onChange={e => setFormData({...formData, telefone: e.target.value})} />
              <select onChange={e => setFormData({...formData, vinculoUnifor: e.target.value})}>
                <option value="Aluno">Sou Aluno da Unifor</option>
                <option value="Funcionario">Sou Funcionário/Professor</option>
                <option value="Externo">Não tenho vínculo (Comunidade)</option>
              </select>
              <button type="button" onClick={() => setEtapa(2)} className="btn-proximo">Continuar</button>
            </section>
          )}

          {etapa === 2 && (
            <section className="form-section animar">
              <h2>2. Sobre o seu Lar</h2>
              <label>Onde você mora?</label>
              <select onChange={e => setFormData({...formData, tipoMoradia: e.target.value})}>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
              </select>
              <label>A residência possui telas de proteção?</label>
              <select onChange={e => setFormData({...formData, telasProtecao: e.target.value})}>
                <option value="Sim">Sim, em todas as janelas/vão</option>
                <option value="Nao">Não possuo</option>
                <option value="Provindenciando">Estou providenciando</option>
              </select>
              <textarea placeholder="Possui outros animais? Se sim, quais?" onChange={e => setFormData({...formData, outrosAnimais: e.target.value})}></textarea>
              <div className="btn-group">
                <button type="button" onClick={() => setEtapa(1)} className="btn-voltar-etapa">Voltar</button>
                <button type="button" onClick={() => setEtapa(3)} className="btn-proximo">Continuar</button>
              </div>
            </section>
          )}

          {etapa === 3 && (
            <section className="form-section animar">
              <h2>3. Compromisso e Responsabilidade</h2>
              <textarea placeholder="Como será a rotina do gato? Quem cuidará nas viagens?" required onChange={e => setFormData({...formData, rotinaGato: e.target.value})}></textarea>
              <label className="check-label">
                <input type="checkbox" required /> Estou ciente dos custos com ração e veterinário.
              </label>
              <label className="check-label">
                <input type="checkbox" required /> Concordo que o animal não deve ter acesso à rua (saídas desacompanhadas).
              </label>
              <div className="btn-group">
                <button type="button" onClick={() => setEtapa(2)} className="btn-voltar-etapa">Voltar</button>
                <button type="submit" className="btn-finalizar">Enviar Candidatura</button>
              </div>
            </section>
          )}
        </form>
      </main>
    </div>
  );
};

export default AdotarForm;