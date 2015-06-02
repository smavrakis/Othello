//Represents a 2d array where each position is either green (symbolizing no piece there), black or white. 
var boardState = new Array(64);

//Temporary flag to decide whose turn it is
var flag = "black";

//Flag for representing tutorialMode being active(1) or inactive(0)
var tutorialMode = 0;

//Language used
var language = "en";

//delay for animations
var delay = 200

//Temporary strings for helping with translations
var string1 = "";
var string2 = "";
var string3 = "";

// Dictionary for the internationalization part
var resources = {  
	en: { translation: { 'reset': 'Reset Game', 'mute': 'Mute tiles', 'tip': "This is each player's score. The player's turn is indicated by the underline under their score.", 'tutorial': 'How to Play',
							'unmute': 'Unmute tiles', 'next': 'Next', 'back': 'Back', 'try': 'Try', 'finish': 'Finish', 'step': 'How to play Step: ',
							'tut1': 'Othello is played between two players. Player one uses black tiles and player two uses white tiles. This tutorial will help you understand the rules of the game. Please press next to continue or feel free to close this box and start playing by yourself.',
							'caution': '(Pressing next will reset the board)',
							'tut2': "A valid placement is one such that the tile needs to be adjacent to another tile. You must also place the tile so you're in a position to flip the other player's tiles. You're allowed to flip the other player's tiles that are bordered at each end by your newly placed tile and an already placed tile of your color.",
							'tut3': 'Press the try button and place a tile in such a way that your tiles suround one (or multiple) tiles of the oponent while still being adjacent to some other tile.',
							'tut4': "As you saw the white tile flipped. It is now the opponent's turn to place a tile. Press next to place the next tile.",
							'tut5': "When it is no longer possible for either player to move, the game is over. Discs are counted and the player with the majority of his or her colour discs on the board is the winner. Now you understand the basics of Othello!",
							'tut6': 'Good luck and have fun playing!'} },            
	se: { translation: { 'reset': 'Starta om', 'mute': 'Stäng av brickljud', 'tip': "Detta är varje spelares poäng. Strecket under poängen visar vilken spelares tur det är.", 'tutorial': 'Hur man spelar',
							'unmute': 'Unmute tiles', 'next': 'Next', 'back': 'Back', 'try': 'Try', 'finish': 'Finish', 'step': 'How to play Step: ',
							'tut1': 'Othello is played between two players. Player one uses black tiles and player two uses white tiles. This tutorial will help you understand the rules of the game. Please press next to continue or feel free to close this box and start playing by yourself.',
							'caution': '(Pressing next will reset the board)',
							'tut2': "A valid placement is one such that the tile needs to be adjacent to another tile. You must also place the tile so you're in a position to flip the other player's tiles. You're allowed to flip the other player's tiles that are bordered at each end by your newly placed tile and an already placed tile of your color.",
							'tut3': 'Press the try button and place a tile in such a way that your tiles suround one (or multiple) tiles of the oponent while still being adjacent to some other tile.',
							'tut4': "As you saw the white tile flipped. It is now the opponent's turn to place a tile. Press next to place the next tile.",
							'tut5': "When it is no longer possible for either player to move, the game is over. Discs are counted and the player with the majority of his or her colour discs on the board is the winner. Now you understand the basics of Othello!",
							'tut6': 'Good luck and have fun playing!'}}
};

