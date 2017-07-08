// Document Ready
$(function() {
	initPopular();
	initFeatured();
});

/*******************************************************************************************************************************
	Logic for popular channels
*******************************************************************************************************************************/
// Setup popular channels array - comster404 and brunofin are nonexistent accounts for testing
var popularChannels = ["dansgaming", "lirik", "brunofin", "comster404", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

// Get channel and stream data for popular channels and update div with id #popular
function initPopular() {	
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
						$("#popular").append("<div>" + currentChannel.display_name + " is playing " + currentStream.stream.game + "</div>");		
					}
					// If stream is null, the channel is not currently streaming
					else {
						$("#popular").append("<div>" + currentChannel.display_name + " is " + "offline" + "</div>");		
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

/*******************************************************************************************************************************
	Logic for featured streams
*******************************************************************************************************************************/
function initFeatured() {
	var url = "https://wind-bow.glitch.me/twitch-api/streams/featured?callback=?";
	$.getJSON(url, function(data) {
		for(var i=0; i<data.featured.length; i++) {
			$("#featured").append("<div>" + data.featured[i].stream.channel.display_name + " is playing " + data.featured[i].stream.game + "</div>");	
		}
	});
}
