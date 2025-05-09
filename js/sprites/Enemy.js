class Enemy extends Sprite {
    constructor(game, x, y, size = 40, color = 'red', speed = 1, patrolDistance = 100, health = 50, visionRange = 250, visionAngleDegrees = 80) {
        super();

        this.game = game;
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.baseColor = color;
        this.color = color;
        this.speed = speed;
        this.patrolDistance = patrolDistance;

        this.maxHealth = health;
        this.health = health;

        this.visionRange = visionRange;
        this.visionAngle = visionAngleDegrees * (Math.PI / 180);

        this.directionX = 1;
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
        this.randomTurnChance = 0.5;
    }

    getRandomTurnInterval() {
        return Math.random() * (this.maxPatrolTurnInterval - this.minPatrolTurnInterval) + this.minPatrolTurnInterval;
    }


    update(sprites, keys, mouse) {
        if (this.state === 'dead') {
            return true;
        }
        if (this.hitTimer > 0) this.hitTimer--;
        if (this.fireCooldown > 0) this.fireCooldown--;

        this.targetPlayer = sprites.find(sprite => sprite.isPlayer && sprite.health > 0);
        const canSeePlayer = this.checkVision(this.targetPlayer, sprites);

        switch (this.state) {
            case 'patrolling':
                this.color = this.baseColor;
                this.currentFacingAngle = (this.directionX === 1) ? 0 : Math.PI;
                this.patrolTurnTimer--;
                let attemptRandomTurn = false;
                if (this.patrolTurnTimer <= 0) {
                    attemptRandomTurn = true;
                    this.patrolTurnTimer = this.getRandomTurnInterval();
                }
                if (canSeePlayer) {
                    this.state = 'chasing';
                    this.lastKnownPlayerX = this.targetPlayer.x + this.targetPlayer.width / 2;
                    this.lastKnownPlayerY = this.targetPlayer.y + this.targetPlayer.height / 2;
                } else {
                    this.patrol(sprites, attemptRandomTurn);
                }
                break;
            case 'chasing':
                this.color = 'darkorange';
                this.patrolTurnTimer = this.getRandomTurnInterval();
                if (canSeePlayer) {
                    this.lastKnownPlayerX = this.targetPlayer.x + this.targetPlayer.width / 2;
                    this.lastKnownPlayerY = this.targetPlayer.y + this.targetPlayer.height / 2;
                    const enemyCenterX = this.x + this.width / 2;
                    const enemyCenterY = this.y + this.height / 2;
                    this.currentFacingAngle = calculateAngle(enemyCenterX, enemyCenterY, this.lastKnownPlayerX, this.lastKnownPlayerY);
                    const distanceToPlayer = calculateDistance(enemyCenterX, enemyCenterY, this.lastKnownPlayerX, this.lastKnownPlayerY);
                    if (distanceToPlayer > this.preferredDistance) {
                        this.chase(this.lastKnownPlayerX, this.lastKnownPlayerY, sprites);
                    } else {
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
                this.patrolTurnTimer = this.getRandomTurnInterval();
                if (canSeePlayer) {
                    this.state = 'chasing';
                    this.lastKnownPlayerX = this.targetPlayer.x + this.targetPlayer.width / 2;
                    this.lastKnownPlayerY = this.targetPlayer.y + this.targetPlayer.height / 2;
                } else {
                    const reached = this.chase(this.lastKnownPlayerX, this.lastKnownPlayerY, sprites);
                    if (reached) {
                        this.state = 'patrolling';
                        this.directionX = (this.x >= this.startX) ? 1 : -1;
                        this.currentFacingAngle = (this.directionX === 1) ? 0 : Math.PI;
                    }
                }
                break;
        }
        if (this.health <= 0) {
            this.die();
            return true;
        }
        return false;
    }

    shoot(targetX, targetY) {
        if (typeof Projectile === 'undefined' || this.state === 'dead') return;
        try{
        const startX = this.x + this.width / 2;
        const startY = this.y + this.height / 2;
        console.log("Enemy.shoot() called.");
        const projectile = new Projectile(this.game, startX, startY, targetX, targetY, this.projectileSpeed, this.projectileDamage, 4, this.projectileColor, false, this);
        console.log("projectile created!");
        this.game.addSprite(projectile);
        } catch (error) {
            console.error("Error creating projectile:", error);
        }
    }

    checkVision(player, allSprites) {
        if (!player) return false;
        const enemyCenterX = this.x + this.width / 2;
        const enemyCenterY = this.y + this.height / 2;
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        const distanceToPlayer = calculateDistance(enemyCenterX, enemyCenterY, playerCenterX, playerCenterY);
        if (distanceToPlayer > this.visionRange) return false;
        if (!isPointInCone(playerCenterX, playerCenterY, enemyCenterX, enemyCenterY, this.currentFacingAngle, this.visionAngle, this.visionRange)) {
            return false;
        }
        for (const sprite of allSprites) {
            if (sprite.isWall) {
                const box = sprite.getBoundingBox();
                const edges = [{x1: box.x, y1: box.y, x2: box.x + box.width, y2: box.y}, {
                    x1: box.x,
                    y1: box.y + box.height,
                    x2: box.x + box.width,
                    y2: box.y + box.height
                }, {x1: box.x, y1: box.y, x2: box.x, y2: box.y + box.height}, {
                    x1: box.x + box.width,
                    y1: box.y,
                    x2: box.x + box.width,
                    y2: box.y + box.height
                }];
                for (const edge of edges) {
                    if (checkLineSegmentIntersection(enemyCenterX, enemyCenterY, playerCenterX, playerCenterY, edge.x1, edge.y1, edge.x2, edge.y2)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    chase(targetX, targetY, sprites) {
        const currentSpeed = this.speed * this.chaseSpeedMultiplier;
        const enemyCenterX = this.x + this.width / 2;
        const enemyCenterY = this.y + this.height / 2;
        const angleToTarget = calculateAngle(enemyCenterX, enemyCenterY, targetX, targetY);
        const distanceToTarget = calculateDistance(enemyCenterX, enemyCenterY, targetX, targetY);
        if (distanceToTarget > 1) {
            this.currentFacingAngle = angleToTarget;
            this.directionX = (Math.cos(this.currentFacingAngle) > 0) ? 1 : -1;
        }
        let dx = Math.cos(this.currentFacingAngle) * currentSpeed;
        let dy = Math.sin(this.currentFacingAngle) * currentSpeed;
        if (distanceToTarget < currentSpeed) {
            dx = targetX - enemyCenterX;
            dy = targetY - enemyCenterY;
        }
        const nextX = this.x + dx;
        const nextY = this.y + dy;
        const nextBoundingBox = {x: nextX, y: nextY, width: this.width, height: this.height};
        let collisionX = false;
        let collisionY = false;
        for (const sprite of sprites) {
            if (sprite.isWall) {
                const wallBox = sprite.getBoundingBox();
                if (checkAABBCollision({...nextBoundingBox, y: this.y}, wallBox)) {
                    collisionX = true;
                    dx = 0;
                }
                if (checkAABBCollision({...nextBoundingBox, x: this.x}, wallBox)) {
                    collisionY = true;
                    dy = 0;
                }
            }
        }
        this.x += dx;
        this.y += dy;
        const newDistance = calculateDistance(this.x + this.width / 2, this.y + this.height / 2, targetX, targetY);
        return newDistance < this.width / 2;
    }

    patrol(sprites, attemptRandomTurn) {
        this.currentFacingAngle = (this.directionX === 1) ? 0 : Math.PI;
        let dx = this.speed * this.directionX;
        let collisionX = false;
        let shouldTurn = false;
        if (attemptRandomTurn && Math.random() < this.randomTurnChance) {
            const pDx = this.speed * (this.directionX * -1);
            const pNX = this.x + pDx;
            const pBox = {x: pNX, y: this.y, width: this.width, height: this.height};
            let blocked = false;
            for (const s of sprites) {
                if (s.isWall && checkAABBCollision(pBox, s.getBoundingBox())) {
                    blocked = true;
                    break;
                }
            }
            if (!blocked) {
                this.directionX *= -1;
                dx = this.speed * this.directionX;
                this.currentFacingAngle = (this.directionX === 1) ? 0 : Math.PI;
            }
        }
        for (const sprite of sprites) {
            if (sprite.isWall) {
                const wBox = sprite.getBoundingBox();
                const mBox = {x: this.x + dx, y: this.y, width: this.width, height: this.height};
                if (checkAABBCollision(mBox, wBox)) {
                    collisionX = true;
                    shouldTurn = true;
                    break;
                }
            }
        }
        if (!collisionX) {
            this.x += dx;
            if (Math.abs(this.x - this.startX) >= this.patrolDistance) {
                shouldTurn = true;
                this.x = this.startX + this.patrolDistance * this.directionX;
            }
        }
        if (shouldTurn) {
            this.directionX *= -1;
            this.currentFacingAngle = (this.directionX === 1) ? 0 : Math.PI;
            this.patrolTurnTimer = this.getRandomTurnInterval();
        }
    }

    takeDamage(amount, source = null) {
        if (this.state === 'dead') return;
        this.health -= amount;
        this.hitTimer = this.hitDuration;
        if ((this.state === 'patrolling' || this.state === 'returning') && source) {
            if (source.x !== undefined && source.y !== undefined) {
                this.lastKnownPlayerX = source.x;
                this.lastKnownPlayerY = source.y;
                this.state = 'returning';
            } else {
                this.state = 'chasing';
            }
        } else if (this.state === 'patrolling') {
            this.state = 'chasing';
        }
    }

    die() {
        this.state = 'dead';
        this.color = '#400000';
        this.speed = 0;
    }

    draw(ctx) {
        if (this.hitTimer > 0 && this.state !== 'dead') {
            ctx.fillStyle = (this.hitTimer % 4 < 2) ? 'white' : this.color;
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.fillRect(this.x, this.y, this.width, this.height); // Uses scaled width/height
        if (this.state !== 'dead') {
            this.drawVisionCone(ctx);
        }
        if (this.health < this.maxHealth && this.state !== 'dead') {
            this.drawHealthBar(ctx);
        } // Health bar width uses this.width
    }

    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 5;
        const barX = this.x;
        const barY = this.y - barHeight - 2;
        const healthRatio = Math.max(0, this.health / this.maxHealth);
        ctx.fillStyle = '#555';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = 'lime';
        ctx.fillRect(barX, barY, barWidth * healthRatio, barHeight);
    }

    drawVisionCone(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const angle = this.currentFacingAngle;
        const startAngle = angle - this.visionAngle / 2;
        const endAngle = angle + this.visionAngle / 2;
        let coneFillColor = 'rgba(255, 255, 0, 0.1)';
        let coneStrokeColor = 'rgba(255, 255, 0, 0.2)';
        if (this.state === 'chasing') {
            coneFillColor = 'rgba(255, 100, 0, 0.2)';
            coneStrokeColor = 'rgba(255, 100, 0, 0.4)';
        } else if (this.state === 'returning') {
            coneFillColor = 'rgba(255, 200, 0, 0.15)';
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
        return {x: this.x, y: this.y, width: this.width, height: this.height};
    }
}
