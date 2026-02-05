const displayEl = document.getElementById('display');
const keys = document.querySelector('.keys');

let expression = ''; // internal expression string

const operators = ['+', '-', '*', '/', '%'];

function updateDisplay() {
  displayEl.textContent = expression === '' ? '0' : expression;
}

function appendValue(val) {
  const last = expression.slice(-1);

  // prevent two operators in a row: replace last operator if user enters another operator
  if (operators.includes(val)) {
    if (expression === '' && val !== '-') return; // don't start with + * / %
    if (operators.includes(last)) {
      expression = expression.slice(0, -1) + val;
      updateDisplay();
      return;
    }
  }

  // prevent multiple decimals in one number
  if (val === '.') {
    // find last operator to isolate current number
    const parts = expression.split(/[\+\-\*\/\%]/);
    const current = parts[parts.length - 1];
    if (current.includes('.')) return;
    if (current === '') expression += '0'; // start number with 0.
  }

  expression += val;
  updateDisplay();
}

function clearAll() {
  expression = '';
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  if (!expression) return;
  // sanitize trailing operator
  while (operators.includes(expression.slice(-1))) {
    expression = expression.slice(0, -1);
  }
  try {
    const result = Function('"use strict"; return (' + expression + ')')();
    expression = String(result);
  } catch (e) {
    expression = 'Error';
  }
  updateDisplay();
}

// handle button clicks
keys.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  if (action === 'clear') clearAll();
  else if (action === 'delete') deleteLast();
  else if (action === 'equals') calculate();
  else if (value) appendValue(value);
});

// keyboard support
window.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculate(); return; }
  if (e.key === 'Backspace') { e.preventDefault(); deleteLast(); return; }
  if (e.key === 'Escape') { e.preventDefault(); clearAll(); return; }

  const allowed = '0123456789.+-*/%';
  if (allowed.includes(e.key)) {
    e.preventDefault();
    appendValue(e.key);
  }
});

// initialize
updateDisplay();
