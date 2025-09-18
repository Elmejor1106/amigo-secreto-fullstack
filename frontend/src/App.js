
import React, { useState, useEffect } from 'react';
import './App.css';
import Restrictions from './Restrictions';
import Settings from './Settings';

// --- Componentes (se crearán en archivos separados más adelante) ---

const ParticipantForm = ({ addParticipant }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    addParticipant({ id: Date.now(), name, email });
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="participant-form">
      <h3>Añadir Participante</h3>
      <input 
        type="text" 
        placeholder="Nombre" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      />
      <input 
        type="email" 
        placeholder="Correo Electrónico" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <button type="submit">Agregar</button>
    </form>
  );
};

const ParticipantList = ({ participants, removeParticipant }) => (
  <div className="participant-list">
    <h3>Participantes ({participants.length})</h3>
    <ul>
      {participants.map(p => (
        <li key={p.id}>
          {p.name} ({p.email})
          <button onClick={() => removeParticipant(p.id)} className="remove-btn">X</button>
        </li>
      ))}
    </ul>
  </div>
);

// --- Componente Principal ---

function App() {
  const [participants, setParticipants] = useState([]);
  const [restrictions, setRestrictions] = useState([]);
  const [budget, setBudget] = useState('');
  const [exchangeDate, setExchangeDate] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Cargar datos de localStorage al iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('secretSantaData');
    if (savedData) {
      const { participants, restrictions, budget, exchangeDate, message } = JSON.parse(savedData);
      setParticipants(participants || []);
      setRestrictions(restrictions || []);
      setBudget(budget || '');
      setExchangeDate(exchangeDate || '');
      setMessage(message || '');
    }
  }, []);

  // Guardar datos en localStorage cada vez que cambien
  useEffect(() => {
    const dataToSave = { participants, restrictions, budget, exchangeDate, message };
    localStorage.setItem('secretSantaData', JSON.stringify(dataToSave));
  }, [participants, restrictions, budget, exchangeDate, message]);

  const addParticipant = (participant) => {
    setParticipants([...participants, participant]);
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
    // También eliminar restricciones asociadas a este participante
    setRestrictions(restrictions.filter(r => r.person1 !== id && r.person2 !== id));
  };

  const addRestriction = (restriction) => {
    // Evitar duplicados
    const exists = restrictions.some(r => 
      (r.person1 === restriction.person1 && r.person2 === restriction.person2) ||
      (r.person1 === restriction.person2 && r.person2 === restriction.person1)
    );
    if (!exists) {
      setRestrictions([...restrictions, restriction]);
    }
  };

  const removeRestriction = (index) => {
    setRestrictions(restrictions.filter((_, i) => i !== index));
  };

  const handleDraw = async () => {
    if (participants.length < 2) {
      alert('Se necesitan al menos 2 participantes para el sorteo.');
      return;
    }
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants, restrictions, budget, exchangeDate, message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error en el servidor.');
      }

      setResult({ success: true, message: data.message });
      // Opcional: limpiar el estado después de un sorteo exitoso
      // setParticipants([]);
      // setRestrictions([]);

    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Amigo Secreto Online</h1>
      </header>
      <main>
        <div className="main-container">
          <div className="left-panel">
            <ParticipantForm addParticipant={addParticipant} />
            <ParticipantList participants={participants} removeParticipant={removeParticipant} />
          </div>
          <div className="right-panel">
            <Restrictions 
              participants={participants} 
              restrictions={restrictions} 
              addRestriction={addRestriction} 
              removeRestriction={removeRestriction} 
            />
          </div>
        </div>
        
        <div className="draw-section">
          <Settings 
            budget={budget} setBudget={setBudget}
            exchangeDate={exchangeDate} setExchangeDate={setExchangeDate}
            message={message} setMessage={setMessage}
          />
          <button onClick={handleDraw} disabled={isLoading} className="draw-button">
            {isLoading ? 'Realizando Sorteo...' : '¡Realizar Sorteo y Enviar Correos!'}
          </button>
          {result && (
            <div className={`result-message ${result.success ? 'success' : 'error'}`}>
              {result.message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
