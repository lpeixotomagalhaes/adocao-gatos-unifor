import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

// 1. Importando a imagem diretamente da sua pasta assets!
import logoUnifor from '../assets/unifor-h-negativa.svg'; 

function AdminLogin() {
  const [credenciais, setCredenciais] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navegarPara = useNavigate();

  const lidarMudanca = (e) => {
    setCredenciais({ ...credenciais, [e.target.name]: e.target.value });
  };

  const fazerLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const resposta = await fetch('http://127.0.0.1:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciais)
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        localStorage.setItem('tokenAdmin', dados.token);
        localStorage.setItem('adminNome', dados.admin.nome); // SALVA O NOME REAL
        localStorage.setItem('adminEmail', dados.admin.email); // SALVA O E-MAIL REAL
        navegarPara('/admin/dashboard');
      } else {
        setErro(dados.mensagem || 'E-mail ou senha incorretos.');
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="unifor-login-layout">
      {/* LADO ESQUERDO: Imagem e Logo animada */}
      <div className="unifor-login-esquerda">
        <div className="unifor-bg-imagem"></div>
        <div className="unifor-bg-overlay"></div>
        
        <div className="unifor-conteudo-esquerda">
          <div className="unifor-logo-container animar-deslize-esquerda">
            
            {/* 2. Usando a imagem importada na tag src */}
            <img 
              src={logoUnifor} 
              alt="Logo Unifor" 
              className="unifor-logo-img"
            />
            
            <h1 className="unifor-logo-texto" style={{marginTop: '15px'}}>Projeto Resgatinhos</h1>
            <p className="unifor-sublogo">Sistema de Gestão de Felinos do Campus</p>
          </div>

          <div className="unifor-rodape-esquerda animar-deslize-esquerda atraso-1">
            <p>Universidade de Fortaleza | Administração do Projeto</p>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: Área do Formulário */}
      <div className="unifor-login-direita">
        <div className="unifor-pattern-direita"></div>

        <div className="unifor-card-login animar-entrada-suave">
          <div className="unifor-card-cabecalho">
            <div className="unifor-icone-escudo">🐾</div>
            <h2>Acesso Restrito</h2>
            <p>Painel administrativo para voluntários e gestão do projeto.</p>
          </div>

          <form onSubmit={fazerLogin} className="unifor-form">
            {erro && <div className="unifor-erro shake">{erro}</div>}
            
            <div className="unifor-input-group">
              <label>E-mail Institucional</label>
              <input 
                type="email" 
                name="email" 
                placeholder="nome@unifor.br"
                value={credenciais.email} 
                onChange={lidarMudanca} 
                required 
              />
            </div>
            
            <div className="unifor-input-group">
              <label>Senha de Administrador</label>
              <input 
                type="password" 
                name="senha" 
                placeholder="••••••••"
                value={credenciais.senha} 
                onChange={lidarMudanca} 
                required 
              />
            </div>

            <div className="unifor-form-opcoes">
              <label className="unifor-checkbox">
                <input type="checkbox" /> Manter conectado
              </label>
              <a href="#" className="unifor-link-esqueci">Esqueceu a senha?</a>
            </div>

            <button type="submit" className="unifor-btn-acessar" disabled={carregando}>
              {carregando ? <span className="unifor-spinner"></span> : 'Entrar no Painel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;