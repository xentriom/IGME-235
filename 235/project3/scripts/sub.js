let score = 0;
let trailSize = 2;

class MainMenu extends Phaser.Scene {
    constructor() { super({ key: 'MainMenu' }); }

    preload() {
        // const graphics = ['EndlessImage, TimedImage, LifeImage'];
        const veggieNames = ['Apple', 'Banana', 'Cherry', 'Grape', 'Mango', 'Orange', 'Strawberry', 'Watermelon'];
        const iconNames = ['Home', 'Shop', 'Instruction', 'Play', 'Gear', 'PlayPause'];

        // graphics.forEach((graphic) => {
        //     this.load.image(graphic, `./media/graphics/${graphic}.png`);
        // });

        veggieNames.forEach((veggieName) => {
            this.load.image(veggieName, `./media/fruits/${veggieName}.png`);
        });

        iconNames.forEach((iconName) => {
            this.load.image(iconName, `./media/icons/${iconName}.png`);
        });
    }

    create() {
        this.add.text(this.sys.game.config.width / 2, 200, 'Veggie Slicer', {
            fontSize: '120px',
            fill: '#fff',
        }).setOrigin(0.5);

        this.createIconButton({
            iconKey: 'Play',
            x: this.sys.game.config.width / 2,
            y: 450,
            width: 300,
            height: 75,
            scale: 2.5,
            text: 'Start Game',
            textColor: '#000',
            onClick: () => {
                console.log('Swapping to intermission');
                this.scene.start('Intermission');
            },
        });

        this.createIconButton({
            iconKey: 'Shop',
            x: this.sys.game.config.width / 2,
            y: 550,
            width: 300,
            height: 75,
            scale: 2.5,
            text: 'View Shop',
            textColor: '#000',
            onClick: () => this.scene.start('Shop'),
        });

        this.createIconButton({
            iconKey: 'Gear',
            x: this.sys.game.config.width / 2,
            y: 650,
            width: 300,
            height: 75,
            scale: 2.5,
            text: 'Settings',
            textColor: '#000',
            onClick: () => this.scene.start('Settings'),
        });
    }

    createIconButton({ iconKey, x, y, width, height, scale, text, textColor, onClick }) {
        const radius = 10;

        const buttonBackground = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x - width / 2, y - height / 2, width, height, radius)
            .setInteractive(
                new Phaser.Geom.Rectangle(x - width / 2, y - height / 2, width, height),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonBackground.fillStyle(0x00ff00, 1);
                buttonBackground.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius);
            })
            .on('pointerout', () => {
                buttonBackground.fillStyle(0xffffff, 1);
                buttonBackground.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius);
            })
            .on('pointerdown', onClick);

        buttonBackground.input.cursor = 'pointer';

        const icon = this.add.image(x - width / 2 + 30, y, iconKey)
            .setOrigin(0.5)
            .setScale(scale);

        const buttonText = this.add.text(x + 15, y, text, {
            fontSize: '35px',
            fill: textColor,
        }).setOrigin(0.5);

        buttonBackground.setDepth(1);
        icon.setDepth(2);
        buttonText.setDepth(3);

        console.log(`Creating ${text} button completed`);
    }
}

class Intermission extends Phaser.Scene {
    constructor() { super({ key: 'Intermission' }); }

    create() {
        console.log('IntermissionScene: creating');

        this.add.text(this.sys.game.config.width / 2, 150, 'Select a game mode!', {
            fontSize: '80px',
            fill: '#fff',
        }).setOrigin(0.5);

        this.createGameModes(0, 'practice');
        this.createGameModes(1, 'timed');
        this.createGameModes(2, 'life');
    }

