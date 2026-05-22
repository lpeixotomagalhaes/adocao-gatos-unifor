import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RotateCcw, UserCheck, MapPin, House as HomeIcon, ClipboardList, Cat as CatIcon, Scissors, Syringe } from 'lucide-react';
import './Adote.css';
import { apiUrl, buildMediaUrl } from '../api';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';

const REGRAS = [
  { Icone: UserCheck, titulo: 'Maior de 18 anos' },
  { Icone: MapPin, titulo: 'Morar na Região' },
  { Icone: HomeIcon, titulo: 'Casa Segura' },
  { Icone: ClipboardList, titulo: 'Entrevista' },
];

const Adote = () => {
  const navigate = useNavigate();

  const [listaGatos, setListaGatos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [busca, setBusca] = useState('');
  const [filtroSexo, setFiltroSexo] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [somenteCastrados, setSomenteCastrados] = useState(false);
  const [somenteVacinados, setSomenteVacinados] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await fetch(apiUrl('/api/gatos'));
        const dados = await resposta.json();
        setListaGatos(Array.isArray(dados) ? dados : []);
      } catch {
        setListaGatos([]);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

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
        if (entry.isIntersecting) entry.target.classList.add('mostrar');
        else entry.target.classList.remove('mostrar');
      });
    }, { threshold: 0.1 });

    const hidden = document.querySelectorAll('.esconder');
    hidden.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [gatosFiltrados]);

  const limparFiltros = () => {
    setBusca(''); setFiltroSexo('Todos'); setFiltroStatus('Todos');
    setSomenteCastrados(false); setSomenteVacinados(false);
  };

  return (
    <main className="adote-container">
      <section className="regras-amigaveis esconder">
        <h2>Tudo o que você precisa saber para adotar</h2>
        <p>Adoção é um ato de amor e muita responsabilidade. Veja o que é preciso:</p>
        <div className="regras-cards">
          {REGRAS.map(({ Icone, titulo }) => (
            <div className="regra-item" key={titulo}>
              <div className="regra-icone"><Icone size={28} strokeWidth={1.7} /></div>
              <h3>{titulo}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="filtros-panel esconder">
        <div className="busca-box-nova">
          <span className="busca-icone"><Search size={18} /></span>
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
        <button className="btn-limpar" onClick={limparFiltros}>
          <RotateCcw size={14} /> Limpar Filtros
        </button>
      </div>

      <section className="gatos-grid">
        {carregando ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} altura="320px" />)
        ) : gatosFiltrados.length === 0 ? (
          <div className="gatos-grid-empty">
            <EmptyState
              icone={CatIcon}
              titulo="Nenhum gato encontrado"
              descricao="Tente ajustar os filtros ou limpe a busca para ver todos os disponíveis."
              acao={<button className="btn-limpar" onClick={limparFiltros}><RotateCcw size={14} /> Limpar Filtros</button>}
            />
          </div>
        ) : (
          gatosFiltrados.map((gato, index) => (
            <div className="gato-card esconder" key={gato._id} style={{ transitionDelay: `${(index % 3) * 0.1}s` }}>
              <img src={buildMediaUrl(gato.foto)} alt={gato.nome} className="gato-foto" />
              <div className="gato-info">
                <div className="card-header">
                  <h2>{gato.nome}</h2>
                  <StatusBadge status={gato.status} />
                </div>
                <p className="gato-dados-basicos"><strong>Sexo:</strong> {gato.sexo} &nbsp;|&nbsp; <strong>Idade:</strong> {gato.idade}</p>
                <div className="saude-tags">
                  <span className={`saude-pill ${gato.castrado ? 'on' : 'off'}`}>
                    <Scissors size={13} /> {gato.castrado ? 'Castrado' : 'Não cast.'}
                  </span>
                  <span className={`saude-pill ${gato.vacinado ? 'on' : 'off'}`}>
                    <Syringe size={13} /> {gato.vacinado ? 'Vacinado' : 'Não vac.'}
                  </span>
                </div>
                <button
                  className="btn-adotar-card"
                  onClick={() => navigate(`/gato/${gato.slug || gato._id}`)}
                >
                  Saiba Mais
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default Adote;
