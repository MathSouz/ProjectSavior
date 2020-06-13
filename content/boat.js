class Boat extends Touchable 
{
    constructor(state, x, y, radius = 64) {
        super(state, x, y);
        this.radius = radius;
        this.rotation = Math.random() * Math.PI * 2;
        this.windInfluence = false
        this.iconColor = { r: 200, g: 200, b: 0 }
    }

    updateObject() {
        super.updateObject();

        if (this.isTouching) {
            if (this.state.player.peopleCarried > 0)
            this.state.player.unloadingRescuesTimer++;
        }

        else {
            this.state.player.unloadingRescuesTimer = 0;
        }

        if (this.state.player.unloadingRescuesTimer > 100) {
            this.state.player.peopleCarried--;
            this.state.player.completedRescues++;
            this.state.player.unloadingRescuesTimer = 0;
        }
    }

    renderObject() {
        super.renderObject()
        push()
        translate(this.x, this.y)
        this.state.drawLoadingCircle(0, 0, this.radius, this.state.player.unloadingRescuesTimer / 100, { r: 200, g: 200, b: 0 })
        rotate(this.rotation)
        translate(-32, -32)
        noSmooth()
        image(sprites['boat'], 0, 0)
        pop()
    }
}