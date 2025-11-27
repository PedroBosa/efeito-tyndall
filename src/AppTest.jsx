import './App.css';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>
        🧪 Teste Básico
      </h1>
      <p style={{ fontSize: '24px', color: '#94a3b8' }}>
        Se você está vendo isso, o React está funcionando!
      </p>
      <button 
        onClick={() => alert('Clicou!')}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Clique aqui
      </button>
    </div>
  );
}

export default App;
