class LoadingScene extends Phaser.Scene {
    constructor() { super({ key: 'LoadingScene' }); }

    preload() {
        loadData();
        const veggieNames = ['BellPepper', 'Broccoli', 'Carrot', 'Cauliflower', 'Corn', 'Eggplant', 'GreenCabbage', 'Mushroom', 'Potato', 'Pumpkin', 'Radish', 'Tomato'];
        const iconNames = ['Cloud', 'Coin2', 'Power', 'FloppyDisk', 'Home', 'Shop', 'Instruction', 'Play', 'Gear', 'PlayPause', 'Heart', 'BrokenHeart', 'Backpack', 'CookingPot', 'Restart', 'Monitor', 'SpeakerOn', 'SpeakerMute'];

        veggieNames.forEach((veggieName) => {
            this.load.image(veggieName, `./media/veggies/${veggieName}.png`);
        });

        iconNames.forEach((iconName) => {
            this.load.image(iconName, `./media/icons/${iconName}.png`);
        });

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        const assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 100,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }

    create() {
        playBackgroundMusic();
        this.scene.start('MainMenu');
    }
}

class MainMenu extends Phaser.Scene {
    constructor() { super({ key: 'MainMenu' }); }

    create() {
        this.gameTimeTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                adjustableData.gameTime += 1;
            },
            loop: true,
        });

        this.add.text(this.sys.game.config.width / 2, 200, 'VEGGIE SLICER', {
            fontSize: '120px',
            fill: '#F0810E',
            fontWeight: 'bold',
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
            onClick: () => this.scene.start('Intermission'),
        });

        this.createIconButton({
            iconKey: 'Shop',
            x: this.sys.game.config.width / 2,
            y: 560,
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
            y: 670,
            width: 300,
            height: 75,
            scale: 2.5,
            text: 'Settings',
            textColor: '#000',
            onClick: () => this.scene.start('Settings'),
        });

        // const infoButton = this.add.image(20, this.sys.game.config.height - 50, 'infoIcon')
        //     .setOrigin(0)
        //     .setInteractive({ useHandCursor: true })
        //     .on('pointerdown', () => this.showInfoPopup());

        const infoButton = this.add.graphics()
            .fillStyle(0xF9B931)
            .fillRoundedRect(20, this.sys.game.config.height - 60, 40, 40, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(20, this.sys.game.config.height - 60, 40, 40),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => this.showInfoPopup());
        infoButton.input.cursor = 'pointer';
        this.add.text(40, this.sys.game.config.height - 40, 'i', { fontSize: '35px', fill: '#000' }).setOrigin(0.5);

        this.createInfoPopup();
    }

    createIconButton({ iconKey, x, y, width, height, scale, text, textColor, onClick }) {
        const radius = 10;

        const buttonOutline = this.add.graphics()
            .fillStyle(0x2F3130)
            .fillRoundedRect((x - width / 2) - 5, (y - height / 2) - 5, width + 10, height + 10, radius);

        const buttonBackground = this.add.graphics()
            .fillStyle(0xF8F2E6)
            .fillRoundedRect(x - width / 2, y - height / 2, width, height, radius)
            .setInteractive(
                new Phaser.Geom.Rectangle((x - width / 2) - 5, (y - height / 2) - 5, width + 10, height + 10),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonOutline.fillStyle(0x426F86, 1);
                buttonOutline.fillRoundedRect((x - width / 2) - 5, (y - height / 2) - 5, width + 10, height + 10, radius);
            })
            .on('pointerout', () => {
                buttonOutline.fillStyle(0x2F3130, 1);
                buttonOutline.fillRoundedRect((x - width / 2) - 5, (y - height / 2) - 5, width + 10, height + 10, radius);
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

        buttonOutline.setDepth(1);
        buttonBackground.setDepth(2);
        icon.setDepth(3);
        buttonText.setDepth(4);
    }

    createInfoPopup() {
        this.infoPopupContainer = this.add.container(this.sys.game.config.width / 2, this.sys.game.config.height / 2).setAlpha(0).setDepth(5);

        const popupBackground = this.add.graphics().fillStyle(0xffffff).fillRoundedRect(-275, -340, 550, 680, 10);

        const infoTitle = this.add.text(0, -280, 'Info', { fontSize: '50px', fill: '#000', fontWeight: 'bold', align: 'center' }).setOrigin(0.5);

        const infoText = this.add.text(0, -10, 'Veggie Slicer is a web game built using the Phaser3 and Howler API library. This is also heavily inspired by a mobile game known as Fruit Ninja.\n\nTo play, simply click on \'Start Game\' and select the mode you wish to play. A practice mode is available for you to practice and get a feel of the speed and size of the veggies.\n\nOnce you are confident, challenge yourself to timed or life mode where you have to get the highest score possible. You earn coins depending on the veggies sliced. Beware, some veggies will deduct coins! Use those coins to better equip yourself for the future.\n\nRemember to save the game if you want to keep your progress!', {
            fontSize: '20px',
            fill: '#000',
            align: 'left',
            wordWrap: { width: 500 },
        }).setOrigin(0.5);

        const infoButtonOutline = this.add.graphics()
            .fillStyle(0xF8F2E6)
            .fillRoundedRect(-205, 245, 410, 70, 10);

        const infoButton = this.add.graphics()
            .fillStyle(0xF8F2E6)
            .fillRoundedRect(-200, 250, 400, 60, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(-200, 250, 400, 60),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                infoButtonOutline.fillStyle(0x426F86, 1);
                infoButtonOutline.fillRoundedRect(-205, 245, 410, 70, 10);
            })
            .on('pointerout', () => {
                infoButtonOutline.fillStyle(0xF8F2E6, 1);
                infoButtonOutline.fillRoundedRect(-205, 245, 410, 70, 10);
            })
            .on('pointerdown', () => {

            });
        infoButton.input.cursor = 'pointer';

        const infoButtonText = this.add.text(0, 280, 'Visit About Page', { fontSize: '35px', fill: '#000' }).setOrigin(0.5);

        const closeButton = this.add.graphics()
            .fillStyle(0xF9B931)
            .fillRoundedRect(-250, -320, 40, 40, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(-250, -320, 40, 40),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => this.hideInfoPopup());
        closeButton.input.cursor = 'pointer';

        const closeButtonText = this.add.text(-229, -298, 'X', { fontSize: '30px', fill: '#000' }).setOrigin(0.5);

        this.infoPopupContainer.add([popupBackground, infoTitle, infoText, infoButtonOutline, infoButton, infoButtonText, closeButton, closeButtonText]);
    }

    showInfoPopup() {
        this.tweens.add({
            targets: this.infoPopupContainer,
            alpha: 1,
            duration: 200,
            ease: 'Linear',
        });
    }

    hideInfoPopup() {
        this.tweens.add({
            targets: this.infoPopupContainer,
            alpha: 0,
            duration: 200,
            ease: 'Linear',
        });
    }
}

class Intermission extends Phaser.Scene {
    constructor() { super({ key: 'Intermission' }); }

