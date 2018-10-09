var rotation = 0
var minAngle
var maxAngle
var smoothing = 100
var sphereRadius 
var minBoxDepth
var maxBoxDepth
var ambiantLight = 60
var padding

function preload(){
  //sound = loadSound('assets/Damscray_DancingTiger.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight,WEBGL);
	padding = QUARTER_PI/6
	minAngle = -HALF_PI+padding
	maxAngle = HALF_PI-padding
	sphereRadius = windowHeight/7
	minBoxDepth = sphereRadius*2
	maxBoxDepth = 2*minBoxDepth

	mic = new p5.AudioIn();
	mic.start()
	fft = new p5.FFT();
	fft.setInput(mic);
}

function draw() {
	background(0)
	specularMaterial(255)
	fill(0)
  	box(windowWidth,windowHeight,1,windowWidth/2,windowWidth/2,-windowWidth)
	pointLight(250, 250, 250, 100, 100, 0);
	ambientLight(ambiantLight);
	c = color('#080808')
	fill(c)
	specularMaterial(250)
	push()
	if(mouseIsPressed){
		rotation = (mouseX - height / 2)/smoothing
	}
	rotateY(rotation)
	
	drawSound()
	
	pop()
}

function	drawSound() {
	push()
	
	rotateY(padding)
	
	for(angleX = minAngle;angleX <= maxAngle; angleX = angleX + 2*padding){
		push()
		rotateX(angleX)
		for(angleY = minAngle;angleY <= maxAngle; angleY = angleY + 2*padding){
			rotateY(2*padding)
			box(20,20,minBoxDepth)
		}
		pop()
	}
	pop()
}