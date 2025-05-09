/************************************************************************************************
 * Level 1 - More Detailed Map
 * This level features a more complex layout with multiple sites and generators.
 * It includes various walls, doors, and spawn areas for the player and enemies.
 * The level is designed to provide a challenging experience with multiple paths and hiding spots.
 **************************************************************************************************/

class Level1 extends Level {
    constructor(gameInstance) {
        super(gameInstance);
    }

    initialize() {
        console.log("Initializing Level 1 (More Detailed Map)...");

        const worldW = this.game.WORLD_WIDTH;
        const worldH = this.game.WORLD_HEIGHT;
        const wallThickness = 15;
        const wallColor = '#707070';
        const siteColor = '#909070';
        const borderColor = '#303030';

        this.game.addSprite(new Wall(this.game, 0, 0, worldW, wallThickness, borderColor));
        this.game.addSprite(new Wall(this.game, 0, worldH - wallThickness, worldW, wallThickness, borderColor));
        this.game.addSprite(new Wall(this.game, 0, wallThickness, wallThickness, worldH - 2 * wallThickness, borderColor));
        this.game.addSprite(new Wall(this.game, worldW - wallThickness, wallThickness, wallThickness, worldH - 2 * wallThickness, borderColor));

        const aSiteX = 3500, aSiteY = 700, aSiteW = 1100, aSiteH = 900;
        this.game.addSprite(new Wall(this.game, aSiteX, aSiteY + aSiteH, aSiteW, wallThickness, siteColor));
        this.game.addSprite(new Wall(this.game, aSiteX, aSiteY, wallThickness, aSiteH, siteColor));
        this.game.addSprite(new Wall(this.game, aSiteX + aSiteW, aSiteY, wallThickness, aSiteH + wallThickness, siteColor));
        const aGenX = aSiteX + 300, aGenY = aSiteY + 300, aGenW = 400, aGenH = 300;
        this.game.addSprite(new Wall(this.game, aGenX, aGenY + aGenH, aGenW, wallThickness, siteColor));
        this.game.addSprite(new Wall(this.game, aGenX, aGenY, wallThickness, aGenH, siteColor));
        this.game.addSprite(new Wall(this.game, aGenX + aGenW, aGenY, wallThickness, aGenH + wallThickness, siteColor));
        const aDoorWidth = 200;
        this.game.addSprite(new Wall(this.game, aSiteX - 300, aSiteY + aSiteH / 2 + aDoorWidth / 2, wallThickness, aSiteH / 2 + wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, aSiteX + aSiteW, aSiteY - 400, wallThickness, 400, wallColor));
        this.game.addSprite(new Wall(this.game, aSiteX + 100, aSiteY + aSiteH - 200, 200, wallThickness, siteColor));
        this.game.addSprite(new Wall(this.game, aSiteX + aSiteW - 200, aSiteY + 100, wallThickness, 200, siteColor));

        const bSiteX = 400, bSiteY = 800, bSiteW = 1200, bSiteH = 1000;
        this.game.addSprite(new Wall(this.game, bSiteX, bSiteY + bSiteH, bSiteW, wallThickness, siteColor));
        this.game.addSprite(new Wall(this.game, bSiteX, bSiteY, wallThickness, bSiteH + wallThickness, siteColor));
        this.game.addSprite(new Wall(this.game, bSiteX + bSiteW, bSiteY, wallThickness, bSiteH, siteColor));
        const bGenX = bSiteX + 400, bGenY = bSiteY + 300, bGenW = 500, bGenH = 300;
        this.game.addSprite(new Wall(this.game, bGenX, bGenY + bGenH, bGenW, wallThickness, siteColor));
        this.game.addSprite(new Wall(this.game, bGenX, bGenY, wallThickness, bGenH, siteColor));
        this.game.addSprite(new Wall(this.game, bGenX + bGenW, bGenY, wallThickness, bGenH + wallThickness, siteColor));
        const bDoorWidth = 200;
        this.game.addSprite(new Wall(this.game, bSiteX + bSiteW + 300, bSiteY - 400, wallThickness, 400 + bSiteH / 2 - bDoorWidth / 2, wallColor));
        this.game.addSprite(new Wall(this.game, bSiteX + bSiteW + 300, bSiteY + bSiteH / 2 + bDoorWidth / 2, wallThickness, bSiteH / 2 + wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, bSiteX + bSiteW - 200, bSiteY + bSiteH - 200, 200, wallThickness, siteColor));
        this.game.addSprite(new Wall(this.game, bSiteX + 100, bSiteY + 100, wallThickness, 200, siteColor));

        const midX = worldW / 2 - 150, midY = worldH / 2 - 100, midW = 300, midH = 200;
        this.game.addSprite(new Wall(this.game, midX, midY + midH, midW, wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, midX, midY, wallThickness, midH, wallColor));
        this.game.addSprite(new Wall(this.game, midX + midW, midY, wallThickness, midH + wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, midX - 400, wallThickness, wallThickness, midY - wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, midX + midW + 400, wallThickness, wallThickness, midY - wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, midX - 400, midY - 300, midW + 800, wallThickness, wallColor));
        const connectorDoorWidth = 250;
        this.game.addSprite(new Wall(this.game, bSiteX + bSiteW + (midX - (bSiteX + bSiteW)) / 2 + connectorDoorWidth / 2, bSiteY + bSiteH + wallThickness, (midX - (bSiteX + bSiteW)) / 2 - connectorDoorWidth / 2, wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, midX + midW, aSiteY + aSiteH + wallThickness, (aSiteX - (midX + midW)) / 2 - connectorDoorWidth / 2, wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, midX + midW + (aSiteX - (midX + midW)) / 2 + connectorDoorWidth / 2, aSiteY + aSiteH + wallThickness, (aSiteX - (midX + midW)) / 2 - connectorDoorWidth / 2, wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, bSiteX + bSiteW + 300, bSiteY + bSiteH, wallThickness, midY + midH - (bSiteY + bSiteH), wallColor));
        this.game.addSprite(new Wall(this.game, aSiteX - 300, aSiteY + aSiteH, wallThickness, midY + midH - (aSiteY + aSiteH), wallColor));

        const spawnAreaY = worldH - 800;
        this.game.addSprite(new Wall(this.game, worldW / 2 + 400, spawnAreaY, worldW / 2 - 400 - wallThickness, wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, worldW / 2 - 100, spawnAreaY, wallThickness, worldH - spawnAreaY - wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, worldW / 2 - 500, worldH - 500, 300, wallThickness, wallColor));
        this.game.addSprite(new Wall(this.game, worldW / 2 + 200, worldH - 500, 300, wallThickness, wallColor));

        const playerStartX = worldW / 2;
        const playerStartY = worldH - 300;
        const playerSize = 60;
        this.game.addSprite(new Player(this.game, playerStartX, playerStartY, playerSize));

        const enemySize = 60;
        const patrolDistSmall = 300;
        const patrolDistMed = 600;
        const patrolDistLong = 1000;
        this.game.addSprite(new Enemy(this.game, bGenX + bGenW / 2, bGenY + bGenH / 2, enemySize, 'red', 1, patrolDistSmall, 50));
        this.game.addSprite(new Enemy(this.game, bSiteX + bSiteW + 150, bSiteY - 200, enemySize, 'red', 1.1, patrolDistMed, 60));
        this.game.addSprite(new Enemy(this.game, bSiteX + 150, bSiteY + 150, enemySize, 'red', 0.9, patrolDistSmall, 55));
        this.game.addSprite(new Enemy(this.game, aSiteX - 150, aSiteY - 200, enemySize, 'orange', 1.2, patrolDistMed, 70));
        this.game.addSprite(new Enemy(this.game, aGenX + aGenW / 2, aGenY + aGenH + 50, enemySize, 'orange', 1, patrolDistSmall, 50));
        this.game.addSprite(new Enemy(this.game, aSiteX + aSiteW - 150, aSiteY + 150, enemySize, 'orange', 1.1, patrolDistSmall, 65));
        this.game.addSprite(new Enemy(this.game, midX + midW / 2, midY - 200, enemySize, 'yellow', 0.8, patrolDistMed, 60));
        this.game.addSprite(new Enemy(this.game, midX - 200, midY + midH + 200, enemySize, 'yellow', 1, patrolDistLong, 80));
        this.game.addSprite(new Enemy(this.game, midX + midW + 200, midY + midH + 200, enemySize, 'yellow', 1, patrolDistLong, 80));

        const itemSize = 45;
        this.game.addSprite(new Item(this.game, bSiteX + 50, bSiteY + 50, 'ammo', itemSize));
        this.game.addSprite(new Item(this.game, bGenX + 50, bGenY + 50, 'shield', itemSize));
        this.game.addSprite(new Item(this.game, aSiteX + aSiteW - 50, aSiteY + aSiteH - 50, 'health', itemSize));
        this.game.addSprite(new Item(this.game, aSiteX + 50, aSiteY + 50, 'ammo', itemSize));
        this.game.addSprite(new Item(this.game, midX + midW / 2, midY + midH / 2, 'shield', itemSize));
        this.game.addSprite(new Item(this.game, midX - 300, midY - 250, 'health', itemSize));
        this.game.addSprite(new Item(this.game, 200, worldH - 200, 'upgrade', itemSize));
        this.game.addSprite(new Item(this.game, worldW - 200, worldH - 200, 'ammo', itemSize));
        this.game.addSprite(new Item(this.game, playerStartX + 200, playerStartY - 50, 'health', itemSize));
        this.game.addSprite(new Item(this.game, bSiteX + bSiteW - 50, bSiteY + 50, 'shield', itemSize));
        this.game.addSprite(new Item(this.game, aGenX + aGenW - 50, aGenY + 50, 'ammo', itemSize));
        this.game.addSprite(new Item(this.game, midX + 50, midY + 50, 'upgrade', itemSize));
        this.game.addSprite(new Item(this.game, midX + midW - 50, midY + midH - 50, 'health', itemSize));
        this.game.addSprite(new Item(this.game, midX - 50, midY + midH - 50, 'ammo', itemSize));
        this.game.addSprite(new Item(this.game, midX + 50, midY - 50, 'shield', itemSize));
        this.game.addSprite(new Item(this.game, midX + midW - 50, midY - 50, 'upgrade', itemSize));
        this.game.addSprite(new Item(this.game, midX - 50, midY + 50, 'ammo', itemSize));
    }
}