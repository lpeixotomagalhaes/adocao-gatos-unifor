import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { erro: null };
  }

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  componentDidCatch(erro, info) {
    console.error('ErrorBoundary:', erro, info);
  }

  render() {
    if (this.state.erro) {
      return (
        <div style={{
          padding: '32px',
          fontFamily: 'system-ui, sans-serif',
          color: '#0f172a',
          maxWidth: '900px',
          margin: '40px auto',
          background: '#fff',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}>
          <h1 style={{ color: '#dc2626', marginTop: 0 }}>⚠️ Erro na aplicação</h1>
          <p><strong>Mensagem:</strong> {this.state.erro.message}</p>
          <pre style={{
            background: '#fef2f2',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '12px',
            lineHeight: 1.5,
          }}>{this.state.erro.stack}</pre>
          <button onClick={() => window.location.reload()} style={{
            padding: '8px 16px',
            background: '#0f172a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '12px',
          }}>Recarregar</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
