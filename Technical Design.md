# Technical Design Document: Night Watcher

**Version:** 1.0
**Date:** May 9, 2025
**Game Title:** Night Watcher

## 1. Introduction

### 1.1. Purpose
This document outlines the technical architecture, systems, algorithms, and implementation details for the "Night Watcher" game. It serves as a reference for development and ensures technical consistency.

### 1.2. Overview
Night Watcher is a 2D top-down stealth game developed using HTML5 Canvas and JavaScript (ES6). It features a custom game engine managing rendering, game logic, input, and UI.

## 2. System Requirements

* **Platform:** Modern Web Browsers supporting:
    * HTML5 Canvas API (for 2D rendering)
    * JavaScript (ES6+ features, including Classes)
    * Pointer Lock API (optional, for enhanced mouse control)
    * Web Audio API (for sound effects and music)
* **Input Devices:** Keyboard and Mouse.

## 3. Game Engine & Architecture

The game is built around a set of interconnected manager classes and a core game loop.

### 3.1. Core `Game` Class (`game.js`)
* **Responsibilities:**
    * Manages the main game loop (`animate` method).
    * Maintains the list of all active game sprites (`this.sprites`).
    * Handles deferred addition (`_spritesToAdd`) and removal (`_spritesToRemove`) of sprites to prevent mid-loop modification issues.
    * Loads and manages game levels (`this.levels`, `setLevel` method).
    * Tracks active enemies (`this.activeEnemies`) and player score (`this.score`).
    * Orchestrates updates to game logic (`updateCore`) and rendering.
    * Initializes and holds references to other manager classes.
* **Game Loop (`animate`):**
    1.  Calculates delta time.
    2.  Retrieves input state from `InputManager`.
    3.  Updates `StateManager` (handles state transitions, including pause via Escape key).
    4.  If in `PLAYING` state:
        * Calls `updateCore` to update all sprites and game logic.
        * Updates the `Camera`.
        * Checks for game over or level complete conditions.
    5.  Calls `Renderer.draw` to render the current game state.
    6.  Resets `InputManager`'s per-frame state (e.g., `mouse.clicked`).
    7.  Uses `requestAnimationFrame` for smooth animation.

### 3.2. `StateManager` (`stateManager.js`)
* **Responsibilities:**
    * Manages the current game state (e.g., `MENU`, `PLAYING`, `GAME_OVER`, `LEVEL_COMPLETE`, `PAUSED`).
    * Defines `GameState` enumeration.
    * Handles transitions between states (`changeState` method).
    * Processes input relevant to the current state (e.g., menu button clicks, pause toggle).
    * Manages menu music playback based on state.
    * Initiates level loading via `game.setLevel()`.
    * Coordinates with `UIManager` to set up UI elements for different states.

### 3.3. `InputManager` (`inputManager.js`)
* **Responsibilities:**
    * Captures keyboard events (`keydown`, `keyup`) and stores key states in `this.keys`.
    * Captures mouse events (`mousemove`, `mousedown`, `mouseup`, `mouseleave`) and stores mouse state in `this.mouse` (position, button state, clicked flag).
    * Handles Pointer Lock API for immersive mouse control during gameplay (`requestPointerLock`, `exitPointerLock`, event listeners).
    * Provides `getInputState()` to make current input accessible.
    * Resets per-frame input states (e.g., `mouse.clicked`, `mouse.dx`, `mouse.dy`) via `reset()`.

### 3.4. `UIManager` (`uiManager.js`)
* **Responsibilities:**
    * Drawing all UI elements based on the current game state.
    * Manages UI components like buttons for different screens (main menu, game over, level complete, pause, level select).
    * `setup...Buttons()` methods dynamically create button objects with positions, dimensions, text, and actions.
    * `draw...Overlay()` methods render specific screens.
    * Displays player stats (HP, Shield, Ammo, Score) via `drawStats()`.
    * Renders the minimap (`drawMinimap()`).
    * Displays tutorial hints and other informational text.

### 3.5. `Renderer` (`renderer.js`)
* **Responsibilities:**
    * Main drawing orchestrator called by the game loop.
    * Clears the canvas each frame.
    * If in `PLAYING` or `GAME_OVER` or `PAUSED` state:
        * Applies camera transformations (`camera.applyTransform`).
        * Draws the game world background.
        * Calls `game.drawCore()` to draw all sprites.
        * Draws the player's vision cone.
        * Restores canvas context.
        * Draws the "fog of war" effect based on player vision.
    * Calls `uiManager.draw()` to render all UI elements on top.