//Initializes the boardState, calls resizeGame() and sets up the two EventListeners - one for user interaction and one for window resize
function draw(){	
	
	flag = "black";
	
    for(var i=0;i<64;i++) {
	boardState[i]="green";
    }
    
    for(var n =0;n<4;n++) {
	boardState[3*8+3] = "white";
	boardState[4*8+4] = "white";
	boardState[4*8+3] = "black";
	boardState[3*8+4] = "black";
    }
    
    resizeGame();

	i18n.init({ resStore: resources, lng: language }, function(t) {		
		document.getElementById("reset_button").innerHTML = t("reset");
		if (tile_sound.muted == false){
			document.getElementById("mute_button").innerHTML = t("mute");
		}else{
			document.getElementById("mute_button").innerHTML = t("unmute");
		}		
		document.getElementById("score-tip").innerHTML = t("tip");
		document.getElementById("tutorial_button").innerHTML = t("tutorial");
		document.getElementById("tutorial-next").innerHTML = t("next");
		document.getElementById("tutorial-prev").innerHTML = t("back");
	});    
	
    var canvas2 = document.getElementById('state');
    canvas2.addEventListener('click',checkValidity,false);
    window.addEventListener('resize', resizeGame, false);    
}

//Changes the language to Swedish and translates all the elements
function make_lang_se() {
    language = "se";
	
	i18n.init({ resStore: resources, lng: language }, function(t) {		
		document.getElementById("reset_button").innerHTML = t("reset");
		if (tile_sound.muted == false){
			document.getElementById("mute_button").innerHTML = t("mute");
		}else{
			document.getElementById("mute_button").innerHTML = t("unmute");
		}
		document.getElementById("score-tip").innerHTML = t("tip");
		document.getElementById("tutorial_button").innerHTML = t("tutorial");
		document.getElementById("tutorial-next").innerHTML = t("next");
		document.getElementById("tutorial-prev").innerHTML = t("back");
	});
}

//Changes the language to English and translates all the elements
function make_lang_en() {
    language = "en";
	
	i18n.init({ resStore: resources, lng: language }, function(t) {		
		document.getElementById("reset_button").innerHTML = t("reset");
		if (tile_sound.muted == false){
			document.getElementById("mute_button").innerHTML = t("mute");
		}else{
			document.getElementById("mute_button").innerHTML = t("unmute");
		}
		document.getElementById("score-tip").innerHTML = t("tip");
		document.getElementById("tutorial_button").innerHTML = t("tutorial");
		document.getElementById("tutorial-next").innerHTML = t("next");
		document.getElementById("tutorial-prev").innerHTML = t("back");
	});
}

//Draws the board
function drawBoard(){
    var canvas = document.getElementById('board');	
    var ctx = canvas.getContext('2d');	
    ctx.fillStyle = "rgb(0,102,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);	
    var xSep = canvas.width/8;
    var ySep = canvas.height/8;
    ctx.lineWidth = 1;
    
    for (var i = 1;i <= 7;i++) {
	ctx.beginPath();
	ctx.moveTo(0,i*ySep);
	ctx.lineTo(canvas.width,i*xSep);
	ctx.closePath();
	ctx.stroke();
    }
    
    for (var i = 1;i <= 7;i++) {
	ctx.beginPath();
	ctx.moveTo(i*xSep,0);
	ctx.lineTo(i*xSep,canvas.height);
	ctx.closePath();
	ctx.stroke();
    }	
}

//Resizes the board depending on current window size
function resizeGame(){
    var gameArea = document.getElementById('board-container');
    var widthToHeight = 1;
    var newWidth = window.innerWidth / 1.7;
    var newHeight = window.innerHeight / 1.7;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > widthToHeight){
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    }else{
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }
    
    var canvas = document.getElementById('board');
    var canvas2 = document.getElementById('state');
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    canvas2.width = newWidth;
    canvas2.height = newHeight;
    
    resizeStats();
    drawBoard();
    drawState();
}

//Resizes the score container
function resizeStats(){
    var container = document.getElementById('score-container');
    var widthToHeight = 1.5;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > widthToHeight){
        newWidth = newHeight * widthToHeight;
        container.style.height = (newHeight * 0.2) + 'px';
        container.style.width = (newWidth * 0.4) + 'px';
    }else{
        newHeight = newWidth / widthToHeight;
        container.style.width = (newWidth * 0.4) + 'px';
        container.style.height = (newHeight * 0.2) + 'px';
    }
}

