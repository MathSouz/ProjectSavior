var sprites = []
var sounds = []
var gameObjects = []
var completedRescues = 0
var player;
var windDirectionAngle = 0;
var windStrength = 0;
var pause = false;
var fuel = 0;
var maxFuel = 10000;
var peopleCarried = 0
var maxPeopleCarriable = 5;
var unloadingRescuesTimer = 0;

var touch = {
    holdX: undefined,
    holdY: undefined,
    currentX: undefined,
    currentY: undefined
}

const controls = {
    up: false,
    down: false,
    right: false,
    left: false
}

const camera = {
    x: 0,
    y: 0
}

class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.rotation = 0;
        this.windInfluence = true;
        this.iconColor = { r: 0, g: 200, b: 0 }
    }

    onAdded() {

    }

    updateObject() {
        this.x += this.velX;
        this.y += this.velY;
    }

    renderObject() {
        color(0, 0, 0)
    }
}

class Touchable extends GameObject {
    constructor(x, y, radius) {
        super(x, y)
        this.radius = radius;
        this.isTouching = false;
    }
}

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

class HelpingPerson extends Touchable {
    constructor(x, y, radius, enoughHelpingCounter) {
        super(x, y);
        this.radius = radius;
        this.windInfluence = false;
        this.helpingCounter = 0;
        this.enoughHelpingCounter = enoughHelpingCounter;
    }

    getHelpingProgress() {
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
        drawLoadingCircle(this.x, this.y, this.radius, this.getHelpingProgress())
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

function preload() {
    sprites['heli'] = loadImage('assets/theHelicopter.png');
    sprites['fan'] = loadImage('assets/fan.png')
    sprites['rescue'] = [
        loadImage('assets/full_rescued.png'),
        loadImage('assets/rescued.png'),
        loadImage('assets/not_rescued.png')
    ]
    sprites['boat'] = loadImage('assets/boat.png')
    soundFormats('wav');
    sounds['heli_rotor'] = loadSound('assets/heli');
    sounds['wheel'] = loadSound('assets/rolling_wheel')
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    //pixelDensity(1)
    //windStrength = Math.random() * 0.5;
    windDirectionAngle = Math.random() * Math.PI * 2;

    addObject(new Boat(0, 0))
    addObject(player = new Player(0, 0));
    fuel = maxFuel
    generateRescueTask()
    masterVolume(0.1)
}

function addObject(newGo) {
    gameObjects.push(newGo);
    newGo.onAdded();
}

function onRescue(helpingPerson) {
    peopleCarried++;
    generateRescueTask();
}

function generateRescueTask(minDistance = 200, maxDistance = 200) {
    let randomAngle = Math.random() * Math.PI * 2;
    let randomDistance = minDistance + Math.random() * maxDistance;

    let randomPostion = {
        x: Math.cos(randomAngle) * randomDistance,
        y: Math.sin(randomAngle) * randomDistance
    }

    let newRescue = new HelpingPerson(this.player.x + randomPostion.x, this.player.y + randomPostion.y, 20 + Math.random() * 100, 250)
    addObject(newRescue)
}

function draw() {
    background(0);

    if (!pause) {
        logic()
    }

    else {
        // Pausar todos os sons por iteração!!
        sounds['heli_rotor'].pause()
        sounds['wheel'].pause()
    }

    render()
    renderUI()
}


function logic() {
    for (let i = 0; i < gameObjects.length; i++) {
        gameObject = gameObjects[i];
        gameObject.updateObject()

        if (gameObject.windInfluence) {

            gameObject.x += Math.cos(windDirectionAngle) * windStrength;
            gameObject.y += Math.sin(windDirectionAngle) * windStrength;
        }
    }

    camera.x = -player.x;
    camera.y = -player.y;
}

function render() {
    push()
    translate(windowWidth / 2, windowHeight / 2)
    scale(2, 2)
    translate(camera.x, camera.y)

    for (let i = 0; i < gameObjects.length; i++) {
        gameObject = gameObjects[i];
        gameObject.renderObject()
    }

    for (let i = 0; i < gameObjects.length; i++) {
        const go = gameObjects[i];

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

            drawArrow(hpx, hpy, { x: hp.x, y: hp.y }, isXInside && isYInside, { r: go.iconColor.r, g: go.iconColor.g, b: go.iconColor.b })
        }
    }

    pop()
}

function renderUI() {
    textFont('Trebuchet MS');
    noStroke()
    fill(255)

    if (!pause) {
        textSize(20)
        textAlign(LEFT, CENTER)
        text(`Rescues: ${completedRescues}`, 20, 20)
        text('Fuel: ', 20, 20 + 30);

        fill(0, 190, 0)
        rect(20, 20 + 50, 200, 10)

        if (fuel > 0) {
            fill(0, 255, 0)
            rect(20, 20 + 50, fuel / maxFuel * 200, 10)
        }

        push()
        noSmooth()
        translate(20, 90)
        scale(2, 2)

        if (peopleCarried < maxPeopleCarriable) {
            for (let i = 0; i < maxPeopleCarriable; i++) {
                image(sprites['rescue'][2], i * 20, 0)
            }

            for (let i = 0; i < peopleCarried; i++) {
                image(sprites['rescue'][1], i * 20, 0)
            }
        }

        else {
            for (let i = 0; i < peopleCarried; i++) {
                image(sprites['rescue'][0], i * 20, 0)
            }
        }

        pop()
    }

    else {
        fill(0, 0, 0, 180)
        rect(0, 0, windowWidth, windowHeight)
        textSize(72)
        textAlign(CENTER, CENTER)
        fill(255, 255, 255)
        text(`Paused`, windowWidth / 2, windowHeight / 2);
    }
}

function drawLoadingCircle(x, y, radius, progress, forecolor = { r: 0, g: 200, b: 0 }) {
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

function drawArrow(x, y, pointTo, isClose, color = { r: 0, g: 200, b: 0 }) {
    push()
    translate(x, y)
    scale(10, 10)

    if (!isClose) {
        rotate(Math.atan2(y - pointTo.y, x - pointTo.x) + Math.PI / 2)
        translate(-0.5, -0.5)
        fill(color.r, color.g, color.b)
        triangle(0, 0, 1, 0, 0.5, 1)
    }

    pop()

}

function keyPressed() {
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

    return false;
}

function keyReleased() {
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
        pause = !pause
    }

    return false;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function touchStarted() {
    this.touch.holdX = mouseX;
    this.touch.holdY = mouseY;
}

function touchEnded() {
    this.touch.holdX = undefined;
    this.touch.holdY = undefined;
    this.touch.currentX = undefined;
    this.touch.currentY = undefined;
}

function touchMoved() {
    this.touch.currentX = mouseX;
    this.touch.currentY = mouseY;
}

function radiansToDegrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}

function isTouchDragged() {
    return touch.holdX && touch.holdY && touch.currentX && touch.currentY;
}

function isTouchHolding() {
    return touch.holdX && touch.holdY;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}