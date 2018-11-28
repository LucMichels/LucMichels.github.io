

window.onload = function () {
	var MidiPlayer = require('[midiplayer.min]');
	 
	// Initialize player and register event handler
	var Player = new MidiPlayer.Player(function(event) {
	    console.log(event);
	});
	 
	// Load a MIDI file
	Player.loadFile('./assets/0/cda070.mid');
	Player.play();
};