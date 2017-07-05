// https://wind-bow.gomix.me/twitch-api

var popularChannels = ["dansgaming", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

// Document Ready
$(function() {
	// getPopularStream("dansgaming");
	popularChannels.forEach(function(channel) {
		getPopularChannel(channel);
	});
});

function getPopularChannel(channel) {
	var url = "https://wind-bow.gomix.me/twitch-api/channels/" + channel + "?callback=?";
	$.getJSON(url, function(data) {
		$("#popular").append("<div>" + data.display_name + " - " + data.status + "</div>");
	});
}