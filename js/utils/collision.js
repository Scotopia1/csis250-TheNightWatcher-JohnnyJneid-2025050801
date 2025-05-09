// this file contains utility functions for collision detection between two sprites
function checkAABBCollision(rect1, rect2) {
    const xOverlap = rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
    const yOverlap = rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    return xOverlap && yOverlap;
}