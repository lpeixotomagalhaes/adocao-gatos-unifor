import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Faltava importar o useNavigate!
import './AdminGatos.css'; 
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

function AdminArquivados() {
  const [arquivados, setArquivados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navegarPara = useNavigate(); // Agora podemos redirecionar se der erro

  useEffect(() => {
    const carregarArquivados = async () => {
      try {
        const token = localStorage.getItem('tokenAdmin');
        const resposta = await fetch('http://localhost:5000/api/gatos/arquivados', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // TRAVA 1: Se o servidor der erro (ex: Token expirado), desloga e vai pro login
        if (!resposta.ok) {
          if (resposta.status === 401 || resposta.status === 403) {
            localStorage.removeItem('tokenAdmin');
            navegarPara('/admin');
          }
          setArquivados([]);
          return;
        }

        const dados = await resposta.json();
        
        // TRAVA 2: Só salva se for realmente uma lista, senão salva lista vazia
        setArquivados(Array.isArray(dados) ? dados : []);

      } catch (erro) {
        console.error("Erro ao carregar gatos arquivados", erro);
        setArquivados([]); // Evita tela branca se o backend cair
      } finally {
        setCarregando(false);
      }
    };
    
    carregarArquivados();
  }, [navegarPara]);

  return (
    <div className="loca-dashboard-container">
      <AdminSidebar />
      <main className="loca-main-content">
        <AdminHeader />
        <div className="dashboard-content animar-subida atraso-1">
          <div className="page-header">
            <div>
              <h1 className="page-title">Arquivados</h1>
              <p className="page-subtitle">Gatos removidos do sistema por óbito, fuga ou transferência.</p>
            </div>
          </div>

          <div className="tabela-container">
            {carregando ? (
              <p className="loading-text">Buscando registros...</p>
            ) : (
              <table className="loca-tabela">
                <thead>
                  <tr>
                    <th>Gato</th>
                    <th>Motivo Principal</th>
                    <th>Justificativa / Detalhes</th>
                    <th>Arquivado Por</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {arquivados.map((gato) => (
                    <tr key={gato._id}>
                      <td className="col-nome">{gato.nome}</td>
                      <td>
                        <span className="badge status-reprovado" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                          {gato.motivoArquivamento || 'Não informado'}
                        </span>
                      </td>
                      <td><span className="info-secundaria">{gato.justificativaArquivamento || 'Sem detalhes'}</span></td>
                      <td><span className="info-secundaria">{gato.arquivadoPor || 'Desconhecido'}</span></td>
                      <td>{gato.dataArquivamento ? new Date(gato.dataArquivamento).toLocaleDateString('pt-BR') : '-'}</td>
                    </tr>
                  ))}
                  {arquivados.length === 0 && (
                    <tr><td colSpan="5" className="nenhum-registro">Nenhum gato nos arquivados.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminArquivados;