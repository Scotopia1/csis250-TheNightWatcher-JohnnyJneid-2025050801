# Night Watcher - 2D Tactical Stealth Game

## 1. Introduction

**Night Watcher** is a 2D top-down tactical stealth game developed using HTML5 Canvas and JavaScript. The core gameplay focuses on navigating levels while avoiding detection by enemies, utilizing limited visibility and managing resources. The player must use cover, timing, and strategic shooting to overcome obstacles and enemies.

This project aims to demonstrate fundamental game development principles, including 2D rendering, collision detection, basic AI, and event handling within a browser environment.

## 2. Gameplay Mechanics

### Player Mechanics

* **Movement:** Controlled via WASD or Arrow keys.
* **Aiming & Shooting:** Aim using the mouse cursor. Fire projectiles by holding the left mouse button.
* **Limited Visibility:** The player can only see a limited area defined by a forward-facing vision cone. The rest of the map is obscured by "fog of war".
* **Stats:** The player manages Health (HP), Shields (temporary damage absorption), and Ammunition (Ammo).
* **Resource Management:** Ammo is limited, requiring careful shots. Health and Shield packs can be collected to replenish stats.
* **Upgrades:** Collectible upgrades can enhance player abilities (e.g., speed).
* **Collision:** The player collides with walls and obstacles.

### Enemy Mechanics

* **Patrolling:** Enemies follow predefined patrol paths (currently simple horizontal movement).
* **Vision Cone:** Enemies have a limited field of view (defined by range and angle).
* **Detection:** If the player enters an enemy's vision cone and has a clear line of sight (not blocked by walls), the enemy detects the player.
* **Chasing:** Upon detection, enemies switch to a 'chasing' state, increasing speed and moving towards the player's last known position.
* **Alert State:** If an enemy loses sight of the player, it moves to the last known position before potentially returning to its patrol. Enemies also react to being shot by moving towards the source of the damage.
* **Health:** Enemies have health and can be defeated by player projectiles.

### Core Stealth Loop

1.  **Observe:** Use the limited visibility to observe enemy positions and patrol patterns.
2.  **Plan:** Plan movement to avoid enemy vision cones, using walls for cover.
3.  **Execute:** Move carefully. Decide whether to sneak past, wait for an opening, or engage.
4.  **Engage (Optional):** If necessary, use limited ammo to eliminate enemies strategically. Be aware that missed shots or noisy actions might alert others.
5.  **Scavenge:** Collect ammo, health, shields, and upgrades scattered throughout the level.

## 3. Current Features (Implemented)

* HTML5 Canvas rendering engine.
* Core game loop (`Game` class managing updates and drawing).
* Level loading system (`Level` class).
* Player character with WASD/Arrow key movement, mouse aiming, and shooting.
* Player stats (HP, Shield, Ammo) and UI display.
* Wall obstacles with collision detection.
* Enemy characters with basic horizontal patrolling, health, and damage handling.
* Enemy vision cone detection (range, angle, Line of Sight checks against walls).
* Enemy state machine (patrolling, chasing, returning to last known position).
* Player projectile firing and collision (walls, enemies).
* Collectible items (Ammo, Health, Shield, Upgrade) that affect player stats upon collision.
* Player limited visibility ("Fog of War") based on a vision cone.
* Utility functions for collision (AABB) and geometry (angles, distance, cone checks, line intersection).

## 4. Controls

* **Movement:** `W`, `A`, `S`, `D` or `ArrowUp`, `ArrowLeft`, `ArrowDown`, `ArrowRight`
* **Aim:** Mouse Cursor
* **Shoot:** Left Mouse Button (Hold)

## 5. Technology Stack

* HTML5
* CSS3
* JavaScript (ES6 Classes)
* HTML5 Canvas API (for 2D rendering)

## 6. Future Development / TODOs

* **Enemy AI:**
    * Implement patrol variations (random changes, vertical paths).
    * Refine chasing behavior (pathfinding?).
    * Add enemy attacks (shooting back).
* **Player Mechanics:**
    * Implement sound mechanics (movement noise, weapon noise affecting detection).
    * Add more weapon types or attachments (silencers, scopes affecting stats/noise/vision).
* **Game Systems:**
    * Implement Game State Management (Menu, Paused, Game Over, Level Complete).
    * Add multiple levels and level progression logic.
    * Implement scoring or objectives per level.
* **Visuals & Audio:**
    * Integrate sprite animations using the `Animator` utility.
    * Add sound effects (shooting, detection, item pickup, etc.).
    * Improve UI/UX.
* **Optimization & Balancing:**
    * Optimize drawing and collision checks for performance.
    * Balance player/enemy stats, item availability, and difficulty.

## 7. Setup & Running

1.  Ensure all files (`index.html`, `style.css`, `js/` directory with all `.js` files) are in the correct structure.
2.  Open the `index.html` file in a modern web browser that supports HTML5 Canvas and ES6 JavaScript.
