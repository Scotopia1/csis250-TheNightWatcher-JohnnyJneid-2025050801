/**************************************************************
 * Camera Class
 *
 *  This class handles the camera's position and viewport
 *  functionality in the game world. It allows the camera
 *  to follow a target sprite,
 *  apply transformations to the canvas context, and convert
 *  between world and viewport coordinates.
 *
 ***************************************************************************************/

class Camera {
    constructor(game, viewportWidth, viewportHeight, worldWidth, worldHeight) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.target = null;

        console.log("Camera initialized.");
    }

    follow(sprite) {
       this.target = sprite;
            console.log("Camera target set:", sprite);
    }

    update() {
        if (!this.target) {
            return;
        }

        const targetX = this.target.x + (this.target.width / 2) - (this.viewportWidth / 2);
        const targetY = this.target.y + (this.target.height / 2) - (this.viewportHeight / 2);

        this.x = Math.max(0, Math.min(targetX, this.worldWidth - this.viewportWidth));
        this.y = Math.max(0, Math.min(targetY, this.worldHeight - this.viewportHeight));

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }

    applyTransform(ctx) {
        ctx.translate(-this.x, -this.y);
    }

    viewportToWorld(viewportX, viewportY) {
        return {
            x: viewportX + this.x,
            y: viewportY + this.y
        };
    }

    worldToViewport(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

}