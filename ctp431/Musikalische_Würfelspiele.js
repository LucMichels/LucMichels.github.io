var player = MIDI.player

window.onload = function () {
	MIDI.loadPlugin({
		soundfontUrl: "http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/",
		instrument: "acoustic_grand_piano",
		onprogress: function(state, progress) {
			console.log(state, progress);
		},
		onsuccess: function() {

			player = MIDI.player;
			player.timeWarp = 1; // speed the song is played back
			player.loadFile("assets/0/cda010.mid", player.start);
			//player.getNextSong = function(n) {
				
			//	player.loadFile("assets/0/cda010.mid", player.start); // load MIDI
			//};
			MIDI.Player.setAnimation(function(data) {
    			var now = data.now; // where we are now
    			var end = data.end; // time when song ends
    			if(now == end){
    				player.loadFile("assets/0/cda070.mid", player.start);
    			}
    			
			});
		}
	});
};