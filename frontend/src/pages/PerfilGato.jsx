import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PerfilGato.css";

const PerfilGato = () => {
  const { id } = useParams();

  // A MÁGICA DO SCROLL AQUI:
  useEffect(() => {
    window.scrollTo(0, 0); // Força a tela a ir para o pixel 0x0 (topo) sempre que abrir
  }, []);

  const navegarPara = useNavigate();
  const [gato, setGato] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagemStatus, setMensagemStatus] = useState("");

  // Estado que guarda as respostas do usuário
  const [formularioAdocao, setFormularioAdocao] = useState({
    nomeCandidato: "",
    vinculoUnifor: "Aluno",
    idade: "",
    telefone: "",
    tipoMoradia: "Casa",
    possuiTelas: "Sim",
    motivoAdocao: "",
  });

  // Busca o gato do banco de dados quando a página abre
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

  // Atualiza o estado conforme a pessoa digita no formulário
  const lidarMudancaInput = (evento) => {
    const { name, value } = evento.target;
    setFormularioAdocao({ ...formularioAdocao, [name]: value });
  };

  // Envia os dados para a sua API e para a aba "Solicitações" do Admin
  const enviarPedidoAdocao = async (evento) => {
    evento.preventDefault();
    setMensagemStatus("Enviando...");
    try {
      const cargaDados = { ...formularioAdocao, gatoId: id };
      const resposta = await fetch("http://localhost:5000/api/formularios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cargaDados),
      });

      if (resposta.ok) {
        setMensagemStatus(
          "Formulário enviado com sucesso! Acompanhe pelo seu telefone.",
        );
        setFormularioAdocao({
          nomeCandidato: "",
          vinculoUnifor: "Aluno",
          idade: "",
          telefone: "",
          tipoMoradia: "Casa",
          possuiTelas: "Sim",
          motivoAdocao: "",
        });
      } else {
        setMensagemStatus("Erro ao enviar. Tente novamente.");
      }
    } catch (erro) {
      setMensagemStatus("Erro de conexão com o servidor.");
    }
  };

  if (carregando)
    return (
      <div className="perfil-erro">
        <h2>Buscando gatinho... 🐾</h2>
      </div>
    );
  if (!gato)
    return (
      <div className="perfil-erro">
        <h2>Gatinho não encontrado 😿</h2>
      </div>
    );

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
              <span
                className={`badge-status-branco ${gato.status.toLowerCase()}`}
              >
                {gato.status}
              </span>
            </div>

            <div className="perfil-info-basica">
              <p>
                <strong>Sexo:</strong> {gato.sexo}
              </p>
              <p>
                <strong>Idade:</strong> {gato.idade}
              </p>
            </div>

            <div className="perfil-saude-transparente">
              <h3>Histórico Médico</h3>
              <ul>
                <li>{gato.castrado ? "✔ Castrado" : "✖ Não Castrado"}</li>
                <li>{gato.vacinado ? "✔ Vacinado" : "✖ Não Vacinado"}</li>
                <li>
                  FIV: <strong>{gato.fiv}</strong> | FeLV:{" "}
                  <strong>{gato.felv}</strong>
                </li>
              </ul>
            </div>

            <div className="perfil-descricao">
              <h3>Sobre mim</h3>
              <p>{gato.descricao}</p>
            </div>

            <div className="formulario-adocao-container" style={{ marginTop: '30px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ marginBottom: '15px' }}>Formulário de Interesse</h3>
              
              {mensagemStatus && <p style={{ color: '#00AAFF', fontWeight: 'bold', marginBottom: '15px' }}>{mensagemStatus}</p>}
              
              <form onSubmit={enviarPedidoAdocao} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" name="nomeCandidato" placeholder="Seu Nome Completo" value={formularioAdocao.nomeCandidato} onChange={lidarMudancaInput} required style={{ padding: '12px', borderRadius: '8px', border: 'none' }} />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select name="vinculoUnifor" value={formularioAdocao.vinculoUnifor} onChange={lidarMudancaInput} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none' }}>
                    <option value="Aluno">Sou Aluno Unifor</option>
                    <option value="Professor">Sou Professor</option>
                    <option value="Funcionário">Sou Funcionário</option>
                    <option value="Comunidade Externa">Comunidade Externa</option>
                  </select>
                  <input type="number" name="idade" placeholder="Idade" value={formularioAdocao.idade} onChange={lidarMudancaInput} required style={{ width: '90px', padding: '12px', borderRadius: '8px', border: 'none' }} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" name="telefone" placeholder="Telefone (WhatsApp)" value={formularioAdocao.telefone} onChange={lidarMudancaInput} required style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none' }} />
                  <select name="tipoMoradia" value={formularioAdocao.tipoMoradia} onChange={lidarMudancaInput} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none' }}>
                    <option value="Casa">Casa</option>
                    <option value="Apartamento">Apartamento</option>
                  </select>
                </div>

                <select name="possuiTelas" value={formularioAdocao.possuiTelas} onChange={lidarMudancaInput} style={{ padding: '12px', borderRadius: '8px', border: 'none' }}>
                  <option value="Sim">Possuo telas de proteção nas janelas</option>
                  <option value="Não">Não possuo telas de proteção</option>
                  <option value="Vou instalar">Vou instalar as telas</option>
                </select>

                <textarea name="motivoAdocao" placeholder={`Por que você deseja adotar o(a) ${gato.nome}?`} rows="3" value={formularioAdocao.motivoAdocao} onChange={lidarMudancaInput} required style={{ padding: '12px', borderRadius: '8px', border: 'none', resize: 'vertical' }}></textarea>

                <button type="submit" disabled={gato.status === 'Adotado'} className="btn-quero-adotar-forms" style={{ marginTop: '10px', width: '100%', opacity: gato.status === 'Adotado' ? 0.5 : 1, cursor: gato.status === 'Adotado' ? 'not-allowed' : 'pointer' }}>
                  {gato.status === 'Adotado' ? 'Gatinho já adotado' : `Enviar Pedido de Adoção`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="regras-amigaveis perfil-regras">
        <h2>Tudo o que você precisa saber para adotar</h2>
        <p>
          Adoção é um ato de amor e muita responsabilidade. Veja o que é
          preciso:
        </p>

        <div className="regras-cards">
          <div className="regra-item">
            <div className="regra-icone">👤</div>
            <h3>Maior de 18 anos</h3>
            <p>
              É necessário ser maior de idade ou ter a autorização formal de um
              responsável legal.
            </p>
          </div>
          <div className="regra-item">
            <div className="regra-icone">📍</div>
            <h3>Morar na Região</h3>
            <p>Residir em Fortaleza ou região metropolitana (Eusébio, etc).</p>
          </div>
          <div className="regra-item">
            <div className="regra-icone">🏠</div>
            <h3>Casa Segura</h3>
            <p>
              Apartamentos devem ter telas de proteção. Casas sem acesso livre à
              rua.
            </p>
          </div>
          <div className="regra-item">
            <div className="regra-icone">📋</div>
            <h3>Formulário</h3>
            <p>
              Preencher nosso formulário online e aguardar o contato da equipe.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PerfilGato;
