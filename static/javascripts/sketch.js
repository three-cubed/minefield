const body = document.getElementsByTagName('body')[0];
let appendCanvasHere, levelMessage;
let level = 1;
let startMessage = 'Let\'s go!';

let tiles = [];

const heightOfBoardInSquares = 7; // 6 seems good for development; maybe use 7 for deployment?
const widthOfBoardInSquares = 4;
const dimensionsOfSquaresInPixels = 80; // 90 seems good for development.
const sqrBorderWidth = 3;

const halfSqr = dimensionsOfSquaresInPixels / 2;
const heightOfBoardInPixels = heightOfBoardInSquares * dimensionsOfSquaresInPixels;
const widthOfBoardInPixels = widthOfBoardInSquares * dimensionsOfSquaresInPixels;

function setUpBoard() {
    levelMessage = document.getElementById('levelMessage');
    levelMessage.innerText = `Level ${level}`;

    let x = sqrBorderWidth / 2;
    let y = sqrBorderWidth / 2;

    let rowIsEvenNum = false;

    let minefieldCanvas = document.createElement('canvas');
    minefieldCanvas.setAttribute('id', 'minefieldCanvas');
    appendCanvasHere = document.getElementById('appendCanvasHere');
    appendCanvasHere.appendChild(minefieldCanvas);
    minefieldCanvas.setAttribute('width', widthOfBoardInPixels + halfSqr + sqrBorderWidth);
    minefieldCanvas.setAttribute('height', heightOfBoardInPixels + sqrBorderWidth);
    context = minefieldCanvas.getContext('2d'); // context is already 'declared' by canvas.

    for (let i = 0; i < (heightOfBoardInSquares * widthOfBoardInSquares); i++) {
        const newTile = new Tile(x, y, dimensionsOfSquaresInPixels, i);
        newTile.calc = generateCalc(level, generateOperation()); // Giving the tile a question
        tiles.push(newTile);
        newTile.rowIsEvenNum = rowIsEvenNum;
        findNeighbours(newTile);
        x += dimensionsOfSquaresInPixels;
        if (x > widthOfBoardInPixels - sqrBorderWidth / 2) {
            rowIsEvenNum = !rowIsEvenNum;
            x = sqrBorderWidth / 2;
            if (rowIsEvenNum === true) x += halfSqr;
            y += dimensionsOfSquaresInPixels;
        }
    }
    drawTiles();
    addBufferParag();
}

function drawTiles(borderColourToDraw = '.*', text = null, fontSize = dimensionsOfSquaresInPixels * 0.2) {
    let currText = text;
    const regExp = new RegExp(borderColourToDraw);
    for (const tile of tiles) {
        if (regExp.test(tile.borderColour) === true) {
            // if (text === null) currText = `${tile.calc[0].replaceAll('*', 'x').replaceAll('/', '÷')}`;
            if (text === null) currText = `${tile.calc[0].replaceAll('*', 'x')}`;
            // if (text === null) currText = `${tile.index}; ${tile.neighbours}`; fontSize = 11; // For testing!
            drawTile(tile, currText, fontSize);
        }
    }
    overrideBorderTopAndBottom();
}

function drawTile(tile, text, fontSize) {
    // The tile itself
    context.fillStyle = tile.colour;
    context.fillRect(tile.x, tile.y, tile.dimension, tile.dimension);
    // The border of the tile
    if (tile.index < tiles.length) {
        context.strokeStyle = tile.borderColour;
        context.lineWidth = sqrBorderWidth;
        context.strokeRect(tile.x, tile.y, tile.dimension, tile.dimension);
    }
    // The text on the tile
    const textOffsetX = tile.dimension / 2;
    let textOffsetY = tile.dimension / 2;
    context.font = `${fontSize}px Arial`;
    textOffsetY += fontSize / 2.5;
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText(text, tile.x + textOffsetX, tile.y + textOffsetY);
}

function overrideBorderTopAndBottom() {
    context = minefieldCanvas.getContext('2d');
    context.strokeStyle = tilesColour;
    context.lineWidth = sqrBorderWidth;
    context.beginPath();
    context.moveTo(0, sqrBorderWidth / 2);
    context.lineTo(widthOfBoardInPixels + sqrBorderWidth, sqrBorderWidth / 2);
    let bottomBorderOffset = 0;
    if (heightOfBoardInSquares % 2 === 0) bottomBorderOffset = halfSqr;
    context.moveTo(bottomBorderOffset, heightOfBoardInPixels + sqrBorderWidth / 2);
    context.lineTo(widthOfBoardInPixels + sqrBorderWidth + bottomBorderOffset, heightOfBoardInPixels + sqrBorderWidth / 2);
    context.stroke();
}

function addBufferParag() {
    const parag = document.createElement('p');
    parag.setAttribute('class', 'buffer');
    body.appendChild(parag);
}

function findNeighbours(tile) {
    // DANGER!
    // Any change to the tile numbering system will mess this function up and variables outside it,
    // for example switching to starting at one instead of zero.
    // Seriously it will be so tiresome.
    tile.neighbours = [];
    const index = tile.index;
    const remainder = index % widthOfBoardInSquares;
    // Check above
    if (index < widthOfBoardInSquares) {
        tile.neighbours.push('none above');
        // tile.colour = 'purple';
    } else {
        tile.neighbours.unshift(index - widthOfBoardInSquares);
        if (remainder !== 0 && tile.rowIsEvenNum === false) {
            tile.neighbours.unshift(index - widthOfBoardInSquares - 1);
        }
        if (remainder !== widthOfBoardInSquares - 1 && tile.rowIsEvenNum === true) {
            tile.neighbours.unshift(index - widthOfBoardInSquares + 1);
        }
    }
    // Check left
    if (remainder === 0) {
        tile.neighbours.push('none to left');
        // tile.colour = 'yellow';
    } else {
        tile.neighbours.unshift(index - 1);
    }
    // Check right
    if (remainder === widthOfBoardInSquares - 1) {
        tile.neighbours.push('none to right');
        // tile.colour = 'gold';
    } else {
        tile.neighbours.unshift(index + 1);
    }
    // Check below
    if (index >= ((heightOfBoardInSquares * widthOfBoardInSquares) - widthOfBoardInSquares)) {
        tile.neighbours.push('none below');
        // tile.colour = 'antiquewhite';
    } else {
        tile.neighbours.unshift(index + widthOfBoardInSquares);
        if (remainder !== widthOfBoardInSquares - 1 && tile.rowIsEvenNum === true) {
            tile.neighbours.unshift(index + widthOfBoardInSquares + 1);
        }
        if (remainder !== 0 && tile.rowIsEvenNum === false) {
            tile.neighbours.unshift(index + widthOfBoardInSquares - 1);
        }
    }
}

setUpBoard();
