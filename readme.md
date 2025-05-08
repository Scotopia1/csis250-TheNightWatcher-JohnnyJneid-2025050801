# Night Watcher - 2D Tactical Stealth Game

## 1. Introduction

**Night Watcher** is a 2D top-down tactical stealth game developed using HTML5 Canvas and JavaScript. The core gameplay focuses on navigating levels while avoiding detection by enemies, utilizing limited visibility ("fog of war"), and managing resources like health, shields, and ammunition. Players must employ cover, precise timing, and strategic shooting to overcome obstacles and neutralize enemy threats.

This project demonstrates fundamental game development principles, including 2D rendering on HTML5 Canvas, collision detection (AABB and line-segment intersection), basic enemy AI with patrol and chase behaviors, player and enemy stat management, and interactive event handling (keyboard and mouse) within a browser environment. The game features a modular design with distinct classes for game entities, systems, and UI components.

## 2. Gameplay Mechanics

### Player Mechanics

* **Movement:** Controlled via WASD or Arrow keys for directional movement.
* **Aiming & Shooting:** Aim using the mouse cursor. The player character rotates to face the cursor. Fire projectiles by holding the left mouse button.
* **Limited Visibility:** The player can only see a limited area defined by a forward-facing vision cone. The rest of the map is obscured by "fog of war," which is dynamically updated based on the player's position and facing angle.
* **Stats:**
  * **Health (HP):** Represents the player's life. If HP reaches zero, the game is over.
  * **Shields (SH):** Temporary damage absorption. Damage is first applied to shields if available.
  * **Ammunition (Ammo):** Limited resource for firing projectiles.
* **Resource Management:** Ammo is finite, requiring careful and strategic shots. Health, Shield, and Ammo packs can be collected from the game world to replenish these stats.
* **Upgrades:** Collectible "upgrade" items can enhance player abilities (currently implemented as a speed boost).
* **Collision:** The player collides with walls and other solid obstacles, preventing movement through them.

### Enemy Mechanics

* **Patrolling:** Enemies follow predefined patrol paths (currently simple horizontal movement, with logic for turning at patrol limits or randomly).
* **Vision Cone:** Enemies possess a limited field of view, defined by a range, angle, and line-of-sight checks.
* **Detection:** If the player enters an enemy's vision cone and has a clear line of sight (not obstructed by walls), the enemy detects the player.
* **Chasing:** Upon detection, enemies switch to a 'chasing' state. They increase their speed and move towards the player's last known position.
* **Alert State / Returning:** If an enemy loses sight of the player, it navigates to the player's last spotted location. If the player is not re-sighted, the enemy may return to its patrol route. Enemies also react to being shot by moving towards the source of the damage.
* **Health:** Enemies have health points and can be defeated by player projectiles.
* **Shooting:** Enemies can shoot projectiles at the player when in the 'chasing' state and within a preferred engagement distance.

### Core Stealth Loop

1.  **Observe:** Utilize the player's limited visibility to carefully observe enemy positions, patrol patterns, and vision cone coverage.
2.  **Plan:** Strategize movement to avoid enemy vision cones, using walls and obstacles for cover.
3.  **Execute:** Move with caution. Decide whether to sneak past enemies, wait for an opportune moment, or engage them.
4.  **Engage (Optional):** If necessary, use limited ammunition to strategically eliminate enemies. Be mindful that missed shots or loud actions might alert other nearby enemies.
5.  **Scavenge:** Explore the level to collect essential resources like ammo, health packs, shield packs, and ability upgrades.

## 3. Current Features

* **HTML5 Canvas Rendering:** All visuals are rendered using the HTML5 Canvas API.
* **Core Game Loop:** Managed by the `Game` class, handling updates and drawing for all game objects.
* **Modular Entity System:** Game objects (Player, Enemy, Wall, Projectile, Item) inherit from a base `Sprite` class.
* **Level Loading System:** The `Level` class (and its derivatives like `Level1`, `Level2`) handles the setup of game entities for each specific level.
* **Player Character:**
  * WASD/Arrow key movement.
  * Mouse aiming and character rotation.
  * Projectile firing with cooldown.
  * Manages HP, Shield, and Ammo stats.
  * Sprite sheet animation for the player.