//Updates the score and checks for valid moves and a win condition
function updateScore(){
    var score_white = 0;
    var score_black = 0;
    
    for (var i=0;i<64;i++){
		if (boardState[i] == "white"){
			score_white++;
		}else if ((boardState[i] == "black")){
			score_black++;
		}		
    }
    
    var white = document.getElementById('score-white');
    var black = document.getElementById('score-black');	
    
    white.innerHTML = score_white;
    black.innerHTML = score_black;

	if (checkForValidMoves(flag) == false){
		if ((flag == "black" && checkForValidMoves("white") == false) || (flag == "white" && checkForValidMoves("black") == false)){
			if (score_white > score_black){
				alert("No valid moves left, white wins!");
			}else if(score_white < score_black){
				alert("No valid moves left, black wins!");				
			}else{
				alert("No valid moves left, it's a draw!");
			}
			window.location.replace("index.html");
		}else{
			if (flag == "black"){
				flag = "white";
			}else{
				flag = "black";
			}
		}
	}
    
    if (flag == "black"){
		white.style.textDecoration = "none";
		black.style.textDecoration = "underline";
		black.style.background = "#c7c7c7"
		white.style.background = "#DDDDDD"	
    }else if (flag == "white"){
		white.style.textDecoration = "underline";
		black.style.textDecoration = "none";
		black.style.background = "#DDDDDD"
		white.style.background = "#C7C7C7"	
    }

    /*if (score_white + score_black >= 64){
		if (score_white > score_black){
			alert("White wins!");
		}else if(score_white < score_black){
			alert("Black wins!");
		}else{
			alert("It's a draw!");
		}
		window.location.replace("index.html");
    }*/
}


//Calculates which square the user clicked on and places a tile in the correct index in boardState
function placetile(x,y){
   
    var color = "";
    
    if (flag == "black"){
	color = "black";
	//flag = "white";
    }else{
	color = "white";
	//flag = "black";
    }
	tile_sound.play();


	//Tutorial
	//console.log("mode=" + tutorialMode);
    if (tutorialMode == 1) {
		overlay.className = 'show';
		popup.className = 'show';
		tutorialStep++;
		//console.log("step: " + tutorialStep);
		document.getElementById("tutorial-next").innerHTML = "Next";
		document.getElementById("tutorial-content").innerHTML = fetchTutorialContent(tutorialStep);
		
		
	} else {
		overlay.className = '';
		popup.className = '';
	}
	
	
    boardState[x*8+y] = color;
    
    //drawState();
}

//Checks if a player has a valid move
function checkForValidMoves(player_color){
	var opposite_flag = "";
	var valid = false;
	
	if (player_color == "black"){		
		opposite_flag = "white";
	}else if (player_color == "white"){		
		opposite_flag = "black";
	}
	
	for (var i=0;i<64;i++){
		if (boardState[i] == player_color){			
			var list = getAdjacent(i);			
			
			for (var j=0;j<list.length;j++){
				if (boardState[list[j]] == opposite_flag){					
					var position = list[j];
					
					if (position == i-9){
						if (boardState[position-9] == "green"){
							valid = true;
							break;
						}
					}else if(position == i-8){
						if (boardState[position-8] == "green"){
							valid = true;
							break;
						}
					}else if(position == i-7){
						if (boardState[position-7] == "green"){
							valid = true;
							break;
						}
					}else if(position == i+1){
						if (boardState[position+1] == "green"){
							valid = true;
							break;
						}
					}else if(position == i-1){
						if (boardState[position-1] == "green"){
							valid = true;
							break;
						}
					}else if(position == i+7){
						if (boardState[position+7] == "green"){
							valid = true;
							break;
						}
					}else if(position == i+8){
						if (boardState[position+8] == "green"){
							valid = true;
							break;
						}
					}else if(position == i+9){
						if (boardState[position+9] == "green"){
							valid = true;
							break;
						}
					}
				}
			}
		}
    }

	return valid;
}

