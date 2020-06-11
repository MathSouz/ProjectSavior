function radiansToDegrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}