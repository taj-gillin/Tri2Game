console.log(window.innerHeight)
console.log(window.innerWidth)
// Define types
type Buttons = {
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

// Define classes
class Player {
    Buttons: Buttons;
    prevButtons: Buttons;
    attackHoldTime: number = 0;

    selectedCharacter: number;  // Tells us which character the player is currently controlling. Range: [0,2]
    controllerNumber: number; // Which controller is linked to this player. Range: [0,1]
    Characters: [Character, Character, Character];

    hasBall: boolean = false;

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

        // Try to avoid drift by cutting off small values
        if (Math.sqrt(Math.pow(this.Buttons.leftStick[0], 2) + Math.pow(this.Buttons.leftStick[1], 2)) < 0.2) {
            if (Math.abs(this.Buttons.leftStick[0]) < 0.2) this.Buttons.leftStick[0] = 0;
            if (Math.abs(this.Buttons.leftStick[1]) < 0.2) this.Buttons.leftStick[1] = 0;
        }
        if (Math.sqrt(Math.pow(this.Buttons.rightStick[0], 2) + Math.pow(this.Buttons.rightStick[1], 2)) < 0.2) {
            if (Math.abs(this.Buttons.rightStick[0]) < 0.2) this.Buttons.rightStick[0] = 0;
            if (Math.abs(this.Buttons.rightStick[1]) < 0.2) this.Buttons.rightStick[1] = 0;
        }
    }

    constructor(controllerNumber: number) {
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
        }
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
        }

        this.Characters = [new Shelly(this.controllerNumber), new Esteban(this.controllerNumber), new Bill(this.controllerNumber)];
    }

    update() {
        // First, store previous button states, then update current button states. I have to do this for in loop because copying reference types (like an object) just make both variables point to the same object and changing one will change both.
        for (let button in this.Buttons) this.prevButtons[button] = this.Buttons[button];

        if (state == "playing") this.checkButtons(Gamepads[this.controllerNumber]);


        // Update character
        if (this.Buttons.leftShoulder && !this.prevButtons.leftShoulder) this.changeCharacterLeft();
        if (this.Buttons.rightShoulder && !this.prevButtons.rightShoulder) this.changeCharacterRight();


        if (this.Characters[this.selectedCharacter].respawnTimer > 0) this.changeCharacterRight();

        // Do any other character updates
        for (let i = 0; i < this.Characters.length; i++) {
            this.Characters[i].update();
        }

        // Check if selected character is dead, don't run code after if they are
        if (this.Characters[0].respawnTimer > 0 && this.Characters[1].respawnTimer > 0 && this.Characters[2].respawnTimer > 0) return;



        // Update character velocity

        // First, set all to zero (used for animations) (but I forgot why)
        for (let character of this.Characters) character.Velocity = [0, 0];

        // Then, add in the movement from the left stick
        if (Math.abs(Math.sqrt(Math.pow(this.Buttons.leftStick[0], 2) + Math.pow(this.Buttons.leftStick[1], 2))) > 0.2) { // Check if the left stick is moved (minimum set to ignore controller drift)
            if (Math.abs(this.Buttons.leftStick[0]) > Math.abs(this.Buttons.leftStick[1])) { // Check if the left stick is moved horizontally more than vertically
                if (this.Buttons.leftStick[0] > 0) { // If so, check if the left stick is moved right
                    this.Characters[this.selectedCharacter].move([1, 0]);
                    this.Characters[this.selectedCharacter].direction = "RIGHT";
                } else { // This means the left stick is moved left
                    this.Characters[this.selectedCharacter].move([-1, 0]);
                    this.Characters[this.selectedCharacter].direction = "LEFT";
                }
            } else { // This means the left stick is moved vertically
                if (this.Buttons.leftStick[1] > 0) { // Check if the left stick is moved down
                    this.Characters[this.selectedCharacter].move([0, 1]);
                    this.Characters[this.selectedCharacter].direction = "DOWN";
                } else { // This means the left stick is moved up
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
        if (this.hasBall) return;

        // If attack button is pressed, attack
        if (this.Buttons.rightTrigger && this.attackHoldTime > 0 && this.Characters[this.selectedCharacter].cooldownTimer == 0) {
            this.Characters[this.selectedCharacter].attack();
            this.attackHoldTime = 0;
        }
    }

    draw() {
        if (this.attackHoldTime > 0 && this.Characters[this.selectedCharacter].cooldownTimer == 0 && this.Characters[this.selectedCharacter].respawnTimer == 0) {
            if (this.hasBall) {
                this.Characters[this.selectedCharacter].drawThrowPreview();
            } else {
                this.Characters[this.selectedCharacter].drawAttackPreview();
            }
        }

        for (let character of this.Characters) {
            character.draw();
        }

        // Draw character selection
        if (this.Characters[this.selectedCharacter].respawnTimer == 0) {
            let selected = this.Characters[this.selectedCharacter];

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
    }

    resetCharacters() {
        for (let character of this.Characters) {
            character.respawn();
        }
    }

    changeCharacterRight() {
        for (let i = 0; i < this.Characters.length; i++) {
            this.selectedCharacter = (this.selectedCharacter + 1) % 3;
            if (this.Characters[this.selectedCharacter].respawnTimer == 0) break;
        }
    }

    changeCharacterLeft() {
        for (let i = 0; i < this.Characters.length; i++) {
            this.selectedCharacter = (this.selectedCharacter + 5) % 3; // Adding 5 does the same thing as subtracting 1 conceptually, but subtracting 1 would actually cause the number to be negative
            if (this.Characters[this.selectedCharacter].respawnTimer == 0) break;
        }
    }


}

// 
abstract class GameObject {
    Position: [number, number];
    Velocity: [number, number];

    constructor(Position: [number, number], Velocity: [number, number]) {
        this.Position = Position;
        this.Velocity = Velocity;
    }
    abstract update(): void;
    abstract draw(): void;
}

abstract class CollidableObject extends GameObject {
    width: number;
    height: number;

    constructor(Position: [number, number], width, height) {
        super(Position, [0, 0]);
        this.width = width;
        this.height = height;
    }
}

class Box extends CollidableObject {
    constructor(Position: [number, number], width, height) {
        super(Position, width, height);
    }

    update(): void { }

    draw(): void {
        context.fillStyle = "black";
        context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
    }

}

class Ball extends GameObject {
    radius: number = 10;
    pickedUp: boolean = false;
    team: number = -1;
    drag: number = 0.985;
    immunityTimer: number = 0;
    throwImmunity: number = 10;

    constructor(Position: [number, number], Velocity: [number, number]) {
        super(Position, Velocity);
    }

    update(): void {

        // If picked up, we don't want to run any logic besides updating position
        if (this.pickedUp) {
            for (let player of Players) if (player.hasBall) {
                this.Position[0] = player.Characters[player.selectedCharacter].Position[0];
                this.Position[1] = player.Characters[player.selectedCharacter].Position[1];
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

        if (this.immunityTimer > 0) {
            this.immunityTimer--;
            return;
        }

        // Check for collisions with players
        for (let player of Players) for (let character of player.Characters) { // Iterate through all characters
            if (this.checkCollision(character)) {
                character.pickupBall();
            }
        }
    }
    move() {

        if (Math.abs(this.Velocity[0]) > 0) this.moveX();
        if (Math.abs(this.Velocity[1]) > 0) this.moveY();
    }


    // I should turn these two into one function at some point
    moveX() {
        this.Position[0] += this.Velocity[0];

        for (let object of Objects) {
            if (this.checkCollision(object)) {
                this.Position[0] -= this.Velocity[0];
                this.Position[0] -= (this.Velocity[0] > 0 ? object.Position[0] - (this.Position[0] + this.radius) : (object.Position[0] + object.width) - (this.Position[0] - this.radius));
                this.Velocity[0] *= -1;
                return;
            }
        }


    }

    moveY() {
        this.Position[1] += this.Velocity[1];

        for (let object of Objects) {
            if (this.checkCollision(object)) {
                this.Position[1] -= this.Velocity[1];
                this.Position[1] -= (this.Velocity[1] > 0 ? object.Position[1] - (this.Position[1] + this.radius) : (object.Position[1] + object.height) - (this.Position[1] - this.radius));
                this.Velocity[1] *= -1;
                return;
            }
        }
    }

    checkCollision(object: CollidableObject | Character): boolean {
        if (this.Position[0] + this.radius > object.Position[0] && this.Position[0] - this.radius < object.Position[0] + object.width && this.Position[1] + this.radius > object.Position[1] && this.Position[1] - this.radius < object.Position[1] + object.height) return true;


        let distanceTL = Math.sqrt(Math.pow(object.Position[0] - (this.Position[0]), 2) + Math.pow(object.Position[1] - (this.Position[1]), 2));
        let distanceTR = Math.sqrt(Math.pow(object.Position[0] + object.width - (this.Position[0]), 2) + Math.pow(object.Position[1] - (this.Position[1]), 2));
        let distanceBL = Math.sqrt(Math.pow(object.Position[0] - (this.Position[0]), 2) + Math.pow(object.Position[1] + object.height - (this.Position[1]), 2));
        let distanceBR = Math.sqrt(Math.pow(object.Position[0] + object.width - (this.Position[0]), 2) + Math.pow(object.Position[1] + object.height - (this.Position[1]), 2));

        if (distanceTL < this.radius || distanceTR < this.radius || distanceBL < this.radius || distanceBR < this.radius) return true;

        return false;
    }


    draw(): void {
        context.fillStyle = "black";
        context.beginPath();
        context.arc(this.Position[0], this.Position[1], this.radius, 0, 2 * Math.PI);
        context.fill();
    }
}

abstract class Bullet extends GameObject {
    team: number;

    constructor(Position: [number, number], Velocity: [number, number], team: number) {
        super(Position, Velocity);
        this.team = team;
    }
}

class ShotgunBullet extends Bullet {
    maxDistance: number;
    radius: number = 3;

    constructor(Position: [number, number], Velocity: [number, number], team: number, maxDistance: number) {
        super(Position, Velocity, team);
        this.maxDistance = maxDistance;
    }

    update(): void {
        let vmag = Math.sqrt(Math.pow(this.Velocity[0], 2) + Math.pow(this.Velocity[1], 2));
        if (vmag < this.maxDistance) {
            this.Position[0] += this.Velocity[0];
            this.Position[1] += this.Velocity[1];
            this.maxDistance -= vmag;
        }
        else {
            let scalar = this.maxDistance / vmag;
            this.Position[0] += this.Velocity[0] * scalar;
            this.Position[1] += this.Velocity[1] * scalar;
            this.maxDistance = 0;
        }

        for (let object of Objects) {
            if (this.checkCollision(object)) {
                this.maxDistance = 0;
                return;
            }
        }

        for (let character of Players[(this.team + 1) % 2].Characters) {
            if (character.respawnTimer == 0 && this.checkCollision(character)) {
                character.die();
                this.maxDistance = 0;
                return;
            }
        }
    }

    draw(): void {
        context.fillStyle = "red";
        context.beginPath();
        context.arc(this.Position[0], this.Position[1], 5, 0, 2 * Math.PI);
        context.fill();
    }

    checkCollision(object: CollidableObject): boolean {
        return (this.Position[0] + this.radius > object.Position[0] && this.Position[0] - this.radius < object.Position[0] + object.width && this.Position[1] + this.radius > object.Position[1] && this.Position[1] - this.radius < object.Position[1] + object.height);
    }
}

class Bomb extends Bullet {
    timer: number = 2000 * (frameRate / 1000);
    radius: number;

    constructor(Position: [number, number], team: number, radius: number) {
        super(Position, [0, 0], team);
        this.radius = radius;
    }

    update(): void {
        this.timer -= 1;
        if (this.timer == 0) this.explode();
    }

    explode(): void {
        for (let character of Players[(this.team + 1) % 2].Characters) {
            if (this.checkDistance(character)) {
                character.die();
            }
        }
    }

    draw(): void {
        context.fillStyle = "black";
        context.beginPath();
        context.arc(this.Position[0], this.Position[1], 10, 0, 2 * Math.PI);
        context.fill();

        context.fillStyle = attackPreviewStyle;
        context.beginPath();
        context.arc(this.Position[0], this.Position[1], this.radius, 0, 2 * Math.PI);
        context.fill();
    }


    checkDistance(character: Character): boolean {
        if (this.Position[0] + this.radius > character.Position[0] && this.Position[0] - this.radius < character.Position[0] + character.width && this.Position[1] + this.radius > character.Position[1] && this.Position[1] - this.radius < character.Position[1] + character.height) return true;

        let distanceTL = Math.sqrt(Math.pow(character.Position[0] - (this.Position[0]), 2) + Math.pow(character.Position[1] - (this.Position[1]), 2));
        let distanceTR = Math.sqrt(Math.pow(character.Position[0] + character.width - (this.Position[0]), 2) + Math.pow(character.Position[1] - (this.Position[1]), 2));
        let distanceBL = Math.sqrt(Math.pow(character.Position[0] - (this.Position[0]), 2) + Math.pow(character.Position[1] + character.height - (this.Position[1]), 2));
        let distanceBR = Math.sqrt(Math.pow(character.Position[0] + character.width - (this.Position[0]), 2) + Math.pow(character.Position[1] + character.height - (this.Position[1]), 2));

        if (distanceTL < this.radius || distanceTR < this.radius || distanceBL < this.radius || distanceBR < this.radius) return true;

        return false;
    }

}

class Arrow extends Bullet {
    maxDistance: number;
    radius: number = 5;

    constructor(Position: [number, number], Velocity: [number, number], team: number, maxDistance: number) {
        super(Position, Velocity, team);
        this.maxDistance = maxDistance;
    }

    update(): void {
        let vmag = Math.sqrt(Math.pow(this.Velocity[0], 2) + Math.pow(this.Velocity[1], 2));
        if (vmag < this.maxDistance) {
            this.Position[0] += this.Velocity[0];
            this.Position[1] += this.Velocity[1];
            this.maxDistance -= vmag;
        }
        else {
            let scalar = this.maxDistance / vmag;
            this.Position[0] += this.Velocity[0] * scalar;
            this.Position[1] += this.Velocity[1] * scalar;
            this.maxDistance = 0;
        }

        for (let object of Objects) {
            if (this.checkCollision(object)) {
                this.maxDistance = 0;
                return;
            }
        }

        for (let character of Players[(this.team + 1) % 2].Characters) {
            if (character.respawnTimer == 0 && this.checkCollision(character)) {
                character.die();
                this.maxDistance = 0;
                return;
            }
        }
    }

    draw(): void {
        context.fillStyle = "black";
        context.beginPath();
        context.arc(this.Position[0], this.Position[1], 5, 0, 2 * Math.PI);
        context.fill();
    }

    checkCollision(object: CollidableObject): boolean {
        return (this.Position[0] + this.radius > object.Position[0] && this.Position[0] - this.radius < object.Position[0] + object.width && this.Position[1] + this.radius > object.Position[1] && this.Position[1] - this.radius < object.Position[1] + object.height);
    }
}

abstract class Character extends GameObject {
    // Attack cooldown variables
    cooldown: number; // Entered as milliseconds
    cooldownTimer: number = 0;

    // Speed variable
    speedScalar: number;

    // Size variables
    width: number = 32;
    height: number = 52

    // Team
    team: number;

    // Respawn variables
    respawnTime: number = 3000 * (frameRate / 1000);
    respawnTimer: number = 0;

    // Animation variables
    direction: "UP" | "DOWN" | "LEFT" | "RIGHT" = "DOWN";
    frame: number = 0;
    delay: number = 0;
    spritePadding: { width: number, height: number } = { width: (64 - this.width) / 2, height: (64 - this.height) }; // This is used because the sprites are 64x64, but some of that is empty space used for larger animations and I don't want that. The width is what is cut off of both sides, the height is what is cut off of the top.

    // Ball variables
    ballThrowSpeed: number = 11;



    constructor(speedScalar: number, cooldown: number, team: number) {
        super([-100, -100], [0, 0]);
        this.speedScalar = speedScalar;
        this.team = team;
        this.cooldown = Math.floor(cooldown * frameRate / 1000); // Converts from milliseconds to frames
    }

    checkCollision(object: CollidableObject): boolean {
        if (this.Position[0] < object.Position[0] + object.width && this.Position[0] + this.width > object.Position[0] && this.Position[1] < object.Position[1] + object.height && this.Position[1] + this.height > object.Position[1]) return true;
        return false;
    }

    move(Joystick: [number, number]) {
        this.Velocity = [Joystick[0] * this.speedScalar, Joystick[1] * this.speedScalar];

        if (Math.abs(this.Velocity[0]) > 0) this.moveX();
        if (Math.abs(this.Velocity[1]) > 0) this.moveY();
    }

    // I should turn these two into one function at some point
    moveX() {
        this.Position[0] += this.Velocity[0];

        for (let object of Objects) {
            if (this.checkCollision(object)) {
                this.Position[0] -= this.Velocity[0];
                this.Position[0] -= (this.Velocity[0] > 0 ? object.Position[0] - (this.Position[0] + this.width) : (object.Position[0] + object.width) - this.Position[0]);
                return;
            }
        }
    }

    moveY() {
        this.Position[1] += this.Velocity[1];

        for (let object of Objects) {
            if (this.checkCollision(object)) {
                this.Position[1] -= this.Velocity[1];
                this.Position[1] -= (this.Velocity[1] > 0 ? object.Position[1] - (this.Position[1] + this.height) : (object.Position[1] + object.height) - this.Position[1]);
                return;
            }
        }
    }

    pickupBall() {
        ball.pickedUp = true;
        ball.team = this.team;
        Players[this.team].hasBall = true;
        console.log("pickup")
    }

    dropBall() {
        ball.pickedUp = false;
        Players[this.team].hasBall = false;
        ball.team = -1;
    }

    throwBall() {
        this.cooldownTimer = this.cooldown;

        ball.pickedUp = false;
        Players[this.team].hasBall = false;

        let theta = Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]);
        ball.Velocity = [this.ballThrowSpeed * Math.cos(theta), this.ballThrowSpeed * Math.sin(theta)]
        ball.immunityTimer = ball.throwImmunity;
        console.log("throw")
    }

    abstract update(): void;

    abstract draw(): void;

    abstract attack(): void;

    abstract drawAttackPreview(): void;

    drawThrowPreview(): void {
        context.lineWidth = 10;
        context.strokeStyle = attackPreviewStyle;
        context.beginPath();
        context.moveTo(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2);
        context.lineTo(this.Position[0] + this.width / 2 + 400 * Math.cos(Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0])), this.Position[1] + this.height / 2 + 400 * Math.sin(Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0])));
        context.stroke();
    }

    die(): void {
        this.Position = [-100, -100]
        this.respawnTimer = this.respawnTime;
        if (Players[this.team].hasBall && Players[this.team].Characters[Players[this.team].selectedCharacter] == this) this.dropBall();
    }

    respawn(): void {
        this.respawnTimer = 0;

        for (let j = 0; j < Players[this.team].Characters.length; j++) {
            if (Players[this.team].Characters[j] == this) {
                this.Position = [50 + (-100 * this.team) - (this.width * this.team) + (window.innerWidth * this.team), window.innerHeight / 2 - this.height / 2 + 3 * (j - 1) * this.height];
                return;
            }
        }
    }

    tryRespawn(): boolean {
        if (this.respawnTimer > 1) {
            this.respawnTimer--;
            return false;
        }
        if (this.respawnTimer == 1) this.respawn();
        return true;
    }

    drawCharacter(character: string): void {
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
        let directionShift = 0;
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
            if (this.delay == 0) this.frame++;
            this.frame %= 8;

            // Draw
            context.drawImage(Images[character], (this.width + this.spritePadding.width * 2) * this.frame, (8 + directionShift) * (this.height + this.spritePadding.height), this.width + this.spritePadding.width * 2, this.height + this.spritePadding.height, this.Position[0] - this.spritePadding.width, this.Position[1] - this.spritePadding.height, this.width + this.spritePadding.width * 2, this.height + this.spritePadding.height);
            return;
        }

        // Character is not moving
        this.frame = 0;
        context.drawImage(Images[character], (this.width + this.spritePadding.width * 2) * this.frame, (8 + directionShift) * (this.height + this.spritePadding.height), this.width + this.spritePadding.width * 2, this.height + this.spritePadding.height, this.Position[0] - this.spritePadding.width, this.Position[1] - this.spritePadding.height, this.width + this.spritePadding.width * 2, this.height + this.spritePadding.height);
    }
}