* **Wall Obstacles:** Solid objects with AABB collision detection.
* **Enemy Characters:**
  * Basic horizontal patrolling logic with random turning.
  * Health and damage handling.
  * Vision cone detection (range, angle, line-of-sight checks against walls).
  * State machine (patrolling, chasing, returning to last known position).
  * Can fire projectiles at the player.
* **Projectiles:**
  * Fired by player and enemies.
  * Collision detection with walls and opposing entities.
  * Basic sprite animation.
* **Collectible Items:** Ammo, Health, Shield, and Upgrade items that affect player stats upon collision.
* **Player Limited Visibility:** "Fog of War" effect based on the player's vision cone, obscuring unexplored or out-of-sight areas.
* **Camera System:** Follows the player character, keeping them centered within the viewport while respecting world boundaries.
* **Input Management:** Handles keyboard and mouse inputs, including pointer lock for aiming.
* **State Management:** Manages different game states (Menu, Playing, Game Over, etc.) and transitions between them.
* **UI Management:** Displays player stats (HP, Shield, Ammo), a minimap, game menus, and game over screens.
* **Utility Functions:**
  * Collision detection: `checkAABBCollision` (Axis-Aligned Bounding Box).
  * Geometry calculations: `calculateAngle`, `calculateDistance`, `normalizeAngle`, `isPointInCone`, `checkLineSegmentIntersection`.
* **Animation System:** The `Animator` class handles frame-by-frame animation from sprite sheets.

## 4. Controls

* **Movement:** `W`, `A`, `S`, `D` or `ArrowUp`, `ArrowLeft`, `ArrowDown`, `ArrowRight`
* **Aim/Turn:** Mouse Cursor
* **Shoot:** Left Mouse Button (Hold)

## 5. Technology Stack

* HTML5
* CSS3 (for basic page styling)
* JavaScript (ES6 Classes and modern features)
* HTML5 Canvas API (for all 2D rendering)

## 6. Project Structure and UML Schema

The game is structured using JavaScript classes to represent different components and entities.

### 6.1. Core Game Logic and Management

* **`Game`**: The central engine of the game.
  * `constructor(canvasId, worldWidth, worldHeight)`
  * `setManagers(managers)`: Links manager instances (Input, State, Camera, Renderer, UI).
  * `addSprite(sprite)`: Adds a sprite to the game world (deferred addition).
  * `removeSprite(spriteToRemove)`: Removes a sprite from the game world (deferred removal).
  * `updateCore(inputState)`: Updates all active sprites and manages sprite addition/removal.
  * `drawCore(ctx)`: Draws all active sprites.
  * `animate(timestamp)`: The main game loop, orchestrating updates and rendering.
  * `addLevel(level)`, `setLevel(index)`: Manages loading and switching between game levels.
  * `requestLevelChange(index)`, `requestNextLevel()`, `requestPreviousLevel()`: Handles level transition requests.
  * `bindKeyboardEvents()`, `bindMouseEvents()`: Sets up basic input listeners (though `InputManager` is primarily used).
* **`Sprite`**: Base class for all renderable and updatable game objects.
  * `constructor()`
  * `update(sprites, keys, mouse, game)`: Logic for updating the sprite's state. Returns `true` if the sprite should be removed.
  * `draw(ctx)`: Logic for rendering the sprite.
  * `getBoundingBox()`: Returns the collision bounding box for the sprite.
* **`Level`**: Base class for defining game levels.
  * `constructor(game)`
  * `initialize()`: Sets up the sprites (walls, enemies, items, player) for the specific level.
* **`Camera`**: Manages the game's viewport and follows a target sprite.
  * `constructor(game, viewportWidth, viewportHeight, worldWidth, worldHeight)`
  * `follow(sprite)`: Sets the sprite for the camera to track.
  * `update()`: Updates the camera's position based on the target.
  * `applyTransform(ctx)`: Applies translation to the canvas context to simulate camera movement.
  * `viewportToWorld(viewportX, viewportY)`, `worldToViewport(worldX, worldY)`: Coordinate conversion utilities.
