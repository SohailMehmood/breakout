var cv = document.getElementById("canvas");
var ctx = cv.getContext("2d");

canvas.width = 640;
canvas.height = 480;

var paddle = 
{
	x: (canvas.width / 2) - 60,
	y: 450,
	width: 120,
	height: 30,
	speed: 200,
	colour: "gold"
};

function brick(x,y,width,height,colour)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.colour = colour;
};

var brickArray = [];

for(var i=0;i<8;i++)
{
	brickArray.push(new brick(i*80,40,80,20,"green"));
};

for(var j=0;j<8;j++)
{
	brickArray.push(new brick(j*80,60,80,20,"#D88888"));
};

var boundBox = 
{
	x: 250,
	y: 250,
	width: 30,
	height: 30,
	dx: 1,
	dy: 2,
	colour: "#000000"
};

var score = brickArray.length;

var lives = 3;

function update(secs)
{
	if(37 in keysDown)
	{
		paddle.x -= paddle.speed * secs;
		if(paddle.x <= 0)
		{
			paddle.x = 0
		}
	}

	if(39 in keysDown)
	{
		paddle.x += paddle.speed * secs;
		if(paddle.x >= (canvas.width - paddle.width))
		{
			paddle.x = (canvas.width - paddle.width)
		}
	}
	
	for(var i = 0;i<brickArray.length;i++)
	{
		if ((boundBox.x > brickArray[i].x) && ((boundBox.x + boundBox.width) < (brickArray[i].x + brickArray[i].width)) && (boundBox.y < (brickArray[i].y + brickArray[i].height)))
		{
			brickArray.splice(i,1);
			score = score - 1;
			boundBox.dy = - boundBox.dy;
		};
	};	
		
	for(var i = 0;i<brickArray.length;i++)
	{
		if ((boundBox.y > brickArray[i].y) && ((boundBox.y + boundBox.height) < (brickArray[i].y + brickArray[i].height)) && (boundBox.x < (brickArray[i].x + brickArray[i].width)))
		{
			brickArray.splice(i,1);
			score = score - 1;
			boundBox.dx = - boundBox.dx;			
		};
	};	
		
	/*if (score <= 8)
	{
		boundBox.dx = 1.5;
		boundBox.dy = 3;
	}*/
		
	if (boundBox.x + boundBox.dx >= 610 || boundBox.x + boundBox.dx <= 0)
	{
		boundBox.dx = -boundBox.dx;
	}
	
	if (boundBox.y + boundBox.dy <= 0)
	{
		boundBox.dy = - boundBox.dy;
	}
	
	if(boundBox.y + boundBox.dy >= 430)
	{
		if(boundBox.x >= paddle.x && boundBox.x <= paddle.x + paddle.width)
		{
			boundBox.dy = -boundBox.dy;
		}
	
		if (boundBox.y > 480 && lives != 0)
		{
			lives = lives - 1;
			boundBox.x = 250;
			boundBox.y = 150;
			paddle.x = (canvas.width/2) - 60;
		}
	}
}

function render()
{
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.font = "20px Georgia";
	ctx.fillStyle = "red";
	ctx.fillText("Bricks Remaining: " + score, 0, 30, canvas.width/4);
	ctx.font = "20px Georgia";
	ctx.fillStyle = "red";
	ctx.fillText("Lives Remaining: " + lives, 460, 30, canvas.width/4);
	
	for(var i = 0;i<brickArray.length;i++)
	{
		ctx.fillStyle = brickArray[i].colour;
		ctx.fillRect(
		brickArray[i].x,
		brickArray[i].y,
		brickArray[i].width,
		brickArray[i].height);		
	};
	
	ctx.fillStyle = boundBox.colour;
	ctx.fillRect(boundBox.x, boundBox.y, boundBox.width,boundBox.height);
	ctx.beginPath();
    ctx.arc(boundBox.x + (boundBox.width/2), boundBox.y + (boundBox.height/2), boundBox.height/2, 0, 2 * Math.PI, false);
	ctx.stroke();
	ctx.fillStyle = '#8ED6FF';
    ctx.fill();
	
	boundBox.x += boundBox.dx;
	boundBox.y += boundBox.dy;
	ctx.fillStyle = paddle.colour;
	ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
	
	if (boundBox.y > 480 && lives == 0) 
	{
		boundBox.dx = 0;
		boundBox.dy = 0;
		ctx.font = "50px Georgia";
		ctx.fillStyle = "red";
		ctx.fillText("Game Over!!", canvas.width/4, canvas.height/2, canvas.width);
	}
	
	if (score == 0)
	{
		boundBox.dx = 0;
		boundBox.dy = 0;
		ctx.font = "50px Georgia";
		ctx.fillStyle = "red";
		ctx.fillText("You Win!!", canvas.width/4, canvas.height/2, canvas.width);
	}
}

function run()
{
	update((Date.now() - time)/1000);
	render();
	time = Date.now();
}

var time= Date.now();
setInterval(run,10);

var keysDown = {};
 
window.addEventListener("keydown",function(e)
{
	keysDown[e.keyCode] = true;
}
);

window.addEventListener("keyup",function(e)
{
	delete keysDown[e.keyCode];
}
);