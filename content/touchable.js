class Touchable extends GameObject {
    constructor(x, y, radius) {
        super(x, y)
        this.radius = radius;
        this.isTouching = false;
    }
}