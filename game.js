var sprites = []
var sounds = []

var registeredStates = []
var currentState = undefined;

var currentMasterVolume = 1;
var muted = false;

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
    loadResources()
}

function setup() 
{
    createCanvas(windowWidth, windowHeight);
    frameRate(60);

    registeredStates.push(new InGameState())
    currentState = registeredStates[0];
}

function draw() 
{
    background(0);
    logic()
    render()
    renderUI()
}


function logic() 
{
    if(currentState)
    {
        currentState.updateState();
    }
}

function render() 
{
    if(currentState)
    {
        currentState.renderState()
    }
}

function renderUI() 
{
    if(currentState)
    {
        currentState.renderUIState();
    }
}

function keyPressed() 
{
    if(currentState)
    {
        currentState.onKeyPressed();
    }

    return false;
}

function keyReleased() 
{
    if(currentState)
    {
        currentState.onKeyReleased();
    }

    if(key === 'm')
    {
        muted = !muted

        if(muted)
        {
            masterVolume(0)
        }

        else
        {
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