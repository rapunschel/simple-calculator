export class Calculator {
    #leftOperand;
    #rightOperand;
    #operator;
    #funcs;
    #hasSecondOperator;
    constructor() {
        this.#hasSecondOperator = false;
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
     * - If the left operand is empty, do nothing
     * 
     * - If both an operator and right operand already exist, it evaluates the current expression,
     *   sets the new operator, and store result in leftoperand
     * 
     * - Otherwise, just sets the operator 
     */
    onOperator(operator) {
        if (this.#leftOperand === "") return;// Do nothing if empty

        if (this.#operator !== "" && this.#rightOperand !== "") { // evaluate expr
            this.onEvaluate();
            this.#hasSecondOperator = true;
        }
        this.#operator = operator;
    }

    /**
     * Adds the pressed number or decimal point to the current operand (left or right),
     * depending on whether an operator has been set.
     * Prevents multiple decimal points in a single operand.
     */
    onNumericBtnPress(number) {
        const hasDecimalAlready = (operand) => number === '.' && operand.includes('.');
        const concatNumberToOperand = (operand) => operand.concat(number);

        if (this.#operator === "") {
            if (!hasDecimalAlready(this.#leftOperand)) this.#leftOperand = concatNumberToOperand(this.#leftOperand);

            return;
        }

        if (!hasDecimalAlready(this.#rightOperand)) this.#rightOperand = concatNumberToOperand(this.#rightOperand);
    }


    /**
     * Deletes the last character from the current operand.
     * 
     * If no operator is set (empty string), deletes from the left operand.
     * Otherwise, deletes from the right operand.
     */
    onDelete() {
        const removeLastChar = (operand) => operand.slice(0, -1);
        if (this.#operator === "") {
            this.#leftOperand = removeLastChar(this.#leftOperand);
            return;
        } 
        this.#rightOperand = removeLastChar(this.#rightOperand);
    }

    onAllClear() {
        this.#leftOperand = "";
        this.#rightOperand = "";
        this.#operator = "";
    }

    /**
     * Evaluates the current expression using the stored left operand,
     * right operand, and operator.
     * 
     * After evaluation, resets the right operand and operator.
     * 
     * Left operand becomes the result.
     */
    onEvaluate() {
        if (this.#leftOperand  === "" ||
            this.#rightOperand === "" ||
            this.#operator === ""
        ) return;

        const rawResult = this.#funcs[this.#operator](parseFloat(this.#leftOperand), parseFloat(this.#rightOperand));
        const result = Number.isInteger(rawResult) ? rawResult.toString() : rawResult.toFixed(2);
        this.#leftOperand = result;
        this.#rightOperand = "";
        this.#operator = "";
    }


    getDisplayValue() {

        if (this.#hasSecondOperator) {
            this.#hasSecondOperator = false;
            return this.#leftOperand
        }

        if (this.#rightOperand !== "") {
            return this.#rightOperand;
        }
    
        // If operator is set but rightOperand is empty, show nothing (after pressing operator)
        if (this.#operator !== "") {
            return ""
        }
        // Default to showing the leftOperand or 0
        return this.#leftOperand || "0";
    }
}

