class Boat extends Touchable {
    constructor(x, y, radius = 64) {
        super(x, y);
        this.radius = radius;
        this.rotation = Math.random() * Math.PI * 2;
        this.windInfluence = false
        this.iconColor = { r: 200, g: 200, b: 0 }
    }

    updateObject() {
        super.updateObject();

        if (this.isTouching) {
            if (peopleCarried > 0)
                unloadingRescuesTimer++;
        }

        else {
            unloadingRescuesTimer = 0;
        }

        if (unloadingRescuesTimer > 100) {
            peopleCarried--;
            completedRescues++;
            unloadingRescuesTimer = 0;
        }
    }

    renderObject() {
        super.renderObject()
        push()
        translate(this.x, this.y)
        drawLoadingCircle(0, 0, this.radius, unloadingRescuesTimer / 100, { r: 200, g: 200, b: 0 })
        rotate(this.rotation)
        translate(-32, -32)
        noSmooth()
        image(sprites['boat'], 0, 0)
        pop()
    }
}