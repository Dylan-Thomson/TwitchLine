// Document Ready
$(function() {
	initPopular();
	initFeatured();
	initListeners();
});

/*******************************************************************************************************************************
	Logic for popular channels
*******************************************************************************************************************************/
// Setup popular channels array - comster404 and brunofin are nonexistent accounts for testing
var popularChannels = ["dansgaming", "strippin", "sheriffeli", "dexbonus", "lirik", "moonmoon_ow", "comster404", "bobross", "timthetatman", "riotgames", "crendor", "shaboozey", "freecodecamp", "esl_csgo", "nl_kripp", "trump", "totalbiscuit"];

// Get channel and stream data for popular channels and update div with id #popular
function initPopular() {	
	popularChannels.forEach(function(channel) {
		var url = "https://api.twitch.tv/kraken/streams/" + channel + "?client_id=yikjpcdax5o1rsaaw3g838aetcbsby";

		// Get stream data
		$.getJSON(url, function(streamData) {
			if(streamData.stream) { // Channel is currently streaming
				// console.log(streamData.stream.channel.display_name);
				$("#popular").append("<div><img src='" + streamData.stream.channel.logo + "'>" + streamData.stream.channel.display_name + " currently streaming: " + streamData.stream.game + "</div>");
			}
			else { // If streamData.stream is null, channel is offline. We need to make another call to get the channel data
				var url = "https://api.twitch.tv/kraken/channels/" + channel + "?client_id=yikjpcdax5o1rsaaw3g838aetcbsby";
				$.getJSON(url, function(channelData) {
					// console.log(channelData.display_name);
					$("#popular").append("<div><img src='" + channelData.logo + "'>" + channelData.display_name + " currently offline</div>");
				})
				.fail(function(jqXHR) { 
					if(jqXHR.status == 404) { // Handle 404 status where channel does not exist
						// console.log(channel, "404 not found");
						$("#popular").append("<div><img src='./assets/images/twitchlogo.png'>" + channel + " returned 404 error: Unable to find channel</div>");
					}
					else { // Handle other errors
						// console.log("other non-handled error type");
						$("#popular").append("<div>" + channel + "unable to get channel</div>");
					}
				});
			}
		});
	});
}

/*******************************************************************************************************************************
	Logic for featured streams
*******************************************************************************************************************************/
// Get a list of featured streams and update div with id #featured
function initFeatured() {
	var url = "https://api.twitch.tv/kraken/streams/featured/?client_id=yikjpcdax5o1rsaaw3g838aetcbsby";
	$.getJSON(url, function(data) {
		for(var i=0; i<data.featured.length; i++) {
			$("#featured").append("<div><img src='" + data.featured[i].stream.channel.logo + "'>" + data.featured[i].stream.channel.display_name + " is playing " + data.featured[i].stream.game + "</div>");
			// if(data.featured[i].stream.channel.language == "en") {
			// }
		}
	});
}

function initListeners() {
	$("#selectFeatured").on("click", function() {
		if($("#featured").hasClass("hidden")) {
			$("#featured").removeClass("hidden");
			$("#popular").addClass("hidden");
			$("#selectFeatured").addClass("selected");
			$("#selectPopular").removeClass("selected");
		}
	});
	$("#selectPopular").on("click", function() {
		if($("#popular").hasClass("hidden")) {
			$("#popular").removeClass("hidden");
			$("#featured").addClass("hidden");
			$("#selectPopular").addClass("selected");
			$("#selectFeatured").removeClass("selected");
		}
	});
}