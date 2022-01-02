let body = document.getElementsByTagName('body')[0];

let tiles = [];

let heightOfBoardInSquares = 6; // 6 seems good for development; maybe use 8 for deployment?
let dimensionsOfSquaresInPixels = 90; // 90 seems good for development.
let halfSqr = dimensionsOfSquaresInPixels / 2;
let sqrBorderWidth = 4;
let heightOfBoardInPixels = heightOfBoardInSquares * dimensionsOfSquaresInPixels;

function setUpBoard () {

    let x = sqrBorderWidth / 2;
    let y = sqrBorderWidth / 2;
    let numOfSqrs = Math.pow(heightOfBoardInSquares, 2);

    let rowIsEvenNum = false;

    let minefieldCanvas = document.createElement('canvas');
    minefieldCanvas.setAttribute('id', 'minefieldCanvas');
    body.appendChild(minefieldCanvas);
    minefieldCanvas.setAttribute('width', heightOfBoardInPixels + halfSqr + sqrBorderWidth);
    minefieldCanvas.setAttribute('height', heightOfBoardInPixels + sqrBorderWidth);
    context = minefieldCanvas.getContext('2d'); // context is already 'declared' by canvas.

    for (let i = 0; i < numOfSqrs; i++) {
        let newTile = new Tile(x, y, dimensionsOfSquaresInPixels, i);
        newTile.calc = generateCalc(2, 12, generateOperation(), 2, 12); // Giving the tile a question
        tiles.push(newTile);
        newTile.rowIsEvenNum = rowIsEvenNum;
        findNeighbours(newTile);
        x = x + dimensionsOfSquaresInPixels;
        if (x >= heightOfBoardInPixels - sqrBorderWidth / 2) {
            // console.log(`at tile no. ${i}, x >= heightOfBoardInPixels - sqrBorderWidth / 2`);
            rowIsEvenNum = !rowIsEvenNum;
            x = sqrBorderWidth / 2;
            if (rowIsEvenNum === true) x += halfSqr;
            y += dimensionsOfSquaresInPixels;
        }
    }

    console.log('tiles[0].neighbours');
    console.log(tiles[0].neighbours);

    drawTiles();
    addBufferParag();

}

function drawTiles(borderColourToDraw = '.*', text = null, fontSize = dimensionsOfSquaresInPixels * 0.2) {
    // console.log(borderColourToDraw);
    let currText = text;
    let regExp = new RegExp(borderColourToDraw);
    for (let tile of tiles) {
        // console.log(tile.index, regExp.test(tile.borderColour) === true);
        if (regExp.test(tile.borderColour) === true) {
            // if (text === null) currText = `${tile.calc[0].replaceAll('*', 'x').replaceAll('/', '÷')}`;
            if (text === null) currText = `${tile.calc[0].replaceAll('*', 'x')}`;
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
    context.strokeStyle = tile.borderColour;
    context.lineWidth = sqrBorderWidth;
    context.strokeRect(tile.x, tile.y, tile.dimension, tile.dimension);
    // The text on the tile
    let textOffsetX = tile.dimension / 2;
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
    context.lineTo(heightOfBoardInPixels + sqrBorderWidth, sqrBorderWidth / 2);
    let bottomBorderOffset = 0;
    if (heightOfBoardInSquares % 2 === 0) bottomBorderOffset = halfSqr;
    context.moveTo(bottomBorderOffset, heightOfBoardInPixels + sqrBorderWidth / 2);
    context.lineTo(heightOfBoardInPixels + sqrBorderWidth + bottomBorderOffset, heightOfBoardInPixels + sqrBorderWidth / 2);
    context.stroke();
}

setUpBoard()

function addBufferParag() {
    let parag = document.createElement('p');
    parag.setAttribute('class', 'buffer');
    body.appendChild(parag);
}

function findNeighbours(tile) {
    tile.neighbours = [];
    const index = tile.index;
    const remainder = index % heightOfBoardInSquares;
    // check above
    if (index < heightOfBoardInSquares +1) {
        tile.neighbours.push('none above');
        // tile.colour = 'green';
    } else {
        tile.neighbours.unshift(index - heightOfBoardInSquares);
        if (remainder !== 1 && tile.rowIsEvenNum === false) {
            tile.neighbours.unshift(index - heightOfBoardInSquares - 1)
        }
        if (remainder !== 0 && tile.rowIsEvenNum === true) {
            tile.neighbours.unshift(index - heightOfBoardInSquares + 1)
        }
    }
    // check left
    if (remainder === 1) {
        tile.neighbours.push('none to left');
        // tile.colour = 'yellow';
    } else {
        tile.neighbours.unshift(index - 1);
    }
    // check right
    if (remainder === 0) {
        tile.neighbours.push('none to right');
        // tile.colour = 'gold';
    } else {
        tile.neighbours.unshift(index + 1);
    }
    // check below
    if (index > (Math.pow(heightOfBoardInSquares, 2) - heightOfBoardInSquares)) {
        tile.neighbours.push('none below');
        // tile.colour = 'green';
    } else {
        tile.neighbours.unshift(index + heightOfBoardInSquares);
        if (remainder !== 1 && tile.rowIsEvenNum === false) {
            tile.neighbours.unshift(index + heightOfBoardInSquares - 1)
        }
        if (remainder !== 0 && tile.rowIsEvenNum === true) {
            tile.neighbours.unshift(index + heightOfBoardInSquares + 1)
        }
    }
    // console.log(index, remainder, tile.neighbours);
}
