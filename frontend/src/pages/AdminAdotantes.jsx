import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminGatos.css'; 
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

function AdminAdotantes() {
  const [adotantes, setAdotantes] = useState([]);
  const navegarPara = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    if (!token) return navegarPara('/admin');

    const carregarAdotantes = async () => {
      try {
        const resposta = await fetch('http://localhost:5000/api/formularios', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dados = await resposta.json();
        
        const apenasAprovados = dados.filter(form => form.statusAnalise === 'Aprovado');
        setAdotantes(apenasAprovados);
      } catch (erro) {
        console.error("Erro ao carregar adotantes", erro);
      }
    };
    carregarAdotantes();
  }, [navegarPara]);

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
              <tbody>
                {adotantes.map((adotante) => (
                  <tr key={adotante._id}>
                    <td className="col-nome">{adotante.nomeCandidato}</td>
                    <td>{adotante.telefone}</td>
                    <td><span className="info-secundaria">{adotante.vinculoUnifor}</span></td>
                    <td className="col-destaque">{adotante.gatoId ? adotante.gatoId.nome : 'Removido'}</td>
                  </tr>
                ))}
                {adotantes.length === 0 && (
                  <tr><td colSpan="4" className="nenhum-registro">Nenhuma adoção finalizada ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminAdotantes;