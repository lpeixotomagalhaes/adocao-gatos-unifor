import React from 'react';
import './Contato.css';

const Contato = () => {
  return (
    <main className="contato-container">
      <section className="contato-header">
        <h1>Fale Conosco</h1>
        <p>Tem alguma dúvida sobre o processo de adoção? Entre em contato com a gente!</p>
      </section>

      <section className="contato-content">
        <form className="contato-form">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input type="text" id="nome" placeholder="Digite seu nome" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail Acadêmico ou Pessoal</label>
            <input type="email" id="email" placeholder="exemplo@unifor.br" required />
          </div>

          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp / Telefone</label>
            <input type="tel" id="whatsapp" placeholder="(85) 99999-9999" />
          </div>

          <div className="form-group">
            <label htmlFor="mensagem">Como podemos te ajudar?</label>
            <textarea id="mensagem" rows="5" placeholder="Escreva sua mensagem aqui..." required></textarea>
          </div>

          <button type="submit" className="btn-enviar">Enviar Mensagem</button>
        </form>

        <div className="contato-info">
          <h3>Informações Úteis</h3>
          <p><strong>📍 Localização:</strong> Bloco M - Medicina Veterinária Unifor</p>
          <p><strong>⏰ Horário de Atendimento:</strong> Segunda a Sexta, 08h às 18h</p>
          <p><strong>📧 E-mail:</strong> veterinaria@unifor.br</p>
        </div>
      </section>
    </main>
  );
};

export default Contato;