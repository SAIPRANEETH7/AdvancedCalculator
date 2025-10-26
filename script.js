const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const history = document.getElementById('history');
const themeBtn = document.getElementById('theme-btn');
const sciToggle = document.getElementById('sci-toggle');
const sciButtonsContainer = document.querySelector('.scientific-buttons');
const sciButtons = document.querySelectorAll('.sci');

let currentInput = '';
let historyValue = '';
let darkMode = true;
let sciMode = false;

/* NORMAL BUTTONS */
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');

    if (!button.classList.contains('sci')) {
      button.classList.add('active');
      setTimeout(() => button.classList.remove('active'), 120);
    }

    if (value === 'C') { currentInput = ''; display.value=''; history.textContent=''; return; }
    if (value === 'DEL') { currentInput=currentInput.slice(0,-1); display.value=currentInput; return; }

    if (value === '=') {
      try {
        const sanitized = currentInput.replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-');
        const evalResult = Function('"use strict";return (' + sanitized + ')')();
        historyValue = currentInput + ' =';
        currentInput = (evalResult===undefined)?'':evalResult.toString();
        display.value = currentInput;
        history.textContent = historyValue;
      } catch { display.value='Error'; currentInput=''; }
      return;
    }

    currentInput += value;
    display.value = currentInput;
  });
});

/* THEME TOGGLE */
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  darkMode = !darkMode;
  themeBtn.textContent = darkMode ? '🌙' : '☀️';
});

/* SCIENTIFIC MODE TOGGLE */
sciToggle.addEventListener('click', () => {
  sciMode = !sciMode;
  if(sciMode){ sciButtonsContainer.classList.remove('hidden'); sciButtonsContainer.setAttribute('aria-hidden','false'); sciToggle.textContent='Normal Mode'; }
  else{ sciButtonsContainer.classList.add('hidden'); sciButtonsContainer.setAttribute('aria-hidden','true'); sciToggle.textContent='Scientific Mode'; }
});

/* SCIENTIFIC BUTTONS */
sciButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const func = btn.getAttribute('data-func');
    let inputStr = currentInput.trim()===''?'0':currentInput;
    let num;

    try { num = Function('"use strict";return ('+inputStr+')')(); }
    catch { display.value='Error'; currentInput=''; return; }

    let result = null;

    switch(func){
      case 'sin': result=Math.sin(num*Math.PI/180); break;
      case 'cos': result=Math.cos(num*Math.PI/180); break;
      case 'tan': result=Math.tan(num*Math.PI/180); break;
      case 'log': if(num<=0){display.value='Error';currentInput='';return;} result=Math.log10(num); break;
      case 'sqrt': if(num<0){display.value='Error';currentInput='';return;} result=Math.sqrt(num); break;
      case 'pi': currentInput+=Math.PI.toString(); display.value=currentInput; return;
      case 'e': currentInput+=Math.E.toString(); display.value=currentInput; return;
      case 'pow': currentInput+='**'; display.value=currentInput; return;
    }

    if(result!==null){
      const rounded=Number.isFinite(result)?+result.toFixed(12):result;
      display.value=rounded.toString();
      history.textContent=`${func}(${num}) =`;
      currentInput=rounded.toString();
    }
  });
});
