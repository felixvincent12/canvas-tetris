/***********************************
Name: Desmond Wong Yeh Jong
Date: 21 March 2018
Description: This file is the code make the program run.
***********************************/

//variable
var score = 0;
document.getElementById('score').innerHTML = score;
var bgMusic;
var clSoundEfct;
var score = 0;
var COLS = 10, ROWS = 20;
var board = [];
var lose;
var interval;
var current; // current moving shape
var currentX, currentY; // position of current shape
var recordID; //variable to record shape
//create the shape such as square 
var shapes = [
    [ 1, 1, 1, 1 ],
    [ 1, 1, 1, 0,
      1 ],
    [ 1, 1, 1, 0,
      0, 0, 1 ],
    [ 1, 1, 0, 0,
      1, 1 ],
    [ 1, 1, 0, 0,
      0, 1, 1 ],
    [ 0, 1, 1, 0,
      1, 1 ],
    [ 0, 1, 0, 0,
      1, 1, 1 ]
];
var colors = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];

// creates a new 4x4 shape in global variable 'current'
// 4x4 so as to cover the size when the shape is rotated
function newShape() {
    var id = Math.floor( Math.random() * shapes.length );
	//while the previous shape is same with new shape, keep random in the loop until its not same
	while(recordID == id){ 
		id = Math.floor( Math.random() * shapes.length);
	}
	recordID = id; //to assign new shape id into recordID
    var shape = shapes[ id ]; // maintain id for shape chosen

    current = [];
    for ( var y = 0; y < 4; ++y ) {
        current[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            var i = 4 * y + x;
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
                current[ y ][ x ] = id + 1;
            }
            else {
                current[ y ][ x ] = 0;
            }
        }
    }
    // position where the shape will evolve
    currentX = 5;
    currentY = -1;
}

// clears the board
function init() {
    for ( var y = 0; y < ROWS; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
            board[ y ][ x ] = 0;
        }
    }
}

// keep the element moving down, creating new shapes and clearing lines
function tick() {
    if ( valid( 0, 1 ) ) {
        ++currentY;
    }
	//reach maximum height, end game
	else if(currentY == -1)
	{
		if(confirm('Game Over!\nDo you want to play again?')){
			score = 0;
			document.getElementById('score').innerHTML = score;
				newGame();
			} else{
				clearInterval(interval);
				init();
				homeScreen();
			}
    }
    // if the element settled
    else {
        freeze();
        clearLines();
        if (lose) {
			if(confirm('Game Over!\nDo you want to play again?')){
				score = 0;
				document.getElementById('score').innerHTML = score;
				newGame();
			} else{
				clearInterval(interval);
				init();
				homeScreen();
			}
			//return false;
        }
		newShape();
    }
}

// stop shape at its position and fix it to board
function freeze() {
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
            }
        }
    }
}

// returns rotates the rotated shape 'current' perpendicularly anticlockwise
function rotate( current ) {
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ) {
        newCurrent[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
        }
    }

    return newCurrent;
}

// check if any lines are filled and clear them
function clearLines() {
    for ( var y = ROWS - 1; y >= 0; --y ) {
        var rowFilled = true;
        for ( var x = 0; x < COLS; ++x ) {
            if ( board[ y ][ x ] == 0 ) {
                rowFilled = false;
                break;
            }
        }
        if ( rowFilled ) {
            clSoundEfct.play();
            //document.getElementById( 'clearsound' ).play();
			score += 20;
			document.getElementById('score').innerHTML = score;
            for ( var yy = y; yy > 0; --yy ) {
                for ( var x = 0; x < COLS; ++x ) {
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                }
            }
            ++y;
        }
    }
}
//press the key to move, rotate, store block or hard drop
function keyPress( key ) {
    switch ( key ) {
        case 'left':
            if ( valid( -1 ) ) {
                --currentX;
            }
            break;
        case 'right':
            if ( valid( 1 ) ) {
                ++currentX;
            }
            break;
        case 'down':
            if ( valid( 0, 1 ) ) {
                ++currentY;
            }
            break;
		case 'space':
				while (valid( 0, 1 ))
				{
					++currentY;
				}
            break;
        case 'rotate':
            var rotated = rotate( current );
            if ( valid( 0, 0, rotated ) ) {
                current = rotated;
            }
            break;
    }
}

// checks if the resulting position of current shape will be feasible
function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;



    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined'
                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || board[ y + offsetY ][ x + offsetX ]
                  || x + offsetX < 0
                  || y + offsetY >= ROWS
                  || x + offsetX >= COLS ) {
                    if (offsetY == 1) lose = true; // lose if the current shape at the top row when checked
                    return false;
                }
            }
        }
    }
    return true;
}
//Start a new game when game over
function newGame() {
    clearInterval(interval);
    init();
    newShape();
    lose = false;
    interval = setInterval( tick, 250 );
}

function sound(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.setAttribute("class", "bgMusic");
    if(src ==="sound/backgroundMusic.mp3")
        this.sound.setAttribute("class","bgMusic");
    else if(src==="sound/clearLine.mp3")
        this.sound.setAttribute("class","clearSound");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.muted = function(){
        this.sound.muted = true;
    };
    this.resume = function(){
        this.sound.muted = false;
    }
}

function playingMusic(){
    if (document.getElementsByClassName('bgMusic').length == 0) {
        bgMusic = new sound("sound/backgroundMusic.mp3");
    }
    bgMusic.play();
}

function clearLineSound(){
    if(document.getElementsByClassName("bgMusic").length === 0){
        clSoundEfct = new sound("sound/clearLine.mp3");
    }
}

setInterval(function(){playingMusic();}, 1000);


//function to create button when it is clicked the game will start
function createHomeStartButton(){
	
	// 1. Create the button
	var button = document.createElement("button");
	button.innerHTML = "Start Game";

	// 2. Append somewhere
	var body = document.getElementsByTagName("body")[0];
	body.appendChild(button);

	// 3. Add event handler
	button.addEventListener ("click", function() {
	alert("Enjoy The Game");
	newGame();
	body.removeChild(button);
	});
}
function homeScreen(){
	createHomeStartButton();
}

homeScreen();
$(document).ready(function(){
    clearLineSound();
    var flag = true;
    $('#tMusic').click(function(){
        if (flag === true) {
            bgMusic.muted();
            clSoundEfct.muted();
            flag = false;
        }
        else {
            bgMusic.resume();
            clSoundEfct.resume();
            flag = true;
        }   
    });
});