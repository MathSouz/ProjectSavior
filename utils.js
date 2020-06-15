function radiansToDegrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

class Vector
{
    constructor(x=0, y=0)
    {
        this.x = x;
        this.y = y;
        this.mag = Math.sqrt(this.x * this.x + this.y * this.y)
    }

    normalize()
    {
        this.x /= this.mag;
        this.y /= this.mag;
        this.mag = Math.sqrt(this.x * this.x + this.y * this.y)
    }
}