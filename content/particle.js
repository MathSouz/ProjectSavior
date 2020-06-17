class Particle extends GameObject
{
    constructor(state, x=0, y=0)
    {
        super(state, x, y);
        this.animTimer = 0;
        this.animTimerRate = 0;
    }

    updateObject()
    {
        super.updateObject();
        this.animTimer += this.animTimerRate;
    }
}

class Messages extends Particle
{
    constructor(state, x=0, y=0, msg)
    {
        super(state, x, y)
        this.windInfluence = false;
        this.zOrder = -1;
        this.msg = msg;
        this.animTimerRate = 0.3;
        this.textConfig = {
            size: 12,
            color: [255, 255, 255],
            align: [CENTER, CENTER]
        }
        this.angleDisplacement = 0;
        this.maxLoopTime = 20;
    }

    randomizeDisplacementAngle()
    {
        this.angleDisplacement = Math.random() * Math.PI * 2;
    }

    updateObject()
    {
        super.updateObject();

        if(this.animTimer > this.maxLoopTime)
        {
            this.randomizeDisplacementAngle();
            this.animTimer = 0;
        }
    }

    renderObject()
    {
        super.renderObject();

        if(this.msg)
        {
            push()
            translate(this.pos.x, this.pos.y);
            translate(Math.cos(this.angleDisplacement) * Math.abs(Math.sin(this.animTimer / 7.5)) * this.maxLoopTime, Math.sin(this.angleDisplacement) * Math.abs(Math.sin(this.animTimer / 7.5)) * this.maxLoopTime);
            rotate(this.angleDisplacement + Math.PI / 2);
            textSize(this.textConfig.size);
            noStroke()
            fill(this.textConfig.color[0], this.textConfig.color[1], this.textConfig.color[2])
            textAlign(this.textConfig.align[0], this.textConfig.align[1])
            text(this.msg, 0, 0);
            pop()
        }
    }
}

class Waves extends Particle
{
    constructor(state, x=0, y=0, radius=100)
    {
        super(state, x, y);
        this.windInfluence = false;
        this.zOrder = -2;
        this.animTimerRate = 0.1;
        this.radius = radius;
    }

    renderObject()
    {
        super.renderObject();
        push();
        translate(this.pos.x, this.pos.y);
        let scl = this.radius / 16;
        scale(scl, scl)
        translate(-16, -16);
        noSmooth()
        image(sprites['wave'][Math.floor(this.animTimer) % 7], 0, 0);
        pop();
    }
}