    create() {
        this.gameTimeTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                adjustableData.gameTime += 1;
            },
            loop: true,
        });

        this.createHomeButton();

        this.add.text(this.sys.game.config.width / 2, 150, 'Select a game mode!', {
            fontSize: '80px',
            fill: '#F0810E',
        }).setOrigin(0.5);

        this.createGameModes(0, 'practice');
        this.createGameModes(1, 'timed');
        this.createGameModes(2, 'life');
    }

    createHomeButton() {
        const homeButton = this.add.container(50, 20);

        const buttonOutline = this.add.graphics()
            .fillStyle(0x2F3130, 1)
            .fillRoundedRect(0, 0, 160, 60, 10);

        const buttonBackground = this.add.graphics()
            .fillStyle(0xF8F2E6)
            .fillRoundedRect(5, 5, 150, 50, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(5, 5, 160, 50),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonOutline.fillStyle(0x426F86, 1);
                buttonOutline.fillRoundedRect(0, 0, 160, 60, 10);
            })
            .on('pointerout', () => {
                buttonOutline.fillStyle(0x2F3130, 1);
                buttonOutline.fillRoundedRect(0, 0, 160, 60, 10);
            })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });
        buttonBackground.input.cursor = 'pointer';

        const homeIcon = this.add.image(30, 30, 'Home')
            .setOrigin(0.5)
            .setScale(2);

        const homeText = this.add.text(100, 30, `Return`, {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);

        homeButton.add([buttonOutline, buttonBackground, homeIcon, homeText]);

        return homeButton;
    }

    createGameModes(index, sceneKey) {
        const buttonWidth = 350;
        const buttonHeight = 500;
        const buttonOutlineColor = 0xF8F2E6;
        const selectedOutlineColor = 0x426F86;
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
            button.x, button.y - buttonHeight / 2 + 35,
            modeInfo[sceneKey].title, {
            fontSize: '40px',
            fill: '#000',
            fontWeight: 'bold',
        }).setOrigin(0.5);

        // const gameModeImage = this.add.image(button.x, button.y - buttonHeight / 2 + 60, modeInfo[sceneKey].image);
        // gameModeImage.setOrigin(0.5).setScale(0.5);

        const gameModeDescription = this.add.text(button.x, button.y + 155, modeInfo[sceneKey].description, {
            fontSize: '24px',
            fill: '#000',
            wordWrap: { width: buttonWidth - 15 },
        }).setOrigin(0.5);

        const changeOutlineColor = (target, color) => {
            target.setStrokeStyle(5, color);
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
        this.gameTimeTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                adjustableData.gameTime += 1;
            },
            loop: true,
        });

        this.createHomeButton();
        this.scoreField = this.createScoreField();

        this.veggieGroup = this.physics.add.group();

        this.spawnVeggie();
        this.time.addEvent({
            delay: gameData.rateOfSpawn,
            callback: this.spawnVeggie,
            callbackScope: this,
            loop: true,
        });

        this.trailGraphics = this.add.graphics();
        this.input.on('pointermove', this.handleMouseMove, this);
    }

    createHomeButton() {
        const homeButton = this.add.container(50, 20);

        const buttonOutline = this.add.graphics()
            .fillStyle(0x2F3130, 1)
            .fillRoundedRect(0, 0, 160, 60, 10);

        const buttonBackground = this.add.graphics()
            .fillStyle(0xF8F2E6)
            .fillRoundedRect(5, 5, 150, 50, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(5, 5, 160, 50),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonOutline.fillStyle(0x426F86, 1);
                buttonOutline.fillRoundedRect(0, 0, 160, 60, 10);
            })
            .on('pointerout', () => {
                buttonOutline.fillStyle(0x2F3130, 1);
                buttonOutline.fillRoundedRect(0, 0, 160, 60, 10);
            })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });
        buttonBackground.input.cursor = 'pointer';

        const homeIcon = this.add.image(30, 30, 'Home')
            .setOrigin(0.5)
            .setScale(2);

        const homeText = this.add.text(100, 30, `Return`, {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);

        homeButton.add([buttonOutline, buttonBackground, homeIcon, homeText]);

        return homeButton;
    }

    createScoreField() {
        roundData.score = 0;
        const scoreField = this.add.container(this.sys.game.config.width - 20, 20);

        const fieldBackground = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(-220, 0, 215, 50, 10);

        const scoreIcon = this.add.image(this.sys.game.config.width - 210, 43, 'Backpack')
            .setOrigin(0.5)
            .setScale(2);

        const scoreText = this.add.text(-165, 25, `Sliced: ${roundData.score}`, {
            fontSize: '22px',
            fill: '#000',
        }).setOrigin(0, 0.5);

        scoreField.add([fieldBackground, scoreText]);

        return scoreField;
    }

    spawnVeggie() {
        const randomVeggieName = Phaser.Math.RND.pick(gameData.veggieNames);
        const veggie = this.add.image(Phaser.Math.Between(50, this.sys.game.config.width - 50), -100, randomVeggieName)
            .setOrigin(0.5, 0.5)
            .setScale(2);

        veggie.hasContributedToScore = false;

        this.physics.world.enable(veggie);
        this.veggieGroup.add(veggie);

        const path = {
            t: 0,
            duration: gameData.pathDuration,
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
                const minX = 0 + veggie.displayWidth / 2;
                const maxX = this.sys.game.config.width - veggie.displayWidth / 2;

                veggie.x = Phaser.Math.Clamp(point.x, minX, maxX);
                veggie.y = point.y;

                if (!veggie.hasContributedToScore && this.checkCollision(veggie)) {
                    veggie.hasContributedToScore = true;
                    veggie.destroy();
                    roundData.score += 1;
                    this.scoreField.getAt(1).setText(`Sliced: ${roundData.score}`);
                }
            },
            duration: path.duration,
        });

        veggie.setRotation(Phaser.Math.DegToRad(Phaser.Math.Between(0, 360)));
    }

    handleMouseMove(pointer) {
        this.trailPoints.push({ x: pointer.x, y: pointer.y });

        while (this.trailPoints.length > adjustableData.trailLength) {
            this.trailPoints.shift();
        }

        this.trailGraphics.clear();
        this.trailGraphics.lineStyle(adjustableData.trailSize, adjustableData.trailColor, 1);
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
    constructor() {
        super({ key: 'TimedGame' });
        this.veggieGroup;
        this.trailGraphics;
        this.trailPoints = [];
        this.currentTime = 30000;
        this.timerEvent;
    }

    create() {
        this.gameTimeTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                adjustableData.gameTime += 1;
            },
            loop: true,
        });

        this.createHomeButton();
        this.scoreField = this.createScoreField();
        this.timerContainer = this.createTimer();

        this.veggieGroup = this.physics.add.group();

        this.spawnVeggie();
        this.time.addEvent({
            delay: gameData.rateOfSpawn,
            callback: this.spawnVeggie,
            callbackScope: this,
            loop: true,
        });

        this.trailGraphics = this.add.graphics();
        this.input.on('pointermove', this.handleMouseMove, this);

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true,
        });
    }

    createHomeButton() {
        const homeButton = this.add.container(50, 20);

        const buttonOutline = this.add.graphics()
            .fillStyle(0x2F3130, 1)
            .fillRoundedRect(0, 0, 160, 60, 10);

        const buttonBackground = this.add.graphics()
            .fillStyle(0xF8F2E6)
            .fillRoundedRect(5, 5, 150, 50, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(5, 5, 160, 50),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonOutline.fillStyle(0x426F86, 1);
                buttonOutline.fillRoundedRect(0, 0, 160, 60, 10);
            })
            .on('pointerout', () => {
                buttonOutline.fillStyle(0x2F3130, 1);
                buttonOutline.fillRoundedRect(0, 0, 160, 60, 10);
            })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });
        buttonBackground.input.cursor = 'pointer';

        const homeIcon = this.add.image(30, 30, 'Home')
            .setOrigin(0.5)
            .setScale(2);

        const homeText = this.add.text(100, 30, `Return`, {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);

        homeButton.add([buttonOutline, buttonBackground, homeIcon, homeText]);

        return homeButton;
    }

    createScoreField() {
        roundData.score = 0;
        const scoreField = this.add.container(this.sys.game.config.width - 20, 20);

        const fieldBackground = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(-220, 0, 215, 50, 10);

        const scoreIcon = this.add.image(this.sys.game.config.width - 210, 43, 'Backpack')
            .setOrigin(0.5)
            .setScale(2);

        const scoreText = this.add.text(-165, 25, `Sliced: ${roundData.score}`, {
            fontSize: '22px',
            fill: '#000',
        }).setOrigin(0, 0.5);

        scoreField.add([fieldBackground, scoreText]);

        return scoreField;
    }

    createTimer() {
        const timerContainer = this.add.container(this.sys.game.config.width / 2, 20);

        const timerBackground = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(-75, 0, 150, 50, 10);

        const timerIcon = this.add.image(this.sys.game.config.width / 2 - 45, 43, 'CookingPot')
            .setOrigin(0.5)
            .setScale(3);

        const timerText = this.add.text(20, 25, '0:30', {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5, 0.5);

        timerContainer.add([timerBackground, timerText]);

        return timerContainer;
    }

    updateTimer() {
        gameData.alottedTime -= 1000;

        const minutes = Math.floor(gameData.alottedTime / 60000);
        const seconds = Math.floor((gameData.alottedTime % 60000) / 1000);
        const formattedTime = `${minutes}:${String(seconds).padStart(2, '0')}`;

        this.timerContainer.getAt(1).setText(`${formattedTime}`);

        if (gameData.alottedTime <= 0) {
            this.scene.start('GameOver', { mode: 'Timed' });
            this.timerEvent.destroy();
        }
    }

    spawnVeggie() {
        const randomVeggieName = Phaser.Math.RND.pick(gameData.veggieNames);
        const veggie = this.add.image(Phaser.Math.Between(50, this.sys.game.config.width - 50), -100, randomVeggieName)
            .setOrigin(0.5, 0.5)
            .setScale(2);
        veggie.veggieType = randomVeggieName;

        veggie.hasContributedToScore = false;

        this.physics.world.enable(veggie);
        this.veggieGroup.add(veggie);

        const path = {
            t: 0,
            duration: gameData.pathDuration,
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
                const minX = 0 + veggie.displayWidth / 2;
                const maxX = this.sys.game.config.width - veggie.displayWidth / 2;

                veggie.x = Phaser.Math.Clamp(point.x, minX, maxX);
                veggie.y = point.y;

                if (!veggie.hasContributedToScore && this.checkCollision(veggie)) {
                    veggie.hasContributedToScore = true;
                    veggie.destroy();
                    const veggieType = this.getVeggieType(veggie);
                    this.updateCutCount(veggieType);
                    roundData.score += 1;
                    this.scoreField.getAt(1).setText(`Sliced: ${roundData.score}`);
                }
            },
            duration: path.duration,
        });

        veggie.setRotation(Phaser.Math.DegToRad(Phaser.Math.Between(0, 360)));
    }

    handleMouseMove(pointer) {
        this.trailPoints.push({ x: pointer.x, y: pointer.y });

        while (this.trailPoints.length > adjustableData.trailLength) {
            this.trailPoints.shift();
        }

        this.trailGraphics.clear();
        this.trailGraphics.lineStyle(adjustableData.trailSize, adjustableData.trailColor, 1);
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

    updateCutCount(veggie) {
        roundData.cutCount[veggie] = (roundData.cutCount[veggie] || 0) + 1;
    }

    getVeggieType(veggie) {
        return veggie.veggieType || 'Unknown';
    }
}

class LifeGame extends Phaser.Scene {
    constructor() {
        super({ key: 'LifeGame' });
        this.veggieGroup;
        this.trailGraphics;
        this.trailPoints = [];
        this.lives = 5;
    }

    create() {
        this.gameTimeTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                adjustableData.gameTime += 1;
            },
            loop: true,
        });

        this.createHomeButton();
        this.scoreField = this.createScoreField();

        this.veggieGroup = this.physics.add.group();

        this.spawnVeggie();
        this.time.addEvent({
            delay: gameData.rateOfSpawn,
            callback: this.spawnVeggie,
            callbackScope: this,
            loop: true,
        });

        this.trailGraphics = this.add.graphics();
        this.input.on('pointermove', this.handleMouseMove, this);

        this.hearts = [];
        const totalWidth = gameData.numberOfHearts * 40 * 2;
        const startX = (this.sys.game.config.width - totalWidth) / 2;

        for (let i = 0; i < gameData.numberOfHearts; i++) {
            const heart = this.add.image(startX + i * 40 * 2, 20, 'Heart').setOrigin(0, 0).setScale(2);
            this.hearts.push(heart);
        }
    }

    createHomeButton() {
        const homeButton = this.add.container(50, 20);

        const buttonOutline = this.add.graphics()
            .fillStyle(0x2F3130, 1)
            .fillRoundedRect(0, 0, 160, 60, 10);

        const buttonBackground = this.add.graphics()
            .fillStyle(0xF8F2E6)
            .fillRoundedRect(5, 5, 150, 50, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(5, 5, 160, 50),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonOutline.fillStyle(0x426F86, 1);
                buttonOutline.fillRoundedRect(0, 0, 160, 60, 10);
            })
            .on('pointerout', () => {
                buttonOutline.fillStyle(0x2F3130, 1);
                buttonOutline.fillRoundedRect(0, 0, 160, 60, 10);
            })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });
        buttonBackground.input.cursor = 'pointer';

        const homeIcon = this.add.image(30, 30, 'Home')
            .setOrigin(0.5)
            .setScale(2);

        const homeText = this.add.text(100, 30, `Return`, {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);

        homeButton.add([buttonOutline, buttonBackground, homeIcon, homeText]);

        return homeButton;
    }

    createScoreField() {
        roundData.score = 0;
        const scoreField = this.add.container(this.sys.game.config.width - 20, 20);

        const fieldBackground = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(-220, 0, 215, 50, 10);

        const scoreIcon = this.add.image(this.sys.game.config.width - 210, 43, 'Backpack')
            .setOrigin(0.5)
            .setScale(2);

        const scoreText = this.add.text(-165, 25, `Sliced: ${roundData.score}`, {
            fontSize: '22px',
            fill: '#000',
        }).setOrigin(0, 0.5);

        scoreField.add([fieldBackground, scoreText]);

        return scoreField;
    }

    spawnVeggie() {
        const randomVeggieName = Phaser.Math.RND.pick(gameData.veggieNames);
        const veggie = this.add.image(Phaser.Math.Between(50, this.sys.game.config.width - 50), -100, randomVeggieName)
            .setOrigin(0.5, 0.5)
            .setScale(2);
        veggie.veggieType = randomVeggieName;

        veggie.hasContributedToScore = false;

        this.physics.world.enable(veggie);
        this.veggieGroup.add(veggie);

        const path = {
            t: 0,
            duration: gameData.pathDuration,
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
                const minX = 0 + veggie.displayWidth / 2;
                const maxX = this.sys.game.config.width - veggie.displayWidth / 2;

                veggie.x = Phaser.Math.Clamp(point.x, minX, maxX);
                veggie.y = point.y;

                if (!veggie.hasContributedToScore && this.checkCollision(veggie)) {
                    veggie.hasContributedToScore = true;
                    veggie.destroy();
                    const veggieType = this.getVeggieType(veggie);
                    this.updateCutCount(veggieType);
                    roundData.score += 1;
                    this.scoreField.getAt(1).setText(`Sliced: ${roundData.score}`);
                }

                if (!veggie.hasContributedToScore && veggie.y >= this.sys.game.config.height) {
                    veggie.hasContributedToScore = true;
                    veggie.destroy();
                    const firstHeart = this.hearts.find(heart => !heart.isBroken);
                    if (firstHeart) {
                        firstHeart.setTexture('BrokenHeart');
                        firstHeart.isBroken = true;
                    }

                    if (this.hearts.every(heart => heart.isBroken)) {
                        this.scene.start('GameOver', { mode: 'life' });
                    }
                }
            },
            duration: path.duration,
        });

        veggie.setRotation(Phaser.Math.DegToRad(Phaser.Math.Between(0, 360)));
    }

    handleMouseMove(pointer) {
        this.trailPoints.push({ x: pointer.x, y: pointer.y });

        while (this.trailPoints.length > adjustableData.trailLength) {
            this.trailPoints.shift();
        }

        this.trailGraphics.clear();
        this.trailGraphics.lineStyle(adjustableData.trailSize, adjustableData.trailColor, 1);
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

    updateCutCount(veggie) {
        roundData.cutCount[veggie] = (roundData.cutCount[veggie] || 0) + 1;
    }

    getVeggieType(veggie) {
        return veggie.veggieType || 'Unknown';
    }
}

