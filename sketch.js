var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var sun, sunImage;
var backgroundImage;
var gameOverImage,restartImage;
var jumpSound, dieSound;
var score = 0;
var gameState = "play";

function preload(){
  trex_running = loadAnimation("sprites/trex_1.png","sprites/trex_2.png","sprites/trex_3.png");  
  trex_collided = loadAnimation("sprites/trex_collided.png");
  groundImage = loadImage("sprites/ground.png");
  cloudImage = loadImage("sprites/cloud.png");
  obstacle1 = loadImage("sprites/obstacle1.png");
  obstacle2 = loadImage("sprites/obstacle2.png");
  obstacle3 = loadImage("sprites/obstacle3.png");
  obstacle4 = loadImage("sprites/obstacle4.png");
  restartImage = loadImage("sprites/restart.png");
  gameOverImage = loadImage("sprites/gameOver.png");
  sunImage = loadImage("sprites/sun.png");
  backgroundImage = loadImage("sprites/backgroundImg.png");
  jumpSound = loadSound("sounds/jump.wav");
  dieSound = loadSound("sounds/collided.wav");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  ground = createSprite(width/2,height,width/2,2);
  ground.addImage("ground",groundImage);
  ground.scale = 1.2;
  ground.x = ground.width/2;
  
  trex = createSprite(800,height-50,20,20);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.scale = 0.08;
  
  invisibleGround = createSprite(width/2,height-20,width+350,125);
  invisibleGround.visible = false;

  gameOver = createSprite(width/2+200,height/2-100);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  
  restart = createSprite(width/2+200,height/2-50);
  restart.addImage(restartImage);
  restart.scale = 0.1;
    
  sun = createSprite(windowWidth-1050,70,20,20);
  sun.addImage(sunImage);
  sun.scale = 0.2;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  score = 0;
}

function draw() {
  background(backgroundImage);

  camera.position.x = trex.x;
  camera.position.y = trex.y/1.7;


  if (gameState === "play"){
    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -(7+3*score/300);
    
    score = score+Math.round(getFrameRate()/43);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if (keyDown("space") && trex.y >= height-115){
      trex.velocityY = -13;
      jumpSound.play();
    }
    
    trex.velocityY = trex.velocityY + 0.8;
  
    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)){
      jumpSound.play();
      gameState = "end";
      dieSound.play();
    }
  }

  if (gameState === "end"){
    gameOver.visible = true;
    restart.visible = true;

    trex.changeAnimation("collided",trex_collided);
     
    ground.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
        
    if (mousePressedOver(restart)){
      reset();
    }
  }
      
  trex.collide(invisibleGround);

  drawSprites();
  
  textSize(21);
  stroke("blue");
  text("Score: "+ score,windowWidth+30,height/20);
}

function reset(){
  gameState = "play";
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  score = 0;
}

function spawnObstacles(){
  if (frameCount % 80 === 0){
   var obstacle = createSprite(width+200,height-105,20,30);
   obstacle.velocityX = -(7+2*score/300);
   obstacle.scale = 0.2;
   obstacle.lifetime = 300;
   obstacle.setCollider("circle",0,0,20);
   
    var rand = Math.round(random(1,4));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds(){
  if (frameCount % 100 === 0) {
    var cloud = createSprite(width+200,height-200,20,30);
    cloud.y = Math.round(random(100,300));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.lifetime = 470;
    cloudsGroup.add(cloud);
  }
}