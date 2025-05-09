/******************************************************************
 * StateManager.js
 *
 * This module manages the game states and transitions between them.
 * It handles the main menu, level selection, tutorial, game over,
 * level completion, and paused states.
 *
 * ****************************************************************/

const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    LEVEL_SELECT: 'level_select',
    TUTORIAL: 'tutorial',
    GAME_OVER: 'game_over',
    LEVEL_COMPLETE: 'level_complete',
    PAUSED: 'paused'
};

class StateManager {
    constructor(game, inputManager, uiManager) {
        this.game = game;
        this.inputManager = inputManager;
        this.uiManager = uiManager;
        this.currentState = GameState.MENU;
        this.menuButtons = [];
        this.menuMusic = null;
        this.levelCompleteButtons = [];
        this.pauseButtons = [];

        this.setupMenuButtons();
        this.setupMenuAudio();
    }

    setupMenuAudio() {
        const menuMusicPath = '../assets/Sounds/menubackground.wav';
        this.menuMusic = new Audio(menuMusicPath);
        this.menuMusic.loop = true;
        this.menuMusic.volume = 0.3;
        this.menuMusic.onerror = () => {
            console.error(`Failed to load menu music from: ${menuMusicPath}`);
            this.menuMusic = null;
        };
        this.menuMusic.preload = 'auto';
    }