class GameOver extends Phaser.Scene {
    constructor() { super({ key: 'GameOver' }); }

    init(data) {
        this.gameMode = data.mode;
    }

    create() {
        this.gameTimeTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                adjustableData.gameTime += 1;
            },
            loop: true,
        });

        for (const veggieType in roundData.cutCount) {
            if (roundData.cutCount.hasOwnProperty(veggieType)) {
                const cutCount = roundData.cutCount[veggieType];
                const veggieValue = gameData.veggieValues[veggieType] || 0;

                adjustableData.totalCoins += cutCount * veggieValue;
                adjustableData.maxCoins += cutCount * veggieValue;
            }
        }

        const formattedGameMode = this.gameMode.charAt(0).toUpperCase() + this.gameMode.slice(1);

        this.add.text(this.sys.game.config.width / 2, 150, `Game Over!`, {
            fontSize: '120px',
            fill: '#fff',
        }).setOrigin(0.5);

        this.add.text(this.sys.game.config.width / 2, 250, `You scored ${roundData.score} points in ${formattedGameMode} mode`, {
            fontSize: '60px',
            fill: '#fff',
        }).setOrigin(0.5);

        const middleX = this.sys.game.config.width / 2 - 420;
        const middleY = this.sys.game.config.height / 2 + 60;

        let offsetX = middleX - 150;
        let offsetY = middleY - 100;
        let countPerRow = 0;

        for (const veggieType in roundData.cutCount) {
            if (roundData.cutCount.hasOwnProperty(veggieType)) {
                const cutCount = roundData.cutCount[veggieType];
                adjustableData.totalCutCount[veggieType] = (adjustableData.totalCutCount[veggieType] || 0) + cutCount;

                const veggieImage = this.add.image(offsetX, offsetY, veggieType).setScale(2);
                const cutCountText = this.add.text(offsetX + 30, offsetY, `Sliced: ${cutCount}`, {
                    fontSize: '20px',
                    fill: '#fff',
                });

                offsetX += 200;
                countPerRow += 1;

                if (countPerRow >= 6) {
                    offsetX = middleX - 150;
                    offsetY += 100;
                    countPerRow = 0;
                }
            }
        }

        this.createReturnButton({
            x: this.sys.game.config.width / 2 - 400,
            text: 'Retry',
            icon: 'Restart',
            onClick: () => { this.scene.start(`${formattedGameMode}Game`); }
        });

        this.createReturnButton({
            x: this.sys.game.config.width / 2,
            text: 'Intermission',
            icon: 'Monitor',
            onClick: () => { this.scene.start('Intermission'); }
        });

        this.createReturnButton({
            x: this.sys.game.config.width / 2 + 400,
            text: 'Main Menu',
            icon: 'Home',
            onClick: () => { this.scene.start('MainMenu'); }
        });

        resetRoundData();
        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createReturnButton({ x, text, icon, onClick }) {
        const width = 300;
        const height = 60;

        const buttonBackground = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x - width / 2, this.sys.game.config.height - 200 - height / 2, width, height, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(x - width / 2, this.sys.game.config.height - 200 - height / 2, width, height),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonBackground.fillStyle(0x00ff00, 1);
                buttonBackground.fillRoundedRect(x - width / 2, this.sys.game.config.height - 200 - height / 2, width, height, 10);
            })
            .on('pointerout', () => {
                buttonBackground.fillStyle(0xffffff, 1);
                buttonBackground.fillRoundedRect(x - width / 2, this.sys.game.config.height - 200 - height / 2, width, height, 10);
            })
            .on('pointerdown', onClick);
        buttonBackground.input.cursor = 'pointer';

        const buttonText = this.add.text(x + 10, this.sys.game.config.height - 200, text, {
            fontSize: '26px',
            fill: "#000",
        }).setOrigin(0.5);

        const buttonIcon = this.add.image(x - buttonText.width / 2 - 20, this.sys.game.config.height - 200, icon)
            .setOrigin(0.5)
            .setScale(2);
    }
}

class Shop extends Phaser.Scene {
    constructor() {
        super({ key: 'Shop' });
        this.selectedColor = { r: 0, g: 255, b: 0 };
    }

