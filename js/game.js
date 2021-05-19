var map;
var tileset;
var suelo;
var obstaculos;
var player;
var NPC;
var NPCX;
var NPCY;
var basicEnemyList;
var archerEnemyList;
var enemyArrowList;
var heartList;
var spawn;
var obj;
var KeyA;
var KeyD;
var KeyW;
var KeyS;
var KeyE;
var KeyQ;
var SPACE;
var vidaText;
var Quest;
var CoolDown;
var furia;
var enemigosM;
var veracidad;
var malo2;
var malo;
var malvado;
var scene;
var scoreText;
var texto;
var texto2;
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
var pacifismo = false;
var anchorta;

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
var SBActivado = false;

var velocidadP = 300;
var Time = 0;
var SBTime = 100;

var vidaE = 3;
var vidaE2 = 2;
var inmunidadE = false;
var CIE = 0;
var DP = 1;
var CF = 500;

var heart;


class game extends Phaser.Scene
{
    constructor()
    {
        super("game");

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
        var SBActivado = false;

        var velocidadP = 300;
        var Time = 0;
        var SBTime = 100;

        var vidaE = 3;
        var vidaE2 = 2;
        var inmunidadE = false;
        var CIE = 0;
        var DP = 1;
        var CF = 500;

    }
    preload() {

    this.load.image('gameTiles', 'tileset/IceTileset.png');
    this.load.tilemapTiledJSON('tilemap', 'maps/Nieve.json');
    this.load.image('NPC', 'assets/NPC.png');
    this.load.image('texto', 'assets/texto1.png');
    this.load.image('texto2', 'assets/texto2.png');
    this.load.image('enemigoBasico', 'assets/enemigoBasico.png');
    this.load.image('enemigoArquero', 'assets/enemigoArquero.png');
    this.load.image('enemyArrow', 'assets/enemyArcher.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.atlas('attack','assets/attack.png', 'assets/attack_atlas.json');
    this.load.image('inventario', 'assets/inventario.png');

    /*this.load.spritesheet('dude', 
        'assets/personaje.png',
        { frameWidth: 32, frameHeight: 48 }
    );*/
    }
       
    create() {

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
        //this.player = this.physics.add.sprite(0, 0, 'dude');
        this.player = this.physics.add.sprite(0, 0, 'attack');
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        // Personajes
        // Player
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        //this.player.setScale(0.7,0.7);
        this.player.setScale(0.08,0.08);
        this.player.body.setSize(200, 100);
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
                //this.crearEnemigoBasico(obj);
                this.crearEnemigoBasico(obj);
                anchorta = this.physics.add.sprite(obj.x, obj.y, 'heart').setScale(0.02);
                anchorta.body.setSize(400, 400);
            }

            if (obj.name == "Esqueleto") 
            {
                this.crearEnemigoArcher(obj);
            }
        })
        this.player.detector = this.add.rectangle(this.player.x, this.player.y, 100, 100);
        this.physics.add.existing(this.player.detector, true);

        // Colisiones
        this.physics.add.collider(this.player, obstaculos);
        this.physics.add.collider(anchorta, obstaculos);
        this.physics.add.collider(archerEnemyList, obstaculos);
        this.physics.add.collider(enemyArrowList, obstaculos);

        //Animaciones
        /*this.anims.create({
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
        });*/

        this.anims.create({
            key:'attack',
            frames: this.anims.generateFrameNames('attack', {
                prefix: 'attack',
                start: 0,
                end: 10,
            }),
            repeat:0,
            frameRate:30
        });
        
        // Eventos de teclado
        KeyA=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        KeyD=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        KeyW=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        KeyS=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        KeyE=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        KeyQ=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        SPACE=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Overlaps
        this.physics.add.overlap(this.player, NPC, this.textoInteraccion, null, this);
        this.physics.add.overlap(this.player, NPC, this.hablar1, null, this);
        this.physics.add.overlap(this.player, NPC, this.hablar2, null, this);
        this.physics.add.overlap(this.player, basicEnemyList, this.enfrentamientoEbasicoP, null, this);
        this.physics.add.overlap(this.player, archerEnemyList, this.enfrentamientoEarcherP, null, this);
        this.physics.add.overlap(this.player, enemyArrowList, this.playerDieArrow, null, this);
        this.physics.add.overlap(this.player, heartList, this.VidaI, null, this);

        //Scoretexts
        vidaText = this.add.text(0, 0, 'Vidas: 7', { fontSize: '20px', fill: 'black' }).setScrollFactor(0);
        Quest = this.add.text(280, 0, 'Objetivo: Asesina a dos enemigos y encuentra al aldeano perdido', { fontSize: '15px', fill: 'black' }).setScrollFactor(0);
        CoolDown = this.add.text(0, 20, 'CD: 0', { fontSize: '20px', fill: 'black' }).setScrollFactor(0);
        furia = this.add.text(0, 40, 'Furia: 0', { fontSize: '20px', fill: 'black' }).setScrollFactor(0);

        inventario = this.add.sprite(750,90, 'inventario').setScale(0.3);
        inventario.setScrollFactor(0);
        inventario.huecos =new Array;
    }

    update()
    {
        this.playerMovement();
        this.contadores();
        this.hablarNPC();
        this.movementBasicEnemy();
        this.movementArcherEnemy();
        this.Speedboost();
        this.Furia();
        this.moverColliders();
        this.consumir();
        if (enemigosM >= 2) 
        {
            mision = true;
        }
    }

    moverColliders()
    {
    
    }

    //Funcion para contadores
    contadores()
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

        if(inmunidadE == true)
        {
            CIE--;
            if(CIE <= 0)
            {
                inmunidadE = false;
            }
        }
    }

    //Funcion para hablar con NPC
    hablarNPC()
    {
        if (veracidadNPC == true) 
        {
            if (SPACE.isDown)
            {
                final=final-1;

                if (SPACE.isDown && final<=0)
                {
                    this.destruirTexto();
                    final=20;
                    pacifismo = false;
                }
            }
        }
    }

    //Funcion para hablar con NPC
    hablar1()
    {
        pacifismo = true;
        if(KeyE.isDown && cd==0 && mensaje==0 && inicio==0 && mision == true)
        {
            texto = this.physics.add.sprite(NPCX+30, NPCY-70, 'texto');
            texto.setScale(0.3);
            cd=200;
            mensaje=1;
            inicio=1;
        } 
    }

    //Función para hablar con NPC
    hablar2()    
    {
        if(SPACE.isDown && mensaje==1)
        {
            texto.destroy();
            scoreText.destroy();
            texto2 = this.physics.add.sprite(NPCX+30, NPCY-70, 'texto2');
            texto2.setScale(0.3);
            cd2=300;
            mensaje=0;
            veracidadNPC = true;
        }  
    }

    //Funcion para hablar con NPC
    textoInteraccion()
    {
        if(scorecd<=0 && mision == true)
        {
            scoreText = this.add.text(NPCX-155, NPCY+20, 'Pulsa E para hablar y SPACE para continuar', { fontSize: '15px', fill: 'black' });
            scorecd=200;
            auxiliar=0;
        }
    }

    //Funcion para hablar con NPC
    destruirTexto()
    {
        scoreText.destroy();
        texto2.destroy();
        inicio=0;
        auxiliar=1;
    }

    //Creación de enemigo basico
    crearEnemigoBasico(obj, enemy)
    {
        var enemy = basicEnemyList.create(obj.x, obj.y, 'enemigoBasico');
        enemy.body.setSize(500, 600);
        enemy.setScale(0.08, 0.08);
        veracidad = true;
        malo2 = enemy;
        enemy.attack = false;
    }

    //Movimiento de enemigo basico
    movementBasicEnemy(enemy)
    { 
        for (var i = 0; i < basicEnemyList.getChildren().length; i++) 
        {   //MOVIMIENTO ENEMIGO-DISPARO ENEMIGO//
            var enemy = basicEnemyList.getChildren()[i];
            if (enemy.attack == true) 
            { 
                enemy.direccion = new Phaser.Math.Vector2(player.x-enemy.x,player.y-enemy.y); 
                enemy.setVelocityX(velocidad * enemy.direccion.x/2);
                enemy.setVelocityY(velocidad * enemy.direccion.y/2);
            }
        }
        if (muerto == false && inmovil == false) 
        {
                 /*Phaser.Actions.Call(basicEnemyList.getChildren(), function(go) {
                    if (go.attack == true) 
                    {
                        this.physics.moveTo(go, this.player.x, this.player.y, 200);
                    }
            })*/
        }
        else
        {
            malo2.setVelocityX(0);
            malo2.setVelocityY(0);
        }
    }

    //Enfrentamiento enemigo basico-player
    enfrentamientoEbasicoP(objeto1, objeto2)
    {
        objeto2.attack = true;
        if (SPACE.isDown) 
        {
            if(inmunidadE == false && CIE <= 0)
            {
                vidaE = vidaE - DP;
                inmunidadE = true;
                CIE = 60;
            }

            if(vidaE <= 0)
            {
                enemigosM++;
                objeto2.destroy();
                vidaE = 3;

                var numeroR = Phaser.Math.Between(1, 1);
                if (numeroR == 1) 
                {
                    heart = heartList.create(objeto2.x, objeto2.y, 'heart');
                    heart.setScale(0.2, 0.2);
                }
            }

            attack = false;
        }

        variableCombate = 1;
        
        CT = true;
        if (C <= 0) 
        {
            this.decrementarVida();
            C = 50;
        }
        if (vidas <= 0) 
        {
            this.player.destroy();
            inmovil = true;
        }
    }

    //Enfrentamiento enemigo arquero-player
    enfrentamientoEarcherP(objeto1, objeto2)
    {
        objeto2.attack3 = true;
        objeto2.attack2 = true;
        if (SPACE.isDown) 
        {
            if(inmunidadE == false && CIE <= 0)
            {
                vidaE2 = vidaE2 - DP;
                inmunidadE = true;
                CIE = 60;
            }

            if(vidaE2 <= 0)
            {
                enemigosM++;
                objeto2.destroy();
                vidaE2 = 2;
                var numeroR2 = Phaser.Math.Between(1, 3);
                if (numeroR2 == 2)
                {
                    var heart = heartList.create(objeto2.x, objeto2.y, 'heart');
                    heart.setScale(0.1, 0.1);
                }
            }
            objeto2.attack2 = false;
            objeto2.attack3 = false;
        }

        variableCombate = 1;
        C2T = true;
        if (C2 <= 0) 
        {
            this.decrementarVida();
            C2 = 50
        }
        if (vidas <= 0) 
        {
            this.player.destroy();
            inmovil = true;
        }
    }

    //Creación enemigo arquero
    crearEnemigoArcher(obj)
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

    //Movimiento enemigo arquero
    movementArcherEnemy()
    {  
        /*for (var i = 0; i < archerEnemyList.getChildren().length; i++) 
        {   //MOVIMIENTO ENEMIGO-DISPARO ENEMIGO//
        }*/
        for (var i = 0; i < archerEnemyList.getChildren().length; i++) 
        {   //MOVIMIENTO ENEMIGO-DISPARO ENEMIGO//
            var enemy = archerEnemyList.getChildren()[i];
            if (enemy.attack2 == true) 
            { 
                enemy.direccion = new Phaser.Math.Vector2(player.x-enemy.x,player.y-enemy.y); 
                enemy.setVelocityX(velocidad * enemy.direccion.x/2);
                enemy.setVelocityY(velocidad * enemy.direccion.y/2);
            }
        }

        this.disparoArcher(enemy);
        enemy.N--;

        if (muerto == false && inmovil == false) 
        {
            /*Phaser.Actions.Call(archerEnemyList.getChildren(), function(go) {
                if (go.attack2 == true) 
                {
                    scene.physics.moveTo(go, this.player.x, this.player.y, 100);
                    disparoArcher(go);
                }
            })
            */
        }
    }

    //Movimiento disparo del enemigo
    disparoArcher(enemy)
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

                    //scene.physics.moveTo(bala, this.player.x, this.player.y, 700);
                    //disparoArcher(bala);
                    
                    enemy.N = 160;
                }

                for (var i = 0; i < enemyArrowList.getLength(); i++) 
                {   //MOVIMIENTO TIRO TELEDIRIGIDO//
                    var bala = enemyArrowList.getChildren()[i];
                    bala.x = bala.x + velocidadF * bala.direccion.x;
                    bala.y = bala.y + velocidadF * bala.direccion.y;
                    /*if (enemy == undefined) 
                    {
                        for (var i = 0; i < enemyArrowList.getLength(); i++)
                        {
                            bala[i].destroy();
                        }
                    }*/
                }
            }
        }
    }

    //Función de muerte por flecha
    playerDieArrow(objeto1, objeto2)
    {
        objeto2.destroy();
        variableCombate = 2;
        this.decrementarVida();
        if (vidas <= 0) 
        {
            this.player.destroy();
            inmovil = true;
            muerto = true;
        }
    }

    //Decrementar vidas del player
    decrementarVida()
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

    //Aumentar vidas
    aumentarVida(objeto1, objeto2)
    {  
        vidas = vidas + 3;
        vidaText = vidaText.setText('Vidas: ' +vidas);
        objeto2.destroy();  
    }

    VidaI(objeto1, objeto2)
    {
        /*for (var i = 0 ; i < 4; i++) 
        {
            inventario.huecos[i] = new Object;
            inventario.huecos[i].y = inventario.y - 25;
            inventario.huecos[i].x = (inventario.x - 70) + 12 * i;
        }*/

        objeto2.x = (inventario.x - 115) + 12;
        objeto2.y = inventario.y - 35;
        objeto2.setScrollFactor(0);
        heart = true;
        //objeto2.x = inventario.huecos[0].x;
        //objeto2.y = inventario.huecos[0].y;
    }

    consumir()
    {
        if (heart == true) 
        {
            if (KeyE.isDown) 
            {
                heart.destroy();
                this.aumentarVida();
            }
        }
    }

    /*function powervida(nave, power) 
    {
        power.x = inventario.huecos[0].x;
        power.y = inventario.huecos[0].y;
        power.body.enable = false;
        /inventario.huecos[0].setTexture('atlas', 'nave');/
        vidas++;
        navces++;
        marcavida.setText('Vidas: '+ vidas);z
        marcanavces.setText('Naves: '+ navces);
    }*/

    //Función mecanica de furia
    Furia()
    {
        if(enemigosM >= 2)
        {
            DP = 2;
            CF--;
            furia = furia.setText('Furia: ' +CF);
        }

        if(CF <= 0)
        {
            DP = 1;
            enemigosM = 0;
            CF = 500;
        }
    }

    //Función movimiento del player
    playerMovement()
    {
        if (inmovil == false) 
        {
            if (KeyA.isDown)
            {
                player.setVelocityX(-velocidadP);
                //player.play('left');
            }

            else if (KeyD.isDown)
            {
                player.setVelocityX(velocidadP);
                //player.play('right');
            }
            else
            {
                player.setVelocityX(0);
            }

            if (KeyW.isDown)
            {
                player.setVelocityY(-velocidadP);
            }

            else if (KeyS.isDown)
            {
                player.setVelocityY(velocidadP);
                //player.play('turn');
            }
            else
            {
                player.setVelocityY(0);
            }

            if (SPACE.isDown) 
            {
                if (pacifismo != true) 
                {
                    player.play('attack');
                }
            }
        }

        player.detector.x = player.x;
        player.detector.y = player.y;
    }

    //Función mecanica speedboost
    Speedboost()
    {
        if(Time <= 0)
        {
            if(KeyQ.isDown)
            {
                SBActivado = true;
            }
        }

        if(SBActivado == true)
        { 
            if(SBTime >= 0)
            {
                velocidadP = 500;
            }
            else if(SBTime <= 0)
            {
                SBActivado = false;
                velocidadP = 300;
            }
            SBTime--;
            Time = 240;
        }

        if(SBActivado == false)
        {
            this.decrementarCoolDown();
            SBTime = 100;
        }
    }

    //funcion cooldown speedboost
    decrementarCoolDown()
    {
        if(Time >= 1)
        {
            Time = Time - 1;
            CoolDown = CoolDown.setText('CD: ' +Time);
        }
    }

    fade() {

        //  You can set your own fade color and duration
        game.cameras.main.fade(0x000000, 4000);

    }
}

