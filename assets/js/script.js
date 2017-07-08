// Setup popular channels array
var popularChannels = ["dansgaming", "brunofin", "comster404", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

// Document Ready
$(function() {
	popularChannels.forEach(function(channel) {
		// Get channel data for current channel
		getChannel(channel, function(data) {
			var currentChannel = data;
				// Get Stream data (if any) for current channel
				getStream(channel, function(data) {
					var currentStream = data;
					console.log(currentStream, currentChannel);

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