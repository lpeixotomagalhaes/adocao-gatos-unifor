import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Adote.css';

const Adote = () => {
  const navigate = useNavigate();

  // Banco de dados grande para podermos scrollar bastante!
  const [listaGatos, setListaGatos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarGatosDoBanco() {
      try {
        const resposta = await fetch('http://localhost:5000/api/gatos');
        const dados = await resposta.json();
        setListaGatos(dados);
        setCarregando(false);
      } catch (erro) {
        console.error("Erro ao buscar gatos:", erro);
        setCarregando(false);
      }
    }
    carregarGatosDoBanco();
  }, []);

  const [busca, setBusca] = useState('');
  const [filtroSexo, setFiltroSexo] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [somenteCastrados, setSomenteCastrados] = useState(false);
  const [somenteVacinados, setSomenteVacinados] = useState(false);

  const gatosFiltrados = listaGatos.filter((gato) => {
    const matchNome = gato.nome.toLowerCase().includes(busca.toLowerCase());
    const matchSexo = filtroSexo === 'Todos' || gato.sexo === filtroSexo;
    const matchStatus = filtroStatus === 'Todos' || gato.status === filtroStatus;
    const matchCastrado = somenteCastrados ? gato.castrado : true;
    const matchVacinado = somenteVacinados ? gato.vacinado : true;
    return matchNome && matchSexo && matchStatus && matchCastrado && matchVacinado;
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mostrar');
        } else {
          entry.target.classList.remove('mostrar'); // O efeito mágico bidirecional
        }
      });
    }, { threshold: 0.1 }); 

    const hiddenElements = document.querySelectorAll('.esconder');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [gatosFiltrados]);
  return (
    <main className="adote-container">
      <section className="regras-amigaveis esconder">
        <h2>Tudo o que você precisa saber para adotar</h2>
        <p>Adoção é um ato de amor e muita responsabilidade. Veja o que é preciso:</p>
        <div className="regras-cards">
          {/* Mudei as classes dos ícones para animar também */}
          <div className="regra-item"><div className="regra-icone">👤</div><h3>Maior de 18 anos</h3></div>
          <div className="regra-item"><div className="regra-icone">📍</div><h3>Morar na Região</h3></div>
          <div className="regra-item"><div className="regra-icone">🏠</div><h3>Casa Segura</h3></div>
          <div className="regra-item"><div className="regra-icone">📋</div><h3>Entrevista</h3></div>
        </div>
      </section>

     <section className="filtros-panel esconder">
        <div className="busca-box-nova">
          <span className="busca-icone">🔍</span>
          <input 
            type="text" 
            placeholder="Digite o nome do gatinho..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="filtros-controles-grid">
          <div className="filtro-grupo">
            <label>Sexo</label>
            <select value={filtroSexo} onChange={(e) => setFiltroSexo(e.target.value)}>
              <option value="Todos">Selecione</option>
              <option value="Macho">Macho</option>
              <option value="Fêmea">Fêmea</option>
            </select>
          </div>

          <div className="filtro-grupo">
            <label>Status</label>
            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="Todos">Selecione</option>
              <option value="Disponível">Disponível</option>
              <option value="Pendente">Adoção Pendente</option>
            </select>
          </div>

          <div className="filtro-grupo">
            <label>Condição de Saúde</label>
            <div className="checkbox-wrapper">
              <label className="checkbox-label-grande">
                <input type="checkbox" checked={somenteCastrados} onChange={(e) => setSomenteCastrados(e.target.checked)} /> 
                Castrados
              </label>
              <label className="checkbox-label-grande">
                <input type="checkbox" checked={somenteVacinados} onChange={(e) => setSomenteVacinados(e.target.checked)} /> 
                Vacinados
              </label>
            </div>
          </div>
        </div>
      </section>

      <div className="resultados-resumo esconder">
        <p>Mostrando <strong>{gatosFiltrados.length}</strong> resultado(s)</p>
        <button className="btn-limpar" onClick={() => { setBusca(''); setFiltroSexo('Todos'); setFiltroStatus('Todos'); setSomenteCastrados(false); setSomenteVacinados(false); }}>
          🔄 Limpar Filtros
        </button>
      </div>

      <section className="gatos-grid">
        {gatosFiltrados.map((gato, index) => (
          /* Adicionamos o 'esconder' aqui no card para ele aparecer ao scrollar */
          <div className="gato-card esconder" key={gato.id} style={{ transitionDelay: `${(index % 3) * 0.1}s` }}>
            <img src={gato.foto} alt={gato.nome} className="gato-foto" />
            <div className="gato-info">
              <div className="card-header">
                <h2>{gato.nome}</h2>
                <span className={`status-badge ${gato.status.toLowerCase()}`}>{gato.status}</span>
              </div>
              <p className="gato-dados-basicos"><strong>Sexo:</strong> {gato.sexo} &nbsp;|&nbsp; <strong>Idade:</strong> {gato.idade}</p>
              <div className="saude-tags">
                <span className={gato.castrado ? "tag positiva" : "tag alerta"}>{gato.castrado ? "✔ Cast" : "✖ Não Cast"}</span>
                <span className={gato.vacinado ? "tag positiva" : "tag alerta"}>{gato.vacinado ? "✔ Vac" : "✖ Não Vac"}</span>
              </div>
              <button className="btn-adotar-card" onClick={() => navigate(`/gato/${gato.id}`)}>Saiba Mais</button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Adote;