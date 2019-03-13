//AudioFiles
var audio = new Audio('Audio/menuAudio.mp3');
var swapAudio = new Audio('Audio/swapAudio.wav')
var whiteAudio = new Audio('Audio/whiteAudio.wav')
var goalAudio = new Audio('Audio/goalAudio.wav')
var keyAudio = new Audio('Audio/keyAudio.wav')
var lockAudio = new Audio('Audio/lockAudio.wav')

var moveAudio = new Array()
moveAudio[0] = new Audio("Audio/moveAudio1.wav");
moveAudio[1] = new Audio("Audio/moveAudio2.wav");
moveAudio[2] = new Audio("Audio/moveAudio3.wav");
moveAudio[3] = new Audio("Audio/moveAudio4.wav");
moveAudio[4] = new Audio("Audio/moveAudio5.wav");
  
var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

var img1 = new Image();
img1.src = "Images/PlayerMove.png";

var img2 = new Image();
img2.src = "Images/Swap1.png";

var img3 = new Image();
img3.src = "Images/Swap2.png";

var img4 = new Image();
img4.src = "Images/Swap3.png";

var doorImage = new Image();
doorImage.src = "Images/Door.png";

var lockImage = new Image();
lockImage.src = "Images/Lock.png";

var keyImage = new Image();
keyImage.src = "Images/Key.png";


var bgImage = new Image();
bgImage.src = "Images/Background.png";
var squareSize;
var ssImage = new Image();
ssImage.src = "Images/SS.png";
//Variables
var squareSize;
var topLeftx;
var topLefty;
var boxNo = 11;
var boxSize;
var levelCount = 13;
var loader = 0;
var player;
var playeri; //i is rows
var playerj; //j is columns
var levelRows;
var levelCols;
var level = new Array();
var player_colour = 'red';
var startColour = player_colour;
var moveCount = 0;
var totalMoves = 0;
var keys = 0;
var keySave = 0;
//vars for selecting and swapping the boxes by clicking
var boxDrawPositions = []; //positions where the boxes are drawn
var selectedBoxi = "none";
var selectedBoxj = "none";
var walls = new Array(0);
var centreX;
var centreY;
var isLeft = false;
var isRight = false;
var isSpace = false;
var isUp = false;
var isDown = false;
var isKeyDown = false;
var isRestart = false;
var checkStop = false;

var delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

//Register click event
window.addEventListener("click", processClick, false);
//check if a point is in a box which has x,y,width,height
function boxCollide(x,y,box){
    if (x > box[0] && x < box[0] + box[2] && y > box[1] && y < box[1] + box[3]){
        return true;
    }
    else{
        return false;
    }
}
    
