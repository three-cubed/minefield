let minefieldCanvas = document.getElementById('minefieldCanvas');
minefieldCanvas.addEventListener('click', clickFunc);
let tileBorderHighlightColour = 'yellow';
let tileWrongColour = 'red';
let currentAnswer = null;
let currentTile;
let questionDiv, answerInputBox;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        doWhenLoaded();
    });
} else {
    doWhenLoaded();
}

function doWhenLoaded() {
    questionForm = document.getElementById('questionForm')
    questionDiv = document.getElementById('questionDiv');
    answerInputBox = document.getElementById('answerInputBox');
    // answerInputBox.addEventListener('keyup', checkAnswer);
    answerBtn = document.getElementById('answerBtn');
    answerBtn.addEventListener('click', function(event){
        event.preventDefault();
        checkAnswer();
    });
}

function clickFunc(event) {
    // First getting the co-ordinates on the window.
    var x = event.x;
    var y = event.y;
    // console.log('x:' + x + ' y:' + y);

    // Then taking into account scrolling, adjust to get coordinates vis-à-vis the document (instead of window).
    x += (window.scrollX);
    y += (window.scrollY);
    // console.log('x:' + x + ' y:' + y);

    // Finally applying offsets to get co-ordinates vis-à-vis the canvas (instead of whole document).
    x -= minefieldCanvas.offsetLeft;
    y -= minefieldCanvas.offsetTop;
    // console.log('x:' + x + ' y:' + y);

    currentTile = getIdentity({'x': x, 'y': y});

    if (currentTile === null) return;
    if (currentTile.borderColour === tileWrongColour || currentTile.borderColour === tilesColour) return;
    if (hasValidNeighbours(currentTile) === false) return;

    questionForm.reset();
    answerInputBox.removeAttribute('disabled', 'disabled');

    setTileToBeHighlighted(currentTile);
    updateTiles();
    colourInBorder(currentTile);
    questionDiv.innerText = currentTile.calc[0].replaceAll('*', 'x').replaceAll('/', '÷');
    currentAnswer = currentTile.calc[1];
    answerInputBox.focus();
}

function getIdentity(click) {
    let tile = null;
    while (tile === null) {
        for (let tileLow of tiles) {
            let tileHigh = {'x': tileLow.x + dimensionsOfSquaresInPixels, 'y': tileLow.y + dimensionsOfSquaresInPixels};
            if (
                click.x > tileLow.x 
                && click.x < tileHigh.x 
                && click.y > tileLow.y 
                && click.y < tileHigh.y
                ) {
                // console.log(`click on tile ${tileLow.index}`);
                tile = tileLow;
            }
        }
    // if (tile === null) console.log('click on canvas, no specific tile');
    return tile;
    }
}

function hasValidNeighbours(currentTile) {
    if (currentTile.index >= numOfSqrs - heightOfBoardInSquares) return true;
    // i.e. bottom row to be considered connected to validity by default.;
    let hasValidNeighbours = false;
    // console.log('CHECKING WHETHER HAS VALID NEIGHBOURS ' + currentTile.index);
    for (let tile of tiles) {
        // console.log('Considering ' + tile.index + ' with colour: ' + tile.borderColour);
        // console.log("tile.borderColour === tilesColour " + (tile.borderColour === tilesColour));
        // console.log('tile.neighbours ' + tile.neighbours);
        // console.log("tile.neighbours.includes(currentTile.index) " + tile.neighbours.includes(currentTile.index));
        if (
            tile.borderColour === tilesColour
            && tile.neighbours.includes(currentTile.index)
            ) {
            hasValidNeighbours = true;
        }
    }
    // console.log('FOR HAS VALID NEIGHBOURS, ' + currentTile.index + ' RETURNING ' + hasValidNeighbours)
    return hasValidNeighbours;
}

function setTileToBeHighlighted(tileToHighlight) {
    // console.log('for tile' + tile.index + ', tile.highlighted go from ' + tile.highlighted + ' to ' + !tile.highlighted);
    for (let tile of tiles) {
        if (tileToHighlight !== tile && tile.highlighted === true) {
            tile.highlighted = false;
            break;
        }
    }
    tileToHighlight.highlighted = !tileToHighlight.highlighted;
}

function colourInBorder(tile, colourToUse = tile.borderColour) {
    if (tile.highlighted === true) colourToUse = tileBorderHighlightColour;
    context.strokeStyle = colourToUse;
    context.lineWidth = sqrBorderWidth;
    context.strokeRect(tile.x, tile.y, tile.dimension, tile.dimension);
}

function checkAnswer() {
    if (currentAnswer === null) return;
    // console.log(`checking for answer ${currentAnswer}`);
    if (answerInputBox.value == currentAnswer) { // needs to be ==, not ===
        // console.log('correct');
        // questionDiv.innerText = `✔ ${questionDiv.innerText}`;
        answerInputBox.value += '  ✔' ;
        currentAnswer = null;
        answerInputBox.setAttribute('disabled', 'disabled');
        currentTile.borderColour = tilesColour;
    } else {
        // console.log('correct');
        answerInputBox.value += '  ✘' ;
        currentAnswer = null;
        answerInputBox.setAttribute('disabled', 'disabled');
        currentTile.borderColour = tileWrongColour;
    }
    updateTiles();
    doIfComplete(currentTile);
}

function updateTiles() {
    drawTiles(tileBorderColour); // Tiles still normal.
    drawTiles(tilesColour, ''); // Tiles cleared.
    drawTiles(tileWrongColour, '🔥', '40'); // Tiles got wrong.
}

function doIfComplete(currentTile) {
    if (currentTile.index < heightOfBoardInSquares) {
        alert('Well done! You\'ve cleared a path throught the minefield!');
    }
}
