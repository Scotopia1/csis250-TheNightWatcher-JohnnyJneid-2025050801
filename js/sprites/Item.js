class Item extends Sprite {
    constructor(game, x, y, itemType, size = 15) {
        super();

        this.game = game;
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.itemType = itemType;
        this.color = this.getColorByType(itemType);

        this.isItem = true;
    }

    getColorByType(itemType) {
        switch (itemType) {
            case 'ammo':
                return 'yellow';
            case 'health':
                return 'lime';
            case 'shield':
                return 'cyan';
            case 'upgrade':
                return 'fuchsia';
            default:
                return 'white';
        }
    }

    update(sprites, keys, mouse) {
        const player = sprites.find(sprite => sprite.isPlayer);

        if (player) {
            if (typeof checkAABBCollision === 'function') {
                if (checkAABBCollision(this.getBoundingBox(), player.getBoundingBox())) {
                    console.log(`Collected item: ${this.itemType}`);
                    this.applyEffect(player);
                    return true;
                }
            } else {
                // Fallback or error if utility function isn't available
                console.error("checkAABBCollision function not found! Make sure collision.js is loaded.");
                // Basic check as fallback (less accurate)
                if (this.x < player.x + player.width &&
                    this.x + this.width > player.x &&
                    this.y < player.y + player.height &&
                    this.y + this.height > player.y) {
                    console.log(`Collected item (fallback collision): ${this.itemType}`);
                    this.applyEffect(player);
                    return true;
                }
            }
        }

        return false;
    }

    applyEffect(player) {
        switch (this.itemType) {
            case 'ammo':
                if (typeof player.addAmmo === 'function') {
                    player.addAmmo(10);
                } else {
                    console.warn("Player object missing addAmmo method.");
                }
                break;
            case 'health':
                if (typeof player.addHealth === 'function') {
                    player.addHealth(25);
                } else {
                    console.warn("Player object missing addHealth method.");
                }
                break;
            case 'shield':
                if (typeof player.addShield === 'function') {
                    player.addShield(50);
                } else {
                    console.warn("Player object missing addShield method.");
                }
                break;
            case 'upgrade':
                if (typeof player.applyUpgrade === 'function') {
                    player.applyUpgrade('speed');
                } else {
                    console.warn("Player object missing applyUpgrade method.");
                }
                console.log("Upgrade collected (effect TBD).");
                break;
            default:
                console.warn(`Unknown item type collected: ${this.itemType}`);
        }
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