function processClick(e){
    //find which box was just clicked on
    var foundBox = false;
    for (var i in boxDrawPositions){
        for (var j in boxDrawPositions[i]){
            //if you clicked in a box
            if (boxCollide(e.x,e.y,boxDrawPositions[i][j])){
                foundBox = true;
                //if there is no selected box then select this one
                //TODO add conditions, can you select player? can you select goal etc?
                if (selectedBoxi == "none"){
                    if(level[i][j] == "red"|| level[i][j] == "blue"|| level[i][j] =="green" ){
                        selectedBoxi = i;
                        selectedBoxj = j;
                    }
                }
                //if there is already a box selected
                //TODO add conditions on swap, do the two colours have to match etc?
                else{
                    if((level[i][j] == "red"|| level[i][j] == "blue"|| level[i][j] =="green") && level[i][j] !== (level[selectedBoxi][selectedBoxj])){
                        if((selectedBoxi == i && selectedBoxj == j - 1) ||
                            (selectedBoxi == i - 1 && selectedBoxj == j) ||
                            (selectedBoxi - 1 == i && selectedBoxj == j) ||
                            (selectedBoxi == i && selectedBoxj - 1 == j )){
                            swapColour(i,j,selectedBoxi,selectedBoxj,level[i][j],level[selectedBoxi][selectedBoxj]);
                            moveCount++;
                            totalMoves++;
                            selectedBoxi = "none";
                            selectedBoxj = "none";
                        }
                        else{
                            selectedBoxi = "none";
                            selectedBoxj = "none";
                        }
                    }
                    else{
                        selectedBoxi = "none";
                        selectedBoxj = "none";
                    }
                }
            }
        }
    } //if you did not find a box at all
    if (!foundBox){
        selectedBoxi = "none";
        selectedBoxj = "none";
    }
}
//Register resize event
window.addEventListener('resize', resizeCanvas, false);
//Run initial 'resize' to get screen size and draw
resizeCanvas();
//document.onkeydown = checkKey;
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);
function keyDown(e){
    isKeyDown = true;
    if(e.keyCode =='37' || e.keyCode =='65') isLeft = true;
    if(e.keyCode == '39' || e.keyCode =='68') isRight = true;
    if(e.keyCode == '32') isSpace = true;
    if(e.keyCode == '38' || e.keyCode =='87') isUp = true;
    if(e.keyCode == '40' || e.keyCode =='83') isDown = true;
    if(e.keyCode == "82") isRestart = true;
}
function keyUp(e){
    isKeyDown = false;
    if(e.keyCode =='37' || e.keyCode =='65') isLeft = false;
    if(e.keyCode == '39' || e.keyCode =='68') isRight = false;
    if(e.keyCode == '32') isSpace = false;
    if(e.keyCode == '38' || e.keyCode =='87') isUp = false;
    if(e.keyCode == '40' || e.keyCode =='83') isDown = false;
    if(e.keyCode == "82") isRestart = false;
}
    
function level_check(){
    startColour = player_colour;
    level = levels[levelCount-1].map(x => x.slice()); //apparently slice is not enough for arrays of arrays
   
    levelRows = level.length;
    levelCols = level[0].length;
    boxDrawPositions = level.map(x => x.slice());
}
        
function win(){
    levelCount++;
        loader = 0;
        moveCount = 0;
        keySave = keys;

        //No clicks get carried over
        selectedBoxi = "none";
        selectedBoxj = "none";
    
                        
    //Maybe add some graphics here
}   
                
