const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    LEVEL_SELECT: 'level_select',
    TUTORIAL: 'tutorial',
    GAME_OVER: 'game_over'
};


class StateManager {
    constructor(game, inputManager, uiManager) {
        this.game = game;
        this.inputManager = inputManager;
        this.uiManager = uiManager;
        this.currentState = GameState.MENU;
        this.menuButtons = [];
        this.levelSelectButtons = [];

        this.setupMenuButtons();
        console.log("State Manager initialized, starting state:", this.currentState);
    }

    setupMenuButtons() {
        const buttonW = 200;
        const buttonH = 50;
        const startX = this.game.VIEWPORT_WIDTH / 2 - buttonW / 2;
        const startY = 250;
        const spacing = 70;

        this.menuButtons = [
            {x: startX, y: startY, w: buttonW, h: buttonH, text: 'New Game', action: () => this.startGame(0)}, // New Game always starts Level 0
            {
                x: startX,
                y: startY + spacing,
                w: buttonW,
                h: buttonH,
                text: 'Pick Level',
                action: () => this.changeState(GameState.LEVEL_SELECT)
            },
        ];
    }

    setupLevelSelectButtons() {
        this.levelSelectButtons = [];
        const buttonW = 200;
        const buttonH = 50;
        const startX = this.game.VIEWPORT_WIDTH / 2 - buttonW / 2;
        let startY = 150;
        const spacing = 70;
        const levelsAvailable = this.game.levels.length;

        if (levelsAvailable === 0) {
            console.warn("No levels available to select.");
            this.levelSelectButtons.push({
                x: startX, y: startY + spacing, w: buttonW, h: buttonH, text: 'Back to Menu',
                action: () => this.changeState(GameState.MENU)
            });
            return;
        }

        for (let i = 0; i < levelsAvailable; i++) {
            this.levelSelectButtons.push({
                x: startX,
                y: startY + (i * spacing),
                w: buttonW,
                h: buttonH,
                text: `Level ${i + 1}`,
                levelIndex: i,
                action: () => this.startGame(i)
            });
        }
        this.levelSelectButtons.push({
            x: startX,
            y: startY + (levelsAvailable * spacing),
            w: buttonW,
            h: buttonH,
            text: 'Back to Menu',
            action: () => this.changeState(GameState.MENU)
        });
    }


    changeState(newState) {
        if (this.currentState === newState) {
            return;
        }

        this.currentState = newState;

        if (this.currentState === GameState.PLAYING) {
            this.inputManager.exitPointerLock();
        } else if (this.currentState === GameState.PLAYING) {
            this.inputManager.requestPointerLock();
        } else {
            this.inputManager.exitPointerLock();
            if (this.currentState === GameState.LEVEL_SELECT) {
                this.setupLevelSelectButtons();
            }
        }
    }

    startGame(levelIndex) {
        try {
            const player = this.game.player;
            if (player) {
                if (this.uiManager) {
                    this.uiManager.setPlayer(player);
                }
                if (this.game.camera) {
                    this.game.camera.follow(player);
                }
                this.changeState(GameState.PLAYING);
            } else {
                console.error("Failed start: Player ref not set after level init " + levelIndex);
                this.changeState(GameState.MENU);
            }
        } catch (error) {
            console.error("Error starting game:", error);
            this.changeState(GameState.MENU);
        }
    }

    restartCurrentLevel() {
        console.log("Restarting level:", this.game.currentLevelIndex);
        this.startGame(this.game.currentLevelIndex);
    }

    update() {
        const input = this.inputManager.getInputState();

        switch (this.currentState) {
            case GameState.MENU:
                if (input.mouse.clicked) {
                    for (const button of this.menuButtons) {
                        if (input.mouse.x >= button.x && input.mouse.x <= button.x + button.w &&
                            input.mouse.y >= button.y && input.mouse.y <= button.y + button.h) {
                            button.action();
                            break;
                        }
                    }
                }
                break;
            case GameState.PLAYING:
                if (!this.game.player) {
                    console.warn("StateManager Update: Player missing in PLAYING state, returning to MENU.");
                    this.changeState(GameState.MENU);
                    return;
                }
                this.game.updateCore(input);
                if (!this.game.player) {
                    console.log("StateManager Update: Player became null, changing state to GAME_OVER.");
                    this.changeState(GameState.GAME_OVER);
                }
                break;
            case GameState.LEVEL_SELECT:
                if (input.mouse.clicked) {
                    for (const button of this.levelSelectButtons) {
                        if (input.mouse.x >= button.x && input.mouse.x <= button.x + button.w &&
                            input.mouse.y >= button.y && input.mouse.y <= button.y + button.h) {
                            button.action();
                            break;
                        }
                    }
                }
                break;
            case GameState.TUTORIAL:
                if(!this.game.player) {
                    console.warn("StateManager Update: Player missing in TUTORIAL state, returning to MENU.");
                    this.changeState(GameState.MENU);
                    return;
                }
                this.game.updateCore(input);
                if (!this.game.player) {
                    console.log("StateManager Update: Player became null, changing state to GAME_OVER.");
                    this.changeState(GameState.GAME_OVER);
                }
                break;
            case GameState.GAME_OVER:
                if (input.mouse.clicked && this.uiManager) {
                    for (const button of this.uiManager.gameOverButtons) {
                        if (input.mouse.x >= button.x && input.mouse.x <= button.x + button.w &&
                            input.mouse.y >= button.y && input.mouse.y <= button.y + button.h) {
                            if (button.id === 'play_again') {
                                this.restartCurrentLevel();
                            } else if (button.id === 'return_menu') {
                                this.changeState(GameState.MENU);
                            }
                            break;
                        }
                    }
                }
                break;
        }
    }

}