//Returns adjacent tiles given position in the array
function getAdjacent(x){
	var list = new Array(8);
	
	list[0] = x-9;
	list[1] = x-8;
	list[2] = x-7;
	list[3] = x+1;
	list[4] = x-1;
	list[5] = x+7;
	list[6] = x+8;
	list[7] = x+9;
	
	return list;
}

//Returns adjacent tiles given coordinates
function getAdjacentTiles(x,y){
    
    if (x == 0 && y == 0){
	var list = new Array(3);
	list[0] = {color:boardState[1],x:0,y:1};
	list[1] = {color:boardState[9],x:1,y:1};
	list[2] = {color:boardState[8],x:1,y:0};
	return list;
    }else if (x == 0 && y == 7){
	var list = new Array(3);
	list[0] = {color:boardState[6],x:0,y:6};
	list[1] = {color:boardState[15],x:1,y:7};
	list[2] = {color:boardState[14],x:1,y:6};
	return list;
    }else if (x == 7 && y == 7){
	var list = new Array(3);
	list[0] = {color:boardState[62],x:7,y:6};
	list[1] = {color:boardState[55],x:6,y:7};
	list[2] = {color:boardState[54],x:6,y:6};
	return list;
    }else if (x == 7 && y == 0){
	var list = new Array(3);
	list[0] = {color:boardState[48],x:6,y:0};
	list[1] = {color:boardState[57],x:7,y:1};
	list[2] = {color:boardState[49],x:6,y:1};
	return list;
    }else{
	var list = new Array(8);
	list[0] = {color:boardState[x*8+(y-1)],x:x,y:(y-1)};
	list[1] = {color:boardState[x*8+(y+1)],x:x,y:(y+1)};
	list[2] = {color:boardState[(x-1)*8+(y-1)],x:(x-1),y:(y-1)};
	list[3] = {color:boardState[(x+1)*8+(y+1)],x:(x+1),y:(y+1)};
	list[4] = {color:boardState[(x-1)*8+(y)],x:(x-1),y:y};
	list[5] = {color:boardState[(x+1)*8+(y-1)],x:(x+1),y:(y-1)};
	list[6] = {color:boardState[(x-1)*8+(y+1)],x:(x-1),y:(y+1)};
	list[7] = {color:boardState[(x+1)*8+y],x:(x+1),y:y};
	return list;
    }
}



