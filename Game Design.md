# Game Design Document: Night Watcher

**Version:** 1.0
**Date:** May 9, 2025
**Game Title:** Night Watcher
**Project Name (Internal):** csis250-TheNightWatcher-JohnnyJneid-2025050801

## 1. Introduction

### 1.1. Game Overview
Night Watcher is a 2D top-down tactical stealth game. Players must navigate through levels, avoiding detection by enemies, utilizing limited visibility, managing resources, and strategically eliminating threats.

### 1.2. Genre
Top-Down Tactical Stealth Shooter.

### 1.3. Target Audience
Players who enjoy stealth games, tactical challenges, and resource management. Ages 13+.

### 1.4. Unique Selling Points
* **Limited Visibility Mechanics:** Player's vision cone and "fog of war" create a tense, information-gathering focused experience.
* **Strategic Combat:** Limited ammunition and enemy alertness encourage careful planning over run-and-gun tactics.
* **Resource Management:** Balancing health, shields, and ammo is crucial for survival.

## 2. Story

### 2.1. Premise
In a world shrouded in perpetual twilight due to a cataclysmic event, rogue factions and automated security systems control vital outposts. The player takes on the role of the "Night Watcher," a skilled operative tasked with infiltrating these outposts to retrieve critical intelligence or sabotage enemy operations.

### 2.2. Setting
The game is set in various dimly lit, maze-like industrial complexes, abandoned research facilities, and fortified compounds. The atmosphere is one of tension and isolation.

### 2.3. Main Character: The Night Watcher
A mysterious and highly trained individual, adept at stealth and marksmanship. Their motivations are initially unclear, but their objectives are vital for a larger, unseen cause. The player embodies this character.

### 2.4. Objectives
* Primary: Eliminate all hostile entities in the area to secure it.
* Secondary (Implicit): Survive, manage resources, and explore the environment for supplies.

## 3. Gameplay Mechanics

### 3.1. Core Loop
The gameplay revolves around a "Observe, Plan, Execute, Engage (Optional), Scavenge" loop:
1.  **Observe:** Use limited visibility to study enemy positions, patrol patterns, and environmental layouts.
2.  **Plan:** Strategize movement paths to avoid enemy vision cones, utilizing cover.
3.  **Execute:** Move carefully. Decide whether to sneak past, wait for an opening, or engage.
4.  **Engage:** If necessary, use limited ammunition to eliminate enemies strategically. Be mindful that actions can alert other enemies.
5.  **Scavenge:** Collect ammunition, health, shields, and upgrades scattered throughout the level.

### 3.2. Player Mechanics
* **Movement:** Controlled via WASD or Arrow keys for omnidirectional movement.
* **Aiming & Shooting:**
    * Aiming: Mouse cursor dictates the direction the player is facing and aiming.
    * Shooting: Left Mouse Button (hold or click) fires projectiles.
* **Limited Visibility (Vision Cone):** The player can only clearly see a limited area defined by a forward-facing vision cone. The rest of the map is obscured by a "fog of war."
* **Stats:**
    * **Health (HP):** Player's life force. Reaches 0 results in Game Over for the current level attempt.
    * **Shields (SH):** Temporary damage absorption that recharges over time (currently not recharging, but can be picked up). Takes damage before HP.
    * **Ammunition (Ammo):** Limited resource for the player's weapon.
* **Resource Management:** Ammo is finite, requiring careful shot placement. Health and Shield packs must be collected.
* **Upgrades:** Collectible items can enhance player abilities (e.g., speed boost).
* **Collision:** The player collides with walls and other solid obstacles.

### 3.3. Enemy Mechanics
* **Type:** Currently one enemy type ("Centipede" visually, generic soldier behavior).
* **Patrolling:** Enemies follow predefined patrol paths (currently random directional movement with collision avoidance and periodic random turns).
* **Vision Cone:** Enemies possess a limited field of view (defined by range and angle).
* **Detection:** If the player enters an enemy's vision cone and has a clear line of sight (not blocked by walls), the enemy detects the player.
* **Chasing:** Upon detection, enemies switch to a 'chasing' state, increasing speed and moving towards the player's last known position.
* **Returning/Alert State:** If an enemy loses sight of the player, it moves to the last known position before potentially returning to its patrol. Enemies also react to being shot by moving towards the source of the damage (if known) or becoming more alert.
* **Health:** Enemies have health and can be defeated by player projectiles.
* **Attacks:** Enemies can fire projectiles at the player when in the 'chasing' state and within a certain range.

### 3.4. Stealth System
* Based on enemy vision cones and line-of-sight checks against walls.
* Player actions (e.g., shooting) can alert enemies. (Currently, direct damage alerts them).

### 3.5. Scoring System
* Players earn 100 points for each enemy eliminated.
* The score is displayed in the in-game UI, pause menu, level complete screen, and game over screen.
* Score resets at the start of each level.

## 4. Game Elements

### 4.1. Characters
* **Player (The Night Watcher):** Controlled by the user.
    * Sprite: Humanoid figure with a distinct appearance.
    * Abilities: Movement, shooting, limited vision.
