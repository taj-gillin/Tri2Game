var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Define classes
var Player = /** @class */ (function () {
    function Player(controllerNumber) {
        this.attackHoldTime = 0;
        this.Characters = [new Shelly([100, 100], [0, 0]), new Mike([100, 100], [0, 0]), new Bill([100, 100], [0, 0])];
        this.controllerNumber = controllerNumber;
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
        this.prevButtons = {
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
    Player.prototype.update = function () {
        // First, store previous button states, then update current button states. I have to do this for in loop because copying reference types (like an object) just make both variables point to the same object and changing one will change both.
        for (var button in this.Buttons)
            this.prevButtons[button] = this.Buttons[button];
        if (state == "playing")
            this.checkButtons(Gamepads[this.controllerNumber]);
        // Update holding time for attack button
        // If attack button is pressed, attack
        this.attackHoldTime = (Math.abs(Math.sqrt(Math.pow(this.Buttons.rightStick[0], 2) + Math.pow(this.Buttons.rightStick[1], 2))) > 0.3) ? this.attackHoldTime + 1 : 0;
        if (this.Buttons.rightStickPress && this.attackHoldTime > 0) {
            this.Characters[this.selectedCharacter].attack();
            this.attackHoldTime = 0;
        }
        // Update character
        if (this.Buttons.leftShoulder && !this.prevButtons.leftShoulder)
            this.selectedCharacter = (this.selectedCharacter + 5) % 3; // Adding 5 does the same thing as subtracting 1 conceptually, but subtracting 1 would actually cause the number to be negative
        if (this.Buttons.rightShoulder && !this.prevButtons.rightShoulder)
            this.selectedCharacter = (this.selectedCharacter + 1) % 3;
        // Update character velocity
        this.Characters[this.selectedCharacter].move(this.Buttons.leftStick); // If character is selected, set its velocity based on left stick. 
        // Do any other character updates
        for (var i = 0; i < this.Characters.length; i++) {
            this.Characters[i].update();
        }
    };
    Player.prototype.draw = function () {
        for (var _i = 0, _a = this.Characters; _i < _a.length; _i++) {
            var character = _a[_i];
            character.drawCharacter();
        }
        if (this.attackHoldTime > 0) {
            this.Characters[this.selectedCharacter].drawAttackPreview();
        }
    };
    return Player;
}());
// 
var GameObject = /** @class */ (function () {
    function GameObject(Position, Velocity) {
        this.Position = Position;
        this.Velocity = Velocity;
    }
    return GameObject;
}());
var CollidableObject = /** @class */ (function (_super) {
    __extends(CollidableObject, _super);
    function CollidableObject(Position, width, height) {
        var _this = _super.call(this, Position, [0, 0]) || this;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    return CollidableObject;
}(GameObject));
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    function Box(Position, width, height) {
        return _super.call(this, Position, width, height) || this;
    }
    Box.prototype.update = function () { };
    Box.prototype.draw = function () {
        context.fillStyle = "red";
        context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
    };
    return Box;
}(CollidableObject));
var Character = /** @class */ (function (_super) {
    __extends(Character, _super);
    function Character(Position, Velocity, speedScalar, width, height) {
        var _this = _super.call(this, Position, Velocity) || this;
        _this.speedScalar = speedScalar;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Character.prototype.update = function () {
    };
    Character.prototype.checkCollision = function (object) {
        if (this.Position[0] < object.Position[0] + object.width && this.Position[0] + this.width > object.Position[0] && this.Position[1] < object.Position[1] + object.height && this.Position[1] + this.height > object.Position[1])
            return true;
        return false;
    };
    Character.prototype.move = function (Joystick) {
        this.Velocity = [Joystick[0] * this.speedScalar, Joystick[1] * this.speedScalar];
        if (Math.abs(this.Velocity[0]) > 0)
            this.moveX();
        if (Math.abs(this.Velocity[1]) > 0)
            this.moveY();
    };
    // I should turn these two into one function at some point
    Character.prototype.moveX = function () {
        this.Position[0] += this.Velocity[0];
        for (var _i = 0, Objects_1 = Objects; _i < Objects_1.length; _i++) {
            var object = Objects_1[_i];
            if (this.checkCollision(object)) {
                this.Position[0] -= this.Velocity[0];
                this.Velocity[0] = (this.Velocity[0] > 0 ? object.Position[0] - (this.Position[0] + this.width) : (object.Position[0] + object.width) - this.Position[0]);
                this.Position[0] += this.Velocity[0];
                return;
            }
        }
    };
    Character.prototype.moveY = function () {
        this.Position[1] += this.Velocity[1];
        for (var _i = 0, Objects_2 = Objects; _i < Objects_2.length; _i++) {
            var object = Objects_2[_i];
            if (this.checkCollision(object)) {
                this.Position[1] -= this.Velocity[1];
                this.Velocity[1] = (this.Velocity[1] > 0 ? object.Position[1] - (this.Position[1] + this.height) : (object.Position[1] + object.height) - this.Position[1]);
                this.Position[1] += this.Velocity[1];
                return;
            }
        }
    };
    Character.prototype.draw = function () { alert("this should not be called!"); };
    return Character;
}(GameObject));
var Shelly = /** @class */ (function (_super) {
    __extends(Shelly, _super);
    function Shelly(Position, Velocity) {
        return _super.call(this, Position, Velocity, 10, 20, 40) || this;
    }
    Shelly.prototype.drawCharacter = function () {
        context.fillStyle = "purple";
        context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
    };
    Shelly.prototype.attack = function () { };
    ;
    Shelly.prototype.drawAttackPreview = function () { };
    ;
    return Shelly;
}(Character));
var Mike = /** @class */ (function (_super) {
    __extends(Mike, _super);
    function Mike(Position, Velocity) {
        return _super.call(this, Position, Velocity, 20, 20, 40) || this;
    }
    Mike.prototype.drawCharacter = function () {
        context.fillStyle = "blue";
        context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
    };
    Mike.prototype.attack = function () { };
    ;
    Mike.prototype.drawAttackPreview = function () { };
    return Mike;
}(Character));
var Bill = /** @class */ (function (_super) {
    __extends(Bill, _super);
    function Bill(Position, Velocity) {
        return _super.call(this, Position, Velocity, 30, 20, 40) || this;
    }
    Bill.prototype.drawCharacter = function () {
        context.fillStyle = "green";
        context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
    };
    Bill.prototype.attack = function () { };
    ;
    Bill.prototype.drawAttackPreview = function () { };
    return Bill;
}(Character));
// Initiate canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;
//HTML Elements
var debugOutput1 = document.getElementById("debug1");
var debugOutput2 = document.getElementById("debug2");
// Define global arrays
var Gamepads = [];
var Players = [new Player(0), new Player(1)];
var Objects = [new Box([300, 300], 100, 100), new Box([500, 500], 100, 100)];
// Define global variables
var frameRate = 60;
var state = "playing";
// Handle controllers (this isn't actually used since the controllers are queried every frame, but it might be helpful later)
window.addEventListener("gamepadconnected", function (e) { gamepadHandler(e, true); }, false);
window.addEventListener("gamepaddisconnected", function (e) { gamepadHandler(e, false); }, false);
function gamepadHandler(event, connecting) {
    var gamepad = event.gamepad;
    // gamepad === navigator.getGamepads()[gamepad.index]
    console.log("Debug: Change with gamepad. Id: " + gamepad.id);
}
// Start animation loop
setInterval(animate, 1000 / frameRate);
// Animation loop
function animate() {
    querryControllers();
    update();
    draw();
    // debug();
}
// Update controllers (needs to be called every frame since there is no event for pressing a button on a controller, so we have to look for changes instead)
function querryControllers() {
    // Get all gamepads (built in API)
    var querryGamePads = navigator.getGamepads();
    // Update gamepads array to querries gamepads
    Gamepads = [];
    // For some reason, the querry always returns 4 objects and just makes the ones that aren't connected null, so we have to check for that
    for (var _i = 0, querryGamePads_1 = querryGamePads; _i < querryGamePads_1.length; _i++) {
        var gamepad = querryGamePads_1[_i];
        if (gamepad != null)
            Gamepads.push(gamepad);
    }
    // Check how many controllers are connected and change gamestate if there aren't 2
    if (Gamepads.length > 2) {
        state = "Overconnected";
        return; // This is a guard statement. When this runs, it ends the function by returning nothing and the rest of the function isn't executed. This is useful here since we only want the logic to run if there are exactly 2 controllers connected. 
    }
    if (Gamepads.length != 2) { // This is actually checking if there are less than 2 controllers, since we just checked for more than 2
        state = "Disconnected";
        return;
    }
    // Temp code (will remove when we have a pause system)
    if (Gamepads.length == 2) {
        state = "playing";
    }
}
function update() {
    for (var _i = 0, Players_1 = Players; _i < Players_1.length; _i++) {
        var player = Players_1[_i];
        player.update();
    }
    for (var _a = 0, Objects_3 = Objects; _a < Objects_3.length; _a++) {
        var object = Objects_3[_a];
        object.update();
    }
}
function draw() {
    clearCanvas();
    for (var _i = 0, Players_2 = Players; _i < Players_2.length; _i++) {
        var player = Players_2[_i];
        player.draw();
    }
    for (var _a = 0, Objects_4 = Objects; _a < Objects_4.length; _a++) {
        var object = Objects_4[_a];
        object.draw();
    }
}
function debug() {
    var buttonOutput = "";
    // // Right now this just turns the buttons into strings then modifies some h1 element to display them
    // // Controller 1
    // buttonOutput += "A: " + Players[0].Buttons.a + "\n";
    // buttonOutput += "B: " + Players[0].Buttons.b + "\n";
    // buttonOutput += "X: " + Players[0].Buttons.x + "\n";
    // buttonOutput += "Y: " + Players[0].Buttons.y + "\n";
    // buttonOutput += "Left Shoulder: " + Players[0].Buttons.leftShoulder + "\n";
    // buttonOutput += "Right Shoulder: " + Players[0].Buttons.rightShoulder + "\n";
    // buttonOutput += "Left Trigger: " + Players[0].Buttons.leftTrigger + "\n";
    // buttonOutput += "Right Trigger: " + Players[0].Buttons.rightTrigger + "\n";
    // buttonOutput += "Dpad Up: " + Players[0].Buttons.dpadUp + "\n";
    // buttonOutput += "Dpad Down: " + Players[0].Buttons.dpadDown + "\n";
    // buttonOutput += "Dpad Left: " + Players[0].Buttons.dpadLeft + "\n";
    // buttonOutput += "Dpad Right: " + Players[0].Buttons.dpadRight + "\n";
    // buttonOutput += "Settings: " + Players[0].Buttons.settings + "\n";
    // buttonOutput += "View: " + Players[0].Buttons.view + "\n";
    // buttonOutput += "Left Stick Press: " + Players[0].Buttons.leftStickPress + "\n";
    // buttonOutput += "Right Stick Press: " + Players[0].Buttons.rightStickPress + "\n";
    // buttonOutput += "Left Stick: " + Players[0].Buttons.leftStick + "\n";
    // buttonOutput += "Right Stick: " + Players[0].Buttons.rightStick + "\n";
    // debugOutput1.innerText = buttonOutput;
    // // Controller 2
    // buttonOutput = "";
    // buttonOutput += "A: " + Players[1].Buttons.a + "\n";
    // buttonOutput += "B: " + Players[1].Buttons.b + "\n";
    // buttonOutput += "X: " + Players[1].Buttons.x + "\n";
    // buttonOutput += "Y: " + Players[1].Buttons.y + "\n";
    // buttonOutput += "Left Shoulder: " + Players[1].Buttons.leftShoulder + "\n";
    // buttonOutput += "Right Shoulder: " + Players[1].Buttons.rightShoulder + "\n";
    // buttonOutput += "Left Trigger: " + Players[1].Buttons.leftTrigger + "\n";
    // buttonOutput += "Right Trigger: " + Players[1].Buttons.rightTrigger + "\n";
    // buttonOutput += "Dpad Up: " + Players[1].Buttons.dpadUp + "\n";
    // buttonOutput += "Dpad Down: " + Players[1].Buttons.dpadDown + "\n";
    // buttonOutput += "Dpad Left: " + Players[1].Buttons.dpadLeft + "\n";
    // buttonOutput += "Dpad Right: " + Players[1].Buttons.dpadRight + "\n";
    // buttonOutput += "Settings: " + Players[1].Buttons.settings + "\n";
    // buttonOutput += "View: " + Players[1].Buttons.view + "\n";
    // buttonOutput += "Left Stick Press: " + Players[1].Buttons.leftStickPress + "\n";
    // buttonOutput += "Right Stick Press: " + Players[1].Buttons.rightStickPress + "\n";
    // buttonOutput += "Left Stick: " + Players[1].Buttons.leftStick + "\n";
    // buttonOutput += "Right Stick: " + Players[1].Buttons.rightStick + "\n";
    // debugOutput2.innerText = buttonOutput;
    // // Character switcher
    // buttonOutput = `Players 1 character: ${Players[0].selectedCharacter}\nPlayers 2 character: ${Players[1].selectedCharacter}\n`;
    // debugOutput1.innerText = buttonOutput;
    // Checking for joystick normalization
    buttonOutput = "";
    var leftMag = Math.sqrt(Math.pow(Players[0].Buttons.leftStick[0], 2) + Math.pow(Players[0].Buttons.leftStick[1], 2));
    buttonOutput = "Left Stick Magnitude: " + leftMag + "\n";
    buttonOutput += "Right Stick Magnitude: " + Math.sqrt(Math.pow(Players[0].Buttons.rightStick[0], 2) + Math.pow(Players[0].Buttons.rightStick[1], 2)) + "\n";
    debugOutput1.innerText = buttonOutput;
}
function clearCanvas() {
    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.fillRect(0, 0, canvas.width, canvas.height);
}
