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

    // --- Instantiate Core Components ---
    try {
        const game = new Game(canvasId); // Create core engine first
        const inputManager = new InputManager(canvas);
        const camera = new Camera(game, game.VIEWPORT_WIDTH, game.VIEWPORT_HEIGHT, game.WORLD_WIDTH, game.WORLD_HEIGHT);
        const stateManager = new StateManager(game, inputManager, null); // Pass null for uiManager initially
        const uiManager = new UIManager(ctx, game, stateManager); // Now pass stateManager
        stateManager.uiManager = uiManager; // Set the reference in stateManager
        const renderer = new Renderer(ctx, game, camera, uiManager);

        // --- Link Managers to Game Instance ---
        game.setManagers({
            inputManager: inputManager,
            stateManager: stateManager,
            camera: camera,
            renderer: renderer,
            uiManager: uiManager
        });

        // --- Load Levels ---
        if (typeof Level1 !== 'undefined' && typeof Level2 !== 'undefined') {
            const level1 = new Level1(game);
            const level2 = new Level2(game);
            game.addLevel(level1);
            game.addLevel(level2);
            console.log("Levels added to game engine.");
            // Set initial level (e.g., level 0) - Game starts in MENU, level loaded by StateManager.startGame
            // game.setLevel(0); // No longer needed here, StateManager handles it
        } else {
            console.error("Level1 or Level2 class not defined! Check script loading order.");
        }

        // --- Start Game Loop ---
        console.log("Starting main game loop via game.animate()...");
        // Start the loop using the method within the Game instance
        game.animate(0); // Pass initial timestamp (0 or performance.now())

    } catch (error) {
        console.error("Error during game initialization:", error);
        if (ctx) {
            ctx.fillStyle = 'red';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText("An error occurred. Check the console.", canvas.width / 2, canvas.height / 2);
        }
    }

});