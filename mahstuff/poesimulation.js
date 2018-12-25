var loggedCorpsesExplodedInTime = []
var loggedCastSpeed = []
var loggedResults = []
var BASE_CAST_SPEED = 3//in cast per second
var BASE_ADDED_CAST_SPEED = 0.15
var simulating = true
var maxAttacks = 200
//please update

function simulate(lastCastSpeed,time,corpses, attacks) {
	if(simulating && attacks < maxAttacks){
		//log entry of last cast
		var newCorpses = 0
		var log = new TimeCorpses(time,corpses)
		loggedCorpsesExplodedInTime.push(log)

		//find new variables
		
		if(Math.random() <= 0.3){	
			newCorpses = Number(document.getElementById("myCorpsePerConsume").value )
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
		simulate(newCastSpeed, newTime, newCorpses, attacks+1)
	} else if (attacks >= maxAttacks){
		showResults()
	}
	
	
	


}

function showResults() {
	simulating = false
	//padding
	console.log("Simulation stopped.\nShowing Results with " + document.getElementById("myText").value + " base cast speed\n" + "The base attack/cast speed of your attack/spell is " + (Number(document.getElementById("myBaseAS").value ) * (1+Number(document.getElementById("myText").value ))) +" attacks/casts per second")

	//show first 10 attacks
	console.log("First 10 attacks: \n")
	for(var i = 0; i < 10; ++i){
		console.log(loggedResults[i])
	}

	//show next 5 attacks with 10 attacks in between
	console.log("Next 15 attacks with 10 attacks in between each: \n")
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

   	console.log("This means than on average unearth cast speed has been multiplied by " + (avg/Number(document.getElementById("myBaseAS").value )) + "\n with a maximum multplier of " +(max/Number(document.getElementById("myBaseAS").value )))

   	//see consume procs per second
   	var totProc = 0
   	var len = loggedCorpsesExplodedInTime.length
	for(var i = 0; i < len; ++i){
		var tupple = loggedCorpsesExplodedInTime[i]
		var time = tupple.time
		var corpses = tupple.corpses

		if(corpses > 0){
			totProc ++

		}
		
	}
	console.log("Procs per seconds is " + (totProc/loggedCorpsesExplodedInTime[len-1].time) + " on average")
}
function restartSimulation(){
	loggedCorpsesExplodedInTime = []
	loggedCastSpeed = []
	loggedResults = []
	simulating = true
	simulate(Number(document.getElementById("myBaseAS").value ),0 , 0, 0)
}

function findNextCastSpeed(lastCastSpeed, curTime, corpses) {
	var castSpeedAddedByCorpses = Number(document.getElementById("myText").value )
	var len = loggedCorpsesExplodedInTime.length
	for(var i = 0; i < len; ++i){
		var tupple = loggedCorpsesExplodedInTime[i]
		var time = tupple.time
		var corpses = tupple.corpses

		if(time >= curTime - 4){
			console.log(" time: " + time +", corpses: " + corpses)//helllo
			castSpeedAddedByCorpses += corpses*0.02
		}
		
	}
	console.log("added attack speed is "+ corpses*0.02 + " with "+document.getElementById("myCorpsePerConsume").value + " corpses")

	return Number(document.getElementById("myBaseAS").value ) * (1 + castSpeedAddedByCorpses)
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