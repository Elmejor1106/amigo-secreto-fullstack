
import React, { useState } from 'react';

const Restrictions = ({ participants, restrictions, addRestriction, removeRestriction }) => {
  const [person1, setPerson1] = useState('');
  const [person2, setPerson2] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!person1 || !person2 || person1 === person2) {
      alert('Selecciona dos personas diferentes.');
      return;
    }
    addRestriction({ person1, person2 });
    setPerson1('');
    setPerson2('');
  };

  const getParticipantName = (id) => {
    const p = participants.find(p => p.id === id);
    return p ? p.name : 'N/A';
  };

  return (
    <div className="restrictions">
      <h3>Restricciones (No se regalan entre sí)</h3>
      <form onSubmit={handleSubmit} className="restriction-form">
        <select value={person1} onChange={(e) => setPerson1(e.target.value)} required>
          <option value="">Selecciona una persona</option>
          {participants.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <span>y</span>
        <select value={person2} onChange={(e) => setPerson2(e.target.value)} required>
          <option value="">Selecciona otra persona</option>
          {participants.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <button type="submit">Añadir Restricción</button>
      </form>

      <div className="restriction-list">
        <ul>
          {restrictions.map((r, index) => (
            <li key={index}>
              {getParticipantName(r.person1)} ↔ {getParticipantName(r.person2)}
              <button onClick={() => removeRestriction(index)} className="remove-btn">X</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Restrictions;