### 3.6. `Camera` (`camera.js`)
* **Responsibilities:**
    * Tracks a target sprite (usually the player).
    * Calculates its `x` and `y` position to keep the target centered in the viewport, clamped within world boundaries.
    * `applyTransform(ctx)`: Translates the canvas context to simulate camera movement.
    * Converts coordinates between viewport and world space (not currently used extensively but available).

## 4. Sprite System

### 4.1. Base `Sprite` Class (`game.js`)
* **Purpose:** Abstract base class for all game objects that are updated and drawn.
* **Key Methods (to be overridden by subclasses):**
    * `update(sprites, keys, mouse, game)`: Contains logic for the sprite's behavior each frame. Returns `true` if the sprite should be removed.
    * `draw(ctx)`: Renders the sprite on the canvas.
    * `getBoundingBox()`: Returns an AABB (Axis-Aligned Bounding Box) object (`{x, y, width, height}`) for collision detection.
* **Common Properties (examples):** `x`, `y`, `width`, `height`, `isWall`, `isPlayer`, `isEnemy`, etc.

### 4.2. Derived Sprite Classes
* **`Player` (`sprites/Player.js`):**
    * Manages player movement, aiming (mouse-based rotation), shooting, health, shield, ammo, upgrades.
    * Handles collision with walls.
    * Manages its own vision cone parameters.
    * Contains logic for taking damage and dying.
    * Uses `Animator` for sprite rendering.
* **`Enemy` (`sprites/Enemy.js`):**
    * Implements AI: patrolling, vision cone detection, chasing, returning to last known position, shooting.
    * Manages health, takes damage, and handles death (including `scoreAwarded` flag).
    * Uses `Animator` for directional walking and death animations.
* **`Projectile` (`sprites/Projectile.js`):**
    * Moves in a straight line based on initial target.
    * Handles collision with walls (removed) and other sprites (players/enemies, dealing damage and then removed).
    * Fired by player or enemy (`firedByPlayer` flag).
    * Uses `Animator` for sprite rendering.
* **`Wall` (`sprites/Wall.js`):**
    * Simple static obstacle. `isWall = true`.
* **`Item` (`sprites/Item.js`):**
    * Collectible object (ammo, health, shield, upgrade).
    * Removed upon collision with the player, applying its effect.

## 5. Level System

### 5.1. Base `Level` Class (`game.js`)
* **Purpose:** Abstract base class for game levels.
* **Key Properties:** `game` (reference to the game instance), `initialEnemyCount` (set by `Game.setLevel`).
* **Key Methods:**
    * `initialize()`: Implemented by each specific level subclass to populate the level with sprites (walls, enemies, items, player) by calling `this.game.addSprite()`.

### 5.2. Level Files (`Levels/Tutorial.js`, `Levels/Level1.js`, `Levels/Level2.js`)
* Each file defines a class that extends `Level`.
* The `initialize()` method contains the specific layout and object placements for that level.

## 6. Core Algorithms & Logic

### 6.1. Collision Detection
* **AABB vs AABB:** `checkAABBCollision(rect1, rect2)` in `utils/collision.js`. Used for player-wall, projectile-wall, player-item, enemy-wall, projectile-enemy, projectile-player collisions.
* **Point in Cone:** `isPointInCone(targetX, targetY, coneCenterX, coneCenterY, coneDirectionAngle, coneFovRadians, coneRange)` in `utils/geometry.js`. Used for player and enemy vision.
* **Line Segment Intersection:** `checkLineSegmentIntersection(x1, y1, x2, y2, x3, y3, x4, y4)` in `utils/geometry.js`. Used for line-of-sight checks to see if vision between two points is blocked by a wall edge.

### 6.2. Player Movement & Rotation
* Movement: Based on WASD/Arrow key input, speed property. Collision with walls prevents movement into them.
* Rotation:
    * If pointer lock active: `currentFacingAngle += mouse.dx * rotationSensitivity`.
    * If pointer lock inactive: `currentFacingAngle` calculated using `Math.atan2` towards mouse cursor world coordinates.

### 6.3. Projectile Logic
* Created with a start position and target position (or angle).
* Velocity calculated based on speed and direction.
* Updates position each frame.
* Removed if out of world bounds or upon collision.

