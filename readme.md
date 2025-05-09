# Night Watcher - 2D Tactical Stealth Game

**Version:** 1.0 (Reflecting current feature set as of May 2025)

## 1. Introduction

**Night Watcher** is a 2D top-down tactical stealth game developed using HTML5 Canvas and JavaScript. The player, an operative known as the Night Watcher, infiltrates hostile outposts to eliminate threats. The core gameplay focuses on navigating levels while avoiding detection by enemies, utilizing limited visibility, managing resources (health, shields, ammo), and strategic shooting.

This project demonstrates fundamental game development principles, including 2D rendering, collision detection, state management, basic AI, UI implementation, and event handling within a browser environment.

## 2. Story Premise

In a world shrouded in perpetual twilight, rogue factions and automated security systems control vital outposts. The player takes on the role of the "Night Watcher," a skilled operative tasked with infiltrating these outposts to neutralize all hostile entities.

## 3. Gameplay Mechanics

### Core Stealth Loop
1.  **Observe:** Use the limited visibility to observe enemy positions and patrol patterns.
2.  **Plan:** Plan movement to avoid enemy vision cones, using walls for cover.
3.  **Execute:** Move carefully. Decide whether to sneak past, wait for an opening, or engage.
4.  **Engage (Optional):** If necessary, use limited ammo to eliminate enemies strategically.
5.  **Scavenge:** Collect ammo, health, shields, and upgrades scattered throughout the level.

### Player Mechanics
* **Movement:** Controlled via `WASD` or `Arrow` keys.
* **Aiming & Shooting:** Aim using the mouse cursor. Fire projectiles by clicking the `Left Mouse Button`.
* **Limited Visibility:** The player can only see a limited area defined by a forward-facing vision cone. The rest of the map is obscured by "fog of war."
* **Stats:**
  * Health (HP): Player's life. Reaching 0 results in Game Over for the level.
  * Shields (SH): Temporary damage absorption. Takes damage before HP.
  * Ammunition (Ammo): Limited resource for firing.
* **Resource Management:** Ammo is limited. Health and Shield packs can be collected.
* **Upgrades:** Collectible upgrades can enhance player abilities (e.g., speed).
* **Collision:** The player collides with walls and obstacles.

### Enemy Mechanics
* **Type:** "Centipede" visual style with patrolling, detecting, chasing, and shooting behaviors.
* **Patrolling:** Enemies follow randomized patrol paths with collision avoidance.
* **Vision Cone:** Enemies have a limited field of view (range and angle).
* **Detection:** If the player enters an enemy's vision cone with a clear line of sight, the enemy detects the player.
* **Chasing:** Upon detection, enemies increase speed and move towards the player's last known position.
* **Alert State:** If an enemy loses sight, it moves to the last known position before potentially returning to patrol. Enemies also react to being shot.
* **Health:** Enemies have health and can be defeated.
* **Attacks:** Enemies shoot projectiles when chasing and in range.

### Game Systems
* **Scoring:** Players earn 100 points for each enemy eliminated. The score is displayed on the HUD and end-level screens.
* **Levels:**
  * **Tutorial:** Introduces basic mechanics.
  * **Level 1 & Level 2:** Offer progressively challenging layouts and enemy encounters.
* **Game States:**
  * Main Menu: Start game, select level, view instructions.
  * Playing: Active gameplay.
  * Paused: Game is paused, options to resume or return to menu.
  * Level Complete: Shown after successfully clearing all enemies in a level.
  * Game Over: Shown when player health reaches zero.
  * Level Select: Choose a specific level to play.
  * How to Play: Displays instructional text.

## 4. Current Features (Implemented)

* HTML5 Canvas rendering engine.
* Core game loop (`Game` class) managing updates, drawing, and sprite management.
* Level loading system (`Level` class) with three distinct levels: Tutorial, Level 1, and Level 2.
* Player character:
  * WASD/Arrow key movement.
  * Mouse aiming and left-click shooting.
  * Stats: Health, Shield, Ammo.
  * Limited visibility via a vision cone and "fog of war."
* Enemy characters ("Centipede" type):
  * Randomized patrolling behavior with collision avoidance.
  * Vision cone detection (range, angle, Line of Sight checks against walls).
  * State machine (patrolling, chasing, returning to last known position, shooting).
  * Health and damage handling.
  * Directional sprite animations for walking and death.
