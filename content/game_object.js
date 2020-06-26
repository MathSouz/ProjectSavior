class GameObject {
    constructor(state, x = 0, y = 0) {
        this.state = state;
        this.pos = new Vector(x, y);
        this.velX = 0;
        this.velY = 0;
        this.rotation = 0;
        this.windInfluence = true;
        this.iconColor = { r: 0, g: 200, b: 0 }
        this.dead = false;
        this.tickAlive = 0;
        this.zOrder = 0;
    }

    kill()
    {
        this.dead = true;
    }

    onDead()
    {

    }

    lookAt(x, y) {
        return this.rotation = Math.atan2(y - this.pos.y, x - this.pos.x);
    }

    onAdded() {

    }

    updateObject() {
        this.tickAlive++;
        this.pos.x += this.velX;
        this.pos.y += this.velY;
    }

    renderObject() 
    {
        color(0, 0, 0)
    }
}