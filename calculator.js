const calculator = document.querySelector(".calculator");
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
    calculator.appendChild(keypad);

}

function updateDisplay(value) {
    if (!value && value !== "") return;
    const display = document.querySelector(".display");
    display.textContent = value;
}

class Calculator {
    #leftOperand;
    #rightOperand;
    #operator;
    #funcs;

    constructor() {
        this.#leftOperand = "";
        this.#rightOperand = "";
        this.#operator = "";
        this.#funcs = {'+' :(x,y) => x+y,
                    '-': (x,y) => x-y,
                    '/': (x,y) => x/y,
                    '*': (x,y) => x*y
        }
    }


    /**
     * - If the left operand is empty, dovnothing and returns false.
     * - If both an operator and right operand already exist, it evaluates the current expression,
     *   sets the new operator, and returns the result.
     * - Otherwise, just sets the operator and returns true.
     *
     * @param {string} operator - The operator pressed ('+', '-', '*', '/').
     * @returns {boolean|string} False if no action is taken, true if the operator is simply set,
     *                           or the result of evaluation if an expression was completed.
     */
    onOperator(operator) {
        if (this.#leftOperand === "") return  false// Do nothing if empty

        
        if (this.operator !== "" && this.#rightOperand !== "") { // evaluate expr
            const result = this.onEvaluate();
            this.#operator = operator;
            return result;
        }

        this.#operator = operator;
        return true;
    }

    /**
     * Adds the pressed number or decimal point to the current operand (left or right),
     * depending on whether an operator has been set.
     * Prevents multiple decimal points in a single operand.
     * 
     * @param {string} number - The numeric character or decimal point pressed (e.g. "5", ".").
     * @returns {string|boolean} Returns the updated operand string on success,
     *                          or false if input is invalid (e.g., multiple decimals).
     */
    onNumericBtnPress(number) {
        console.log(number);
        const hasDecimalAlready = (operand) => number.includes('.') && operand.includes(number);
        const concatNumberToOperand = (operand) => operand.concat(number);

        if (this.#operator === "") {
            if (hasDecimalAlready(this.#leftOperand)) return false;
            this.#leftOperand = concatNumberToOperand(this.#leftOperand);
            return this.#leftOperand;
        }

        if (hasDecimalAlready(this.#rightOperand)) return false;
        this.#rightOperand = concatNumberToOperand(this.#rightOperand);
        return this.#rightOperand;
    }


    /**
     * Deletes the last character from the current operand.
     * 
     * If no operator is set (empty string), deletes from the left operand.
     * Otherwise, deletes from the right operand.
     * 
     * @returns {string} The updated operand after deletion.
     */
    onDelete() {
        console.log(this.#operator);
        const removeLastChar = (operand) => operand.slice(0, -1);
        if (this.#operator === "") {
            this.#leftOperand = removeLastChar(this.#leftOperand);
            return this.#leftOperand;
        } 

        this.#rightOperand = removeLastChar(this.#rightOperand);
        return this.#rightOperand;
    }

    /**
     *  Resets the calculator state to null
     */
    onAllClear() {
        this.#leftOperand = "";
        this.#rightOperand = "";
        this.#operator = "";
    }
    /**
     * Evaluates the current expression using the stored left operand,
     * right operand, and operator.
     * 
     * Returns the result of the operation if all required values are present,
     * otherwise returns false.
     * 
     * After evaluation, resets the right operand and operator.
     * 
     * Left operand becomes the result.
     * 
     * @returns {number|false} The result of the calculation, or false if evaluation
     *                        could not be performed due to missing operands/operator.
     */
    onEvaluate() {
        if (this.#leftOperand  === "" ||
            this.#rightOperand === "" ||
            this.#operator === ""
        ) return false;

        const rawResult = this.#funcs[this.#operator](parseFloat(this.#leftOperand), parseFloat(this.#rightOperand));
        const result = Number.isInteger(rawResult) ? rawResult.toString() : rawResult.toFixed(2);
        this.#leftOperand = result;
        this.#rightOperand = "";
        this.#operator = "";
        return result;
    }
}

const calculatorState = new Calculator();
initLayout();
//document.addEventListener('keydown', (event) => console.log(event.key))
