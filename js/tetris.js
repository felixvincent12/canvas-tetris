/***********************************
Name: Desmond Wong Yeh Jong
Date: 21 March 2018
Description: This file is the code make the program run.
***********************************/

//variable
//var score = 0;

var bgMusic;
var clSoundEfct;
var getname = "Player 1";
var score = 0;
var COLS = 10, ROWS = 20;
var board = [];
var lose;
var interval;
var current; // current moving shape
var currentX, currentY; // position of current shape
var recordID; //variable to record shape
var next;
var countForLineTrap = 0;
var level = 1;
//create the shape such as square 
var shapes = [
    [1, 1, 1, 1],
    [1, 1, 1, 0, 1],
    [1, 1, 1, 0, 0, 0, 1 ],
    [1, 1, 0, 0, 1, 1 ],
    [1, 1, 0, 0, 0, 1, 1 ],
    [0, 1, 1, 0, 1, 1 ],
    [0, 1, 0, 0, 1, 1, 1 ]
];
var colors = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple', 'grey'
];

// creates a new 4x4 shape in global variable 'current'
// 4x4 so as to cover the size when the shape is rotated
function nextShape() {
    'use strict';
    var id = Math.floor(Math.random() * shapes.length), shape, y, x, i;
	//while the previous shape is same with new shape, keep random in the loop until its not same
	while (recordID === id) {
		id = Math.floor(Math.random() * shapes.length);
	}
	recordID = id; //to assign new shape id into recordID
    shape = shapes[id]; // maintain id for shape chosen

    next = [];
    for (y = 0; y < 4; y += 1) {
        next[y] = [];
        for (x = 0; x < 4; x += 1) {
            i = 4 * y + x;
            if (typeof shape[i] !== 'undefined' && shape[i]) {
                next[y][x] = id + 1;
            } else {
                next[y][x] = 0;
            }
        }
    }
    return recordID;
}
//function for line trap
function LineTrap(){
	var x, y;
	var randCol = Math.floor(Math.random() * (COLS-1));
	pushBlocksUp();
	for (y=0; y<COLS; y++){
			 x=ROWS - 1;
			 if(randCol != y){
				 board[x][y] = 8;
			 }
	}
	countForLineTrap = 0;
}
//push the tetrominoes up when the line trap is called
function pushBlocksUp(){
	var x,y;
	for(x=1; x<ROWS; x++){
		for(y=0; y<COLS; y++){
			if(x == (ROWS-1)){
				board[x][y] = 0;
			}else{
				board[x][y] = board[x+1][y];
			}
		}
	}
}

// clears the board
function init() {
    'use strict';
    var x, y;
    for (y = 0; y < ROWS; y += 1) {
        board[y] = [];
        for (x = 0; x < COLS; x += 1) {
            board[y][x] = 0;
        }
    }
}

// checks if the resulting position of current shape will be feasible
function valid(offsetX, offsetY, newCurrent) {
    'use strict';
    var x, y;
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;



    for (y = 0; y < 4; y += 1) {
        for (x = 0; x < 4; x += 1) {
            if (newCurrent[y][x]) {
                if (typeof board[y + offsetY] === 'undefined' || typeof board[y + offsetY][x + offsetX] === 'undefined' || board[y + offsetY][x + offsetX] || x + offsetX < 0 || y + offsetY >= ROWS || x + offsetX >= COLS) {
                    if (offsetY === 1) {lose = true; } // lose if the current shape at the top row when checked
                    return false;
                }
            }
        }
    }
    return true;
}

function newShape(initialID) {
    'use strict';
    var myNextID = initialID || $.cookie("cookieShape"), x, y, i, nextNextID = nextShape(), id = myNextID, shape = shapes[id]; // maintain id for color filling

    $.cookie("cookieShape", nextNextID);
    
    current = [];
    for (y = 0; y < 4; y += 1) {
        current[y] = [];
        for (x = 0; x < 4; x += 1) {
            i = 4 * y + x;
            if (typeof shape[i] !== 'undefined' && shape[i]) {
                current[y][x] = id + 1;
            } else {
                current[y][x] = 0;
            }
        }
    }
    //console.log(current);
    // position where the shape will evolve
    currentX = 5;
    currentY = 0;
}

