

window.onload = function () {
	// load a midi file
	MidiConvert.load("assets/0/cda010.mid", function(midi) {
	  console.log("intru nb" + midi.instrumentNumber)
	  console.log("intru fam" +midi.instrumentFamily)
	  console.log("intru " +midi.instrument)

	})
	var synth = new Tone.PolySynth(8).toMaster()

	MidiConvert.load("assets/0/cda070.mid", function(midi) {

		midi.instrumentNumber = 1
		
		midi.instrumentFamily = "Acoustic_Grand_Piano"

		midi.instrument = "Piano"
		var piano = SampleLibrary.load({
		  instruments: "piano"
		  });
		  
		 piano.toMaster();
		 for(int i =0; i = 200000; ++i){
		 	if(i%2 == 0){

		 	} else {
		 		
		 	}
		 }
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
};