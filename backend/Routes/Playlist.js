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

router.post('/Create', async(req, res) => {
	try{
    //hard coded playlist name
		await CreatePlaylist('radiohost');
	} catch (error) {
		console.log(error) // Logging any errors that occur during the registration process
	} finally {
		
	}
})

router.put('/AddSongToPlaylist', async(req, res) => {
  /* hard coded some songs CHANGE WHEN YOU GET THE SONGS FROM FRONTEND
      when you save a song, we should also send the playlist id as well
  */
  let songsToAdd = ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"];
  /*this variable should be assigned the playlist ID from the frontend instead of 
    'await GetMyPlaylists()' when we click what playlist to add our song to.

  */
  
  // I HARD CODED A MY PLAYLIST ID HERE FOR TESTING
  //DELETE WHEN YOU IMPLEMENT FETCHING PLAYLIS ID FROM THE FRONTEND
  let playlistId = '';
  
  await AddToPlaylist(playlistId, songsToAdd);
	
})

async function GetMyPlaylists() {
    spotifyApi.getUserPlaylists(SpotifyTokenRoute.getUsername(), { limit: 1})
  .then(function(data) {
    /*the "items" element in the json has an array of playlist jsons
      i just limited it to 1 for now to just update the lastest 
      playlist the user created

      I also coded it to just return the latest playlist id the user interacted with
    */

    console.log('Retrieved playlists', data.body.items);
    return data.body.items;
  },function(err) {
    console.log('Something went wrong!', err);
  });
}

async function AddToPlaylist(playlistId, songsToAdd) {
  
  spotifyApi.addTracksToPlaylist(playlistId, songsToAdd)
  .then(function(data) {
    console.log('Added tracks to playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function GetSpecificPlaylists(playlistName) {
 
}

async function CreatePlaylist(playlistName) {
  spotifyApi.createPlaylist(playlistName, { 'description': 'My description', 'public': true })
  .then(function(data) {
      console.log('Created playlist!');
  }, function(err) {
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