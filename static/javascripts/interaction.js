const tileBorderHighlightColour = 'yellow';
const tileWrongColour = 'red';
let currentTile = null;
let currentAnswer = null;
let awardForThisLevelGiven = false;
let questionDiv, answerInputBox, toNextBtn;

const emoticonList = [
    '&#128512;',
    '&#128513;',
    '&#128515;',
    '&#128522;',
    '&#128525;',
    '&#128540;',
    '&#128541;',
    '&#128579;',
    '&#129322;',
    '&#129392;',
    '&#129321;'
];

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        doWhenLoaded();
    });
} else {
    doWhenLoaded();
}

function doWhenLoaded() {
    detectMobileOrNarrow();
    const minefieldCanvas = document.getElementById('minefieldCanvas');
    minefieldCanvas.addEventListener('click', clickFunc);

    questionForm = document.getElementById('questionForm');
    toNextBtn = document.getElementById('toNextBtn');

    questionDiv = document.getElementById('questionDiv');
    questionDiv.innerText = startMessage;

    answerInputBox = document.getElementById('answerInputBox');
    answerInputBox.value = '';

    answerBtn = document.getElementById('answerBtn');
    answerBtn.addEventListener('click', (event) => {
        event.preventDefault();
        checkAnswer();
    });

    if (body.dataset.keydownListener === 'false') { // This 'if clause' prevents a new event listener being added every level.
        body.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp' && currentTile.index >= widthOfBoardInSquares) moveTileFocus(tiles[currentTile.index - widthOfBoardInSquares]);
            if (event.key === 'ArrowLeft' && currentTile.index > 0) moveTileFocus(tiles[currentTile.index - 1]);
            if (event.key === 'ArrowRight' && currentTile.index < tiles.length - 1) moveTileFocus(tiles[currentTile.index + 1]);
            if (event.key === 'ArrowDown' && currentTile.index < tiles.length - widthOfBoardInSquares) moveTileFocus(tiles[currentTile.index + widthOfBoardInSquares]);
        });
        body.dataset.keydownListener = 'true';
    }
}

function clickFunc(event) {
    // First getting the co-ordinates on the window.
    let x = event.x;
    let y = event.y;

    // Then taking into account scrolling, adjust to get coordinates vis-à-vis the document (instead of window).
    x += (window.scrollX);
    y += (window.scrollY);

    // Finally applying offsets to get co-ordinates vis-à-vis the canvas (instead of whole document).
    x -= minefieldCanvas.offsetLeft;
    y -= minefieldCanvas.offsetTop;

    const tileToFocusOn = getIdentity({ x: x, y: y });
    moveTileFocus(tileToFocusOn);
}

function moveTileFocus(tileToFocusOn) {
    if (
        tileToFocusOn === null
        || tileToFocusOn.borderColour === tileWrongColour
        || hasValidNeighbour(tileToFocusOn) === false
    ) {
        return;
    }

    currentTile = tileToFocusOn;

    questionForm.reset();
    answerInputBox.removeAttribute('disabled', 'disabled');

    updateTiles();
    if (currentTile.borderColour === tilesColour) {
        questionDiv.innerText = startMessage;
    } else {
        questionDiv.innerText = currentTile.calc[0].replaceAll('*', 'x').replaceAll('/', '÷');
        // questionDiv.innerText += ' = '
        currentAnswer = null;
    }
    setTileToBeHighlighted(currentTile);
    colourInBorder(currentTile); // By default, will highlight it if highlight set to this tile.
    currentAnswer = currentTile.calc[1];
    answerInputBox.focus();
}

function getIdentity(click) {
    let tile = null;
    while (tile === null) {
        for (const tileLow of tiles) {
            const tileHigh = { x: tileLow.x + dimensionsOfSquaresInPixels, y: tileLow.y + dimensionsOfSquaresInPixels };
            if (
                click.x > tileLow.x
                && click.x < tileHigh.x
                && click.y > tileLow.y
                && click.y < tileHigh.y
            ) {
                tile = tileLow;
            }
        }
        // if (tile === null) console.log('click on canvas, no specific tile');
        return tile;
    }
}

function hasValidNeighbour(currentTile) {
    if (currentTile.index >= tiles.length - widthOfBoardInSquares) return true;
    // i.e. bottom row to be considered connected to validity by default.
    let hasValidNeighbour = false;
    for (const tile of tiles) {
        if (
            tile.borderColour === tilesColour
            && tile.neighbours.includes(currentTile.index)
        ) {
            hasValidNeighbour = true;
        }
    }
    return hasValidNeighbour;
}

function setTileToBeHighlighted(tileToHighlight) {
    for (const tile of tiles) {
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
    if (answerInputBox.value === '') {
        answerInputBox.focus();
        return;
    }
    let correct;
    if (answerInputBox.value == currentAnswer) correct = true; // needs to be ==, not ===
    if (correct === true) {
        answerInputBox.value += '  ✔';
        currentAnswer = null;
        answerInputBox.setAttribute('disabled', 'disabled');
        currentTile.borderColour = tilesColour;
    } else {
        answerInputBox.value += '  ✘';
        currentAnswer = null;
        answerInputBox.setAttribute('disabled', 'disabled');
        currentTile.borderColour = tileWrongColour;
    }
    updateTiles();
    colourInBorder(currentTile);
    if (correct === true) doIfComplete(currentTile);
}

function updateTiles() {
    drawTiles(tileBorderColour); // Tiles which are still normal.
    drawTiles(tilesColour, ''); // Tiles which have been cleared.
    drawTiles(tileWrongColour, '🔥', '40'); // Tiles which have been got wrong.
}

function doIfComplete(currentTile) {
    if (currentTile.index < widthOfBoardInSquares) {
        // alert('Well done! You\'ve cleared a path through the minefield!'); // optional!
        toNextBtn.style.opacity = '1';
        toNextBtn.addEventListener('click', goToNextLevel());
        // Note that using goToNextLevel, without brackets, in the event listener above leads to [object PointerEvent] passed as argument
        // which will cause goToNextLevel() to malfunction now that changeOfLevel has been introduced as a parameter.
        if (awardForThisLevelGiven === false) {
            rewardBox.innerHTML += '<span>&ensp;' + emoticonList[generateNumber(0, emoticonList.length - 1)] + '&ensp;</span>';
            awardForThisLevelGiven = true;
        }
    }
}

function goToNextLevel(changeOfLevel = 1) {
    tiles = [];
    currentTile = null;
    currentAnswer = null;
    level += changeOfLevel;
    awardForThisLevelGiven = false;

    questionDiv.innerText = startMessage;
    minefieldCanvas.remove();
    setUpBoard();
    doWhenLoaded();
    answerInputBox.value = '';

    toNextBtn.style.opacity = '0.05';
    toNextBtn.removeEventListener('click', goToNextLevel); // Here must use no brackets after removeEventListener for goToNextLevel.
}
