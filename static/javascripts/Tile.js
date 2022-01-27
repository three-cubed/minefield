tilesColour = 'forestgreen';
tileBorderColour = 'black'

class Tile {
    constructor(x, y, dimension, index) {
        this.x = x;
        this.y = y;
        this.dimension = dimension;
        this.index = index;
        this.colour = tilesColour;
        this.borderColour = tileBorderColour;
        this.highlighted = false;
    }
}
