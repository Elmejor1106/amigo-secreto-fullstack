
import React from 'react';

const Settings = ({ budget, setBudget, exchangeDate, setExchangeDate, message, setMessage }) => {
  return (
    <div className="settings">
      <h3>Detalles del Evento</h3>
      <div className="setting-item">
        <label>Presupuesto Sugerido (€)</label>
        <input 
          type="text" 
          placeholder="Ej: 20€" 
          value={budget} 
          onChange={(e) => setBudget(e.target.value)} 
        />
      </div>
      <div className="setting-item">
        <label>Fecha del Intercambio</label>
        <input 
          type="date" 
          value={exchangeDate} 
          onChange={(e) => setExchangeDate(e.target.value)} 
        />
      </div>
      <div className="setting-item">
        <label>Mensaje para el Correo</label>
        <textarea 
          placeholder="Ej: ¡Nos vemos en la fiesta!" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
        />
      </div>
    </div>
  );
};

export default Settings;
