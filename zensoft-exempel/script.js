/* This solution makes use of "simple access" to google, providing only an API Key.
 * This way we can only get access to public calendars. To access a private calendar,
 * we would need to use OAuth 2.0 access.
 *
 * "Simple" vs. "Authorized" access: https://developers.google.com/api-client-library/javascript/features/authentication
 * Examples of "simple" vs OAuth 2.0 access: https://developers.google.com/api-client-library/javascript/samples/samples#authorizing-and-making-authorized-requests
 *
 * We will make use of "Option 1: Load the API discovery document, then assemble the request."
 * as described in https://developers.google.com/api-client-library/javascript/start/start-js
 */
function printCalendar() {
	// The "Calendar ID" from your calendar settings page, "Calendar Integration" secion:
	var calendarId = "ef998d8aa7b146582a26aa317ff3cce6a91b284c9e7ccd6a0b5dfbae447ddf73@group.calendar.google.com";

	// 1. Create a project using google's wizzard: https://console.developers.google.com/start/api?id=calendar
	// 2. Create credentials:
	//    a) Go to https://console.cloud.google.com/apis/credentials
	//    b) Create Credentials / API key
	//    c) Since your key will be called from any of your users' browsers, set "Application restrictions" to "None",
	//       leave "Website restrictions" blank; you may optionally set "API restrictions" to "Google Calendar API"
	var apiKey = "AIzaSyAvNKadUhju5QPM_itDdskv05C118b_QGc";
	// You can get a list of time zones from here: http://www.timezoneconverter.com/cgi-bin/zonehelp
	var userTimeZone = "Europe/Helsinki";

	// Initializes the client with the API key and the Translate API.
	gapi.client
		.init({
			apiKey: apiKey,
			// Discovery docs docs: https://developers.google.com/api-client-library/javascript/features/discovery
			discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
		})
		.then(function () {
			// Use Google's "apis-explorer" for research: https://developers.google.com/apis-explorer/#s/calendar/v3/
			// Events: list API docs: https://developers.google.com/calendar/v3/reference/events/list
			return gapi.client.calendar.events.list({
				calendarId: calendarId,
				timeZone: userTimeZone,
				singleEvents: true,
				timeMin: new Date().toISOString(), //gathers only events not happened yet
				maxResults: 20,
				orderBy: "startTime"
			});
		})
		.then(
			function (response) {
				if (response.result.items) {
					var calendarRows = ['<table class="wellness-calendar"><tbody>'];
					response.result.items.forEach(function (entry) {
						var startsAt =
							moment(entry.start.dateTime).format("L") + " " + moment(entry.start.dateTime).format("LT");
						var endsAt = moment(entry.end.dateTime).format("LT");
						calendarRows.push(`<tr><td>${startsAt} - ${endsAt}</td><td>${entry.summary}</td></tr>`);
					});
					calendarRows.push("</tbody></table>");
					$("#wellness-calendar").html(calendarRows.join(""));
				}
			},
			function (reason) {
				console.log("Error: " + reason.result.error.message);
			}
		);
}

// Loads the JavaScript client library and invokes `start` afterwards.
gapi.load("client", printCalendar);
