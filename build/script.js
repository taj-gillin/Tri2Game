// Define classes
var Player = /** @class */ (function () {
    function Player() {
        // Tells us which character the player is currently controlling. Range: [0,2]
        this.selectedCharacter = 0;
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
        };
    }
    Player.prototype.checkButtons = function (gamepad) {
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
    };
    return Player;
}());
var GameObject = /** @class */ (function () {
    function GameObject(Position, Velocity) {
        this.Position = Position;
        this.Velocity = Velocity;
    }
    return GameObject;
}());
//HTML Elements
var debugOutput1 = document.getElementById("debug1");
var debugOutput2 = document.getElementById("debug2");
// Define global arrays
var Gamepads = [];
var Players = [new Player(), new Player()];
// Define global variables
var state = "test";
// Handle controllers (this isn't actually used since the controllers are queried every frame, but it might be helpful later)
window.addEventListener("gamepadconnected", function (e) { gamepadHandler(e, true); }, false);
window.addEventListener("gamepaddisconnected", function (e) { gamepadHandler(e, false); }, false);
function gamepadHandler(event, connecting) {
    var gamepad = event.gamepad;
    // gamepad === navigator.getGamepads()[gamepad.index]
    console.log("Debug: Change with gamepad. Id: " + gamepad.id);
}
// Start animation loop
setInterval(animate, 1000 / 10);
// Animation loop
function animate() {
    querryControllers();
    debug();
}
// Update controllers (needs to be called every frame since there is no event for pressing a button on a controller, so we have to look for changes instead)
function querryControllers() {
    // Get all gamepads (built in API)
    var querryGamePads = navigator.getGamepads();
    // Update gamepads array to querries gamepads
    Gamepads = [];
    // For some reason, the querry always returns 4 objects and just makes the ones that aren't connected null, so we have to check for that
    for (var i_1 = 0; i_1 < querryGamePads.length; i_1++) {
        if (querryGamePads[i_1] != null)
            Gamepads.push(querryGamePads[i_1]);
    }
    // Check how many controllers are connected and change gamestate if there aren't 2
    if (Gamepads.length > 2) {
        state = "Overconnected";
        return; // This is a guard statement. When this runs, it ends the function by returning nothing and the rest isn't executed. This is useful here since we only want the logic to run if there are exactly 2 controllers connected. 
    }
    if (Gamepads.length != 2) { // This is actually checking if there are less than 2 controllers, since we just checked for more than 2
        state = "Disconnected";
        return;
    }
    // Update buttons pressed by checking each controller
    for (var i = 0; i < Gamepads.length; i++) {
        Players[i].checkButtons(Gamepads[i]);
    }
}
function update() {
}
function draw() {
}
function debug() {
    // Right now this just turns the buttons into strings then modifies some h1 element to display them
    // Controller 1
    var buttonOutput = "";
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
    // Controller 2
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
