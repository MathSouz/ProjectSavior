class Player extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.speed = 1;
        this.rotationSpeed = Math.PI / 180;
        this.fanRot = 0;
        this.fanRotSpeed = Math.PI / 5;
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

        if (isTouchHolding()) {
            // Touching Handler
        }

        else {
            if (controls.right) {
                this.rotation += this.rotationSpeed * this.fanRotSpeed;
            }

            if (controls.left) {
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
                this.speed *= 0.01;
            }

            this.moveTowards()
        }

        for (let i = 0; i < gameObjects.length; i++) {
            const go = gameObjects[i];

            if (go instanceof Touchable) {
                const touchable = go;

                if (distance(this.x, this.y, touchable.x, touchable.y) < touchable.radius / 2) {
                    touchable.isTouching = true;
                }

                else {
                    touchable.isTouching = false;
                }
            }
        }

        this.fanRot += this.fanRotSpeed;

        if (fuel > 0) {
            fuel -= 1
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
        translate(this.x, this.y);
        rotate(this.rotation + Math.PI / 2)
        translate(0, 10)
        scale(1, 1 - (0.15 * Math.abs(this.speed)))

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