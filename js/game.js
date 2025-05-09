class Sprite {
    constructor() {
    }

    update(sprites, keys, mouse, game) {
        return false;
    }
    draw(ctx) {
    }

    getBoundingBox() {
        return {x: this.x || 0, y: this.y || 0, width: this.width || 0, height: this.height || 0};
    }
}

class Level {
    constructor(game) {
        this.game = game;
        this.initialEnemyCount = 0;
    }

    initialize() {
        console.warn("Level.initialize() not implemented for this level.");
    }
}


class Game {
    constructor(canvasId = 'gameCanvas', worldWidth = 5200, worldHeight = 4000) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with ID '${canvasId}' not found!`);
        }
        this.ctx = this.canvas.getContext('2d');

        this.WORLD_WIDTH = worldWidth;
        this.WORLD_HEIGHT = worldHeight;
        this.VIEWPORT_WIDTH = this.canvas.width;
        this.VIEWPORT_HEIGHT = this.canvas.height;

        this.sprites = [];
        this._spritesToAdd = [];
        this._spritesToRemove = [];

        this.keys = {};
        this.mouse = {x: 0, y: 0, down: false, clicked: false};

        this.levels = [];
        this.currentLevelIndex = -1;
        this.pendingLevelIndex = null;

        this.inputManager = null;
        this.stateManager = null;
        this.camera = null;
        this.renderer = null;
        this.uiManager = null;
        this.player = null;

        this.lastTime = 0;
        this.activeEnemies = 0;

        this.bindKeyboardEvents(); // Basic listeners, InputManager will handle more advanced state
        this.bindMouseEvents(); // Basic listeners

        console.log("Core Game Engine Initialized (Ready for Manager Refs).");
    }

    setManagers(managers) {
        this.inputManager = managers.inputManager;
        this.stateManager = managers.stateManager;
        this.camera = managers.camera;
        this.renderer = managers.renderer;
        this.uiManager = managers.uiManager;
        console.log("Managers linked to Game Engine.");
    }

    addSprite(sprite) {
        if (sprite instanceof Sprite) {
            this._spritesToAdd.push(sprite);
            if (sprite.isProjectile) {
                // console.log(`+++ Projectile QUEUED for addition.`);
            }
            if (sprite.isEnemy) {
                // this.activeEnemies++; // This is now handled more robustly in setLevel
                // console.log(`Enemy added. Active enemies: ${this.activeEnemies}`);
            }
        } else {
            console.error("Attempted to add non-Sprite object:", sprite);
        }
    }

    removeSprite(spriteToRemove) {
        if (spriteToRemove) {
            this._spritesToRemove.push(spriteToRemove);
            if (spriteToRemove.isProjectile) {
                // console.log(`+++ Projectile QUEUED for removal.`);
            }
        }
    }

    updateCore(inputState) {
        let playerStillExists = (this.player != null);

        for (const sprite of this.sprites) {
            const shouldRemove = sprite.update(this.sprites, inputState.keys, inputState.mouse, this); // Pass full inputState.keys
            if (shouldRemove) {
                this.removeSprite(sprite);
            }
        }
        if (this._spritesToRemove.length > 0) {
            this._spritesToRemove.forEach(removedSprite => {
                if (removedSprite.isEnemy && removedSprite.state === 'dead') {
                    this.activeEnemies--;
                    console.log(`Enemy removed. Active enemies: ${this.activeEnemies}`);
                }
            });

            this.sprites = this.sprites.filter(sprite => {
                const shouldKeep = !this._spritesToRemove.includes(sprite);
                if (!shouldKeep && sprite === this.player) {
                    console.log("Player removed during update processing.");
                    this.player = null;
                    playerStillExists = false;
                }
                return shouldKeep;
            });
            this._spritesToRemove = [];
        }

        if (this._spritesToAdd.length > 0) {
            this.sprites.push(...this._spritesToAdd);
            for (const addedSprite of this._spritesToAdd) {
                if (addedSprite.isPlayer) {
                    this.player = addedSprite;
                    playerStillExists = true;
                    if (this.camera) {
                        this.camera.follow(this.player);
                    }
                    if (this.uiManager) {
                        this.uiManager.setPlayer(this.player);
                    }
                    console.log("Player reference set via deferred add.");
                }
            }
            this._spritesToAdd = [];
        }

        if (!playerStillExists && this.currentLevelIndex !== -1) {
            this.player = this.sprites.find(sprite => sprite.isPlayer);
            if (this.player) playerStillExists = true;
        }

        if (this.stateManager && this.stateManager.currentState === GameState.PLAYING && this.activeEnemies === 0) {
            const currentLevelObject = this.levels[this.currentLevelIndex];
            const wasAnyEnemyInLevel = currentLevelObject && currentLevelObject.initialEnemyCount > 0;
            const isTutorialLevel = currentLevelObject instanceof Tutorial;


            if (wasAnyEnemyInLevel) {
                console.log("All enemies defeated! Level complete.");
                this.stateManager.changeState(GameState.LEVEL_COMPLETE);
            } else if (currentLevelObject && currentLevelObject.initialEnemyCount === 0 && isTutorialLevel) {
                console.log("Tutorial section with no enemies cleared.");
                this.stateManager.changeState(GameState.LEVEL_COMPLETE);
            }
        }

        return {playerStillExists};
    }

    drawCore(ctx) {
        for (const sprite of this.sprites) {
            if (typeof sprite.draw === 'function') {
                sprite.draw(ctx);
            } else {
                console.warn("Sprite missing draw method:", sprite);
            }
        }
    }

    animate(timestamp) {
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        const inputState = this.inputManager.getInputState();

        this.stateManager.update(); // Update state first, handles pause input

        let playerStillExists = (this.player != null);

        // Only update game logic if playing
        if (this.stateManager.currentState === GameState.PLAYING) {
            const updateResult = this.updateCore(inputState);
            playerStillExists = updateResult.playerStillExists;

            if (this.player && playerStillExists) {
                this.camera.update();
            }
            if (!playerStillExists && this.currentLevelIndex !== -1 && this.stateManager.currentState === GameState.PLAYING) {
                this.stateManager.changeState(GameState.GAME_OVER);
            }
        }

        this.renderer.draw(this.stateManager.currentState);

        this.inputManager.reset(); // Reset click state AFTER all updates for the frame

        requestAnimationFrame((ts) => this.animate(ts));
    }


    addLevel(level) {
        if (level instanceof Level && typeof level.initialize === 'function') {
            this.levels.push(level);
            level.initialEnemyCount = 0;
        } else {
            console.error("Invalid level object added:", level);
        }
    }

    setLevel(index) {
        if (index >= 0 && index < this.levels.length) {
            console.log(`Setting level to index: ${index}`);
            this.sprites = [];
            this._spritesToAdd = [];
            this._spritesToRemove = [];
            this.player = null;
            this.activeEnemies = 0;
            this.currentLevelIndex = index;
            const currentLevelObject = this.levels[index];
            currentLevelObject.initialEnemyCount = 0;

            try {
                currentLevelObject.initialize();

                let tempEnemyCount = 0;
                this._spritesToAdd.forEach(s => {
                    if (s.isEnemy) tempEnemyCount++;
                });
                currentLevelObject.initialEnemyCount = tempEnemyCount;
                console.log(`Level ${index} initialized with ${currentLevelObject.initialEnemyCount} enemies (from _spritesToAdd).`);


                if (this._spritesToAdd.length > 0) {
                    this.sprites.push(...this._spritesToAdd);
                    this.player = this.sprites.find(s => s.isPlayer);
                    if (this.player) {
                        if (this.camera) this.camera.follow(this.player);
                        if (this.uiManager) this.uiManager.setPlayer(this.player);
                        this.camera.x = this.player.x + this.player.width / 2 - this.VIEWPORT_WIDTH / 2;
                        this.camera.y = this.player.y + this.player.height / 2 - this.VIEWPORT_HEIGHT / 2;
                        this.camera.x = Math.max(0, Math.min(this.camera.x, this.WORLD_WIDTH - this.VIEWPORT_WIDTH));
                        this.camera.y = Math.max(0, Math.min(this.camera.y, this.WORLD_HEIGHT - this.VIEWPORT_HEIGHT));
                    } else {
                        console.error("Player sprite not found after level initialization!");
                    }
                    this._spritesToAdd = [];
                }
                // Recalculate activeEnemies from the sprites array directly after initialization
                this.activeEnemies = this.sprites.filter(s => s.isEnemy && s.state !== 'dead').length;
                currentLevelObject.initialEnemyCount = this.activeEnemies; // Ensure initialEnemyCount matches actual spawned enemies
                console.log(`Active enemies after setLevel and processing additions: ${this.activeEnemies}. Initial set to: ${currentLevelObject.initialEnemyCount}`);


                return this.player != null;

            } catch (error) {
                console.error(`Error initializing level ${index}:`, error);
                return false;
            }
        } else {
            console.error(`Attempted to load invalid level index: ${index}`);
            return false;
        }
    }

    requestLevelChange(index) {
        if (index >= 0 && index < this.levels.length) {
            this.pendingLevelIndex = index;
        } else {
            console.warn(`Requested invalid level index: ${index}`);
        }
    }

    requestNextLevel() {
        const nextIndex = this.currentLevelIndex + 1;
        if (nextIndex < this.levels.length) {
            if (this.stateManager) this.stateManager.startGame(nextIndex);
            else this.requestLevelChange(nextIndex);
            return true;
        } else {
            console.log("No next level available.");
            if (this.stateManager) this.stateManager.changeState(GameState.MENU);
            return false;
        }
    }

    requestPreviousLevel() {
        const prevIndex = this.currentLevelIndex - 1;
        if (prevIndex >= 0) {
            if (this.stateManager) this.stateManager.startGame(prevIndex);
            else this.requestLevelChange(prevIndex);
            return true;
        } else {
            console.log("No previous level available.");
            return false;
        }
    }

    bindKeyboardEvents() {
        // These are intentionally left basic as InputManager handles the stateful key object
        window.addEventListener('keydown', (e) => {
            // this.keys[e.key] = true; // InputManager handles this
        });
        window.addEventListener('keyup', (e) => {
            // this.keys[e.key] = false; // InputManager handles this
        });
    }
    bindMouseEvents() {
        this.canvas.addEventListener("mousemove", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left; // InputManager handles this
            this.mouse.y = e.clientY - rect.top; // InputManager handles this
        });
        this.canvas.addEventListener("mousedown", (e) => {
            if (e.target === this.canvas) { // InputManager handles this
                this.mouse.down = true;
                this.mouse.clicked = true;
            }
        });
        this.canvas.addEventListener("mouseup", (e) => {
            if (e.target === this.canvas) { // InputManager handles this
                this.mouse.down = false;
            }
        });
        this.canvas.addEventListener("mouseleave", () => {
            this.mouse.down = false; // InputManager handles this
        });
    }
}
