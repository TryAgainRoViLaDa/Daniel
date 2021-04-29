var config = {
    type: Phaser.AUTO,
    width:850,
    height:600,
    physics:{
        default:'arcade',
        arcade:{
            debug: true,
            gravity:{y:0}
        }
    },
    scene:{
        preload:preload,
        create:create,
        update:update
    }
};

var game = new Phaser.Game(config);

// Variables globales

var cd=0;
var cd2=100;
var mensaje=0;
var scorecd=0;
var final=20;
var inicio=0;
var auxiliar=0;
var player;
var NPCY;
var NPCX;
var velocidad = 3;
var velocidad2 = 1;
var velocidadF = 6;
var veracidadNPC = false;
var vidas = 100;
var malo;
var N = 60;
var variableCombate = 0;

var veracidad = false;
var veracidad2 = false;
var attack = false;
var attack2 = false;
var attack3 = false;
var inmovil = false;


function preload() {

    this.load.image('gameTiles', 'tileset/IceTileset.png');
    this.load.tilemapTiledJSON('tilemap', 'maps/nieve.json');
    this.load.image('NPC', 'assets/NPC.png');
    this.load.image('texto', 'assets/bafarada1.png');
    this.load.image('texto2', 'assets/bafarada2.png');
    this.load.image('enemigoBasico', 'assets/enemigoBasico.png');
    this.load.image('enemigoArquero', 'assets/enemigoArquero.png');
    this.load.image('enemyArrow', 'assets/enemyArcher.png');

    this.load.spritesheet('dude', 
        'assets/personaje.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}
   
function create() {

    //Tilemap-capas
    map = this.make.tilemap({key:'tilemap'});

    tileset = map.addTilesetImage('Nieve','gameTiles');

    suelo = map.createLayer(0, tileset);

    // capa de colisiones-colisiones
    obstaculos = map.createLayer(1, tileset);
    obstaculos.setCollisionByProperty({colision: true});

    suelo.setDepth(0);
    obstaculos.setDepth(0);

    // Spawn
    const spawn = map.findObject("objetos", obj => obj.name === "Spawn");

    // Camara-Player
    this.cameras.main.setBounds(0, 0, 1280 * 2, 1280 * 2);
    this.physics.world.setBounds(0, 0, 1280 * 2, 1280 * 2);
    this.player = this.physics.add.sprite(60, 2500, 'dude');
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

    // Personajes
    // Player
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.7,0.7);
    this.player.body.setSize(20, 8);
    player = this.player;

    //NPC
    NPC = this.physics.add.sprite(200, 350, 'NPC');
    NPC.setScale(0.1);
    NPCX = NPC.x;
    NPCY = NPC.y;

    // Grupos
    basicEnemyList = this.physics.add.group();
    archerEnemyList = this.physics.add.group();
    enemyArrowList = this.physics.add.group();

    // Colisiones
    this.physics.add.collider(this.player, obstaculos);
    this.physics.add.collider(basicEnemyList, obstaculos);
    this.physics.add.collider(archerEnemyList, obstaculos);
    this.physics.add.collider(enemyArrowList, obstaculos);

    //Animaciones
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    
    // Eventos de teclado
    KeyA=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    KeyD=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    KeyW=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    KeyS=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    KeyE=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    SPACE=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Overlaps
    this.physics.add.overlap(this.player, NPC, textoInteraccion, null, this);
    this.physics.add.overlap(this.player, NPC, hablar1, null, this);
    this.physics.add.overlap(this.player, NPC, hablar2, null, this);
    this.physics.add.overlap(this.player, basicEnemyList, enfrentamientoEbasicoP, null, this);
    this.physics.add.overlap(this.player, archerEnemyList, enfrentamientoEarcherP, null, this);
    this.physics.add.overlap(this.player, enemyArrowList, playerDieArrow, null, this);

    //Scoretexts
    vidaText = this.add.text(0, 0, 'Vidas: 100', { fontSize: '20px', fill: 'black' });
}

function update()
{
    playerMovement();
    contadores();
    hablarNPC();
    movementBasicEnemy();
    crearEnemigoBasico();
    crearEnemigoArcher();
    movementArcherEnemy();
    disparoArcher();
}

function contadores()
{
    if(cd>0)
    {
        cd=cd-1;
    }
    
    cd2=cd2-1;

    if(auxiliar==1) 
    {
        scorecd=scorecd-1;
    }

    N--;
}

function hablarNPC()
{
    if (veracidadNPC == true) 
    {
        if (SPACE.isDown)
        {
            final=final-1;

            if (SPACE.isDown && final<=0)
            {
                destruirTexto();
                final=20;
            }
        }
    }
}

function hablar1()
{
    if(KeyE.isDown && cd==0 && mensaje==0 && inicio==0)
    {
        texto = this.physics.add.sprite(NPCX+30, NPCY-60, 'texto');
        texto.setScale(0.2);
        cd=200;
        mensaje=1;
        inicio=1;
    }
}

function hablar2()    
{
    if(SPACE.isDown && mensaje==1)
    {
        texto.destroy();
        scoreText.destroy();
        texto2 = this.physics.add.sprite(NPCX+30, NPCY-60, 'texto2');
        texto2.setScale(0.2);
        cd2=300;
        mensaje=0;
        veracidadNPC = true;
    }   
}

function textoInteraccion()
{
    if(scorecd<=0)
    {
        scoreText = this.add.text(NPCX-155, NPCY+20, 'Pulsa E para hablar y SPACE para continuar', { fontSize: '15px', fill: 'black' });
        scorecd=200;
        auxiliar=0;
    }
}

function destruirTexto()
{
    scoreText.destroy();
    texto2.destroy();
    inicio=0;
    auxiliar=1;
}

function crearEnemigoBasico()
{
    if (veracidad == false) 
    {
        var enemy = basicEnemyList.create(400, 2200, 'enemigoBasico');
        enemy.body.setSize(3000, 3000, 30000, 3000);
        enemy.setScale(0.08, 0.08);
        veracidad = true;
    }
}

function movementBasicEnemy()
{
    if (attack == true) 
    { 
        for (var i = 0; i < basicEnemyList.getChildren().length; i++) 
        {   //MOVIMIENTO ENEMIGO-DISPARO ENEMIGO//
            var enemy = basicEnemyList.getChildren()[i];
            enemy.direccion = new Phaser.Math.Vector2(player.x-enemy.x,player.y-enemy.y); 
            enemy.setVelocityX(velocidad * enemy.direccion.x/2);
            enemy.setVelocityY(velocidad * enemy.direccion.y/2);
        }
    }
}


function enfrentamientoEbasicoP(objeto1, objeto2)
{
    attack = true;
    if (SPACE.isDown) 
    {
        objeto2.destroy();
        veracidad = false;
        attack = false;
        aumentarVida();
    }

    variableCombate = 1;
    decrementarVida();
    if (vidas <= 0) 
    {
        this.player.destroy();
        inmovil = true;
    }
}

function enfrentamientoEarcherP(objeto1, objeto2)
{
    attack3 = true;
    attack2 = true;
    if (SPACE.isDown) 
    {
        objeto2.destroy();
        veracidad2 = false;
        attack2 = false;
        attack3 = false;
        aumentarVida();
    }

    variableCombate = 1;
    decrementarVida();
    if (vidas <= 0) 
    {
        this.player.destroy();
        inmovil = true;
    }
}

function crearEnemigoArcher()
{
    if (veracidad2 == false) 
    {
        var enemy = archerEnemyList.create(800, 2200, 'enemigoArquero');
        enemy.body.setSize(200, 600);
        enemy.setScale(0.07, 0.07);
        veracidad2 = true;
        malo = enemy;
    }
}

function movementArcherEnemy()
{
    if (attack2 == true) 
    { 
        for (var i = 0; i < archerEnemyList.getChildren().length; i++) 
        {   //MOVIMIENTO ENEMIGO-DISPARO ENEMIGO//
            var enemy = archerEnemyList.getChildren()[i];
            enemy.direccion = new Phaser.Math.Vector2(player.x-enemy.x,player.y-enemy.y); 
            enemy.setVelocityX(velocidad2 * enemy.direccion.x/2);
            enemy.setVelocityY(velocidad2 * enemy.direccion.y/2);
        }
    }
}

function disparoArcher()
{
    if (attack3 == true) 
    {
        if(N <= 0)
        {   //TIRO TELEDIRIGIDO//
            var bala = enemyArrowList.create(malo.x, malo.y,'enemyArrow');
            bala.setScale(0.06,0.06);
            bala.body.setSize(200, 200, 200, 200);
            disparo = bala;

            bala.direccion = new Phaser.Math.Vector2(player.x-malo.x,player.y-malo.y);
            bala.direccion.normalize();
            
            N = 60;
        }

        for (var i = 0; i < enemyArrowList.getLength(); i++) 
        {   //MOVIMIENTO TIRO TELEDIRIGIDO//
            var bala = enemyArrowList.getChildren()[i];
            bala.x = bala.x + velocidadF * bala.direccion.x;
            bala.y = bala.y + velocidadF * bala.direccion.y;
        }
    }
}

function playerDieArrow(objeto1, objeto2)
{
    objeto2.destroy();
    variableCombate = 2;
    decrementarVida();
    if (vidas <= 0) 
    {
        this.player.destroy();
        inmovil = true;
    }
}

function decrementarVida()
{
    if (variableCombate == 1) 
    {
        vidas = vidas - 1;
        vidaText = vidaText.setText('Vidas: ' +vidas);
    }

    else if (variableCombate == 2) 
    {
        vidas = vidas - 30;
        vidaText = vidaText.setText('Vidas: ' +vidas);
    }
}

function aumentarVida()
{
    vidas = vidas + 15;
    vidaText = vidaText.setText('Vidas: ' +vidas);
}

function playerMovement()
{
    if (inmovil == false) 
    {
        if (KeyA.isDown)
        {
            player.setVelocityX(-300);
            player.play('left');
        }

        else if (KeyD.isDown)
        {
            player.setVelocityX(300);
            player.play('right');
        }
        else
        {
            player.setVelocityX(0);
        }

        if (KeyW.isDown)
        {
            player.setVelocityY(-300);
        }

        else if (KeyS.isDown)
        {
            player.setVelocityY(300);
            player.play('turn');
        }
        else
        {
            player.setVelocityY(0);
        }
    }
}
