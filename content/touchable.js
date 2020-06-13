class Touchable extends GameObject {
    constructor(state, x, y, radius) {
        super(state, x, y)
        this.radius = radius;
        this.isTouching = false;
    }
}