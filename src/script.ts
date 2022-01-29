// Define classes
class Player {
    Buttons: {
        a: boolean;
        b: boolean;
        x: boolean;
        y: boolean;
        leftShoulder: boolean;
        rightShoulder: boolean;
        leftTrigger: number;
        rightTrigger: number;
        dpadUp: boolean;
        dpadDown: boolean;
        dpadLeft: boolean;
        dpadRight: boolean;
        settings: boolean;
        view: boolean;
        leftStickPress: boolean;
        rightStickPress: boolean;
        leftStick: [number, number];
        rightStick: [number, number];
    }

    checkButtons(gamepad: Gamepad) {
        this.Buttons.a = gamepad.buttons[0].pressed;
        this.Buttons.b = gamepad.buttons[1].pressed;
        this.Buttons.x = gamepad.buttons[2].pressed;
        this.Buttons.y = gamepad.buttons[3].pressed;
        this.Buttons.leftShoulder = gamepad.buttons[4].pressed;
        this.Buttons.rightShoulder = gamepad.buttons[5].pressed;
        this.Buttons.leftTrigger = gamepad.buttons[6].value;
        this.Buttons.rightTrigger = gamepad.buttons[7].value;
        this.Buttons.dpadUp = gamepad.buttons[12].pressed;
        this.Buttons.dpadDown = gamepad.buttons[13].pressed;
        this.Buttons.dpadLeft = gamepad.buttons[14].pressed;
        this.Buttons.dpadRight = gamepad.buttons[15].pressed;
        this.Buttons.settings = gamepad.buttons[9].pressed;
        this.Buttons.view = gamepad.buttons[8].pressed;
        this.Buttons.leftStickPress = gamepad.buttons[10].pressed;
        this.Buttons.rightStickPress = gamepad.buttons[11].pressed;
        this.Buttons.leftStick = [gamepad.axes[0], gamepad.axes[1]];
        this.Buttons.rightStick = [gamepad.axes[2], gamepad.axes[3]];
    }

    constructor() {
        this.Buttons = {
            a: false,
            b: false,
            x: false,
            y: false,
            leftShoulder: false,
            rightShoulder: false,
            leftTrigger: 0,
            rightTrigger: 0,
            dpadUp: false,
            dpadDown: false,
            dpadLeft: false,
            dpadRight: false,
            settings: false,
            view: false,
            leftStickPress: false,
            rightStickPress: false,
            leftStick: [0, 0],
            rightStick: [0, 0]
        }
    }
}

abstract class GameObject {
    Position: [number, number];
    Velocity: [number, number];

    constructor(Position: [number, number], Velocity: [number, number]) {
        this.Position = Position;
        this.Velocity = Velocity;
    }

}



//HTML Elements
var debugOutput1 = document.getElementById("debug1");
var debugOutput2 = document.getElementById("debug2");

// Define global arrays
var Gamepads: Array<Gamepad> = [];
var Players: Array<Player> = [new Player(), new Player()];

// Define global variables
var state = "test";

// Handle controllers (this isn't actually used since the controllers are queried every frame, but it might be helpful later)
function gamepadHandler(event, connecting) {
    var gamepad = event.gamepad;
    // Note:
    // gamepad === navigator.getGamepads()[gamepad.index]


    console.log("Debug: Change with gamepad. Id: " + gamepad.id)
}

window.addEventListener("gamepadconnected", function (e) { gamepadHandler(e, true); }, false);
window.addEventListener("gamepaddisconnected", function (e) { gamepadHandler(e, false); }, false);


//Start animation loop
setInterval(animate, 1000 / 10);

function animate() {
    querryControllers();

    debug();
}