    createGameModes(index, sceneKey) {
        const buttonWidth = 350;
        const buttonHeight = 500;
        const buttonOutlineColor = 0xffffff;
        const selectedOutlineColor = 0x00ff00;
        const buttonSpacing = 75;

        const x = (index * (buttonWidth + buttonSpacing)) + buttonWidth / 2 + 150;

        const modeInfo = {
            practice: {
                key: 'PracticeGame',
                title: 'Practice',
                image: 'PracticeImage',
                description: 'Play endlessly without constraints to hone and develop your talent.'
            },
            timed: {
                key: 'TimedGame',
                title: 'Timed',
                image: 'TimedImage',
                description: 'Rapidly slice as many veggies as possible within a given time limit.'
            },
            life: {
                key: 'LifeGame',
                title: 'Life',
                image: 'LifeImage',
                description: 'Slice as much veggies as possible with a limited number of lives.'
            }
        };

        const button = this.add
            .rectangle(x, this.sys.game.config.height / 2 + 50, buttonWidth, buttonHeight, buttonOutlineColor)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start(modeInfo[sceneKey].key);
            })
            .on('pointerover', () => {
                changeOutlineColor(button, selectedOutlineColor);
            })
            .on('pointerout', () => {
                changeOutlineColor(button, buttonOutlineColor);
            });

        const gameModeName = this.add.text(
            button.x, button.y - buttonHeight / 2 + 30,
            modeInfo[sceneKey].title, {
            fontSize: '30px',
            fill: '#000',
            fontWeight: 'bold',
        }).setOrigin(0.5);

        // const gameModeImage = this.add.image(button.x, button.y - buttonHeight / 2 + 60, modeInfo[sceneKey].image);
        // gameModeImage.setOrigin(0.5).setScale(0.5);

        const gameModeDescription = this.add.text(button.x, button.y + 150, modeInfo[sceneKey].description, {
            fontSize: '20px',
            fill: '#000',
            wordWrap: { width: buttonWidth - 15 },
        }).setOrigin(0.5);

        const changeOutlineColor = (target, color) => {
            target.setStrokeStyle(2, color);
        };

        button.setDepth(1);
        gameModeName.setDepth(2);
        // gameModeImage.setDepth(3);
        gameModeDescription.setDepth(4);
    }
}

class PracticeGame extends Phaser.Scene {
    constructor() {
        super({ key: 'PracticeGame' });
        this.veggieGroup;
        this.trailGraphics;
        this.trailPoints = [];
    }

    create() {
        console.log('PracticeGame: creating');

        this.createHomeButton();
        this.scoreField = this.createScoreField();

        this.veggieGroup = this.physics.add.group();

        this.spawnVeggie();
        this.time.addEvent({
            delay: 500,
            callback: this.spawnVeggie,
            callbackScope: this,
            loop: true,
        });

        this.trailGraphics = this.add.graphics();
        this.input.on('pointermove', this.handleMouseMove, this);
    }

    createHomeButton() {
        const homeButton = this.add.container(20, 20);
        const iconKey = 'Home';

        const buttonBackground = this.add.rectangle(10, 10, 50, 50, 0xffffff)
            .setOrigin(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });

        const homeIcon = this.add.image(35, 35, iconKey)
            .setOrigin(0.5)
            .setScale(2);

        homeButton.add([buttonBackground, homeIcon]);

