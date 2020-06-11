class Rescue extends Touchable {
    constructor(x, y, radius, enoughHelpingCounter) {
        super(x, y);
        this.radius = radius;
        this.windInfluence = false;
        this.helpingCounter = 0;
        this.enoughHelpingCounter = enoughHelpingCounter;
    }

    getRescueProgress() {
        return this.helpingCounter / this.enoughHelpingCounter;
    }

    updateObject() {
        super.updateObject();

        if (this.isTouching && peopleCarried < maxPeopleCarriable) {
            if (this.helpingCounter < this.enoughHelpingCounter) {
                this.helpingCounter++;
                sounds['wheel'].playMode('untilDone');
                sounds['wheel'].setVolume(4)
                sounds['wheel'].play()
            }

            else {
                this.helpingCounter = this.enoughHelpingCounter;
                gameObjects.pop(this)
                onRescue(this)
            }
        }

        else {
            this.helpingCounter = 0;
            sounds['wheel'].stop()
        }
    }

    renderObject() {
        super.renderObject();
        drawLoadingCircle(this.x, this.y, this.radius, this.getRescueProgress())
        /*push()
        translate(this.x, this.y)
        noFill()

        stroke(255, 255, 255)
        strokeWeight(2)
        circle(0, 0, this.radius)

        if (this.getHelpingProgress() > 0) {
            noFill()
            strokeWeight(3)
            stroke(0, 255, 0)
            arc(0, 0, this.radius, this.radius, 0, Math.PI * 2 * this.getHelpingProgress(), OPEN)
        }

        strokeWeight(1)

        pop();*/
    }
}