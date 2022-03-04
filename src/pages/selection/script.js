const Images = {
  "Esteban0": new Image(),
  "Shelly0": new Image(),
  "Bill0": new Image(),
  "Mike0": new Image()
}

Images["Esteban0"].src = "../../../assets/textures/characters/Esteban0.png";
Images["Shelly0"].src = "../../../assets/textures/characters/Shelly0.png";
Images["Bill0"].src = "../../../assets/textures/characters/Bill0.png";
Images["Mike0"].src = "../../../assets/textures/characters/Mike0.png";

var canvas = document.getElementById("drawingArea");
var ctx = canvas.getContext("2d");

characterOne = 1; //these are all the available characters to choose from
characterTwo = 2; //must define each of them, maybe assign them names
characterThree = 3;
characterFour = 4;
characterFive = 5;
characterSix = 6;
playerOneChosen = false;
playerTwoChosen = false;
characterSelectFinished = false; //indicates whether the selection process is done

function drawBox1() { //top right
  ctx.fillStyle = 'cornsilk';
  ctx.fillRect(840, 250, 200, 200);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(840, 250, 200, 200);
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText("1", 840 + 100, 270 + 100);
}

function drawBox2() { //top left
  ctx.fillStyle = 'cornsilk';
  ctx.fillRect(640, 250, 200, 200)
  ctx.strokeStyle = 'black';
  ctx.strokeRect(640, 250, 200, 200);
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText("2", 640 + 100, 270 + 100);

}

function drawBox3() { //middle right
  ctx.fillStyle = 'cornsilk';
  ctx.fillRect(840, 450, 200, 200)
  ctx.strokeStyle = 'black';
  ctx.strokeRect(840, 450, 200, 200);
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText("3", 840 + 100, 470 + 100);

}

function drawBox4() { //middle left
  ctx.fillStyle = 'cornsilk';
  ctx.fillRect(640, 450, 200, 200)
  ctx.strokeStyle = 'black';
  ctx.strokeRect(640, 450, 200, 200);
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText("4", 640 + 100, 470 + 100);

}

function drawBox5() { //bottom right
  ctx.fillStyle = 'cornsilk';
  ctx.fillRect(840, 650, 200, 200)
  ctx.strokeStyle = 'black';
  ctx.strokeRect(840, 650, 200, 200);
}

function drawBox6() { //bottom left
  ctx.fillStyle = 'cornsilk';
  ctx.fillRect(640, 650, 200, 200)
  ctx.strokeStyle = 'black';
  ctx.strokeRect(640, 650, 200, 200);
}

function drawBoxCharacter1() { //top left
  ctx.fillStyle = 'azure';
  ctx.fillRect(150, 50, 250, 250)
  ctx.strokeStyle = 'black';
  ctx.strokeRect(150, 50, 250, 250);
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  if(Selection.length>=1)  ctx.fillText(Selection[0], 150 + 125, 50 + 125);
}

function drawBoxCharacter2() { //middle left
  ctx.fillStyle = 'azure';
  ctx.fillRect(150, 325, 250, 250)
  ctx.strokeStyle = 'black';
  ctx.strokeRect(150, 325, 250, 250);
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  if(Selection.length>=2)  ctx.fillText(Selection[1], 150 + 125, 325 + 125);

}

function drawBoxCharacter3() { //bottom left
  ctx.fillStyle = 'azure';
  ctx.fillRect(150, 600, 250, 250)
  ctx.strokeStyle = 'black';
  ctx.strokeRect(150, 600, 250, 250);
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  if(Selection.length>=3)  ctx.fillText(Selection[2], 150 + 125, 600 + 125);

}

function drawBoxCharacter4() { //top right
  ctx.fillStyle = 'mistyrose';
  ctx.fillRect(1280, 50, 250, 250)
  ctx.strokeStyle = 'black';
  ctx.strokeRect(1280, 50, 250, 250);
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  if(Selection.length>=4)  ctx.fillText(Selection[3], 1280 + 125, 50 + 125);

}

function drawBoxCharacter5() { //middle right
  ctx.fillStyle = 'mistyrose';
  ctx.fillRect(1280, 325, 250, 250)
  ctx.strokeStyle = 'black';
  ctx.strokeRect(1280, 325, 250, 250);
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  if(Selection.length>=5)  ctx.fillText(Selection[4], 1280 + 125, 325 + 125);

}

