// Setup popular channels array
var popularChannels = ["dansgaming", "brunofin", "comster404", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

// Document Ready
$(function() {
	displayPopularChannels();
});

// Get channel and stream data for popular channels and update div with id #popular
function displayPopularChannels() {	
	popularChannels.forEach(function(channel) {
		// Get channel data for current channel
		getPopularChannel(channel, function(data) {
			var currentChannel = data;
				// Get Stream data (if any) for current channel
				getPopularStream(channel, function(data) {
					var currentStream = data;
					// If 404 status, channel does not exist 
					if(currentChannel.status == 404) {
						$("#popular").append("<div>" + channel + " does not exist</div>");
					}
					// If stream is not null, display stream_type i.e. "live"
					else if(currentStream.stream) {
						$("#popular").append("<div>" + currentChannel.display_name + " - " + currentStream.stream.stream_type + "</div>");		
					}
					// If stream is null, the channel is not currently streaming
					else {
						$("#popular").append("<div>" + currentChannel.display_name + " - " + "offline" + "</div>");		
					}		
				});
		});
	});
}

// Request Channel Data
function getPopularChannel(channel, callback) {
	// Using wind-bow because Twitch.tv API now requires a key and this is a public repo
	var url = "https://wind-bow.gomix.me/twitch-api/channels/" + channel + "?callback=?";
	$.getJSON(url, function(data) {
		if(callback) {
			callback(data);
		}
	});
}

// Request Stream data
function getPopularStream(channel, callback) {
	// Using wind-bow because Twitch.tv API now requires a key and this is a public repo
	var url = "https://wind-bow.gomix.me/twitch-api/streams/" + channel + "?callback=?";
	$.getJSON(url, function(data) {
		if(callback) {
			callback(data);
		}
	});
}