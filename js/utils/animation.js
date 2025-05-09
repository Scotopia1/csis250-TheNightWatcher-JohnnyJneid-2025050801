/**********************************************************************
 * Animator class
 *
 * This class is used to create an animation from a series of frames.
 * It handles the timing of the frames, looping, and
 * provides methods to control the animation.
 *
 **********************************************************************/

class Animator {
    constructor(frames, frameDuration, loop = true) {
        if (!Array.isArray(frames) || frames.length === 0) {
            frames = [null];
        }
        if (frameDuration <= 0) {
            frameDuration = 1;
        }

        this.frames = frames;
        this.frameDuration = frameDuration;
        this.loop = loop;

        this.currentFrameIndex = 0;
        this.frameTimer = 0;
        this.isPlaying = true;
        this.onComplete = null;
    }

    update(dt = 1) {
        if (!this.isPlaying || this.frames.length <= 1) {
            return;
        }

        this.frameTimer += dt;

        if (this.frameTimer >= this.frameDuration) {
            this.frameTimer = 0;

            this.currentFrameIndex++;

            if (this.currentFrameIndex >= this.frames.length) {
                if (this.loop) {
                    this.currentFrameIndex = 0;
                } else {
                    this.currentFrameIndex = this.frames.length - 1;
                    this.isPlaying = false;
                    if (typeof this.onComplete === 'function') {
                        this.onComplete();
                    }
                }
            }
        }
    }

    getCurrentFrame() {
        return this.frames[this.currentFrameIndex];
    }

    play() {
        this.isPlaying = true;
    }

    pause() {
        this.isPlaying = false;
    }

    reset() {
        this.currentFrameIndex = 0;
        this.frameTimer = 0;
        this.isPlaying = false;
    }

    setFrame(index) {
        if (index >= 0 && index < this.frames.length) {
            this.currentFrameIndex = index;
            this.frameTimer = 0;
        } else {
            console.error("Invalid frame index:", index);
        }
    }

    setOnComplete(callback) {
        this.onComplete = callback;
    }
}