function querryControllers() {
    var querryGamePads = navigator.getGamepads();
    Gamepads = [];

    let controllerCount = 0;
    for (let i = 0; i < querryGamePads.length; i++) {
        if (querryGamePads[i] != null) Gamepads.push(querryGamePads[i]);
    }
    if (Gamepads.length <= 0) {
        state = "no controllers";
        return;
    }
    if (Gamepads.length > 2) {
        state = Gamepads.length + " controllers";
        return;
    }
    for (var i = 0; i < Gamepads.length; i++) {
        Players[i].checkButtons(Gamepads[i]);
    }
}


function update() {

}

function draw() {

}

function debug() {
    let buttonOutput = "";
    buttonOutput += "A: " + Players[0].Buttons.a + "\n";
    buttonOutput += "B: " + Players[0].Buttons.b + "\n";
    buttonOutput += "X: " + Players[0].Buttons.x + "\n";
    buttonOutput += "Y: " + Players[0].Buttons.y + "\n";
    buttonOutput += "Left Shoulder: " + Players[0].Buttons.leftShoulder + "\n";
    buttonOutput += "Right Shoulder: " + Players[0].Buttons.rightShoulder + "\n";
    buttonOutput += "Left Trigger: " + Players[0].Buttons.leftTrigger + "\n";
    buttonOutput += "Right Trigger: " + Players[0].Buttons.rightTrigger + "\n";
    buttonOutput += "Dpad Up: " + Players[0].Buttons.dpadUp + "\n";
    buttonOutput += "Dpad Down: " + Players[0].Buttons.dpadDown + "\n";
    buttonOutput += "Dpad Left: " + Players[0].Buttons.dpadLeft + "\n";
    buttonOutput += "Dpad Right: " + Players[0].Buttons.dpadRight + "\n";
    buttonOutput += "Settings: " + Players[0].Buttons.settings + "\n";
    buttonOutput += "View: " + Players[0].Buttons.view + "\n";
    buttonOutput += "Left Stick Press: " + Players[0].Buttons.leftStickPress + "\n";
    buttonOutput += "Right Stick Press: " + Players[0].Buttons.rightStickPress + "\n";
    buttonOutput += "Left Stick: " + Players[0].Buttons.leftStick + "\n";
    buttonOutput += "Right Stick: " + Players[0].Buttons.rightStick + "\n";


    debugOutput1.innerText = buttonOutput;

    buttonOutput = "";
    buttonOutput += "A: " + Players[1].Buttons.a + "\n";
    buttonOutput += "B: " + Players[1].Buttons.b + "\n";
    buttonOutput += "X: " + Players[1].Buttons.x + "\n";
    buttonOutput += "Y: " + Players[1].Buttons.y + "\n";
    buttonOutput += "Left Shoulder: " + Players[1].Buttons.leftShoulder + "\n";
    buttonOutput += "Right Shoulder: " + Players[1].Buttons.rightShoulder + "\n";
    buttonOutput += "Left Trigger: " + Players[1].Buttons.leftTrigger + "\n";
    buttonOutput += "Right Trigger: " + Players[1].Buttons.rightTrigger + "\n";
    buttonOutput += "Dpad Up: " + Players[1].Buttons.dpadUp + "\n";
    buttonOutput += "Dpad Down: " + Players[1].Buttons.dpadDown + "\n";
    buttonOutput += "Dpad Left: " + Players[1].Buttons.dpadLeft + "\n";
    buttonOutput += "Dpad Right: " + Players[1].Buttons.dpadRight + "\n";
    buttonOutput += "Settings: " + Players[1].Buttons.settings + "\n";
    buttonOutput += "View: " + Players[1].Buttons.view + "\n";
    buttonOutput += "Left Stick Press: " + Players[1].Buttons.leftStickPress + "\n";
    buttonOutput += "Right Stick Press: " + Players[1].Buttons.rightStickPress + "\n";
    buttonOutput += "Left Stick: " + Players[1].Buttons.leftStick + "\n";
    buttonOutput += "Right Stick: " + Players[1].Buttons.rightStick + "\n";


    debugOutput2.innerText = buttonOutput;
}