// Learning p5.js
// an2netto
// https://carol-dudes.herokuapp.com/

var identifier = {
	none: {value:0, name:"none", color:[]},
	pink: {value:1, name:"pink", color:[240, 185, 197]},
	tripple: {value:2, name:"tripple", color:[161, 161, 211]},
	fat: {value:3, name:"fat", color:[236, 227, 159]},
	longer: {longer:4, name:"longer", color:[245, 126, 122]}
}

var bgSound, bgImage;
var singerPinky, singerTripple, singerFat, singerLonger;
var singers = [];
var masterClock = 0;

function preload() {

	var longerImgs = [], fatImgs = [], pinkyImgs = [], trippleImgs = [];
	for (var i = 0; i < 94; i++) {
		longerImgs[i] = loadImage("../dudes/long/long_" + nf(i, 4) + ".png");
		fatImgs[i] = loadImage("../dudes/fat/fat_" + nf(i, 4) + ".png");
		pinkyImgs[i] = loadImage("../dudes/pink/pink_" + nf(i, 4) + ".png");
		trippleImgs[i] = loadImage("../dudes/tripple/tripple_" + nf(i, 4) + ".png");
	}

	singers[0] = new Singer(identifier.longer, longerImgs, loadSound("../voices/voice_long1.ogg"), loadSound("../voices/voice_long2.ogg"));
	singers[1] = new Singer(identifier.fat, fatImgs, loadSound("../voices/voice_fat1.ogg"), loadSound("../voices/voice_fat2.ogg"));
	singers[2] = new Singer(identifier.pink, pinkyImgs, loadSound("../voices/voice_pink1.ogg"), loadSound("../voices/voice_pink2.ogg"));
	singers[3] = new Singer(identifier.tripple, trippleImgs, loadSound("../voices/voice_tripple1.ogg"), loadSound("../voices/voice_tripple2.ogg"));

	bgImage = loadImage("../bg_0000.png");
	// bgSound = loadSound("../bg.ogg");
}

function setup() {
	createCanvas(960, 540);
  	frameRate(25);

  	// bgSound.setVolume(0.5);
  	// bgSound.loop();
}

function draw() {
	background(bgImage);
	for (var i = 0; i < singers.length; i++) { singers[i].perform(); }

	masterClock = (masterClock + 1) % 94;
}

function mousePressed() {
	var pixelColor = get(mouseX, mouseY);
	for (var i = 0; i < singers.length; i++) {
		if (isEqualColor(pixelColor, singers[i].identifier.color)) {
			singers[i].toggleState();
			break;
		}
	}
}

var Singer = function(id, images, voice1, voice2) {
	this.identifier = id;
	this.voice1 = voice1;
	this.voice2 = voice2;
	this.images = images;
	this.init();

	var _currentStateValue = 0;
	var _nextStateValue = 0;
	var _shouldToggleState = false;

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
		_nextStateValue = (_nextStateValue + 1) % 3;
		_shouldToggleState = (_nextStateValue != _currentStateValue);
	}

	this.perform = function() {
		if (masterClock == 0 && _shouldToggleState) {
			_currentStateValue = _nextStateValue;
			_shouldToggleState = false;
		}

		switch (_currentStateValue) {
			case 1:
				image(this.images[(masterClock + 47) % 94], this.frame().x, this.frame().y);
				if (masterClock == 0) { this.voice1.play(); }
				break;
			case 2:
				image(this.images[masterClock], this.frame().x, this.frame().y);
				if (masterClock == 47) { this.voice2.play(); }
				break;
			default:
				image(this.images[masterClock % 47], this.frame().x, this.frame().y);
				break;
		}
	}
}

Singer.prototype.init = function() {
	this.voice1.setVolume(0.2);
	this.voice2.setVolume(0.2);
}

function isEqualColor(c1, c2) {
	return (c1[0] == c2[0] && c1[1] == c2[1] && c1[2] == c2[2]);
}