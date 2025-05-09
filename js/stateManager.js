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

        this.setupMenuButtons();
    }

    setupMenuButtons() {
        const buttonW = 200;
        const buttonH = 50;
        const startX = this.game.VIEWPORT_WIDTH / 2 - buttonW / 2;
        const startY = 250;
        const spacing = 70;
        this.menuButtons = [{
            x: startX,
            y: startY,
            w: buttonW,
            h: buttonH,
            text: 'New Game',
            action: () => this.startGame(0)
        }, {
            x: startX,
            y: startY + spacing,
            w: buttonW,
            h: buttonH,
            text: 'Pick Level',
            action: () => this.changeState(GameState.LEVEL_SELECT)
        }, {
            x: startX,
            y: startY + spacing * 2,
            w: buttonW,
            h: buttonH,
            text: 'Tutorial',
            action: () => this.changeState(GameState.TUTORIAL)
        },];
    }

    changeState(newState) {
        if (this.currentState === newState) return;

        console.log(`>>> State Changing from ${this.currentState} to ${newState}`);

        if (this.currentState === GameState.PLAYING) {
            this.inputManager.exitPointerLock();
        }

        this.currentState = newState;

        if (this.currentState === GameState.PLAYING) {
            this.inputManager.requestPointerLock();
        } else {
            this.inputManager.exitPointerLock();
        }
    }

    startGame(levelIndex) {
        if (this.game.setLevel(levelIndex)) {
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
        } else {
            console.error("Failed start: Level could not be set.");
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
                        if (input.mouse.x >= button.x && input.mouse.x <= button.x + button.w && input.mouse.y >= button.y && input.mouse.y <= button.y + button.h) {
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
                this.game.updateCore(input); // Update game logic first
                if (!this.game.player) {
                    console.log("StateManager Update: Player became null, changing state to GAME_OVER."); // DEBUG
                    this.changeState(GameState.GAME_OVER);
                }
                break;
            case GameState.LEVEL_SELECT:
                if (input.mouse.clicked) this.changeState(GameState.MENU);
                break;
            case GameState.TUTORIAL:
                if (input.mouse.clicked) this.changeState(GameState.MENU);
                break;
            case GameState.GAME_OVER:
                if (input.mouse.clicked && this.uiManager) {
                    for (const button of this.uiManager.gameOverButtons) {
                        if (input.mouse.x >= button.x && input.mouse.x <= button.x + button.w && input.mouse.y >= button.y && input.mouse.y <= button.y + button.h) {
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