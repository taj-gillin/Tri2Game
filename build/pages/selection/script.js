var canvas = document.getElementById("drawingArea");
var ctx = canvas.getContext("2d");
characterOne; //these are all the available characters to choose from
characterTwo; //must define each of them, maybe assign them names
characterThree;
characterFour;
characterFive;
characterSix;
playerOneChosen = false;
playerTwoChosen = false;
characterSelectFinished = false; //indicates whether the selection process is done
function drawBox1() {
    ctx.fillStyle = 'cornsilk';
    ctx.fillRect(840, 250, 200, 200);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(840, 250, 200, 200);
}
function drawBox2() {
    ctx.fillStyle = 'cornsilk';
    ctx.fillRect(640, 250, 200, 200);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(640, 250, 200, 200);
}
function drawBox3() {
    ctx.fillStyle = 'cornsilk';
    ctx.fillRect(840, 450, 200, 200);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(840, 450, 200, 200);
}
function drawBox4() {
    ctx.fillStyle = 'cornsilk';
    ctx.fillRect(640, 450, 200, 200);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(640, 450, 200, 200);
}
function drawBox5() {
    ctx.fillStyle = 'cornsilk';
    ctx.fillRect(840, 650, 200, 200);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(840, 650, 200, 200);
}
function drawBox6() {
    ctx.fillStyle = 'cornsilk';
    ctx.fillRect(640, 650, 200, 200);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(640, 650, 200, 200);
}
function drawBoxCharacter1() {
    ctx.fillStyle = 'azure';
    ctx.fillRect(150, 50, 250, 250);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(150, 50, 250, 250);
}
function drawBoxCharacter2() {
    ctx.fillStyle = 'azure';
    ctx.fillRect(150, 325, 250, 250);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(150, 325, 250, 250);
}
function drawBoxCharacter3() {
    ctx.fillStyle = 'azure';
    ctx.fillRect(150, 600, 250, 250);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(150, 600, 250, 250);
}
function drawBoxCharacter4() {
    ctx.fillStyle = 'mistyrose';
    ctx.fillRect(1280, 50, 250, 250);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(1280, 50, 250, 250);
}
function drawBoxCharacter5() {
    ctx.fillStyle = 'mistyrose';
    ctx.fillRect(1280, 325, 250, 250);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(1280, 325, 250, 250);
}
function drawBoxCharacter6() {
    ctx.fillStyle = 'mistyrose';
    ctx.fillRect(1280, 600, 250, 250);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(1280, 600, 250, 250);
}
function drawBoxes() {
    drawBox1();
    drawBox2();
    drawBox3();
    drawBox4();
    drawBox5();
    drawBox6();
    drawBoxCharacter1();
    drawBoxCharacter2();
    drawBoxCharacter3();
    drawBoxCharacter4();
    drawBoxCharacter5();
    drawBoxCharacter6();
}
document.addEventListener('mousemove', function (event) {
    console.log("Mouse X: " + event.clientX + ", Mouse Y: " + event.clientY);
    mouseX = event.clientX;
    mouseY = event.clientY;
}); //detects mouse positioning and shows it in console
//must store the mouse positioning values to variables
mouseX;
mouseY;
function firstPlayersSelect() {
    var firstSelection = false;
    var secondSelection = false;
    var thirdSelection = false;
    if (mouseX > 840 && mouseX < 1040) { //selects character 1
        if (mouseY > 250 && mouseY < 450) { //top right
            if (!firstSelection) {
                firstSelection = true;
                firstSelection.pick = "characterOne"; //string to hold which character
            }
            else {
                if (!secondSelection) {
                    secondSelection = true;
                    secondSelection.pick = "characterOne";
                }
                else
                    (!thirdSelection);
                {
                    thirdSelection = true;
                    thirdSelection.pick = "characterOne";
                }
            }
        }
    }
    if (mouseX > 640 && mouseX < 840) { //selects character 2
        if (mouseY > 250 && mouseY < 450) { //top left
            if (!firstSelection) {
                firstSelection = true;
                firstSelection.pick = "characterTwo"; //string to hold which character
            }
            else {
                if (!secondSelection) {
                    secondSelection = true;
                    secondSelection.pick = "characterTwo";
                }
                else
                    (!thirdSelection);
                {
                    thirdSelection = true;
                    thirdSelection.pick = "characterTwo";
                }
            }
        }
    }
    if (mouseX > 840 && mouseX < 1040) { //selects character 3
        if (mouseY > 450 && mouseY < 650) { //middle right
            if (!firstSelection) {
                firstSelection = true;
                firstSelection.pick = "characterThree"; //string to hold which character
            }
            else {
                if (!secondSelection) {
                    secondSelection = true;
                    secondSelection.pick = "characterThree";
                }
                else
                    (!thirdSelection);
                {
                    thirdSelection = true;
                    thirdSelection.pick = "characterThree";
                }
            }
        }
    }
    if (mouseX > 640 && mouseX < 840) { //selects character 4
        if (mouseY > 450 && mouseY < 650) { //middle left
            if (!firstSelection) {
                firstSelection = true;
                firstSelection.pick = "characterFour"; //string to hold which character
            }
            else {
                if (!secondSelection) {
                    secondSelection = true;
                    secondSelection.pick = "characterFour";
                }
                else
                    (!thirdSelection);
                {
                    thirdSelection = true;
                    thirdSelection.pick = "characterFour";
                }
            }
        }
    }
    if (mouseX > 840 && mouseX < 1040) { //selects character 5
        if (mouseY > 650 && mouseY < 850) { //bottom right
            if (!firstSelection) {
                firstSelection = true;
                firstSelection.pick = "characterFive"; //string to hold which character
            }
            else {
                if (!secondSelection) {
                    secondSelection = true;
                    secondSelection.pick = "characterFive";
                }
                else
                    (!thirdSelection);
                {
                    thirdSelection = true;
                    thirdSelection.pick = "characterFive";
                }
            }
        }
    }
    if (mouseX > 640 && mouseX < 840) { //selects character 6
        if (mouseY > 650 && mouseY < 850) { //bottom left
            if (!firstSelection) {
                firstSelection = true;
                firstSelection.pick = "characterSix"; //string to hold which character
            }
            else {
                if (!secondSelection) {
                    secondSelection = true;
                    secondSelection.pick = "characterSix";
                }
                else
                    (!thirdSelection);
                {
                    thirdSelection = true;
                    thirdSelection.pick = "characterSix";
                }
            }
        }
    }
}
function secondPlayersSelect() {
    var fourthSelection = false; //second players first pick
    var fifthSelection = false; //second players second pick
    var sixthSelection = false; //secondn players third pick
    if (mouseX > 840 && mouseX < 1040) { //selects character 1
        if (mouseY > 250 && mouseY < 450) { //top right
            if (!fourthSelection) {
                fourthSelection = true;
                fourthSelection.pick = "characterOne"; //string to hold which character
            }
            else {
                if (!fifthSelection) {
                    fifthSelection = true;
                    fifthSelection.pick = "characterOne";
                }
                else
                    (!sixthSelection);
                {
                    sixthSelection = true;
                    sixthSelection.pick = "characterOne";
                }
            }
        }
    }
    if (mouseX > 640 && mouseX < 840) { //selects character 2
        if (mouseY > 250 && mouseY < 450) { //top left
            if (!fourthSelection) {
                fourthSelection = true;
                fourthSelection.pick = "characterTwo"; //string to hold which character
            }
            else {
                if (!fifthSelection) {
                    fifthSelection = true;
                    fifthSelection.pick = "characterTwo";
                }
                else
                    (!sixthSelection);
                {
                    sixthSelection = true;
                    sixthSelection.pick = "characterTwo";
                }
            }
        }
    }
    if (mouseX > 840 && mouseX < 1040) { //selects character 3
        if (mouseY > 450 && mouseY < 650) { //middle right
            if (!fourthSelection) {
                fourthSelection = true;
                fourthSelection.pick = "characterThree"; //string to hold which character
            }
            else {
                if (!fifthSelection) {
                    fifthSelection = true;
                    fifthSelection.pick = "characterThree";
                }
                else
                    (!sixthSelection);
                {
                    sixthSelection = true;
                    sixthSelection.pick = "characterThree";
                }
            }
        }
    }
    if (mouseX > 640 && mouseX < 840) { //selects character 4
        if (mouseY > 450 && mouseY < 650) { //middle left
            if (!fourthSelection) {
                fourthSelection = true;
                fourthSelection.pick = "characterFour"; //string to hold which character
            }
            else {
                if (!fifthSelection) {
                    fifthSelection = true;
                    fifthSelection.pick = "characterFour";
                }
                else
                    (!sixthSelection);
                {
                    sixthSelection = true;
                    sixthSelection.pick = "characterFour";
                }
            }
        }
    }
    if (mouseX > 840 && mouseX < 1040) { //selects character 5
        if (mouseY > 650 && mouseY < 850) { //bottom right
            if (!fourthSelection) {
                fourthSelection = true;
                fourthSelection.pick = "characterFive"; //string to hold which character
            }
            else {
                if (!fifthSelection) {
                    fifthSelection = true;
                    fifthSelection.pick = "characterFive";
                }
                else
                    (!sixthSelection);
                {
                    sixthSelection = true;
                    sixthSelection.pick = "characterFive";
                }
            }
        }
    }
    if (mouseX > 640 && mouseX < 840) { //selects character 6
        if (mouseY > 650 && mouseY < 850) { //bottom left
            if (!fourthSelection) {
                fourthSelection = true;
                fourthSelection.pick = "characterSix"; //string to hold which character
            }
            else {
                if (!fifthSelection) {
                    fifthSelection = true;
                    fifthSelection.pick = "characterSix";
                }
                else
                    (!sixthSelection);
                {
                    sixthSelection = true;
                    sixthSelection.pick = "characterSix";
                }
            }
        }
    }
}
function onClick() {
    if (!playerOneChosen) { //if player one hasn't already selected their characters
        firstPlayersSelect(); //MUST FIND WAY TO SELECT CHARACTERS SPECIFICALLY FOR P1
    }
    else if (!playerTwoChosen) {
        secondPlayersSelect(); //MUST FIND WAY TO SELECT CHARACTERS SPECIFICALLY FOR P2
        characterSelectFinished = true;
    }
}
drawBoxes(); //draws all boxes
document.addEventListener("click", onClick());
