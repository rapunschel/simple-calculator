const calculator = document.querySelector(".calculator");
function initLayout() {
    let layout = [ ["", "", "AC", "DEL"],
                    [7,8,9, '/'],
                    [4,5,6,'*'], 
                    [1,2,3, '-'],
                    ['.',0, '=', '+']];
    const operators = "/+-*=".split('');
    const undoOperators = "AC DEL".split(' ');
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
                button.classList.add("undo-btn");
                return;
            }
            if (operators.includes(btn)) {
                button.classList.add("op-btn");

                button.addEventListener('click', (event) => {
                    const operator = event.target.textContent;
                    if (operator === '=') {
                        // TODO update display if result
                        console.log("evaluating")
                        calculatorState.onEvaluate();
                        return;
                    }
                    calculatorState.onOperator(event.target.textContent)

                })
                return;
            }
            button.classList.add("num-btn");
            button.addEventListener('click', (event) => {
                calculatorState.onNumericBtnPress(event.target.textContent);
            })
        })
    })
    calculator.appendChild(keypad);

}

function updateDisplay(value) {
    if (!value) return;
    const display = document.querySelector(".display");
    display.textContent = value;
}

class Calculator {
    #leftOperand;
    #rightOperand;
    #operator;
    #funcs;

    constructor() {
        this.#leftOperand = null;
        this.#rightOperand = null;
        this.#operator = null;
        this.#funcs = {'+' :(x,y) => x+y,
                    '-': (x,y) => x-y,
                    '/': (x,y) => x/y,
                    '*': (x,y) => x*y
        }
    }


    /**
     * Handles operator button press input.
     * Sets the operator if the left operand is already defined.
     * 
     * @param {string} operator - The operator pressed (e.g. "+", "-", "*", "/").
     * @returns {boolean} Returns true if operator was set successfully,
     *                    or false if left operand is not yet defined (operator ignored).
     */
    onOperator(operator) {
        if (this.#leftOperand === null) return  false// Do nothing
        this.#operator = operator;
        console.log(this.#operator);
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
        const hasDecimalAlready = (operand) => operand !== null && number.includes('.') && operand.includes(number);
        const concatNumberToOperand = (operand) => operand === null ? "".concat(number) : operand.concat(number);

        if (this.#operator === null) {
            if (hasDecimalAlready(this.#leftOperand)) return false;
            this.#leftOperand = concatNumberToOperand(this.#leftOperand);
            console.log(this.#leftOperand);
            return this.#leftOperand;
        }

        if (hasDecimalAlready(this.#rightOperand)) return false;
        this.#rightOperand = concatNumberToOperand(this.#rightOperand);
        console.log(this.#rightOperand);
        return this.#rightOperand;
    }

    /**
     * Evaluates the current expression using the stored left operand,
     * right operand, and operator.
     * 
     * Returns the result of the operation if all required values are present,
     * otherwise returns false.
     * 
     * After evaluation, resets the operands and operator to null.
     * 
     * @returns {number|false} The result of the calculation, or false if evaluation
     *                        could not be performed due to missing operands/operator.
     */
    onEvaluate() {
        if (this.#leftOperand  === null ||
            this.#rightOperand === null ||
            this.#operator === null
        ) return false;

        const result = this.#funcs[this.#operator](parseFloat(this.#leftOperand), parseFloat(this.#rightOperand)).toFixed(2).toString();
        console.log(result);
        this.#leftOperand = null;
        this.#rightOperand = null;
        this.#operator = null;
        return result;
    }
}

console.log(calculator);
const calculatorState = new Calculator();


//document.addEventListener('keydown', (event) => console.log(event.key))
initLayout();
