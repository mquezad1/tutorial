var game = new Phaser.Game(525, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
//  File does not open in google chrome
//  I used Microsoft Edge


function preload() {
	// preload assets
	game.load.image('sky', 'assets/img/sky.png');
    game.load.image('ground', 'assets/img/platform.png');
    game.load.image('star', 'assets/img/star.png');
	game.load.image('diamond', 'assets/img/diamond.png');
	game.load.spritesheet('baddie', 'assets/img/baddie.png', 32, 32);
}

var player;
var platforms;
var cursors;

var stars;
var diamond;
var score = 0;
var scoreText;

function create() {
	//  place your assets
	//  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create five ledges
    var ledge = platforms.create(-200, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(350, 300, 'ground');
    ledge.body.immovable = true;
	
	ledge = platforms.create(-250, 190, 'ground');
	ledge.body.immovable = true;
	
	ledge = platforms.create(400, 150, 'ground');
	ledge.body.immovable = true;
	
	ledge = platforms.create(-300, 75, 'ground');
	ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(15, game.world.height - 150, 'baddie');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [2, 3], 10, true);

	//  Finally some stars to collect
    stars = game.add.group();
	
	//  We will enable physics for any star that is created in this group
    stars.enableBody = true;
	
    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
	
	//  Adding the diamond and random location spawn
	diamond = game.add.sprite(Math.random()*500, 0, 'diamond');
	
	//  Adding the physics 
	game.physics.arcade.enable(diamond);
	diamond.body.gravity.y = 200;

    //  The score
    scoreText = game.add.text(16, 550, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
	//  run game loop
	//  Collide the player, the stars, and the diamond with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(diamond, platforms);
	game.physics.arcade.collide(stars, platforms);
	
    //  Checks to see if the player overlaps with any of the stars, if they do, call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
	
	// Checks to see if the player overlaps with the diamond and calls collectDiamond function if they do
    game.physics.arcade.overlap(player, diamond, collectDiamond, null, this);
	
	//  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }
}
function collectStar (player, star) {
    
    //  Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}
function collectDiamond (player, diamond) {
	
	//  Removes diamond from the screen
	diamond.kill();
	
	//  Add & update score
	score += 25;
	scoreText.text = 'Score: ' + score;
}