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
            this.selectedCharacter = (this.selectedCharacter + 5) % 3; // Adding 5 does the same thing as subtracting 1 conceptually, but subtracting 1 would actually cause the number to be negative
        if (this.Buttons.rightShoulder && !this.prevButtons.rightShoulder)
            this.selectedCharacter = (this.selectedCharacter + 1) % 3;
        // Do any other character updates
        for (var i = 0; i < this.Characters.length; i++) {
            this.Characters[i].update();
        }
        // Check if selected character is dead
        if (this.Characters[0].respawnTimer > 0 && this.Characters[1].respawnTimer > 0 && this.Characters[2].respawnTimer > 0)
            return;
        while (this.Characters[this.selectedCharacter].respawnTimer > 0)
            this.selectedCharacter = (this.selectedCharacter + 1) % 3;
        // Update holding time for attack button
        this.attackHoldTime = (this.Characters[this.selectedCharacter].cooldownTimer == 0 && Math.abs(Math.sqrt(Math.pow(this.Buttons.rightStick[0], 2) + Math.pow(this.Buttons.rightStick[1], 2))) > 0.3) ? this.attackHoldTime + 1 : 0;
        // If attack button is pressed, attack
        if (this.Buttons.rightTrigger && this.attackHoldTime > 0 && this.Characters[this.selectedCharacter].cooldownTimer == 0) {
            this.Characters[this.selectedCharacter].attack();
            this.attackHoldTime = 0;
        }
        // Update character velocity
        this.Characters[this.selectedCharacter].move(this.Buttons.leftStick); // If character is selected, set its velocity based on left stick. 
    };
    Player.prototype.draw = function () {
        if (this.attackHoldTime > 0 && this.Characters[this.selectedCharacter].cooldownTimer == 0 && this.Characters[this.selectedCharacter].respawnTimer == 0) {
            this.Characters[this.selectedCharacter].drawAttackPreview();
        }
        for (var _i = 0, _a = this.Characters; _i < _a.length; _i++) {
            var character = _a[_i];
            character.draw();
        }
    };
    Player.prototype.resetCharacters = function () {
        for (var _i = 0, _a = this.Characters; _i < _a.length; _i++) {
            var character = _a[_i];
            character.respawn();
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
        for (var _i = 0, Objects_1 = Objects; _i < Objects_1.length; _i++) {
            var object = Objects_1[_i];
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
        for (var _i = 0, Objects_2 = Objects; _i < Objects_2.length; _i++) {
            var object = Objects_2[_i];
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
    function Character(speedScalar, cooldown, width, height, team) {
        var _this = _super.call(this, [-100, -100], [0, 0]) || this;
        _this.cooldownTimer = 0;
        _this.respawnTime = 3000 * (frameRate / 1000);
        _this.respawnTimer = 0;
        _this.hasBall = false;
        _this.speedScalar = speedScalar;
        _this.width = width;
        _this.height = height;
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
        for (var _i = 0, Objects_3 = Objects; _i < Objects_3.length; _i++) {
            var object = Objects_3[_i];
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
        for (var _i = 0, Objects_4 = Objects; _i < Objects_4.length; _i++) {
            var object = Objects_4[_i];
            if (this.checkCollision(object)) {
                this.Position[1] -= this.Velocity[1];
                this.Velocity[1] = (this.Velocity[1] > 0 ? object.Position[1] - (this.Position[1] + this.height) : (object.Position[1] + object.height) - this.Position[1]);
                this.Position[1] += this.Velocity[1];
                return;
            }
        }
    };
    Character.prototype.die = function () {
        this.respawnTimer = this.respawnTime;
    };
    Character.prototype.respawn = function () {
        this.respawnTimer = 0;
        for (var j = 0; j < Players[this.team].Characters.length; j++) {
            if (Players[this.team].Characters[j] == this) {
                this.Position = [50 + (-100 * this.team) - (this.width * this.team) + (window.innerWidth * this.team), window.innerHeight / 2 - this.height / 2 + 3 * (j - 1) * this.height];
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
        // First, find right image
        // If this isn't the selected character, draw the idle image
        if (Players[this.team].Characters[Players[this.team].selectedCharacter] != this) {
            // context.drawImage(, this.Position[0], this.Position[1], this.width, this.height);
            return;
        }
    };
    return Character;
}(GameObject));
var Shelly = /** @class */ (function (_super) {
    __extends(Shelly, _super);
    function Shelly(team) {
        var _this = _super.call(this, 4, 1000, 20, 40, team) || this;
        _this.Bullets = [];
        _this.bulletCount = 10;
        _this.maxTime = 1000; // Time until full distance/min spread shot in milliseconds
        _this.bulletInfo = {
            minDistance: 100,
            maxDistance: 500,
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
        // Draws the character
        context.fillStyle = this.team == 0 ? "blue" : "red";
        context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
        context.fillStyle = "purple";
        context.fillRect(this.Position[0] + 2, this.Position[1] + 2, this.width - 4, this.height - 4);
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
        return _super.call(this, 6, 1000, 20, 40, team) || this;
    }
    Mike.prototype.draw = function () {
        if (this.respawnTimer > 1) {
            return;
        }
        // Draws the character
        context.fillStyle = this.team == 0 ? "blue" : "red";
        context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
        context.fillStyle = "yellow";
        context.fillRect(this.Position[0] + 2, this.Position[1] + 2, this.width - 4, this.height - 4);
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
        var _this = _super.call(this, 8, 1000, 20, 40, team) || this;
        _this.attackRadius = 100;
        return _this;
    }
    Bill.prototype.draw = function () {
        if (this.respawnTimer > 1) {
            return;
        }
        // Draws the character
        context.fillStyle = this.team == 0 ? "blue" : "red";
        context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
        context.fillStyle = "green";
        context.fillRect(this.Position[0] + 2, this.Position[1] + 2, this.width - 4, this.height - 4);
    };
    Bill.prototype.update = function () {
        if (!this.tryRespawn())
            return;
        if (this.cooldownTimer > 0)
            this.cooldownTimer--;
    };
    Bill.prototype.attack = function () {
        this.cooldownTimer = this.cooldown;
        context.fillStyle = "red";
        context.beginPath();
        context.arc(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2, this.attackRadius, 0, 2 * Math.PI);
        context.fill();
        for (var _i = 0, _a = Players[(this.team + 1) % 2].Characters; _i < _a.length; _i++) {
            var character = _a[_i];
            if (character.respawnTimer == 0 && this.checkDistance(character)) {
                character.die();
            }
        }
    };
    Bill.prototype.drawAttackPreview = function () {
        context.fillStyle = attackPreviewStyle;
        context.beginPath();
        context.arc(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2, this.attackRadius, 0, 2 * Math.PI);
        context.fill();
    };
    Bill.prototype.checkDistance = function (character) {
        var distanceTL = Math.sqrt(Math.pow(character.Position[0] - (this.Position[0] + this.width / 2), 2) + Math.pow(character.Position[1] - (this.Position[1] + this.height / 2), 2));
        var distanceTR = Math.sqrt(Math.pow(character.Position[0] + character.width - (this.Position[0] + this.width / 2), 2) + Math.pow(character.Position[1] - (this.Position[1] + this.height / 2), 2));
        var distanceBL = Math.sqrt(Math.pow(character.Position[0] - (this.Position[0] + this.width / 2), 2) + Math.pow(character.Position[1] + character.height - (this.Position[1] + this.height / 2), 2));
        var distanceBR = Math.sqrt(Math.pow(character.Position[0] + character.width - (this.Position[0] + this.width / 2), 2) + Math.pow(character.Position[1] + character.height - (this.Position[1] + this.height / 2), 2));
        if (distanceTL < this.attackRadius || distanceTR < this.attackRadius || distanceBL < this.attackRadius || distanceBR < this.attackRadius)
            return true;
        return false;
    };
    return Bill;
}(Character));
var Esteban = /** @class */ (function (_super) {
    __extends(Esteban, _super);
    function Esteban(team) {
        var _this = _super.call(this, 4, 1000, 20, 40, team) || this;
        _this.Arrows = [];
        _this.maxTime = 1000; // Time until full distance/min spread shot in milliseconds
        _this.arrowInfo = {
            distance: 1000,
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
        // Draws the character
        context.fillStyle = this.team == 0 ? "blue" : "red";
        context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
        context.fillStyle = "pink";
        context.fillRect(this.Position[0] + 2, this.Position[1] + 2, this.width - 4, this.height - 4);
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
        context.fillStyle = attackPreviewStyle;
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
//HTML Elements
var debugOutput1 = document.getElementById("debug1");
var debugOutput2 = document.getElementById("debug2");
// Define global variables
var frameRate = 60;
var state = "playing";
var attackPreviewStyle = "rgba(0, 0, 0, 0.1)";
// Define global arrays
var Gamepads = [];
var Players = [new Player(0), new Player(1)];
var Objects = [new Box([window.innerWidth / 2 - 250, window.innerHeight / 2 - 50], 100, 100), new Box([window.innerWidth / 2 + 150, window.innerHeight / 2 - 50], 100, 100)];
// Add walls
Objects.push(new Box([0, -5], window.innerWidth, 10));
Objects.push(new Box([-5, 0], 10, window.innerHeight));
Objects.push(new Box([0, window.innerHeight - 5], window.innerWidth, 10));
Objects.push(new Box([window.innerWidth - 5, 0], 10, window.innerHeight));
reset();
// Handle controllers (this isn't actually used since the controllers are queried every frame, but it might be helpful later)
window.addEventListener("gamepadconnected", function (e) { gamepadHandler(e, true); }, false);
window.addEventListener("gamepaddisconnected", function (e) { gamepadHandler(e, false); }, false);
function gamepadHandler(event, connecting) {
    var gamepad = event.gamepad;
    // gamepad === navigator.getGamepads()[gamepad.index]
    console.log("Debug: Change with gamepad. Id: " + gamepad.id);
}
function reset() {
    for (var _i = 0, Players_1 = Players; _i < Players_1.length; _i++) {
        var player = Players_1[_i];
        player.resetCharacters();
    }
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
    for (var _i = 0, Players_2 = Players; _i < Players_2.length; _i++) {
        var player = Players_2[_i];
        player.update();
    }
    for (var _a = 0, Objects_5 = Objects; _a < Objects_5.length; _a++) {
        var object = Objects_5[_a];
        object.update();
    }
}
function draw() {
    clearCanvas();
    for (var _i = 0, Players_3 = Players; _i < Players_3.length; _i++) {
        var player = Players_3[_i];
        player.draw();
    }
    for (var _a = 0, Objects_6 = Objects; _a < Objects_6.length; _a++) {
        var object = Objects_6[_a];
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
    context.fillStyle = 'rgba(255, 255, 255)';
    context.fillRect(0, 0, canvas.width, canvas.height);
}
function loadImages() {
    var Esteban = new Image();
    Esteban.src = "../../../assets/textures/characters/Esteban.png";
}
