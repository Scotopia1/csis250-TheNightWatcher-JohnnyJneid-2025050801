/*************************************************************************
 * Wall.js
 *
 *  This file defines the Wall class, which represents walls in the game.
 *  The Wall class extends the Sprite class and includes properties and methods
 *  for wall dimensions, colors, and rendering.
 *
 *****************************************************************************/

class Wall extends Sprite {
    constructor(game, x, y, width, height, color = '#555') {
        super();

        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;

        this.isWall = true;
    }

    update(sprites, keys, mouse) {
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    getBoundingBox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
