function loadResources()
{
    console.log("Procurando e carregando recursos...");
    const lastTime = Date.now();    

    //SPRITES
    sprites['heli'] = loadImage('assets/theHelicopter.png');
    sprites['fan'] = loadImage('assets/fan.png')
    sprites['rescue'] = [
        loadImage('assets/full_rescued.png'),
        loadImage('assets/rescued.png'),
        loadImage('assets/not_rescued.png')
    ]
    sprites['boat'] = loadImage('assets/boat.png')
    sprites['water'] = loadImage('assets/water.png')
    sprites['wave'] = [];
    
    for(let i = 0; i < 7; i++)
    {
        sprites['wave'][i] = (loadImage(`assets/wave/wave_${i}.png`))
    }

    // SOUNDS

    soundFormats('wav');
    sounds['heli_rotor'] = loadSound('assets/heli');
    sounds['wheel'] = loadSound('assets/rolling_wheel')
    const nowTime = Date.now();
    console.log(`Recursos carregados! Isso levou ${nowTime - lastTime}ms!`);
    console.log("Iniciando jogo...");
}