//function to create button when it is clicked the game will start
function createHomeStartButton() {
	'use strict';
	// 1. Create the button
	var button = document.createElement("button"), samediv;
	button.innerHTML = "Start Game";

	// 2. Append somewhere
	samediv = document.getElementById("btnposition");
	samediv.appendChild(button);

	// 3. Add event handler
	button.addEventListener("click", function () {
	    getname = prompt("Please enter your name:", getname);
		document.getElementById("nameoutput").innerHTML = getname;
		document.getElementById("score").innerHTML = score;
		document.getElementById("levelnum").innerHTML = level;
	    newGame();
	    samediv.removeChild(button);
	});
}
function homeScreen() {
    'use strict';
	createHomeStartButton();
}

// stop shape at its position and fix it to board
function freeze() {
    'use strict';
    var x, y;
    for (y = 0; y < 4; y += 1) {
        for (x = 0; x < 4; x += 1) {
            if (current[y][x]) {
                board[y + currentY][x + currentX] = current[y][x];
            }
        }
    }
}

// check if any lines are filled and clear them
function clearLines() {
    'use strict';
    var x, y, rowFilled, yy;
    for (y = ROWS - 1; y >= 0; y -= 1) {
        rowFilled = true;
        for (x = 0; x < COLS; x += 1) {
            if (board[y][x] === 0) {
                rowFilled = false;
                break;
            }
        }
        if (rowFilled) {
            clSoundEfct.play();
            //document.getElementById( 'clearsound' ).play();
			score += 20;
			document.getElementById('score').innerHTML = score;
            for (yy = y; yy > 0; yy -= 1) {
                for (x = 0; x < COLS; x += 1) {
                    board[yy][x] = board[yy - 1][x];
                }
            }
            y += 1;
        }
    }
}

// keep the element moving down, creating new shapes and clearing lines
function tick() {
    'use strict';
    if (valid(0, 1)) {
        currentY += 1;
    } else if (currentY === -1) {
        //reach maximum height, end game
		if (window.confirm('Game Over!\nDo you want to play again?')) {
			var xHRObject = false;
			if (window.XMLHttpRequest)
			{
				xHRObject = new XMLHttpRequest();
			}
			else if (window.ActiveXObject)
			{
				xHRObject = new ActiveXObject("Microsoft.XMLHTTP");	
			}
			xHRObject.onreadystatechange = function(){
				if(xHRObject.readyState == 4 && xHRObject.status == 200){
					document.getElementById("score").innerHTML = 0;
				}
			}
			xHRObject.open('GET',"getGame.php?score=" + score + "&name=" + getname,true);
			xHRObject.send(null);	
			score = 0;
			document.getElementById('score').innerHTML = score;
            newGame();
        } else {
			var xHRObject = false;
			if (window.XMLHttpRequest)
			{
				xHRObject = new XMLHttpRequest();
			}
			else if (window.ActiveXObject)
			{
				xHRObject = new ActiveXObject("Microsoft.XMLHTTP");	
			}
			xHRObject.onreadystatechange = function(){
				if(xHRObject.readyState == 4 && xHRObject.status == 200){
					document.getElementById("score").innerHTML = "";
					document.getElementById("nameoutput").innerHTML = "";
				}
			}
			xHRObject.open('GET',"getGame.php?score=" + score + "&name=" + getname,true);
			xHRObject.send(null);
			score = 0;
			getname = "";
            clearInterval(interval);
            init();
            homeScreen();
        }
    } else {
        // if the element settled
        freeze();
        clearLines();
        if (lose) {
			if (window.confirm('Game Over!\nDo you want to play again?')) {
				var xHRObject = false;
				if (window.XMLHttpRequest)
				{
					xHRObject = new XMLHttpRequest();
				}
				else if (window.ActiveXObject)
				{
					xHRObject = new ActiveXObject("Microsoft.XMLHTTP");	
				}	
				xHRObject.onreadystatechange = function(){
					if(xHRObject.readyState == 4 && xHRObject.status == 200){
						document.getElementById("score").innerHTML = 0;
					}
				}
				xHRObject.open('GET',"getGame.php?score=" + score + "&name=" + getname,true);
				xHRObject.send(null);	
				score = 0;
				newGame();
			} else {
				var xHRObject = false;
				if (window.XMLHttpRequest)
				{
					xHRObject = new XMLHttpRequest();
				}
				else if (window.ActiveXObject)
				{
					xHRObject = new ActiveXObject("Microsoft.XMLHTTP");	
				}
				xHRObject.onreadystatechange = function(){
					if(xHRObject.readyState == 4 && xHRObject.status == 200){
						document.getElementById("score").innerHTML = "";
						document.getElementById("nameoutput").innerHTML = "";
					}
				}
				xHRObject.open('GET',"getGame.php?score=" + score + "&name=" + getname,true);
				xHRObject.send(null);
				score = 0;
				getname = "";
				clearInterval(interval);
				init();
				homeScreen();
			}
			//return false;
        }
		newShape();
		countForLineTrap += 1;
		if (countForLineTrap == 5){
			LineTrap();
		}
    }
}

