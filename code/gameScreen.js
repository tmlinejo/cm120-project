function Zoox(x, y, speed, radius)
{
  this.x = x;
  this.y = y;
  this.r = radius;
  this.s = SPEED;
  this.energy = PLAYERSTARTENERGY;
  this.getSpeed = function()
  {
    return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
  }
  this.update = function()
  {
  if(alive) // player movement
  {
    if(reefEnergy < 0)
      reefEnergy = 0;
    else if (reefEnergy > MAXREEFENERGY)
      reefEnergy = MAXREEFENERGY;
    
    if(player.energy <= 0 ) // player energy
    {
      player.energy = 0;
	  /* if(player.s = FASTSPEED){
		//Play slow down sound      SLOW DOWN SOUND GOES HERE, SLOW DOWN SOUND GOES HERE, SLOW DOWN SOUND GOES HERE
	  }
	  */
      player.s = SLOWSPEED;
    }
    else
    {
      player.energy += PLAYERENERGYRATE;
       if (player.energy > MAXPLAYERENERGY)
        player.energy = MAXPLAYERENERGY;
      player.s = SPEED;//SPEED
    }

    if (inSilt == true) {
      player.s = REALLYSLOWSPEED;
        if(fadeBWPlayer < 1){
          fadeBWPlayer += .01; //Drawing faded sprite over player sprite
        }else if (fadeBWPlayer > 1){
          state = 7;
        }
      //console.log("player.s: " + player.s)
    }//end if
    else if (inSilt == false){
      if(fadeBWPlayer > 0 && fadeBWPlayer < 1){
        fadeBWPlayer -= .01; //removing faded sprite over player sprite
      }
      if(fadeBWPlayer < 0){
        fadeBWPlayer = 0;
      }
      //player.s = SPEED;
    }
    if(up) // player movement
      player.y -= player.s;
    if(left)
      player.x -= player.s;
    if(right)
      player.x += player.s;
    if(down)
      player.y += player.s;
    
    if(player.y > lowerBoundary){ // stay on the reef
      player.y = lowerBoundary
    }
    if(player.y < upperBoundary){
      player.y = upperBoundary;
    }
    if(player.x > rightBoundary){
      player.x = rightBoundary;
    }
    if(player.x < leftBoundary){
      player.x = leftBoundary;
    }
  }
    this.checkCollision(collisionObjects);
  }
  this.draw = function ()
  {
    context.drawImage(zooxBody, this.x-32, this.y-32, zooxBody.width, zooxBody.height);
    context.globalAlpha = fadeBWPlayer;
    context.drawImage(zooxBodyBW, this.x-32, this.y-32, zooxBody.width, zooxBody.height);
    context.globalAlpha = 1;
    context.drawImage(zooxEyes, 0, 0, 64, zooxEyes.height, this.x-32, this.y-32, 64, zooxEyes.height);
    if(right)context.drawImage(zooxEyes, 64, 0, 64, zooxEyes.height, this.x-32, this.y-32, 64, zooxEyes.height);
    else if(left)context.drawImage(zooxEyes, 128, 0, 64, zooxEyes.height, this.x-32, this.y-32, 64, zooxEyes.height);
    else if(up)context.drawImage(zooxEyes, 192, 0, 64, zooxEyes.height, this.x-32, this.y-32, 64, zooxEyes.height);
    else if(down) context.drawImage(zooxEyes, 256, 0, 64, zooxEyes.height, this.x-32, this.y-32, 64, zooxEyes.height);
    else context.drawImage(zooxEyes, 0, 0, 64, zooxEyes.height, this.x-32, this.y-32, 64, zooxEyes.height);
  }
  this.checkCollision = function(stuff)
  {
    for(var i=0; i<stuff.length; i++)
    {
      if(this.r + stuff[i].r >= Math.sqrt(Math.pow(this.x - stuff[i].x, 2) + Math.pow(this.y - stuff[i].y, 2)) && this != stuff[i])//>=
      {
        stuff[i].collide();
      }
    }
  }
} // Zoox constructor

function nutrientParticle(x,y)
{
  this.x = x;
  this.y = y;
  this.r = Math.random()*2 + 4;
  this.draw = function()
  {
    context.drawImage(zooxFood, this.x-(this.r+3), this.y-(this.r+3), 3*this.r, 3*this.r);
  }
  this.collide = function()
  {
    player.energy += NUTRIENTVALUE;
    foodSound.play();
    this.reset();
  }
  this.reset = function()
  {
    this.x = Math.random()*(canvas.width-leftBoundary) + leftBoundary;
    this.y  = Math.random()*(canvas.height - upperBoundary) + upperBoundary;
    this.r = Math.random()*1.5 + 2;
  }
} // nutrient particle