### 6.4. Enemy AI
* **State Machine:** `this.state` property (`patrolling`, `chasing`, `returning`, `dead`).
* **Patrolling:** Moves based on `currentFacingAngle` and `speed`. Turns randomly or upon hitting a wall. `dx_memory` and `dy_memory` track actual movement for animation.
* **Vision:** Uses `isPointInCone` and `checkLineSegmentIntersection` (iterating through wall edges) to detect the player.
* **Chasing:** Moves towards `lastKnownPlayerX`, `lastKnownPlayerY` at increased speed. Shoots if within range and `fireCooldown` is ready.
* **Returning:** Moves towards `lastKnownPlayerX`, `lastKnownPlayerY` if player is no longer visible. Switches to patrolling if destination reached.
* **Shooting:** Creates `Projectile` instances aimed at the player's (last known) position.

### 6.5. Player Vision Cone & Fog of War
* **Vision Cone Data:** `player.visionRange`, `player.visionAngle`, `player.currentFacingAngle`.
* **Fog of War (`Renderer.drawFogOfWar`):**
    1.  Draws the player's vision cone path on the viewport.
    2.  Draws a full-screen rectangle covering the viewport.
    3.  Uses `'evenodd'` fill rule so that the area within the vision cone path is "cut out" from the full-screen rectangle, effectively revealing the cone and obscuring the rest.

### 6.6. Animation System (`utils/animation.js`)
* **`Animator` Class:**
    * Manages a sequence of frames (defined as objects like `{x, y, w, h}` for sprite sheet coordinates).
    * Controls frame duration, looping, and playback.
    * `update(dt)`: Advances frame timer and current frame index.
    * `getCurrentFrame()`: Returns the current frame data for drawing.
    * Sprites that use animation (Player, Enemy, Projectile) have an `animator` instance (or a dictionary of animators for different states/directions like in `Enemy.js`).

### 6.7. Scoring System
* `game.score` variable, reset in `game.setLevel()`.
* `game.addScore(points)` method.
* Points (100) awarded in `game.updateCore()` when a dead enemy with `scoreAwarded = false` is processed for removal. `enemy.scoreAwarded` is then set to `true`.

## 7. Data Structures
* **`game.sprites`:** Array of `Sprite` objects.
* **`game.levels`:** Array of `Level` objects.
* **`inputManager.keys`:** Object mapping key names to boolean (pressed/not pressed).
* **`inputManager.mouse`:** Object storing mouse coordinates, button states, and movement delta.
* **Animation Frames:** Arrays of objects (e.g., `{x, y, w, h}`) within `Animator` instances.

## 8. Asset Pipeline
* **Images:** PNG files for sprite sheets (e.g., `Player.png`, `Centipede.png`, `bullets+plasma.png`). Loaded via `new Image()` and `image.src`.
* **Audio:** WAV files for sound effects (e.g., `shooting.wav`, `collected.wav`, `menubackground.wav`). Loaded via `new Audio()` and `audio.src`.
* **Organization:** Assets are stored in the `assets` directory, with subdirectories for `Player`, `Projectiles`, `Sounds`. Paths are relative (e.g., `../../assets/Player/Player.png` from within a sprite class).

## 9. Code Structure & Conventions
* **Language:** JavaScript (ES6+), utilizing classes for object-oriented design.
* **File Organization:**
    * `js/`: Contains all JavaScript logic.
        * `js/utils/`: Utility functions (collision, geometry, animation).
        * `js/sprites/`: Definitions for all sprite classes.
        * `js/levels/`: Definitions for all level classes.
        * Root `js/`: Core classes (Game, StateManager, InputManager, etc.), and `main.js` for initialization.
    * `css/`: Stylesheets.
    * `assets/`: Game assets (images, sounds).
    * `index.html`: Main HTML file.
* **Modularity:** Code is broken down into classes and modules, each with specific responsibilities.
* **Comments:** (User preference was to remove comments from final code, but generally, thorough commenting is advised for maintainability).

## 10. Future Technical Considerations
* **Pathfinding:** For more intelligent enemy movement (e.g., A* algorithm).
* **Save/Load System:** Could use `localStorage` for simple save states (player progress, current level, stats).
* **Performance Optimization:** If performance becomes an issue with many sprites:
    * Spatial partitioning for collision detection (e.g., quadtrees).
    * Optimizing rendering (e.g., offscreen canvas for static elements).
* **Networking:** (Not in current scope) For potential multiplayer features.
* **More Robust Sound Management:** A dedicated sound manager class to handle loading, playback, volume control, and channels.