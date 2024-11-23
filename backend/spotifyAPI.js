const SpotifyWebAPI = require('spotify-web-api-node');

let myCredentials = {
    clientId: 'e816d66aadbf4653845af2b70fb826ad',
    clientSecret: '999949d2e45b4b2fa6104d024b571e16',
    redirectUri: 'http://localhost:4000/fetchTokens'
};
// not sure how to get the url
let authCode = '';

let spotifyApi = new SpotifyWebAPI(myCredentials);

async function generateToken(){
    try{
        
        let data = await spotifyApi.authorizationCodeGrant(authCode);
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        console.log('The refresh token is' + data.body['refresh_token']);

        // Set the access and refresh token
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
    } catch(err){
        console.log("Error occured: ", err);
    }
}

//need to refesh token since a token only lasts an hour
async function authenticateAndFetchData() {
  try {
      // Check if you have a refresh token stored
      if (!spotifyApi.getAccessToken()) {
          console.log('No valid access token. Re-authenticate and exchange a new authorization code.');
          // Redirect user for re-authorization if needed
      }

      // If token is expired, refresh it
      let refreshedData = await spotifyApi.refreshAccessToken();
      console.log('The access token has been refreshed!');
      spotifyApi.setAccessToken(refreshedData.body['access_token']);

  } catch (err) {
      console.error('Error occurred:', err);
  }
}

async function fetchArtistAlbums(){
    //you need to call generate token and wait for it to finish before making any api calls
    await generateToken();
    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
        function(data) {
          console.log('Artist albums', data.body);
        },
        function(err) {
          console.error(err);
        }
      );
}


fetchArtistAlbums();



  