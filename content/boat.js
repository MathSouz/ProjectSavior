class Boat extends Touchable 
{
    constructor(state, x, y, radius = 64) {
        super(state, x, y);
        this.radius = radius;
        this.rotation = Math.random() * Math.PI * 2;
        this.windInfluence = false
        this.iconColor = { r: 200, g: 200, b: 0 }
        this.zOrder = 1;
        this.waves;
    }

    onAdded()
    {
        super.onAdded();
        this.waves = this.state.addObject(new Waves(this.state, this.pos.x, this.pos.y, this.radius));
    }

    onDead()
    {
        if(this.waves)
        {
            this.waves.kill();
        }
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

            if(Math.floor(Math.random() * 5) == 0)
            {
                this.state.changeWindDirection();
            }

            sounds['rescue'].play();
        }
    }

    renderObject() {
        super.renderObject()
        push()
        translate(this.pos.x, this.pos.y)
        if(this.isTouching)
            this.state.drawLoadingCircle(0, 0, this.radius, this.state.player.unloadingRescuesTimer / 100, { r: 200, g: 200, b: 0 })
        rotate(this.rotation)
        translate(-32, -32)
        noSmooth()
        image(sprites['boat'], 0, 0)
        pop()
    }
}