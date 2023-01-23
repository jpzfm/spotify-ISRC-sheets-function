/**
 * Get a ISRC from a Spotify track link.
 *
 * @param {string} spotifyLink Spotify track link or URI.
 * @return The track's ISRC.
 * @customfunction
 */

function spotifyISRC(spotifyLink) {
  // Replace YOUR_CLIENT_ID and YOUR_CLIENT_SECRET with your own Spotify Web API credentials
  var clientId = "YOUR_CLIENT_ID";
  var clientSecret = "YOUR_CLIENT_SECRET";
  
  // Get the access token
  var tokenResponse = UrlFetchApp.fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    payload: {
      grant_type: "client_credentials"
    },
    headers: {
      Authorization: "Basic " + Utilities.base64Encode(clientId + ":" + clientSecret)
    }
  });
  var token = JSON.parse(tokenResponse).access_token;

  var trackId = spotifyLink.split(":").pop();
  // Check if the input is a Spotify URI
  if (spotifyLink.indexOf("spotify:track:") === 0) {
    trackId = spotifyLink.split(":")[2];
  } else {
    // Get the track ID from the Spotify link
    trackId = spotifyLink.split("/").pop();
    var questionMarkIndex = trackId.indexOf("?");

    if (questionMarkIndex != -1) {
      trackId = trackId.substring(0, questionMarkIndex);
    }
  }
  
  // Get the track information using the Spotify Web API
  var trackResponse = UrlFetchApp.fetch("https://api.spotify.com/v1/tracks/" + trackId, {
    headers: {
      Authorization: "Bearer " + token
    }
  });
  var track = JSON.parse(trackResponse);

  // Return the ISRC
  return track.external_ids.isrc;
}
