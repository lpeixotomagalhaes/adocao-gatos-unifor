import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtecaoRota from './components/ProtecaoRota';

import Home from './pages/Home';
import Adote from './pages/Adote';
import Contato from './pages/Contato';
import PerfilGato from './pages/PerfilGato';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminGatos from './pages/AdminGatos';
import AdminSolicitacoes from './pages/AdminSolicitacoes';
import AdminAdotantes from './pages/AdminAdotantes';
import AdminPerfil from './pages/AdminPerfil';
import AdminArquivados from './pages/AdminArquivados';
import AdminHistorico from './pages/AdminHistorico';

function App() {
  const location = useLocation();
  const ehAreaAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!ehAreaAdmin && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adote" element={<Adote />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/gato/:id" element={<PerfilGato />} />

        <Route path="/admin" element={<AdminLogin />}/>

        <Route path="/admin/dashboard" element={<ProtecaoRota><AdminDashboard /></ProtecaoRota>} />
        <Route path="/admin/gatos" element={<ProtecaoRota><AdminGatos /></ProtecaoRota>} />
        <Route path="/admin/solicitacoes" element={<ProtecaoRota><AdminSolicitacoes /></ProtecaoRota>} />
        <Route path="/admin/adotantes" element={<ProtecaoRota><AdminAdotantes /></ProtecaoRota>} />
        <Route path="/admin/perfil" element={<ProtecaoRota><AdminPerfil /></ProtecaoRota>} />
        <Route path="/admin/arquivados" element={<ProtecaoRota><AdminArquivados /></ProtecaoRota>} />
        <Route path="/admin/historico" element={<ProtecaoRota><AdminHistorico /></ProtecaoRota>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!ehAreaAdmin && <Footer />}

      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{ style: { fontFamily: 'var(--font-sans)' } }}
      />
    </>
  );
}

export default App;
