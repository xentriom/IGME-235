const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
document.body.appendChild(app.view);

window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});

class SceneManager {
    constructor(app) {
        this.app = app;
        this.scenes = {
            main: new PIXI.Container(),
            game: new PIXI.Container(),
            gameOver: new PIXI.Container(),
            shop: new PIXI.Container(),
            instruction: new PIXI.Container(),
            settings: new PIXI.Container(),
        };
        this.currentScene = null;
        this.initScenes();
    }

    initScenes() {
        for (const sceneKey in this.scenes) {
            this.app.stage.addChild(this.scenes[sceneKey]);
            this.scenes[sceneKey].visible = false;
        }
    }

    switchToScene(sceneKey) {
        const scene = this.scenes[sceneKey];
        if (scene && scene !== this.currentScene) {
            if (this.currentScene) {
                this.currentScene.visible = false;
            }
            scene.visible = true;
            this.currentScene = scene;
        }
    }

    addToScene(sceneKey, element) {
        const scene = this.scenes[sceneKey];
        if (scene) {
            scene.addChild(element);
        }
    }

    initMainScene() {
        const title = new PIXI.Text('Fruit Ninja: REmastered', { fontSize: 70, fill: 'white' });
        title.x = this.app.screen.width / 2 - title.width / 2;
        title.y = 200;
        this.addToScene('main', title);

        const startButton = createButton('Start', `./media/icons/Play.png`, 400, () => {
            this.initGameScene();
        });
        this.addToScene('main', startButton);

        const instructionButton = createButton('Instruction', `./media/icons/Instruction.png`, 500, () => {
            this.initInstructionScene();
        });
        this.addToScene('main', instructionButton);

        const shopButton = createButton('Shop', `./media/icons/Shop.png`, 600, () => {
            this.initShopScene();
        });
        this.addToScene('main', shopButton);

        const settingsButton = createButton('Settings', `./media/icons/Gear.png`, 700, () => {
            console.log('Settings button clicked');
        });
        this.addToScene('main', settingsButton);

        this.switchToScene('main');
    }

    initGameScene() {
        const background = new PIXI.Graphics();
        background.beginFill(0x000000);
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        this.addToScene('game', background);
    
        const backButton = createButton('Back', `./media/icons/Home.png`, 10, () => {
            console.log('Back button clicked');
            this.initMainScene();
        });
        this.addToScene('game', backButton);
    
        const scoreBackground = new PIXI.Graphics();
        scoreBackground.beginFill(0xFFFFFF);
        scoreBackground.drawRect(this.app.screen.width - 150, 10, 140, 40);
        scoreBackground.endFill();
        this.addToScene('game', scoreBackground);
    
        this.switchToScene('game');
    }
    
    initGameOverScene() {
        this.switchToScene('gameOver');
    }

    initShopScene() {
        this.switchToScene('shop');
    }

    initInstructionScene() {
        this.switchToScene('instruction');
    }
}

const sceneManager = new SceneManager(app);
sceneManager.initMainScene();

playBackgroundMusic();

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

    button.on('pointerover', () => { buttonBg.tint = 0x777777; });
    button.on('pointerout', () => { buttonBg.tint = 0x555555; });
    button.on('pointerdown', onClick);

    return button;
}