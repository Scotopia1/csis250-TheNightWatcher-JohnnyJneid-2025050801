class Enemy extends Sprite {
    constructor(game, x, y, size = 32, color = 'red', speed = 1, patrolDistance = 100, health = 50, visionRange = 250, visionAngleDegrees = 80) {
        super();
        this.game = game;
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.drawWidth = size;
        this.drawHeight = size;
        this.width = size * 0.9;
        this.height = size * 0.9;
        this.baseColor = color;
        this.color = color;
        this.speed = speed;
        this.patrolDistance = patrolDistance;
        this.maxHealth = health;
        this.health = health;
        this.visionRange = visionRange;
        this.visionAngle = visionAngleDegrees * (Math.PI / 180);
        this.currentFacingAngle = 0;
        this.state = 'patrolling';
        this.isEnemy = true;
        this.targetPlayer = null;
        this.lastKnownPlayerX = null;
        this.lastKnownPlayerY = null;
        this.chaseSpeedMultiplier = 1.5;
        this.preferredDistance = 150;
        this.hitTimer = 0;
        this.hitDuration = 10;
        this.fireRate = 60;
        this.fireCooldown = 0;
        this.projectileSpeed = 5;
        this.projectileDamage = 20;
        this.projectileColor = 'magenta';
        this.minPatrolTurnInterval = 180;
        this.maxPatrolTurnInterval = 480;
        this.patrolTurnTimer = this.getRandomTurnInterval();
        this.randomTurnChance = 0.1;
        this.scoreAwarded = false; // Flag to track if score has been given for this enemy

        this.spriteSheet = new Image();
        this.isSheetLoaded = false;
        this.animator = null;
        this.animations = {};

        this.SPRITE_WIDTH = 16;
        this.SPRITE_HEIGHT = 16;
        this.FRAMES_PER_WALK = 4;
        this.NUM_DIRECTIONS = 8;
        this.deathAnimationFrames = 3;
        this.deathAnimationRows = [14, 15]; // Assuming these are correct for your sheet

        this.dx_memory = 0; // For animation tracking
        this.dy_memory = 0; // For animation tracking


        this.loadSpriteSheet();
    }

    loadSpriteSheet() {
        this.spriteSheet.onload = () => {
            this.isSheetLoaded = true;
            this.setupAnimations();
            this.updateAnimation(); // Initial animation setup
        };
        this.spriteSheet.onerror = () => {
            console.error(`Failed to load sprite sheet 'Centipede.png' for enemy at (${this.x}, ${this.y})`);
            this.spriteSheet = null;
        };
        this.spriteSheet.src = '../../assets/Player/Centipede.png'; // Ensure path is correct
    }

    setupAnimations() {
        if (!this.isSheetLoaded || typeof Animator === 'undefined') return;

        const animationStates = {
            'walk': { frames: this.FRAMES_PER_WALK, rows: this.NUM_DIRECTIONS, frameDuration: 10, loop: true },
            'death': { frames: this.deathAnimationFrames, rows: this.deathAnimationRows.length, frameDuration: 15, loop: false }
        };

        for (const stateName in animationStates) {
            const animData = animationStates[stateName];
            this.animations[stateName] = [];
            let numRowsForAnim = (stateName === 'death') ? animData.rows : this.NUM_DIRECTIONS;


            for (let i = 0; i < numRowsForAnim; i++) {
                let frames = [];
                let spriteSheetRow = i;
                if (stateName === 'death') {
                    // Ensure we don't go out of bounds for deathAnimationRows
                    spriteSheetRow = this.deathAnimationRows[i % this.deathAnimationRows.length];
                }


                for (let j = 0; j < animData.frames; j++) {
                    frames.push({
                        x: j * this.SPRITE_WIDTH,
                        y: spriteSheetRow * this.SPRITE_HEIGHT,
                        w: this.SPRITE_WIDTH,
                        h: this.SPRITE_HEIGHT
                    });
                }
                this.animations[stateName][i] = new Animator(frames, animData.frameDuration, animData.loop);
            }
        }
    }
    getDirectionIndex(angleRadians) {
        let angle = normalizeAngle(angleRadians);
        const PI = Math.PI;
        if (angle >= (15 * PI / 8) || angle < (PI / 8)) return 0; // E
        if (angle >= (PI / 8) && angle < (3 * PI / 8)) return 1;   // SE
        if (angle >= (3 * PI / 8) && angle < (5 * PI / 8)) return 2;   // S
        if (angle >= (5 * PI / 8) && angle < (7 * PI / 8)) return 3;   // SW
        if (angle >= (7 * PI / 8) && angle < (9 * PI / 8)) return 4;   // W
        if (angle >= (9 * PI / 8) && angle < (11 * PI / 8)) return 5;  // NW
        if (angle >= (11 * PI / 8) && angle < (13 * PI / 8)) return 6;  // N
        if (angle >= (13 * PI / 8) && angle < (15 * PI / 8)) return 7;  // NE
        return 0; // Default
    }

    updateAnimation() {
        if (!this.isSheetLoaded || typeof Animator === 'undefined' || Object.keys(this.animations).length === 0) return;

        let currentAnimationStateKey = 'walk';
        if (this.state === 'dead') {
            currentAnimationStateKey = 'death';
        }

        const currentAnimationSet = this.animations[currentAnimationStateKey];
        if (!currentAnimationSet || currentAnimationSet.length === 0) {
            this.animator = null;
            return;
        }

        const directionIndex = this.getDirectionIndex(this.currentFacingAngle);
        const targetAnimator = currentAnimationSet[directionIndex];


        if (targetAnimator) {
            if (this.animator !== targetAnimator) {
                if(this.animator) this.animator.pause(); // Pause previous animator
                this.animator = targetAnimator;
                this.animator.reset();
                this.animator.play();
            }
        } else {
            this.animator = null;
            return;
        }

        if (this.animator) {
            const isMoving = (this.state === 'patrolling' || this.state === 'chasing' || this.state === 'returning') && (Math.abs(this.dx_memory) > 0.01 || Math.abs(this.dy_memory) > 0.01);

            if (currentAnimationStateKey === 'walk') {
                if (isMoving) {
                    this.animator.play();
                } else {
                    this.animator.pause();
                    this.animator.setFrame(0); // Reset to first frame when idle
                }
            } else { // For 'death' or other non-walk animations
                this.animator.play();
            }
            this.animator.update(); // Always update the current animator
        }
    }


    getRandomTurnInterval() {
        return Math.random() * (this.maxPatrolTurnInterval - this.minPatrolTurnInterval) + this.minPatrolTurnInterval;
    }

    update(sprites, keys, mouse, game) { // game parameter is added
        if (this.state === 'dead') {
            if (this.animator && this.animator.isPlaying) {
                this.animator.update();
            }
            // Removal is handled by game.js based on animator.isPlaying for death animation
            return !this.animator || !this.animator.isPlaying;
        }

        this.dx_memory = 0; // Reset before movement
        this.dy_memory = 0; // Reset before movement


        if (this.hitTimer > 0) this.hitTimer--;
        if (this.fireCooldown > 0) this.fireCooldown--;

        this.targetPlayer = sprites.find(sprite => sprite.isPlayer && sprite.health > 0);
        const canSeePlayer = this.checkVision(this.targetPlayer, sprites);

        switch (this.state) {
            case 'patrolling':
                this.color = this.baseColor;
                this.patrolTurnTimer--;
                let attemptRandomTurn = false;
                if (this.patrolTurnTimer <= 0) {
                    attemptRandomTurn = true;
                    this.patrolTurnTimer = this.getRandomTurnInterval();
                }
                if (canSeePlayer && this.targetPlayer) {
                    this.state = 'chasing';
                    this.lastKnownPlayerX = this.targetPlayer.x + this.targetPlayer.width / 2; // Center of player
                    this.lastKnownPlayerY = this.targetPlayer.y + this.targetPlayer.height / 2; // Center of player
                } else {
                    this.patrol(sprites, attemptRandomTurn);
                }
                break;
            case 'chasing':
                this.color = 'darkorange';
                this.patrolTurnTimer = this.getRandomTurnInterval(); // Reset timer
                if (canSeePlayer && this.targetPlayer) {
                    this.lastKnownPlayerX = this.targetPlayer.x + this.targetPlayer.width / 2;
                    this.lastKnownPlayerY = this.targetPlayer.y + this.targetPlayer.height / 2;
                    const enemyCenterX = this.x + this.width / 2;
                    const enemyCenterY = this.y + this.height / 2;
                    const distanceToPlayer = calculateDistance(enemyCenterX, enemyCenterY, this.lastKnownPlayerX, this.lastKnownPlayerY);

                    this.currentFacingAngle = calculateAngle(enemyCenterX, enemyCenterY, this.lastKnownPlayerX, this.lastKnownPlayerY);

                    if (distanceToPlayer > this.preferredDistance) {
                        this.moveTowards(this.lastKnownPlayerX, this.lastKnownPlayerY, sprites, this.speed * this.chaseSpeedMultiplier);
                    } else {
                        // Too close, maybe stop or shoot
                        if (this.fireCooldown <= 0) {
                            this.shoot(this.lastKnownPlayerX, this.lastKnownPlayerY);
                            this.fireCooldown = this.fireRate;
                        }
                    }
                } else {
                    this.state = 'returning';
                }
                break;
            case 'returning':
                this.color = 'gold';
                this.patrolTurnTimer = this.getRandomTurnInterval(); // Reset timer
                if (canSeePlayer && this.targetPlayer) {
                    this.state = 'chasing';
                    this.lastKnownPlayerX = this.targetPlayer.x + this.targetPlayer.width / 2;
                    this.lastKnownPlayerY = this.targetPlayer.y + this.targetPlayer.height / 2;
                } else if (this.lastKnownPlayerX != null && this.lastKnownPlayerY != null) {
                    this.currentFacingAngle = calculateAngle(this.x + this.width / 2, this.y + this.height / 2, this.lastKnownPlayerX, this.lastKnownPlayerY);
                    const reached = this.moveTowards(this.lastKnownPlayerX, this.lastKnownPlayerY, sprites, this.speed * this.chaseSpeedMultiplier);
                    if (reached) {
                        this.state = 'patrolling';
                    }
                } else {
                    this.state = 'patrolling'; // Should not happen if lastKnown is set
                }
                break;
        }

        if (this.health <= 0 && this.state !== 'dead') {
            this.die();
        }
        this.updateAnimation();
        return false; // Let game.js handle removal after death animation
    }

    moveTowards(targetX, targetY, sprites, speed) {
        const enemyCenterX = this.x + this.width / 2;
        const enemyCenterY = this.y + this.height / 2;
        const angleToTarget = calculateAngle(enemyCenterX, enemyCenterY, targetX, targetY);

        let dx = Math.cos(angleToTarget) * speed;
        let dy = Math.sin(angleToTarget) * speed;

        const distanceToTarget = calculateDistance(enemyCenterX, enemyCenterY, targetX, targetY);
        if (distanceToTarget < speed) { // Don't overshoot
            dx = targetX - enemyCenterX;
            dy = targetY - enemyCenterY;
        }
        this.dx_memory = dx; // Store actual movement for animation
        this.dy_memory = dy;


        const nextX = this.x + dx;
        const nextY = this.y + dy;
        const nextBoundingBox = { x: nextX, y: nextY, width: this.width, height: this.height };
        let collisionX = false;
        let collisionY = false;

        for (const sprite of sprites) {
            if (sprite === this || !sprite.isWall) continue;
            const wallBox = sprite.getBoundingBox();
            if (checkAABBCollision({ ...nextBoundingBox, y: this.y }, wallBox)) {
                collisionX = true;
            }
            if (checkAABBCollision({ ...nextBoundingBox, x: this.x }, wallBox)) {
                collisionY = true;
            }
        }

        if (!collisionX) this.x = nextX; else this.dx_memory = 0;
        if (!collisionY) this.y = nextY; else this.dy_memory = 0;


        const newDistance = calculateDistance(this.x + this.width / 2, this.y + this.height / 2, targetX, targetY);
        return newDistance < Math.max(this.width / 4, speed * 0.5); // Reached if very close
    }


    patrol(sprites, attemptRandomTurn) {
        if (attemptRandomTurn && Math.random() < this.randomTurnChance) {
            this.currentFacingAngle = Math.random() * 2 * Math.PI;
            this.patrolTurnTimer = this.getRandomTurnInterval();
        }

        const dx = Math.cos(this.currentFacingAngle) * this.speed;
        const dy = Math.sin(this.currentFacingAngle) * this.speed;

        this.dx_memory = dx; // Store actual movement for animation
        this.dy_memory = dy;

        const nextX = this.x + dx;
        const nextY = this.y + dy;
        const nextBoundingBox = { x: nextX, y: nextY, width: this.width, height: this.height };
        let collision = false;

        for (const sprite of sprites) {
            if (sprite === this || !sprite.isWall) continue;
            if (checkAABBCollision(nextBoundingBox, sprite.getBoundingBox())) {
                collision = true;
                break;
            }
        }

        if (!collision) {
            this.x = nextX;
            this.y = nextY;
        } else {
            // Turn around more intelligently, e.g., try a perpendicular turn or reverse
            this.currentFacingAngle = normalizeAngle(this.currentFacingAngle + Math.PI + (Math.random() - 0.5) * (Math.PI / 2));
            this.patrolTurnTimer = this.getRandomTurnInterval(); // Reset timer on collision
            this.dx_memory = 0; // No movement if collided
            this.dy_memory = 0;
        }
    }


    shoot(targetX, targetY) {
        if (typeof Projectile === 'undefined' || this.state === 'dead') return;

        const startX = this.x + this.width / 2;
        const startY = this.y + this.height / 2;
        const projectile = new Projectile(this.game, startX, startY, targetX, targetY, this.projectileSpeed, this.projectileDamage, 4, this.projectileColor, false, this);
        this.game.addSprite(projectile);
    }

    checkVision(player, allSprites) {
        if (!player) return false;

        const enemyCenterX = this.x + this.width / 2;
        const enemyCenterY = this.y + this.height / 2;
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;

        if (!isPointInCone(playerCenterX, playerCenterY, enemyCenterX, enemyCenterY, this.currentFacingAngle, this.visionAngle, this.visionRange)) {
            return false;
        }

        // Line of sight check
        for (const sprite of allSprites) {
            if (sprite.isWall) {
                const box = sprite.getBoundingBox();
                // Check intersection with all four edges of the wall
                const edges = [
                    { x1: box.x, y1: box.y, x2: box.x + box.width, y2: box.y }, // Top
                    { x1: box.x, y1: box.y + box.height, x2: box.x + box.width, y2: box.y + box.height }, // Bottom
                    { x1: box.x, y1: box.y, x2: box.x, y2: box.y + box.height }, // Left
                    { x1: box.x + box.width, y1: box.y, x2: box.x + box.width, y2: box.y + box.height }  // Right
                ];
                for (const edge of edges) {
                    if (checkLineSegmentIntersection(enemyCenterX, enemyCenterY, playerCenterX, playerCenterY, edge.x1, edge.y1, edge.x2, edge.y2)) {
                        return false; // Vision blocked by a wall
                    }
                }
            }
        }
        return true; // Player is in cone and line of sight is clear
    }

    takeDamage(amount, source = null) {
        if (this.state === 'dead') return;

        this.health -= amount;
        this.hitTimer = this.hitDuration; // For visual feedback

        if ((this.state === 'patrolling' || this.state === 'returning') && source && source.x !== undefined && source.y !== undefined) {
            this.lastKnownPlayerX = source.x;
            this.lastKnownPlayerY = source.y;
            this.state = 'returning'; // Or 'chasing' if you want immediate aggression
        } else if (this.state === 'patrolling') {
            // If no source, or source isn't a sprite (e.g. trap), just become alert
            this.state = 'chasing'; // Or some other alert state if player position unknown
        }
    }

    die() {
        if (this.state === 'dead') return; // Prevent multiple calls

        this.state = 'dead';
        this.speed = 0;
        this.dx_memory = 0;
        this.dy_memory = 0;


        // Score is awarded in game.js when this enemy is processed for removal
        // this.game.addScore(100); // Moved to game.js

        if (this.animations['death'] && this.animations['death'].length > 0) {
            const directionIndex = this.getDirectionIndex(this.currentFacingAngle);
            // Ensure death animation exists for the direction, or use a default
            this.animator = this.animations['death'][directionIndex % this.animations['death'].length];
            if (this.animator) {
                this.animator.reset();
                this.animator.play();
                this.animator.setOnComplete(() => {
                    // The game loop will remove the sprite when animator.isPlaying is false
                });
            }
        } else {
            // If no death animation, mark for immediate removal by stopping any current animation
            if(this.animator) this.animator.isPlaying = false;
        }
    }


    draw(ctx) {
        if (this.isSheetLoaded && this.animator) {
            const frame = this.animator.getCurrentFrame();
            if (frame) {
                const centerX = this.x + this.width / 2;
                const centerY = this.y + this.height / 2;

                ctx.save();
                ctx.translate(centerX, centerY);
                // No rotation needed if using directional sprites
                ctx.drawImage(
                    this.spriteSheet,
                    frame.x, frame.y, frame.w, frame.h,
                    -this.drawWidth / 2, -this.drawHeight / 2, // Draw centered
                    this.drawWidth, this.drawHeight
                );
                ctx.restore();
            }
        } else if (this.state !== 'dead') { // Fallback if sheet not loaded or no animator
            ctx.fillStyle = (this.hitTimer > 0 && this.hitTimer % 4 < 2) ? 'white' : this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else if (this.state === 'dead' && !this.isSheetLoaded) { // Fallback for dead if sheet fails
            ctx.fillStyle = '#400000'; // Dark red for dead fallback
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }


        // Draw vision cone and health bar only if not dead
        if (this.state !== 'dead') {
            this.drawVisionCone(ctx);
            if (this.health < this.maxHealth) { // Only draw health bar if damaged
                this.drawHealthBar(ctx);
            }
        }
    }

    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 5;
        const barX = this.x;
        const barY = this.y - barHeight - 2; // Position above the enemy

        const healthRatio = Math.max(0, this.health / this.maxHealth);

        ctx.fillStyle = '#555'; // Background of health bar
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = 'lime'; // Foreground (actual health)
        ctx.fillRect(barX, barY, barWidth * healthRatio, barHeight);
    }

    drawVisionCone(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const angle = this.currentFacingAngle;

        const startAngle = angle - this.visionAngle / 2;
        const endAngle = angle + this.visionAngle / 2;

        let coneFillColor = 'rgba(255, 255, 0, 0.1)'; // Yellowish for patrol
        let coneStrokeColor = 'rgba(255, 255, 0, 0.2)';

        if (this.state === 'chasing') {
            coneFillColor = 'rgba(255, 100, 0, 0.2)'; // Orangish-red for chasing
            coneStrokeColor = 'rgba(255, 100, 0, 0.4)';
        } else if (this.state === 'returning') {
            coneFillColor = 'rgba(255, 200, 0, 0.15)'; // Orange for returning
            coneStrokeColor = 'rgba(255, 200, 0, 0.3)';
        }

        ctx.fillStyle = coneFillColor;
        ctx.strokeStyle = coneStrokeColor;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, this.visionRange, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
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
