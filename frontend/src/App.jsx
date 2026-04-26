import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Importando as Páginas
import Home from './pages/Home';
import Adote from './pages/Adote';
import Contato from './pages/Contato';

function App() {
  return (
    <>
      <Navbar />
      
      {/* Aqui é onde a mágica das páginas acontece */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adote" element={<Adote />} />
        <Route path="/contato" element={<Contato />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;