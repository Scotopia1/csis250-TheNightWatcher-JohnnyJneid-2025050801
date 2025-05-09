class Level2 extends Level {
    constructor(gameInstance) {
        super(gameInstance);
    }

    initialize() {
        const worldW = this.game.WORLD_WIDTH;
        const worldH = this.game.WORLD_HEIGHT;
        const wallThickness = 15;
        const wallColor = '#887766';
        const borderColor = '#303030';

        this.game.addSprite(new Wall(this.game, 0, 0, worldW, wallThickness, borderColor));
        this.game.addSprite(new Wall(this.game, 0, worldH - wallThickness, worldW, wallThickness, borderColor));
        this.game.addSprite(new Wall(this.game, 0, wallThickness, wallThickness, worldH - 2 * wallThickness, borderColor));
        this.game.addSprite(new Wall(this.game, worldW - wallThickness, wallThickness, wallThickness, worldH - 2 * wallThickness, borderColor));

        const roomX = 1500, roomY = 1000, roomW = 2200, roomH = 2000;
        const corridorW = 400;

        this.game.addSprite(new Wall(this.game, roomX, roomY, roomW, wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, roomX, roomY + roomH, roomW, wallThickness, wallColor));
        //this.game.addSprite(new Wall(this.game, roomX, roomY, wallThickness, roomH / 2 - corridorW / 2, wallColor));
        this.game.addSprite(new Wall(this.game, roomX, roomY + roomH / 2 + corridorW / 2, wallThickness, roomH / 2 - corridorW / 2 + wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, roomX + roomW, roomY, wallThickness, roomH / 2 - corridorW / 2, wallColor));
        this.game.addSprite(new Wall(this.game, roomX + roomW, roomY + roomH / 2 + corridorW / 2, wallThickness, roomH / 2 - corridorW / 2 + wallThickness, wallColor));

        //this.game.addSprite(new Wall(this.game, roomX + roomW, roomY + roomH / 2 - corridorW / 2, worldW - (roomX + roomW) - wallThickness, wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, roomX + roomW, roomY + roomH / 2 + corridorW / 2, worldW - (roomX + roomW) - wallThickness, wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, wallThickness, roomY + roomH / 2 - corridorW / 2, roomX - wallThickness, wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, wallThickness, roomY + roomH / 2 + corridorW / 2, roomX - wallThickness, wallThickness, wallColor));

        //this.game.addSprite(new Wall(this.game, roomX + 500, roomY + 500, 300, wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, roomX + roomW - 800, roomY + roomH - 500, 300, wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, roomX + roomW / 2 - 50, roomY + roomH / 2 - 250, wallThickness, 500, wallColor));

        const playerStartX = 300;
        const playerStartY = worldH / 2;
        const playerSize = 60;
        this.game.addSprite(new Player(this.game, playerStartX, playerStartY, playerSize));


        const enemySize = 60;
        const patrolDist = 800;
        this.game.addSprite(new Enemy(this.game, roomX + 300, roomY + 300, enemySize, 'cyan', 1.2, patrolDist, 70));
        this.game.addSprite(new Enemy(this.game, roomX + roomW - 300, roomY + roomH - 300, enemySize, 'cyan', 1.2, patrolDist, 70));
        this.game.addSprite(new Enemy(this.game, worldW - 500, worldH / 2, enemySize, 'lime', 1.5, patrolDist, 80));
        this.game.addSprite(new Enemy(this.game, roomX + roomW / 2, roomY - 200, enemySize, 'lime', 1, patrolDist, 60));
        this.game.addSprite(new Enemy(this.game, roomX + roomW / 2, roomY + roomH + 200, enemySize, 'lime', 1, patrolDist, 60));

        const itemSize = 45;
        this.game.addSprite(new Item(this.game, roomX + roomW / 2, roomY + roomH / 2, 'shield', itemSize));
        this.game.addSprite(new Item(this.game, roomX + 100, roomY + 100, 'ammo', itemSize));
        this.game.addSprite(new Item(this.game, roomX + roomW - 100, roomY + roomH - 100, 'health', itemSize));
        this.game.addSprite(new Item(this.game, worldW - 200, roomY + roomH / 2 + corridorW / 2 - 50, 'ammo', itemSize));
        this.game.addSprite(new Item(this.game, 150, roomY + roomH / 2 - corridorW / 2 + 50, 'health', itemSize));
        this.game.addSprite(new Item(this.game, worldW / 2, 150, 'upgrade', itemSize));
        this.game.addSprite(new Item(this.game, worldW / 2, worldH - 150, 'shield', itemSize));
    }
}