
var piano
var synth
var player
var playerWav
var playerWav2

var playSoundButton, loadAllSoundButton;

//playlist implementation
var curSound = 0
var path = "assets/sounds/"
var curSoundArray = []
var stop = false
var playlist = []
var loadedSongs = []
var fileType = ".wav"
var soundArray = []
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
}
function setup(){
	createCanvas(400,400);  
// play button
  playSoundButton = createButton('Play');
  playSoundButton.position(25, 25);
  playSoundButton.mousePressed(playMusic);
  
}
function draw() {

}
function playMusic(){
	computeSoundArray()
	loadNeededSounds()
	startPlaylist()
}

//onended function added to all sounds
function playNext(){
	if(curSound < 15){
		playlist[curSound].play()
		playlist[curSound].onended(playNext)
		curSound +=1
		console.log(playlist[curSound])
		
	}
}

function startPlaylist(){
	curSound = 0
	playNext()
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
function loadNeededSounds(){
	playlist = []
	for(var i = 0; i < curSoundArray.length; ++i){

		//find sound index
		var index = musicArray[i][curSoundArray[i]] - 1
		console.log(index + " index")
		//check if sound was cached
		if(loadedSongs[index] != undefined){
			playlist[i] = loadedSongs[index]
		} else {//not cached need to load the sound and cache it
			loadedSongs[index] = loadSound(path + "M" + (index+1) + fileType)
			playlist[i] = loadedSongs[index]
		}
	}
}

function getIndexFromDices(dice1,dice2){
	return (dice1+dice2)-2//2-12 => 0-10
}

function computeAllDices(){//will be replaced by virtual dices later on

	var dices = []
	for(var i = 0; i < 32; ++i){
		dices.push(getRandomDice())
	}
	return dices
}

function getRandomDice() {
  
  return Math.floor(Math.random() * 5 + 1);
}

function computeSoundArray(){
	//stop music if needed
	stop = true
	curSoundArray = [] //reinit sound array
	var dices = computeAllDices()
	for(var i = 0; i < 32; i+=2){

		var dice1 = dices[i]
		var dice2 = dices[i+1]

		curSoundArray.push(getIndexFromDices(dice1,dice2))
	}
	stop = false
}