* Projectiles:
  * Fired by player and enemies.
  * Collision with walls and characters.
  * Animated sprite.
* Collectible items: Ammo, Health, Shield, Speed Upgrade.
* Collision Detection: AABB for most interactions.
* Geometry Utilities: Angle calculation, distance, cone checks, line-segment intersection for line-of-sight.
* Animation System: `Animator` class for sprite sheet animations (Player, Enemy, Projectiles).
* User Interface (UIManager):
  * Main Menu, Level Select, How to Play screen.
  * In-Game HUD (Stats, Score, Minimap, Tutorial Hints).
  * Pause Menu (accessible via `Escape` key) with Resume and Main Menu options.
  * Game Over screen with "Play Again" and "Main Menu" options, displaying final score.
  * Level Complete screen with context-specific options (e.g., "Start Level 1", "Main Menu") and score.
* State Management (`StateManager`): Handles transitions between various game states.
* Camera System: Follows the player and stays within world bounds.
* Scoring System: 100 points per enemy kill, displayed in UI.
* Sound System:
  * Menu background music.
  * Sound effects for shooting, item collection, and game over.

## 5. Controls

* **Movement:** `W`, `A`, `S`, `D` or `ArrowUp`, `ArrowLeft`, `ArrowDown`, `ArrowRight`
* **Aim:** Mouse Cursor
* **Shoot:** `Left Mouse Button`
* **Pause/Resume:** `Escape` Key

## 6. Technology Stack

* HTML5
* CSS3
* JavaScript (ES6 Classes)
* HTML5 Canvas API (for 2D rendering)

## 7. Key Classes and Methods

This section provides an overview of the main classes used in the game and their primary methods.

### 7.1. Core Engine Classes

#### `Game` (in `js/game.js`)
The central class orchestrating the entire game.
* `constructor(canvasId, worldWidth, worldHeight)`: Initializes the canvas, world dimensions, sprite lists, input states, levels, and core properties like score and active enemies.
* `setManagers(managers)`: Stores references to other manager classes (InputManager, StateManager, Camera, Renderer, UIManager).
* `addScore(points)`: Increases the player's score by the given amount.
* `addSprite(sprite)`: Queues a sprite to be added to the game world in the next update cycle.
* `removeSprite(spriteToRemove)`: Queues a sprite to be removed from the game world in the next update cycle.
* `updateCore(inputState)`: Updates all active sprites, handles sprite additions/removals, checks for win conditions, and manages player existence.
* `drawCore(ctx)`: Iterates through and draws all active sprites.
* `animate(timestamp)`: The main game loop, handles timing, input processing, state updates, game logic updates (if not paused), rendering, and schedules the next frame.
* `addLevel(level)`: Adds a new level object to the game's list of available levels.
* `setLevel(index)`: Loads and initializes a specific level by its index, resetting relevant game state (sprites, player, score, active enemies).
* `requestLevelChange(index)`: (Currently not heavily used) Sets a flag for a pending level change.
* `requestNextLevel()`: Attempts to load and start the next level in sequence.
* `requestPreviousLevel()`: Attempts to load and start the previous level in sequence.
* `bindKeyboardEvents()`: Basic keyboard event listener setup (actual state managed by InputManager).
* `bindMouseEvents()`: Basic mouse event listener setup (actual state managed by InputManager).

#### `StateManager` (in `js/stateManager.js`)
Manages the overall game state and transitions.
* `constructor(game, inputManager, uiManager)`: Initializes with references to core game objects and sets up menu/pause buttons and audio.
* `setupMenuAudio()`: Loads and configures the menu background music.
* `playMenuMusic()`: Starts playing the menu music if paused.
* `pauseMenuMusic()`: Pauses the menu music if playing.
* `setupMenuButtons()`: Defines the buttons (position, text, action) for the main menu.
* `changeState(newState)`: Handles the logic for transitioning from the current game state to a new one, including managing music, pointer lock, and UI setup for the new state.
* `startGame(levelIndex)`: Initiates starting or restarting a specific game level.
* `restartCurrentLevel()`: Restarts the currently active level.
* `update()`: Called every frame by the game loop; processes input and performs actions based on the current game state (e.g., handling menu clicks, toggling pause).

