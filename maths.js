
function generateNumber(min_inclusive, max_inclusive) {
    return Math.floor(Math.random() * (max_inclusive - min_inclusive + 1)) + min_inclusive;
}

function generate2numbers(min_X, max_X, min_Y, max_Y) {
    return [generateNumber(min_X, max_X), generateNumber(min_Y, max_Y)];
}

let questions = [];

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

let small = [1, 10];
let midsized = [11, 99];
let large = [101, 999];
let numCombos = [
    null,
    [...small, ...small],
    [...midsized, ...small],
    [...midsized, ...midsized],
    [...large, ...midsized],
    [...large, ...large]
];

function generateCalc(level, operation) {
    const difficulty = setDifficulty(level);
    if (operation === '+' || operation === '-') {
        return createPlusMinus(operation, ...numCombos[difficulty]);
    } else if (operation === '*' || operation === '/') {
        return createMultDiv(operation, difficulty);
    }
}

function createMultDiv(operation, difficulty) {
    let no1, no2, answer;
    if (difficulty === 1) {
        no1 = generateNumber(1, 6); if (no1 === 6) no1 = 10; no2 = generateNumber(1, 11);
    }
    if (difficulty === 2) {
        no1 = generateNumber(6, 11); if (no1 > 9) no1 += 1; no2 = generateNumber(2, 12);
    }
    if (difficulty === 3) {
        no1 = generateNumber(3, 12);
        no2 = generateNumber(3, 12);
        const wildCard = generateNumber(1, 4);
        if (operation === '*') {
            if (wildCard === 1) no1 *= 10;
            if (wildCard === 2) no2 *= 10;
            if (wildCard === 3) no2 *= 100;
            if (wildCard === 4) {
                no1 *= 10;
                no2 *= 10;
            }
        }
        if (operation === '/') {
            if (wildCard <= 2) no1 *= 10;
            if (wildCard > 2) no2 *= 10;
        }
    }
    if (difficulty === 4 && operation === '*') {
        const wildCard = generateNumber(1, 16);
        if (wildCard >= 5) {
            no1 = generateNumber(13, 99); no2 = generateNumber(3, 12);
        } else if (wildCard < 5) {
            no1 = generateNumber(3, 12); no2 = generateNumber(3, 12);
            if (wildCard === 1) no1 /= 10;
            if (wildCard === 2) no2 /= 10;
            if (wildCard === 3) no2 /= 100;
            if (wildCard === 4) {no1 /= 10; no2 /= 10;}
        }
    }
    if (difficulty === 4 && operation === '/') {
        no1 = generateNumber(13, 33);
        no2 = generateNumber(3, 12);
        if (no2 === 10) {
            no2 = 5;
        }
    }
    if (difficulty === 5 && operation === '*') {
        no1 = generateNumber(101, 999);
        no2 = generateNumber(3, 9);
    }
    if (difficulty === 5 && operation === '/') {
        no1 = generateNumber(41, 149);
        no2 = generateNumber(3, 12);
        if (no2 === 10) {
            no2 = 5;
        }
    }
    if (operation === '/') {
        no1 *= no2;
    }

    let question = (`${no1} ${operation} ${no2}`);
    answer = eval(question);
    return [
        question,
        answer
    ]
}

function createPlusMinus(operation, min_X, max_X, min_Y, max_Y) {
    let [no1, no2] = generate2numbers(min_X, max_X, min_Y, max_Y);
    if (operation === '-' && no1 < no2) {
        let dummy = no1;
        no1 = no2;
        no2 = dummy;
    }
    let question = (`${no1} ${operation} ${no2}`);
    let answer = eval(question);
    return [
        question,
        answer
    ]
}

function setDifficulty(level) {
    let levelsPerDifficulty = 4;
    let maxDifficulty = 5;
    let difficulty = Math.floor((level + levelsPerDifficulty - 1) / levelsPerDifficulty);
    if (difficulty > maxDifficulty) return maxDifficulty;
    return difficulty;
}