function checkFlippings(x,y){
    var list = getAdjacentTiles(x,y);    
    var k,m,newX,newY;
    var i;
    var flipped = 0;
    var counter;
    var allFlipList = [];
    var fl = 1; //Flag to see if a tile can be placed. 
    for (i=0;i < list.length; i++){
	flipList = [];
	counter = 0;	
	if (boardState[list[i].x*8+list[i].y] == flag || boardState[list[i].x*8+list[i].y] == "green"){
	    continue;	
	} 

	if ((list[i].x - x) == 0){
	    
	    k = 2 //This is for helping animateFlip to handle this corner case.
	    newY = list[i].y;
	    newX = list[i].x;
	    
	    while (boardState[newX*8+newY] != flag && boardState[newX*8+newY] != "green" && newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7){
		console.log(boardState[newX*8+newY]+", "+newX+","+newY);		
		flipList.push({x:newX,y:newY});
		
		if (list[i].y > y){
		    newY++;
		}else{
		    newY--;
		}
		counter++;
	    }
	}else{
	    
	    k = (list[i].y - y)/(list[i].x - x);
	    m = list[i].y-(list[i].x*k);

	    newY = list[i].y;
	    newX = list[i].x;
	    
	    while (boardState[newX*8+newY] != flag && boardState[newX*8+newY] != "green" && (newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7)){
		
		
		flipList.push({x:newX,y:newY})
		if (list[i].x > x){
		    newX++;
		}else{
		    newX--;
		}
		newY = newX*k + m; 
		counter++;
	    }
	}

	if (boardState[newX*8+newY] === "green" || newX < 0 || newX >7 || newY < 0 || newY >7) {
	    
	    flipList = [];
	} else {
	    if(fl == 1) {
		placetile(x,y);
		drawState();
		fl = 0;
	    }
	    for (var j = 0;j < flipList.length;j++){
		boardState[flipList[j].x*8+flipList[j].y] = flag;		
	    }
	    allFlipList.push(flipList);	    
	    flipList = [];
	    flipped++;
	}
	
    }
    
    /*for(var j= 0;j < allFlipList.length;j++) {

	console.log(j);
	console.log(allFlipList.length-1);
	if(j == allFlipList.length-1) {
	    
	    (function(k,list,step,temp,f){setTimeout(function(){animateFlip(k,list,step,temp,f)},delay)})(k,allFlipList[j],1,0,1);
	} else {
	    (function(k,list,step,temp,f){setTimeout(function(){animateFlip(k,list,step,temp,f)},delay)})(k,allFlipList[j],1,0,0);
	}
    } */
    
    if (flipped == 0) {
	return false;
    }	
    (function(k,list,step,temp,f){setTimeout(function(){animateFlip(k,list,step,temp,f)},delay)})(k,allFlipList,1,0,0);
    return true;
}


function animateFlip(k,list,step,i,j) {
    /*if (i == list.length && f == 0) {
	drawState();
	return;
    } else if (i == list.length && f == 1) {
	if (flag == "black") {	
	    flag = "white";
	} else {
	    flag = "black";
	}

	drawState();
	return;
	}*/
    var flist = list[j];
    
    var color1; 
    var color2;
    var canvas = document.getElementById('state');
    var ctx = canvas.getContext('2d');
    var y = (canvas.width/8)*flist[i].x+((canvas.width/8)/2);
    var x = (canvas.height/8)*flist[i].y+((canvas.height/8)/2);
    
    if (flag == "black") {
	color1 = "black";
	color2 = "white";
    } else {
	color1 = "white";
	color2 = "black";
    }

    
    //Should be possible to add more frames by adding steps
    if(step == 1) {
	if (k == 0) {
	    ctx.beginPath();
	    ctx.fillStyle = "rgb(0,102,0)";
	    ctx.arc(x,y,calcRadius()+1,0,2*Math.PI);
	    ctx.fill();
	    ctx.closePath();
	    ctx.fillStyle = color1;
	    ctx.fillRect(x-calcRadius(),y-(canvas.height/80),calcRadius()*2,(canvas.height/80));
	    ctx.fillStyle = color2;
	    ctx.fillRect(x-calcRadius(),y,calcRadius()*2,(canvas.height/80));
	    step = 2;
	    (function(k,list,step,temp,f){setTimeout(function(){animateFlip(k,list,step,temp,f)},delay)})(k,list,2,i,j);
	} else if(k == 1) {
	    ctx.beginPath();
	    ctx.fillStyle = "rgb(0,102,0)";
	    ctx.arc(x,y,calcRadius()+1,0,2*Math.PI);
	    ctx.fill();
	    ctx.closePath();
	    ctx.fillStyle = color1;
	    ctx.fillRect(x-calcRadius(),y-(canvas.height/80),calcRadius()*2,(canvas.height/80));
	    ctx.fillStyle = color2;
	    ctx.fillRect(x-calcRadius(),y,calcRadius()*2,(canvas.height/80));
	    step = 2;
	    (function(k,list,step,temp,f){setTimeout(function(){animateFlip(k,list,step,temp,f)},delay)})(k,list,2,i,j);
	} else if(k == -1) {
	    ctx.beginPath();
	    ctx.fillStyle = "rgb(0,102,0)";
	    ctx.arc(x,y,calcRadius()+1,0,2*Math.PI);
	    ctx.fill();
	    ctx.closePath();
	    ctx.fillStyle = color1;
	    ctx.fillRect(x-calcRadius(),y-(canvas.height/80),calcRadius()*2,(canvas.height/80));
	    ctx.fillStyle = color2;
	    ctx.fillRect(x-calcRadius(),y,calcRadius()*2,(canvas.height/80));
	    step = 2;
	    (function(k,list,step,temp,f){setTimeout(function(){animateFlip(k,list,step,temp,f)},delay)})(k,list,2,i,j);
	} else if(k == 2) { //Special case for horizontal lines
	    ctx.beginPath();
	    ctx.fillStyle = "rgb(0,102,0)";
	    ctx.arc(x,y,calcRadius()+1,0,2*Math.PI);
	    ctx.fill();
	    ctx.closePath();
	    ctx.fillStyle = color1;
	    ctx.fillRect(x,y-calcRadius(),(canvas.width/80),calcRadius()*2);
	    ctx.fillStyle = color2;
	    ctx.fillRect(x-(canvas.height/80),y-calcRadius(),(canvas.width/80),calcRadius()*2);
	    step = 2;
	    (function(k,list,step,temp,f){setTimeout(function(){animateFlip(k,list,step,temp,f)},delay)})(k,list,2,i,j);
	}
    } else if (step == 2) {
	ctx.beginPath();
	ctx.fillStyle = color1;
	ctx.arc(x,y,calcRadius(),0,2*Math.PI);
	ctx.fill();
	ctx.closePath();
	i = i + 1;
	if(i == list[j].length) {
	    j = j + 1;
	    if (j == list.length) {

		if (flag == "black") {	
		    flag = "white";
		} else {
		    flag = "black";
		}
		
		drawState();
		return;
	    }
	    i = 0;
	}
	
	(function(k,list,step,temp,f){setTimeout(function(){animateFlip(k,list,step,temp,f)},delay)})(k,list,1,i,j);		
    }
}
    
