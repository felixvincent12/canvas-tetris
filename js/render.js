/***********************************
Name: Lei Sing Hong
Date: 22 March 2018
Description: This js file is use to draw a game board.
***********************************/
var canvas = document.getElementById('mainscreen');
var nextBlock = document.getElementById('nextBlock');
//connect with html canvas tag
var ctx = canvas.getContext('2d');
var ntx = nextBlock.getContext('2d');
var W = 300, H = 600; //game board weight and height
var nW = 160, nH = 320; //nextBlock width and height
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
var nBLOCK_W = nW / COLS, nBLOCK_H = nH / ROWS; //4, 4

// draw a single square at (x, y)
function drawBlock(x, y) {
    'use strict';
    ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
    ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

function ndrawBlock(x, y) {
    'use strict';
    ntx.fillRect((nBLOCK_W * x) + 15, (nBLOCK_H * y) + 20, nBLOCK_W - 1, nBLOCK_H - 1);
    ntx.strokeRect((nBLOCK_W * x) + 15, (nBLOCK_H * y) + 20, nBLOCK_W - 1, nBLOCK_H - 1);
}

// draws the board and the moving shape
function render() {
    'use strict';
    var x, y;
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'black';
    for (x = 0; x < COLS; x += 1) {
        for (y = 0; y < ROWS; y += 1) {
            if (board[y][x]) {
                ctx.fillStyle = colors[board[y][x] - 1];
                drawBlock(x, y);
            }
        }
    }

    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black'; //block color
    for (y = 0; y < 4; y += 1) {
        for (x = 0; x < 4; x += 1) {
            if (current[y][x]) {
                ctx.fillStyle = colors[current[y][x] - 1];
                drawBlock(currentX + x, currentY + y);
            }
        }
    }
}

function nrender() {
    'use strict';
    var x, y;
    //remove previous moving
    ntx.clearRect(0, 0, nW, nH);

    ntx.fillStyle = 'red';
    ntx.strokeStyle = 'black'; //block color
    
    for (y = 0; y < 4; y += 1) {
        for (x = 0; x < 4; x += 1) {
            if (next[y][x]) {
                ntx.fillStyle = colors[next[y][x] - 1];
                ndrawBlock(x, y);
            }
        }
    }
}

function drawboardline()
{   
        var c = document.getElementById("mainscreen");
        var ctx = c.getContext("2d");
        var i = 0;
        var j = 0;
        var x= 0;
        var y =0;
        for (i=0; i<10; i++)
        {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 600);
            ctx.stroke();
            x+=30;
        }
        for (j=0; j<20; j++)
        {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(300, y);
            ctx.stroke();
            y+=30;
        }
}
//repeat the execution function in 30 milliseconds
setInterval(render, 30);
setInterval(nrender, 30);
setInterval(drawboardline,1);