class Shelly extends Character {

    Bullets: Array<ShotgunBullet> = []
    bulletInfo: {
        minDistance: number,
        maxDistance: number,
        distance: number,
        bulletTravelTime: number,
        maxSpread: number,
        spreadDivisor: number,
        spread: number
    }

    bulletCount: number = 10;
    maxTime: number = 1000; // Time until full distance/min spread shot in milliseconds

    constructor(team: number) {
        super(4, 1000, team);
        this.bulletInfo = {
            minDistance: 300,
            maxDistance: 700,
            distance: 10,
            bulletTravelTime: this.maxTime * (frameRate / 1000),
            maxSpread: Math.PI / 2,
            spreadDivisor: 8, // minSpread / maxSpread --> minSpread = maxSpread / spreadDivisor
            spread: 0
        }
    }

    draw(): void {
        for (var bullet of this.Bullets) {
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
        this.drawCharacter("Shelly")

    }

    update(): void {
        for (var bullet of this.Bullets) {
            bullet.update();
            if (bullet.maxDistance <= 0) this.Bullets.splice(this.Bullets.indexOf(bullet), 1);
        }

        if (!this.tryRespawn()) return;

        if (this.cooldownTimer > 0) this.cooldownTimer--;

        if (Players[this.team].attackHoldTime < (this.maxTime * (frameRate / 1000))) {
            this.bulletInfo.spread = this.bulletInfo.maxSpread / (1 + ((this.bulletInfo.spreadDivisor - 1) * Players[this.team].attackHoldTime / (this.maxTime * (frameRate / 1000))));
            this.bulletInfo.distance = this.bulletInfo.minDistance + ((this.bulletInfo.maxDistance - this.bulletInfo.minDistance) * Players[this.team].attackHoldTime / (this.maxTime * (frameRate / 1000)));
        } else {
            this.bulletInfo.spread = this.bulletInfo.maxSpread / this.bulletInfo.spreadDivisor;
            this.bulletInfo.distance = this.bulletInfo.maxDistance;
        }
    }

    attack(): void {
        this.cooldownTimer = this.cooldown;

        let theta = Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]);