function checkAround(x,y){
    
    if (x == 0 && y == 0){
	if (boardState[x*8+(y+1)] == "green" && boardState[(x+1)*8+y] == "green" &&	boardState[(x+1)*8+(y+1)] == "green") {
	    return false;
	}else{
	    return true;
	}
    }else if (x == 7 && y == 0){
	if(boardState[x*8+(y+1)] == "green" && boardState[(x-1)*8+y] == "green" && boardState[(x-1)*8+(y+1)] == "green") {
	    return false;
	}else{
	    return true;
	}
    }else if (x == 7 && y == 7){
	if(boardState[x*8+(y-1)] == "green" && boardState[(x-1)*8+y] == "green" && boardState[(x-1)*8+(y-1)] == "green") {
	    return false;
	}else{
	    return true;
	}
    }else if (x == 0 && y == 7){
	if(boardState[x*8+(y-1)] == "green" && boardState[(x+1)*8+y] == "green" && boardState[(x+1)*8+(y-1)] == "green") {
	    return false;
	}else{
	    return true;
	}
    }else if (y == 0){
	if(boardState[(x-1)*8+y] == "green" && boardState[(x+1)*8+y] == "green" && boardState[(x+1)*8+(y+1)] == "green" && boardState[(x-1)*8+(y+1)] == "green" && boardState[x*8+(y+1)] == "green"){
	    return false;
	}else{
	    return true;
	}
    }else if (y == 7){
	if(boardState[(x-1)*8+y] == "green" && boardState[(x+1)*8+y] == "green" && boardState[(x+1)*8+(y-1)] == "green" && boardState[(x-1)*8+(y-1)] == "green" && boardState[x*8+(y-1)] == "green"){
	    return false;
	}else{
	    return true;
	}
    }else if (x == 0){
	if(boardState[x*8+(y-1)] == "green" && boardState[x*8+(y+1)] == "green" && boardState[(x+1)*8+(y+1)] == "green" && boardState[(x+1)*8+(y-1)] == "green" && boardState[(x+1)*8+y] == "green"){
	    return false;
	}else{
	    return true;
	}
    }else if (x == 7){
	if(boardState[x*8+(y-1)] == "green" && boardState[x*8+(y+1)] == "green" && boardState[(x-1)*8+(y+1)] == "green" && boardState[(x-1)*8+(y-1)] == "green" && boardState[(x-1)*8+y] == "green"){
	    return false;
	}else{
	    return true;
	}
    }else if (boardState[(x-1)*8+(y-1)] == "green" && boardState[(x-1)*8+y] == "green" && boardState[(x-1)*8+(y+1)] == "green" && boardState[x*8+(y-1)] == "green" && boardState[x*8+(y+1)] == "green" &&
	      boardState[(x+1)*8+y] == "green" && boardState[(x+1)*8+(y-1)] == "green" && boardState[(x+1)*8+(y+1)] == "green"){
	return false;
    }else{
	return true;
    }
}