//Start a new game when game over
function newGame() {
    'use strict';
    var nextShapeId;
    clearInterval(interval);
    init();
    nextShapeId = nextShape();
    newShape(nextShapeId);
    lose = false;
	countForLineTrap = 0;
    interval = setInterval(tick, 250);
}

// returns rotates the rotated shape 'current' perpendicularly anticlockwise
function rotate(current) {
    'use strict';
    var newCurrent = [], x, y;
    for (y = 0; y < 4; y += 1) {
        newCurrent[y] = [];
        for (x = 0; x < 4; x += 1) {
            newCurrent[y][x] = current[3 - x][y];
        }
    }

    return newCurrent;
}

//press the key to move, rotate, store block or hard drop
function keyPress(key) {
    'use strict';
    switch (key) {
    case 'left':
        if (valid(-1)) {
            currentX -= 1;
        }
        break;
    case 'right':
        if (valid(1)) {
            currentX += 1;
        }
        break;
    case 'down':
        if (valid(0, 1)) {
            currentY += 1;
        }
        break;
    case 'space':
        while (valid(0, 1)) {
            currentY += 1;
        }
        break;
    case 'rotate':
        var rotated = rotate(current);
        if (valid(0, 0, rotated)) {
            current = rotated;
        }
        break;
    }
}



function Sound(src) {
    'use strict';
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.setAttribute("class", "bgMusic");
    if (src === "sound/backgroundMusic.mp3") {
        this.sound.setAttribute("class", "bgMusic");
    } else if (src === "sound/clearLine.mp3") {
        this.sound.setAttribute("class", "clearSound");
    }
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };
    this.muted = function () {
        this.sound.muted = true;
    };
    this.resume = function () {
        this.sound.muted = false;
    };
}

function playingMusic() {
    'use strict';
    if (document.getElementsByClassName('bgMusic').length === 0) {
        bgMusic = new Sound("sound/backgroundMusic.mp3");
    }
    bgMusic.play();
}

function clearLineSound() {
    'use strict';
    if (document.getElementsByClassName("bgMusic").length === 0) {
        clSoundEfct = new Sound("sound/clearLine.mp3");
    }
}

setInterval(function () {'use strict'; playingMusic(); }, 1000);

homeScreen();
$(document).ready(function () {
    'use strict';
    clearLineSound();
    var flag = true;
    $('#tMusic').click(function () {
        if (flag === true) {
            bgMusic.muted();
            clSoundEfct.muted();
            flag = false;
        } else {
            bgMusic.resume();
            clSoundEfct.resume();
            flag = true;
        }  
    });
});


function printScore(){
			var xHRObject = false;
			if (window.XMLHttpRequest)
			{
					xHRObject = new XMLHttpRequest();
			}
			else if (window.ActiveXObject)
			{
				xHRObject = new ActiveXObject("Microsoft.XMLHTTP");	
			}
			xHRObject.onreadystatechange = function(){
			if(xHRObject.readyState == 4 && xHRObject.status == 200){
			document.getElementById("printscore").innerHTML = xHRObject.responseText;
			}
			}
			xHRObject.open('GET',"getGame.php",true);
			xHRObject.send(null);	
}

window.onload = printScore();
var reload = setInterval(printScore,10000);