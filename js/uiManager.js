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
        this.minimap.scaleX = this.minimap.width / this.game.WORLD_WIDTH;
        this.minimap.scaleY = this.minimap.height / this.game.WORLD_HEIGHT;

        this.gameOverButtons = [];
        this.setupGameOverButtons();

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
            {x: centerX - buttonW / 2, y: startY, w: buttonW, h: buttonH, text: 'Play Again', id: 'play_again'},
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
        const mouse = this.game.inputManager ? this.game.inputManager.mouse : {x: -1, y: -1};
        for (const button of this.stateManager.menuButtons) {
            const isHovered = mouse.x >= button.x && mouse.x <= button.x + button.w && mouse.y >= button.y && mouse.y <= button.y + button.h && !mouse.isLocked;
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
            this.drawMinimap(this.ctx);
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
        this.ctx.fillText('Select Level', this.game.VIEWPORT_WIDTH / 2, 100);

        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        const mouse = this.game.inputManager ? this.game.inputManager.mouse : {x: -1, y: -1};

        for (const button of this.stateManager.levelSelectButtons) {
            const isHovered = mouse.x >= button.x && mouse.x <= button.x + button.w &&
                mouse.y >= button.y && mouse.y <= button.y + button.h && !mouse.isLocked;

            this.ctx.fillStyle = isHovered ? '#775533' : '#553311';
            this.ctx.strokeStyle = '#DDDDDD';
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
        this.ctx.fillText('Tutorial (TODO)', this.game.VIEWPORT_WIDTH / 2, this.game.VIEWPORT_HEIGHT / 2 - 20);
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Controls: WASD/Arrows=Move, Mouse=Aim/Turn, Click=Shoot', this.game.VIEWPORT_WIDTH / 2, this.game.VIEWPORT_HEIGHT / 2 + 30);
        this.ctx.fillText('Objective: Avoid detection, defeat enemies, find items.', this.game.VIEWPORT_WIDTH / 2, this.game.VIEWPORT_HEIGHT / 2 + 60);
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
        const mouse = this.game.inputManager ? this.game.inputManager.mouse : {x: -1, y: -1};

        for (const button of this.gameOverButtons) {
            const isHovered = mouse.x >= button.x && mouse.x <= button.x + button.w &&
                mouse.y >= button.y && mouse.y <= button.y + button.h && !mouse.isLocked;

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
