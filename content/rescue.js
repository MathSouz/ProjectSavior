class Rescue extends Touchable {
    constructor(state, x, y, radius, enoughHelpingCounter) {
        super(state, x, y);
        this.radius = radius;
        this.windInfluence = false;
        this.helpingCounter = 0;
        this.enoughHelpingCounter = enoughHelpingCounter;
        this.waves;
        this.helpMsg;
    }

    onAdded()
    {
        super.onAdded();
        this.waves = this.state.addObject(new Waves(this.state, this.pos.x, this.pos.y, this.radius));
        this.helpMsg = this.state.addObject(new Messages(this.state, this.pos.x, this.pos.y, 'Socorro!'));
    }

    onDead()
    {
        if(this.waves)
        {
            this.waves.kill();
        }

        if(this.helpMsg)
        {
            this.helpMsg.kill();
        }
    }

    getRescueProgress() {
        return this.helpingCounter / this.enoughHelpingCounter;
    }

    onRescue() {
        this.state.player.peopleCarried++;
        this.state.generateRescueTask();

        if(Math.floor(Math.random() * 5) == 0)
        {
            this.state.changeWindDirection();
        }
    }

    updateObject() {
        super.updateObject();

        if (this.isTouching && this.state.player.peopleCarried < this.state.player.maxPeopleCarriable)
        {
            if (this.helpingCounter < this.enoughHelpingCounter) {
                this.helpingCounter++;
                // Bug: rolling_wheel.wav não reproduz.
                sounds['wheel'].playMode('untilDone');
                sounds['wheel'].play();
            }

            else {
                this.helpingCounter = this.enoughHelpingCounter;
                this.kill()
                this.onRescue()
            }
        }

        else {
            this.helpingCounter = 0;
            sounds['wheel'].stop()
        }
    }

    renderObject() 
    {
        if(this.isTouching)
            this.state.drawLoadingCircle(this.pos.x, this.pos.y, this.radius, this.getRescueProgress())

        super.renderObject();
    }
}