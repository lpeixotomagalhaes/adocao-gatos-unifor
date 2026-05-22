import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminGatos.css';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { apiFetch } from '../api';

function AdminArquivados() {
  const [arquivados, setArquivados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navegarPara = useNavigate();

  useEffect(() => {
    const carregarArquivados = async () => {
      try {
        const resposta = await apiFetch('/api/gatos/arquivados');

        if (!resposta.ok) {
          if (resposta.status === 401 || resposta.status === 403) {
            localStorage.removeItem('tokenAdmin');
            navegarPara('/admin');
          }
          setArquivados([]);
          return;
        }

        const dados = await resposta.json();
        setArquivados(Array.isArray(dados) ? dados : []);

      } catch (erro) {
        console.error("Erro ao carregar gatos arquivados", erro);
        setArquivados([]);
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
