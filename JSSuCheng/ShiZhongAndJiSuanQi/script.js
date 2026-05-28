var clock = document.getElementById("clock");
setInterval(function () {
    var now = new Date();
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');
    clock.textContent = hours + ':' + minutes + ':' + seconds;
}, 1000);

var display = document.getElementById("display");
var currentInput = "0";
var previousInput = "";
var operation = "";
var waitingForOperand = false;

function appendNumber(number) {
    if (waitingForOperand) {
        currentInput = number;
        waitingForOperand = false;
    } else {
        currentInput = currentInput === "0" ? number : currentInput + number;
    }
    updateDisplay();
}

function appendOperator(op) {
    var inputValue = parseFloat(currentInput);
    if (previousInput === "") {
        previousInput = currentInput;
    } else if (operation) {
        var result = calculateOperation();
        currentInput = String(result);
        previousInput = result;
    }
    waitingForOperand = true;
    operation = op;
    updateDisplay();
}

function calculateOperation() {
    var prev = parseFloat(previousInput);
    var current = parseFloat(currentInput);
    var result = 0;
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
    }
    return result;
}

function calculate() {
    if (operation && previousInput !== "") {
        var result = calculateOperation();
        currentInput = String(result);
        previousInput = "";
        operation = "";
        waitingForOperand = true;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = "0";
    previousInput = "";
    operation = "";
    waitingForOperand = false;
    updateDisplay();
}

function updateDisplay() {
    display.textContent = currentInput;
}