#### `InputManager` (in `js/inputManager.js`)
Handles all user input from keyboard and mouse.
* `constructor(canvas, game)`: Sets up event listeners for keyboard and mouse, and initializes input state objects.
* `reset()`: Resets per-frame input states (like `mouse.clicked`, `mouse.dx`, `mouse.dy`) at the end of each game loop iteration.
* `requestPointerLock()`: Attempts to lock the mouse cursor to the canvas for better FPS-style controls.
* `exitPointerLock()`: Releases the mouse cursor from pointer lock.
* `getInputState()`: Returns an object containing the current state of all keys and the mouse.
* `bindKeyboardEvents()`: Attaches `keydown` and `keyup` event listeners to the window.
* `bindMouseEvents()`: Attaches `mousemove`, `mousedown`, `mouseup`, `mouseleave` event listeners to the canvas.
* `bindPointerLockEvents()`: Attaches event listeners for pointer lock changes and errors.
* `handlePointerLockChange()`: Callback for when pointer lock status changes.
* `handlePointerLockError()`: Callback for pointer lock errors.

#### `UIManager` (in `js/uiManager.js`)
Responsible for drawing all user interface elements.
* `constructor(ctx, game, stateManager)`: Initializes with drawing context and references to game/state managers; sets up UI components.
* `setPlayer(player)`: Stores a reference to the player object for UI display.
* `setupGameOverButtons()`: Defines buttons for the Game Over screen.
* `setupLevelSelectButtons()`: Defines buttons for the Level Select screen.
* `setupLevelCompleteButtons(currentLevelIndex)`: Defines buttons for the Level Complete screen, varying by level.
* `setupPauseButtons()`: Defines buttons for the Pause Menu.
* `draw()`: Main drawing method called by the Renderer; calls specific draw methods based on the current game state.
* `drawMenu()`: Renders the main menu UI.
* `drawPlayingUI()`: Renders the in-game HUD (stats, minimap, tutorial hints).
* `drawStats(ctx, player)`: Draws player health, shield, ammo, and current score.
* `drawMinimap(ctx)`: Renders the minimap.
* `drawLevelSelectScreen()`: Renders the level selection UI.
* `drawTutorialScreen()`: Renders the "How to Play" informational screen.
* `drawGameOverOverlay()`: Renders the Game Over screen, including the final score.
* `drawLevelCompleteOverlay()`: Renders the Level Complete screen, including the score.
* `drawPauseOverlay()`: Renders the Pause Menu, including the current score.

#### `Renderer` (in `js/renderer.js`)
Handles the main rendering pipeline.
* `constructor(ctx, game, camera, uiManager)`: Initializes with drawing context and references.
* `draw(gameState)`: Clears the canvas, applies camera transforms, draws game elements (world, sprites, player vision cone, fog of war), and then draws the UI.
* `drawFogOfWar(player)`: Renders the fog of war effect based on the player's vision cone.

#### `Camera` (in `js/camera.js`)
Manages the game's viewport and follows the player.
* `constructor(game, viewportWidth, viewportHeight, worldWidth, worldHeight)`: Initializes camera properties.
* `follow(sprite)`: Sets the sprite (usually player) for the camera to track.
* `update()`: Updates the camera's position to keep the target centered, clamped to world boundaries.
* `applyTransform(ctx)`: Translates the canvas rendering context to simulate camera movement.
* `viewportToWorld(viewportX, viewportY)`: Converts screen coordinates to world coordinates.
* `worldToViewport(worldX, worldY)`: Converts world coordinates to screen coordinates.

### 7.2. Sprite Classes

#### `Sprite` (base class in `js/game.js`)
The base class for all interactive game objects.
* `constructor()`: Basic setup.
* `update(sprites, keys, mouse, game)`: Placeholder for update logic; should be overridden by subclasses. Expected to return `true` if the sprite should be removed from the game.
* `draw(ctx)`: Placeholder for drawing logic; should be overridden.
* `getBoundingBox()`: Returns an object `{x, y, width, height}` representing the sprite's collision area.