// Draw game.                 
function draw() {
    if(loader==0){
        level_check();
        loader = 1;
    }
    //Draw background
    ctx.drawImage(bgImage, topLeftx, topLefty, squareSize, squareSize);
    //Draw swappy squares
    ctx.drawImage(ssImage, topLeftx+(boxNo/2*boxSize)-(boxSize*3/2), topLefty, boxSize*3, boxSize);
    //Draw level number 
    ctx.textAlign="right"; 
    ctx.textBaseline = "bottom";
    ctx.fillStyle = 'black';
    ctx.font = "30px Arial";
    ctx.fillText("Level " + levelCount, topLeftx+10*boxSize, topLefty+boxSize);

     //Draw move numbers
    ctx.textAlign="left"; 
    ctx.textBaseline = "bottom";
    ctx.fillStyle = 'black';
    ctx.font = "20px Arial";
    ctx.fillText("Moves: " + moveCount, topLeftx+1*boxSize, topLefty+boxSize);
    ctx.textBaseline = "top";
    ctx.fillText("Total: " + totalMoves, topLeftx+boxSize, topLefty+10.2*boxSize);

    //draw keys
    ctx.textAlign="right";
    ctx.textBaseline = "top";
    ctx.fillStyle = 'gold';
    ctx.font = "20px Arial";
    ctx.fillText("Keys: " + keys, topLeftx+10*boxSize, topLefty+10.2*boxSize);
    
    //Draw transparent game background
    ctx.fillStyle = 'black';
    ctx.fillRect(topLeftx+boxSize, topLefty+boxSize, squareSize-2*boxSize, squareSize-2*boxSize);


    //Draw Player in centre and find offset values.
    ctx.fillStyle = player_colour;
    for(var i = 0; i<levelRows; i++){
        for(var j = 0; j<levelCols;j++){
            if(level[i][j]=="player"){
                playeri = i;
                playerj = j;
                offseti = i-5;
                offsetj = j-5;
                ctx.fillRect(centreX, centreY, boxSize, boxSize);
            }
        }
    }
    //Draw everything else
    for(var i = 0; i<levelRows; i++){
        for(var j = 0; j<levelCols;j++){
            if (level[i][j] == "player"){
                ctx.fillStyle = player_colour;
            }
            else{
                ctx.fillStyle = level[i][j];
                
            }
            var position_x = topLeftx+(j-offsetj)*boxSize;
            var position_y = topLefty+(i-offseti)*boxSize;

        
            if(position_x>=topLeftx+boxSize && position_x<topLeftx+10*boxSize && position_y>=topLefty+boxSize && position_y<topLefty+10*boxSize){
                //DRAW ALL SQUARES INSIDE GAMEBOARD WITH A BLACK OUTLINE
                ctx.fillRect(position_x, position_y, boxSize, boxSize); 
                ctx.strokeStyle = 'black';
                ctx.lineWidth = '5';
                ctx.strokeRect(position_x, position_y, boxSize, boxSize);

                //writting on gold box
                if (level[i][j] == "gold"){
                    //ctx.fillStyle = 'black';
                    //ctx.textAlign="center"; 
                    //ctx.textBaseline = "middle";
                    //ctx.font = "15px Arial";
                    //ctx.fillText("GOAL", position_x+0.5*boxSize, position_y+0.5*boxSize);
                    ctx.drawImage(doorImage, position_x, position_y, boxSize, boxSize);
                }

                //writting on key box
                if (level[i][j] == "silver"){
                    //ctx.fillStyle = 'black';
                    //ctx.textAlign="center"; 
                    //ctx.textBaseline = "middle";
                    //ctx.font = "15px Arial";
                    //ctx.fillText("KEY", position_x+0.5*boxSize, position_y+0.5*boxSize);
                    ctx.drawImage(keyImage, position_x, position_y, boxSize, boxSize);
                }

                //writting on lock box
                if (level[i][j] == "grey"){
                    //ctx.fillStyle = 'black';
                    //ctx.textAlign="center"; 
                    //ctx.textBaseline = "middle";
                    //ctx.font = "15px Arial";
                    //ctx.fillText("LOCK", position_x+0.5*boxSize, position_y+0.5*boxSize);
                    ctx.drawImage(lockImage, position_x, position_y, boxSize, boxSize);
                }

                if (["darkred","darkgreen","darkblue"].includes(level[i][j])){
            
                    ctx.fillStyle = level[i][j].replace('dark', '');
                    ctx.fillRect(position_x + 0.25*boxSize, position_y + 0.25*boxSize, 0.5*boxSize, 0.5*boxSize); 
                }
            }
            
            boxDrawPositions[i][j] = [position_x, position_y, boxSize, boxSize]; //store the draw position
            //draw a token for which box is selected, this is just an example 
            if (i == selectedBoxi && j == selectedBoxj){
                ctx.fillStyle = "white";
                ctx.fillRect(position_x + 0.25*boxSize, position_y + 0.25*boxSize, 0.5*boxSize, 0.5*boxSize); 
            }

            //Draw gold box around player
            ctx.strokeStyle = 'rgb(255,223,0)';
            ctx.lineWidth = '5';
            ctx.strokeRect(centreX, centreY, boxSize, boxSize);
        }

            //Draw game box outline
            ctx.strokeStyle = 'rgba(225,225,225)';
            ctx.lineWidth = '5';
            ctx.strokeRect(topLeftx+boxSize, topLefty+boxSize, squareSize-2*boxSize, squareSize-2*boxSize);
    

          //Draw any text on level
        drawText();

    }
       
    //check if any squares are swappable
    if (!check_possible_swaps() && !checkStop){
        checkStop = true;

        delay(function(){
            // do stuff

        
            swal("No possible moves","Try again", {button: "Restart"})
            .then((value) => {
                keys = keySave;
                player_colour = startColour;
                loader = 0;
                moveCount = 0;
                checkStop = false;
                selectedBoxi = "none";
                selectedBoxj = "none";
            });
        }, 1500 ); // end delay  
    }

    //Movement logic
    if(isKeyDown) movementLogic();
    window.requestAnimationFrame(draw); //this is apparently smoother than setInterval, not sure why
}

