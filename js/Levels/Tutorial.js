class Tutorial extends Level {
    constructor(gameInstance) {
        super(gameInstance);
    }

    initialize() {
        console.log("Initializing Tutorial Level...");
        const worldW = this.game.WORLD_WIDTH;
        const worldH = this.game.WORLD_HEIGHT;
        const wallThickness = 15;
        const wallColor = '#A0A0A0';
        const borderColor = '#303030';

        this.game.addSprite(new Wall(this.game, 0, 0, worldW, wallThickness, borderColor));
        this.game.addSprite(new Wall(this.game, 0, worldH - wallThickness, worldW, wallThickness, borderColor));
        this.game.addSprite(new Wall(this.game, 0, wallThickness, wallThickness, worldH - 2 * wallThickness, borderColor));
        this.game.addSprite(new Wall(this.game, worldW - wallThickness, wallThickness, wallThickness, worldH - 2 * wallThickness, borderColor));

        const playerStartX = 200;
        const playerStartY = worldH / 2;
        const playerSize = 60;
        this.game.addSprite(new Player(this.game, playerStartX, playerStartY, playerSize));

        this.game.addSprite(new Wall(this.game, 500, worldH / 2 - 100, 50, 200, wallColor));

        this.game.addSprite(new Item(this.game, 700, worldH / 2, 'ammo', 45));
    }
}