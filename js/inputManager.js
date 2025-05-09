/*************************************************************************
 *  inputManager.js
 *
 *      This file contains the InputManager class, which is responsible for
 *      handling user input from the keyboard and mouse. It manages the state
 *      of keys and mouse events, including mouse movement, clicks, and
 *      pointer lock functionality.
 *
 ************************************************************************************/

class InputManager {
    constructor(canvas, game = null) {
        this.canvas = canvas;
        this.game = game;
        this.keys = {};
        this.mouse = {
            x: 0, y: 0,
            dx: 0, dy: 0,
            down: false, clicked: false,
            isLocked: false
        };

        this.bindKeyboardEvents();
        this.bindMouseEvents();
        this.bindPointerLockEvents();
        console.log("Input Manager initialized.");
    }

    reset() {
        this.mouse.clicked = false;
        this.mouse.dx = 0;
        this.mouse.dy = 0;
    }

    requestPointerLock() {
        if (!this.mouse.isLocked) {
            this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
                this.canvas.mozRequestPointerLock ||
                this.canvas.webkitRequestPointerLock;
            if (this.canvas.requestPointerLock) {
                this.canvas.requestPointerLock();
            } else {
                console.warn("Pointer Lock API not supported by this browser.");
            }
        }
    }

    exitPointerLock() {
        if (this.mouse.isLocked) {
            document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
            if (document.exitPointerLock) document.exitPointerLock();
        }
    }

    getInputState() {
        return {
            keys: this.keys,
            mouse: this.mouse
        };
    }

    bindKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    bindMouseEvents() {
        this.canvas.addEventListener("mousemove", (e) => {
            if (this.mouse.isLocked) {
                this.mouse.dx += e.movementX || e.mozMovementX || e.webkitMovementX || 0;
                this.mouse.dy += e.movementY || e.mozMovementY || e.webkitMovementY || 0;
            } else {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            }
        });
        this.canvas.addEventListener("mousedown", (e) => {
            if (e.target === this.canvas) {
                this.mouse.down = true;
                this.mouse.clicked = true;
            }
        });
        this.canvas.addEventListener("mouseup", (e) => {
            if (e.target === this.canvas) {
                this.mouse.down = false;
            }
        });
        this.canvas.addEventListener("mouseleave", () => {
            this.mouse.down = false;
        });
    }

    bindPointerLockEvents() {
        document.addEventListener('pointerlockchange', this.handlePointerLockChange.bind(this), false);
        document.addEventListener('mozpointerlockchange', this.handlePointerLockChange.bind(this), false);
        document.addEventListener('webkitpointerlockchange', this.handlePointerLockChange.bind(this), false);
        document.addEventListener('pointerlockerror', this.handlePointerLockError.bind(this), false);
        document.addEventListener('mozpointerlockerror', this.handlePointerLockError.bind(this), false);
        document.addEventListener('webkitpointerlockerror', this.handlePointerLockError.bind(this), false);
    }

    handlePointerLockChange() {
        if (document.pointerLockElement === this.canvas || document.mozPointerLockElement === this.canvas || document.webkitPointerLockElement === this.canvas) {
            this.mouse.isLocked = true;
            console.log('Pointer Lock active.');
        } else {
            this.mouse.isLocked = false;
            console.log('Pointer Lock inactive.');
            this.mouse.dx = 0;
            this.mouse.dy = 0;
        }
    }

    handlePointerLockError() {
        console.error('Pointer Lock Error.');
        this.mouse.isLocked = false;
    }

}