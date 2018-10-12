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
var sound
var perimeter
var boxSide
var minLightDist = 10
var lightDist = 90
var lightDensity = 100
var barray = []
var mean = 3226.5308284196417
var meanDev = 1351.2642225570344
var lowMap = mean - 2 * meanDev
var highMap = mean + 2 * meanDev
//20 is lowest, 20K is highest hearable by human
function preload(){
		soundFormats('mp3');
		//sound = loadSound('assets/AdhesiveWombat - 8 Bit Adventure.mp3');
		sound = loadSound('assets/queen-bohemian-rhapsody-official-video.mp3');
	  
	}

function setup() {
	
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

	sound.play()
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

	addLights()
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
	for(i = 0; i < lightDensity ; ++i){
		
		var randomDist = minLightDist + Math.random()*lightDist //for point light
		var randomDirection = p5.Vector.random3D().normalize()
		print(randomDist+sphereRadius)
		var position = randomDirection*mult(randomDist+sphereRadius) //for point light
		
		var randomColor = color(round(Math.random()*255), round(Math.random()*255), round(Math.random()*255))

		pointLight(randomColor, position)

		//var randomDirection = p5.Vector.random3D().normalize()
		//var randomColor = color(round(Math.random()*255), round(Math.random()*255), round(Math.random()*255))

		//directionalLight(randomColor, randomDirection.mult(-1))

	}
}

function doubleClicked() {
	print(jStat.stdev(barray))
	
	print(jStat.mean( barray ))
	print(jStat.meandev( barray ))
	print(jStat.median( barray ))
	
	print(jStat.meddev( barray ))

	print(jStat.quartiles(barray))
	
}
