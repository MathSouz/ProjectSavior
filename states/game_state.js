class ControleMode {
    constructor(name) {
        this.name = name;
    }
}

const KEYBOARD_MODE = new ControleMode('Teclado');
const CURSOR_MODE = new ControleMode('Mouse / Toque');

class GameState {
    constructor() {
        this.controlMode = isMobileDevice() ? CURSOR_MODE : KEYBOARD_MODE;
    }

    updateState() {
        if (this.controlMode == KEYBOARD_MODE) {
            noCursor();
        }

        else {
            cursor(ARROW)
        }
    }

    renderState() {

    }

    renderUIState() {

    }

    onKeyPressed() {
        if (this.pause) {
            if (key === 'k') {
                this.controlMode = KEYBOARD_MODE;
            }

            else if (key === 'c') {
                this.controlMode = CURSOR_MODE;
            }
        }
    }

    onKeyReleased() {

    }
}

class InGameState extends GameState {
    constructor() {
        super();
        this.gameObjects = []
        this.player;
        this.windDirectionAngle = 0;
        this.windStrength = 0;
        this.pause = false;

        this.windStrength = 0.2 + Math.random() * 0.2;
        this.changeWindDirection();

        this.addObject(new Boat(this, 0, 0))
        this.addObject(this.player = new Player(this, 0, 0));

        for(let i = 0; i < 5; i++)
            this.generateRescueTask();
    }

    changeWindDirection() {
        this.windDirectionAngle = Math.random() * Math.PI * 2;
    }

    addObject(newGo) {
        this.gameObjects.push(newGo);
        newGo.onAdded();
        return newGo;
    }

    // Bug: O Rescue Task não deve ser criado dentro da área de outro.
    generateRescueTask(minDistance = 200, maxDistance = 200) {
        let randomAngle = Math.random() * Math.PI * 2;
        let randomDistance = minDistance + Math.random() * maxDistance;

        let randomPostion = {
            x: Math.cos(randomAngle) * randomDistance,
            y: Math.sin(randomAngle) * randomDistance
        }

        let newPos = {x: this.player.pos.x + randomPostion.x, y: this.player.pos.y + randomPostion.y}
        let newRescue = new Rescue(this, newPos.x, newPos.y, 20 + Math.random() * 10, 325)
        this.addObject(newRescue);
    }

    updateState() {
        if (this.pause) {

            for(var s in sounds)
            {
                if(sounds.hasOwnProperty(s))
                {
                    sounds[s].pause()
                    //sounds['wheel'].pause()
                }
            }
            // Temporário. Implementar uma iteração para pausar todos os sons.
            
            return;
        }

        super.updateState();

        // Organiza a array de gameObjects para que os tiverem o zOrder menor sejam renderizados antes, ou seja, fiquem por baixo.
        // Pode não ser bom para performace pois toda a array é reorganizada a cada frame.

        this.gameObjects.sort((a, b) => {
            return a.zOrder - b.zOrder;
        })

        for (let i = 0; i < this.gameObjects.length; i++) {
            const gameObject = this.gameObjects[i];

            if(gameObject)
            {
                if(gameObject.dead)
                {
                    gameObject.onDead();
                    this.gameObjects.splice(i, 1);
                }
    
                else
                {
                    gameObject.updateObject();
    
                    if (gameObject.windInfluence) {
                        gameObject.pos.x += Math.cos(this.windDirectionAngle) * this.windStrength;
                        gameObject.pos.y += Math.sin(this.windDirectionAngle) * this.windStrength;
                    }
                }
            }
        }

        camera.x = -this.player.pos.x;
        camera.y = -this.player.pos.y;
    }

    renderState() {
        super.renderState()
        fill(0, 0, 180)
        rect(0, 0, windowWidth, windowHeight);
        push()
        translate(windowWidth / 2, windowHeight / 2)
        const gameScale = isMobileDevice() ? 4 : 2;
        scale(gameScale, gameScale)
        translate(camera.x, camera.y)

        for (let i = 0; i < this.gameObjects.length; i++) {
            const gameObject = this.gameObjects[i];
            gameObject.renderObject()
        }

        // Desenha flechas na tela para apontar onde estão os pontos de resgastes. 
        // Ao mesmo tempo que restringe suas posições de acordo com a camera, mantendo-as sempre na visão da câmera.
        for (let i = 0; i < this.gameObjects.length; i++) {
            const go = this.gameObjects[i];

            if (go instanceof Touchable) {
                const hp = go;
                let hpx, hpy
                const padding = 10;
                let isXInside = false, isYInside = false;

                if (-camera.x + windowWidth / 4 - padding < hp.pos.x) {
                    hpx = -camera.x + windowWidth / 4 - padding;
                }

                else if (-camera.x - windowWidth / 4 + padding > hp.pos.x) {
                    hpx = -camera.x - windowWidth / 4 + padding;
                }

                else {
                    hpx = hp.pos.x
                    isXInside = true;
                }

                if (-camera.y + windowHeight / 4 - padding < hp.pos.y) {
                    hpy = -camera.y + windowHeight / 4 - padding;
                }

                else if (-camera.y - windowHeight / 4 + padding > hp.pos.y) {
                    hpy = -camera.y - windowHeight / 4 + padding;
                }

                else {
                    hpy = hp.pos.y
                    isYInside = true
                }

                this.drawArrow(hpx, hpy, { x: hp.pos.x, y: hp.pos.y }, isXInside && isYInside, { r: go.iconColor.r, g: go.iconColor.g, b: go.iconColor.b })
            }
        }

        pop()
    }

    renderUIState() {
        noStroke()
        fill(255)

        if (!this.pause) {
            textSize(16)
            textAlign(LEFT, CENTER)
            text(`Resgates: ${this.player.completedRescues}`, 20, 20)
            text('Combustivel: ', 20, 20 + 30);

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

            if (isTouchDragged() && this.controlMode == CURSOR_MODE) {
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
            text(`Pause`, windowWidth / 2, windowHeight / 2);

            textSize(18)
            push()
            translate(windowWidth - 10, windowHeight - 10);
            textAlign(RIGHT, BOTTOM);
            noStroke()
            fill(255)
            textStyle(ITALIC)
            text(`Modo de Controle: ${this.controlMode.name}`, 0, 0)
            pop()
        }

        if (muted) {

            fill(255, 255, 255)
            textAlign(RIGHT, CENTER)
            textSize(20)
            text('Mudo', windowWidth - 20, 20)
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

    onKeyPressed() {
        super.onKeyPressed();
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

    onKeyReleased() {
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