function checkValidity(){
    var canvas = document.getElementById('state');
    var xoff = event.offsetX;
    var yoff = event.offsetY;
    var x;
    var y;
    
    for (var i = 0; i < 8;i++){
	if (xoff > (canvas.width/8)*i && xoff < (canvas.width/8)*(i+1)){
	    y = i;
	    break;
	}
    }
    
    for (var i = 0; i < 8;i++){
	if (yoff > (canvas.width/8)*i && yoff < (canvas.width/8)*(i+1)){
	    x= i;
	    break;
	}
    }
    
    if (x < 0 || y < 0 || x > 7 || y > 7){
		if (tutorialMode == 1)
			alert("tile placement out of bounds");
	return;
    }else if (boardState[x*8+y] != "green"){
		if (tutorialMode == 1)
			alert("There's already a tile on that position");
		return;
    }else if (checkAround(x,y) == false){
		if (tutorialMode == 1)
			alert("You need to place the tile adjacent to another tile");
		return;
		
    }else if (checkFlippings(x,y) == false) {
		if (tutorialMode == 1)
			alert("You must place the tile in a place such that you \"outflank\" your opponent's tiles");
	return;
    }	
    
/*
    if (flag == "black"){	
	flag = "white";
    }else {
	flag = "black";
    }*/    
    //updateScore();
}

function calcRadius(){
    var canvas = document.getElementById('state');
    var w = ((canvas.width/8)-10)/2;
    return w;
}


//Draws the boardState
function drawState(){
    var canvas = document.getElementById('state');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    for (var i = 0;i < 8;i++){
	for (var j = 0;j < 8;j++){
	    if (boardState[i*8+j] !== "green"){
		ctx.beginPath();
		y = (canvas.width/8)* i +((canvas.width/8)/2);
		x = (canvas.height/8)*j+((canvas.height/8)/2);
		
		if (boardState[i*8+j] == "black"){
		    ctx.fillStyle = "black";
		}else if (boardState[i*8+j] == "white"){
		    ctx.fillStyle= "white";
		}
		
		ctx.arc(x,y,calcRadius(),0,2*Math.PI);
		ctx.fill();
		ctx.closePath();
	    }	   
	}	
    }

	
	
    updateScore();
}

function mute() {
	if (tile_sound.muted == true) {
		tile_sound.muted = false;
		i18n.init({ resStore: resources, lng: language }, function(t) {
			document.getElementById("mute_button").innerHTML = t("mute");
		});		
	}
	else {
		tile_sound.muted = true;
		i18n.init({ resStore: resources, lng: language }, function(t) {
			document.getElementById("mute_button").innerHTML = t("unmute");
		});	
	}
}

//sound init
var tile_sound = new Audio("sound/tile_placed.mp3");
tile_sound.volume = .4;
tile_sound.load();

