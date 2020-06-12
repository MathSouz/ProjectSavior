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
    currentY: undefined,
    angle: function()
    {
        if(isTouchDragged())
        {
            return Math.atan2(this.currentY - this.holdY, this.currentX - this.holdX)
        }

        return undefined
    }
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

function preload() 
{
    //initGeolocation()

    console.log("Procurando e carregando recursos...");
    const lastTime = Date.now();    
    sprites['heli'] = loadImage('assets/theHelicopter.png');
    sprites['fan'] = loadImage('assets/fan.png')
    sprites['rescue'] = [
        loadImage('assets/full_rescued.png'),
        loadImage('assets/rescued.png'),
        loadImage('assets/not_rescued.png')
    ]
    sprites['boat'] = loadImage('assets/boat.png')
    sprites['water'] = loadImage('assets/water.png')
    soundFormats('wav');
    sounds['heli_rotor'] = loadSound('assets/heli');
    sounds['wheel'] = loadSound('assets/rolling_wheel')
    const nowTime = Date.now();
    console.log(`Recursos carregados! Isso levou ${nowTime - lastTime}ms!`);
    console.log("Iniciando jogo...");
    
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);

    windStrength = Math.random() * 0.6;
    changeWindDirection()

    addObject(new Boat(0, 0))
    addObject(player = new Player(0, 0));
    fuel = maxFuel
    generateRescueTask()
    masterVolume(0.1)
}

function changeWindDirection()
{
    windDirectionAngle = Math.random() * Math.PI * 2;
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

    let newRescue = new Rescue(this.player.x + randomPostion.x, this.player.y + randomPostion.y, 20 + Math.random() * 100, 250)
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


function logic() 
{
    for (let i = 0; i < gameObjects.length; i++) 
    {
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
        noStroke()
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

function isTouchDragged() {
    return touch.holdX && touch.holdY && touch.currentX && touch.currentY;
}

function isTouchHolding() {
    return touch.holdX && touch.holdY;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}