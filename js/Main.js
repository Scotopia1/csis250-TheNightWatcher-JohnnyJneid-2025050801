document.addEventListener('DOMContentLoaded', () => {

    const canvasId = 'gameCanvas';
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`FATAL ERROR: Canvas element with ID '${canvasId}' not found!`);
        return;
    }
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("FATAL ERROR: Could not get 2D rendering context.");
        return;
    }

    try {
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

        cont
        const level1 = new Level1(game);
        const level2 = new Level2(game);
        game.addLevel(level1);
        game.addLevel(level2);

        game.animate(0);

    } catch (error) {
        if (ctx) {
            ctx.fillStyle = 'red';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText("An error occurred. Check the console.", canvas.width / 2, canvas.height / 2);
        }
    }

});