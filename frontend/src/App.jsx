import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
import AdotarForm from './pages/AdotarForm';

function App() {
  const location = useLocation();
  
  // Verifica se a URL atual começa com "/admin"
  const ehAreaAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Se NÃO for a área admin, mostra o Navbar */}
      {!ehAreaAdmin && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adote" element={<Adote />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/gato/:id" element={<PerfilGato />} /> 
        
        
        <Route path="/admin" element={<AdminLogin />}/> 
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/gatos" element={<AdminGatos />} />
        <Route path="/admin/solicitacoes" element={<AdminSolicitacoes />} />
        <Route path="/admin/adotantes" element={<AdminAdotantes />} />
        <Route path="/admin/perfil" element={<AdminPerfil />} />
        <Route path="/adotar/:id" element={<AdotarForm />} />
      </Routes>

      {/* Se NÃO for a área admin, mostra o Footer */}
      {!ehAreaAdmin && <Footer />}
    </>
  );
}

export default App;