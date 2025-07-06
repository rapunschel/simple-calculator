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

    const onButtonPresses = {
        onACPress : (_) => {
            calculatorState.onAllClear();
            updateDisplay(" ");
        },

        onDELPress: (_) => {
                        
            updateDisplay(calculatorState.onDelete());
        },

        onOperatorPress: (event) => {
            const operator = event.target.textContent;
            if (operator === '=') {
                updateDisplay(calculatorState.onEvaluate());
                return;
            }
            
            const value = calculatorState.onOperator(event.target.textContent);
            typeof value === 'string' ? updateDisplay(value) : updateDisplay(" ")

        },

        onNumericPress: (event) => {
            updateDisplay(calculatorState.onNumericBtnPress(event.target.textContent));
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
                    button.classList.add("undo-btn");  
                    button.addEventListener('click', onButtonPresses.onACPress)
                }

                else if(btn === 'DEL') {
                    button.addEventListener('click', onButtonPresses.onDELPress)
                }

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


function updateDisplay(value) {
    if (!value && value !== "") return;
    const display = document.querySelector(".display");
    display.textContent = value;
}



const calculatorState = new Calculator();
initLayout();

//document.addEventListener('keydown', (event) => console.log(event.key))