        for (let i = 0; i < this.bulletCount; i++) {
            let newTheta = theta + (Math.random() - 0.5) * this.bulletInfo.spread;
            var bullet = new ShotgunBullet([this.Position[0] + this.width / 2, this.Position[1] + this.height / 2], [this.bulletInfo.distance * Math.cos(newTheta) / this.bulletInfo.bulletTravelTime, this.bulletInfo.distance * Math.sin(newTheta) / this.bulletInfo.bulletTravelTime], this.team, this.bulletInfo.distance);
            this.Bullets.push(bullet);
        }
    }

    drawAttackPreview(): void {
        context.fillStyle = attackPreviewStyle;
        context.beginPath();
        context.moveTo(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2);
        context.lineTo(this.Position[0] + this.width / 2 + this.bulletInfo.distance * Math.cos(Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]) - (this.bulletInfo.spread)), this.Position[1] + this.height / 2 + this.bulletInfo.distance * Math.sin(Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]) - (this.bulletInfo.spread)));
        context.arc(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2, this.bulletInfo.distance, Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]) - (this.bulletInfo.spread), Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]) + (this.bulletInfo.spread));
        context.lineTo(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2);
        context.fill();
    }
}

class Mike extends Character {

    constructor(team: number) {
        super(6, 1000, team);
    }

