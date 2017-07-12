// Document Ready
$(function() {
	initPopular();
	initFeatured(5);
	initListeners();
});

// https://api.twitch.tv/kraken/search/games?query=starcraft%202&type=suggest&client_id=yikjpcdax5o1rsaaw3g838aetcbsby&
/*******************************************************************************************************************************
	Logic for popular channels
*******************************************************************************************************************************/
// Setup popular channels array - comster404 and brunofin are nonexistent accounts for testing
// var popularChannels = ["dansgaming", "strippin", "sheriffeli", "dexbonus", "lirik", "moonmoon_ow", "comster404", "bobross", "timthetatman", "riotgames", "crendor", "shaboozey", "freecodecamp", "esl_csgo", "nl_kripp", "trump", "totalbiscuit"];
var popularChannels = ["dansgaming", "strippin", "sheriffeli", "comster404", "freecodecamp"];
// Get channel and stream data for popular channels and update div with id #popular
function initPopular() {	
	popularChannels.forEach(function(channel) {
		var url = "https://api.twitch.tv/kraken/streams/" + channel + "?client_id=yikjpcdax5o1rsaaw3g838aetcbsby";

		// Get stream data
		$.getJSON(url, function(streamData) {
			if(streamData.stream) { // Channel is currently streaming, channel data is included in stream data
				$("#popularOutput").append(channelHTML(streamData.stream.channel, streamData.stream));
			}
			else { // If streamData.stream is null, channel is offline. We need to make another call to get the channel data
				var url = "https://api.twitch.tv/kraken/channels/" + channel + "?client_id=yikjpcdax5o1rsaaw3g838aetcbsby";
				$.getJSON(url, function(channelData) {
					$("#popularOutput").append(channelHTML(channelData));
				})
				.fail(function(jqXHR) { 
					if(jqXHR.status == 404) { // Handle 404 status where channel does not exist
						$("#popularOutput").append(channelHTML(null, null, channel));
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
function initFeatured(num) {
	var url = "https://api.twitch.tv/kraken/streams/featured/?client_id=yikjpcdax5o1rsaaw3g838aetcbsby";
	$.getJSON(url, function(data) {
		for(var i=0; i<num; i++) {
			$("#featuredOutput").append(channelHTML(data.featured[i].stream.channel, data.featured[i].stream));
		}
	});
}


/*******************************************************************************************************************************
	Logic for event listeners
*******************************************************************************************************************************/
// Initialize event listeners 
function initListeners() {
	initSelectListeners();
	initSearchListeners();
	initFeaturedAmountListeners();
}

// Section select functionality
function initSelectListeners() {
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

// Channel search functionality 
function initSearchListeners() {
	$("#searchChannels").submit(function(event) {
			event.preventDefault();
			// Remove old listeners
			$("#addResult").off("click");
			$("#cancelResult").off("click");

			// Clear old search
			$("#searchResults").html("");

			// Get search term and clean text input
			var searchTerm = $("#searchInput").val();
			$("#searchInput").val("");

			var url = "https://api.twitch.tv/kraken/search/channels?query=" + searchTerm + "&type=suggest&client_id=yikjpcdax5o1rsaaw3g838aetcbsby&&callback=?";
			
			// Search for channels
			$.getJSON(url, function(channelData) {
				if(channelData.channels[0]) {
					// See if first result is streaming
					var url = "https://api.twitch.tv/kraken/streams/" + channelData.channels[0].display_name + "?client_id=yikjpcdax5o1rsaaw3g838aetcbsby";
					$.getJSON(url, function(streamData) {
						var result;
						if(streamData.stream) {
							result = channelHTML(streamData.stream.channel, streamData.stream);
						}
						else {
							result = channelHTML(channelData.channels[0]);
						}

						$("#searchResults").append(result);
						$("#searchWindow").removeClass("hidden");

						// Add result to list
						$("#addResult").removeClass("hidden");
						$("#addResult").on("click", function() {
							$("#popularOutput").prepend(result);
							$("#searchResults").html("");
							$("#searchWindow").addClass("hidden");
							$("#addResult").addClass("hidden");
						});						
					});
				}
				// No channels found
				else {
					$("#searchResults").append("No channels found matching that search. Please try again");
					$("#searchWindow").removeClass("hidden");
				}

				// Cancel
				$("#cancelResult").on("click", function() {
					$("#searchResults").html("");
					$("#searchWindow").addClass("hidden");
					$("#addResult").addClass("hidden");
				});

			})
			.fail(function(jqXHR) { 
				if(jqXHR.status == 404) {
					alert("404 channel not found");
				}
			});
	});
}

// TODO load all featured streams but hide them?
function initFeaturedAmountListeners() {
	$("#selectAmount").on("change", function(data) {
	$("#featuredOutput").html("");
		initFeatured($("select option:selected").val());
	});
}

// Accepts 1 to 3 parameters for channel data, stream data, and channel name
// Builds and returns an HTML string that can be appended to the page

// https://www.twitch.tv/directory/game/League%20of%20Legends
function channelHTML(channel, stream, name) {
	var result = "<div class='channel'>";
	if(channel) {
		result += "<div class='row flex'>";
		result += "<div class='col-sm-8 flex'>";

		if(channel.logo) {
			result += "<div class='channelIMG'>";
			result += "<img src='" + channel.logo + "'>";
			result += "</div>";
		}
		else {
			result += "<div class='channelIMG'>";
			result += "<img src='./assets/images/twitchlogo.png'>";
			result += "</div>";
		}

		if(stream) {
			result += "<header>";
			result += "<h3><i class='fa fa-circle red' aria-hidden='true'></i> " + channel.display_name + " is streaming</h3>";
			result += "<p>";
			result += channel.status;
			result += "</p>";
			result += "<p>";
			result += "<i class='fa fa-gamepad' aria-hidden='true'></i> " + stream.game;
			result += " with " + stream.viewers.toLocaleString() + " viewers";
			result += "</p>";
			result += "<p>";
			result += "<a href='" + channel.url + "' target='_blank'>" + channel.url + "</a>";
			result += "</p>";
			result += "</header>";
			result += "</div>"; //end row

		}
		else {
			result += "<header>";
			result += "<h3><i class='fa fa-arrow-down' aria-hidden='true'></i> " + channel.display_name + " is offline</h3>";
			result += "<p>";
			result += channel.status;
			result += "</p>";
			result += "<p>";
			result += "<i class='fa fa-gamepad' aria-hidden='true'></i> " + channel.game;
			result += "</p>";
			result += "<p>";
			result += "<a href='" + channel.url + "' target='_blank'>" + channel.url + "</a>";
			result += "</p>";
			result += "</header>";
			result += "</div>"; //end row
		}

		result += "<div class='col-sm-4'>";
		result += "<dl><dt>Created:</dt>" + "<dd>" + channel.created_at + "</dd>" + "<dt>Followers:</dt>" + "<dd>" + channel.followers.toLocaleString() + "</dd>" + "<dt>Views:</dt>" + "<dd>" + channel.views.toLocaleString() + "</dd>" + "</dl>"
		result += "</div>";
	}
	else { //404
		result += "<img src='./assets/images/twitchlogo.png'>";
		result += "<i class='fa fa-times' aria-hidden='true'></i> " + name;
		result += " returned 404 error: Unable to find channel";
	}
	result += "</div>"; //end channel
	return result;
}