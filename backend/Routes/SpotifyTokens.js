const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config()
// Initialize the Spotify API client without tokens
const myCredentials = {
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: process.env.SPOTIFY_REDIRECT_URI
};

const spotifyApi = new SpotifyWebApi(myCredentials);
let username = null;

let tokens = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null  // Timestamp for token expiration
};
// Function to set access and refresh tokens
const setTokens = (accessToken, refreshToken, expiresIn) => {
    
  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);
  console.log('The access token expires in ' + expiresIn);
  console.log('The access token is ' + accessToken);
  console.log('The refresh token is' + refreshToken);
};

const setUser = (inputUser) =>{
  username = inputUser;
}

// Function to get authenticated spotify client
const getSpotifyApi = () => spotifyApi;
const getUsername = () => username;


module.exports = { setTokens, getSpotifyApi, getUsername, setUser };