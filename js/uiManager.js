class UIManager {
    constructor(ctx, game, stateManager) {
        this.ctx = ctx;
        this.game = game;
        this.stateManager = stateManager;
        this.player = null;

        this.minimap = {
            x: this.game.VIEWPORT_WIDTH - 170, y: 15, width: 150, height: 115,
            scaleX: 0, scaleY: 0, wallColor: '#AAAAAA', playerColor: 'cyan',
            enemyColor: 'red', bgColor: 'rgba(50, 50, 50, 0.7)'
        };
        if (this.game.WORLD_WIDTH > 0 && this.game.WORLD_HEIGHT > 0) {
            this.minimap.scaleX = this.minimap.width / this.game.WORLD_WIDTH;
            this.minimap.scaleY = this.minimap.height / this.game.WORLD_HEIGHT;
        }


        this.gameOverButtons = [];
        this.setupGameOverButtons();

        this.levelSelectButtons = []; // To store dynamically created level buttons

        console.log("UI Manager initialized.");
    }

    setPlayer(player) {
        this.player = player;
    }

    setupGameOverButtons() {
        const buttonW = 200;
        const buttonH = 50;
        const centerX = this.game.VIEWPORT_WIDTH / 2;
        const startY = this.game.VIEWPORT_HEIGHT / 2 + 60;
        const spacing = 70;

        this.gameOverButtons = [
            { x: centerX - buttonW / 2, y: startY, w: buttonW, h: buttonH, text: 'Play Again', id: 'play_again' },
            {
                x: centerX - buttonW / 2,
                y: startY + spacing,
                w: buttonW,
                h: buttonH,
                text: 'Return to Menu',
                id: 'return_menu'
            },
        ];
    }

    setupLevelSelectButtons() {
        this.levelSelectButtons = []; // Clear previous buttons and ensure it's an array
        const buttonW = 250;
        const buttonH = 50;
        const centerX = this.game.VIEWPORT_WIDTH / 2;
        const startY = 150;
        const spacing = 65;

        if (this.game && this.game.levels && this.game.levels.length > 0) {
            this.game.levels.forEach((level, index) => {
                let levelName;

                if (index === 0 && typeof TutorialLevel !== 'undefined' && level instanceof TutorialLevel) {
                    levelName = "Tutorial";
                } else if (index === 1 && typeof Level1 !== 'undefined' && level instanceof Level1) {
                    levelName = "Level 1";
                } else if (index === 2 && typeof Level2 !== 'undefined' && level instanceof Level2) {
                    levelName = "Level 2";
                } else {
                    levelName = `Level ${index + 1}`; // Fallback
                }

                this.levelSelectButtons.push({
                    x: centerX - buttonW / 2,
                    y: startY + (index * spacing),
                    w: buttonW,
                    h: buttonH,
                    text: levelName,
                    levelIndex: index,
                    id: `select_level_${index}`
                });
            });
        }

        this.levelSelectButtons.push({
            x: centerX - buttonW / 2,
            y: startY + (this.game.levels.length * spacing) + spacing,
            w: buttonW,
            h: buttonH,
            text: 'Back to Menu',
            id: 'back_to_menu_from_select',
            action: () => this.stateManager.changeState(GameState.MENU)
        });
    }


    draw() {
        const state = this.stateManager.currentState;

        switch (state) {
            case GameState.MENU:
                this.drawMenu();
                break;
            case GameState.PLAYING:
                this.drawPlayingUI();
                break;
            case GameState.LEVEL_SELECT:
                if (this.levelSelectButtons.length === 0 || this.levelSelectButtons.length !== this.game.levels.length + 1) {
                    this.setupLevelSelectButtons();
                }
                this.drawLevelSelectScreen();
                break;
            case GameState.TUTORIAL:
                this.drawTutorialScreen();
                break;
            case GameState.GAME_OVER:
                this.drawPlayingUI();
                this.drawGameOverOverlay();
                break;
        }
    }

    drawMenu() {
        this.ctx.fillStyle = '#E0E0E0';
        this.ctx.font = '60px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Night Watcher', this.game.VIEWPORT_WIDTH / 2, 150);

        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const mouse = this.game.inputManager ? this.game.inputManager.mouse : { x: -1, y: -1, isLocked: true };

        for (const button of this.stateManager.menuButtons) {
            const isHovered = !mouse.isLocked && mouse.x >= button.x && mouse.x <= button.x + button.w &&
                mouse.y >= button.y && mouse.y <= button.y + button.h;

            this.ctx.fillStyle = isHovered ? '#666699' : '#444466';
            this.ctx.strokeStyle = '#AAAAAA';
            this.ctx.lineWidth = 2;
            this.ctx.fillRect(button.x, button.y, button.w, button.h);
            this.ctx.strokeRect(button.x, button.y, button.w, button.h);

            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText(button.text, button.x + button.w / 2, button.y + button.h / 2);
        }
    }

    drawPlayingUI() {
        if (this.player) {
            this.drawStats(this.ctx, this.player);
            if (this.game.WORLD_WIDTH > 0 && this.game.WORLD_HEIGHT > 0) {
                if (this.minimap.scaleX === 0 || this.minimap.scaleY === 0) {
                    this.minimap.scaleX = this.minimap.width / this.game.WORLD_WIDTH;
                    this.minimap.scaleY = this.minimap.height / this.game.WORLD_HEIGHT;
                }
                this.drawMinimap(this.ctx);
            }

            if (this.game.currentLevelIndex === 0 && typeof TutorialLevel !== 'undefined' && this.game.levels[0] instanceof TutorialLevel) {
                this.ctx.font = '18px Arial';
                this.ctx.fillStyle = 'yellow';
                this.ctx.textAlign = 'center';
                if (this.player.ammo < 5) {
                    this.ctx.fillText('Find yellow boxes for more ammo!', this.game.VIEWPORT_WIDTH / 2, 50);
                } else {
                    this.ctx.fillText('Use WASD/Arrows to move. Mouse to Aim. Click to Shoot.', this.game.VIEWPORT_WIDTH / 2, 30);
                }
            }
        }
    }

    drawStats(ctx, player) {
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
        const healthRatio = Math.max(0, player.health / player.maxHealth);
        ctx.fillRect(uiX, uiY, barWidth * healthRatio, barHeight);
        ctx.fillStyle = 'white';
        ctx.fillText(`HP: ${player.health}/${player.maxHealth}`, uiX + barWidth + 5, uiY + barHeight / 2);

        ctx.fillStyle = 'gray';
        ctx.fillRect(uiX, uiY + spacing, barWidth, barHeight);
        ctx.fillStyle = 'cyan';
        const shieldRatio = Math.max(0, player.shield / player.maxShield);
        ctx.fillRect(uiX, uiY + spacing, barWidth * shieldRatio, barHeight);
        ctx.fillStyle = 'white';
        ctx.fillText(`SH: ${player.shield}/${player.maxShield}`, uiX + barWidth + 5, uiY + spacing + barHeight / 2);

        ctx.fillStyle = 'white';
        ctx.fillText(`Ammo: ${player.ammo}/${player.maxAmmo}`, uiX, uiY + spacing * 2 + barHeight / 2);
    }

    drawMinimap(ctx) {
        const mm = this.minimap;
        if (mm.scaleX === 0 || mm.scaleY === 0) return;

        ctx.fillStyle = mm.bgColor;
        ctx.fillRect(mm.x, mm.y, mm.width, mm.height);
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;
        ctx.strokeRect(mm.x, mm.y, mm.width, mm.height);

        this.game.sprites.forEach(sprite => {
            if (sprite.isWall) {
                const mmX = mm.x + sprite.x * mm.scaleX;
                const mmY = mm.y + sprite.y * mm.scaleY;
                const mmW = Math.max(1, sprite.width * mm.scaleX);
                const mmH = Math.max(1, sprite.height * mm.scaleY);
                ctx.fillStyle = mm.wallColor;
                ctx.fillRect(mmX, mmY, mmW, mmH);
            }
        });

        this.game.sprites.forEach(sprite => {
            const mmX = mm.x + sprite.x * mm.scaleX;
            const mmY = mm.y + sprite.y * mm.scaleY;
            const mmW = Math.max(1, sprite.width * mm.scaleX);
            const mmH = Math.max(1, sprite.height * mm.scaleY);

            if (sprite.isPlayer) {
                ctx.fillStyle = mm.playerColor;
                const pS = Math.max(3, mmW);
                ctx.fillRect(mmX - pS / 2 + mmW / 2, mmY - pS / 2 + mmH / 2, pS, pS);
            } else if (sprite.isEnemy && sprite.state !== 'dead') {
                ctx.fillStyle = mm.enemyColor;
                const eS = Math.max(2, mmW);
                ctx.fillRect(mmX - eS / 2 + mmW / 2, mmY - eS / 2 + mmH / 2, eS, eS);
            }
        });
    }

    drawLevelSelectScreen() {
        this.ctx.fillStyle = '#111118';
        this.ctx.fillRect(0, 0, this.game.VIEWPORT_WIDTH, this.game.VIEWPORT_HEIGHT);

        this.ctx.font = '40px Arial';
        this.ctx.fillStyle = 'orange';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Select a Level', this.game.VIEWPORT_WIDTH / 2, 80);

        this.ctx.font = '22px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const mouse = this.game.inputManager ? this.game.inputManager.mouse : { x: -1, y: -1, isLocked: true };

        for (const button of this.levelSelectButtons) {
            const isHovered = !mouse.isLocked && mouse.x >= button.x && mouse.x <= button.x + button.w &&
                mouse.y >= button.y && mouse.y <= button.y + button.h;

            this.ctx.fillStyle = isHovered ? '#7777AA' : '#555588';
            this.ctx.strokeStyle = '#CCCCCC';
            this.ctx.lineWidth = 2;
            this.ctx.fillRect(button.x, button.y, button.w, button.h);
            this.ctx.strokeRect(button.x, button.y, button.w, button.h);

            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText(button.text, button.x + button.w / 2, button.y + button.h / 2);
        }
    }

    drawTutorialScreen() {
        this.ctx.fillStyle = '#111118';
        this.ctx.fillRect(0, 0, this.game.VIEWPORT_WIDTH, this.game.VIEWPORT_HEIGHT);

        this.ctx.font = '40px Arial';
        this.ctx.fillStyle = 'lightblue';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Tutorial Information', this.game.VIEWPORT_WIDTH / 2, this.game.VIEWPORT_HEIGHT / 2 - 100);

        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Controls: WASD/Arrows = Move, Mouse = Aim/Turn, Click = Shoot', this.game.VIEWPORT_WIDTH / 2, this.game.VIEWPORT_HEIGHT / 2 - 20);
        this.ctx.fillText('Objective: Avoid detection, defeat enemies, find items.', this.game.VIEWPORT_WIDTH / 2, this.game.VIEWPORT_HEIGHT / 2 + 10);
        this.ctx.fillText('Collect items to replenish Health, Shields, and Ammo.', this.game.VIEWPORT_WIDTH / 2, this.game.VIEWPORT_HEIGHT / 2 + 40);

        this.ctx.font = '22px Arial';
        this.ctx.fillStyle = 'orange';
        this.ctx.fillText('Click to return to Menu', this.game.VIEWPORT_WIDTH / 2, this.game.VIEWPORT_HEIGHT / 2 + 100);
    }

    drawGameOverOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.game.VIEWPORT_WIDTH, this.game.VIEWPORT_HEIGHT);

        this.ctx.font = '50px Arial';
        this.ctx.fillStyle = 'red';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.game.VIEWPORT_WIDTH / 2, this.game.VIEWPORT_HEIGHT / 2 - 60);

        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        const mouse = this.game.inputManager ? this.game.inputManager.mouse : { x: -1, y: -1, isLocked: true };

        for (const button of this.gameOverButtons) {
            const isHovered = !mouse.isLocked && mouse.x >= button.x && mouse.x <= button.x + button.w &&
                mouse.y >= button.y && mouse.y <= button.y + button.h;

            this.ctx.fillStyle = isHovered ? '#993333' : '#662222';
            this.ctx.strokeStyle = '#DDDDDD';
            this.ctx.lineWidth = 2;
            this.ctx.fillRect(button.x, button.y, button.w, button.h);
            this.ctx.strokeRect(button.x, button.y, button.w, button.h);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText(button.text, button.x + button.w / 2, button.y + button.h / 2);
        }
    }
}
