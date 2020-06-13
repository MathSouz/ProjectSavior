class GameObject 
{
    constructor(state, x, y) 
    {
        this.state = state;
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.rotation = 0;
        this.windInfluence = true;
        this.iconColor = { r: 0, g: 200, b: 0 }
    }

    onAdded() {

    }

    updateObject() {
        this.x += this.velX;
        this.y += this.velY;
    }

    renderObject() {
        color(0, 0, 0)
    }
}