function calculateAngle(x1, y1, x2, y2) {
    const dy = y2 - y1;
    const dx = x2 - x1;
    return Math.atan2(dy, dx);
}

function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function normalizeAngle(angleRadians) {
    return (angleRadians % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
}

function isPointInCone(targetX, targetY, coneCenterX, coneCenterY, coneDirectionAngle, coneFovRadians, coneRange) {
    const distance = calculateDistance(coneCenterX, coneCenterY, targetX, targetY);
    if (distance > coneRange || distance === 0) {
        return false;
    }

    const angleToTarget = calculateAngle(coneCenterX, coneCenterY, targetX, targetY);

    const normalizedConeAngle = normalizeAngle(coneDirectionAngle);
    const normalizedTargetAngle = normalizeAngle(angleToTarget);

    let angleDifference = normalizedTargetAngle - normalizedConeAngle;

    if (angleDifference > Math.PI) {
        angleDifference -= 2 * Math.PI;
    } else if (angleDifference < -Math.PI) {
        angleDifference += 2 * Math.PI;
    }

    return Math.abs(angleDifference) <= coneFovRadians / 2;
}

function checkLineSegmentIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denominator = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));

    if (denominator === 0) {
        return false;
    }

    const ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denominator;
    const ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denominator;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        const intersectionX = x1 + (ua * (x2 - x1));
        const intersectionY = y1 + (ua * (y2 - y1));
        return {x: intersectionX, y: intersectionY};
    }

    return false;
}