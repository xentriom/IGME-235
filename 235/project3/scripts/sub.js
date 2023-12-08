let score = 0;
let trailSize = 2;

class LoadingScene extends Phaser.Scene {
    constructor() { super({ key: 'LoadingScene' }); }

    preload() {
        loadData();
        const veggieNames = ['BellPepper', 'Broccoli', 'Carrot', 'Cauliflower', 'Corn', 'Eggplant', 'GreenCabbage', 'Mushroom', 'Potato', 'Pumpkin', 'Radish', 'Tomato'];
        const iconNames = ['Power', 'FloppyDisk', 'Home', 'Shop', 'Instruction', 'Play', 'Gear', 'PlayPause', 'Heart', 'BrokenHeart', 'Backpack', 'CookingPot', 'Restart', 'Monitor', 'SpeakerOn', 'SpeakerMute'];

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
            onClick: () => this.scene.start('Intermission'),
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
    }
}

class Intermission extends Phaser.Scene {
    constructor() { super({ key: 'Intermission' }); }

    create() {
        this.createHomeButton();

        this.add.text(this.sys.game.config.width / 2, 150, 'Select a game mode!', {
            fontSize: '80px',
            fill: '#fff',
        }).setOrigin(0.5);

        this.createGameModes(0, 'practice');
        this.createGameModes(1, 'timed');
        this.createGameModes(2, 'life');
    }

    createHomeButton() {
        const homeButton = this.add.container(20, 20);

        const buttonBackground = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(0, 0, 160, 50, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(0, 0, 160, 50),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonBackground.fillStyle(0x00ff00, 1);
                buttonBackground.fillRoundedRect(0, 0, 160, 50, 10);
            })
            .on('pointerout', () => {
                buttonBackground.fillStyle(0xffffff, 1);
                buttonBackground.fillRoundedRect(0, 0, 160, 50, 10);
            })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });

        const homeIcon = this.add.image(30, 25, 'Home')
            .setOrigin(0.5)
            .setScale(2);

        const homeText = this.add.text(100, 25, `Return`, {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);

        homeButton.add([buttonBackground, homeIcon, homeText]);

        return homeButton;
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

        const buttonBackground = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(0, 0, 160, 50, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(0, 0, 160, 50),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonBackground.fillStyle(0x00ff00, 1);
                buttonBackground.fillRoundedRect(0, 0, 160, 50, 10);
            })
            .on('pointerout', () => {
                buttonBackground.fillStyle(0xffffff, 1);
                buttonBackground.fillRoundedRect(0, 0, 160, 50, 10);
            })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });

        const homeIcon = this.add.image(30, 25, 'Home')
            .setOrigin(0.5)
            .setScale(2);

        const homeText = this.add.text(100, 25, `Return`, {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);

        homeButton.add([buttonBackground, homeIcon, homeText]);

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
        this.trailGraphics.lineStyle(adjustableData.trailSize, 0x00ff00, 1);
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
        this.currentTime = 60000;
        this.timerEvent;
    }

    create() {
        this.cutCounts = {
            BellPepper: 0,
            Broccoli: 0,
            Carrot: 0,
            Cauliflower: 0,
            Corn: 0,
            Eggplant: 0,
            GreenCabbage: 0,
            Mushroom: 0,
            Potato: 0,
            Pumpkin: 0,
            Radish: 0,
            Tomato: 0
        };

        this.createHomeButton();
        this.scoreField = this.createScoreField();
        this.timerContainer = this.createTimer();

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

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true,
        });
    }

    createHomeButton() {
        const homeButton = this.add.container(20, 20);

        const buttonBackground = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(0, 0, 160, 50, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(0, 0, 160, 50),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonBackground.fillStyle(0x00ff00, 1);
                buttonBackground.fillRoundedRect(0, 0, 160, 50, 10);
            })
            .on('pointerout', () => {
                buttonBackground.fillStyle(0xffffff, 1);
                buttonBackground.fillRoundedRect(0, 0, 160, 50, 10);
            })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });

        const homeIcon = this.add.image(30, 25, 'Home')
            .setOrigin(0.5)
            .setScale(2);

        const homeText = this.add.text(100, 25, `Return`, {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);

        homeButton.add([buttonBackground, homeIcon, homeText]);

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

        const timerText = this.add.text(20, 25, '1:00', {
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
        this.trailGraphics.lineStyle(adjustableData.trailSize, 0x00ff00, 1);
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

        this.hearts = [];
        const totalWidth = gameData.numberOfHearts * 40 * 2;
        const startX = (this.sys.game.config.width - totalWidth) / 2;

        for (let i = 0; i < gameData.numberOfHearts; i++) {
            const heart = this.add.image(startX + i * 40 * 2, 20, 'Heart').setOrigin(0, 0).setScale(2);
            this.hearts.push(heart);
        }
    }

    createHomeButton() {
        const homeButton = this.add.container(20, 20);

        const buttonBackground = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(0, 0, 160, 50, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(0, 0, 160, 50),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonBackground.fillStyle(0x00ff00, 1);
                buttonBackground.fillRoundedRect(0, 0, 160, 50, 10);
            })
            .on('pointerout', () => {
                buttonBackground.fillStyle(0xffffff, 1);
                buttonBackground.fillRoundedRect(0, 0, 160, 50, 10);
            })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });

        const homeIcon = this.add.image(30, 25, 'Home')
            .setOrigin(0.5)
            .setScale(2);

        const homeText = this.add.text(100, 25, `Return`, {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);

        homeButton.add([buttonBackground, homeIcon, homeText]);

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
        this.trailGraphics.lineStyle(adjustableData.trailSize, 0x00ff00, 1);
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
        for (const veggieType in roundData.cutCount) {
            if (roundData.cutCount.hasOwnProperty(veggieType)) {
                const cutCount = roundData.cutCount[veggieType];
                const veggieValue = gameData.veggieValues[veggieType] || 0;

                adjustableData.totalCoins += cutCount * veggieValue;
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
    constructor() { super({ key: 'Shop' }); }

    create() {
        this.createHomeButton();

        this.add.text(this.sys.game.config.width / 2, 150, `You got ${adjustableData.totalCoins} bucks`, {
            fontSize: '120px',
            fill: '#fff',
        }).setOrigin(0.5);

        // if (dataManager.isSavingData) {
        //     dataManager.saveData();
        // }
    }

    createHomeButton() {
        const homeButton = this.add.container(20, 20);

        const buttonBackground = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(0, 0, 160, 50, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(0, 0, 160, 50),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonBackground.fillStyle(0x00ff00, 1);
                buttonBackground.fillRoundedRect(0, 0, 160, 50, 10);
            })
            .on('pointerout', () => {
                buttonBackground.fillStyle(0xffffff, 1);
                buttonBackground.fillRoundedRect(0, 0, 160, 50, 10);
            })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });

        const homeIcon = this.add.image(30, 25, 'Home')
            .setOrigin(0.5)
            .setScale(2);

        const homeText = this.add.text(100, 25, `Return`, {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);

        homeButton.add([buttonBackground, homeIcon, homeText]);

        return homeButton;
    }
}