function sunlightParticle(x,y)
{
  this.x = x;
  this.y = y;
  this.s = SUNLIGHTSPEED;
  this.r = 7;
  this.draw = function()
  {
    context.drawImage(sunlight, this.x-16, this.y-16, 32,32);
  } // sunlight draw

  this.collide = function()
  {
    reefEnergy += SUNLIGHTVALUE;
    sunSound.play();
    this.reset();
  } // sunlight player collision
  this.update = function()
  {
    this.y += this.s;
    if(this.y > canvas.height + this.r)
      this.reset();
  } // sunlight update
  this.reset = function()
  {
    this.x = Math.random()*canvas.width;
    this.y  = 0;
  } // sunlight reset
} // sunlight particle

function Silt(x, y, radius, speed, accel, angle, color, type)//(x, y, radius, lifetime, color, type) 
{ //creating Particle object, lifetime: how long on screen
  this.x = x;
  this.y = y;
  this.r = radius;
  this.speed = SILTSPEED;
  this.accel = accel;
  this.color = color;
  this.type = type; //0 = circle, 1 = triangle

  var angleInRadians = angle * Math.PI / 180;
  this.velocity = Math.random()*4 * Math.cos(angleInRadians);

  this.draw = function()
  {
  	if(this.type == 0 || this.type == 2) // falling circle
    {
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, this.r, Math.PI * 2, false);
      context.stroke();
      context.fill();
    }
    else if(this.type == 1) // stationary triangle (pile)
    {
      context.fillStyle = this.color;
      context.beginPath();
      context.moveTo(this.x, this.y-this.r);
      context.lineTo(this.x + Math.sqrt(3) * this.r, canvas.height);
      context.lineTo(this.x - Math.sqrt(3) * this.r, canvas.height);
      context.fill()
    }
  } // draw

  this.reset = function()
  {
    this.y = 0;
    this.lifetime = canvas.height;
    this.x = Math.random() * canvas.width;
  } // reset

  this.update = function()
  {
    //Types and piling initialization
    if (this.y < canvas.height)
    {
      this.speed = this.speed + this.accel;
      this.x = this.x - this.velocity - this.accel;
      this.y = this.y + this.speed;
    }
    if (this.y > canvas.height && this.type != 2)
    {
      this.y = canvas.height;
      if(this.type != 3)
        this.type = 1; // becomes a triangle at the bottom unless it is already set to be destroyed
    } //end if
    else if (this.y > canvas.height && this.type == 2)
    {
      //resets the projectile as a regular silt particle
      this.type = 3; // self destruct
    } //end else if

  } //end update
  
  this.collide = function()
  {
    //Slows player speed:
    if (this.type == 1) {
      inSilt = true;
    }
    else {
      inSilt = false;
    }
  } // player collision

  inSilt = false;
    
  this.siltPiling = function(obj)
  {
    for (var i = 0; i < obj.length; i++)
    {
    
      //Case: white particle on pile:
      if (this.type == 1 &&  obj[i].type != 1 && this.r + obj[i].r >= Math.sqrt(Math.pow(this.x - obj[i].x, 2) + Math.pow(this.y - obj[i].y, 2)) && this != obj[i])
      {
        var index = obj.indexOf(obj[i]);
        obj.splice(index, 1);//removes particle that fell
        this.type = 1;//changes the type to a triangle
        this.r = Math.sqrt(Math.pow(this.r + 3, 2)); // adds volume to pile
      }//end if
          
      //Case: red particle on pile:   
      else if (this.type == 2 &&  obj[i].type != 2 && obj[i].type != 0 && this.r + obj[i].r >= Math.sqrt(Math.pow(this.x - obj[i].x, 2) + Math.pow(this.y - obj[i].y, 2)) && this != obj[i])
      {
        var index = obj.indexOf(obj[i]);
        obj.splice(index, 1); //removes pile
      }//end else
    } //end for
  } //end siltPiling
    
} // silt particle constructor


function nutrientSystem(n)
{
  for(var i=0; i<n; i++)
  {
    var temp = new nutrientParticle(Math.random()*(canvas.width-leftBoundary) + leftBoundary, Math.random()*(canvas.height - upperBoundary) + upperBoundary);
    drawObjects.push(temp);
    collisionObjects.push(temp);
  }
} // nutrientSystem

function sunlightSystem(n)
{
  for(var i=0; i<n; i++)
  {
    var temp = new sunlightParticle(Math.random()*canvas.width, Math.random()*canvas.height);
    drawObjects.push(temp);
    updateObjects.push(temp);
    collisionObjects.push(temp);
  }
} // sunlightSystem

function resetGame()
{
  updateObjects = new Array();
  drawObjects = new Array();
  collisionObjects = new Array();
  player = new Zoox(canvas.width/2, canvas.height/2, 0, 30);
  coralReset();
  updateObjects.push(player);
  drawObjects.push(player);
  //collisionObjects.push(player);
  nutrientSystem(15);
  sunlightSystem(30);
  score = 0;
  reefEnergy = REEFSTARTENERGY;
  alive = true;
  sprayLeft = true;
  sprayCount = 0;
} // reset game