#### `Player` (in `js/sprites/Player.js`)
Represents the player character.
* `constructor(game, x, y, size, color, speed, visionRange, visionAngleDegrees)`: Initializes player stats, appearance, and abilities.
* `setupAnimation()`: Configures the player's sprite animation using the `Animator`.
* `update(sprites, keys, mouse, game)`: Handles player movement based on input, collision with walls, aiming, shooting cooldown, animation updates, and checks for death.
* `shoot()`: Creates and fires a `Projectile`. Plays a shooting sound.
* `draw(ctx)`: Draws the player sprite (animated or fallback), rotated to the current facing angle, and an optional shield effect.
* `drawVisionCone(ctx)`: Draws the player's field of vision.
* `drawUI(ctx)`: (Previously used, now stats are drawn by `UIManager.drawStats`)
* `addHealth(amount)`, `addAmmo(amount)`, `addShield(amount)`: Methods to increase player stats.
* `applyUpgrade(upgradeType)`: Applies a collected upgrade (e.g., speed boost).
* `takeDamage(amount, source)`: Reduces player's shield/health when hit. Triggers death if health reaches zero.
* `die()`: Handles player death, changes appearance, stops movement, and plays a game over sound. Sets the player up for removal by `game.js`.
* `getBoundingBox()`: Returns the player's collision box.

#### `Enemy` (in `js/sprites/Enemy.js`)
Represents an AI-controlled enemy.
* `constructor(game, x, y, size, color, speed, patrolDistance, health, visionRange, visionAngleDegrees)`: Initializes enemy properties, AI state, and animation settings.
* `loadSpriteSheet()`: Loads the enemy's sprite sheet.
* `setupAnimations()`: Configures directional walk and death animations.
* `getDirectionIndex(angleRadians)`: Determines the sprite sheet row index based on facing angle for directional sprites.
* `updateAnimation()`: Updates the current animation state and frame.
* `getRandomTurnInterval()`: Helper for randomizing patrol behavior.
* `update(sprites, keys, mouse, game)`: Main AI logic loop, managing states (patrolling, chasing, returning), vision checks, movement, shooting, and death. Returns `true` if the death animation is complete and the sprite should be removed.
* `moveTowards(targetX, targetY, sprites, speed)`: Moves the enemy towards a specific point, handling wall collisions.
* `patrol(sprites, attemptRandomTurn)`: Implements the enemy's patrolling behavior.
* `shoot(targetX, targetY)`: Creates and fires a `Projectile` at the target.
* `checkVision(player, allSprites)`: Determines if the enemy can see the player (cone check + line of sight).
* `takeDamage(amount, source)`: Reduces enemy health and potentially changes its AI state.
* `die()`: Handles enemy death, sets state to 'dead', starts death animation. Score is awarded by `game.js` upon removal.
* `draw(ctx)`: Draws the enemy sprite (animated or fallback), vision cone, and health bar.
* `drawHealthBar(ctx)`: Renders the enemy's health bar above it.
* `drawVisionCone(ctx)`: Renders the enemy's field of vision.
* `getBoundingBox()`: Returns the enemy's collision box.

#### `Projectile` (in `js/sprites/Projectile.js`)
Represents a fired bullet or energy blast.
* `constructor(game, startX, startY, targetX, targetY, speed, damage, collisionSize, fallbackColor, firedByPlayer, shooter)`: Initializes projectile properties, including velocity and shooter.
* `update(sprites, keys, mouse, game)`: Moves the projectile, checks for collisions with walls or characters (player/enemy), and handles damage application. Returns `true` if it should be removed.
* `draw(ctx)`: Draws the projectile sprite (animated or fallback), rotated in its direction of travel.
* `getBoundingBox()`: Returns the projectile's collision box.

#### `Wall` (in `js/sprites/Wall.js`)
A static, impassable environmental obstacle.
* `constructor(game, x, y, width, height, color)`: Initializes wall position, dimensions, and color.
* `update(sprites, keys, mouse)`: Walls are static, so this typically does nothing and returns `false`.
* `draw(ctx)`: Draws the wall as a simple rectangle.
* `getBoundingBox()`: Returns the wall's collision box.

