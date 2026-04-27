import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Adote from './pages/Adote';
import Contato from './pages/Contato';
import PerfilGato from './pages/PerfilGato'; // <-- Adicione isso!

function App() {
  return (
    <>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adote" element={<Adote />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/gato/:id" element={<PerfilGato />} /> {/* <-- E adicione isso! */}
      </Routes>

      <Footer />
    </>
  );
}

export default App;