function drawText(){
    ctx.textAlign="center"; 
    ctx.textBaseline = "bottom";
    ctx.fillStyle = 'black';
    ctx.font = "14px Arial";
    if(levelCount == 1 && level[playeri][playerj-1] == "black" && level[playeri][playerj+1] == "red"){
        ctx.drawImage(img1,topLeftx+3*boxSize,topLefty+1.5*boxSize,5*boxSize,2*boxSize);
    }
    else{
        ctx.fillStyle = player_colour;
        ctx.fillText("Press R to RESTART the level", topLeftx+5.5*boxSize, topLefty+10.5*boxSize);
    }   

    if(levelCount == 2 && level[playeri][playerj-1] == "black" && level[playeri][playerj+1] == "red"){
        ctx.drawImage(img2,topLeftx+3*boxSize,topLefty+1.5*boxSize,5*boxSize,2*boxSize);
        ctx.fillStyle = 'black';
        //ctx.fillText("Try swapping the RED and BLUE squares!", topLeftx+5.5*boxSize, topLefty+2*boxSize);
        //ctx.fillText("You can only move through squares that are the same colour as you!", topLeftx+5.5*boxSize, topLefty+2.5*boxSize);
    }   

    if(levelCount == 3 && level[playeri][playerj-1] == "black" && level[playeri][playerj+1] == "blue"){
        ctx.drawImage(img3,topLeftx+3*boxSize,topLefty+1.5*boxSize,5*boxSize,2*boxSize);
    }   

    if(levelCount == 8 && level[playeri][playerj-1] == "black" && level[playeri][playerj+1] == "red"){
        ctx.drawImage(img4,topLeftx+3*boxSize,topLefty+1.5*boxSize,5*boxSize,2*boxSize);
    }  

}

function movementLogic(){
    //console.log("playeri = ", playeri);
    //console.log("playerj = ", playerj);
    if(isRight && playerj+1 < level[playeri].length){ 
        try_moving(playeri,playerj,0,1);
        isRight = false;
    }
    if(isLeft && playerj-1 >= 0){ 
        try_moving(playeri,playerj,0,-1);
        isLeft = false;
    }
    if(isDown && playeri+1 < level.length){
        try_moving(playeri,playerj,1,0);
        isDown = false;
    }
    if(isUp && playeri-1 >= 0){
        try_moving(playeri,playerj,-1,0);
        isUp = false;
    }

    if(isRestart){
        selectedBoxi = "none";
        selectedBoxj = "none";
        keys = keySave;
        player_colour = startColour;
        loader = 0;
        moveCount = 0;
    }
}

