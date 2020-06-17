class Player extends GameObject {
    constructor(state) {
        super(state);
        this.speed = 1;
        this.rotationSpeed = Math.PI / 90;
        this.fanRot = 0;
        this.fanRotSpeed = Math.PI / 5;

        this.fuel = 0;
        this.maxFuel = 10000;
        this.peopleCarried = 0
        this.maxPeopleCarriable = 5;
        this.unloadingRescuesTimer = 0;
        this.fuel = this.maxFuel
        this.completedRescues = 0

        this.zOrder = 2;
    }

    onAdded() {
        super.onAdded()
    }

    moveTowards() {
        this.velX = Math.cos(this.rotation) * this.speed * Math.min(1, this.fanRotSpeed);
        this.velY = Math.sin(this.rotation) * this.speed * Math.min(1, this.fanRotSpeed);
    }

    updateObject() {
        super.updateObject();

        if (this.state.controlMode == KEYBOARD_MODE) {
            if (controls.right) {
                this.rotation += this.rotationSpeed * this.fanRotSpeed;
            }

            else if (controls.left) {
                this.rotation -= this.rotationSpeed * this.fanRotSpeed;
            }

            if (controls.up) {
                if (this.speed < 1) {
                    this.speed += 0.01;
                }
            }

            else if (controls.down) {
                if (this.speed > -1) {
                    this.speed -= 0.01 / 2;
                }
            }

            else {
                this.speed /= 1.1111111
            }
        }

        else {
            // Consertar o Hard Rotation.
            if (touch.isTouchDragged()) {
                this.rotation = touch.getAngle()
                let touchMag = touch.getLength();

                if (this.speed < 1) {
                    this.speed += (Math.min(100, touchMag) / 100) * 0.01;
                }

                this.moveTowards();
            }

            else {
                this.speed /= 1.111111
            }
        }

        this.moveTowards();

        for (let i = 0; i < this.state.gameObjects.length; i++) {
            const go = this.state.gameObjects[i];

            if (go instanceof Touchable) {
                const touchable = go;

                if (distance(this.pos.x, this.pos.y, touchable.pos.x, touchable.pos.y) < touchable.radius / 2) {
                    touchable.isTouching = true;
                }

                else {
                    touchable.isTouching = false;
                }
            }
        }

        this.fanRot += this.fanRotSpeed;

        if (this.fuel > 0) {
            this.fuel -= 1
        }

        else {
            this.fanRotSpeed -= 0.001;

            if (this.fanRotSpeed <= 0) {
                this.fanRotSpeed = 0;
            }

            sounds['heli_rotor'].rate(this.fanRotSpeed);
        }

        if (this.fanRotSpeed > 0) {
            sounds['heli_rotor'].playMode('untilDone');
            sounds['heli_rotor'].play()
        }
    }

    renderObject() {
        super.renderObject();
        noSmooth()
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.rotation + Math.PI / 2)
        translate(0, 10)
        push()
        translate(-32, -32)
        image(sprites['heli'], 0, 0)
        pop()
        push()
        translate(0, -10)
        rotate(this.fanRot)
        translate(-32, -32)
        image(sprites['fan'], 0, 0)
        pop()
        pop()
    }
}