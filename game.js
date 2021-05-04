var config = {
    type: Phaser.AUTO,
    width:850,
    height:600,
    fps: {
        target:60,
        forceSetTimeOut:true
    },
    physics:{
        default:'arcade',
        arcade:{
            debug: false,
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
var velocidadF = 12;
var veracidadNPC = false;
var vidas = 7;
var malo;
var malo2;
var N = 160;
var variableCombate = 0;

var veracidad = false;
var veracidad2 = false;
var attack = false;
var attack2 = false;
var attack3 = false;
var inmovil = false;
var muerto = false;
var malvado;
var mision = false;
var enemigosM = 0;
var C = 0;
var C2 = 0;
var CT = false;
var C2T = false;


function preload() {

    this.load.image('gameTiles', 'tileset/IceTileset.png');
    this.load.tilemapTiledJSON('tilemap', 'maps/juanito.json');
    this.load.image('NPC', 'assets/NPC.png');
    this.load.image('texto', 'assets/bafarada1.png');
    this.load.image('texto2', 'assets/bafarada2.png');
    this.load.image('enemigoBasico', 'assets/enemigoBasico.png');
    this.load.image('enemigoArquero', 'assets/enemigoArquero.png');
    this.load.image('enemyArrow', 'assets/enemyArcher.png');
    this.load.image('heart', 'assets/heart.png');
    scene = this;

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

    // Camara-Player
    this.cameras.main.setBounds(0, 0, 1280 * 2, 1280 * 2);
    this.physics.world.setBounds(0, 0, 1280 * 2, 1280 * 2);
    this.player = this.physics.add.sprite(0, 0, 'dude');
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
    heartList = this.physics.add.group();

    // Spawn
    const spawn = map.createFromObjects("Objetos");
    spawn.forEach(obj=>
    {
        obj.setAlpha(0);
        if (obj.name == "Spawn") 
        {
            this.player.x = obj.x;
            this.player.y = obj.y;
        }

        if (obj.name == "Goblin") 
        {
            crearEnemigoBasico(obj);
        }

        if (obj.name == "Esqueleto") 
        {
            crearEnemigoArcher(obj);
        }
    })
    this.player.detector = this.add.rectangle(this.player.x, this.player.y, 100, 100);
    this.physics.add.existing(this.player.detector, true);

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
    this.physics.add.overlap(this.player, heartList, aumentarVida, null, this);

    //Scoretexts
    vidaText = this.add.text(0, 0, 'Vidas: 7', { fontSize: '20px', fill: 'black' }).setScrollFactor(0);
    Quest = this.add.text(280, 0, 'Objetivo: Asesina a dos enemigos y encuentra al aldeano perdido', { fontSize: '15px', fill: 'black' }).setScrollFactor(0);
}

function update()
{
    playerMovement();
    contadores();
    hablarNPC();
    movementBasicEnemy();
    movementArcherEnemy();
    if (enemigosM >= 2) 
    {
        mision = true;
    }
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

    if (CT == true) 
    {
        C--;
    }

    if (C2T == true) 
    {
        C2--;
    }
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
    if(KeyE.isDown && cd==0 && mensaje==0 && inicio==0 && mision == true)
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
    if(scorecd<=0 && mision == true)
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

function crearEnemigoBasico(obj)
{
    var enemy = basicEnemyList.create(obj.x, obj.y, 'enemigoBasico');
    enemy.body.setSize(500, 600);
    enemy.setScale(0.08, 0.08);
    veracidad = true;
    malo2 = enemy;
    enemy.attack = false;
}

function movementBasicEnemy(enemy)
{ 
    /*for (var i = 0; i < basicEnemyList.getChildren().length; i++) 
    {   //MOVIMIENTO ENEMIGO-DISPARO ENEMIGO//
        var enemy = basicEnemyList.getChildren()[i];
        if (enemy.attack == true) 
        { 
            enemy.direccion = new Phaser.Math.Vector2(player.x-enemy.x,player.y-enemy.y); 
            enemy.setVelocityX(velocidad * enemy.direccion.x/2);
            enemy.setVelocityY(velocidad * enemy.direccion.y/2);
        }
    }*/
    if (muerto == false && inmovil == false) 
    {
             Phaser.Actions.Call(basicEnemyList.getChildren(), function(go) {
                if (go.attack == true) 
                {
                    scene.physics.moveTo(go, this.player.x, this.player.y, 200);
                }
        })
    }
    else
    {
        malo2.setVelocityX(0);
        malo2.setVelocityY(0);
    }
}


function enfrentamientoEbasicoP(objeto1, objeto2)
{
    objeto2.attack = true;
    if (SPACE.isDown) 
    {
        objeto2.destroy();
        enemigosM++;
        veracidad = false;
        attack = false;
        var numeroR = Phaser.Math.Between(1, 1);
        if (numeroR == 1) 
        {
            var heart = heartList.create(objeto2.x, objeto2.y, 'heart');
            heart.setScale(0.1, 0.1);
        }
    }

    variableCombate = 1;
    
    CT = true;
    if (C <= 0) 
    {
        decrementarVida();
        C = 50;
    }
    if (vidas <= 0) 
    {
        this.player.destroy();
        inmovil = true;
    }
}

function enfrentamientoEarcherP(objeto1, objeto2)
{
    objeto2.attack3 = true;
    objeto2.attack2 = true;
    if (SPACE.isDown) 
    {
        enemigosM++;
        objeto2.destroy();
        veracidad2 = false;
        objeto2.attack2 = false;
        objeto2.attack3 = false;
        var numeroR2 = Phaser.Math.Between(1, 3);
        if (numeroR2 == 2)
        {
            var heart = heartList.create(objeto2.x, objeto2.y, 'heart');
            heart.setScale(0.1, 0.1);
        }
    }

    variableCombate = 1;
    C2T = true;
    if (C2 <= 0) 
    {
        decrementarVida();
        C2 = 50
    }
    if (vidas <= 0) 
    {
        this.player.destroy();
        inmovil = true;
    }
}

function crearEnemigoArcher(obj)
{
    var enemy = archerEnemyList.create(obj.x, obj.y, 'enemigoArquero');
    enemy.body.setSize(1000, 1000);
    enemy.setScale(0.07, 0.07);
    malo = enemy;
    enemy.attack3 = false;
    malvado = enemy.attack3;
    enemy.attack2 = false;
    enemy.N = 160;
}

function movementArcherEnemy()
{  
    /*for (var i = 0; i < archerEnemyList.getChildren().length; i++) 
    {   //MOVIMIENTO ENEMIGO-DISPARO ENEMIGO//
    }*/
    if (muerto == false && inmovil == false) 
    {
        Phaser.Actions.Call(archerEnemyList.getChildren(), function(go) {
            if (go.attack2 == true) 
            {
                scene.physics.moveTo(go, this.player.x, this.player.y, 100);
                disparoArcher(go);
                go.N--;
            }
        })
    }
}

function disparoArcher(enemy)
{
    if (muerto == false) 
    {
        if (enemy.attack3 == true) 
        {
            if(enemy.N <= 0)
            {   //TIRO TELEDIRIGIDO//
                var bala = enemyArrowList.create(enemy.x, enemy.y,'enemyArrow');
                bala.setScale(0.06,0.06);
                bala.body.setSize(200, 200, 200, 200);
                disparo = bala;

                bala.direccion = new Phaser.Math.Vector2(player.x-enemy.x,player.y-enemy.y);
                bala.direccion.normalize();

                scene.physics.moveTo(bala, this.player.x, this.player.y, 700);
                disparoArcher(bala);
                
                enemy.N = 160;
            }

            for (var i = 0; i < enemyArrowList.getLength(); i++) 
            {   //MOVIMIENTO TIRO TELEDIRIGIDO//
                var bala = enemyArrowList.getChildren()[i];
                //bala.x = bala.x + velocidadF * bala.direccion.x;
                //bala.y = bala.y + velocidadF * bala.direccion.y;
                if (enemy == undefined) 
                {
                    for (var i = 0; i < enemyArrowList.getLength(); i++)
                    {
                        bala[i].destroy();
                    }
                }
            }
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
        muerto = true;
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
        vidas = vidas - 2;
        vidaText = vidaText.setText('Vidas: ' +vidas);
    }
}

function aumentarVida(objeto1, objeto2)
{
    vidas = vidas + 3;
    vidaText = vidaText.setText('Vidas: ' +vidas);
    objeto2.destroy();
}

function playerMovement()
{
    if (inmovil == false) 
    {
        if (KeyA.isDown)
        {
            player.setVelocityX(-250);
            player.play('left');
        }

        else if (KeyD.isDown)
        {
            player.setVelocityX(250);
            player.play('right');
        }
        else
        {
            player.setVelocityX(0);
        }

        if (KeyW.isDown)
        {
            player.setVelocityY(-250);
        }

        else if (KeyS.isDown)
        {
            player.setVelocityY(250);
            player.play('turn');
        }
        else
        {
            player.setVelocityY(0);
        }
    }

    player.detector.x = player.x;
    player.detector.y = player.y;
}

function fade() {

    //  You can set your own fade color and duration
    game.cameras.main.fade(0x000000, 4000);

}
