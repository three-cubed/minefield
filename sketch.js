let body = document.getElementsByTagName('body')[0];

let tiles = [];

let dimensionsOfBoardInSquares = 5;
let dimensionsOfSquaresInPixels = 90;
let sqrBorderWidth = 4;
let dimensionsOfBoardInPixels = dimensionsOfBoardInSquares * dimensionsOfSquaresInPixels;

function setUpBoard () {

    let x = sqrBorderWidth / 2;
    let y = sqrBorderWidth / 2;
    let numOfSqrs = Math.pow(dimensionsOfBoardInSquares, 2);
    let halfSqr = dimensionsOfSquaresInPixels / 2;

    let rowIsEvenNum = false;

    let minefieldCanvas = document.createElement('canvas');
    minefieldCanvas.setAttribute('id', 'minefieldCanvas');
    body.appendChild(minefieldCanvas);
    minefieldCanvas.setAttribute('width', dimensionsOfBoardInPixels + halfSqr + sqrBorderWidth);
    minefieldCanvas.setAttribute('height', dimensionsOfBoardInPixels + sqrBorderWidth);
    context = minefieldCanvas.getContext('2d');

    for (let i = 0; i < numOfSqrs; i++) {
        let newTile = new Tile(x, y, dimensionsOfSquaresInPixels, i);
        newTile.calc = generateCalc(2, 12, generateOperation(), 2, 12); // Giving the tile a question
        tiles.push(newTile);
        newTile.rowIsEvenNum = rowIsEvenNum;
        findNeighbours(newTile);
        x = x + dimensionsOfSquaresInPixels;
        if (x >= dimensionsOfBoardInPixels - sqrBorderWidth / 2) {
            // console.log(`at tile no. ${i}, x >= dimensionsOfBoardInPixels - sqrBorderWidth / 2`);
            rowIsEvenNum = !rowIsEvenNum;
            x = sqrBorderWidth / 2;
            if (rowIsEvenNum === true) x += halfSqr;
            y += dimensionsOfSquaresInPixels;
        }
    }

    drawWithOffset(tiles);
    addBufferParag();

}

function drawWithOffset(tiles) {
    for (let tile of tiles) {
        // The tile itself
        context.fillStyle = tile.colour;
        context.fillRect(tile.x, tile.y, tile.dimension, tile.dimension);
        // The border of the tile
        context.strokeStyle = tile.borderColour;
        context.lineWidth = sqrBorderWidth;
        context.strokeRect(tile.x, tile.y, tile.dimension, tile.dimension);
        // The text on the tile
        context.fillStyle = "black";
        context.textAlign = "center";
        let textOffset = tile.dimension / 2;
        context.fillText(`${tile.index})   ${tile.calc[0].replaceAll('*', 'x').replaceAll('/', '÷')}`, tile.x + textOffset, tile.y + textOffset);
    }
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
    const remainder = index % dimensionsOfBoardInSquares;
    // check above
    if (index < dimensionsOfBoardInSquares +1) {
        tile.neighbours.push('none above');
        // tile.colour = 'green';
    } else {
        tile.neighbours.unshift(index - dimensionsOfBoardInSquares);
        if (remainder !== 1 && tile.rowIsEvenNum === false) {
            tile.neighbours.unshift(index - dimensionsOfBoardInSquares - 1)
        }
        if (remainder !== 0 && tile.rowIsEvenNum === true) {
            tile.neighbours.unshift(index - dimensionsOfBoardInSquares + 1)
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
    if (index > (Math.pow(dimensionsOfBoardInSquares, 2) - dimensionsOfBoardInSquares)) {
        tile.neighbours.push('none below');
        // tile.colour = 'green';
    } else {
        tile.neighbours.unshift(index + dimensionsOfBoardInSquares);
        if (remainder !== 1 && tile.rowIsEvenNum === false) {
            tile.neighbours.unshift(index + dimensionsOfBoardInSquares - 1)
        }
        if (remainder !== 0 && tile.rowIsEvenNum === true) {
            tile.neighbours.unshift(index + dimensionsOfBoardInSquares + 1)
        }
    }
    // console.log(index, remainder, tile.neighbours);
}