    playMenuMusic() {
        if (this.menuMusic && this.menuMusic.paused) {
            const playPromise = this.menuMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    console.log("Menu music started.");
                })
            }
        }
    }

    pauseMenuMusic() {
        if (this.menuMusic && !this.menuMusic.paused) {
            this.menuMusic.pause();
            console.log("Menu music paused.");
        }
    }

    setupMenuButtons() {
        const buttonW = 200;
        const buttonH = 50;
        const startX = this.game.VIEWPORT_WIDTH / 2 - buttonW / 2;
        const startY = 250;
        const spacing = 70;

        this.menuButtons = [
            {
                x: startX,
                y: startY,
                w: buttonW,
                h: buttonH,
                text: 'New Game',
                action: () => this.startGame(this.game.levels.findIndex(level => level instanceof Tutorial))
            },
            {
                x: startX,
                y: startY + spacing,
                w: buttonW,
                h: buttonH,
                text: 'Pick Level',
                action: () => {
                    if (this.uiManager) {
                        this.uiManager.setupLevelSelectButtons();
                    }
                    this.changeState(GameState.LEVEL_SELECT);
                }
            },
            {
                x: startX,
                y: startY + spacing * 2,
                w: buttonW,
                h: buttonH,
                text: 'How to Play',
                action: () => this.changeState(GameState.TUTORIAL)
            },
        ];
    }

    changeState(newState) {
        if (this.currentState === newState) return;
        console.log(`>>> State Changing from ${this.currentState} to ${newState}`);

        const nonMusicStates = [GameState.PLAYING, GameState.PAUSED];
        const musicStates = [GameState.MENU, GameState.LEVEL_SELECT, GameState.GAME_OVER, GameState.LEVEL_COMPLETE];

        if (nonMusicStates.includes(this.currentState) && musicStates.includes(newState)) {
            this.playMenuMusic();
        } else if (musicStates.includes(this.currentState) && nonMusicStates.includes(newState)) {
            this.pauseMenuMusic();
        }


        if (this.currentState === GameState.PLAYING && newState !== GameState.PAUSED) {
            this.inputManager.exitPointerLock();
        }
        if (this.currentState === GameState.PAUSED && newState === GameState.PLAYING) {
            this.inputManager.requestPointerLock();
        }


        this.currentState = newState;

        if (this.currentState === GameState.PLAYING) {
            this.inputManager.requestPointerLock();
        } else if (this.currentState !== GameState.PAUSED) {
            this.inputManager.exitPointerLock();
        }


        if (this.currentState === GameState.LEVEL_COMPLETE) {
            if (this.uiManager) {
                this.uiManager.setupLevelCompleteButtons(this.game.currentLevelIndex);
            }
        } else if (this.currentState === GameState.PAUSED) {
            if (this.uiManager) {
                this.uiManager.setupPauseButtons();
            }
            this.inputManager.exitPointerLock();
        }
    }

    startGame(levelIndex) {
        console.log(`Attempting to start level with index: ${levelIndex}`);
        this.pauseMenuMusic();

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
                console.error("StateManager: Failed to start game because player was not found after level load for index " + levelIndex);
                this.changeState(GameState.MENU);
            }
        } else {
            console.error("StateManager: Failed to start game because level could not be set for index " + levelIndex);
            this.changeState(GameState.MENU);
        }
    }

    restartCurrentLevel() {
        console.log("Restarting current level:", this.game.currentLevelIndex);
        this.pauseMenuMusic();

        if (this.game.currentLevelIndex !== -1) {
            this.startGame(this.game.currentLevelIndex);
        } else {
            console.warn("No current level to restart, returning to menu.");
            this.changeState(GameState.MENU);
        }
    }

    update() {
        const input = this.inputManager.getInputState();

        if (input.keys['Escape']) {
            if (this.currentState === GameState.PLAYING) {
                this.changeState(GameState.PAUSED);
            } else if (this.currentState === GameState.PAUSED) {
                this.changeState(GameState.PLAYING);
            }
            input.keys['Escape'] = false;
        }

        switch (this.currentState) {
            case GameState.MENU:
                if (input.mouse.clicked && !this.inputManager.mouse.isLocked) {
                    for (const button of this.menuButtons) {
                        if (input.mouse.x >= button.x && input.mouse.x <= button.x + button.w &&
                            input.mouse.y >= button.y && input.mouse.y <= button.y + button.h) {
                            if (this.menuMusic && this.menuMusic.paused) {
                                this.playMenuMusic();
                            }
                            button.action();
                            break;
                        }
                    }
                }
                break;
            case GameState.PLAYING:
                if (!this.game.player) {
                    this.changeState(GameState.GAME_OVER);
                    return;
                }
                // Game logic update is handled by game.animate
                if (!this.game.player && this.currentState === GameState.PLAYING) {
                    this.changeState(GameState.GAME_OVER);
                }
                break;
            case GameState.PAUSED:
                if (input.mouse.clicked && !this.inputManager.mouse.isLocked && this.uiManager) {
                    for (const button of this.uiManager.pauseButtons) {
                        if (input.mouse.x >= button.x && input.mouse.x <= button.x + button.w &&
                            input.mouse.y >= button.y && input.mouse.y <= button.y + button.h) {
                            button.action();
                            break;
                        }
                    }
                }
                break;
            case GameState.LEVEL_SELECT:
                if (input.mouse.clicked && !this.inputManager.mouse.isLocked && this.uiManager) {
                    for (const button of this.uiManager.levelSelectButtons) {
                        if (input.mouse.x >= button.x && input.mouse.x <= button.x + button.w &&
                            input.mouse.y >= button.y && input.mouse.y <= button.y + button.h) {
                            if (this.menuMusic && this.menuMusic.paused && this.currentState === GameState.MENU) {
                                this.playMenuMusic();
                            }
                            if (button.id === 'back_to_menu_from_select' && typeof button.action === 'function') {
                                button.action();
                            } else if (typeof button.levelIndex === 'number') {
                                this.startGame(button.levelIndex);
                            }
                            break;
                        }
                    }
                }
                break;
            case GameState.TUTORIAL:
                if (input.mouse.clicked && !this.inputManager.mouse.isLocked) {
                    this.changeState(GameState.MENU);
                }
                break;
            case GameState.GAME_OVER:
                if (input.mouse.clicked && !this.inputManager.mouse.isLocked && this.uiManager) {
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
            case GameState.LEVEL_COMPLETE:
                if (input.mouse.clicked && !this.inputManager.mouse.isLocked && this.uiManager) {
                    for (const button of this.uiManager.levelCompleteButtons) {
                        if (input.mouse.x >= button.x && input.mouse.x <= button.x + button.w &&
                            input.mouse.y >= button.y && input.mouse.y <= button.y + button.h) {
                            button.action();
                            break;
                        }
                    }
                }
                const level1Index = this.game.levels.findIndex(level => level instanceof Level1);
                if (this.game.currentLevelIndex === level1Index && this.uiManager.levelCompleteButtons.length === 0) {
                    const level2Index = this.game.levels.findIndex(level => level instanceof Level2);
                    if (level2Index !== -1) {
                        setTimeout(() => {
                            if (this.currentState === GameState.LEVEL_COMPLETE) {
                                this.startGame(level2Index);
                            }
                        }, 1500);
                    } else {
                        this.changeState(GameState.MENU);
                    }
                }
                break;
        }
    }
}
