
var piano
var synth
var player
var playerWav
var playerWav2

var playSoundButton, loadAllSoundButton;


//score drawing
var MESURE_WIDTH = 110
var MESURE_HEIGHT = 120
//init in setup where window dimentions are
var SCORE_X_START
var SCORE_Y_END

//playlist implementation


var wasDrawn = false
var imagePath = 'assets/scores/'
var imageFormat = '.png'
var curSound = 0
var path = "assets/sounds/"
var curSoundArray = []
var stop = false
var playlist = []
var loadedSongs = []
var fileType = ".wav"
var soundArray = []
var playing = false
var curMesure
var dices = []
var backgroundPath = "assets/background/mozart.jpg"
var musicArray = [
[96,32,69,40,148,104,152,119,98,3,54],
[22,6,95,17,74,157,60,84,142,87,130],
[141,128,158,113,163,27,171,114,42,165,10],
[41,63,13,85,4,167,53,50,156,61,103],
[105,146,153,161,80,154,99,140,75,135,28],
[122,46,55,2,97,68,133,86,129,47,37],
[11,134,110,159,36,118,21,169,62,147,106],
[30,81,24,100,107,91,127,94,123,33,5],
[70,117,66,90,25,138,16,120,65,102,35],
[121,39,139,176,143,71,155,88,77,4,20],
[26,126,15,7,64,150,57,48,19,31,108],
[9,56,132,34,125,29,175,166,82,164,92],
[112,174,73,67,76,101,43,51,137,144,12],
[49,18,58,160,136,162,168,115,38,59,124],
[109,116,145,52,1,23,89,72,149,173,44],
[14,83,79,170,93,151,172,111,8,78,131]
]

function preload(){
	loadAllSounds()
	loadAllImages()
}
function setup(){
	//init all constant variables
	SCORE_X_START = window.innerWidth/6
	SCORE_Y_START = window.innerHeight/4
	createCanvas(window.innerWidth, window.innerHeight);  
// play button
  playSoundButton = createButton('Play');
  playSoundButton.position(25, 25);
  playSoundButton.mousePressed(playMusic);
  
}
function draw() {
	if(playing && !wasDrawn){
		drawMozart()
		drawScore()
		wasDrawn = true
	}
}
function drawMozart(){
	var elem = new p5.Element(createImg(backgroundPath).elt)
}
function playMusic(){
	computeAllDices()
	computeSoundArray()
	
	loadNeededSounds()
	startPlaylist()
}

//onended function added to all sounds
function playNext(){
	if(curSound < 15 && playing){
		playing = true
		curMesure = playlist[curSound]
		curMesure.play()
		curMesure.onended(playNext)
		curSound +=1
		console.log(playlist[curSound])
		
	} else {
		playing = false
	}
}
function startPlaylist(){
	wasDrawn = false
	curSound = 0
	playing = true
	playNext()
}
function getElement(index){
	return new p5.Element(createImg(imagePath + index + imageFormat).elt)
}
function drawScore(){
	var x = SCORE_X_START
	var y = SCORE_Y_START
	//first part dice rolls

	//first part mesures
	for(var i = 0; i < 8; ++i){
		var index = getIndexOf(i)
		var element = getElement(index)
		element.position(x,y)
		x += MESURE_WIDTH

	}
	//go down 
	y+=(2*MESURE_HEIGHT)
	x = SCORE_X_START
	//second part dice rolls

	//second part mesures
	for(var i = 8; i < 16; ++i){
		var index = getIndexOf(i)
		var element = getElement(index)
		element.position(x,y)
		x += MESURE_WIDTH
	}
}

function loadAllSounds(){
	for(let i = 0; i<176; ++i){
		//check if not already cached; if not: cache it
		console.log(i + " loaded")
		if(loadedSongs[i] == undefined){
			loadedSongs[i] = loadSound(path + "M" + (i+1) + fileType)
		}
	}
}

function getIndexOf(i){
	return musicArray[i][curSoundArray[i]] - 1
}
function loadNeededSounds(){
	playlist = []
	for(var i = 0; i < curSoundArray.length; ++i){

		//find sound index
		var index = getIndexOf(i)
		
		playlist[i] = loadedSongs[index]
		
	}
}

function getIndexFromDices(dice1,dice2){
	return (dice1+dice2)-2//2-12 => 0-10
}

function computeAllDices(){//will be replaced by virtual dices later on

	dices = []
	for(var i = 0; i < 32; ++i){
		dices.push(getRandomDice())
	}
	return dices
}

function getRandomDice() {
  
  return Math.floor(Math.random() * 5 + 1);
}

function computeSoundArray(){
	curSoundArray = [] //reinit sound array
	
	for(var i = 0; i < 32; i+=2){

		var dice1 = dices[i]
		var dice2 = dices[i+1]

		curSoundArray.push(getIndexFromDices(dice1,dice2))
	}

}


