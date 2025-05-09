// Ensure Sprite, Animator, checkAABBCollision, calculateAngle are loaded

class Player extends Sprite {
    constructor(game, x, y, size = 60, color = 'deepskyblue', speed = 3, visionRange = 250, visionAngleDegrees = 90) {
        super();
        this.game = game;
        this.x = x; // World position (center)
        this.y = y;
        this.drawWidth = size; // Visual size on screen
        this.drawHeight = size;
        this.width = size * 0.7; // Smaller collision box width (adjust as needed)
        this.height = size * 0.7; // Smaller collision box height (adjust as needed)
        this.color = color; // Fallback color
        this.baseSpeed = speed;
        this.speed = speed;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.maxAmmo = 30;
        this.ammo = this.maxAmmo;
        this.maxShield = 100;
        this.shield = 0;
        this.fireRate = 15;
        this.fireCooldown = 0;
        this.visionRange = visionRange;
        this.visionAngle = visionAngleDegrees * (Math.PI / 180);
        this.currentFacingAngle = 0;
        this.rotationSensitivity = 0.004;
        this.isPlayer = true;
        this.upgrades = {speedBoost: 0};

        this.SPRITE_SHEET_COLS = 5;
        this.SPRITE_SHEET_ROWS = 4;
        this.SPRITE_WIDTH = 120;
        this.SPRITE_HEIGHT = 120;

        this.spriteSheet = new Image();
        this.isSheetLoaded = false;
        this.animator = null;

        this.spriteSheet.onload = () => {
            console.log("Player sprite sheet loaded.");
            this.isSheetLoaded = true;
            this.setupAnimation();
        };
        this.spriteSheet.onerror = () => {
            console.error("Failed to load Player.jpg!");
            this.spriteSheet = null;
        };
        this.spriteSheet.src = '../../images/Player/Player.png';
    }

    setupAnimation() {
        if (!this.spriteSheet || typeof Animator === 'undefined') return;

        const playerCol = 1;
        const playerRow = 0;
        const frames = [
            {
                x: playerCol * this.SPRITE_WIDTH,
                y: playerRow * this.SPRITE_HEIGHT,
                w: this.SPRITE_WIDTH,
                h: this.SPRITE_HEIGHT
            }
            ];
        const frameDuration = 15;
        this.animator = new Animator(frames, frameDuration, true);
        console.log("Player animator created.");
    }


    update(sprites, keys, mouse, game) {
        if (this.fireCooldown > 0) {
            this.fireCooldown--;
        }

        if (mouse && mouse.isLocked) {
            this.currentFacingAngle += mouse.dx * this.rotationSensitivity;
        } else if (mouse) {
            const pCX = this.x;
            const pCY = this.y;
            if (typeof calculateAngle === 'function') {
                this.currentFacingAngle = calculateAngle(pCX, pCY, mouse.x + game.camera.x, mouse.y + game.camera.y);
            } else {
                if (mouse.x + game.camera.x !== pCX || mouse.y + game.camera.y !== pCY) {
                    this.currentFacingAngle = Math.atan2(mouse.y + game.camera.y - pCY, mouse.x + game.camera.x - pCX);
                }
            }
        }

        let dx = 0;
        let dy = 0;
        if (keys['w'] || keys['ArrowUp']) dy -= this.speed;
        if (keys['s'] || keys['ArrowDown']) dy += this.speed;
        if (keys['a'] || keys['ArrowLeft']) dx -= this.speed;
        if (keys['d'] || keys['ArrowRight']) dx += this.speed;

        const nextX = this.x + dx;
        const nextY = this.y + dy;
        const nextBox = {x: nextX - this.width / 2, y: nextY - this.height / 2, width: this.width, height: this.height};
        let collX = false;
        let collY = false;
        for (const sprite of sprites) {
            if (sprite.isWall) {
                const wallBox = sprite.getBoundingBox();
                if (typeof checkAABBCollision === 'function') {
                    if (checkAABBCollision({...nextBox, y: this.y - this.height / 2}, wallBox)) collX = true;
                    if (checkAABBCollision({...nextBox, x: this.x - this.width / 2}, wallBox)) collY = true;
                }
            }
        }
        if (!collX) this.x = nextX;
        if (!collY) this.y = nextY;

        if (mouse && mouse.down && this.ammo > 0 && this.fireCooldown <= 0) {
            this.shoot();
            this.ammo--;
            this.fireCooldown = this.fireRate;
        }

        if (this.animator) {
            if (dx !== 0 || dy !== 0) {
                this.animator.play();
                this.animator.update();
            } else {
                this.animator.pause();
            }
        }

        if (this.health <= 0 && this.speed > 0) {
            this.die();
            game.removeSprite(this);
            return false;
        }
        return false;
    }

