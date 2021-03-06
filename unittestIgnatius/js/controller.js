/***********************************
Name: Lei Sing Hong
Date: 22 March 2018
Description: This js file is detect the keyboard input from user.
***********************************/

/********************************
key code on a standard keyboard:
37 - Left Arrow key  / ← is move the block to left
39 - Right Arrow key / → is move the block to right
40 - Down Arrow key  / ↓ is drop th block  faster
38 - Up Arrow key    / ↑ rotate the block
*********************************/

document.body.onkeydown = function( e ) {
    var keys = { //false
		32: 'space',
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'rotate'
    }; //create keys' variable for each direction
    var wasdKeys = { //true
        13: 'space',
        87: 'rotate',
        65: 'left',
        83: 'down',
        68: 'right'
    };
    if ( typeof keys[ e.keyCode ] != 'undefined' || typeof wasdKeys[e.keyCode] != 'undefined' ) {            
        keyPress( keyboardSettings ? wasdKeys[e.keyCode] : keys[ e.keyCode ] );
        render();
    }
};