#### `Item` (in `js/sprites/Item.js`)
A collectible item that benefits the player.
* `constructor(game, x, y, itemType, size)`: Initializes item position, type (ammo, health, etc.), and appearance.
* `getColorByType(itemType)`: Helper to determine item color based on its type.
* `update(sprites, keys, mouse)`: Checks for collision with the player. If a collision occurs, applies its effect and returns `true` for removal.
* `applyEffect(player)`: Modifies player stats (e.g., `player.addAmmo()`) based on `itemType`. Plays a collection sound.
* `draw(ctx)`: Draws the item as a simple colored rectangle.
* `getBoundingBox()`: Returns the item's collision box.

### 7.3. Level Classes

#### `Level` (base class in `js/game.js`)
Base class for all game levels.
* `constructor(game)`: Stores a reference to the main game object.
* `initialize()`: Placeholder method to be overridden by specific level classes to add sprites and set up the level.

#### `Tutorial`, `Level1`, `Level2` (in `js/Levels/`)
Specific level implementations, extending `Level`.
* `constructor(gameInstance)`: Calls the parent constructor.
* `initialize()`: Contains the unique code to populate that particular level with `Wall`, `Enemy`, `Item`, and `Player` sprites using `this.game.addSprite()`.

### 7.4. Utility Classes & Functions

#### `Animator` (in `js/utils/animation.js`)
Manages frame-by-frame animation from sprite sheets.
* `constructor(frames, frameDuration, loop)`: Initializes with an array of frame coordinates, duration per frame, and loop behavior.
* `update(dt)`: Advances the animation timer and updates the current frame index based on `frameDuration`. Handles looping or stopping at the end of the animation.
* `getCurrentFrame()`: Returns the data for the current animation frame (e.g., `{x, y, w, h}`).
* `play()`: Starts or resumes the animation.
* `pause()`: Pauses the animation.
* `reset()`: Resets the animation to its first frame and stops it.
* `setFrame(index)`: Manually sets the animation to a specific frame.
* `setOnComplete(callback)`: Sets a callback function to be executed when a non-looping animation finishes.

#### Geometry Utilities (in `js/utils/geometry.js`)
A collection of standalone functions for geometric calculations.
* `calculateAngle(x1, y1, x2, y2)`: Calculates the angle in radians between two points.
* `calculateDistance(x1, y1, x2, y2)`: Calculates the Euclidean distance between two points.
* `normalizeAngle(angleRadians)`: Normalizes an angle to be within the 0 to 2π range.
* `isPointInCone(targetX, targetY, coneCenterX, coneCenterY, coneDirectionAngle, coneFovRadians, coneRange)`: Checks if a target point lies within a defined vision cone.
* `checkLineSegmentIntersection(x1, y1, x2, y2, x3, y3, x4, y4)`: Determines if two line segments intersect and returns the intersection point or false.

#### Collision Utilities (in `js/utils/collision.js`)
A collection of standalone functions for collision detection.
* `checkAABBCollision(rect1, rect2)`: Checks for collision between two AABBs (Axis-Aligned Bounding Boxes).

## 8. Future Development / TODOs

* **Enemy AI:**
  * Implement more sophisticated patrol variations (e.g., defined paths, waypoints).
  * Refine chasing behavior (e.g., basic pathfinding around simple obstacles).
  * Introduce different enemy types with unique abilities or attack patterns.
* **Player Mechanics:**
  * Implement sound mechanics (e.g., player movement noise, weapon noise affecting enemy detection).
  * Add more weapon types or player abilities.
* **Game Systems:**
  * Expand with more levels and a clearer narrative progression.
  * Implement a "Continue" or save/checkpoint system.
  * Introduce a "Lives" system.
  * More diverse scoring (e.g., time bonuses, stealth bonuses).
* **Visuals & Audio:**
  * Enhance player sprite animations (e.g., walking animation).
  * Add more sound effects (enemy alerts, enemy death, footsteps).
  * Implement in-game background music for levels.
* **Story & Narrative:**
  * Integrate more story elements directly into the game (e.g., intro/outro text for levels).
* **Optimization & Balancing:**
  * Optimize drawing and collision checks for performance, especially with more sprites.
  * Balance player/enemy stats, item availability, and overall difficulty across levels.

## 9. Setup & Running

1.  Ensure all files (`index.html`, `style.css`, `js/` directory with all `.js` files, `assets/` directory) are in the correct structure.
2.  Open the `index.html` file in a modern web browser that supports HTML5 Canvas and ES6 JavaScript.