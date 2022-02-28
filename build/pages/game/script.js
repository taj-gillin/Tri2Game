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
var Game = /** @class */ (function () {
    function Game() {
        this.score = [0, 0];
        this.minWinScore = 3;
        this.paused = false;
    }
    Game.prototype.init = function () {
        this.resetField();
    };
    Game.prototype.goalScored = function (team) {
        this.score[team]++;
        if (this.score[team] >= this.minWinScore) {
            this.endGame(team);
        }
        this.resetField();
    };
    Game.prototype.endGame = function (team) {
        localStorage.setItem("winner", team.toString());
        window.location.href = "../win/index.html";
    };
    Game.prototype.resetField = function () {
        ball.reset();
        for (var _i = 0, Players_1 = Players; _i < Players_1.length; _i++) {
            var player = Players_1[_i];
            player.resetCharacters();
        }
    };
    Game.prototype.display = function () {
        this.displayScore();
    };
    Game.prototype.displayScore = function () {
        context.font = "60px Arial";
        context.textAlign = "center";
        context.fillStyle = "blue";
        context.fillText("" + this.score[0], canvas.width / 2 - 30, 65);
        context.fillStyle = "black";
        context.fillText(" - ", canvas.width / 2, 65);
        context.fillStyle = "red";
        context.fillText("" + this.score[1], canvas.width / 2 + 30, 65);
    };
    return Game;
}());
// Define classes
var Player = /** @class */ (function () {
    function Player(controllerNumber) {
        this.attackHoldTime = 0;
        this.hasBall = false;
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
        this.Characters = [new Shelly(this.controllerNumber), new Esteban(this.controllerNumber), new Bill(this.controllerNumber)];
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
        // Try to avoid drift by cutting off small values
        if (Math.sqrt(Math.pow(this.Buttons.leftStick[0], 2) + Math.pow(this.Buttons.leftStick[1], 2)) < 0.2) {
            if (Math.abs(this.Buttons.leftStick[0]) < 0.2)
                this.Buttons.leftStick[0] = 0;
            if (Math.abs(this.Buttons.leftStick[1]) < 0.2)
                this.Buttons.leftStick[1] = 0;
        }
        if (Math.sqrt(Math.pow(this.Buttons.rightStick[0], 2) + Math.pow(this.Buttons.rightStick[1], 2)) < 0.2) {
            if (Math.abs(this.Buttons.rightStick[0]) < 0.2)
                this.Buttons.rightStick[0] = 0;
            if (Math.abs(this.Buttons.rightStick[1]) < 0.2)
                this.Buttons.rightStick[1] = 0;
        }
    };
    Player.prototype.update = function () {
        // First, store previous button states, then update current button states. I have to do this for in loop because copying reference types (like an object) just make both variables point to the same object and changing one will change both.
        for (var button in this.Buttons)
            this.prevButtons[button] = this.Buttons[button];
        if (state == "playing")
            this.checkButtons(Gamepads[this.controllerNumber]);
        // Update character
        if (this.Buttons.leftShoulder && !this.prevButtons.leftShoulder)
            this.changeCharacterLeft();
        if (this.Buttons.rightShoulder && !this.prevButtons.rightShoulder)
            this.changeCharacterRight();
        if (this.Characters[this.selectedCharacter].respawnTimer > 0)
            this.changeCharacterRight();
        // Do any other character updates
        for (var i = 0; i < this.Characters.length; i++) {
            this.Characters[i].update();
        }
        // Check if selected character is dead, don't run code after if they are
        if (this.Characters[0].respawnTimer > 0 && this.Characters[1].respawnTimer > 0 && this.Characters[2].respawnTimer > 0)
            return;
        // Update character velocity
        // First, set all to zero (used for animations) (but I forgot why)
        for (var _i = 0, _a = this.Characters; _i < _a.length; _i++) {
            var character = _a[_i];
            character.Velocity = [0, 0];
        }
        // Then, add in the movement from the left stick
        if (Math.abs(Math.sqrt(Math.pow(this.Buttons.leftStick[0], 2) + Math.pow(this.Buttons.leftStick[1], 2))) > 0.2) { // Check if the left stick is moved (minimum set to ignore controller drift)
            if (Math.abs(this.Buttons.leftStick[0]) > Math.abs(this.Buttons.leftStick[1])) { // Check if the left stick is moved horizontally more than vertically
                if (this.Buttons.leftStick[0] > 0) { // If so, check if the left stick is moved right
                    this.Characters[this.selectedCharacter].move([1, 0]);
                    this.Characters[this.selectedCharacter].direction = "RIGHT";
                }
                else { // This means the left stick is moved left
                    this.Characters[this.selectedCharacter].move([-1, 0]);
                    this.Characters[this.selectedCharacter].direction = "LEFT";
                }
            }
            else { // This means the left stick is moved vertically
                if (this.Buttons.leftStick[1] > 0) { // Check if the left stick is moved down
                    this.Characters[this.selectedCharacter].move([0, 1]);
                    this.Characters[this.selectedCharacter].direction = "DOWN";
                }
                else { // This means the left stick is moved up
                    this.Characters[this.selectedCharacter].move([0, -1]);
                    this.Characters[this.selectedCharacter].direction = "UP";
                }
            }
        }
        // Update holding time for attack button, used for both throwing the ball and attacking
        this.attackHoldTime = (this.Characters[this.selectedCharacter].cooldownTimer == 0 && Math.abs(Math.sqrt(Math.pow(this.Buttons.rightStick[0], 2) + Math.pow(this.Buttons.rightStick[1], 2))) > 0.3) ? this.attackHoldTime + 1 : 0;
        // Ball code
        if (this.hasBall && this.Buttons.rightTrigger && this.attackHoldTime > 0 && this.Characters[this.selectedCharacter].cooldownTimer == 0) {
            this.Characters[this.selectedCharacter].throwBall();
            this.attackHoldTime = 0;
            return;
        }
        // If holding ball, don't run attack code
        if (this.hasBall)
            return;
        // If attack button is pressed, attack
        if (this.Buttons.rightTrigger && this.attackHoldTime > 0 && this.Characters[this.selectedCharacter].cooldownTimer == 0) {
            this.Characters[this.selectedCharacter].attack();
            this.attackHoldTime = 0;
        }
    };
    Player.prototype.draw = function () {
        if (this.attackHoldTime > 0 && this.Characters[this.selectedCharacter].cooldownTimer == 0 && this.Characters[this.selectedCharacter].respawnTimer == 0) {
            if (this.hasBall) {
                this.Characters[this.selectedCharacter].drawThrowPreview();
            }
            else {
                this.Characters[this.selectedCharacter].drawAttackPreview();
            }
        }
        for (var _i = 0, _a = this.Characters; _i < _a.length; _i++) {
            var character = _a[_i];
            character.draw();
        }
        // Draw character selection
        if (this.Characters[this.selectedCharacter].respawnTimer == 0) {
            var selected = this.Characters[this.selectedCharacter];
            context.beginPath();
            context.moveTo(selected.Position[0] + selected.width / 2 - 12, selected.Position[1] - 16);
            context.lineTo(selected.Position[0] + selected.width / 2, selected.Position[1] - 8);
            context.lineTo(selected.Position[0] + selected.width / 2 + 12, selected.Position[1] - 16);
            context.closePath();
            context.lineWidth = 2;
            context.strokeStyle = "black";
            context.stroke();
            context.fillStyle = this.controllerNumber == 0 ? "blue" : "red";
            context.fill();
        }
    };
    Player.prototype.resetCharacters = function () {
        for (var _i = 0, _a = this.Characters; _i < _a.length; _i++) {
            var character = _a[_i];
            character.respawn();
        }
    };
    Player.prototype.changeCharacterRight = function () {
        for (var i = 0; i < this.Characters.length; i++) {
            this.selectedCharacter = (this.selectedCharacter + 1) % 3;
            if (this.Characters[this.selectedCharacter].respawnTimer == 0)
                break;
        }
    };
    Player.prototype.changeCharacterLeft = function () {
        for (var i = 0; i < this.Characters.length; i++) {
            this.selectedCharacter = (this.selectedCharacter + 5) % 3; // Adding 5 does the same thing as subtracting 1 conceptually, but subtracting 1 would actually cause the number to be negative
            if (this.Characters[this.selectedCharacter].respawnTimer == 0)
                break;
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
        context.fillStyle = "black";
        context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
    };
    return Box;
}(CollidableObject));
var Goal = /** @class */ (function (_super) {
    __extends(Goal, _super);
    function Goal(Position, width, height, team) {
        var _this = _super.call(this, Position, width, height) || this;
        _this.team = team;
        return _this;
    }
    Goal.prototype.update = function () { };
    Goal.prototype.draw = function () {
        context.fillStyle = "green";
        context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
    };
    return Goal;
}(CollidableObject));
var Ball = /** @class */ (function (_super) {
    __extends(Ball, _super);
    function Ball() {
        var _this = _super.call(this, [window.innerWidth / 2, window.innerHeight / 2], [0, 0]) || this;
        _this.radius = 10;
        _this.pickedUp = false;
        _this.team = -1;
        _this.drag = 0.985;
        _this.immunityTimer = 0;
        _this.throwImmunity = 10;
        return _this;
    }
    Ball.prototype.reset = function () {
        this.Position = [window.innerWidth / 2, window.innerHeight / 2];
        this.Velocity = [0, 0];
    };
    Ball.prototype.update = function () {
        // If picked up, we don't want to run any logic besides updating position
        if (this.pickedUp) {
            for (var _i = 0, Players_2 = Players; _i < Players_2.length; _i++) {
                var player = Players_2[_i];
                if (player.hasBall) {
                    this.Position[0] = player.Characters[player.selectedCharacter].Position[0] + player.Characters[player.selectedCharacter].width / 2;
                    this.Position[1] = player.Characters[player.selectedCharacter].Position[1] - 30;
                }
            }
            return;
        }
        // Clip small velocities
        if (Math.sqrt(Math.pow(this.Velocity[0], 2) + Math.pow(this.Velocity[1], 2)) < 5) {
            this.Velocity[0] = 0;
            this.Velocity[1] = 0;
        }
        // Apply drag (this system is mediocre and needs to be plotted on a curve in the future)5
        this.Velocity[0] *= this.drag;
        this.Velocity[1] *= this.drag;
        // Move ball
        this.move();
        // Check for goal
        for (var _a = 0, Goals_1 = Goals; _a < Goals_1.length; _a++) {
            var goal = Goals_1[_a];
            if (this.checkCollision(goal))
                game.goalScored(goal.team);
        }
        if (this.immunityTimer > 0) {
            this.immunityTimer--;
            return;
        }
        // Check for collisions with players
        for (var _b = 0, Players_3 = Players; _b < Players_3.length; _b++) {
            var player = Players_3[_b];
            for (var _c = 0, _d = player.Characters; _c < _d.length; _c++) { // Iterate through all characters
                var character = _d[_c];
                if (this.checkCollision(character)) {
                    character.pickupBall();
                }
            }
        }
    };
    Ball.prototype.move = function () {
        if (Math.abs(this.Velocity[0]) > 0)
            this.moveX();
        if (Math.abs(this.Velocity[1]) > 0)
            this.moveY();
    };
    // I should turn these two into one function at some point
    Ball.prototype.moveX = function () {
        this.Position[0] += this.Velocity[0];
        for (var _i = 0, Objects_1 = Objects; _i < Objects_1.length; _i++) {
            var object = Objects_1[_i];
            if (this.checkCollision(object)) {
                this.Position[0] -= this.Velocity[0];
                this.Position[0] -= (this.Velocity[0] > 0 ? object.Position[0] - (this.Position[0] + this.radius) : (object.Position[0] + object.width) - (this.Position[0] - this.radius));
                this.Velocity[0] *= -1;
                return;
            }
        }
    };
    Ball.prototype.moveY = function () {
        this.Position[1] += this.Velocity[1];
        for (var _i = 0, Objects_2 = Objects; _i < Objects_2.length; _i++) {
            var object = Objects_2[_i];
            if (this.checkCollision(object)) {
                this.Position[1] -= this.Velocity[1];
                this.Position[1] -= (this.Velocity[1] > 0 ? object.Position[1] - (this.Position[1] + this.radius) : (object.Position[1] + object.height) - (this.Position[1] - this.radius));
                this.Velocity[1] *= -1;
                return;
            }
        }
    };
    Ball.prototype.checkCollision = function (object) {
        if (this.Position[0] + this.radius > object.Position[0] && this.Position[0] - this.radius < object.Position[0] + object.width && this.Position[1] + this.radius > object.Position[1] && this.Position[1] - this.radius < object.Position[1] + object.height)
            return true;
        var distanceTL = Math.sqrt(Math.pow(object.Position[0] - (this.Position[0]), 2) + Math.pow(object.Position[1] - (this.Position[1]), 2));
        var distanceTR = Math.sqrt(Math.pow(object.Position[0] + object.width - (this.Position[0]), 2) + Math.pow(object.Position[1] - (this.Position[1]), 2));
        var distanceBL = Math.sqrt(Math.pow(object.Position[0] - (this.Position[0]), 2) + Math.pow(object.Position[1] + object.height - (this.Position[1]), 2));
        var distanceBR = Math.sqrt(Math.pow(object.Position[0] + object.width - (this.Position[0]), 2) + Math.pow(object.Position[1] + object.height - (this.Position[1]), 2));
        if (distanceTL < this.radius || distanceTR < this.radius || distanceBL < this.radius || distanceBR < this.radius)
            return true;
        return false;
    };
    Ball.prototype.draw = function () {
        context.fillStyle = "black";
        context.beginPath();
        context.arc(this.Position[0], this.Position[1], this.radius, 0, 2 * Math.PI);
        context.fill();
    };
    return Ball;
}(GameObject));
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(Position, Velocity, team) {
        var _this = _super.call(this, Position, Velocity) || this;
        _this.team = team;
        return _this;
    }
    return Bullet;
}(GameObject));
var ShotgunBullet = /** @class */ (function (_super) {
    __extends(ShotgunBullet, _super);
    function ShotgunBullet(Position, Velocity, team, maxDistance) {
        var _this = _super.call(this, Position, Velocity, team) || this;
        _this.radius = 3;
        _this.maxDistance = maxDistance;
        return _this;
    }
    ShotgunBullet.prototype.update = function () {
        var vmag = Math.sqrt(Math.pow(this.Velocity[0], 2) + Math.pow(this.Velocity[1], 2));
        if (vmag < this.maxDistance) {
            this.Position[0] += this.Velocity[0];
            this.Position[1] += this.Velocity[1];
            this.maxDistance -= vmag;
        }
        else {
            var scalar = this.maxDistance / vmag;
            this.Position[0] += this.Velocity[0] * scalar;
            this.Position[1] += this.Velocity[1] * scalar;
            this.maxDistance = 0;
        }
        for (var _i = 0, Objects_3 = Objects; _i < Objects_3.length; _i++) {
            var object = Objects_3[_i];
            if (this.checkCollision(object)) {
                this.maxDistance = 0;
                return;
            }
        }
        for (var _a = 0, _b = Players[(this.team + 1) % 2].Characters; _a < _b.length; _a++) {
            var character = _b[_a];
            if (character.respawnTimer == 0 && this.checkCollision(character)) {
                character.die();
                this.maxDistance = 0;
                return;
            }
        }
    };
    ShotgunBullet.prototype.draw = function () {
        context.fillStyle = "red";
        context.beginPath();
        context.arc(this.Position[0], this.Position[1], 5, 0, 2 * Math.PI);
        context.fill();
    };
    ShotgunBullet.prototype.checkCollision = function (object) {
        return (this.Position[0] + this.radius > object.Position[0] && this.Position[0] - this.radius < object.Position[0] + object.width && this.Position[1] + this.radius > object.Position[1] && this.Position[1] - this.radius < object.Position[1] + object.height);
    };
    return ShotgunBullet;
}(Bullet));
var Bomb = /** @class */ (function (_super) {
    __extends(Bomb, _super);
    function Bomb(Position, team, radius) {
        var _this = _super.call(this, Position, [0, 0], team) || this;
        _this.timer = 2000 * (frameRate / 1000);
        _this.radius = radius;
        return _this;
    }
    Bomb.prototype.update = function () {
        this.timer -= 1;
        if (this.timer == 0)
            this.explode();
    };
    Bomb.prototype.explode = function () {
        for (var _i = 0, _a = Players[(this.team + 1) % 2].Characters; _i < _a.length; _i++) {
            var character = _a[_i];
            if (this.checkDistance(character)) {
                character.die();
            }
        }
    };
    Bomb.prototype.draw = function () {
        context.fillStyle = "black";
        context.beginPath();
        context.arc(this.Position[0], this.Position[1], 10, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = attackPreviewStyle;
        context.beginPath();
        context.arc(this.Position[0], this.Position[1], this.radius, 0, 2 * Math.PI);
        context.fill();
    };
    Bomb.prototype.checkDistance = function (character) {
        if (this.Position[0] + this.radius > character.Position[0] && this.Position[0] - this.radius < character.Position[0] + character.width && this.Position[1] + this.radius > character.Position[1] && this.Position[1] - this.radius < character.Position[1] + character.height)
            return true;
        var distanceTL = Math.sqrt(Math.pow(character.Position[0] - (this.Position[0]), 2) + Math.pow(character.Position[1] - (this.Position[1]), 2));
        var distanceTR = Math.sqrt(Math.pow(character.Position[0] + character.width - (this.Position[0]), 2) + Math.pow(character.Position[1] - (this.Position[1]), 2));
        var distanceBL = Math.sqrt(Math.pow(character.Position[0] - (this.Position[0]), 2) + Math.pow(character.Position[1] + character.height - (this.Position[1]), 2));
        var distanceBR = Math.sqrt(Math.pow(character.Position[0] + character.width - (this.Position[0]), 2) + Math.pow(character.Position[1] + character.height - (this.Position[1]), 2));
        if (distanceTL < this.radius || distanceTR < this.radius || distanceBL < this.radius || distanceBR < this.radius)
            return true;
        return false;
    };
    return Bomb;
}(Bullet));
var Arrow = /** @class */ (function (_super) {
    __extends(Arrow, _super);
    function Arrow(Position, Velocity, team, maxDistance) {
        var _this = _super.call(this, Position, Velocity, team) || this;
        _this.radius = 5;
        _this.maxDistance = maxDistance;
        return _this;
    }
    Arrow.prototype.update = function () {
        var vmag = Math.sqrt(Math.pow(this.Velocity[0], 2) + Math.pow(this.Velocity[1], 2));
        if (vmag < this.maxDistance) {
            this.Position[0] += this.Velocity[0];
            this.Position[1] += this.Velocity[1];
            this.maxDistance -= vmag;
        }
        else {
            var scalar = this.maxDistance / vmag;
            this.Position[0] += this.Velocity[0] * scalar;
            this.Position[1] += this.Velocity[1] * scalar;
            this.maxDistance = 0;
        }
        for (var _i = 0, Objects_4 = Objects; _i < Objects_4.length; _i++) {
            var object = Objects_4[_i];
            if (this.checkCollision(object)) {
                this.maxDistance = 0;
                return;
            }
        }
        for (var _a = 0, _b = Players[(this.team + 1) % 2].Characters; _a < _b.length; _a++) {
            var character = _b[_a];
            if (character.respawnTimer == 0 && this.checkCollision(character)) {
                character.die();
                this.maxDistance = 0;
                return;
            }
        }
    };
    Arrow.prototype.draw = function () {
        context.fillStyle = "black";
        context.beginPath();
        context.arc(this.Position[0], this.Position[1], 5, 0, 2 * Math.PI);
        context.fill();
    };
    Arrow.prototype.checkCollision = function (object) {
        return (this.Position[0] + this.radius > object.Position[0] && this.Position[0] - this.radius < object.Position[0] + object.width && this.Position[1] + this.radius > object.Position[1] && this.Position[1] - this.radius < object.Position[1] + object.height);
    };
    return Arrow;
}(Bullet));
var Character = /** @class */ (function (_super) {
    __extends(Character, _super);
    function Character(speedScalar, cooldown, team) {
        var _this = _super.call(this, [-100, -100], [0, 0]) || this;
        _this.cooldownTimer = 0;
        // Size variables
        _this.width = 32;
        _this.height = 52;
        // Respawn variables
        _this.respawnTime = 3000 * (frameRate / 1000);
        _this.respawnTimer = 0;
        // Animation variables
        _this.direction = "DOWN";
        _this.frame = 0;
        _this.delay = 0;
        _this.spritePadding = { width: (64 - _this.width) / 2, height: (64 - _this.height) }; // This is used because the sprites are 64x64, but some of that is empty space used for larger animations and I don't want that. The width is what is cut off of both sides, the height is what is cut off of the top.
        // Ball variables
        _this.ballThrowSpeed = 11;
        _this.speedScalar = speedScalar;
        _this.team = team;
        _this.cooldown = Math.floor(cooldown * frameRate / 1000); // Converts from milliseconds to frames
        return _this;
    }
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
        for (var _i = 0, Objects_5 = Objects; _i < Objects_5.length; _i++) {
            var object = Objects_5[_i];
            if (this.checkCollision(object)) {
                this.Position[0] -= this.Velocity[0];
                this.Position[0] -= (this.Velocity[0] > 0 ? object.Position[0] - (this.Position[0] + this.width) : (object.Position[0] + object.width) - this.Position[0]);
                return;
            }
        }
    };
    Character.prototype.moveY = function () {
        this.Position[1] += this.Velocity[1];
        for (var _i = 0, Objects_6 = Objects; _i < Objects_6.length; _i++) {
            var object = Objects_6[_i];
            if (this.checkCollision(object)) {
                this.Position[1] -= this.Velocity[1];
                this.Position[1] -= (this.Velocity[1] > 0 ? object.Position[1] - (this.Position[1] + this.height) : (object.Position[1] + object.height) - this.Position[1]);
                return;
            }
        }
    };
    Character.prototype.pickupBall = function () {
        ball.pickedUp = true;
        ball.team = this.team;
        Players[this.team].hasBall = true;
    };
    Character.prototype.dropBall = function () {
        ball.pickedUp = false;
        Players[this.team].hasBall = false;
        ball.team = -1;
    };
    Character.prototype.throwBall = function () {
        this.cooldownTimer = this.cooldown;
        ball.pickedUp = false;
        Players[this.team].hasBall = false;
        ball.Position = [this.Position[0] + this.width / 2, this.Position[1] + this.height / 2];
        var theta = Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]);
        ball.Velocity = [this.ballThrowSpeed * Math.cos(theta), this.ballThrowSpeed * Math.sin(theta)];
        ball.immunityTimer = ball.throwImmunity;
    };
    Character.prototype.drawThrowPreview = function () {
        context.lineWidth = 10;
        context.strokeStyle = attackPreviewStyle;
        context.beginPath();
        context.moveTo(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2);
        context.lineTo(this.Position[0] + this.width / 2 + 400 * Math.cos(Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0])), this.Position[1] + this.height / 2 + 400 * Math.sin(Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0])));
        context.stroke();
    };
    Character.prototype.die = function () {
        this.Position = [-100, -100];
        this.respawnTimer = this.respawnTime;
        if (Players[this.team].hasBall && Players[this.team].Characters[Players[this.team].selectedCharacter] == this)
            this.dropBall();
    };
    Character.prototype.respawn = function () {
        this.respawnTimer = 0;
        for (var j = 0; j < Players[this.team].Characters.length; j++) {
            if (Players[this.team].Characters[j] == this) {
                this.Position = [100 + (-200 * this.team) - (this.width * this.team) + (window.innerWidth * this.team), window.innerHeight / 2 - this.height / 2 + 3 * (j - 1) * this.height];
                return;
            }
        }
    };
    Character.prototype.tryRespawn = function () {
        if (this.respawnTimer > 1) {
            this.respawnTimer--;
            return false;
        }
        if (this.respawnTimer == 1)
            this.respawn();
        return true;
    };
    Character.prototype.drawCharacter = function (character) {
        // Key:
        // Spellcast -- 0
        // Thrust -- 4
        // Walk -- 8
        // Slash -- 12
        // Shoot -- 16
        //
        // Direction:
        // Up -- +0
        // Left -- +1
        // Down -- +2
        // Right -- +3
        var directionShift = 0;
        switch (this.direction) {
            case "UP":
                directionShift = 0;
                break;
            case "LEFT":
                directionShift = 1;
                break;
            case "DOWN":
                directionShift = 2;
                break;
            case "RIGHT":
                directionShift = 3;
                break;
        }
        if (Math.sqrt(Math.pow(this.Velocity[0], 2) + Math.pow(this.Velocity[1], 2)) > 0.1) { // If the character is moving
            // Update frame
            this.delay = (this.delay + 1) % 4;
            if (this.delay == 0)
                this.frame++;
            this.frame %= 8;
            // Draw
            context.drawImage(Images[character], (this.width + this.spritePadding.width * 2) * this.frame, (8 + directionShift) * (this.height + this.spritePadding.height), this.width + this.spritePadding.width * 2, this.height + this.spritePadding.height, this.Position[0] - this.spritePadding.width, this.Position[1] - this.spritePadding.height, this.width + this.spritePadding.width * 2, this.height + this.spritePadding.height);
            return;
        }
        // Character is not moving
        this.frame = 0;
        context.drawImage(Images[character], (this.width + this.spritePadding.width * 2) * this.frame, (8 + directionShift) * (this.height + this.spritePadding.height), this.width + this.spritePadding.width * 2, this.height + this.spritePadding.height, this.Position[0] - this.spritePadding.width, this.Position[1] - this.spritePadding.height, this.width + this.spritePadding.width * 2, this.height + this.spritePadding.height);
    };
    return Character;
}(GameObject));
var Shelly = /** @class */ (function (_super) {
    __extends(Shelly, _super);
    function Shelly(team) {
        var _this = _super.call(this, 4, 1000, team) || this;
        _this.Bullets = [];
        _this.bulletCount = 10;
        _this.maxTime = 1000; // Time until full distance/min spread shot in milliseconds
        _this.bulletInfo = {
            minDistance: 300,
            maxDistance: 700,
            distance: 10,
            bulletTravelTime: _this.maxTime * (frameRate / 1000),
            maxSpread: Math.PI / 2,
            spreadDivisor: 8,
            spread: 0
        };
        return _this;
    }
    Shelly.prototype.draw = function () {
        for (var _i = 0, _a = this.Bullets; _i < _a.length; _i++) {
            var bullet = _a[_i];
            bullet.draw();
        }
        if (this.respawnTimer > 1) {
            return;
        }
        // Draws the hitbox
        // context.fillStyle = this.team == 0 ? "blue" : "red";
        // context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
        // context.fillStyle = "purple";
        // context.fillRect(this.Position[0] + 2, this.Position[1] + 2, this.width - 4, this.height - 4);
        // Draws the character
        this.drawCharacter("Shelly");
    };
    Shelly.prototype.update = function () {
        for (var _i = 0, _a = this.Bullets; _i < _a.length; _i++) {
            var bullet = _a[_i];
            bullet.update();
            if (bullet.maxDistance <= 0)
                this.Bullets.splice(this.Bullets.indexOf(bullet), 1);
        }
        if (!this.tryRespawn())
            return;
        if (this.cooldownTimer > 0)
            this.cooldownTimer--;
        if (Players[this.team].attackHoldTime < (this.maxTime * (frameRate / 1000))) {
            this.bulletInfo.spread = this.bulletInfo.maxSpread / (1 + ((this.bulletInfo.spreadDivisor - 1) * Players[this.team].attackHoldTime / (this.maxTime * (frameRate / 1000))));
            this.bulletInfo.distance = this.bulletInfo.minDistance + ((this.bulletInfo.maxDistance - this.bulletInfo.minDistance) * Players[this.team].attackHoldTime / (this.maxTime * (frameRate / 1000)));
        }
        else {
            this.bulletInfo.spread = this.bulletInfo.maxSpread / this.bulletInfo.spreadDivisor;
            this.bulletInfo.distance = this.bulletInfo.maxDistance;
        }
    };
    Shelly.prototype.attack = function () {
        this.cooldownTimer = this.cooldown;
        var theta = Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]);
        for (var i = 0; i < this.bulletCount; i++) {
            var newTheta = theta + (Math.random() - 0.5) * this.bulletInfo.spread;
            var bullet = new ShotgunBullet([this.Position[0] + this.width / 2, this.Position[1] + this.height / 2], [this.bulletInfo.distance * Math.cos(newTheta) / this.bulletInfo.bulletTravelTime, this.bulletInfo.distance * Math.sin(newTheta) / this.bulletInfo.bulletTravelTime], this.team, this.bulletInfo.distance);
            this.Bullets.push(bullet);
        }
    };
    Shelly.prototype.drawAttackPreview = function () {
        context.fillStyle = attackPreviewStyle;
        context.beginPath();
        context.moveTo(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2);
        context.lineTo(this.Position[0] + this.width / 2 + this.bulletInfo.distance * Math.cos(Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]) - (this.bulletInfo.spread)), this.Position[1] + this.height / 2 + this.bulletInfo.distance * Math.sin(Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]) - (this.bulletInfo.spread)));
        context.arc(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2, this.bulletInfo.distance, Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]) - (this.bulletInfo.spread), Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]) + (this.bulletInfo.spread));
        context.lineTo(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2);
        context.fill();
    };
    return Shelly;
}(Character));
var Mike = /** @class */ (function (_super) {
    __extends(Mike, _super);
    function Mike(team) {
        return _super.call(this, 6, 1000, team) || this;
    }
    Mike.prototype.draw = function () {
        if (this.respawnTimer > 1) {
            return;
        }
        // Draws the hitbox
        // context.fillStyle = this.team == 0 ? "blue" : "red";
        // context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
        // context.fillStyle = "yellow";
        // context.fillRect(this.Position[0] + 2, this.Position[1] + 2, this.width - 4, this.height - 4);
        // Draws the character
        this.drawCharacter("Mike");
    };
    Mike.prototype.update = function () {
        if (!this.tryRespawn())
            return;
        if (this.cooldownTimer > 0)
            this.cooldownTimer--;
    };
    ;
    Mike.prototype.attack = function () { };
    ;
    Mike.prototype.drawAttackPreview = function () { };
    return Mike;
}(Character));
var Bill = /** @class */ (function (_super) {
    __extends(Bill, _super);
    function Bill(team) {
        var _this = _super.call(this, 8, 1000, team) || this;
        _this.Bombs = [];
        _this.attackRadius = 100;
        return _this;
    }
    Bill.prototype.draw = function () {
        for (var _i = 0, _a = this.Bombs; _i < _a.length; _i++) {
            var bomb = _a[_i];
            bomb.draw();
        }
        if (this.respawnTimer > 1) {
            return;
        }
        // Draws the hitbox
        // context.fillStyle = this.team == 0 ? "blue" : "red";
        // context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
        // context.fillStyle = "green";
        // context.fillRect(this.Position[0] + 2, this.Position[1] + 2, this.width - 4, this.height - 4);
        // Draws the character
        this.drawCharacter("Bill");
    };
    Bill.prototype.update = function () {
        for (var _i = 0, _a = this.Bombs; _i < _a.length; _i++) {
            var bomb = _a[_i];
            bomb.update();
            if (bomb.timer == 0)
                this.Bombs.splice(this.Bombs.indexOf(bomb), 1);
        }
        if (!this.tryRespawn())
            return;
        if (this.cooldownTimer > 0)
            this.cooldownTimer--;
    };
    Bill.prototype.attack = function () {
        this.cooldownTimer = this.cooldown;
        this.Bombs.push(new Bomb([this.Position[0] + this.width / 2, this.Position[1] + this.height / 2], this.team, this.attackRadius));
    };
    Bill.prototype.drawAttackPreview = function () {
        context.fillStyle = attackPreviewStyle;
        context.beginPath();
        context.arc(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2, this.attackRadius, 0, 2 * Math.PI);
        context.fill();
    };
    return Bill;
}(Character));
var Esteban = /** @class */ (function (_super) {
    __extends(Esteban, _super);
    function Esteban(team) {
        var _this = _super.call(this, 4, 1000, team) || this;
        _this.Arrows = [];
        _this.maxTime = 1200; // Time until full distance/min spread shot in milliseconds
        _this.arrowInfo = {
            distance: 2000,
            travelTime: _this.maxTime * (frameRate / 1000),
        };
        return _this;
    }
    Esteban.prototype.draw = function () {
        for (var _i = 0, _a = this.Arrows; _i < _a.length; _i++) {
            var arrow = _a[_i];
            arrow.draw();
        }
        if (this.respawnTimer > 1) {
            return;
        }
        // Draws the hitbox
        // context.fillStyle = this.team == 0 ? "blue" : "red";
        // context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
        // context.fillStyle = "pink";
        // context.fillRect(this.Position[0] + 2, this.Position[1] + 2, this.width - 4, this.height - 4);
        // Draws the character
        this.drawCharacter("Esteban");
    };
    Esteban.prototype.update = function () {
        for (var _i = 0, _a = this.Arrows; _i < _a.length; _i++) {
            var arrow = _a[_i];
            arrow.update();
            if (arrow.maxDistance <= 0)
                this.Arrows.splice(this.Arrows.indexOf(arrow), 1);
        }
        if (!this.tryRespawn())
            return;
        if (this.cooldownTimer > 0)
            this.cooldownTimer--;
    };
    Esteban.prototype.attack = function () {
        this.cooldownTimer = this.cooldown;
        var theta = Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]);
        var arrow = new Arrow([this.Position[0] + this.width / 2, this.Position[1] + this.height / 2], [this.arrowInfo.distance * Math.cos(theta) / this.arrowInfo.travelTime, this.arrowInfo.distance * Math.sin(theta) / this.arrowInfo.travelTime], this.team, this.arrowInfo.distance);
        this.Arrows.push(arrow);
    };
    Esteban.prototype.drawAttackPreview = function () {
        context.lineWidth = 3;
        context.strokeStyle = attackPreviewStyle;
        context.beginPath();
        context.moveTo(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2);
        context.lineTo(this.Position[0] + this.width / 2 + this.arrowInfo.distance * Math.cos(Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0])), this.Position[1] + this.height / 2 + this.arrowInfo.distance * Math.sin(Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0])));
        context.stroke();
    };
    return Esteban;
}(Character));
// Initiate canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;
// Initiate game (stores game related variables)
var game = new Game();
// Define global variables
var frameRate = 60;
var state = "playing";
var attackPreviewStyle = "rgba(0, 0, 0, 0.1)";
// Define global arrays
var Gamepads = [];
var Players = [new Player(0), new Player(1)];
var Goals = [new Goal([30, window.innerHeight / 2 - 50], 30, 100, 1), new Goal([window.innerWidth - 60, window.innerHeight / 2 - 50], 30, 100, 0)];
var Objects = [new Box([window.innerWidth / 2 - 250, window.innerHeight / 2 - 50], 100, 100), new Box([window.innerWidth / 2 + 150, window.innerHeight / 2 - 50], 100, 100)];
// Ball
var ball = new Ball();
// Add walls
Objects.push(new Box([0, -5], window.innerWidth, 10));
Objects.push(new Box([-5, 0], 10, window.innerHeight));
Objects.push(new Box([0, window.innerHeight - 5], window.innerWidth, 10));
Objects.push(new Box([window.innerWidth - 5, 0], 10, window.innerHeight));
// Initiate game (resets field, sets characters by grabbing them from local storage, etc)
game.init();
// Handle controllers (this isn't actually used since the controllers are queried every frame, but it might be helpful later) Note: it was not helpful later
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
        return; // This is a guard clause. When this runs, it ends the function by returning nothing and the rest of the function isn't executed. This is useful here since we only want the logic to run if there are exactly 2 controllers connected. 
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
    if (game.paused)
        return; // If the game is paused, don't update anything
    ball.update();
    for (var _i = 0, Players_4 = Players; _i < Players_4.length; _i++) {
        var player = Players_4[_i];
        player.update();
    }
    for (var _a = 0, Objects_7 = Objects; _a < Objects_7.length; _a++) {
        var object = Objects_7[_a];
        object.update();
    }
    for (var _b = 0, Goals_2 = Goals; _b < Goals_2.length; _b++) {
        var goal = Goals_2[_b];
        goal.update();
    }
}
function draw() {
    clearCanvas();
    game.display();
    ball.draw();
    for (var _i = 0, Players_5 = Players; _i < Players_5.length; _i++) {
        var player = Players_5[_i];
        player.draw();
    }
    for (var _a = 0, Objects_8 = Objects; _a < Objects_8.length; _a++) {
        var object = Objects_8[_a];
        object.draw();
    }
    for (var _b = 0, Goals_3 = Goals; _b < Goals_3.length; _b++) {
        var goal = Goals_3[_b];
        goal.draw();
    }
}
function clearCanvas() {
    context.fillStyle = 'rgba(255, 255, 255)';
    context.fillRect(0, 0, canvas.width, canvas.height);
}
var Images = {
    "Esteban": new Image(),
    "Shelly": new Image(),
    "Bill": new Image(),
    "Mike": new Image(),
};
Images["Esteban"].src = "../../../assets/textures/characters/Esteban.png";
Images["Shelly"].src = "../../../assets/textures/characters/Shelly.png";
Images["Bill"].src = "../../../assets/textures/characters/Bill.png";
Images["Mike"].src = "../../../assets/textures/characters/Mike.png";
