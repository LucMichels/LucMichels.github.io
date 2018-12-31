var loggedCorpsesExplodedInTime = []
var loggedCastSpeed = []
var loggedResults = []
var simulating = true
var maxAttacks = 200
var totCorpses = 0
var totProc = 0
var baseAS
var addedAS
var corpsesPerProc
var maxAttacks
var simulationDuration
var hasMultistrike
var multistrikeLevelMultiplier

function initConstants(){
	baseAS = Number(document.getElementById("myBaseAS").value )
	addedAS = Number(document.getElementById("addedAS").value)
	corpsesPerProc = Number(document.getElementById("myCorpsePerConsume").value )
	maxAttacks =  Number(document.getElementById("maxAttacks").value)
	simulationDuration =  Number(document.getElementById("simulationDuration").value)
	hasMultistrike = document.getElementById("multistrike").checked
	multistrikeLevelMultiplier = Number(document.getElementById("multistrikeMultiplier").value)
	if(hasMultistrike){
		baseAS *= multistrikeLevelMultiplier
	}
}
function simulate(lastCastSpeed,time,corpses, attacks) {

	if(simulating && attacks < maxAttacks && simulationDuration > time ){
		//log entry of last cast
		var newCorpses = 0
		var log = new TimeCorpses(time,corpses)
		loggedCorpsesExplodedInTime.push(log)

		//find new variables
		
		if(Math.random() <= 0.3){	
			newCorpses = corpsesPerProc
			totCorpses += newCorpses
			totProc+=1
		} 
		var newCastSpeed = findNextCastSpeed(lastCastSpeed, time, newCorpses)
		 
		var newTime = findTimeElapsed(newCastSpeed) + time
		
		//print values
		var result = "Current cast speed is " + newCastSpeed + " at " + newTime + " seconds after " + (attacks+1) + " attacks"
		console.log(result)
		//log results 
		loggedResults.push(result)
		loggedCastSpeed.push(newCastSpeed)
		//reiterate

		if(hasMultistrike){
			simulate(newCastSpeed, newTime+2*findTimeElapsed(newCastSpeed), newCorpses, attacks+3)
		} else {
			simulate(newCastSpeed, newTime, newCorpses, attacks+1)
		}
		
	} else {
		showResults(lastCastSpeed,time,corpses, attacks)
	}
	
	
	


}

function showResults(lastCastSpeed,time,corpses, attacks) {
	simulating = false
	//padding
	console.log("Simulation stopped.\nShowing Results with " + addedAS + " base added cast/attack speed\nThe base attack/cast speed of your attack/spell is " + (baseAS * (1+addedAS )) +" attacks/casts per second")

	//show first 10 attacks
	console.log("First 10 procs: \n")
	for(var i = 0; i < 10; ++i){
		console.log(loggedResults[i])
	}

	//show next 5 attacks with 10 attacks in between
	console.log("Next 15 procs with 10 procs in between each: \n")
	for(var i = 2; i < 17; ++i){
		console.log(loggedResults[i*10-1])
	}
	//show average
	

	var speed = 0
	for (var i = 0; i < loggedCastSpeed.length; ++i){
		speed += loggedCastSpeed[i]
	}
	var avg = (speed/loggedCastSpeed.length)
	console.log("Average cast speed is " + avg)
	//show max
	var max = Math.max.apply(null, loggedCastSpeed)
   	console.log( "Max cast speed is "+ max )

   	
   	console.log("This means than on average your attack/cast speed has been multiplied by " + (avg/baseAS) + "\n with a maximum multplier of " +(max/baseAS ))
   	//see consume procs per second
   	var len = loggedCorpsesExplodedInTime.length
	
	console.log("We have a total of " + totProc + " procs for a total of " +totCorpses+ " corpses consumed")
	console.log("Procs per seconds is " + (totProc/time) + " on average")
}
function restartSimulation(){
	initConstants()
	loggedCorpsesExplodedInTime = []
	loggedCastSpeed = []
	loggedResults = []
	simulating = true
	totProc = 0
	totCorpses = 0
	simulate(baseAS,0 , 0, 0)
}

function findNextCastSpeed(lastCastSpeed, curTime, corpses) {
	
	var len = loggedCorpsesExplodedInTime.length
	var corpseConsumed = 0
	for(var i = 0; i < len; ++i){
		var tupple = loggedCorpsesExplodedInTime[i]
		var time = tupple.time
		var corpsesCons = tupple.corpses

		if(time >= curTime - 4 && curTime - time > 0.1){
			console.log(" time: " + time +", corpses: " + corpsesCons)//helllo
			corpseConsumed += corpsesCons

		}
		
	}
	var corpseAddedAttackSpeed = corpseConsumed*0.02
	var castSpeedAddedByCorpses = addedAS + corpseAddedAttackSpeed
	
	console.log("Added attack speed from corpses is "+ corpseAddedAttackSpeed )
	console.log("From the total attack/cast speed " + ( corpseAddedAttackSpeed*100/(corpseAddedAttackSpeed+addedAS)) + "% was added from corpses")
	console.log("We have consumed " + corpseConsumed + " corpses")
	return baseAS * (1 + castSpeedAddedByCorpses)
}

function findTimeElapsed(lastCastSpeed) {
	return (1/lastCastSpeed)
}

class TimeCorpses {
    constructor(Time, Corpses) {
        this.time = Time;
        this.corpses = Corpses;
    }
}