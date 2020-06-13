class GameState
{
    updateState()
    {
        
    }

    renderState()
    {

    }

    renderUIState()
    {

    }

    onKeyPressed()
    {

    }

    onKeyReleased()
    {

    }
}

class InGameState extends GameState
{
    constructor()
    {
        super();
        this.gameObjects = []
        this.player;
        this.windDirectionAngle = 0;
        this.windStrength = 0;
        this.pause = false;

        this.windStrength = Math.random() * 0.4;
        this.changeWindDirection()

        this.addObject(new Boat(this, 0, 0))
        this.addObject(this.player = new Player(this, 0, 0));
        this.generateRescueTask()
    }

    changeWindDirection()
    {
        this.windDirectionAngle = Math.random() * Math.PI * 2;
    }

    addObject(newGo) 
    {
        this.gameObjects.push(newGo);
        newGo.onAdded();
    }

    generateRescueTask(minDistance = 200, maxDistance = 200) {
        let randomAngle = Math.random() * Math.PI * 2;
        let randomDistance = minDistance + Math.random() * maxDistance;
    
        let randomPostion = {
            x: Math.cos(randomAngle) * randomDistance,
            y: Math.sin(randomAngle) * randomDistance
        }
    
        let newRescue = new Rescue(this, this.player.x + randomPostion.x, this.player.y + randomPostion.y, 20 + Math.random() * 100, 250)
        this.addObject(newRescue)
    }

    updateState()
    {
        if(this.pause)
        {
            sounds['heli_rotor'].pause()
            sounds['wheel'].pause()
            return;
        }

        super.updateState()

        for (let i = 0; i < this.gameObjects.length; i++) 
        {
            let gameObject = this.gameObjects[i];
            gameObject.updateObject()

            if (gameObject.windInfluence) {

                gameObject.x += Math.cos(this.windDirectionAngle) * this.windStrength;
                gameObject.y += Math.sin(this.windDirectionAngle) * this.windStrength;
            }
        }

        camera.x = -this.player.x;
        camera.y = -this.player.y;
    }

    renderState()
    {
        super.renderState()
        push()
        translate(windowWidth / 2, windowHeight / 2)
        scale(2, 2)
        translate(camera.x, camera.y)

        for (let i = 0; i < this.gameObjects.length; i++) {
            const gameObject = this.gameObjects[i];
            gameObject.renderObject()
        }

        for (let i = 0; i < this.gameObjects.length; i++) {
            const go = this.gameObjects[i];

            if (go instanceof Touchable) {
                const hp = go;
                let hpx, hpy
                const padding = 10;
                let isXInside = false, isYInside = false;

                if (-camera.x + windowWidth / 4 - padding < hp.x) {
                    hpx = -camera.x + windowWidth / 4 - padding;
                }

                else if (-camera.x - windowWidth / 4 + padding > hp.x) {
                    hpx = -camera.x - windowWidth / 4 + padding;
                }

                else {
                    hpx = hp.x
                    isXInside = true;
                }

                if (-camera.y + windowHeight / 4 - padding < hp.y) {
                    hpy = -camera.y + windowHeight / 4 - padding;
                }

                else if (-camera.y - windowHeight / 4 + padding > hp.y) {
                    hpy = -camera.y - windowHeight / 4 + padding;
                }

                else {
                    hpy = hp.y
                    isYInside = true
                }

                this.drawArrow(hpx, hpy, { x: hp.x, y: hp.y }, isXInside && isYInside, { r: go.iconColor.r, g: go.iconColor.g, b: go.iconColor.b })
            }
        }

        pop()
    }

    renderUIState()
    {
        textFont('Trebuchet MS');
        noStroke()
        fill(255)

        if (!this.pause) {
            textSize(20)
            textAlign(LEFT, CENTER)
            text(`Rescues: ${this.player.completedRescues}`, 20, 20)
            text('Fuel: ', 20, 20 + 30);

            fill(0, 190, 0)
            rect(20, 20 + 50, 200, 10)

            if (this.player.fuel > 0) {
                fill(0, 255, 0)
                rect(20, 20 + 50, this.player.fuel / this.player.maxFuel * 200, 10)
            }

            push()
            noSmooth()
            translate(20, 90)
            scale(2, 2)

            if (this.player.peopleCarried < this.player.maxPeopleCarriable) {
                for (let i = 0; i < this.player.maxPeopleCarriable; i++) {
                    image(sprites['rescue'][2], i * 20, 0)
                }

                for (let i = 0; i < this.player.peopleCarried; i++) {
                    image(sprites['rescue'][1], i * 20, 0)
                }
            }

            else {
                for (let i = 0; i < this.player.peopleCarried; i++) {
                    image(sprites['rescue'][0], i * 20, 0)
                }
            }

            pop()

            if(isTouchDragged())
            {
                stroke(255, 255, 255)
                strokeWeight(3)
                line(touch.holdX, touch.holdY, touch.currentX, touch.currentY)
                strokeWeight(1)
            }
        }

        else {
            fill(0, 0, 0, 180)
            rect(0, 0, windowWidth, windowHeight)
            textSize(72)
            textAlign(CENTER, CENTER)
            fill(255, 255, 255)
            text(`Paused`, windowWidth / 2, windowHeight / 2);
        }

        if(muted) {

            fill(255, 255, 255)
            textAlign(RIGHT, CENTER)
            textSize(20)
            text('Muted', windowWidth - 20, 20)
        }
    }

    drawLoadingCircle(x, y, radius, progress, forecolor = { r: 0, g: 200, b: 0 }) {
        push()
        translate(x, y)
        noFill()
        stroke(255, 255, 255)
        strokeWeight(2)
        circle(0, 0, radius)
    
        if (progress > 0) {
            noFill()
            strokeWeight(3)
            stroke(forecolor.r, forecolor.g, forecolor.b)
            arc(0, 0, radius, radius, 0, Math.PI * 2 * progress, OPEN)
        }
    
        strokeWeight(1)
        pop()
    }
    
    drawArrow(x, y, pointTo, isClose, color = { r: 0, g: 200, b: 0 }) {
        push()
        translate(x, y)
        scale(10, 10)
    
        if (!isClose) {
            rotate(Math.atan2(y - pointTo.y, x - pointTo.x) + Math.PI / 2)
            translate(-0.5, -0.5)
            fill(color.r, color.g, color.b)
            noStroke()
            triangle(0, 0, 1, 0, 0.5, 1)
        }
    
        pop()
    }

    onKeyPressed()
    {
        if (key === 'w') {
            controls.up = true;
        }
    
        if (key === 'd') {
            controls.right = true;
        }
    
        if (key === 's') {
            controls.down = true;
        }
    
        if (key === 'a') {
            controls.left = true;
        }
    }

    onKeyReleased()
    {
        if (key === 'w') {
            controls.up = false;
        }
    
        if (key === 'd') {
            controls.right = false;
        }
    
        if (key === 's') {
            controls.down = false;
        }
    
        if (key === 'a') {
            controls.left = false;
        }
    
        if (keyCode === 32) {
            this.pause = !this.pause
        }
    }
}