function handleKeyDown(e)
{
  switch(e.keyCode)
  {
    case 87: // up
    case 38:
    case 73:
      up = true;
      break;
    case 74: // left turn
    case 37:
    case 65:
      left = true;
      break;
    case 39: // right turn
    case 68:
    case 76:
      right = true;
      break;
    case 83: // down
    case 75:
    case 40:
      down = true;
      break;
    case 13:
    case 32:
      if(!alive)
        resetGame();
      break;
  }
} // handleKeyDown
function handleKeyUp(e)
{
  switch(e.keyCode)
  {
    case 87: // up
    case 38:
    case 73:
      up = false;
      break;
    case 74: // left turn
    case 37:
    case 65:
      left = false;
      break;
    case 39: // right turn
    case 68:
    case 76:
      right = false;
      break;
    case 83: // down
    case 75:
    case 40:
      down = false;
      break;
  }
} // handleKeyUp

function updateGame()
{
	changeGameState();
  //updateCoral();
  sprayCount++;

  if (sprayCount%500 == 0) {
    sprayCount = 0;
    sprayLeft = !sprayLeft;
  }
  
  if(alive && state ==2)
  {
	updateCoral();
    if(Math.random() < SILTRATE)
    {
      var temp;
      if (!sprayLeft) {
        temp = new Silt(canvas.width, range(50,100), 5, .3 + Math.random()*1.7, range(0.01, 0.05), range(-90, 0), 'black', 0);
      }
      else {
         temp = new Silt(0, range(50,100), 5, Math.random()*2, range(0.01, 0.1), range(90, 180), 'black', 0);
      }
      updateObjects.push(temp);
      drawObjects.push(temp);
      collisionObjects.push(temp);
      siltParticles.push(temp);
    }


    if(coralGrowthResource <= 0){
      alive = false;
      win = false;
    } else if(coralGrowthResource >= coralResourceMax){
          alive = false;
          win = true;
    }

    leftBoundary = canvas.width-(coralGrowthResource/coralResourceMax)*canvas.width;

    growthCounter++;
    if(growthCounter % GROWTHTIMER === 0){
      if (reefEnergy < 0){
        reefEnergy = 0;
      } else if(reefEnergy > 0) {
        coralResource += sunlightResource;
        reefEnergy -= 1;
      }
    }

    if (coralResource > 0 && reefEnergy == 0){
      coralResource = coralResource - decaySpeed;
    }
    

    for(var i=0; i<updateObjects.length; i++)
    {
      updateObjects[i].update();
    }
    for (var i = 0; i < siltParticles.length; i++)
    {
      if(siltParticles[i].type == 3)
      {
        //console.log(collisionObjects.indexOf(siltParticles[i]));
        siltParticles.splice(i, 1); // destroys particle
      }
      else
        siltParticles[i].siltPiling(siltParticles);
    } // silt collision
  }
}

function drawGame(){
	drawWave();
  drawCoral();
  
  for(var i=drawObjects.length-1; i>=0; i--)
  {
    drawObjects[i].draw();
  }
  context.fillStyle = "#000000";
  context.font = "20px Verdana";
  //context.fillText("Player energy: " + Math.floor(player.energy), 10, 30);
  //context.fillText("Reef energy: " + Math.floor(reefEnergy), 10, 60);

//music mute
  if(!gameMusic.muted) context.drawImage(soundIcons, 0, 0, 100, 60, 10, 10, 50, 30);
  else context.drawImage(soundIcons, 100, 0, 100, 60, 10, 10, 50, 30);
  
  //SFX mute
  if(!foodSound.muted && !sunSound.muted) context.drawImage(soundIcons, 200, 0, 100, 60, 80, 10, 50, 30);
  else context.drawImage(soundIcons, 300, 0, 100, 60, 80, 10, 50, 30);

//mute sound detect
  if(mouseX < 60 && mouseX > 10 && mouseY < 40 && mouseY > 10) overTitleMute = true;
  else overTitleMute = false;

//mute SFX detect
  if(mouseX < 130 && mouseX > 80 && mouseY < 40 && mouseY > 10) overMuteSFX = true;
  else overMuteSFX = false;
}

function drawPause(){
  drawGame();
  context.fillStyle = 'rgba(255,255,255,0.5)';
  context.fillRect(0,0,canvas.width, canvas.height);
	context.font = "32px Verdana";
	context.fillStyle = 'black';
	context.fillText("PAUSE", canvas.width/2, canvas.height/2);
}

function changeGameState(){
	if(paused) state = 5;
	else state = 2;

	if(win && !alive){
		state = 6;
		gameMusic.pause();
	}else if(!win && !alive){
		state = 7;
		gameMusic.pause();
	}
}