* **`InputManager`**: Handles all keyboard and mouse input.
  * `constructor(canvas, game)`
  * `reset()`: Resets frame-specific input states (like `clicked`, `dx`, `dy`).
  * `requestPointerLock()`, `exitPointerLock()`: Manages browser pointer lock for mouse aiming.
  * `getInputState()`: Returns the current state of keys and mouse.
  * `bindKeyboardEvents()`, `bindMouseEvents()`, `bindPointerLockEvents()`: Sets up event listeners.
  * `handlePointerLockChange()`, `handlePointerLockError()`: Callbacks for pointer lock events.
* **`StateManager`**: Manages the different states of the game (e.g., Menu, Playing, Game Over).
  * `constructor(game, inputManager, uiManager)`
  * `setupMenuButtons()`: Defines buttons for the main menu.
  * `changeState(newState)`: Transitions the game to a new state, handling pointer lock.
  * `startGame(levelIndex)`: Initiates gameplay for a specific level.
  * `restartCurrentLevel()`: Restarts the currently active level.
  * `update()`: Updates logic based on the current game state and handles input for state transitions.
* **`UIManager`**: Responsible for drawing all User Interface elements.
  * `constructor(ctx, game, stateManager)`
  * `setPlayer(player)`: Sets the player reference for displaying stats.
  * `setupGameOverButtons()`: Defines buttons for the game over screen.
  * `draw()`: Main draw call, delegates to specific draw methods based on game state.
  * `drawMenu()`, `drawPlayingUI()`, `drawStats(ctx, player)`, `drawMinimap(ctx)`, `drawLevelSelectScreen()`, `drawTutorialScreen()`, `drawGameOverOverlay()`: Specific methods for drawing different UI components.
* **`Renderer`**: Handles the overall rendering process.
  * `constructor(ctx, game, camera, uiManager)`
  * `draw(gameState)`: Clears the canvas and orchestrates the drawing of the game world and UI based on the current game state.
  * `drawFogOfWar(player)`: Renders the "fog of war" effect based on the player's vision.

### 6.2. Sprites (Game Entities)

* **`Wall`** (extends `Sprite`): Represents impassable obstacles.
  * `constructor(game, x, y, width, height, color)`
  * `update(sprites, keys, mouse)`: Basic update (typically does nothing).
  * `draw(ctx)`: Draws a simple colored rectangle.
  * `getBoundingBox()`: Returns its geometric bounds.
* **`Projectile`** (extends `Sprite`): Represents bullets fired by player or enemies.
  * `constructor(game, startX, startY, targetX, targetY, speed, damage, collisionSize, fallbackColor, firedByPlayer, shooter)`
  * `update(sprites, keys, mouse, game)`: Moves the projectile, checks for out-of-bounds, and handles collisions with walls or entities.
  * `draw(ctx)`: Renders the projectile (either as a simple shape or an animated sprite).
  * `getBoundingBox()`: Returns its collision bounds.
  * `animateSheet()`: Initializes sprite sheet animation if applicable.
* **`Player`** (extends `Sprite`): The player-controlled character.
  * `constructor(game, x, y, size, color, speed, visionRange, visionAngleDegrees)`
  * `setupAnimation()`: Initializes the player's sprite sheet animations.
  * `update(sprites, keys, mouse, game)`: Handles movement based on input, aiming, collision with walls, and firing. Updates animation state. Checks for death.
  * `shoot()`: Creates and launches a `Projectile`.
  * `draw(ctx)`: Renders the player (animated sprite) and shield effect if active.
  * `drawVisionCone(ctx)`: (Can be called by Renderer) Draws the player's field of view directly on the game world.
  * `addHealth(amount)`, `addAmmo(amount)`, `addShield(amount)`: Methods to modify player stats.
  * `applyUpgrade(upgradeType)`: Applies collected upgrades.
  * `takeDamage(amount, source)`: Reduces health/shield when hit.
  * `die()`: Handles player death logic and removal from the game.
  * `getBoundingBox()`: Returns the player's collision bounds.
