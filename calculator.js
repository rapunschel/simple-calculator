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
                return;
            }
            button.classList.add("num-btn");
        })
    })
    calculator.appendChild(keypad);

}

console.log(calculator);
initLayout();