        return homeButton;
    }

    createScoreField() {
        score = 0;
        const scoreField = this.add.container(this.sys.game.config.width - 20, 20);

        const fieldBackground = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(-220, 0, 200, 50, 10);

        const scoreText = this.add.text(-50, 25, `Score: ${score}`, {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(1, 0.5);

        scoreField.add([fieldBackground, scoreText]);

        return scoreField;
    }

    spawnVeggie() {
        const veggieNames = ['Apple', 'Banana', 'Cherry', 'Grape', 'Mango', 'Orange', 'Strawberry', 'Watermelon'];
        const randomVeggieName = Phaser.Math.RND.pick(veggieNames);
        const veggie = this.add.image(Phaser.Math.Between(50, this.sys.game.config.width - 50), -100, randomVeggieName)
            .setOrigin(0.5, 0.5);

        veggie.hasContributedToScore = false;

        this.physics.world.enable(veggie);
        this.veggieGroup.add(veggie);

        const path = {
            t: 0,
            duration: 5000,
            yoyo: false,
            repeat: 0,
            points: [
                new Phaser.Math.Vector2(veggie.x, veggie.y),
                new Phaser.Math.Vector2(veggie.x + 100, veggie.y - 200),
                new Phaser.Math.Vector2(veggie.x + 200, this.sys.game.config.height + 100),
            ],
        };

        this.tweens.add({
            targets: path,
            t: 1,
            onUpdate: (tween) => {
                const point = this.getPointOnPath(path, tween.getValue());
                veggie.x = point.x;
                veggie.y = point.y;

                if (!veggie.hasContributedToScore && this.checkCollision(veggie)) {
                    veggie.hasContributedToScore = true;
                    veggie.destroy();
                    score += 1;
                    this.scoreField.getAt(1).setText(`Score: ${score}`);
                }
            },
            duration: path.duration,
        });

        veggie.setRotation(Phaser.Math.DegToRad(Phaser.Math.Between(0, 360)));
    }

    handleMouseMove(pointer) {
        this.trailPoints.push({ x: pointer.x, y: pointer.y });

        while (this.trailPoints.length > 5) {
            this.trailPoints.shift();
        }

        this.trailGraphics.clear();
        this.trailGraphics.lineStyle(trailSize, 0x00ff00, 1);
        this.trailGraphics.beginPath();
        this.trailGraphics.moveTo(this.trailPoints[0].x, this.trailPoints[0].y);

        for (let i = 1; i < this.trailPoints.length; i++) {
            this.trailGraphics.lineTo(this.trailPoints[i].x, this.trailPoints[i].y);
        }

        this.trailGraphics.strokePath();
    }

    checkCollision(veggie) {
        for (let i = 0; i < this.trailPoints.length - 1; i++) {
            const p1 = this.trailPoints[i];
            const p2 = this.trailPoints[i + 1];

            if (
                Phaser.Geom.Intersects.LineToRectangle(
                    new Phaser.Geom.Line(p1.x, p1.y, p2.x, p2.y),
                    veggie.getBounds()
                )
            ) {
                return true;
            }
        }

        return false;
    }

    getPointOnPath(path, t) {
        const point = new Phaser.Math.Vector2();

        const p0 = path.points[0];
        const p1 = path.points[1];
        const p2 = path.points[2];

        point.x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
        point.y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;

        return point;
    }
}

class TimedGame extends Phaser.Scene {
    constructor() { super({ key: 'TimedGame' }); }

    create() {
        console.log('TimedGame: creating');
    }
}

class LifeGame extends Phaser.Scene {
    constructor() { super({ key: 'LifeGame' }); }

    create() {
        console.log('LifeGame: creating');
    }
}

class GameOver extends Phaser.Scene {
    constructor() { super({ key: 'GameOver' }); }

    create() {
        console.log('GameOver: creating');
    }
}

class Shop extends Phaser.Scene {
    constructor() { super({ key: 'Shop' }); }

    create() {
        console.log('Shop: creating');
    }
}

class Settings extends Phaser.Scene {
    constructor() { super({ key: 'Settings' }); }

    create() {
        console.log('Settings: creating');
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: [
        MainMenu,
        Intermission,
        PracticeGame,
        TimedGame,
        LifeGame,
        GameOver,
        Shop,
        Settings
    ]
};

const game = new Phaser.Game(config);

playBackgroundMusic();

async function playBackgroundMusic() {
    try {
        const backgroundMusic = new Howl({
            src: ['./media/audio/main_bgm.mp3'],
            loop: true,
            volume: 0.5,
        });
        await backgroundMusic.play();
        console.log('Background music playing');
    } catch (error) {
        console.error('Error playing background music:', error.message);
    }
}