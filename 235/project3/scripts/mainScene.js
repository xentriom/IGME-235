const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
document.body.appendChild(app.view);

const mainScene = new PIXI.Container();
app.stage.addChild(mainScene);

playBackgroundMusic();

const title = new PIXI.Text('Fruit Ninja: REmastered', { fontSize: 70, fill: 'white' });
title.x = app.screen.width / 2 - title.width / 2;
title.y = 200;
mainScene.addChild(title);

const startButton = createButton('Start', `./media/icons/Play.png`, 400, () => {
    console.log('Start button clicked');
});
mainScene.addChild(startButton);

const instructionButton = createButton('Instruction', `./media/icons/Instruction.png`, 500, () => {
    console.log('Instruction button clicked');
});
mainScene.addChild(instructionButton);

const shopButton = createButton('Shop', `./media/icons/Shop.png`, 600, () => {
    console.log('Shop button clicked');
});
mainScene.addChild(shopButton);

const settingsButton = createButton('Settings', `./media/icons/Gear.png`, 700, () => {
    console.log('Settings button clicked');
    app.stage.removeChild(mainScene);
});
mainScene.addChild(settingsButton);

function createButton(text, iconPath, y, onClick) {
    const button = new PIXI.Container();

    const buttonBg = new PIXI.Sprite(PIXI.Texture.WHITE);
    buttonBg.width = 300;
    buttonBg.height = 75;
    buttonBg.tint = 0x555555;
    button.addChild(buttonBg);

    const buttonText = new PIXI.Text(text, { fontSize: 30, fill: 'white' });
    buttonText.x = buttonBg.width / 2 - buttonText.width / 2;
    buttonText.y = buttonBg.height / 2 - buttonText.height / 2;
    button.addChild(buttonText);

    const icon = new PIXI.Sprite.from(iconPath);
    icon.width = 40;
    icon.height = 40;
    icon.x = 10;
    icon.y = buttonBg.height / 2 - icon.height / 2;
    button.addChild(icon);

    button.x = (app.screen.width - buttonBg.width) / 2;
    button.y = y;

    button.interactive = true;
    button.buttonMode = true;
    button.on('pointerdown', onClick);

    return button;
}

async function playBackgroundMusic() {
    try {
        const backgroundMusic = new Howl({
            src: ['./media/audio/main_bgm.mp3'],
            loop: true,
            volume: 0.5,
        });
        await backgroundMusic.play();
    } catch (error) {
        console.error('Error playing background music:', error.message);
    }
}

function loadScene(sceneName) {
    const script = document.createElement('script');
    script.src = `${sceneName}Scene.js`;
    script.onload = () => {
        const sceneClassName = `${sceneName.charAt(0).toUpperCase()}${sceneName.slice(1)}Scene`;
        const sceneInstance = new window[sceneClassName](app.stage);
    };
    document.head.appendChild(script);
}