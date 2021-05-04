
var camara ={
	this.cameras.main.setBounds(0, 0, 1280 * 2, 1280 * 2);
	this.physics.world.setBounds(0, 0, 1280 * 2, 1280 * 2);
	this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
}

export { camara }