class Projectile extends Sprite {
    constructor(game, startX, startY, targetX, targetY, speed = 8, damage = 10, collisionSize = 8, fallbackColor = 'orange', firedByPlayer = true, shooter = null) {
        super();

        this.game = game;
        this.x = startX;
        this.y = startY;
        this.color = fallbackColor;
        this.speed = speed;
        this.damage = damage;
        this.firedByPlayer = firedByPlayer;
        this.shooter = shooter;
        this.width = collisionSize;
        this.height = collisionSize;

        this.spriteWidth = 16;
        this.spriteHeight = 16;
        this.spriteSheet = new Image();
        this.isSheetLoaded = false;
        this.animator = null;

        this.spriteSheet.onload = () => {
            console.log(`Projectile sprite sheet loaded for instance at (${this.x}, ${this.y})`);
            this.isSheetLoaded = true;
            if (typeof Animator !== 'undefined') {
                const frames = [
                    { x: 0, y: 0, w: this.spriteWidth, h: this.spriteHeight },
                    { x: 16, y: 0, w: this.spriteWidth, h: this.spriteHeight },
                    { x: 32, y: 0, w: this.spriteWidth, h: this.spriteHeight },
                ];
                const frameDuration = 5;
                this.animator = new Animator(frames, frameDuration, true);
            } else {
                console.error("Animator class not found when sheet loaded!");
            }
        };
        this.spriteSheet.onerror = () => {
            console.error(`Failed to load sprite sheet 'bullets+plasma.png' for projectile at (${this.x}, ${this.y})`);
            this.spriteSheet = null;
        };
        this.spriteSheet.src = '../../images/Projectiles/bullets+plasma.png';

        const dx = targetX - startX; const dy = targetY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.angle = 0;
        if (distance > 0) { this.velocityX = (dx / distance) * this.speed; this.velocityY = (dy / distance) * this.speed; this.angle = Math.atan2(dy, dx); }
        else { this.angle = shooter?.currentFacingAngle ?? 0; this.velocityX = Math.cos(this.angle) * this.speed; this.velocityY = Math.sin(this.angle) * this.speed; }



        this.isProjectile = true;
    }

    update(sprites, keys, mouse, game) {
        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.animator) {
            this.animator.update();
        }

        if (this.x < -this.width || this.x > game.WORLD_WIDTH + this.width || this.y < -this.height || this.y > game.WORLD_HEIGHT + this.height) { game.removeSprite(this); return false; }

        const currentBoundingBox = this.getBoundingBox();
        for (const sprite of sprites) {
            if (sprite === this || sprite.isProjectile || sprite === this.shooter) continue;
            if (typeof checkAABBCollision !== 'function') { continue; }
            const targetBoundingBox = sprite.getBoundingBox();
            if (!checkAABBCollision(currentBoundingBox, targetBoundingBox)) { continue; }
            if (sprite.isWall) { game.removeSprite(this); return false; }
            if (this.firedByPlayer && sprite.isEnemy) { if (typeof sprite.takeDamage === 'function') { sprite.takeDamage(this.damage, this); } game.removeSprite(this); return false; }
            if (!this.firedByPlayer && sprite.isPlayer) { if (typeof sprite.takeDamage === 'function') { sprite.takeDamage(this.damage, this); } game.removeSprite(this); return false; }
        }
        return false;
    }

    draw(ctx) {
        if (this.animator && this.spriteSheet && this.isSheetLoaded) {
            const frame = this.animator.getCurrentFrame();
            if (!frame) return;

            const drawWidth = this.spriteWidth; const drawHeight = this.spriteHeight;
            const centerX = this.x; const centerY = this.y;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(this.angle);
            ctx.drawImage( this.spriteSheet, frame.x, frame.y, frame.w, frame.h, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight );
            ctx.restore();
        } else if (!this.spriteSheet) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    getBoundingBox() {
        return { x: this.x - this.width / 2, y: this.y - this.height / 2, width: this.width, height: this.height };
    }
}
