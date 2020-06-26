var sprites = []
var sounds = []
var songs = []
var langs = []

var GAME_FONT;

class Language
{
    constructor(name, translations)
    {
        this.name = name;
        this.translations = translations;
    }
}

class SoundFX
{
    constructor()
    {
        this.sound;
        this.pausable = true;
        this.isBackground = false;
        this.defaultVolume = 1;
    }

    setAsUnpausable()
    {
        this.pausable = false;
        return this;
    }

    setAsBackground()
    {
        this.isBackground = true;
        return this;
    }

    setDefaultVolume(dv)
    {
        this.defaultVolume = dv;
        this.setVolume(dv);
        return this;
    }

    setVolume(volume)
    {
        this.sound.setVolume(volume);
    }

    resetVolume()
    {
        this.setVolume(this.defaultVolume);
    }

    isPaused()
    {
        return this.sound.isPaused() && !this.sound.isPlaying();
    }

    load(fileName)
    {
        this.sound = loadSound(
            `assets/sounds/${fileName}.wav`, 
            () => {}, 
            () => {console.error("Something went wrong on load sound " + fileName);});
    }

    play(loop=false)
    {
        if(!loop)
            this.sound.play()
        else
            this.sound.loop()
    }

    pause()
    {
        if(this.pausable)
            this.sound.pause();
    }

    stop()
    {
        this.sound.stop();
    }
}

function onLoadJsonLang(lang)
{
    langs[lang.locale] = new Language(lang.lang, lang.translations);
}

function loadResources()
{
    console.log("Procurando e carregando recursos...");
    const lastTime = Date.now();

    loadJSON('assets/langs/en-US.json', onLoadJsonLang);
    loadJSON('assets/langs/es-ES.json', onLoadJsonLang);
    loadJSON('assets/langs/pt-BR.json', onLoadJsonLang);
    loadJSON('assets/langs/pt-PT.json', onLoadJsonLang);
    

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

    registerSound('rotor');
    registerSound('rescue');
    registerSound('sucess').setAsUnpausable();

    // Songs

    registerSound('song_1').setAsUnpausable().setAsBackground().setDefaultVolume(0.7);
    registerSound('song_2').setAsUnpausable().setAsBackground().setDefaultVolume(0.7);
    registerSound('song_3').setAsUnpausable().setAsBackground().setDefaultVolume(0.7);

    const nowTime = Date.now();
    console.log(`Recursos carregados! Isso levou ${nowTime - lastTime}ms!`);
}

function registerSound(name, pausable=true)
{
    const sfx = new SoundFX(pausable);
    sfx.load(name);
    return sounds[name] = sfx;
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