    draw(): void {
        if (this.respawnTimer > 1) {
            return;
        }

        // Draws the hitbox
        // context.fillStyle = this.team == 0 ? "blue" : "red";
        // context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
        // context.fillStyle = "yellow";
        // context.fillRect(this.Position[0] + 2, this.Position[1] + 2, this.width - 4, this.height - 4);

        // Draws the character
        this.drawCharacter("Mike")
    }

    update(): void {
        if (!this.tryRespawn()) return;

        if (this.cooldownTimer > 0) this.cooldownTimer--;

    };

    attack(): void { };

    drawAttackPreview(): void { }
}

class Bill extends Character {
    Bombs: Array<Bomb> = []
    attackRadius: number = 100;

    constructor(team: number) {
        super(8, 1000, team);
    }

    draw(): void {
        for (var bomb of this.Bombs) bomb.draw();

        if (this.respawnTimer > 1) {
            return;
        }

        // Draws the hitbox
        // context.fillStyle = this.team == 0 ? "blue" : "red";
        // context.fillRect(this.Position[0], this.Position[1], this.width, this.height);
        // context.fillStyle = "green";
        // context.fillRect(this.Position[0] + 2, this.Position[1] + 2, this.width - 4, this.height - 4);

        // Draws the character
        this.drawCharacter("Bill")
    }

