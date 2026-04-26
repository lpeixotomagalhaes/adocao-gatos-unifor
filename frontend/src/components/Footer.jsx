import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--unifor-blue-dark)',
      color: 'white',
      padding: '40px 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0' }}>🐾 Resgatinhos Unifor</h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>Adoção responsável de gatinhos.</p>
        <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#ccc' }}>E-mail: veterinaria@unifor.br</p>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Sobre Nós</Link>
        <Link to="/adote" style={{ color: 'white', textDecoration: 'none' }}>Adote</Link>
        <Link to="/contato" style={{ color: 'white', textDecoration: 'none' }}>Contato</Link>
      </div>

      <div>
        <p style={{ fontSize: '0.8rem', color: '#ccc' }}>© 2026 Resgatinhos Unifor. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
