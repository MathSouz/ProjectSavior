var GAME_FONT;

function loadResources()
{
    console.log("Procurando e carregando recursos...");
    const lastTime = Date.now();    

    // FONTS
    GAME_FONT = loadFont('assets/font/8-bit-pusab.ttf');

    //SPRITES
    sprites['heli'] = loadImage('assets/sprites/theHelicopter.png', imageLoadSuccessCallback, imageLoadFailureCallback);
    sprites['fan'] = loadImage('assets/sprites/fan.png', imageLoadSuccessCallback, imageLoadFailureCallback)
    sprites['rescue'] = [
        loadImage('assets/sprites/full_rescued.png', imageLoadSuccessCallback, imageLoadFailureCallback),
        loadImage('assets/sprites/rescued.png', imageLoadSuccessCallback, imageLoadFailureCallback),
        loadImage('assets/sprites/not_rescued.png', imageLoadSuccessCallback, imageLoadFailureCallback)
    ]
    sprites['boat'] = loadImage('assets/sprites/boat.png', imageLoadSuccessCallback, imageLoadFailureCallback)
    sprites['water'] = loadImage('assets/sprites/water.png', imageLoadSuccessCallback, imageLoadFailureCallback)
    sprites['wave'] = [];
    
    for(let i = 0; i < 7; i++)
    {
        sprites['wave'][i] = (loadImage(`assets/sprites/wave/wave_${i}.png`, imageLoadSuccessCallback, imageLoadFailureCallback))
    }

    // SOUNDS

    soundFormats('wav');
    sounds['heli_rotor'] = loadSound('assets/sounds/heli', soundLoadSuccessCallback, soundLoadFailureCallback);
    sounds['wheel'] = loadSound('assets/sounds/rolling_wheel', soundLoadSuccessCallback, soundLoadFailureCallback);
    const nowTime = Date.now();
    console.log(`Recursos carregados! Isso levou ${nowTime - lastTime}ms!`);
}

function imageLoadSuccessCallback(img)
{

}

function imageLoadFailureCallback(event)
{
    console.error('Erro ao carregar arquivo de imagem');
}

function soundLoadSuccessCallback(sound)
{

}

function soundLoadFailureCallback(event)
{
    console.error('Erro ao carregar um arquivo de som');
    
}