import React, { useState } from 'react';
import './Adote.css';

const Adote = () => {
  // Nosso "banco de dados" temporário diversificado
  const gatosMock = [
    { id: 1, nome: 'Mingau', sexo: 'Macho', idade: '2 anos', foto: 'https://placekitten.com/300/300', castrado: true, vacinado: true, fiv: 'Negativo', felv: 'Negativo', status: 'Disponível' },
    { id: 2, nome: 'Luna', sexo: 'Fêmea', idade: '1 ano', foto: 'https://placekitten.com/305/305', castrado: false, vacinado: true, fiv: 'Negativo', felv: 'Negativo', status: 'Disponível' },
    { id: 3, nome: 'Frajola', sexo: 'Macho', idade: '3 meses', foto: 'https://placekitten.com/310/310', castrado: false, vacinado: false, fiv: 'Negativo', felv: 'Negativo', status: 'Pendente' },
    { id: 4, nome: 'Amora', sexo: 'Fêmea', idade: '4 meses', foto: 'https://placekitten.com/302/302', castrado: true, vacinado: true, fiv: 'Negativo', felv: 'Negativo', status: 'Disponível' },
    { id: 5, nome: 'Simba', sexo: 'Macho', idade: '1.5 anos', foto: 'https://placekitten.com/308/308', castrado: true, vacinado: false, fiv: 'Positivo', felv: 'Negativo', status: 'Disponível' },
    { id: 6, nome: 'Nina', sexo: 'Fêmea', idade: '3 anos', foto: 'https://placekitten.com/312/312', castrado: true, vacinado: true, fiv: 'Negativo', felv: 'Negativo', status: 'Adotado' },
  ];

  // Estados para controlar os filtros
  const [busca, setBusca] = useState('');
  const [filtroSexo, setFiltroSexo] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todos'); // Ajustado para 'Todos' por padrão
  const [somenteCastrados, setSomenteCastrados] = useState(false);
  const [somenteVacinados, setSomenteVacinados] = useState(false);

  // Lógica de filtragem
  const gatosFiltrados = gatosMock.filter((gato) => {
    const matchNome = gato.nome.toLowerCase().includes(busca.toLowerCase());
    const matchSexo = filtroSexo === 'Todos' || gato.sexo === filtroSexo;
    const matchStatus = filtroStatus === 'Todos' || gato.status === filtroStatus;
    const matchCastrado = somenteCastrados ? gato.castrado : true;
    const matchVacinado = somenteVacinados ? gato.vacinado : true;

    return matchNome && matchSexo && matchStatus && matchCastrado && matchVacinado;
  });

  // Cálculos para o Resumo
  const totalResultados = gatosFiltrados.length;
  const disponiveisCount = gatosFiltrados.filter(g => g.status === 'Disponível').length;

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setBusca('');
    setFiltroSexo('Todos');
    setFiltroStatus('Todos');
    setSomenteCastrados(false);
    setSomenteVacinados(false);
  };

  return (
    <main className="adote-container">
      
      {/* Nova Seção de Regras Amigável */}
      <section className="regras-amigaveis">
        <h2>Tudo o que você precisa saber para adotar</h2>
        <p>Adoção é um ato de amor e muita responsabilidade. Veja o que é preciso para levar um resgatinho para casa:</p>
        
        <div className="regras-cards">
          <div className="regra-item">
            <div className="regra-icone">👤</div>
            <h3>Maior de 18 anos</h3>
            <p>É necessário ser maior de idade ou ter a autorização formal de um responsável legal.</p>
          </div>
          
          <div className="regra-item">
            <div className="regra-icone">📍</div>
            <h3>Morar na Região</h3>
            <p>Residir em Fortaleza ou região metropolitana (Eusébio, etc) para facilitar nosso acompanhamento.</p>
          </div>
          
          <div className="regra-item">
            <div className="regra-icone">🏠</div>
            <h3>Casa Segura</h3>
            <p>Apartamentos devem ter telas de proteção. Casas não podem ter acesso livre à rua.</p>
          </div>
          
          <div className="regra-item">
            <div className="regra-icone">📋</div>
            <h3>Entrevista</h3>
            <p>Preencher nosso formulário de interesse e passar por um bate-papo super tranquilo com a equipe.</p>
          </div>
        </div>
      </section>

      {/* Painel de Filtros */}
      <section className="filtros-panel">
        <div className="busca-box">
          <input 
            type="text" 
            placeholder="Buscar por nome..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="filtros-controles">
          <select value={filtroSexo} onChange={(e) => setFiltroSexo(e.target.value)}>
            <option value="Todos">Sexo (Todos)</option>
            <option value="Macho">Macho</option>
            <option value="Fêmea">Fêmea</option>
          </select>

          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value="Todos">Status (Todos)</option>
            <option value="Disponível">Disponível</option>
            <option value="Pendente">Adoção Pendente</option>
          </select>

          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={somenteCastrados} 
              onChange={(e) => setSomenteCastrados(e.target.checked)} 
            />
            Somente Castrados
          </label>

          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={somenteVacinados} 
              onChange={(e) => setSomenteVacinados(e.target.checked)} 
            />
            Somente Vacinados
          </label>
        </div>
      </section>

      {/* BARRA DE RESUMO E LIMPEZA DE FILTROS */}
      <div className="resultados-resumo">
        <p>
          Mostrando <strong>{totalResultados}</strong> resultado(s) 
          <span className="destaque-disponivel"> ({disponiveisCount} disponíveis para adoção)</span>
        </p>
        <button className="btn-limpar" onClick={limparFiltros}>
          🔄 Limpar Filtros
        </button>
      </div>

      {/* Grade de Resultados */}
      <section className="gatos-grid">
        {gatosFiltrados.length > 0 ? (
          gatosFiltrados.map((gato) => (
            <div className="gato-card" key={gato.id}>
              <img src={gato.foto} alt={`Foto do gato ${gato.nome}`} className="gato-foto" />
              
              <div className="gato-info">
                <div className="card-header">
                  <h2>{gato.nome}</h2>
                  <span className={`status-badge ${gato.status.toLowerCase()}`}>{gato.status}</span>
                </div>
                
                <p className="gato-dados-basicos"><strong>Sexo:</strong> {gato.sexo} &nbsp;|&nbsp; <strong>Idade:</strong> {gato.idade}</p>
                
                {/* Dados de Saúde Dinâmicos */}
                <div className="saude-tags">
                  <span className={gato.castrado ? "tag positiva" : "tag alerta"}>
                    {gato.castrado ? "✔ Castrado" : "✖ Não Castrado"}
                  </span>
                  <span className={gato.vacinado ? "tag positiva" : "tag alerta"}>
                    {gato.vacinado ? "✔ Vacinado" : "✖ Não Vacinado"}
                  </span>
                </div>

                <div className="fiv-felv-info">
                  <p>FIV: <strong>{gato.fiv}</strong> | FeLV: <strong>{gato.felv}</strong></p>
                </div>

                <button className="btn-adotar-card">Saiba Mais</button>
              </div>
            </div>
          ))
        ) : (
          <div className="nenhum-resultado">
            <h3>Nenhum gatinho encontrado com esses filtros 😿</h3>
            <p>Tente remover alguns filtros ou clique em "Limpar Filtros" acima.</p>
          </div>
        )}
      </section>
      
    </main>
  );
};

export default Adote;