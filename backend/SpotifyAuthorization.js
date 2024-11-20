const SpotifyWebAPI = require('spotify-web-api-node');

let scopes = ['user-library-read', 'user-top-read', 'playlist-read-collaborative'],
  redirectUri = 'http://localhost:3000/',
  clientId = 'e816d66aadbf4653845af2b70fb826ad';

// Setting credentials
let spotifyApi = new SpotifyWebAPI({ redirectUri: redirectUri, clientId: clientId});

// Create the authorization URL
let authorizeURL = spotifyApi.createAuthorizeURL(scopes);

console.log(authorizeURL);