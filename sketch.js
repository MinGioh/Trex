//variáveis globais
var trex, trex_running, edges, trexp, trexgo;
var groundImage, ground;
var invisibleGround;
var nuvens,nuvemImg,gnuvens;
var cacto,c1,c2,c3,c4,c5,c6,gcacto;
var pontos = 0;
var START = 1,PLAY = 2,END = 0;
var gameState = START;
var gameOver, gameO;
var rst, restart; 
var cP, died, pular;

function preload()
{
  trexgo = loadAnimation("trex_collided.png");
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexp = loadAnimation("trex1.png");
  groundImage = loadImage("ground2.png");
  nuvemImg = loadImage("Nuvem.png");
  c1 = loadImage("obstacle1.png");
  c2 = loadImage("obstacle2.png");
  c3 = loadImage("obstacle3.png");
  c4 = loadImage("obstacle4.png");
  c5 = loadImage("obstacle5.png");
  c6 = loadImage("obstacle6.png");
  gameO = loadImage("gameOver.png");
  restart = loadImage("restart.png");
  cP = loadSound("checkPoint.mp3");
  died = loadSound("die.mp3");
  pular = loadSound("jump.mp3");
}

function setup(){
  createCanvas(600,200);

  //variável local
  var teste = 1;
  
  //criando o trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("parado", trexp);
  trex.addAnimation("bateu", trexgo);
  trex.setCollider("circle",0,0,40);
  trex.debug = false;  
  edges = createEdgeSprites();

  //gameOver e restart
  gameOver = createSprite(300,80);
  gameOver.addImage(gameO);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  rst = createSprite(300,100);
  rst.addImage(restart);
  rst.scale = 0.5;
  rst.visible = false;

  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50;

  //criar sprite do solo
  ground = createSprite(300,180,600,20);
  ground.addImage(groundImage);

  //criar solo invisivel
 invisibleGround = createSprite(40,190,30,20);
 invisibleGround.visible = false;

  //criação dos grupos
  gnuvens = new Group();
  gcacto = new Group();
}


function draw()
{
  //definir a cor do plano de fundo 
  background("white");

  text("Pontuação: " + pontos,500,35);
  //(+) => concatenação = união
  
  //registrando a posição y do trex
  //console.log(trex.y)
  if(gameState === START)
  {
    trex.changeAnimation("parado", trexp);
    trex.velocityX = 0;  //trex_running.velocityX = 0;
    ground.velocityX = 0;
    text("Aperte enter para começar",300,100);
    
    if(keyDown("enter"))
    {
      gameState = PLAY;
  
    }
  }
      //Estado do jogo PLAY
     else if(gameState === PLAY)
     {
      ground.velocityX = -3 - 3*pontos/100;
      pontos = pontos + Math.round(frameCount/90);
      if(pontos % 100 === 0 && pontos > 0){
        cP.play();
        console.log("Oii");
       }
       trex.changeAnimation("running", trex_running);
       if(keyDown("space") && trex.y>=150){
       trex.velocityY = -10;
       pular.play(); //não executa
    }
      trex.velocityY = trex.velocityY + 0.5;
      
      if(ground.x < 0){
      ground.x = ground.width/2;
     }
        nuvem();
        cactos();
  
         if(gcacto.isTouching(trex)){
          gameState = END;
          died.play();
       }
     }
       else if(gameState === END){
        ground.velocityX = 0;
        trex.velocityX = 0;
        gcacto.setVelocityXEach(0);
        gnuvens.setVelocityXEach(0);
        gcacto.setLifetimeEach(-1);
        gnuvens.setLifetimeEach(-1);
        trex.changeAnimation("bateu", trexgo);
        gameOver.visible = true;
        rst.visible = true;
        gameOver.depth = nuvens.depth + 1;
        rst.depth = nuvens.depth + 1;

        if(mousePressedOver(rst)){
          reset();
        }
       }
  
     //impedir que o trex caia
  trex.collide(invisibleGround);
  
  
  drawSprites();
}

function nuvem()
{
  if(frameCount % 90 === 0)
  {
    nuvens = createSprite(600,80,20,20);
    gnuvens.add(nuvens);
    nuvens.velocityX = -2;
    nuvens.addImage(nuvemImg);
    nuvens.y = Math.round(random(50,100));
    trex.depth = nuvens.depth + 1;
    nuvens.lifetime = 320;
  }
  
}

function cactos ()
{
  if(frameCount % 90 === 0)
  {
    cacto = createSprite(600,160,20,20);
    cacto.velocityX = -3 - pontos/100;
    var n = Math.round(random(1,6));
    switch(n)
    {
      case 1: cacto.addImage(c1);
      break;
      case 2: cacto.addImage(c2);
      break;
      case 3: cacto.addImage(c3);
      break;
      case 4: cacto.addImage(c4);
      break;
      case 5: cacto.addImage(c5);
      break;
      case 6: cacto.addImage(c6);
      break;
      default: break;
    }
    cacto.lifetime = 220;
    cacto.scale = 0.6;
    gcacto.add(cacto);
  }
}

function reset(){
  gameState = START;

 //muda a animação do trex
 trex.changeAnimation("parado", trexp);
 
 //zerar pontuação
  pontos = 0;

 //destruir os cactos e nuvens
 gcacto.destroyEach();
 gnuvens.destroyEach();

 //visibilidade dos sprites
 rst.visible = false;
 gameOver.visible = false;

}