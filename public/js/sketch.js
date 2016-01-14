// carolapp
// an2netto
// https://carol-dudes.herokuapp.com/

var identifier = {
	none: {value:0, name:"none", color:[], position:[0, 0], vol:0.0},
	pink: {value:1, name:"pink", color:[240, 185, 197], position:[335, 175], vol:0.2},
	tripple: {value:2, name:"tripple", color:[161, 161, 211], position:[140, 145], vol:0.1},
	fat: {value:3, name:"fat", color:[236, 227, 159], position:[192, 152], vol:0.15},
	longer: {value:4, name:"longer", color:[245, 126, 122], position:[142, 130], vol:0.2},
	green: {value:5, name:"green", color:[141, 198, 159], position:[280, 140], vol:0.15},
	small: {value:6, name:'small', color:[233, 223, 147], position:[355, 218], vol:0.1},
	white: {value:7, name:'white', color:[255, 255, 255], position:[222, 173], vol:0.3}
}

var bgSound, bgImage;
var singers = [];
var snow = [];
var masterClock = 0;

function preload() {

	var longerImgs = [], fatImgs = [], pinkyImgs = [], trippleImgs = [], greenImgs = [], smallImgs = [], whiteImgs = [];
	var format;
	for (var i = 0; i < 94; i++) {
		format = nf(i, 4) + ".png";
		longerImgs[i] = loadImage("../dudes/long/long_" + format);
		fatImgs[i] = loadImage("../dudes/fat/fat_" + format);
		pinkyImgs[i] = loadImage("../dudes/pink/pink_" + format);
		trippleImgs[i] = loadImage("../dudes/tripple/tripple_" + format);
		greenImgs[i] = loadImage("../dudes/green/green_" + format);
		smallImgs[i] = loadImage("../dudes/small/small_" + format);
		whiteImgs[i] = loadImage("../dudes/white/white_" + format);
		snow[i] = loadImage("../snow/snow_" + format);
	}

	// layout depends on order in which singers are initialized
	singers[0] = new Singer(identifier.longer, longerImgs, loadSound("../voices/long1.mp3"), loadSound("../voices/long2.mp3"));
	singers[1] = new Singer(identifier.green, greenImgs, loadSound("../voices/green1.mp3"), loadSound("../voices/green2.mp3"));
	singers[2] = new Singer(identifier.fat, fatImgs, loadSound("../voices/fat1.mp3"), loadSound("../voices/fat2.mp3"));
	singers[3] = new Singer(identifier.pink, pinkyImgs, loadSound("../voices/pink1.mp3"), loadSound("../voices/pink2.mp3"));
	singers[4] = new Singer(identifier.white, whiteImgs, loadSound("../voices/white1.mp3"), loadSound("../voices/white2.mp3"));
	singers[5] = new Singer(identifier.tripple, trippleImgs, loadSound("../voices/tripple1.mp3"), loadSound("../voices/tripple2.mp3"));
	singers[6] = new Singer(identifier.small, smallImgs, loadSound("../voices/small1.mp3"), loadSound("../voices/small2.mp3"));

	bgImage = loadImage("../bg.png");
	// bgSound = loadSound('');
}

function setup() {
	createCanvas(480, 270);
  	frameRate(25);

  	console.log('in setup');
}

function draw() {
	background(bgImage);
	
	for (var i = 0; i < singers.length; i++) { singers[i].perform(); }
	image(snow[masterClock]);

	masterClock = (masterClock + 1) % 94;
}

function mousePressed() {
	var col = pixelColor(mouseX, mouseY);

	for (var i = 0; i < singers.length; i++) {
		if (isEqualColor(col, singers[i].identifier.color)) {
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
		return {x:this.identifier.position[0], y:this.identifier.position[1]};
	}

	this.size = function() {
		return {w:this.images[0].width, h:this.images[0].height};
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
	this.voice1.setVolume(this.identifier.vol);
	this.voice2.setVolume(this.identifier.vol);
}

function isEqualColor(color, colorArray) {
	return (red(color) == colorArray[0] && green(color) == colorArray[1] && blue(color) == colorArray[2]);
}

function pixelColor(x, y) {
	loadPixels();
	var d = pixelDensity();
	var idx;
	for (var i = 0; i < d; i++) {
	  for (var j = 0; j < d; j++) {
	    // loop over
	    idx = 4 * ((y * d + j) * width * d + (x * d + i));
	    return color(pixels[idx], pixels[idx+1], pixels[idx+2], pixels[idx+3]);
	  }
	}
}
