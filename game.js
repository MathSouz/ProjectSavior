var currentLanguage;

var registeredStates = []
var currentState = undefined;

var currentMasterVolume = 1;
var muted = false;

var touch;
var controls;

const camera = {
    x: 0,
    y: 0
}

function preload() 
{
    loadResources()
}

function isMobileDevice()
{
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    angleMode(RADIANS);
    currentLanguage = langs['en-US'];
    console.log(currentLanguage);
    
    
    touch = new Touch();
    controls = new Controls();
    //registeredStates.push(new MainMenuState());
    registeredStates.push(new InGameState());
    currentState = registeredStates[0];
}

function draw() {
    background(0);
    textFont(GAME_FONT)
    logic()
    render()
    renderUI()
}

function getCurrentLanguageName()
{
    return currentLanguage.name;
}

function getTranslation(key)
{
    const value = currentLanguage.translations[key];
    return value ? value : "NOT_FOUND";
}

function logic() {
    
    if (currentState) {
        currentState.updateState();
    }
}

function render() {
    if (currentState) {
        currentState.renderState()
    }
}

function renderUI() {
    if (currentState) {
        currentState.renderUIState();
    }
}

function keyPressed() {
    if (currentState) {
        currentState.onKeyPressed();
    }

    return false;
}

function keyReleased() {
    if (currentState) {
        currentState.onKeyReleased();
    }

    if (key === 'm') {
        muted = !muted

        if (muted) {
            masterVolume(0)
        }

        else {
            masterVolume(currentMasterVolume)
        }
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