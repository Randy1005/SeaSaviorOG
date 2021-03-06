class Scene2 extends Phaser.Scene {

    constructor() {
        super("playGame");
    }

    create() {
        // background
        this.background = this.add.image(0, 0, 'sea');
        this.background.setOrigin(0, 0);

        // planes
        this.planes = this.physics.add.group();

        var plane1 = new Plane(this, 20, 20, 0.8, false);
        var plane2 = new Plane(this, 50, 40, 1.7, false);
        var plane3 = new Plane(this, 500, 70, 2, true);
        var plane4 = new Plane(this, 480, 100, 0.9, true);

        // garbages
        this.garbageList = this.physics.add.group();

        // player
        this.diver = new Diver({
            scene: this,
            x: game.config.width / 2,
            y: 300,
            texture: 'diver'
        }, 100, [40, 60]);

        // a timer to create garbage
        this.time.addEvent({
            delay: 2000,
            callback: this.creatingGarbage,
            callbackScope: this,
            loop: true
        });

        // add overlap listener to diver and grabages
        //this.physics.add.overlap(this.diver, this.garbageList, this.collectGarbage, null, this);
		// add collision listener to diver and grabages
		this.physics.add.overlap(this.planes, this.garbageList, this.shootingGarbage, null, this);
    }

    creatingGarbage() {
        for (var i = 0; i < this.planes.getChildren().length; i++) {
            var oneplane = this.planes.getChildren()[i];
            oneplane.createGarbage(this);
        }
    }

    droppingGarbage() {
        for (var i = 0; i < this.garbageList.getChildren().length; i++) {
            var g = this.garbageList.getChildren()[i];
            g.Update(this);
        }
    }
	
	shootingGarbage(plane, garbage) {
		if (garbage.isShootBack) {
			garbage.destroy();
			plane.destroy();
		}
	}


    // for diver to update garbage collection
    collectGarbage(diver, garbage) {
        //garbage.body.enable = false;
        if (garbage.active && diver.garbageCnt < 6) {
            garbage.destroy();
            diver.addGarbage();
        } else {
            return;
        }
    }

    update() {
        for (var i = 0; i < this.planes.getChildren().length; i++) {
            var oneplane = this.planes.getChildren()[i];
            oneplane.update();
        }
        this.diver.update(this);
		this.droppingGarbage();
    }
}