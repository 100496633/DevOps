import React, { useState } from 'react';

const buttons = [
  'C', 'DEL', '%', '/',
  '7', '8', '9', '*',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  '0', '.', '='
];

function safeEvaluate(expr) {
  if (!/^[0-9+\-*/%.() ]+$/.test(expr)) {
    throw new Error('Expresión inválida');
  }
  try {
    const transformed = expr.replace(/%/g, '/100');
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${transformed})`)();
  } catch (e) {
    throw new Error('Error al evaluar');
  }
}

export default function Calculator() {
  const [display, setDisplay] = useState('');

  function handleClick(value) {
    if (value === 'C') {
      setDisplay('');
      return;
    }
    if (value === 'DEL') {
      setDisplay((d) => d.slice(0, -1));
      return;
    }
    if (value === '=') {
      try {
        const result = safeEvaluate(display);
        setDisplay(String(result));
      } catch (e) {
        setDisplay('Error');
        setTimeout(() => setDisplay(''), 1200);
      }
      return;
    }
    setDisplay((d) => {
      if (/^[+\-*/.%]$/.test(value) && d === '') {
        return value === '-' ? '-' : d;
      }
      if (/^[+\-*/.%]$/.test(value) && /[+\-*/.%]$/.test(d)) {
        return d.slice(0, -1) + value;
      }
      return d + value;
    });
  }

  return (
    <div className="calculator">
      <div className="display" data-testid="display">{display || '0'}</div>
      <div className="buttons">
        {buttons.map((b) => (
          <button
            key={b}
            className={`btn ${b === '=' ? 'equals' : ''}`}
            onClick={() => handleClick(b)}
            type="button"
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