    create() {
        this.gameTimeTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                adjustableData.gameTime += 1;
            },
            loop: true,
        });

        this.createHomeButton();

        this.add.text(this.sys.game.config.width / 2, 110, `Trail Shop`, { fontSize: '110px', fill: '#F0810E' }).setOrigin(0.5);

        this.createBackground();
        this.createCash();
        this.createColorShop();
        this.createDisplay();
        this.createTrailSize();
        this.createTrailLength();
    }

    update() {
        this.amount.setText(formatCurrency(adjustableData.totalCoins));
    }

    createHomeButton() {
        const homeButton = this.add.container(50, 20);

        const buttonOutline = this.add.graphics()
            .fillStyle(0x2F3130, 1)
            .fillRoundedRect(0, 0, 160, 60, 10);

        const buttonBackground = this.add.graphics()
            .fillStyle(0xF8F2E6)
            .fillRoundedRect(5, 5, 150, 50, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(5, 5, 160, 50),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonOutline.fillStyle(0x426F86, 1);
                buttonOutline.fillRoundedRect(0, 0, 160, 60, 10);
            })
            .on('pointerout', () => {
                buttonOutline.fillStyle(0x2F3130, 1);
                buttonOutline.fillRoundedRect(0, 0, 160, 60, 10);
            })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });
        buttonBackground.input.cursor = 'pointer';

        const homeIcon = this.add.image(30, 30, 'Home')
            .setOrigin(0.5)
            .setScale(2);

        const homeText = this.add.text(100, 30, `Return`, {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);

        homeButton.add([buttonOutline, buttonBackground, homeIcon, homeText]);

        return homeButton;
    }

    createBackground() {
        const background = this.add.graphics()
            .fillStyle(0xA7A9A8)
            .fillRoundedRect(50, 200, this.sys.game.config.width - 100, this.sys.game.config.height - 250, 20);

        this.add.graphics().fillStyle(0x000000).fillRoundedRect(this.sys.game.config.width / 2 - 100, 220, 5, 600, 4);
        this.add.graphics().fillStyle(0x000000).fillRoundedRect(this.sys.game.config.width / 2 - 70, 500, 750, 5, 4);
        this.add.graphics().fillStyle(0x000000).fillRoundedRect(this.sys.game.config.width / 2 + 300, 520, 5, 300, 4);

        return background;
    }

    createCash() {
        this.add.graphics().fillStyle(0xffffff).fillRoundedRect(this.sys.game.config.width - 250, 220, 180, 50, 10);
        this.add.image(this.sys.game.config.width - 220, 245, 'Coin2').setOrigin(0.5).setScale(2.5);
        this.amount = this.add.text(this.sys.game.config.width - 195, 230, formatCurrency(adjustableData.totalCoins), { fontSize: '28px', fill: '#000', });
    }

    createColorShop() {
        this.add.text(250, 230, `Colors`, { fontSize: '50px', fill: '#000' });
        this.createRedTrail(130, 325, 0xFF0000, 100.99);
        this.createYellowTrail(130, 400, 0xFFFF00, 100.99);
        this.createBlueTrail(130, 475, 0x0000FF, 100.99);
        this.createOrangeTrail(130, 550, 0xFFA500, 150.99);
        this.createGreenTrail(130, 625, 0x00FF00, 150.99);
        this.createPurpleTrail(130, 700, 0x8F00FF, 150.99);

        this.createRedOrangeTrail(370, 325, 0xff5349, 200.99);
        this.createYellowOrangeTrail(370, 400, 0xffae42, 200.99);
        this.createYellowGreenTrail(370, 475, 0x9acd32, 200.99);
        this.createBlueGreenTrail(370, 550, 0x00ff7f, 200.99);
        this.createBlueVioletTrail(370, 625, 0x8A2BE2, 200.99);
        this.createRedVioletTrail(370, 700, 0xC71585, 200.99);
    }

    createRedTrail(x, y, color, cost) {
        const width = 160;
        const height = 50;

        this.add.graphics().fillStyle(color).fillRoundedRect(x - 30, y, width, height, 10);

        const redShop = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x, y, width, height, 10)
            .setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);

        let redHover = () => { };
        let redOut = () => { };
        let redOnClick = () => { };

        if (!adjustableData.isRedTrailUnlocked) {
            redHover = () => { redText.setText(`$${cost}`); };

            redOut = () => {
                redShop.fillStyle(0xffffff, 1);
                redShop.fillRoundedRect(x, y, width, height, 10);
                redText.setText(`Red`);
            };

            redOnClick = () => {
                if (adjustableData.totalCoins < cost) {
                    redShop.fillStyle(0xff0000, 1);
                    redShop.fillRoundedRect(x, y, width, height, 10);
                    redText.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isRedTrailUnlocked = true;
                adjustableData.trailColor = color;

                redText.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isRedTrailUnlocked) {
            redHover = () => { redText.setText(`Equip?`); }

            redOut = () => {
                redShop.fillStyle(0xffffff, 1);
                redShop.fillRoundedRect(x, y, width, height, 10);
                redText.setText(`Equip`);
            }

            redOnClick = () => {
                adjustableData.trailColor = 0x04ff00;
                redText.setText(`Equipped!`);
                this.scene.restart();
            }
        }

        if (adjustableData.isRedTrailUnlocked && adjustableData.trailColor == color) {
            redHover = () => { redText.setText(`Unequip?`); }

            redOut = () => {
                redShop.fillStyle(0xffffff, 1);
                redShop.fillRoundedRect(x, y, 160, height, 10);
                redText.setText('Equipped');
            }

            redOnClick = () => {
                adjustableData.trailColor = 0xffffff;
                redText.setText(`Unequipped!`);
                this.scene.restart();
            }
        }

        redShop.on('pointerover', () => redHover());
        redShop.on('pointerout', () => redOut());
        redShop.on('pointerdown', () => redOnClick());
        redShop.input.cursor = 'pointer';

        const redText = this.add.text(x + 80, y + 25, `Red`, { fontSize: '25px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createYellowTrail(x, y, color, cost) {
        const width = 160;
        const height = 50;

        this.add.graphics().fillStyle(color).fillRoundedRect(x - 30, y, width, height, 10);

        const yellowShop = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x, y, width, height, 10)
            .setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);

        let yellowHover = () => { };
        let yellowOut = () => { };
        let yellowOnClick = () => { };

        if (!adjustableData.isYellowTrailUnlocked) {
            yellowHover = () => { yellowText.setText(`$${cost}`); };

            yellowOut = () => {
                yellowShop.fillStyle(0xffffff, 1);
                yellowShop.fillRoundedRect(x, y, width, height, 10);
                yellowText.setText(`Yellow`);
            };

            yellowOnClick = () => {
                if (adjustableData.totalCoins < cost) {
                    yellowShop.fillStyle(0xff0000, 1);
                    yellowShop.fillRoundedRect(x, y, width, height, 10);
                    yellowText.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isYellowTrailUnlocked = true;
                adjustableData.trailColor = color;

                yellowText.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isYellowTrailUnlocked) {
            yellowHover = () => { yellowText.setText(`Equip?`); }

            yellowOut = () => {
                yellowShop.fillStyle(0xffffff, 1);
                yellowShop.fillRoundedRect(x, y, width, height, 10);
                yellowText.setText(`Equip`);
            }

            yellowOnClick = () => {
                adjustableData.trailColor = 0x04ff00;
                yellowText.setText(`Equipped!`);
                this.scene.restart();
            }
        }

        if (adjustableData.isYellowTrailUnlocked && adjustableData.trailColor == color) {
            yellowHover = () => { yellowText.setText(`Unequip?`); }

            yellowOut = () => {
                yellowShop.fillStyle(0xffffff, 1);
                yellowShop.fillRoundedRect(x, y, 160, height, 10);
                yellowText.setText('Equipped');
            }

            yellowOnClick = () => {
                adjustableData.trailColor = 0xffffff;
                yellowText.setText(`Unequipped!`);
                this.scene.restart();
            }
        }

        yellowShop.on('pointerover', () => yellowHover());
        yellowShop.on('pointerout', () => yellowOut());
        yellowShop.on('pointerdown', () => yellowOnClick());
        yellowShop.input.cursor = 'pointer';

        const yellowText = this.add.text(x + 80, y + 25, `Yellow`, { fontSize: '25px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createBlueTrail(x, y, color, cost) {
        const width = 160;
        const height = 50;

        this.add.graphics().fillStyle(color).fillRoundedRect(x - 30, y, width, height, 10);

        const blueShop = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x, y, width, height, 10)
            .setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);

        let blueHover = () => { };
        let blueOut = () => { };
        let blueOnClick = () => { };

        if (!adjustableData.isBlueTrailUnlocked) {
            blueHover = () => { blueText.setText(`$${cost}`); };

            blueOut = () => {
                blueShop.fillStyle(0xffffff, 1);
                blueShop.fillRoundedRect(x, y, width, height, 10);
                blueText.setText(`Blue`);
            };

            blueOnClick = () => {
                if (adjustableData.totalCoins < cost) {
                    blueShop.fillStyle(0xff0000, 1);
                    blueShop.fillRoundedRect(x, y, width, height, 10);
                    blueText.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isBlueTrailUnlocked = true;
                adjustableData.trailColor = color;

                blueText.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isBlueTrailUnlocked) {
            blueHover = () => { blueText.setText(`Equip?`); }

            blueOut = () => {
                blueShop.fillStyle(0xffffff, 1);
                blueShop.fillRoundedRect(x, y, width, height, 10);
                blueText.setText(`Equip`);
            }

            blueOnClick = () => {
                adjustableData.trailColor = 0x04ff00;
                blueText.setText(`Equipped!`);
                this.scene.restart();
            }
        }

        if (adjustableData.isBlueTrailUnlocked && adjustableData.trailColor == color) {
            blueHover = () => { blueText.setText(`Unequip?`); }

            blueOut = () => {
                blueShop.fillStyle(0xffffff, 1);
                blueShop.fillRoundedRect(x, y, 160, height, 10);
                blueText.setText('Equipped');
            }

            blueOnClick = () => {
                adjustableData.trailColor = 0xffffff;
                blueText.setText(`Unequipped!`);
                this.scene.restart();
            }
        }

        blueShop.on('pointerover', () => blueHover());
        blueShop.on('pointerout', () => blueOut());
        blueShop.on('pointerdown', () => blueOnClick());
        blueShop.input.cursor = 'pointer';

        const blueText = this.add.text(x + 80, y + 25, `Blue`, { fontSize: '25px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createOrangeTrail(x, y, color, cost) {
        const width = 160;
        const height = 50;

        this.add.graphics().fillStyle(color).fillRoundedRect(x - 30, y, width, height, 10);

        const orangeShop = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x, y, width, height, 10)
            .setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);

        let orangeHover = () => { };
        let orangeOut = () => { };
        let orangeOnClick = () => { };

        if (!adjustableData.isOrangeTrailUnlocked) {
            orangeHover = () => { orangeText.setText(`$${cost}`); };

            orangeOut = () => {
                orangeShop.fillStyle(0xffffff, 1);
                orangeShop.fillRoundedRect(x, y, width, height, 10);
                orangeText.setText(`Orange`);
            };

            orangeOnClick = () => {
                if (adjustableData.totalCoins < cost) {
                    orangeShop.fillStyle(0xff0000, 1);
                    orangeShop.fillRoundedRect(x, y, width, height, 10);
                    orangeText.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isOrangeTrailUnlocked = true;
                adjustableData.trailColor = color;

                orangeText.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isOrangeTrailUnlocked) {
            orangeHover = () => { orangeText.setText(`Equip?`); }

            orangeOut = () => {
                orangeShop.fillStyle(0xffffff, 1);
                orangeShop.fillRoundedRect(x, y, width, height, 10);
                orangeText.setText(`Equip`);
            }

            orangeOnClick = () => {
                adjustableData.trailColor = 0x04ff00;
                orangeText.setText(`Equipped!`);
                this.scene.restart();
            }
        }

        if (adjustableData.isOrangeTrailUnlocked && adjustableData.trailColor == color) {
            orangeHover = () => { orangeText.setText(`Unequip?`); }

            orangeOut = () => {
                orangeShop.fillStyle(0xffffff, 1);
                orangeShop.fillRoundedRect(x, y, 160, height, 10);
                orangeText.setText('Equipped');
            }

            orangeOnClick = () => {
                adjustableData.trailColor = 0xffffff;
                orangeText.setText(`Unequipped!`);
                this.scene.restart();
            }
        }

        orangeShop.on('pointerover', () => orangeHover());
        orangeShop.on('pointerout', () => orangeOut());
        orangeShop.on('pointerdown', () => orangeOnClick());
        orangeShop.input.cursor = 'pointer';

        const orangeText = this.add.text(x + 80, y + 25, `Orange`, { fontSize: '25px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createGreenTrail(x, y, color, cost) {
        const width = 160;
        const height = 50;

        this.add.graphics().fillStyle(color).fillRoundedRect(x - 30, y, width, height, 10);

        const greenShop = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x, y, width, height, 10)
            .setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);


        let greenHover = () => { };
        let greenOut = () => { };
        let greenOnClick = () => { };

        if (!adjustableData.isGreenTrailUnlocked) {
            greenHover = () => { greenText.setText(`$${cost}`); };

            greenOut = () => {
                greenShop.fillStyle(0xffffff, 1);
                greenShop.fillRoundedRect(x, y, width, height, 10);
                greenText.setText(`Green`);
            };

            greenOnClick = () => {
                if (adjustableData.totalCoins < cost) {
                    greenShop.fillStyle(0xff0000, 1);
                    greenShop.fillRoundedRect(x, y, width, height, 10);
                    greenText.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isGreenTrailUnlocked = true;
                adjustableData.trailColor = color;

                greenText.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isGreenTrailUnlocked) {
            greenHover = () => { greenText.setText(`Equip?`); }

            greenOut = () => {
                greenShop.fillStyle(0xffffff, 1);
                greenShop.fillRoundedRect(x, y, width, height, 10);
                greenText.setText(`Equip`);
            }

            greenOnClick = () => {
                adjustableData.trailColor = 0x04ff00;
                greenText.setText(`Equipped!`);
                this.scene.restart();
            }
        }

        if (adjustableData.isGreenTrailUnlocked && adjustableData.trailColor == color) {
            greenHover = () => { greenText.setText(`Unequip?`); }

            greenOut = () => {
                greenShop.fillStyle(0xffffff, 1);
                greenShop.fillRoundedRect(x, y, 160, height, 10);
                greenText.setText('Equipped');
            }

            greenOnClick = () => {
                adjustableData.trailColor = 0xffffff;
                greenText.setText(`Unequipped!`);
                this.scene.restart();
            }
        }

        greenShop.on('pointerover', () => greenHover());
        greenShop.on('pointerout', () => greenOut());
        greenShop.on('pointerdown', () => greenOnClick());
        greenShop.input.cursor = 'pointer';

        const greenText = this.add.text(x + 80, y + 25, `Green`, { fontSize: '25px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createPurpleTrail(x, y, color, cost) {
        const width = 160;
        const height = 50;

        this.add.graphics().fillStyle(color).fillRoundedRect(x - 30, y, width, height, 10);

        const purpleShop = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x, y, width, height, 10)
            .setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);

        let purpleHover = () => { };
        let purpleOut = () => { };
        let purpleOnClick = () => { };

        if (!adjustableData.isPurpleTrailUnlocked) {
            purpleHover = () => { purpleText.setText(`$${cost}`); };

            purpleOut = () => {
                purpleShop.fillStyle(0xffffff, 1);
                purpleShop.fillRoundedRect(x, y, width, height, 10);
                purpleText.setText(`Violet`);
            };

            purpleOnClick = () => {
                if (adjustableData.totalCoins < cost) {
                    purpleShop.fillStyle(0xff0000, 1);
                    purpleShop.fillRoundedRect(x, y, width, height, 10);
                    purpleText.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isPurpleTrailUnlocked = true;
                adjustableData.trailColor = color;

                purpleText.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isPurpleTrailUnlocked) {
            purpleHover = () => { purpleText.setText(`Equip?`); }

            purpleOut = () => {
                purpleShop.fillStyle(0xffffff, 1);
                purpleShop.fillRoundedRect(x, y, width, height, 10);
                purpleText.setText(`Equip`);
            }

            purpleOnClick = () => {
                adjustableData.trailColor = 0x04ff00;
                purpleText.setText(`Equipped!`);
                this.scene.restart();
            }
        }

        if (adjustableData.isPurpleTrailUnlocked && adjustableData.trailColor == color) {
            purpleHover = () => { purpleText.setText(`Unequip?`); }

            purpleOut = () => {
                purpleShop.fillStyle(0xffffff, 1);
                purpleShop.fillRoundedRect(x, y, 160, height, 10);
                purpleText.setText('Equipped');
            }

            purpleOnClick = () => {
                adjustableData.trailColor = 0xffffff;
                purpleText.setText(`Unequipped!`);
                this.scene.restart();
            }
        }

        purpleShop.on('pointerover', () => purpleHover());
        purpleShop.on('pointerout', () => purpleOut());
        purpleShop.on('pointerdown', () => purpleOnClick());
        purpleShop.input.cursor = 'pointer';

        const purpleText = this.add.text(x + 80, y + 25, `Violet`, { fontSize: '25px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createRedOrangeTrail(x, y, color, cost) {
        const width = 220;
        const height = 50;

        this.add.graphics().fillStyle(color).fillRoundedRect(x - 30, y, width, height, 10);

        const redOrangeShop = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x, y, width, height, 10)
            .setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);

        let redOrangeHover = () => { };
        let redOrangeOut = () => { };
        let redOrangeOnClick = () => { };

        if (!adjustableData.isRedOrangeTrailUnlocked) {
            redOrangeHover = () => { redOrangeText.setText(`$${cost}`); };

            redOrangeOut = () => {
                redOrangeShop.fillStyle(0xffffff, 1);
                redOrangeShop.fillRoundedRect(x, y, width, height, 10);
                redOrangeText.setText(`Red Orange`);
            };

            redOrangeOnClick = () => {
                if (adjustableData.totalCoins < cost) {
                    redOrangeShop.fillStyle(0xff0000, 1);
                    redOrangeShop.fillRoundedRect(x, y, width, height, 10);
                    redOrangeText.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isRedOrangeTrailUnlocked = true;
                adjustableData.trailColor = color;

                redOrangeText.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isRedOrangeTrailUnlocked) {
            redOrangeHover = () => { redOrangeText.setText(`Equip?`); }

            redOrangeOut = () => {
                redOrangeShop.fillStyle(0xffffff, 1);
                redOrangeShop.fillRoundedRect(x, y, width, height, 10);
                redOrangeText.setText(`Equip`);
            }

            redOrangeOnClick = () => {
                adjustableData.trailColor = 0x04ff00;
                redOrangeText.setText(`Equipped!`);
                this.scene.restart();
            }
        }

        if (adjustableData.isRedOrangeTrailUnlocked && adjustableData.trailColor == color) {
            redOrangeHover = () => { redOrangeText.setText(`Unequip?`); }

            redOrangeOut = () => {
                redOrangeShop.fillStyle(0xffffff, 1);
                redOrangeShop.fillRoundedRect(x, y, 160, height, 10);
                redOrangeText.setText('Equipped');
            }

            redOrangeOnClick = () => {
                adjustableData.trailColor = 0xffffff;
                redOrangeText.setText(`Unequipped!`);
                this.scene.restart();
            }
        }

        redOrangeShop.on('pointerover', () => redOrangeHover());
        redOrangeShop.on('pointerout', () => redOrangeOut());
        redOrangeShop.on('pointerdown', () => redOrangeOnClick());
        redOrangeShop.input.cursor = 'pointer';

        const redOrangeText = this.add.text(x + 110, y + 25, `Red Orange`, { fontSize: '25px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createYellowOrangeTrail(x, y, color, cost) {
        const width = 220;
        const height = 50;

        this.add.graphics().fillStyle(color).fillRoundedRect(x - 30, y, width, height, 10);

        const yellowOrangeShop = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x, y, width, height, 10)
            .setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);

        let yellowOrangeHover = () => { };
        let yellowOrangeOut = () => { };
        let yellowOrangeOnClick = () => { };

        if (!adjustableData.isYellowOrangeTrailUnlocked) {
            yellowOrangeHover = () => { yellowOrangeText.setText(`$${cost}`); };

            yellowOrangeOut = () => {
                yellowOrangeShop.fillStyle(0xffffff, 1);
                yellowOrangeShop.fillRoundedRect(x, y, width, height, 10);
                yellowOrangeText.setText(`Yellow Orange`);
            };

            yellowOrangeOnClick = () => {
                if (adjustableData.totalCoins < cost) {
                    yellowOrangeShop.fillStyle(0xff0000, 1);
                    yellowOrangeShop.fillRoundedRect(x, y, width, height, 10);
                    yellowOrangeText.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isYellowOrangeTrailUnlocked = true;
                adjustableData.trailColor = color;

                yellowOrangeText.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isYellowOrangeTrailUnlocked) {
            yellowOrangeHover = () => { yellowOrangeText.setText(`Equip?`); }

            yellowOrangeOut = () => {
                yellowOrangeShop.fillStyle(0xffffff, 1);
                yellowOrangeShop.fillRoundedRect(x, y, width, height, 10);
                yellowOrangeText.setText(`Equip`);
            }

            yellowOrangeOnClick = () => {
                adjustableData.trailColor = 0x04ff00;
                yellowOrangeText.setText(`Equipped!`);
                this.scene.restart();
            }
        }

        if (adjustableData.isYellowOrangeTrailUnlocked && adjustableData.trailColor == color) {
            yellowOrangeHover = () => { yellowOrangeText.setText(`Unequip?`); }

            yellowOrangeOut = () => {
                yellowOrangeShop.fillStyle(0xffffff, 1);
                yellowOrangeShop.fillRoundedRect(x, y, 160, height, 10);
                yellowOrangeText.setText('Equipped');
            }

            yellowOrangeOnClick = () => {
                adjustableData.trailColor = 0xffffff;
                yellowOrangeText.setText(`Unequipped!`);
                this.scene.restart();
            }
        }

        yellowOrangeShop.on('pointerover', () => yellowOrangeHover());
        yellowOrangeShop.on('pointerout', () => yellowOrangeOut());
        yellowOrangeShop.on('pointerdown', () => yellowOrangeOnClick());
        yellowOrangeShop.input.cursor = 'pointer';

        const yellowOrangeText = this.add.text(x + 110, y + 25, `Yellow Orange`, { fontSize: '25px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createYellowGreenTrail(x, y, color, cost) {
        const width = 220;
        const height = 50;

        this.add.graphics().fillStyle(color).fillRoundedRect(x - 30, y, width, height, 10);

        const yellowGreenShop = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x, y, width, height, 10)
            .setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);

        let yellowGreenHover = () => { };
        let yellowGreenOut = () => { };
        let yellowGreenOnClick = () => { };

        if (!adjustableData.isYellowGreenTrailUnlocked) {
            yellowGreenHover = () => { yellowGreenText.setText(`$${cost}`); };

            yellowGreenOut = () => {
                yellowGreenShop.fillStyle(0xffffff, 1);
                yellowGreenShop.fillRoundedRect(x, y, width, height, 10);
                yellowGreenText.setText(`Yellow Green`);
            };

            yellowGreenOnClick = () => {
                if (adjustableData.totalCoins < cost) {
                    yellowGreenShop.fillStyle(0xff0000, 1);
                    yellowGreenShop.fillRoundedRect(x, y, width, height, 10);
                    yellowGreenText.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isYellowGreenTrailUnlocked = true;
                adjustableData.trailColor = color;

                yellowGreenText.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isYellowGreenTrailUnlocked) {
            yellowGreenHover = () => { yellowGreenText.setText(`Equip?`); }

            yellowGreenOut = () => {
                yellowGreenShop.fillStyle(0xffffff, 1);
                yellowGreenShop.fillRoundedRect(x, y, width, height, 10);
                yellowGreenText.setText(`Equip`);
            }

            yellowGreenOnClick = () => {
                adjustableData.trailColor = 0x04ff00;
                yellowGreenText.setText(`Equipped!`);
                this.scene.restart();
            }
        }

        if (adjustableData.isYellowGreenTrailUnlocked && adjustableData.trailColor == color) {
            yellowGreenHover = () => { yellowGreenText.setText(`Unequip?`); }

            yellowGreenOut = () => {
                yellowGreenShop.fillStyle(0xffffff, 1);
                yellowGreenShop.fillRoundedRect(x, y, 160, height, 10);
                yellowGreenText.setText('Equipped');
            }

            yellowGreenOnClick = () => {
                adjustableData.trailColor = 0xffffff;
                yellowGreenText.setText(`Unequipped!`);
                this.scene.restart();
            }
        }

        yellowGreenShop.on('pointerover', () => yellowGreenHover());
        yellowGreenShop.on('pointerout', () => yellowGreenOut());
        yellowGreenShop.on('pointerdown', () => yellowGreenOnClick());
        yellowGreenShop.input.cursor = 'pointer';

        const yellowGreenText = this.add.text(x + 110, y + 25, `Yellow Green`, { fontSize: '25px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createBlueGreenTrail(x, y, color, cost) {
        const width = 220;
        const height = 50;

        this.add.graphics().fillStyle(color).fillRoundedRect(x - 30, y, width, height, 10);

        const blueGreenShop = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x, y, width, height, 10)
            .setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);

        let blueGreenHover = () => { };
        let blueGreenOut = () => { };
        let blueGreenOnClick = () => { };

        if (!adjustableData.isBlueGreenTrailUnlocked) {
            blueGreenHover = () => { blueGreenText.setText(`$${cost}`); };

            blueGreenOut = () => {
                blueGreenShop.fillStyle(0xffffff, 1);
                blueGreenShop.fillRoundedRect(x, y, width, height, 10);
                blueGreenText.setText(`Blue Green`);
            };

            blueGreenOnClick = () => {
                if (adjustableData.totalCoins < cost) {
                    blueGreenShop.fillStyle(0xff0000, 1);
                    blueGreenShop.fillRoundedRect(x, y, width, height, 10);
                    blueGreenText.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isBlueGreenTrailUnlocked = true;
                adjustableData.trailColor = color;

                blueGreenText.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isBlueGreenTrailUnlocked) {
            blueGreenHover = () => { blueGreenText.setText(`Equip?`); }

            blueGreenOut = () => {
                blueGreenShop.fillStyle(0xffffff, 1);
                blueGreenShop.fillRoundedRect(x, y, width, height, 10);
                blueGreenText.setText(`Equip`);
            }

            blueGreenOnClick = () => {
                adjustableData.trailColor = 0x04ff00;
                blueGreenText.setText(`Equipped!`);
                this.scene.restart();
            }
        }

        if (adjustableData.isBlueGreenTrailUnlocked && adjustableData.trailColor == color) {
            blueGreenHover = () => { blueGreenText.setText(`Unequip?`); }

            blueGreenOut = () => {
                blueGreenShop.fillStyle(0xffffff, 1);
                blueGreenShop.fillRoundedRect(x, y, 160, height, 10);
                blueGreenText.setText('Equipped');
            }

            blueGreenOnClick = () => {
                adjustableData.trailColor = 0xffffff;
                blueGreenText.setText(`Unequipped!`);
                this.scene.restart();
            }
        }

        blueGreenShop.on('pointerover', () => blueGreenHover());
        blueGreenShop.on('pointerout', () => blueGreenOut());
        blueGreenShop.on('pointerdown', () => blueGreenOnClick());
        blueGreenShop.input.cursor = 'pointer';

        const blueGreenText = this.add.text(x + 110, y + 25, `Blue Green`, { fontSize: '25px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createBlueVioletTrail(x, y, color, cost) {
        const width = 220;
        const height = 50;

        this.add.graphics().fillStyle(color).fillRoundedRect(x - 30, y, width, height, 10);

        const blueVioletShop = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x, y, width, height, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(x, y, width, height),
                Phaser.Geom.Rectangle.Contains);

        let blueVioletHover = () => { };
        let blueVioletOut = () => { };
        let blueVioletOnClick = () => { };

        if (!adjustableData.isBlueVioletTrailUnlocked) {
            blueVioletHover = () => { blueVioletText.setText(`$${cost}`); };

            blueVioletOut = () => {
                blueVioletShop.fillStyle(0xffffff, 1);
                blueVioletShop.fillRoundedRect(x, y, width, height, 10);
                blueVioletText.setText(`Blue Violet`);
            };

            blueVioletOnClick = () => {
                if (adjustableData.totalCoins < cost) {
                    blueVioletShop.fillStyle(0xff0000, 1);
                    blueVioletShop.fillRoundedRect(x, y, width, height, 10);
                    blueVioletText.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isBlueVioletTrailUnlocked = true;
                adjustableData.trailColor = color;

                blueVioletText.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isBlueVioletTrailUnlocked) {
            blueVioletHover = () => { blueVioletText.setText(`Equip?`); }

            blueVioletOut = () => {
                blueVioletShop.fillStyle(0xffffff, 1);
                blueVioletShop.fillRoundedRect(x, y, width, height, 10);
                blueVioletText.setText(`Equip`);
            }

            blueVioletOnClick = () => {
                adjustableData.trailColor = 0x04ff00;
                blueVioletText.setText(`Equipped!`);
                this.scene.restart();
            }
        }

        if (adjustableData.isBlueVioletTrailUnlocked && adjustableData.trailColor == color) {
            blueVioletHover = () => { blueVioletText.setText(`Unequip?`); }

            blueVioletOut = () => {
                blueVioletShop.fillStyle(0xffffff, 1);
                blueVioletShop.fillRoundedRect(x, y, 160, height, 10);
                blueVioletText.setText('Equipped');
            }

            blueVioletOnClick = () => {
                adjustableData.trailColor = 0xffffff;
                blueVioletText.setText(`Unequipped!`);
                this.scene.restart();
            }
        }

        blueVioletShop.on('pointerover', () => blueVioletHover());
        blueVioletShop.on('pointerout', () => blueVioletOut());
        blueVioletShop.on('pointerdown', () => blueVioletOnClick());
        blueVioletShop.input.cursor = 'pointer';

        const blueVioletText = this.add.text(x + 110, y + 25, `Blue Violet`, { fontSize: '25px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createRedVioletTrail(x, y, color, cost) {
        const width = 220;
        const height = 50;

        this.add.graphics().fillStyle(color).fillRoundedRect(x - 30, y, width, height, 10);

        const redVioletShop = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(x, y, width, height, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(x, y, width, height),
                Phaser.Geom.Rectangle.Contains);

        let redVioletHover = () => { };
        let redVioletOut = () => { };
        let redVioletOnClick = () => { };

        if (!adjustableData.isRedVioletTrailUnlocked) {
            redVioletHover = () => { redVioletText.setText(`$${cost}`); };

            redVioletOut = () => {
                redVioletShop.fillStyle(0xffffff, 1);
                redVioletShop.fillRoundedRect(x, y, width, height, 10);
                redVioletText.setText(`Red Violet`);
            };

            redVioletOnClick = () => {
                if (adjustableData.totalCoins < cost) {
                    redVioletShop.fillStyle(0xff0000, 1);
                    redVioletShop.fillRoundedRect(x, y, width, height, 10);
                    redVioletText.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isRedVioletTrailUnlocked = true;
                adjustableData.trailColor = color;

                redVioletText.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isRedVioletTrailUnlocked) {
            redVioletHover = () => { redVioletText.setText(`Equip?`); }

            redVioletOut = () => {
                redVioletShop.fillStyle(0xffffff, 1);
                redVioletShop.fillRoundedRect(x, y, width, height, 10);
                redVioletText.setText(`Equip`);
            }

            redVioletOnClick = () => {
                adjustableData.trailColor = 0x04ff00;
                redVioletText.setText(`Equipped!`);
                this.scene.restart();
            }
        }

        if (adjustableData.isRedVioletTrailUnlocked && adjustableData.trailColor == color) {
            redVioletHover = () => { redVioletText.setText(`Unequip?`); }

            redVioletOut = () => {
                redVioletShop.fillStyle(0xffffff, 1);
                redVioletShop.fillRoundedRect(x, y, 160, height, 10);
                redVioletText.setText('Equipped');
            }

            redVioletOnClick = () => {
                adjustableData.trailColor = 0xffffff;
                redVioletText.setText(`Unequipped!`);
                this.scene.restart();
            }
        }

        redVioletShop.on('pointerover', () => redVioletHover());
        redVioletShop.on('pointerout', () => redVioletOut());
        redVioletShop.on('pointerdown', () => redVioletOnClick());
        redVioletShop.input.cursor = 'pointer';

        const redVioletText = this.add.text(x + 110, y + 25, `Red Violet`, { fontSize: '25px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createDisplay() {
        const container = this.add.container(this.sys.game.config.width / 2 - 50, 240);

        const outline1 = this.add.graphics().fillStyle(0xffffff).fillRoundedRect(0, 0, 510, 220, 10);
        const outline2 = this.add.graphics().fillStyle(0xffffff).fillRoundedRect(470, 80, 220, 140, 10);

        const background1 = this.add.graphics().fillStyle(0x000000).fillRoundedRect(10, 10, 490, 200, 10);
        const background2 = this.add.graphics().fillStyle(0x000000).fillRoundedRect(480, 90, 200, 120, 10);

        const line = this.add.graphics()
            .fillStyle(adjustableData.trailColor)
            .fillRoundedRect(65, 30, adjustableData.trailLength * 60, adjustableData.trailSize, 0)
            .setRotation(0.31415);

        const disclaimer = this.add.text(515, 125, `This preview of\ntrail may not\nbe accurate.`, { fontSize: '16px', fill: '#fff' });

        container.add([outline1, outline2, background1, background2, line, disclaimer]);
    }

    createTrailSize() {
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        this.add.text(gameWidth / 2 + 50, gameHeight / 2 + 80, `Size`, { fontSize: '50px', fill: '#000' });
        this.createTSPurchase1(gameWidth / 2 - 40, gameHeight / 2 + 160, 499.99, 1);
        this.createTSPurchase2(gameWidth / 2 + 120, gameHeight / 2 + 160, 999.99, 4);
    }

    createTSPurchase1(x, y, cost, upgrade) {
        const container = this.add.container(x, y);

        const outline = this.add.graphics()
            .fillStyle(0x708090)
            .fillRoundedRect(0, 0, 120, 120, 10);

        const background = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(5, 5, 110, 110, 10);

        const button = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(0, 130, 120, 40, 10)
            .setInteractive(new Phaser.Geom.Rectangle(0, 130, 120, 40), Phaser.Geom.Rectangle.Contains);

        let onOver = () => { };
        let onOut = () => { };
        let onClick = () => { };

        if (!adjustableData.isTrailSizeUpgrade1Unlocked) {
            onOver = () => { text.setText(`Purchase?`); };

            onOut = () => {
                button.fillStyle(0xffffff, 1);
                button.fillRoundedRect(0, 130, 120, 40, 10);
                text.setText(`${formatCurrency(cost)}`);
            };

            onClick = () => {
                if (adjustableData.totalCoins < cost) {
                    button.fillStyle(0xff0000, 1);
                    button.fillRoundedRect(0, 130, 120, 40, 10);
                    text.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isTrailSizeUpgrade1Unlocked = true;
                adjustableData.trailSize += upgrade;

                text.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isTrailSizeUpgrade1Unlocked) {
            onOver = () => { text.setText(`Purchased`); }
            onOut = () => { text.setText(`Purchased`); }
            onClick = () => { text.setText(`Purchased`); }
        }

        button.on('pointerover', () => onOver());
        button.on('pointerout', () => onOut());
        button.on('pointerdown', () => onClick());
        button.input.cursor = 'pointer';

        const text = this.add.text(60, 150, formatCurrency(cost), { fontSize: '20px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }

        container.add([outline, background, button, text]);
    }

    createTSPurchase2(x, y, cost, upgrade) {
        const container = this.add.container(x, y);

        const outline = this.add.graphics()
            .fillStyle(0x708090)
            .fillRoundedRect(0, 0, 120, 120, 10);

        const background = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(5, 5, 110, 110, 10);

        const button = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(0, 130, 120, 40, 10)
            .setInteractive(new Phaser.Geom.Rectangle(0, 130, 120, 40), Phaser.Geom.Rectangle.Contains);

        let onOver = () => { };
        let onOut = () => { };
        let onClick = () => { };

        if (!adjustableData.isTrailSizeUpgrade2Unlocked) {
            onOver = () => { text.setText(`Purchase?`); };

            onOut = () => {
                button.fillStyle(0xffffff, 1);
                button.fillRoundedRect(0, 130, 120, 40, 10);
                text.setText(`${formatCurrency(cost)}`);
            };

            onClick = () => {
                if (adjustableData.totalCoins < cost) {
                    button.fillStyle(0xff0000, 1);
                    button.fillRoundedRect(0, 130, 120, 40, 10);
                    text.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isTrailSizeUpgrade2Unlocked = true;
                adjustableData.trailSize += upgrade;

                text.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isTrailSizeUpgrade2Unlocked) {
            onOver = () => { text.setText(`Purchased`); }
            onOut = () => { text.setText(`Purchased`); }
            onClick = () => { text.setText(`Purchased`); }
        }

        button.on('pointerover', () => onOver());
        button.on('pointerout', () => onOut());
        button.on('pointerdown', () => onClick());
        button.input.cursor = 'pointer';

        const text = this.add.text(60, 150, formatCurrency(cost), { fontSize: '20px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }

        container.add([outline, background, button, text]);
    }

    createTrailLength() {
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        this.add.text(gameWidth - 350, gameHeight / 2 + 80, `Length`, { fontSize: '50px', fill: '#000' });
        this.createTLPurchase1(gameWidth - 400, gameHeight / 2 + 160, 799.99, 0.5);
        this.createTLPurchase2(gameWidth - 230, gameHeight / 2 + 160, 2000.00, 2.5);
    }

    createTLPurchase1(x, y, cost, upgrade) {
        const container = this.add.container(x, y);

        const outline = this.add.graphics()
            .fillStyle(0x708090)
            .fillRoundedRect(0, 0, 120, 120, 10);

        const background = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(5, 5, 110, 110, 10);

        const button = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(0, 130, 120, 40, 10)
            .setInteractive(new Phaser.Geom.Rectangle(0, 130, 120, 40), Phaser.Geom.Rectangle.Contains);

        let onOver = () => { };
        let onOut = () => { };
        let onClick = () => { };

        if (!adjustableData.isTrailLengthUpgrade1Unlocked) {
            onOver = () => { text.setText(`Purchase?`); };

            onOut = () => {
                button.fillStyle(0xffffff, 1);
                button.fillRoundedRect(0, 130, 120, 40, 10);
                text.setText(`${formatCurrency(cost)}`);
            };

            onClick = () => {
                if (adjustableData.totalCoins < cost) {
                    button.fillStyle(0xff0000, 1);
                    button.fillRoundedRect(0, 130, 120, 40, 10);
                    text.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isTrailLengthUpgrade1Unlocked = true;
                adjustableData.trailLength += upgrade;

                text.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isTrailLengthUpgrade1Unlocked) {
            onOver = () => { text.setText(`Purchased`); }
            onOut = () => { text.setText(`Purchased`); }
            onClick = () => { text.setText(`Purchased`); }
        }

        button.on('pointerover', () => onOver());
        button.on('pointerout', () => onOut());
        button.on('pointerdown', () => onClick());
        button.input.cursor = 'pointer';

        const text = this.add.text(60, 150, formatCurrency(cost), { fontSize: '20px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }

        container.add([outline, background, button, text]);
    }

    createTLPurchase2(x, y, cost, upgrade) {
        const container = this.add.container(x, y);

        const outline = this.add.graphics()
            .fillStyle(0x708090)
            .fillRoundedRect(0, 0, 120, 120, 10);

        const background = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(5, 5, 110, 110, 10);

        const button = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(0, 130, 120, 40, 10)
            .setInteractive(new Phaser.Geom.Rectangle(0, 130, 120, 40), Phaser.Geom.Rectangle.Contains);

        let onOver = () => { };
        let onOut = () => { };
        let onClick = () => { };

        if (!adjustableData.isTrailLengthUpgrade2Unlocked) {
            onOver = () => { text.setText(`Purchase?`); };

            onOut = () => {
                button.fillStyle(0xffffff, 1);
                button.fillRoundedRect(0, 130, 120, 40, 10);
                text.setText(`${formatCurrency(cost)}`);
            };

            onClick = () => {
                if (adjustableData.totalCoins < cost) {
                    button.fillStyle(0xff0000, 1);
                    button.fillRoundedRect(0, 130, 120, 40, 10);
                    text.setText(`Failed`);
                    return;
                }

                adjustableData.totalCoins -= cost;
                adjustableData.isTrailLengthUpgrade2Unlocked = true;
                adjustableData.trailLength += upgrade;

                text.setText(`Success!`);
                this.scene.restart();
            };
        }

        if (adjustableData.isTrailLengthUpgrade2Unlocked) {
            onOver = () => { text.setText(`Purchased`); }
            onOut = () => { text.setText(`Purchased`); }
            onClick = () => { text.setText(`Purchased`); }
        }

        button.on('pointerover', () => onOver());
        button.on('pointerout', () => onOut());
        button.on('pointerdown', () => onClick());
        button.input.cursor = 'pointer';

        const text = this.add.text(60, 150, formatCurrency(cost), { fontSize: '20px', fill: '#000', }).setOrigin(0.5);

        if (adjustableData.isAutoSaving) { saveData(); }

        container.add([outline, background, button, text]);
    }
}

class Settings extends Phaser.Scene {
    constructor() { super({ key: 'Settings' }); }

    create() {
        this.gameTimeTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                adjustableData.gameTime += 1;
            },
            loop: true,
        });

        this.createHomeButton();
        this.createBackground();

        this.add.text(this.sys.game.config.width / 2, 110, `Settings`, { fontSize: '110px', fill: '#F0810E' }).setOrigin(0.5);
        this.createVolume();
        this.createSave();
        this.createAutoSave();
        this.createReset();
        this.createStats();
        this.createVeggieCutStats();
    }

    update() {
        const formattedGameTime = this.formatTime(adjustableData.gameTime);

        this.timeText.setText([
            `Elpased Time: ${formattedGameTime}`,
        ]);

        if (adjustableData.isAutoSaving) {
            saveData();
        }
    }

    createHomeButton() {
        const homeButton = this.add.container(50, 20);

        const buttonOutline = this.add.graphics()
            .fillStyle(0x2F3130, 1)
            .fillRoundedRect(0, 0, 160, 60, 10);

        const buttonBackground = this.add.graphics()
            .fillStyle(0xF8F2E6)
            .fillRoundedRect(5, 5, 150, 50, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(5, 5, 160, 50),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonOutline.fillStyle(0x426F86, 1);
                buttonOutline.fillRoundedRect(0, 0, 160, 60, 10);
            })
            .on('pointerout', () => {
                buttonOutline.fillStyle(0x2F3130, 1);
                buttonOutline.fillRoundedRect(0, 0, 160, 60, 10);
            })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });
        buttonBackground.input.cursor = 'pointer';

        const homeIcon = this.add.image(30, 30, 'Home')
            .setOrigin(0.5)
            .setScale(2);

        const homeText = this.add.text(100, 30, `Return`, {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);

        homeButton.add([buttonOutline, buttonBackground, homeIcon, homeText]);

        return homeButton;
    }

    createBackground() {
        const background = this.add.graphics()
            .fillStyle(0xA7A9A8)
            .fillRoundedRect(50, 200, this.sys.game.config.width - 100, this.sys.game.config.height - 250, 20);

        this.add.graphics().fillStyle(0x000000).fillRoundedRect(70, this.sys.game.config.height - 200, 825, 5, 3);
        this.add.graphics().fillStyle(0x000000).fillRoundedRect(this.sys.game.config.width / 2 + 160, 220, 5, 600, 3);

        return background;
    }

    createVolume() {
        const numSquares = 10;
        const squareSize = 32;

        if (adjustableData.volume === 0) {
            this.add.image(100, 270, 'SpeakerMute').setOrigin(0.5).setScale(2);
        }
        else {
            this.add.image(100, 270, 'SpeakerOn').setOrigin(0.5).setScale(2);
        }

        const volumeText = this.add.text(140, 250, `Volume`, { fontSize: '40px', fill: '#000' });

        const decreaseButtonBackground = this.add.graphics()
            .fillStyle(0xfff)
            .fillRoundedRect(340, 255, 30, 30, 10);

        const decreaseButton = this.add.text(355, 268, '-', { fontSize: '30px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.adjustVolume(Math.round((adjustableData.volume - 0.1) * 10) / 10));

        const increaseButtonBackground = this.add.graphics()
            .fillStyle(0xfff)
            .fillRoundedRect(710, 255, 30, 30, 10);

        const increaseButton = this.add.text(725, 270, '+', { fontSize: '30px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.adjustVolume(Math.round((adjustableData.volume + 0.1) * 10) / 10));

        for (let i = 0; i < numSquares; i++) {
            const x = 380 + i * (squareSize);
            const isFilled = i < Math.ceil(adjustableData.volume * numSquares);

            const square = this.add.graphics()
                .fillStyle(isFilled ? 0x00ff00 : 0x000000)
                .fillRect(x, 253, squareSize, squareSize);
        }

        decreaseButtonBackground.setDepth(1);
        increaseButtonBackground.setDepth(1);
        decreaseButton.setDepth(2);
        increaseButton.setDepth(2);
    }

    adjustVolume(volume) {
        adjustableData.volume = Phaser.Math.Clamp(volume, 0, 1.0);
        this.scene.restart();

        if (backgroundMusic) { backgroundMusic.volume(adjustableData.volume); }
        if (adjustableData.isAutoSaving) { saveData(); }
    }

    createSave() {
        this.add.image(100, 375, 'Cloud').setOrigin(0.5).setScale(2);
        this.add.text(140, 355, 'Save', { fontSize: '40px', fill: '#000' });
        this.button = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(280, 355, 100, 40, 10)
            .setInteractive(new Phaser.Geom.Rectangle(280, 355, 100, 40), Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                this.button.fillStyle(0x00ff00);
                this.button.fillRoundedRect(280, 355, 100, 40, 10);
            })
            .on('pointerout', () => {
                this.button.fillStyle(0xffffff);
                this.button.fillRoundedRect(280, 355, 100, 40, 10);
            })
            .on('pointerdown', () => {
                saveData();
                this.scene.restart();
            });
        this.button.input.cursor = 'pointer';
        this.add.text(330, 375, `Save`, { fontSize: '24px', fill: '#000' }).setOrigin(0.5);
    }

    createAutoSave() {
        this.add.image(100, 470, 'FloppyDisk').setOrigin(0.5).setScale(2);
        this.add.text(140, 450, 'Auto Save', { fontSize: '40px', fill: '#000', });

        let x = 390;
        let y = 450;
        let radius = 10;
        let width = 140;
        let height = 40;

        const enableFillColor = adjustableData.isAutoSaving ? 0x00ff00 : 0xffffff;
        const enableMessage = adjustableData.isAutoSaving ? 'ENABLED' : 'ENABLE';
        const enableText = this.add.text(x + 20, y + 20, enableMessage, { fontSize: '24px', fill: '#000' }).setOrigin(0, 0.5);
        const enableButton = this.add.graphics()
            .fillStyle(enableFillColor)
            .fillRoundedRect(x, y, width, height, radius)
            .setInteractive(
                new Phaser.Geom.Rectangle(x, y, width, height),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {
                if (!adjustableData.isAutoSaving) {
                    adjustableData.isAutoSaving = !adjustableData.isAutoSaving;
                    saveData();
                }
                this.scene.restart();
            });
        enableButton.input.cursor = 'pointer';

        const disableFillColor = adjustableData.isAutoSaving ? 0xffffff : 0xff0000;
        const disableMessage = adjustableData.isAutoSaving ? 'DISABLE' : 'DISABLED';
        const disableText = this.add.text(x + 160 + 15, y + 20, disableMessage, { fontSize: '24px', fill: '#000' }).setOrigin(0, 0.5);
        const disableButton = this.add.graphics()
            .fillStyle(disableFillColor)
            .fillRoundedRect(x + 160, y, width, height, radius)
            .setInteractive(
                new Phaser.Geom.Rectangle(x + 160, y, width, height),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {
                if (adjustableData.isAutoSaving) {
                    adjustableData.isAutoSaving = !adjustableData.isAutoSaving;
                    saveData();
                }
                this.scene.restart();
            });
        disableButton.input.cursor = 'pointer';

        enableButton.setDepth(1);
        disableButton.setDepth(1);
        enableText.setDepth(2);
        disableText.setDepth(2);
    }

    createReset() {
        this.add.image(140, 765, 'Power').setOrigin(0.5).setScale(3);
        this.add.text(180, 740, 'RESET GAME', { fontSize: '50px', fill: '#000' });

        const resetText = this.add.text(530 + 60, 745 + 20, 'RESET', { fontSize: '24px', fill: '#000' }).setOrigin(0.5);
        const resetButton = this.add.graphics()
            .fillStyle(0xff0000)
            .fillRoundedRect(530, 745, 120, 40, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(530, 745, 120, 40),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {
                resetGameData();
                backgroundMusic.stop();
                this.scene.start('LoadingScene');
            });
        resetButton.input.cursor = 'pointer';

        this.add.text(530 + 250, 745 + 20, 'WARNING:\nThis action\ncannot be\nreversed.', { fontSize: '18px', fill: '#000' }).setOrigin(0.5);

        resetButton.setDepth(1);
        resetText.setDepth(2);
    }

    createStats() {
        this.add.text(this.sys.game.config.width / 2 + 350, 230, 'Stats', { fontSize: '60px', fill: '#000' });
        this.timeText = this.add.text(this.sys.game.config.width / 2 + 200, 310, '', {
            fontSize: '30px',
            fill: '#000',
        });
        this.add.text(this.sys.game.config.width / 2 + 200, 350, `Total Earned: ${formatCurrency(adjustableData.maxCoins)}`, { fontSize: '30px', fill: '#000' });
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        const formattedTime = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
        return formattedTime;
    }

    padZero(value) {
        return value < 10 ? `0${value}` : value;
    }

    createVeggieCutStats() {
        let offsetX = this.sys.game.config.width / 2 + 240;
        let offsetY = 440;
        const veggiesPerRow = 4;
        const spacingX = 125;
        let totalCutCount = 0;

        for (const veggieType in adjustableData.totalCutCount) {
            if (adjustableData.totalCutCount.hasOwnProperty(veggieType)) {
                const cutCount = adjustableData.totalCutCount[veggieType];

                const veggieImage = this.add.image(offsetX, offsetY, veggieType).setScale(2);
                const cutCountText = this.add.text(offsetX, offsetY + 50, `Count: ${cutCount}`, {
                    fontSize: '16px',
                    fill: '#000',
                }).setOrigin(0.5);

                totalCutCount += cutCount;
                offsetX += spacingX;

                if (offsetX > this.sys.game.config.width / 2 + 200 + (veggiesPerRow) * spacingX) {
                    offsetX = this.sys.game.config.width / 2 + 240;
                    offsetY += 120;
                }
            }
        }

        const totalCutText = this.add.text(offsetX + 110, offsetY - 10, `Total Sliced: ${totalCutCount}`, {
            fontSize: '30px',
            fill: '#000',
        }).setOrigin(0.5);
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#2F3130',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 10 },
            debug: false,
        },
    },
    scene: [
        LoadingScene,
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

let adjustableData = {
    isAutoSaving: false,
    isMusicPlaying: true,
    volume: 0.5,
    trailSize: 2,
    isTrailSizeUpgrade1Unlocked: false,
    isTrailSizeUpgrade2Unlocked: false,
    trailLength: 3,
    isTrailLengthUpgrade1Unlocked: false,
    isTrailLengthUpgrade2Unlocked: false,
    trailColor: 16777215,
    isRedTrailUnlocked: false,
    isYellowTrailUnlocked: false,
    isBlueTrailUnlocked: false,
    isOrangeTrailUnlocked: false,
    isGreenTrailUnlocked: false,
    isPurpleTrailUnlocked: false,
    isRedOrangeTrailUnlocked: false,
    isYellowOrangeTrailUnlocked: false,
    isYellowGreenTrailUnlocked: false,
    isBlueGreenTrailUnlocked: false,
    isBlueVioletTrailUnlocked: false,
    isRedVioletTrailUnlocked: false,
    totalCoins: 0.00,
    maxCoins: 0.00,
    gameTime: 1,
    totalCutCount: {
        'BellPepper': 0,
        'Broccoli': 0,
        'Carrot': 0,
        'Cauliflower': 0,
        'Corn': 0,
        'Eggplant': 0,
        'GreenCabbage': 0,
        'Mushroom': 0,
        'Potato': 0,
        'Pumpkin': 0,
        'Radish': 0,
        'Tomato': 0,
    },
}

const gameData = {
    hoverColor: 0xF9B931,
    confrimColor: 0xD1FFBD,
    denyColor: 0xFF474C,
    rateOfSpawn: 300,
    pathDuration: 3500,
    alottedTime: 30000,
    numberOfHearts: 5,
    veggieNames: [
        'BellPepper',
        'Broccoli',
        'Carrot',
        'Cauliflower',
        'Corn',
        'Eggplant',
        'GreenCabbage',
        'Mushroom',
        'Potato',
        'Pumpkin',
        'Radish',
        'Tomato'
    ],
    veggieValues: {
        'BellPepper': 1.78,
        'Broccoli': 1.92,
        'Carrot': 0.68,
        'Cauliflower': 1.88,
        'Corn': 0.92,
        'Eggplant': -0.79,
        'GreenCabbage': 1.12,
        'Mushroom': -0.41,
        'Potato': 0.57,
        'Pumpkin': 1.69,
        'Radish': 1.04,
        'Tomato': 1.19,
    },
}

const roundData = {
    score: 0,
    cutCount: {
        'BellPepper': 0,
        'Broccoli': 0,
        'Carrot': 0,
        'Cauliflower': 0,
        'Corn': 0,
        'Eggplant': 0,
        'GreenCabbage': 0,
        'Mushroom': 0,
        'Potato': 0,
        'Pumpkin': 0,
        'Radish': 0,
        'Tomato': 0,
    },
}

function resetRoundData() {
    gameData.alottedTime = 60000;
    roundData.score = 0;
    roundData.cutCount = {
        'BellPepper': 0,
        'Broccoli': 0,
        'Carrot': 0,
        'Cauliflower': 0,
        'Corn': 0,
        'Eggplant': 0,
        'GreenCabbage': 0,
        'Mushroom': 0,
        'Potato': 0,
        'Pumpkin': 0,
        'Radish': 0,
        'Tomato': 0,
    };
}

function saveData() {
    localStorage.setItem('adjustableData', JSON.stringify(adjustableData));
}

function loadData() {
    const savedData = localStorage.getItem('adjustableData');
    if (savedData) {
        adjustableData = JSON.parse(savedData);
    }
}

function resetGameData() {
    adjustableData = {
        isAutoSaving: false,
        isMusicPlaying: true,
        volume: 0.5,
        trailSize: 2,
        isTrailSizeUpgrade1Unlocked: false,
        isTrailSizeUpgrade2Unlocked: false,
        trailLength: 3,
        isTrailLengthUpgrade1Unlocked: false,
        isTrailLengthUpgrade2Unlocked: false,
        trailColor: 16777215,
        isRedTrailUnlocked: false,
        isYellowTrailUnlocked: false,
        isBlueTrailUnlocked: false,
        isOrangeTrailUnlocked: false,
        isGreenTrailUnlocked: false,
        isPurpleTrailUnlocked: false,
        isRedOrangeTrailUnlocked: false,
        isYellowOrangeTrailUnlocked: false,
        isYellowGreenTrailUnlocked: false,
        isBlueGreenTrailUnlocked: false,
        isBlueVioletTrailUnlocked: false,
        isRedVioletTrailUnlocked: false,
        totalCoins: 0.00,
        maxCoins: 0.00,
        gameTime: 0,
        totalCutCount: {
            'BellPepper': 0,
            'Broccoli': 0,
            'Carrot': 0,
            'Cauliflower': 0,
            'Corn': 0,
            'Eggplant': 0,
            'GreenCabbage': 0,
            'Mushroom': 0,
            'Potato': 0,
            'Pumpkin': 0,
            'Radish': 0,
            'Tomato': 0,
        },
    };

    saveData();
}

async function playBackgroundMusic() {
    try {
        backgroundMusic = new Howl({
            src: ['./media/audio/main_bgm.mp3'],
            loop: true,
            volume: adjustableData.volume,
        });

        await backgroundMusic.play();

        adjustableData.onVolumeChange = (newVolume) => {
            const clampedVolume = Phaser.Math.Clamp(newVolume, 0, 1.0);
            backgroundMusic.volume(clampedVolume);
        };
    } catch (error) {
        console.error('Error playing background music:', error.message);
    }
}

function hexToDecimal(hexString) {
    hexString = hexString.replace(/^#/, '');

    return parseInt(hexString, 16);
}

function formatCurrency(amount) {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}