    update(): void {
        for (var bomb of this.Bombs) {
            bomb.update();
            if (bomb.timer == 0) this.Bombs.splice(this.Bombs.indexOf(bomb), 1);
        }

        if (!this.tryRespawn()) return;

        if (this.cooldownTimer > 0) this.cooldownTimer--;
    }

    attack(): void {
        this.cooldownTimer = this.cooldown;

        this.Bombs.push(new Bomb([this.Position[0] + this.width / 2, this.Position[1] + this.height / 2], this.team, this.attackRadius));
    }


    drawAttackPreview(): void {
        context.fillStyle = attackPreviewStyle;
        context.beginPath();
        context.arc(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2, this.attackRadius, 0, 2 * Math.PI);
        context.fill();
    }

}

class Esteban extends Character {

    Arrows: Array<Arrow> = []
    arrowInfo: {
        distance: number,
        travelTime: number,
    }
    maxTime: number = 1200; // Time until full distance/min spread shot in milliseconds

    constructor(team: number) {
        super(4, 1000, team);
        this.arrowInfo = {
            distance: 2000,
            travelTime: this.maxTime * (frameRate / 1000),
        }
    }

    draw(): void {
        for (var arrow of this.Arrows) {
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
        this.drawCharacter("Esteban")

    }

    update(): void {
        for (var arrow of this.Arrows) {
            arrow.update();
            if (arrow.maxDistance <= 0) this.Arrows.splice(this.Arrows.indexOf(arrow), 1);
        }

        if (!this.tryRespawn()) return;

        if (this.cooldownTimer > 0) this.cooldownTimer--;
    }

    attack(): void {
        this.cooldownTimer = this.cooldown;

        let theta = Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0]);
        var arrow = new Arrow([this.Position[0] + this.width / 2, this.Position[1] + this.height / 2], [this.arrowInfo.distance * Math.cos(theta) / this.arrowInfo.travelTime, this.arrowInfo.distance * Math.sin(theta) / this.arrowInfo.travelTime], this.team, this.arrowInfo.distance);
        this.Arrows.push(arrow);
    }

    drawAttackPreview(): void {
        context.lineWidth = 3;
        context.strokeStyle = attackPreviewStyle;
        context.beginPath();
        context.moveTo(this.Position[0] + this.width / 2, this.Position[1] + this.height / 2);
        context.lineTo(this.Position[0] + this.width / 2 + this.arrowInfo.distance * Math.cos(Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0])), this.Position[1] + this.height / 2 + this.arrowInfo.distance * Math.sin(Math.atan2(Players[this.team].Buttons.rightStick[1], Players[this.team].Buttons.rightStick[0])));
        context.stroke();
    }
}