function drawBoxCharacter6() { //bottom right
  ctx.fillStyle = 'mistyrose';
  ctx.fillRect(1280, 600, 250, 250)
  ctx.strokeStyle = 'black';
  ctx.strokeRect(1280, 600, 250, 250);
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  if(Selection.length>=6)  ctx.fillText(Selection[5], 1280 + 125, 600 + 125);

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

document.addEventListener('mousemove', (event) => {
  // console.log(`Mouse X: ${event.clientX}, Mouse Y: ${event.clientY}`);
  mouseX = event.clientX;
  mouseY = event.clientY;
}); //detects mouse positioning and shows it in console

//must store the mouse positioning values to variables
var mouseX = 0;
var mouseY = 0;

var firstSelection = false;
var secondSelection = false;
var thirdSelection = false;
var fourthSelection = false; //second players first pick
var fifthSelection = false; //second players second pick
var sixthSelection = false; //secondn players third pick

var Selection = [];

function onClick() {
  drawBoxes();
  // if (!playerOneChosen) { //if player one hasn't already selected their characters
  //   firstPlayersSelect(); //MUST FIND WAY TO SELECT CHARACTERS SPECIFICALLY FOR P1
  // }
  // else if (!playerTwoChosen) {
  //   secondPlayersSelect(); //MUST FIND WAY TO SELECT CHARACTERS SPECIFICALLY FOR P2
  //   characterSelectFinished = true;
  // }
  checkClick();
  console.log(Selection)
  if (Selection.length == 6) start();
  drawBoxes();

}

drawBoxes(); //draws all boxes

document.addEventListener("click", onClick);


function checkClick() {
  
  if (mouseX > 840 && mouseX < 1040) { //selects character 1
    if (mouseY > 250 && mouseY < 450) { //top right
      Selection.push(1);
    }
  }

  if (mouseX > 640 && mouseX < 840) { //selects character 2
    if (mouseY > 250 && mouseY < 450) { //top left
      Selection.push(2);
    }
  }

  if (mouseX > 840 && mouseX < 1040) { //selects character 3
    if (mouseY > 450 && mouseY < 650) { //middle right
      Selection.push(3)
    }
  }

  if (mouseX > 640 && mouseX < 840) { //selects character 4
    if (mouseY > 450 && mouseY < 650) { //middle left
      Selection.push(4)
    }
  }

  if (mouseX > 840 && mouseX < 1040) { //selects character 5
    if (mouseY > 650 && mouseY < 850) { //bottom right
      Selection.push(5)
    }
  }

  if (mouseX > 640 && mouseX < 840) { //selects character 6
    if (mouseY > 650 && mouseY < 850) { //bottom left
      Selection.push(6)
    }
  }
}


function start() {
  localStorage.setItem("Selection", JSON.stringify(Selection));

  window.location.href = "../game/index.html";
}



function drawCharacter(number, Position, Size) {
  let character = "";
  switch (number) {
    case 1:
      character = "Shelly";
      break;
    case 2:
      character = "Esteban";
      break;
    case 3:
      character = "Bill";
      break;
    case 4:
      character = "Mike";
      break;
  }


  let directionShift = 2;
  // switch (this.direction) {
  //   case "UP":
  //     directionShift = 0;
  //     break;
  //   case "LEFT":
  //     directionShift = 1;
  //     break;
  //   case "DOWN":
  //     directionShift = 2;
  //     break;
  //   case "RIGHT":
  //     directionShift = 3;
  //     break;
  // }

  // if (Math.sqrt(Math.pow(this.Velocity[0], 2) + Math.pow(this.Velocity[1], 2)) > 0.1) { // If the character is moving
  //   // Update frame
  //   this.delay = (this.delay + 1) % 4;
  //   if (this.delay == 0) this.frame++;
  //   this.frame %= 8;

  //   // Draw
  //   context.drawImage(Images[`${character}${this.team}`], (this.width + this.spritePadding.width * 2) * this.frame, (8 + directionShift) * (this.height + this.spritePadding.height), this.width + this.spritePadding.width * 2, this.height + this.spritePadding.height, this.Position[0] - this.spritePadding.width, this.Position[1] - this.spritePadding.height, this.width + this.spritePadding.width * 2, this.height + this.spritePadding.height);
  //   return;
  // }

  // Character is not moving
  let frame = 0;
  let width = 32;
  width = Size[0]
  let height = 52
  height = Size[1]
  let spritePadding = { width: (64 - width) / 2, height: (64 - height) }; // This is used because the sprites are 64x64, but some of that is empty space used for larger animations and I don't want that. The width is what is cut off of both sides, the height is what is cut off of the top.

  ctx.drawImage(Images[`${character}0`], (width + spritePadding.width * 2) * frame, (8 + directionShift) * (height + spritePadding.height), width + spritePadding.width * 2, height + spritePadding.height, Position[0] - spritePadding.width, Position[1] - spritePadding.height, width + spritePadding.width * 2, height + spritePadding.height);
}


