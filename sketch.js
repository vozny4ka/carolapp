var bgSound, bgImage;

function preload() {
	bgImage = loadImage("assets/bg_0000.png");
	bgSound = loadSound("assets/bg.ogg");
}

function setup() {
  createCanvas(960, 540);

  bgSound.setVolume(0.5);
  bgSound.loop();
}

function draw() {
  // background image
  background(bgImage);
}