function try_moving(i,j, di, dj){
    //if this is a regular move
    if (level[i+di][j+dj] == player_colour){
            selectedBoxi = "none";
            selectedBoxj = "none";
            swap(i,j,i+di,j+dj);
            moveCount++;
            totalMoves++;
        }
    //if you are moving to a colour change square
    else if (["darkred","darkgreen","darkblue"].includes(level[i+di][j+dj]) ){            
        var colourSave = level[i+di][j+dj].replace('dark', '');
        level[i+di][j+dj] = player_colour;
        player_colour = colourSave;

        swap(i,j,i+di,j+dj);
        moveCount++;
        totalMoves++;
    }
    else if(level[i+di][j+dj] == "white"){
        level[i+di][j+dj] = player_colour;
      

        swap(i,j,i+di,j+dj);
          level[i+di+1][j+dj] = player_colour;
        level[i+di-1][j+dj] = player_colour;
        level[i+di][j+dj+1] = player_colour;
        level[i+di][j+dj-1] = player_colour;
        moveCount++;
        totalMoves++;
        whiteAudio.play();
    }
    else if(level[i+di][j+dj] == "silver"){
        level[i+di][j+dj] = player_colour;
        keys++;
        swap(i,j,i+di,j+dj);
        moveCount++;
        totalMoves++;
        keyAudio.play()
    }
    else if(level[i+di][j+dj] == "grey" && keys > 0){
        level[i+di][j+dj] = player_colour;
        swap(i,j,i+di,j+dj);
        keys--;
        moveCount++;
        totalMoves++;
        lockAudio.play()
    }
    //if you are moving to the goal
    else if (level[i+di][j+dj] == "gold"){
        moveCount++;
        totalMoves++;
        goalAudio.play()
        win();
    }
}

//check if any squares are swappable
function check_possible_swaps(){
    for (var i = 0; i < level.length - 1; i++){
        for (var j = 0; j < level[i].length - 1; j++){
            var swappy_colours = ["red", "blue", "green"];
            var a = level[i][j];
            var b = level[i + 1][j];
            var c = level[i][j + 1];
            if (swappy_colours.includes(a) && swappy_colours.includes(b) && a != b){
                return true;
            }
            if (swappy_colours.includes(a) && swappy_colours.includes(c) && a != c){   
                return true;
            }
        }   
    }

    var other_colours = ["darkred","darkgreen","darkblue","gold","white","silver","grey"];
    var around_player = [level[playeri+1][playerj],level[playeri-1][playerj],level[playeri][playerj+1],level[playeri][playerj-1]];
    if(around_player.includes(player_colour) || around_player.some(el => other_colours.includes(el))){
            return true;
    }

    return false;
}


    
// Runs each time the DOM window resize event fires.
// Resets the canvas dimensions to match window,
// then draws the new borders accordingly.
function resizeCanvas() {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
        
    if(window.innerWidth>window.innerHeight){
        squareSize = window.innerHeight; 
        topLeftx = (window.innerWidth-window.innerHeight)/2;
        topLefty = 0;
    }
    else{
        squareSize = window.innerWidth; 
        topLeftx = 0;
        topLefty = (window.innerHeight-window.innerWidth)/2;
    }
    //Sets size of the Swappy Squares
    boxSize = squareSize/boxNo;
    centreX = topLeftx+(5*boxSize);
    centreY = topLefty+(5*boxSize);
    //draw();
}

function swapColour(x1,y1,x2,y2,col1,col2){
    if(col1 !== "red" && col2 !== "red" && col2 !== col1){
            level[x1][y1] = "red";
            level[x2][y2] = "red";
            swapAudio.play();
    }
    if(col1 !== "blue" && col2 !== "blue" && col2 !== col1){
            level[x1][y1] = "blue";
            level[x2][y2] = "blue";
            swapAudio.play();
    }
    if(col1 !== "green" && col2 !== "green" && col2 !== col1){
            level[x1][y1] = "green";
            level[x2][y2] = "green";
            swapAudio.play();
    }
}

function swap(x1,y1,x2,y2){
    var temp = level[x1][y1];
    level[x1][y1] = level[x2][y2];
    level[x2][y2] = temp;

    moveAudio.volume = 0.2;
    moveAudio[moveCount%4].play();
}
//let game = setInterval(draw,100);
window.requestAnimationFrame(draw);



if (typeof(Storage) !== "undefined") {
  // Store
  localStorage.setItem("CurrentLevel", levelCount);
  // Retrieve
  levelCount = localStorage.getItem("CurrentLevel");
} else {
  alert("Sorry, your browser does not support Web Storage...")
}