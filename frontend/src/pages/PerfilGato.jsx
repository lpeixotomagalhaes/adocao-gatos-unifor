import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PerfilGato.css';

const PerfilGato = () => {
  const { id } = useParams();

  // A MÁGICA DO SCROLL AQUI:
  useEffect(() => {
    window.scrollTo(0, 0); // Força a tela a ir para o pixel 0x0 (topo) sempre que abrir
  }, []);

  const gatosMock = [
    { id: 1, nome: 'Mingau', sexo: 'Macho', idade: '2 anos', foto: 'https://loremflickr.com/400/500/cat?lock=1', castrado: true, vacinado: true, fiv: 'Negativo', felv: 'Negativo', status: 'Disponível', descricao: 'Oie galera, tudo bem? Sou o Mingau! Fui resgatado perto do bloco de veterinária e sou um gatinho super carinhoso. Adoro um cafuné e um sachê no fim do dia. Estou prontinho para encontrar minha família definitiva!' },
    { id: 2, nome: 'Luna', sexo: 'Fêmea', idade: '1 ano', foto: 'https://loremflickr.com/400/500/cat?lock=2', castrado: false, vacinado: true, fiv: 'Negativo', felv: 'Negativo', status: 'Disponível', descricao: 'Oie! Eu sou a Luna. Sou um pouco tímida no começo, mas quando ganho confiança viro um grude. Procuro uma família paciente e cheia de amor.' },
    { id: 3, nome: 'Frajola', sexo: 'Macho', idade: '3 meses', foto: 'https://loremflickr.com/400/500/cat?lock=3', castrado: false, vacinado: false, fiv: 'Negativo', felv: 'Negativo', status: 'Pendente', descricao: 'Sou um filhotinho cheio de energia! Adoro brincar com bolinhas de papel.' },
    { id: 4, nome: 'Amora', sexo: 'Fêmea', idade: '4 meses', foto: 'https://loremflickr.com/400/500/cat?lock=4', castrado: true, vacinado: true, fiv: 'Negativo', felv: 'Negativo', status: 'Disponível', descricao: 'Sou super curiosa e adoro explorar todos os cantos da casa.' },
    { id: 5, nome: 'Simba', sexo: 'Macho', idade: '1.5 anos', foto: 'https://loremflickr.com/400/500/cat?lock=5', castrado: true, vacinado: false, fiv: 'Positivo', felv: 'Negativo', status: 'Disponível', descricao: 'Apesar de ser FIV positivo, sou muito saudável e tenho muito amor para dar. Preciso ser filho único ou conviver com outros gatinhos FIV+.' },
    { id: 6, nome: 'Nina', sexo: 'Fêmea', idade: '3 anos', foto: 'https://loremflickr.com/400/500/cat?lock=6', castrado: true, vacinado: true, fiv: 'Negativo', felv: 'Negativo', status: 'Adotado', descricao: 'Já encontrei minha família! Obrigado por torcerem por mim.' }
  ];

  const gato = gatosMock.find((g) => g.id === parseInt(id));

  if (!gato) return <div className="perfil-erro"><h2>Gatinho não encontrado 😿</h2></div>;

  // LINK DO GOOGLE FORMS OFICIAL:
  const abrirFormulario = () => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfrcxkBvJiLFzaM0sCL2pDS7EQbDcIDURithPOP8zVCoulAxA/viewform', '_blank');
  };

  return (
    <main>
      <section className="perfil-banner-azul">
        <div className="perfil-conteudo">
          <div className="perfil-imagem">
            <img src={gato.foto} alt={`Foto de ${gato.nome}`} />
          </div>

          <div className="perfil-dados-brancos">
            <div className="perfil-cabecalho">
              <h1>{gato.nome}</h1>
              <span className={`badge-status-branco ${gato.status.toLowerCase()}`}>{gato.status}</span>
            </div>

            <div className="perfil-info-basica">
              <p><strong>Sexo:</strong> {gato.sexo}</p>
              <p><strong>Idade:</strong> {gato.idade}</p>
            </div>

            <div className="perfil-saude-transparente">
              <h3>Histórico Médico</h3>
              <ul>
                <li>{gato.castrado ? "✔ Castrado" : "✖ Não Castrado"}</li>
                <li>{gato.vacinado ? "✔ Vacinado" : "✖ Não Vacinado"}</li>
                <li>FIV: <strong>{gato.fiv}</strong> | FeLV: <strong>{gato.felv}</strong></li>
              </ul>
            </div>

            <div className="perfil-descricao">
              <h3>Sobre mim</h3>
              <p>{gato.descricao}</p>
            </div>

            <button className="btn-quero-adotar-forms" onClick={abrirFormulario}>
              Quero Adotar o {gato.nome}!
            </button>
          </div>
        </div>
      </section>

      <section className="regras-amigaveis perfil-regras">
        <h2>Tudo o que você precisa saber para adotar</h2>
        <p>Adoção é um ato de amor e muita responsabilidade. Veja o que é preciso:</p>
        
        <div className="regras-cards">
          <div className="regra-item"><div className="regra-icone">👤</div><h3>Maior de 18 anos</h3><p>É necessário ser maior de idade ou ter a autorização formal de um responsável legal.</p></div>
          <div className="regra-item"><div className="regra-icone">📍</div><h3>Morar na Região</h3><p>Residir em Fortaleza ou região metropolitana (Eusébio, etc).</p></div>
          <div className="regra-item"><div className="regra-icone">🏠</div><h3>Casa Segura</h3><p>Apartamentos devem ter telas de proteção. Casas sem acesso livre à rua.</p></div>
          <div className="regra-item"><div className="regra-icone">📋</div><h3>Formulário</h3><p>Preencher nosso formulário online e aguardar o contato da equipe.</p></div>
        </div>
      </section>
    </main>
  );
};

export default PerfilGato;