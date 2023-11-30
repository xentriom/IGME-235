const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
document.body.appendChild(app.view);

const mainScene = new PIXI.Container();

app.stage.addChild(mainScene);

const title = new PIXI.Text('Fruit Ninja: REmastered', { fontSize: 36, fill: 'white' });
title.x = app.screen.width / 2 - title.width / 2;
title.y = 100;
mainScene.addChild(title);

const startButton = createButton('Start', `./media/icons/Play.png`, 300, 200, () => {
    console.log('Start button clicked');
});
mainScene.addChild(startButton);

const instructionButton = createButton('Instruction', `./media/icons/Instruction.png`, 300, 300, () => {
    console.log('Instruction button clicked');
});
mainScene.addChild(instructionButton);

const shopButton = createButton('Shop', `./media/icons/Shop.png`,300, 400, () => {
    console.log('Shop button clicked');
});
mainScene.addChild(shopButton);

// Function to create a button with text and icon
function createButton(text, iconPath, x, y, onClick) {
    const button = new PIXI.Container();

    // Create the button background
    const buttonBg = new PIXI.Sprite(PIXI.Texture.WHITE);
    buttonBg.width = 200;
    buttonBg.height = 50;
    buttonBg.tint = 0x555555; // Button color
    button.addChild(buttonBg);

    // Create the button text
    const buttonText = new PIXI.Text(text, { fontSize: 24, fill: 'white' });
    buttonText.x = buttonBg.width / 2 - buttonText.width / 2;
    buttonText.y = buttonBg.height / 2 - buttonText.height / 2;
    button.addChild(buttonText);

    // Create the button icon
    const icon = new PIXI.Sprite.from(iconPath);
    icon.width = 30; // Adjust the size of the icon as needed
    icon.height = 30;
    icon.x = 10; // Adjust the icon position as needed
    icon.y = buttonBg.height / 2 - icon.height / 2;
    button.addChild(icon);

    // Set the button's position
    button.x = x;
    button.y = y;

    // Add interactive behavior
    button.interactive = true;
    button.buttonMode = true;
    button.on('pointerdown', onClick);

    return button;
}