//Represents a 2d array where each position is either green (symbolizing no piece there), black or white. 
var boardState = new Array(64);

//temporary flag for decided whos turn it is
var flag = 0;

//Initializing draw function, draws the board and saves the first four pieces in the boardstate and draws the original state
function draw(){
    var canvas = document.getElementById('board');
    if (canvas.getContext){
        var ctx = canvas.getContext('2d');
	ctx.fillStyle = "rgb(0,102,0)";
	ctx.fillRect(0,0,canvas.width,canvas.height);	
	var xSep =canvas.width/8;
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
	for(var i=0;i<64;i++) {
	    boardState[i]="green";
	}
	
	for(var n =0;n<4;n++) {
	    boardState[3*8+3] = "white";
	    boardState[4*8+4] = "white";
	    boardState[4*8+3] = "black";
	    boardState[3*8+4] = "black";
	}
	drawState();
	var canvas2 = document.getElementById('state');
	canvas2.addEventListener('click',placetile,false);
    }
}


//Calculates in which square the user clicked and places a tile in the correct index in boardstate.
function placetile() {
    var canvas = document.getElementById('state');
    var color = "";
    if(flag == 0) {
	color = "black";
	flag = 1;
    } else {
	color = "white";
	flag = 0;
    }
    var x = event.offsetX;
    var y = event.offsetY;
    for(var i = 0; i < 8;i++) {
	if(x> (canvas.width/8)*i && x<(canvas.width/8)*(i+1)) {
	    x = i;
	    break;
	}
    }
    for(var i = 0; i < 8;i++) {
	if(y>(canvas.width/8)*i && y<(canvas.width/8)*(i+1)) {
	    y = i;
	    break;
	}
    }
    console.log(x+","+y)
    boardState[x*8+y] = color;
    
    drawState();
    
}

function calcRadius(){
    var canvas = document.getElementById('state');
    var w = ((canvas.width/8)-10)/2;
    return w;
}


//Draws the boardState
function drawState() {
    var canvas = document.getElementById('state');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for(var i = 0;i < 8;i++) {
	for(var j = 0;j < 8;j++){
	    console.log(boardState[i*8+j]+"("+i+","+j+")");
	    if(boardState[i*8+j] !== "green") {
		ctx.beginPath();
		x = (canvas.width/8)*i +((canvas.width/8)/2);
		y = (canvas.height/8)*j+((canvas.height/8)/2);
		if(boardState[i*8+j] == "black") {
		    ctx.fillStyle = "black";
		} else if (boardState[i*8+j] == "white"){
		    ctx.fillStyle= "white";
		}	
		ctx.arc(x,y,calcRadius(),0,2*Math.PI);
		ctx.fill();
		ctx.closePath();
	    }	   
	}	
    }
}

function drawBlack(x,y) {
    var canvas = document.getElementById('state');
    var ctx = canvas.getContext('2d');
    x = ((canvas.width/8))*x-((canvas.width/8)/2);
    y = ((canvas.height/8))*y-((canvas.height/8)/2);
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x,y,calcRadius(),0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
}

function drawWhite(x,y) {
    var canvas = document.getElementById('state');
    if (canvas.getContext){
	var ctx = canvas.getContext('2d');
	x = ((canvas.width/8))*x-((canvas.width/8)/2);
	y = ((canvas.height/8))*y-((canvas.height/8)/2);
	ctx.fillStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.arc(x,y,calcRadius(),0,2*Math.PI);
	ctx.fill();
	ctx.closePath();
    }
}

