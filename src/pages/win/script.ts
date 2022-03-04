var winner = parseInt(localStorage.getItem("winner")) == 0 ? "Blue" : "Red";
console.log(winner);

document.getElementById("text").innerHTML = `${winner} team wins!`;