// Initiate canvas
var canvas = document.getElementById("canvas") as HTMLCanvasElement;
var context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;

//HTML Elements
var debugOutput1 = document.getElementById("debug1");
var debugOutput2 = document.getElementById("debug2");

// Define global variables
const frameRate = 60;
var state = "playing";
const attackPreviewStyle = "rgba(0, 0, 0, 0.1)";

// Define global arrays
var Gamepads: Array<Gamepad> = [];
var Players: Array<Player> = [new Player(0), new Player(1)];
var Objects: Array<CollidableObject> = [new Box([window.innerWidth / 2 - 250, window.innerHeight / 2 - 50], 100, 100), new Box([window.innerWidth / 2 + 150, window.innerHeight / 2 - 50], 100, 100)];

// Ball
var ball = new Ball([window.innerWidth / 2, window.innerHeight / 2], [0, 0]);

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
    console.log("Debug: Change with gamepad. Id: " + gamepad.id)
}

function reset() {
    for (let player of Players) {
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
    for (const gamepad of querryGamePads) {
        if (gamepad != null) Gamepads.push(gamepad);
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
    ball.update();

    for (const player of Players) {
        player.update();
    }

    for (const object of Objects) {
        object.update();
    }
}

function draw() {
    clearCanvas();

    ball.draw();

    for (const player of Players) {
        player.draw();
    }

    for (const object of Objects) {
        object.draw();
    }
}

function debug() {

    let buttonOutput = "";

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
    let leftMag = Math.sqrt(Math.pow(Players[0].Buttons.leftStick[0], 2) + Math.pow(Players[0].Buttons.leftStick[1], 2))
    buttonOutput = `Left Stick Magnitude: ${leftMag}\n`;
    buttonOutput += `Right Stick Magnitude: ${Math.sqrt(Math.pow(Players[0].Buttons.rightStick[0], 2) + Math.pow(Players[0].Buttons.rightStick[1], 2))}\n`;
    debugOutput1.innerText = buttonOutput;
}

function clearCanvas() {
    context.fillStyle = 'rgba(255, 255, 255)';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

const Images: { [key: string]: HTMLImageElement } = {
    "Esteban": new Image(),
    "Shelly": new Image(),
    "Bill": new Image(),
    "Mike": new Image(),
};

Images["Esteban"].src = "../../../assets/textures/characters/Esteban.png";
Images["Shelly"].src = "../../../assets/textures/characters/Shelly.png";
Images["Bill"].src = "../../../assets/textures/characters/Bill.png";
Images["Mike"].src = "../../../assets/textures/characters/Mike.png";