* **`Enemy`** (extends `Sprite`): AI-controlled hostile characters.
  * `constructor(game, x, y, size, color, speed, patrolDistance, health, visionRange, visionAngleDegrees)`
  * `getRandomTurnInterval()`: Utility for patrol behavior.
  * `update(sprites, keys, mouse)`: Manages AI state (patrolling, chasing, returning), vision checks, movement, and shooting.
  * `shoot(targetX, targetY)`: Creates and launches a `Projectile`.
  * `checkVision(player, allSprites)`: Determines if the player is visible to the enemy.
  * `chase(targetX, targetY, sprites)`: Moves the enemy towards a target.
  * `patrol(sprites, attemptRandomTurn)`: Handles patrol movement logic.
  * `takeDamage(amount, source)`: Reduces health when hit and potentially changes AI state.
  * `die()`: Handles enemy death logic.
  * `draw(ctx)`: Renders the enemy, its vision cone, and health bar.
  * `drawHealthBar(ctx)`, `drawVisionCone(ctx)`: Helper drawing methods.
  * `getBoundingBox()`: Returns the enemy's collision bounds.
* **`Item`** (extends `Sprite`): Collectible items that provide benefits to the player.
  * `constructor(game, x, y, itemType, size)`
  * `getColorByType(itemType)`: Determines item color based on its type.
  * `update(sprites, keys, mouse)`: Checks for collision with the player.
  * `applyEffect(player)`: Applies the item's benefit to the player (e.g., adds health, ammo).
  * `draw(ctx)`: Renders the item as a simple colored rectangle.
  * `getBoundingBox()`: Returns its bounds.

### 6.3. Levels

* **`Level1`** (extends `Level`): Defines the layout and entities for the first level.
  * `constructor(gameInstance)`
  * `initialize()`: Populates the game world with `Wall`, `Enemy`, `Item`, and `Player` objects specific to Level 1.
* **`Level2`** (extends `Level`): Defines the layout and entities for the second level.
  * `constructor(gameInstance)`
  * `initialize()`: Populates the game world with `Wall`, `Enemy`, `Item`, and `Player` objects specific to Level 2.

### 6.4. Utilities

* **`Animator`**: Manages sprite sheet animations.
  * `constructor(frames, frameDuration, loop)`
  * `update(dt)`: Advances the animation frame based on delta time and frame duration.
  * `getCurrentFrame()`: Returns the current frame data (x, y, w, h on sprite sheet).
  * `play()`, `pause()`, `reset()`: Controls animation playback.
  * `setFrame(index)`: Manually sets the current animation frame.
  * `setOnComplete(callback)`: Sets a callback function for when a non-looping animation finishes.
* **Geometry Functions** (`js/utils/geometry.js`):
  * `calculateAngle(x1, y1, x2, y2)`
  * `calculateDistance(x1, y1, x2, y2)`
  * `normalizeAngle(angleRadians)`
  * `isPointInCone(targetX, targetY, coneCenterX, coneCenterY, coneDirectionAngle, coneFovRadians, coneRange)`
  * `checkLineSegmentIntersection(x1, y1, x2, y2, x3, y3, x4, y4)`
* **Collision Function** (`js/utils/collision.js`):
  * `checkAABBCollision(rect1, rect2)`

## 7. Setup & Running

1.  Ensure all project files (`index.html`, `style.css`, and the entire `js/` directory with all its subfolders and `.js` files, plus the `images/` directory) are in the correct relative structure.
2.  Open the `index.html` file in a modern web browser that supports HTML5 Canvas and ES6 JavaScript (e.g., Chrome, Firefox, Edge).

## 8. Future Development / TODOs

(As listed in the original `readme.md`, these remain relevant areas for improvement)

* **Enemy AI:**
  * Implement more varied patrol patterns (e.g., vertical, waypoints).
  * Refine chasing behavior, potentially with basic pathfinding (A*).
  * Currently, enemies shoot, but this could be expanded (e.g., different attack types).
* **Player Mechanics:**
  * Implement sound mechanics (movement noise, weapon noise affecting enemy detection).
  * Add more weapon types or attachments (silencers, scopes affecting stats/noise/vision).
* **Game Systems:**
  * Refine Game State Management (e.g., Paused state, Level Complete screens).
  * Add more levels and a clear level progression system.
  * Implement scoring or objectives per level for better player engagement.
* **Visuals & Audio:**
  * Further integrate sprite animations for all entities (enemies, items if applicable).
  * Add sound effects (shooting, enemy alerts, item pickups, footsteps, ambient sounds).
  * Improve overall UI/UX design and feedback.
* **Optimization & Balancing:**
  * Optimize drawing and collision detection, especially with many objects.
  * Balance player/enemy stats, item availability, and overall game difficulty.