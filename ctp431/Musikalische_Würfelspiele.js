
var piano
var synth
var player
var playerWav
var playerWav2
window.onload = function () {
	// load a midi file
	MidiConvert.load("assets/0/cda010.mid", function(midi) {
	  console.log("intru nb" + midi.instrumentNumber)
	  console.log("intru fam" +midi.instrumentFamily)
	  console.log("intru " +midi.instrument)

	})
	synth = new Tone.PolySynth(8).toMaster()
	piano = SampleLibrary.load({
		  instruments: "piano"
		  });
		  
	piano.toMaster();
	player = new Tone.Player("./assets/0/cda070.mp3", function(){
	//the player is now ready	
	}).toMaster();
	playerWav = new Tone.Player("./assets/0/cda070.wav").toMaster();
	playerWav2 = new Tone.Player("./assets/test/cda070.wav").toMaster();
	
};

function playMusic(){
	MidiConvert.load("assets/0/cda070.mid", function(midi) {
		
	  // make sure you set the tempo before you schedule the events
	  Tone.Transport.bpm.value = midi.header.bpm
	  
	  // pass in the note events from one of the tracks as the second argument to Tone.Part 
	  var midiPart = new Tone.Part(function(time, note) {

	    //use the events to play the synth
	    piano.triggerAttackRelease(note.name, note.duration, time, note.velocity)

	  }, midi.tracks[0].notes).start()

	  // start the transport to hear the events
	  Tone.Transport.start()
	})
}
function playMP3(){
	player.start()
}
function playWAV(){
	playerWav.start()
	player.buffer.onended = playWAV2 
}
function playWAV2(){
	playerWav2.start()
}