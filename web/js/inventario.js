class inventario extends Phaser.Scene
{
	constructor()
	{
		super("inventario");
	}
	preload()
	{
		this.load.image('inventario', 'assets/inventario.png');
		this.scene.start("inventario");
	}
	create()
	{
		inventario = this.add.sprite(700,80, 'inventario').setScale(0.3);
	}
	update()
	{

	}
}