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
var freqsRanges = [20, 40 ,63, 100, 125, 179,250,375, 500, 750,1000, 1500,2000, 3000,4000,6500 ,9000,15000, 20000]//[20, 63, 125, 250, 500, 1000, 2000, 4000, 9000, 20000]
var freqSmoothing = 0.7
var fft
var sound
var perimeter
var boxSide
var lightBoxSide
var lightDensity
//20 is lowest, 20K is highest hearable by human
function preload(){
		soundFormats('mp3');
		//sound = loadSound('assets/AdhesiveWombat - 8 Bit Adventure.mp3');
		sound = loadSound('assets/queen-bohemian-rhapsody-official-video.mp3');
	  
	}

function setup() {
	
	createCanvas(windowWidth, windowHeight,WEBGL)
	padding = QUARTER_PI/10
	minAngle = -HALF_PI+padding
	maxAngle = HALF_PI-padding
	sphereRadius = windowHeight/7
	minBoxDepth = sphereRadius*2
	perimeter = TWO_PI*sphereRadius
	lightBoxSide = sphereRadius*0.5

	initArray()
	boxSide = (1/freqBrightnessAmpArray.length)*0.33 *perimeter

	sound.play()
	fft = new p5.FFT()
	fft.setInput(sound)
	
}

function draw() {

	var spectrum = fft.analyze()
	var brightness = fft.getCentroid()
	print(ceil(map(brightness,0,20000,0,freqBrightnessAmpArray.length,true)))
	updateArray(ceil(map(brightness,0,20000,0,freqBrightnessAmpArray.length,true)))

	background(0)
	specularMaterial(255)
	fill(0)
	push()
	translate(windowWidth/2,windowHeight/2,-3*sphereRadius)
  	box(windowWidth,windowHeight,1)
  	pop()
	pointLight(250, 250, 250, 100, 100, 0)
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
	
	pop()
}

function	drawSound() {
	push()
	rotateY(padding)
	
	for(angleX = minAngle, i = 0;angleX <= maxAngle; angleX = angleX + 2*padding, ++i){
		
		push()
		rotateX(angleX)
		for(angleY = minAngle, k = 0;angleY <= maxAngle; angleY = angleY + 2*padding, ++k){

			if(k == 4){
				rotateY(2*padding)
				
			} else {
				rotateY(2*padding)
				var boxSize = map(freqBrightnessAmpArray[i][k],0,255,1,4)*minBoxDepth

				box(boxSide,boxSide,boxSize)
			}
			
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

			
			print(maxK)
			for(k = 0; k < maxK;++k){

				var freqLowerBound = freqsRanges[k]
				var freqHighBound = freqsRanges[k+1]
				print(freqLowerBound)
				print(freqHighBound)
				var newAmp = fft.getEnergy(freqLowerBound,freqHighBound)
				var oldAmp = freqBrightnessAmpArray[i][k]
				if(newAmp < oldAmp){
					freqBrightnessAmpArray[i][k] = newAmp
				} else {
					freqBrightnessAmpArray[i][k] = oldAmp * freqSmoothing + (1-freqSmoothing)*newAmp 
				}
			}
		} else {
			for(k = 0; k < maxK;++k){
				freqBrightnessAmpArray[i][k] *= freqSmoothing 
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