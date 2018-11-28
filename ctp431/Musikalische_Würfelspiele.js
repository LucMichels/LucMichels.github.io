

window.onload = function () {
	var fs = require('fs');
	 
	// Initialize player and register event handler
	var Player = new MidiPlayer.Player(function(event) {
	    console.log(event);
	});
	 
	// Load a MIDI file
	Player.loadFile('./assets/0/cda070.mid');
	Player.play();
};