* **Enemies (Centipede Type):** AI-controlled hostiles.
    * Sprite: Multi-segmented "Centipede" like creature.
    * Behavior: Patrol, detect, chase, shoot.

### 4.2. Items (Collectibles)
* **Ammo Pack:** Replenishes player's ammunition. (Yellow box)
* **Health Pack:** Restores player's health. (Lime green box)
* **Shield Pack:** Restores/grants player shields. (Cyan box)
* **Upgrade Pack:** Provides a permanent enhancement, e.g., speed boost. (Fuchsia box)

### 4.3. Environment
* **Walls:** Impassable obstacles that block movement and line of sight.
* **Open Areas:** Navigable spaces.

## 5. Levels

### 5.1. General Structure
Each level is a self-contained map with a specific layout of walls, enemy placements, and item locations. The objective is to eliminate all enemies.

### 5.2. Tutorial Level
* **Purpose:** Introduce basic controls (movement, aiming, shooting) and core concepts (vision cone, item collection, enemy engagement).
* **Features:** Simple layout, minimal enemies (or one for testing win condition), instructional UI text.
* **Progression:** Upon completion, player can choose to start Level 1 or return to the Main Menu.

### 5.3. Level 1
* **Purpose:** Provide a more complex challenge than the tutorial, requiring basic tactical thinking.
* **Features:** More intricate layout with multiple paths and cover opportunities, several enemies with varied patrol patterns.
* **Progression:** Upon completion, automatically transitions to Level 2.

### 5.4. Level 2
* **Purpose:** Test the player's understanding of mechanics with increased difficulty.
* **Features:** Larger, more complex map, more enemies, potentially tighter corridors or more open areas requiring different approaches.
* **Progression:** Upon completion, player returns to the Main Menu (as it's the current final level).

## 6. User Interface (UI)

### 6.1. Main Menu
* Title: "Night Watcher"
* Options:
    * New Game (Starts Tutorial)
    * Pick Level
    * How to Play

### 6.2. In-Game HUD (Heads-Up Display)
* Player Stats: Health bar, Shield bar, Ammo count.
* Score: Current player score.
* Minimap: Scaled-down view of the explored/visible area, showing player, enemies, and walls.
* Tutorial-specific instructions.

### 6.3. Pause Menu
* Accessed by "Escape" key.
* Title: "Paused"
* Current Score display.
* Options:
    * Resume
    * Main Menu

### 6.4. Game Over Screen
* Title: "GAME OVER"
* Final Score display.
* Options:
    * Play Again (Restarts current level)
    * Return to Menu

### 6.5. Level Complete Screen
* Title: "Level Cleared!" (or "Congratulations!" for final level)
* Subtitle: Context-specific message (e.g., "Tutorial Complete!", "Heading to Level 2...").
* Score display.
* Options (context-dependent):
    * Start Level 1 (after Tutorial)
    * Main Menu (after Tutorial, Level 2, or other levels)
    * (Level 1 auto-advances, so no button needed by default)

### 6.6. Level Select Screen
* Title: "Select a Level"
* List of available levels (Tutorial, Level 1, Level 2).
* Option: Back to Menu

### 6.7. How to Play Screen (Tutorial Info State)
* Title: "Tutorial Information"
* Text-based instructions for controls, objectives.
* Option: Click to return to Menu.

## 7. Art & Audio

### 7.1. Visual Style
* **Perspective:** Top-down 2D.
* **Art Style:** Sprite-based characters and items. Simple, clean geometric shapes for walls. Dark, atmospheric color palette with highlights for important elements.
* **Fog of War:** Areas outside the player's vision cone are heavily obscured.

### 7.2. Sound Effects (SFX)
* Player Shooting
* Player Death / Game Over
* Item Collection
* (Potential for: Enemy detection, enemy shooting, enemy death, footsteps)

### 7.3. Music
* **Menu Music:** Atmospheric track for main menu and other non-gameplay screens.
* **In-Game Music (Potential):** Tense, ambient tracks during gameplay to enhance the stealth atmosphere. (Currently not implemented for gameplay).

## 8. Monetization
Not applicable for this project.

## 9. Future Development (Potential Ideas from `readme.md` & Discussion)
* **Enemy AI:**
    * More varied patrol patterns (e.g., vertical, complex paths).
    * Advanced pathfinding.
    * Enemies shooting back (Implemented for Centipede).
    * Different enemy types with unique behaviors/abilities.
* **Player Mechanics:**
    * Sound mechanics (movement noise, weapon noise affecting detection).
    * More weapon types or attachments (silencers, scopes).
    * Melee takedowns.
* **Game Systems:**
    * More levels and refined level progression.
    * Scoring based on more factors (time, stealth, objectives).
    * Lives system.
    * Save/Continue system (checkpoints).
* **Visuals & Audio:**
    * More detailed sprite animations for player and enemies.
    * Additional sound effects for more actions.
    * Dynamic in-game music.
* **Story Expansion:** More narrative elements, cutscenes, or in-game lore.

This GDD will serve as a living document and should be updated as the game evolves.