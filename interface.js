let minefieldCanvas = document.getElementById('minefieldCanvas');
minefieldCanvas.addEventListener('click', clickFunc);
let tileBorderHighlightColour = 'yellow';
let currentAnswer = null;

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
    answerInputBox.addEventListener('keyup', checkAnswer);
}

function clickFunc(event) {
    questionForm.reset();
    answerInputBox.removeAttribute('disabled', 'disabled');

    var x = event.x;
    var y = event.y;

    x -= minefieldCanvas.offsetLeft;
    y -= minefieldCanvas.offsetTop;

    // console.log('Co-ords within canvas: x:' + x + ' y:' + y);

    const tileClicked = getIdentity({'x': x, 'y': y});
    questionDiv.innerText = tileClicked.calc[0].replaceAll('*', 'x').replaceAll('/', '÷');
    currentAnswer = tileClicked.calc[1];
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
                console.log(`click on tile ${tileLow.index}`);
                toggleHighlight(tileLow);
                tile = tileLow;
            }
        }
    // if (tile === null) console.log('click on canvas, no specific tile');
    return tile;
    }
}

function toggleHighlight(tile) {
    // console.log('for tile' + tile.index + ', tile.highlighted go from ' + tile.highlighted + ' to ' + !tile.highlighted);
    for (let otherTile of tiles) {
        // console.log('CHECKING ' + otherTile.index);
        // if (tile === otherTile) console.log(tile);
        if (tile !== otherTile && otherTile.highlighted === true) {
            otherTile.highlighted = false;
            colourInBorder(otherTile);
            break;
        }
    }
    tile.highlighted = !tile.highlighted;
    colourInBorder(tile);
}

function colourInBorder(tile, colourToUse = tileBorderHighlightColour) {
    if (tile.highlighted !== true) {
        colourToUse = tile.borderColour;
    }
    context.strokeStyle = colourToUse;
    context.lineWidth = sqrBorderWidth;
    context.strokeRect(tile.x, tile.y, tile.dimension, tile.dimension);
}

function checkAnswer() {
    if (currentAnswer === null) return;
    console.log(`checking for answer ${currentAnswer}`);
    if (answerInputBox.value == currentAnswer) { // needs to be ==, not ===
        console.log('correct');
        // questionDiv.innerText = `✔ ${questionDiv.innerText}`;
        answerInputBox.value += '  ✔' ;
        currentAnswer = null;
        answerInputBox.setAttribute('disabled', 'disabled');
    }
}