    shoot() {
        const file = '../../assets/Sounds/shooting.wav';
        const audio = new Audio(file);
        audio.play().then(() => {
                console.log("Shooting sound played.");
            }
        )
        const playerCenterX = this.x;
        const playerCenterY = this.y;
        const offsetDistance = this.drawWidth / 2 + 8;
        const startX = playerCenterX + Math.cos(this.currentFacingAngle) * offsetDistance;
        const startY = playerCenterY + Math.sin(this.currentFacingAngle) * offsetDistance;
        const shootDistance = 1000;
        const targetX = playerCenterX + Math.cos(this.currentFacingAngle) * shootDistance;
        const targetY = playerCenterY + Math.sin(this.currentFacingAngle) * shootDistance;
        const projectile = new Projectile(this.game, startX, startY, targetX, targetY, 8, 10, 8, 'orange', true, this); // Projectile collision size 8
        this.game.addSprite(projectile);
    }


    draw(ctx) {
        const centerX = this.x;
        const centerY = this.y;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.currentFacingAngle);

        if (this.animator && this.spriteSheet && this.isSheetLoaded) {
            const frame = this.animator.getCurrentFrame();
            if (frame) {
                ctx.drawImage(
                    this.spriteSheet,
                    frame.x, frame.y, frame.w, frame.h,
                    -this.drawWidth / 2, -this.drawHeight / 2,
                    this.drawWidth, this.drawHeight
                );
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.drawWidth / 2, -this.drawHeight / 2, this.drawWidth, this.drawHeight);
            }
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.drawWidth / 2, -this.drawHeight / 2, this.drawWidth, this.drawHeight);
            ctx.fillStyle = 'white';
            ctx.fillRect(this.drawWidth * 0.25, -this.drawHeight * 0.1, this.drawWidth * 0.25, this.drawHeight * 0.2);
        }

        ctx.restore();

        if (this.shield > 0) {
            const shieldPadding = this.drawWidth * 0.15;
            ctx.strokeStyle = 'cyan';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - this.drawWidth / 2 - shieldPadding, this.y - this.drawHeight / 2 - shieldPadding, this.drawWidth + 2 * shieldPadding, this.drawHeight + 2 * shieldPadding);
        }
    }

    drawVisionCone(ctx) {
        const centerX = this.x;
        const centerY = this.y;
        const angle = this.currentFacingAngle;
        const startAngle = angle - this.visionAngle / 2;
        const endAngle = angle + this.visionAngle / 2;
        const fill = 'rgba(173, 216, 230, 0.15)';
        const stroke = 'rgba(220, 220, 255, 0.3)';
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, this.visionRange, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawUI(ctx) { /* ... UI drawing ... */
        const uiX = 15;
        const uiY = 20;
        const barHeight = 10;
        const barWidth = 100;
        const spacing = 15;
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'gray';
        ctx.fillRect(uiX, uiY, barWidth, barHeight);
        ctx.fillStyle = 'red';
        const healthRatio = Math.max(0, this.health / this.maxHealth);
        ctx.fillRect(uiX, uiY, barWidth * healthRatio, barHeight);
        ctx.fillStyle = 'white';
        ctx.fillText(`HP: ${this.health}/${this.maxHealth}`, uiX + barWidth + 5, uiY + barHeight / 2);
        ctx.fillStyle = 'gray';
        ctx.fillRect(uiX, uiY + spacing, barWidth, barHeight);
        ctx.fillStyle = 'cyan';
        const shieldRatio = Math.max(0, this.shield / this.maxShield);
        ctx.fillRect(uiX, uiY + spacing, barWidth * shieldRatio, barHeight);
        ctx.fillStyle = 'white';
        ctx.fillText(`SH: ${this.shield}/${this.maxShield}`, uiX + barWidth + 5, uiY + spacing + barHeight / 2);
        ctx.fillStyle = 'white';
        ctx.fillText(`Ammo: ${this.ammo}/${this.maxAmmo}`, uiX, uiY + spacing * 2 + barHeight / 2);
    }

    addHealth(amount) {
        if (this.health <= 0) return;
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    addAmmo(amount) {
        if (this.health <= 0) return;
        this.ammo = Math.min(this.maxAmmo, this.ammo + amount);
    }

    addShield(amount) {
        if (this.health <= 0) return;
        this.shield = Math.min(this.maxShield, this.shield + amount);
    }

    applyUpgrade(upgradeType) {
        if (this.health <= 0) return;
        switch (upgradeType) {
            case 'speed':
                this.upgrades.speedBoost = (this.upgrades.speedBoost || 0) + 1;
                this.speed = this.baseSpeed + this.upgrades.speedBoost * 0.5;
                console.log(`New speed: ${this.speed}`);
                break;
            default:
                console.warn(`Unknown upgrade type: ${upgradeType}`);
        }
    }

    takeDamage(amount, source = null) {
        if (this.health <= 0) return;
        if (this.shield > 0) {
            const shieldDamage = Math.min(this.shield, amount);
            this.shield -= shieldDamage;
            amount -= shieldDamage;
        }
        if (amount > 0) {
            this.health -= amount;
        }
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }

    die() {
        if (this.speed === 0 && this.color === '#555555') return;
        console.error("Player has died!");
        const file = '../../assets/Sounds/gameover.wav';
        const audio = new Audio(file);
        audio.play().then(() => {
                console.log("Game over sound played.");
            }
        )

        this.color = '#555555';
        this.speed = 0;
        this.ammo = 0;
        this.game.removeSprite(this);
    }

    getBoundingBox() {
        return {x: this.x, y: this.y, width: this.width, height: this.height};
    }
}