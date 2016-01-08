// Learning p5.js
// an2netto
// https://carol-dudes.herokuapp.com/

var state = {
  idle: {value:0, name:"idle"}, 
  singingPart1: {value:1, name:"part1"},
  singingPart2: {value:2, name:"part2"}
};

var identifier = {
	none: {value:0, name:"none"},
	pink: {value:1, name:"pink"},
	tripple: {value:2, name:"tripple"},
	fat: {fat:3, name:"fat"},
	longer: {longer:4, name:"longer"}
}

var bgSound, bgImage;
var singerPinky, singerTripple, singerFat, singerLonger;

function preload() {

	var singerLongerImgs = [], 	singerFatImgs = [], singerPinkyImgs = [], singerTrippleImgs = [];
	for (var i = 0; i < 94; i++) {
		singerLongerImgs[i] = loadImage("../dudes/long/long_" + nf(i, 4) + ".png");
		singerFatImgs[i] = loadImage("../dudes/fat/fat_" + nf(i, 4) + ".png");
		singerPinkyImgs[i] = loadImage("../dudes/pink/pink_" + nf(i, 4) + ".png");
		singerTrippleImgs[i] = loadImage("../dudes/tripple/tripple_" + nf(i, 4) + ".png");
	}

	singerLonger = new Singer(identifier.longer, singerLongerImgs, loadSound("../voices/voice_long1.ogg"), loadSound("../voices/voice_long2.ogg"));
	singerFat = new Singer(identifier.fat, singerFatImgs, loadSound("../voices/voice_fat1.ogg"), loadSound("../voices/voice_fat2.ogg"));
	singerPinky = new Singer(identifier.pink, singerPinkyImgs, loadSound("../voices/voice_pink1.ogg"), loadSound("../voices/voice_pink2.ogg"));
	singerTripple = new Singer(identifier.tripple, singerTrippleImgs, loadSound("../voices/voice_tripple1.ogg"), loadSound("../voices/voice_tripple2.ogg"));

	bgImage = loadImage("../bg_0000.png");
	// bgSound = loadSound("../bg.ogg");
}

function setup() {
	createCanvas(960, 540);
  	frameRate(25);

  	singerLonger.voice1.setVolume(0.2);
	singerLonger.voice2.setVolume(0.2);
	singerFat.voice1.setVolume(0.2);
	singerFat.voice2.setVolume(0.2);
	singerPinky.voice1.setVolume(0.2);
	singerPinky.voice2.setVolume(0.2);
	singerTripple.voice1.setVolume(0.2);
	singerTripple.voice2.setVolume(0.2);
  	// bgSound.setVolume(0.5);
  	// bgSound.loop();
}

function draw() {

	background(bgImage);
	singerLonger.perform();
	singerFat.perform();
	singerTripple.perform();
	singerPinky.perform();
  
}

function mousePressed() {
	// var singer = pointInside();
	// if (singer != null) {
	// 	singer.toggleState();
	// }
}

function isInside(x, y, z1, z2, z3, z4) {
    x1 = Math.min(z1, z3);
    x2 = Math.max(z1, z3);
    y1 = Math.min(z2, z4);
    y2 = Math.max(z2, z4);
    return ( (x1 <= x ) && ( x <= x2) && (y1 <= y) && (y <= y2) );
};

function pointInside() {
	var pinkyFrame = singerPinky.frame();
	var trippleFrame = singerTripple.frame();
	var longerFrame = singerLonger.frame();
	var fatFrame = singerFat.frame();

	if (isInside(mouseX, mouseY, pinkyFrame.x, pinkyFrame.y, pinkyFrame.x + pinkyFrame.w, pinkyFrame.y + pinkyFrame.h)) {
		return singerPinky;
	}
	else if (isInside(mouseX, mouseY, trippleFrame.x, trippleFrame.y, trippleFrame.x + trippleFrame.w, trippleFrame.y + trippleFrame.h)) {
		return singerTripple;
	}
	else if (isInside(mouseX, mouseY, longerFrame.x, longerFrame.y, longerFrame.x + longerFrame.w, longerFrame.y + longerFrame.h)) {
		return singerLonger;
	}
	else if (isInside(mouseX, mouseY, fatFrame.x, fatFrame.y, fatFrame.x + fatFrame.w, fatFrame.y + fatFrame.h)) {
		return singerFat;
	}
	else {
		return null;
	}
}

function Singer(id, images, voice1, voice2) {
	this.state = state.idle;
	this.identifier = id;
	this.images = images;
	this.iter = 0;
	this.voice1 = voice1;
	this.voice2 = voice2;

	this.position = function() {
		if (this.identifier == identifier.none) { 
			return {x:0, y:0};
		}
		else if (this.identifier == identifier.longer) {
			return {x:225, y:260};
		}
		else if (this.identifier == identifier.fat) {
			return {x:325, y:305};
		}
		else if (this.identifier == identifier.pink) {
			return {x:670, y:350};
		}
		else if (this.identifier == identifier.tripple) {
			return {x:220, y:280};
		}
	}

	this.size = function() {
		if (this.identifier == identifier.none) {
			return {w:0, h:0};
		}
		else if (this.identifier == identifier.longer) {
			return {w:218, h:450};
		}
		else if (this.identifier == identifier.fat) {
			return {w:421, h:380};
		}
		else if (this.identifier == identifier.pink) {
			return {w:160, h:285};
		}
		else if (this.identifier == identifier.tripple) {
			return {w:238, h:448};
		}
	}

	this.frame = function() {
		return {x:this.position().x - this.size().w/2, y:this.position().y - this.size().h/2, w:this.size().w, h:this.size().h};
	}

	this.toggleState = function() {
		if (this.state == state.idle) {
			this.state = state.singingPart1;
		}
		else if (this.state == state.singingPart1) {
			this.state = state.singingPart2;
		}
		else if (this.state == state.singingPart2) {
			this.state = state.idle;
		}
	}

	this.wiggle = function() {
		if (this.iter > 46) {
			this.sing();
			return;
		}
		else if (this.state == state.idle && this.iter == 0) {
			// Do we have to do anything here?
		}

		image(this.images[this.iter], this.frame().x, this.frame().y);
		this.iter = (this.iter + 1) % 47;
	}

	this.sing = function() {
		if (this.iter < 46) {
			this.wiggle();
			return;
		}
		else if (this.iter == 46) {
			if (this.state == state.singingPart1) {
				this.voice1.play();
			}
			else if (this.state == state.singingPart2) {
				this.voice2.play();
			}
		}

		image(this.images[this.iter + 1], this.frame().x, this.frame().y);
		this.iter = (this.iter + 1) % 93;
		if (this.iter == 0) {
			this.iter = 46;
		}
	}

	this.perform = function() {
		if (this.state == state.idle) {
			this.wiggle();
		}
		else {
			this.sing();
		}
	}
}