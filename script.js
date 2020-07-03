const opPrecedence = {
  '=': 0,
  '-': 1,
  '+': 1,
  '/': 2,
  '*': 2,
  '%': 3,
}

let firstOperand = null,
  secondOperand = null,
  thirdOperand = null,
  firstOperator = null,
  secondOperator = null,
  thirdOperator = null,
  result = null;
addedNumber = '',
  subScreenText = '';

const mainDisplay = document.querySelector('#result'),
  subDisplay = document.querySelector('#subdisplay')
numberBtns = document.querySelectorAll('.number'),
  operatorBtns = document.querySelectorAll('.operator'),
  clearBtn = document.querySelector('#clear'),
  delBtn = document.querySelector('#del'),
  dotBtn = document.querySelector('#dot');

numberBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    dotBtn.disabled = false;
    if (addedNumber.includes('.')) {
      dotBtn.disabled = true;
    }
    if (addedNumber.length < 7) {
      addedNumber += e.target.value;
      subScreenText += e.target.value;
    }
    subDisplay.textContent = subScreenText;
    mainDisplay.textContent = addedNumber;
  })
})

delBtn.addEventListener('click', function delLastNumber() {
  addedNumber = addedNumber.substr(0, addedNumber.length - 1);
  subScreenText = subScreenText.substr(0, subScreenText.length - 1);
  subDisplay.textContent = subScreenText;
  mainDisplay.textContent = addedNumber;
})

clearBtn.addEventListener('click', function clearAll() {
  firstOperand = null;
  secondOperand = null;
  thirdOperand = null;
  firstOperator = null;
  secondOperator = null;
  thirdOperator = null;
  addedNumber = '';
  subScreenText = '';
  subDisplay.textContent = subScreenText;
  mainDisplay.textContent = addedNumber;
})

operatorBtns.forEach(btn => {
  btn.addEventListener('click', function doCalculation(e) {
    let currentOperator = e.target.value;
    if (currentOperator === '%') {
      subScreenText += currentOperator + ' ';
    } else if (currentOperator !== '=') {
      subScreenText += ' ' + currentOperator + ' ';
    }

    subDisplay.textContent = subScreenText;

    let currentOperand = Number(addedNumber);
    if (!currentOperand) {
      return;
    }
    if (currentOperator === '%') {
      addedNumber = Number(addedNumber) / 100;
      return;
    }
    if (!firstOperator) {
      firstOperand = currentOperand;
      firstOperator = currentOperator;
      addedNumber = '';
    } else if (!secondOperator && currentOperand) {
      secondOperand = currentOperand;
      if (currentOperator === '=') {
        result = doMath(firstOperator, firstOperand, secondOperand);
        if (String(result).includes('.')) mainDisplay.textContent = String(result.toFixed(2));
        else mainDisplay.textContent = String(result);
        return;
      } else {
        secondOperator = currentOperator;
        if (opPrecedence[secondOperator] <= opPrecedence[firstOperator]) {
          firstOperand = doMath(firstOperator, firstOperand, secondOperand);
          firstOperator = secondOperator;
          secondOperand = null;
          secondOperator = null;
        }
        addedNumber = '';
      }
    } else if (!thirdOperator && currentOperand) {
      thirdOperand = currentOperand;
      if (currentOperator === '=') {
        secondOperand = doMath(secondOperator, secondOperand, thirdOperand);
        result = doMath(firstOperator, firstOperand, secondOperand);
        if (String(result).includes('.')) mainDisplay.textContent = String(result.toFixed(2));
        else mainDisplay.textContent = String(result);
        return;
      }
      thirdOperator = currentOperator;
      secondOperand = doMath(secondOperator, secondOperand, thirdOperand);
      if (opPrecedence[thirdOperand] < opPrecedence[secondOperand]) {
        firstOperand = doMath(firstOperator, firstOperand, secondOperand);
        firstOperator = thirdOperator;
        secondOperand = null;
        secondOperator = null;
      } else {
        secondOperator = thirdOperator;
      }
      thirdOperand = null;
      thirdOperator = null;
      addedNumber = '';
    }
  })
})

function doMath(operator, a, b) {
  if (operator === '+') return a + b;
  if (operator === '-') return a - b;
  if (operator === '*') return a * b;
  if (operator === '/') return a / b;
}