class Settings extends Phaser.Scene {
    constructor() { super({ key: 'Settings' }); }

    create() {
        this.createHomeButton();
        this.createBackground();

        this.add.text(this.sys.game.config.width / 2, 110, `Settings`, { fontSize: '110px', fill: '#fff' }).setOrigin(0.5);
        this.createVolume();
        this.createSave();
        this.createReset();
    }

    createHomeButton() {
        const homeButton = this.add.container(20, 20);

        const buttonBackground = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(0, 0, 160, 50, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(0, 0, 160, 50),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => {
                buttonBackground.fillStyle(0x00ff00, 1);
                buttonBackground.fillRoundedRect(0, 0, 160, 50, 10);
            })
            .on('pointerout', () => {
                buttonBackground.fillStyle(0xffffff, 1);
                buttonBackground.fillRoundedRect(0, 0, 160, 50, 10);
            })
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            });

        const homeIcon = this.add.image(30, 25, 'Home')
            .setOrigin(0.5)
            .setScale(2);

        const homeText = this.add.text(100, 25, `Return`, {
            fontSize: '24px',
            fill: '#000',
        }).setOrigin(0.5);

        homeButton.add([buttonBackground, homeIcon, homeText]);

        return homeButton;
    }

    createBackground() {
        const background = this.add.graphics()
            .fillStyle(0xd3d3d3)
            .fillRoundedRect(50, 200, this.sys.game.config.width - 100, this.sys.game.config.height - 250, 20);

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
        this.add.image(100, 420, 'FloppyDisk').setOrigin(0.5).setScale(2);
        this.add.text(140, 400, 'Auto Save', { fontSize: '40px', fill: '#000', });

        let x = 390;
        let y = 400;
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
        this.add.image(100, 570, 'Power').setOrigin(0.5).setScale(2);
        this.add.text(140, 550, 'Reset Game', { fontSize: '40px', fill: '#000' });

        const resetText = this.add.text(430 + 50, 550 + 20, 'RESET', { fontSize: '24px', fill: '#000' }).setOrigin(0.5);
        const resetButton = this.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(430, 550, 100, 40, 10)
            .setInteractive(
                new Phaser.Geom.Rectangle(390, 550, 460, 40),
                Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {
                resetGameData();
                this.scene.start('LoadingScene');
            });
        resetButton.input.cursor = 'pointer';

        resetButton.setDepth(1);
        resetText.setDepth(2);
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
    trailLength: 5,
    totalCoins: 0,
}

const gameData = {
    alottedTime: 60000,
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
        'BellPepper': 1,
        'Broccoli': 1,
        'Carrot': 1,
        'Cauliflower': 1,
        'Corn': 1,
        'Eggplant': 1,
        'GreenCabbage': 1,
        'Mushroom': 1,
        'Potato': 1,
        'Pumpkin': 1,
        'Radish': 1,
        'Tomato': 1,
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
        trailLength: 5,
        totalCoins: 0,
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
            const clampedVolume = Phaser.Math.Clamp(newVolume, 0.1, 1.0);
            backgroundMusic.volume(clampedVolume);
        };
    } catch (error) {
        console.error('Error playing background music:', error.message);
    }
}