const express = require('express');
const router = express.Router();
const axios = require('axios');

// dont need routes/spotify... since its in same directory
const SpotifyTokenRoute = require('./SpotifyTokens.js');
//need user id to create their playlist

const spotifyApi = SpotifyTokenRoute.getSpotifyApi();

router.get('/UserPlaylists', async(req, res) => {
	try{
		await GetMyPlaylists();
        //await GetUserFollowedArtists();
	} catch (error) {
		console.log(error) // Logging any errors that occur during the registration process
	} finally {
		
	}
})

async function GetMyPlaylists() {
    spotifyApi.getUserPlaylists(SpotifyTokenRoute.getUsername())
  .then(function(data) {
    console.log('Retrieved playlists', data.body);
  },function(err) {
    console.log('Something went wrong!', err);
  });
}

async function GetUserFollowedArtists() {
    spotifyApi.getFollowedArtists({ limit : 10 }).then(function(data) {
        console.log(data.body.artists);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

module.exports = router;