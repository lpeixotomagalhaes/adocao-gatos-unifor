import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário
    setErro('');

    try {
      // Fazendo a requisição para o nosso backend que acabamos de criar!
      const resposta = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // Se o login deu certo, guardamos o Token mágico no navegador
        localStorage.setItem('tokenAdmin', dados.token);
        
        // E mandamos o admin direto para a Dashboard
        navigate('/admin/dashboard');
      } else {
        // Se errou a senha ou email, mostra o erro
        setErro(dados.mensagem || 'Erro ao fazer login.');
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor. Verifique se o backend está rodando.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Área Administrativa</h2>
        <p>Acesso exclusivo para a equipe Resgatinhos Unifor.</p>
        
        {erro && <div className="mensagem-erro">{erro}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-grupo">
            <label>E-mail</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@unifor.br"
              required 
            />
          </div>

          <div className="input-grupo">
            <label>Senha</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="btn-login">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;