import {Calculator} from './calculator.js';

const calculatorDiv = document.querySelector(".calculator");
function initLayout() {
    let layout = [ ["", "", "AC", "DEL"],
                    [7,8,9, '/'],
                    [4,5,6,'*'], 
                    [1,2,3, '-'],
                    ['.',0, '=', '+']];
    const operators = "/+-*=".split('');
    const undoOperators = "AC DEL".split(' ');
    const numericalValues = "0123456789".split('');

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        const customEvent = {target: {textContent: key}}
        if (numericalValues.includes(key)) onButtonPresses.onNumericPress(customEvent);
        else if (operators.includes(key) || key === "Enter")  onButtonPresses.onOperatorPress(customEvent);
        else if (key === "Backspace")      onButtonPresses.onDELPress(_);
    })

    
    const onButtonPresses = {
        onACPress : (_) => {
            calculatorState.onAllClear();
            updateDisplay();
        },

        onDELPress: (_) => {
            calculatorState.onDelete() 
            updateDisplay();
        },

        onOperatorPress: (event) => {
            const operator = event.target.textContent;
            if (operator === '=') {
                calculatorState.onEvaluate()
                updateDisplay();
                return;
            }
            
            calculatorState.onOperator(event.target.textContent);
            updateDisplay();

        },

        onNumericPress: (event) => {
            calculatorState.onNumeric(event.target.textContent)
            updateDisplay();
        }

    }


    let keypad = document.createElement("div"); // Wrapper for btn-rows
    keypad.className = "calc-keypad"
    layout.forEach((row) => {

        let buttons = document.createElement("div");
        buttons.className = "calc-row";
        keypad.appendChild(buttons);

        row.forEach((btn) => {
            let button = document.createElement("button");
            button.className = "calc-btn"
            button.textContent = btn;
            buttons.appendChild(button);
            
            if (btn === "") {
                button.style.visibility = "hidden";
                return
            }
            if (undoOperators.includes(btn)) {
                if (btn === "AC") {
                    button.addEventListener('click', onButtonPresses.onACPress)
                }

                else if(btn === 'DEL') {
                    button.addEventListener('click', onButtonPresses.onDELPress)
                }
                button.classList.add("undo-btn");  

                return;
            }
            if (operators.includes(btn)) {
                button.classList.add("op-btn");

                button.addEventListener('click', onButtonPresses.onOperatorPress)
                return;
            }
            button.classList.add("num-btn");
            button.addEventListener('click', onButtonPresses.onNumericPress)
        })
    })
    calculatorDiv.appendChild(keypad);

}


function updateDisplay() {
    const display = document.querySelector(".display");
    display.textContent = calculatorState.getDisplayValue();
}

const calculatorState = new Calculator();
initLayout();