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
var popularChannels = ["dansgaming", "strippin", "sheriffeli", "dexbonus", "lirik", "moonmoon_ow", "comster404", "bobross", "timthetatman", "riotgames", "crendor", "shaboozey", "freecodecamp", "esl_csgo", "nl_kripp", "trump", "totalbiscuit"];
// var popularChannels = ["dansgaming", "strippin", "sheriffeli", "comster404", "freecodecamp"];
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
function initFeatured() {
	var url = "https://api.twitch.tv/kraken/streams/featured/?client_id=yikjpcdax5o1rsaaw3g838aetcbsby";
	$.getJSON(url, function(data) {
		var counter = 0;
		var selectDiv = 5;
		for(var i=0; i<data.featured.length; i++) {
			counter++;
			$("#select" + selectDiv).append(channelHTML(data.featured[i].stream.channel, data.featured[i].stream));
			if(counter == 5) {
				selectDiv += counter;
				counter = 0;
			}
			// $("#featuredOutput").append(channelHTML(data.featured[i].stream.channel, data.featured[i].stream));
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

			// Hide window if user does a new search while window is visibile
			if(!$("#searchWindow").hasClass("hidden")) {
				$("#searchWindow").addClass("hidden");
			}

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
					$("#searchResults").append("<p class='text-center'>No channels found matching that search. Please try again</p>");
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

// Hide/show divs depending on amount selected
function initFeaturedAmountListeners() {
	$("#selectAmount").on("change", function(data) {
		var amount = Number($("select option:selected").val());
		hideFeaturedDivs(amount);
		showFeaturedDivs(amount);
	});
}

// Hide all divs higher than amount
function hideFeaturedDivs(amount) {
	while(amount < 25) {
		amount += 5;
		$("#select" + amount).addClass("hidden");
	}
}

// Show all divs equal to or less than amount
function showFeaturedDivs(amount) {
	while(amount > 5) {
		$("#select" + amount).removeClass("hidden");
		amount -= 5;
	}
}

// Accepts 1 to 3 parameters for channel data, stream data, and channel name
// Builds and returns an HTML string that can be appended to the page
function channelHTML(channel, stream, name) {
	var result = "<div class='channel'>";
	result += "<div class='row flex'>";
	if(channel) {
		result += "<div class='col-sm-8 flex'>";

		if(channel.logo) {
			result += "<div class='channelIMG'><img src='" + channel.logo + "'></div>";
		}
		else {
			result += "<div class='channelIMG'><img src='./assets/images/twitchlogo.png'></div>";
		}

		if(stream) {
			result += "<header>";
			result += "<i class='fa fa-circle red' aria-hidden='true'></i> <h3>" + channel.display_name + " is streaming</h3>";
			result += "<p>" + channel.status + "</p>";
			result += "<p><i class='fa fa-gamepad' aria-hidden='true'></i> " + stream.game;
			result += " with " + stream.viewers.toLocaleString() + " viewers</p>";
			result += "<p><a href='" + channel.url + "' target='_blank'>" + channel.url + "</a></p>";
			result += "</header>";
			result += "</div>"; //end col

		}
		else {
			result += "<header>";
			result += "<h3><i class='fa fa-arrow-down' aria-hidden='true'></i> " + channel.display_name + " is offline</h3>";
			result += "<p>" + channel.status + "</p>";
			if(channel.game) {
				result += "<p><i class='fa fa-gamepad' aria-hidden='true'></i> " + channel.game + "</p>";
			}
			result += "<p><a href='" + channel.url + "' target='_blank'>" + channel.url + "</a></p>";
			result += "</header>";
			result += "</div>"; //end col
		}

		result += "<div class='col-sm-4'>";
		result += "<dl>" + "<dt>Followers:</dt>" + "<dd>" + channel.followers.toLocaleString() + "</dd>" + 
							"<dt>Views:</dt>" + "<dd>" + channel.views.toLocaleString() + "</dd>" + 
							"<dt>Created:</dt>" + "<dd>" + channel.created_at.substring(0, 10) + "</dd>" + 
							"<dt>Updated:</dt>" + "<dd>" + channel.updated_at.substring(0, 10) + "</dd>" + "</dl>"
		result += "</div>"; // end col
	}
	else { //404
		result += "<div class='col-xs-12 text-center'>"
		result += "<h3>" + name + "</h3>";
		result += "<p>Returned 404 error: Channel does not exist.</p>";
		result += "</div></div>"
	}
	result += "</div>"; // end row
	result += "</div>"; //end channel
	return result;
}