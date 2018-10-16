var rotation = 0
var minAngle
var maxAngle
var smoothing = 100
var sphereRadius 
var minBoxDepth
var maxBoxDepth
var ambiantLight = 60
var padding
var rotationRate = 0.0075
var freqBrightnessAmpArray = []
var freqsRanges = [20, 63, 125, 250, 500, 1000, 2000, 4000, 9000, 20000]//[20, 40 ,63, 100, 125, 179,200,250,375, 500, 750,1000,1250, 1500,2000,2500, 3000,4000,6500 ,9000,15000, 20000]
var freqSmoothing = 0.5
var residualSmoothing = 0.95
var fft
var perimeter
var boxSide
var minLightDist = 10
var lightDist = 90
var lightDensity = 7
var barray = []
var mean = 5477.654299295019
var meanDev = 1637.9633714177144
var lowMap = Math.max(mean - 2.2 * meanDev,0)
var highMap = Math.min(mean + 2.2 * meanDev, 20000)
var lastAmp
var amplitude
var beatTime = 0
var beat = 468.75
var time
var ptime = 0
var play
var pause
var restart
var beatSave = 0


var lightArray = []
//20 is lowest, 20K is highest hearable by human
function preload(){
		soundFormats('mp3');
		//sound = loadSound('assets/AdhesiveWombat - 8 Bit Adventure.mp3');
		//sound = loadSound('assets/queen-bohemian-rhapsody-official-video.mp3');
		sound = loadSound('assets/bensound-clearday.mp3');
	  
	}

function setup() {
	
	//buttons
	play = createButton('start')
	play.position(19, 89);
 	play.mousePressed(playing);
	pause = createButton('pause')
	pause.position(105, 89);
 	pause.mousePressed(pausing);
	//restart = createButton('restart');
	//restart.position(19, 19);
 	//restart.mousePressed(restart);
	//text
	
	

	//init
	createCanvas(windowWidth, windowHeight,WEBGL)
	padding = QUARTER_PI/5
	minAngle = -HALF_PI+padding
	maxAngle = HALF_PI-padding
	sphereRadius = windowHeight/7
	minBoxDepth = sphereRadius*2
	perimeter = TWO_PI*sphereRadius
	lightBoxSide = sphereRadius*0.5

	initArray()
	boxSide = (1/freqBrightnessAmpArray.length)*0.33 *perimeter

	
	amplitude = new p5.Amplitude();
	
	fft = new p5.FFT()
	fft.setInput(sound)
	
}

function draw() {

	var spectrum = fft.analyze()
	var brightness = fft.getCentroid()

	if(round(map(brightness,lowMap,highMap,0,freqBrightnessAmpArray.length,true))>0){
		barray.push(brightness)
	}


	
	updateArray(round(map(brightness,lowMap,highMap,0,freqBrightnessAmpArray.length,true)))

	



	background(0)
	
	specularMaterial(255)
	//fill(0)
	//push()
	//translate(windowWidth/2,windowHeight/2,-3*sphereRadius)
  	//box(windowWidth,windowHeight,1)
  	//pop()
	//pointLight(250, 250, 250, 100, 100, 0)
	ambientLight(ambiantLight)
	c = color('#080808')
	fill(c)
	specularMaterial(250)
	push()
	rotation += rotationRate
	if(mouseIsPressed){
		//rotation = (mouseX - height / 2)/smoothing
		rotation += (mouseX - pmouseX)/smoothing
	}
	rotateY(rotation)
	drawSound()
	if(sound.isPlaying()){
		
		drawBeat()
		addLights()
	}
	

	pop()

	
}


function	drawSound() {
	push()
	rotateY(padding)
	
	for(angleX = minAngle, i = 0;angleX <= maxAngle; angleX = angleX + 2*padding, ++i){
		
		push()
		rotateX(angleX)
		for(angleY = minAngle, k = 0;angleY <= maxAngle; angleY = angleY + 2*padding, ++k){

			rotateY(2*padding)
			var boxSize = map(freqBrightnessAmpArray[i][k],0,255,1,4)*minBoxDepth

			box(boxSide,boxSide,boxSize)
			
		}
		pop()
	}
	pop()
}

function updateArray(brightnessPos){
	var maxK = freqBrightnessAmpArray[0].length
	var maxI = freqBrightnessAmpArray.length
	for(i = 0; i < maxI;++i){

		if(i == brightnessPos){

			
			
			for(k = 0; k < maxK;++k){

				var freqLowerBound = freqsRanges[k]
				var freqHighBound = freqsRanges[k+1]
				var newAmp = fft.getEnergy(freqLowerBound,freqHighBound)
				var oldAmp = freqBrightnessAmpArray[i][k]
				if(newAmp > oldAmp){
					freqBrightnessAmpArray[i][k] = newAmp
				} else {
					freqBrightnessAmpArray[i][k] = oldAmp * freqSmoothing + (1-freqSmoothing)*newAmp 
				}
			}
		} else {
			for(k = 0; k < maxK;++k){
				freqBrightnessAmpArray[i][k] *= residualSmoothing 
			}
		}
		
	}
}

function initArray(){
	for(angleX = minAngle;angleX <= maxAngle; angleX = angleX + 2*padding){

		var l = []
		for(angleY = minAngle;angleY <= maxAngle; angleY = angleY + 2*padding){
			l.push(0)
		}
		freqBrightnessAmpArray.push(l)
	}

}

function addLights(){

	time = millis()
	beatTime += time - ptime
	ptime = time
	var newAmp = amplitude.getLevel()
	if(beatTime > beat){//newAmp > lastAmp
		beatTime = 0

		updateLights()
	}
	lastAmp = newAmp
	var len = lightArray.length
	for(i =0; i<len;++i){
		directionalLight(lightArray[i][0], lightArray[i][1])
	}
	
}

function updateLights(){
	lightArray = []
	for(i = 0; i < lightDensity ; ++i){
		
		//var randomDist = minLightDist + Math.random()*lightDist //for point light
		//var randomDirection = p5.Vector.random3D().normalize()
		
		//var position = randomDirection.mult(randomDist+sphereRadius) //for point light
		
		//var randomColor = color(round(Math.random()*255), round(Math.random()*255), round(Math.random()*255))

		//pointLight(randomColor, position)

		var randomDirection = p5.Vector.random3D().normalize()
		var randomColor
		if(Math.random()<0.33){
			randomColor = color(255, 0, 0)
		} else if (Math.random()<0.66){
			randomColor = color(0, 255, 0)
		} else {
			randomColor = color(0, 0, 255)
		}
		 
		lightArray.push([randomColor,randomDirection])
		

	}
}

function doubleClicked() {
	print(jStat.stdev(barray))
	
	print(jStat.mean( barray ))

	
}

function drawBeat(){
	sphere(map(beatTime,0,beat,sphereRadius*0.5,sphereRadius*0.95))
}

function playing(){
	sound.stop()
	sound.play()
	play.html('restart')
	beatTime = 0 
}
function pausing(){
	if(sound.isPlaying()){
		sound.pause()
		pause.html('resume')
		beatSave = beatTime
	} else {
		sound.play()
		pause.html( 'pause') 
		beatTime = beatSave
	}
}