//Tutorial
//initializing vars
var closePopup = document.getElementById("popup-close");
var overlay = document.getElementById("overlay");
var popup = document.getElementById("popup");
var tutorialButton = document.getElementById("tutorial_button");

//close popup event
closePopup.onclick = function() {
	overlay.className = '';
	popup.className = '';
	tutorialMode = 0;
	tutorialStart();
	//tutorialStep = 1;
	i18n.init({ resStore: resources, lng: language }, function(t) {
		document.getElementById("tutorial-next").innerHTML = t("next");
	});
};

//show overlay and popup;
tutorialButton.onclick = function() {
	tutorialMode = 1;
	tutorialStart();
	popup.className = 'show';
	
}

var tutorialStep = 1;

function tutorialNext() {
	tutorialStep++;
	var tutorialContent = document.getElementById("tutorial-content");
	tutorialContent.innerHTML = fetchTutorialContent(tutorialStep);

}

function tutorialPrev() {
	tutorialStep--;
	if (tutorialStep < 1) {
		tutorialStart();
		overlay.className = '';
		popup.className = '';
	}
	var tutorialContent = document.getElementById("tutorial-content");
	tutorialContent.innerHTML = fetchTutorialContent(tutorialStep);
	i18n.init({ resStore: resources, lng: language }, function(t) {
		document.getElementById("tutorial-next").innerHTML = t("next");
	});
}

function tutorialStart() {
	tutorialStep = 1;
	document.getElementById("tutorial-content").innerHTML = fetchTutorialContent(1);
	i18n.init({ resStore: resources, lng: language }, function(t) {
		document.getElementById("tutorial-next").innerHTML = t("next");
	});
	document.getElementById("tutorial-next").setAttribute("onClick", "tutorialNext()");
}

function tutorialEnd() {
	popup.className = '';
	tutorialStart();
}


function fetchTutorialContent(step) {
	switch (step) {
		
	case 1:
		i18n.init({ resStore: resources, lng: language }, function(t) {
			string1 = t("step");
			string2 = t("tut1");
			string3 = t("caution");
		});
			
		return "<h3>" + string1 + tutorialStep + "</h3><br><p>" + string2 + "</p> <p id='small'>" + string3 + "</p>";		
		break;
	case 2:
		draw();
		i18n.init({ resStore: resources, lng: language }, function(t) {
			string1 = t("step");
			string2 = t("tut2");			
		});
		
		return "<h3>" + string1 + tutorialStep + "</h3><p>" + string2 + "</p>"; 
		break;
	case 3:
		var tryButton = document.getElementById("tutorial-next");
		i18n.init({ resStore: resources, lng: language }, function(t) {
			tryButton.innerHTML = t("try");
			string1 = t("step");
			string2 = t("tut3");
		});
		tryButton.setAttribute("onClick", "hideTutorial()");
		
		return "<h3>" + string1 + tutorialStep + "</h3><br><p>" + string2 + "</p>"; 
		break;
	case 4:
		i18n.init({ resStore: resources, lng: language }, function(t) {			
			string1 = t("step");
			string2 = t("tut4");
		});
		
		return "<h3>" + string1 + tutorialStep + "</h3><br><p>" + string2 + "</p>"; 
		break;
	case 5:
		tutorialMode = 0;
		i18n.init({ resStore: resources, lng: language }, function(t) {
			document.getElementById("tutorial-next").innerHTML = t("finish");
			string1 = t("step");
			string2 = t("tut5");
			string3 = t("tut6");
		});
		tutorialStep = 1;
		//		document.getElementById("tutorial-next").setAttribute("onClick", "tutorialEnd()");
		return "<h3>" + string1 + "4</h3><br><p>" + string2 + "</p><p>" + string3 + "</p>"; 
	default:
		console.log("no step match");
	}
}

function hideTutorial () {
		overlay.className = '';
		popup.className = '';
}
