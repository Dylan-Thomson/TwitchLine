// Setup popular channels array
var popularChannels = ["dansgaming", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

// Document Ready
$(function() {
	popularChannels.forEach(function(channel) {
		// Get channel data for current channel
		getChannel(channel, function(data) {
			var currentChannel = data;

			// Get Stream data (if any) for current channel
			getStream(channel, function(data) {
				var currentStream = data;
				// Display online/offline status - if there is no stream data, channel is offline
				if(currentStream.stream) {
					$("#popular").append("<div>" + currentChannel.display_name + " - " + currentStream.stream.stream_type + "</div>");				
				}
				else {
					$("#popular").append("<div>" + currentChannel.display_name + " - " + "offline" + "</div>");				
				}
			});
		});
	});
});

// Request Channel Data
function getChannel(channel, callback) {
	// Using wind-bow because Twitch.tv API now requires a key and this is a public repo
	var url = "https://wind-bow.gomix.me/twitch-api/channels/" + channel + "?callback=?";
	$.getJSON(url, function(data) {
		if(callback) {
			callback(data);
		}
	});
}

// Request Stream data
function getStream(channel, callback) {
	// Using wind-bow because Twitch.tv API now requires a key and this is a public repo
	var url = "https://wind-bow.gomix.me/twitch-api/streams/" + channel + "?callback=?";
	$.getJSON(url, function(data) {
		if(callback) {
			callback(data);
		}
	});

}