const canvasId = 'gameCanvas';
const canvas = document.getElementById(canvasId);
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');

const game = new Game(canvasId);
const inputManager = new InputManager(canvas);
const camera = new Camera(game, game.VIEWPORT_WIDTH, game.VIEWPORT_HEIGHT, game.WORLD_WIDTH, game.WORLD_HEIGHT);
const stateManager = new StateManager(game, inputManager, null);
const uiManager = new UIManager(ctx, game, stateManager);
stateManager.uiManager = uiManager;
const renderer = new Renderer(ctx, game, camera, uiManager);

game.setManagers({
    inputManager: inputManager,
    stateManager: stateManager,
    camera: camera,
    renderer: renderer,
    uiManager: uiManager
});

const tutorialLevel = new Tutorial(game);
const level1 = new Level1(game);
const level2 = new Level2(game);

game.addLevel(level1);
game.addLevel(level2);
game.addLevel(tutorialLevel);


console.log("Levels added to game engine.");
console.log("Starting main game loop via game.animate()...");

game.animate(0);