import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormularioAdocao from "../components/FormularioAdocao";
import "./PerfilGato.css";

const PerfilGato = () => {
  const { id } = useParams();
  const navegarPara = useNavigate();
  const [gato, setGato] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function buscarGatoPorId() {
      try {
        const resposta = await fetch(`http://localhost:5000/api/gatos/${id}`);
        if (!resposta.ok) return navegarPara("/adote");

        const dados = await resposta.json();
        setGato(dados);
        setCarregando(false);
      } catch (erro) {
        navegarPara("/adote");
      }
    }
    buscarGatoPorId();
  }, [id, navegarPara]);

  if (carregando) return <div className="perfil-erro"><h2>Buscando gatinho... 🐾</h2></div>;
  if (!gato) return <div className="perfil-erro"><h2>Gatinho não encontrado 😿</h2></div>;

  return (
    <main>
      <section className="perfil-banner-azul">
        <div className="perfil-conteudo">
          
          {/* COLUNA 1: IMAGEM */}
          <div className="perfil-imagem">
            <img src={gato.foto} alt={`Foto de ${gato.nome}`} />
          </div>

          {/* CAIXA DIREITA DIVIDIDA ENTRE INFOS E FORMULÁRIO */}
          <div className="perfil-dados-brancos">
            
            {/* COLUNA 2: INFORMAÇÕES DO GATO (AGORA DIVIDIDA EM DUAS!) */}
            <div className="perfil-info-coluna">
              
              {/* LADO ESQUERDO: Nome, Sexo, Idade, Saúde */}
              <div className="info-corpo-esquerda">
                <div className="perfil-cabecalho">
                  <h1>{gato.nome}</h1>
                  <span className={`badge-status-branco ${gato.status.toLowerCase()}`}>
                    {gato.status}
                  </span>
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
              </div>

              {/* LADO DIREITO: Sobre Mim */}
              <div className="info-corpo-direita">
                <div className="perfil-descricao">
                  <h3>Sobre mim</h3>
                  <p>{gato.descricao}</p>
                </div>
              </div>

            </div>

            {/* COLUNA 3: FORMULÁRIO WIZARD */}
            <div className="perfil-form-coluna">
              <FormularioAdocao 
                gatoId={gato._id} 
                gatoNome={gato.nome} 
                gatoStatus={gato.status} 
              />
            </div>

          </div>
        </div>
      </section>

      {/* REGRAS AMIGÁVEIS */}
      <section className="regras-amigaveis perfil-regras">
        <h2>Tudo o que você precisa saber para adotar</h2>
        <p>Adoção é um ato de amor e muita responsabilidade. Veja o que é preciso:</p>
        <div className="regras-cards">
          <div className="regra-item">
            <div className="regra-icone">👤</div>
            <h3>Maior de 18 anos</h3>
            <p>É necessário ser maior de idade ou ter a autorização formal de um responsável legal.</p>
          </div>
          <div className="regra-item">
            <div className="regra-icone">📍</div>
            <h3>Morar na Região</h3>
            <p>Residir em Fortaleza ou região metropolitana (Eusébio, etc).</p>
          </div>
          <div className="regra-item">
            <div className="regra-icone">🏠</div>
            <h3>Casa Segura</h3>
            <p>Apartamentos devem ter telas de proteção. Casas sem acesso livre à rua.</p>
          </div>
          <div className="regra-item">
            <div className="regra-icone">📋</div>
            <h3>Formulário</h3>
            <p>Preencher nosso formulário online e aguardar o contato da equipe.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PerfilGato;