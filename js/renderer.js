class Renderer {
    constructor(ctx, game, camera, uiManager) {
        this.ctx = ctx;
        this.game = game;
        this.camera = camera;
        this.uiManager = uiManager;
        console.log("Renderer initialized.");
    }

    draw(gameState) {
        this.ctx.fillStyle = '#111118';
        this.ctx.fillRect(0, 0, this.game.VIEWPORT_WIDTH, this.game.VIEWPORT_HEIGHT);

        if (gameState === GameState.PLAYING || gameState === GameState.GAME_OVER) {
            if (this.game.player) {
                this.ctx.save();
                this.camera.applyTransform(this.ctx);

                this.ctx.fillStyle = '#050508';
                this.ctx.fillRect(0, 0, this.game.WORLD_WIDTH, this.game.WORLD_HEIGHT);

                this.game.drawCore(this.ctx);

                const player = this.game.player;
                if (player.health > 0 && typeof player.drawVisionCone === 'function') {
                    player.drawVisionCone(this.ctx);
                }

                this.ctx.restore();

                if (player.health > 0) {
                    this.drawFogOfWar(player);
                }
            } else if (gameState === GameState.PLAYING) {
                console.error("Renderer: Attempting to draw playing scene but game.player is missing.");
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(0, 0, this.game.VIEWPORT_WIDTH, this.game.VIEWPORT_HEIGHT);
                this.ctx.font = '40px Arial';
                this.ctx.fillStyle = 'red';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('ERROR: Player missing!', this.game.VIEWPORT_WIDTH / 2, this.game.VIEWPORT_HEIGHT / 2);
            }
        }

        this.uiManager.draw();
    }


    drawFogOfWar(player) {
        this.ctx.save();
        const playerViewportX = player.x - this.camera.x + player.width / 2;
        const playerViewportY = player.y - this.camera.y + player.height / 2;
        const angle = player.currentFacingAngle;
        const startAngle = angle - player.visionAngle / 2;
        const endAngle = angle + player.visionAngle / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(playerViewportX, playerViewportY);
        this.ctx.arc(playerViewportX, playerViewportY, player.visionRange, startAngle, endAngle);
        this.ctx.closePath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.game.VIEWPORT_WIDTH, 0);
        this.ctx.lineTo(this.game.VIEWPORT_WIDTH, this.game.VIEWPORT_HEIGHT);
        this.ctx.lineTo(0, this.game.VIEWPORT_HEIGHT);
        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.80)';
        this.ctx.fill('evenodd');
        this.ctx.restore();
    }

}