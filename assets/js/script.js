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
				$("#popular").append(channelHTML(streamData.stream.channel, streamData.stream));
			}
			else { // If streamData.stream is null, channel is offline. We need to make another call to get the channel data
				var url = "https://api.twitch.tv/kraken/channels/" + channel + "?client_id=yikjpcdax5o1rsaaw3g838aetcbsby";
				$.getJSON(url, function(channelData) {
					$("#popular").append(channelHTML(channelData));
				})
				.fail(function(jqXHR) { 
					if(jqXHR.status == 404) { // Handle 404 status where channel does not exist
						$("#popular").append(channelHTML(null, null, channel));
					}
				});
			}
		});
	});
}

// Accepts up to 3 parameters for channel data, stream data, and channel name
// Builds and returns an HTML string that can be appended to the page
function channelHTML(channel, stream, name) {
	var result = "<div class='channel'><img src='";
	if(channel) {
		result += channel.logo + "'>" + channel.display_name;
		if(stream) {
			result += " currently streaming: " + stream.game + "</div>";
		}
		else {
			result += " currently offline</div>";
		}
	}
	else { //404
		result += "./assets/images/twitchlogo.png'>" + name + " returned 404 error: Unable to find channel</div>";
	}
	return result;
}

/*******************************************************************************************************************************
	Logic for featured streams
*******************************************************************************************************************************/
// Get a list of featured streams and update div with id #featured
function initFeatured() {
	var url = "https://api.twitch.tv/kraken/streams/featured/?client_id=yikjpcdax5o1rsaaw3g838aetcbsby";
	$.getJSON(url, function(data) {
		for(var i=0; i<data.featured.length; i++) {
			$("#featured").append(channelHTML(data.featured[i].stream.channel, data.featured[i].stream));
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
	$("#selectPopular").hover(
		function () {
			$("#selectPopular").addClass("selected");
		},
		function () {
			if($("#popular").hasClass("hidden")) {
				$("#selectPopular").removeClass("selected");
			}
	});
	$("#selectFeatured").hover(
		function () {
			$("#selectFeatured").addClass("selected");
		},
		function () {
			if($("#featured").hasClass("hidden")) {
				$("#selectFeatured").removeClass("selected");
			}
	});
}