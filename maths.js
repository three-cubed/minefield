
function generateNumber(min_inclusive, max_inclusive) {
    return Math.floor(Math.random() * (max_inclusive - min_inclusive + 1)) + min_inclusive;
}

function generate2numbers(min_X, max_X, min_Y, max_Y) {
    return [generateNumber(min_X, max_X), generateNumber(min_Y, max_Y)];
}

let questions = [];

function generateCalc(min_X, max_X, operation, min_Y, max_Y) {
    let numA = generateNumber(min_X, max_X);
    let numB = generateNumber(min_Y, max_Y);
    if (operation === '-' && numA < numB) {
        let dummy = numA;
        numA = numB;
        numB = dummy;
    }
    if (operation === '/') {
        numA *= numB;
    }
    let question = (`${numA} ${operation} ${numB}`)
    // let answer = eval(question.replaceAll('x', '*').replaceAll('÷', '/'));
    let answer = eval(question)
    return [
        question,
        answer
    ]
}

function generateOperation() {
    let randomNum = generateNumber(1, 4);
    let randomOperation = '+';
    if (randomNum === 2) {
        randomOperation = '-';
    } else if (randomNum === 3) {
        randomOperation = '*';
    } else if (randomNum === 4) {
        randomOperation = '/';
    }
    return randomOperation;
}
