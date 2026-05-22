import React, { useEffect, useState } from 'react';
import './Contato.css';

const Contato = () => {
  const [dados, setDados] = useState({ nome: '', email: '', whatsapp: '', mensagem: '' });

  useEffect(() => {
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mostrar');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.esconder');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => setDados({ ...dados, [e.target.id]: e.target.value });

  const enviarPorEmail = (e) => {
    e.preventDefault();
    const assunto = encodeURIComponent(`Contato site Resgatinhos — ${dados.nome}`);
    const corpo = encodeURIComponent(
      `Nome: ${dados.nome}\nE-mail: ${dados.email}\nWhatsApp: ${dados.whatsapp}\n\nMensagem:\n${dados.mensagem}`
    );
    window.location.href = `mailto:veterinaria@unifor.br?subject=${assunto}&body=${corpo}`;
  };

  return (
    <main className="contato-container">
      <section className="contato-header esconder">
        <h1>Fale Conosco</h1>
        <p>Tem alguma dúvida sobre o processo de adoção? Entre em contato com a gente!</p>
      </section>

      <section className="contato-content">
        <form className="contato-form esconder atraso-1" onSubmit={enviarPorEmail}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input type="text" id="nome" placeholder="Digite seu nome" value={dados.nome} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail Acadêmico ou Pessoal</label>
            <input type="email" id="email" placeholder="exemplo@unifor.br" value={dados.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp / Telefone</label>
            <input type="tel" id="whatsapp" placeholder="(85) 99999-9999" value={dados.whatsapp} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="mensagem">Como podemos te ajudar?</label>
            <textarea id="mensagem" rows="5" placeholder="Escreva sua mensagem aqui..." value={dados.mensagem} onChange={handleChange} required></textarea>
          </div>

          <button type="submit" className="btn-enviar">Enviar Mensagem</button>
        </form>

        <div className="contato-info esconder atraso-2">
          <h3>Informações Úteis</h3>
          <p><strong>📍 Localização:</strong> Bloco M - Medicina Veterinária Unifor</p>
          <p><strong>⏰ Atendimento:</strong> Segunda a Sexta, 08h às 18h</p>
          <p><strong>📧 E-mail:</strong> veterinaria@unifor.br</p>
        </div>
      </section>
    </main>
  );
};

export default Contato;
