class Controls {
    constructor() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }
}

class Touch {
    constructor() {
        this.holdX;
        this.holdY;
        this.currentX;
        this.currentY;
    }

    getAngle() {
        if (this.isTouchDragged())
            return Math.atan2(this.currentY - this.holdY, this.currentX - this.holdX);
    }

    getLength() {
        if (this.isTouchDragged()) {
            let dx = this.currentX - this.holdX;
            let dy = this.currentY - this.holdY;
            let len = Math.sqrt(dx * dx + dy * dy);
            return len;
        }
    }

    isTouchDragged() {
        return touch.holdX && touch.holdY && touch.currentX && touch.currentY;
    }

    isTouchHolding() {
        return touch.holdX && touch.holdY;
    }
}