import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import './AdminGatos.css';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import EmptyState from '../components/EmptyState';
import { SkeletonTable } from '../components/Skeleton';
import { apiFetch } from '../api';

function AdminAdotantes() {
  const [adotantes, setAdotantes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarAdotantes = async () => {
      try {
        const resposta = await apiFetch('/api/formularios');
        const dados = await resposta.json();
        const apenasAprovados = Array.isArray(dados)
          ? dados.filter(form => form.statusAnalise === 'Aprovado')
          : [];
        setAdotantes(apenasAprovados);
      } catch (erro) {
        console.error("Erro ao carregar adotantes", erro);
      } finally {
        setCarregando(false);
      }
    };
    carregarAdotantes();
  }, []);

  return (
    <div className="loca-dashboard-container">
      <AdminSidebar />
      <main className="loca-main-content">
        <AdminHeader />
        <div className="dashboard-content animar-subida atraso-1">
          <div className="page-header">
            <div>
              <h1 className="page-title">Histórico de Adotantes</h1>
              <p className="page-subtitle">Lista de adoções aprovadas para acompanhamento.</p>
            </div>
          </div>

          <div className="tabela-container">
            <table className="loca-tabela">
              <thead>
                <tr>
                  <th>Nome do Adotante</th><th>Contato</th><th>Vínculo</th><th>Gato Adotado</th>
                </tr>
              </thead>
              {carregando ? (
                <SkeletonTable linhas={4} colunas={4} />
              ) : adotantes.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="4">
                      <EmptyState
                        icone={Heart}
                        titulo="Nenhuma adoção finalizada"
                        descricao="Adoções aprovadas no painel de solicitações aparecerão aqui."
                      />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {adotantes.map((adotante) => (
                    <tr key={adotante._id}>
                      <td className="col-nome"><div className="cell-titulo">{adotante.nomeCandidato}</div></td>
                      <td>{adotante.telefone}</td>
                      <td><span className="info-secundaria">{adotante.vinculoUnifor}</span></td>
                      <td className="col-destaque">{adotante.gatoId ? adotante.gatoId.nome : 'Removido'}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminAdotantes;
