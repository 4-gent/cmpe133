const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../middleware/db'); // Importing the MongoDB client
const { ObjectId } = require('mongodb');

// dont need routes/spotify... since its in same directory
const SpotifyTokenRoute = require('./SpotifyTokens.js');
//need user id to create their playlist

const spotifyApi = SpotifyTokenRoute.getSpotifyApi();


router.get('/getAll', async(req, res) => {
  let client;
	try{
    const { client, db, playlist } = await connectToDatabase(); // Connecting to the MongoDB server
    const collection = db.collection(playlist); // Getting the collection instance

    const userEmail = req.session.user.email;

    const playlists = await collection.find({email: userEmail}).toArray();

    res.status(200).send(playlists);
	} catch (error) {
		console.log(error) // Logging any errors that occur during the registration process
	} finally {
    if(client)
      await client.close();
	}
})

router.post('/create', async(req, res) => {
  let client;
	try{
    /*
    * You want to make a new playlist in the db
    * then when you want to play music, you get song info into the db then play it
    */
    const { title, description } = req.body; // Extracting 'title' and 'description' from the request body
    if (!title || !description) {
      return res.status(400).send('Title and description are required');
    }
    const { client, db, playlist } = await connectToDatabase(); // Connecting to the MongoDB server
    const collection = db.collection(playlist); // Getting the collection instance

    const userEmail = req.session.user.email;

    const newPlaylist = {
      title: title,
      description: description,
      email: userEmail,
      songs: [],
      createdAt: new Date()
    }

    await collection.insertOne(newPlaylist);

    res.status(200).send('Playlist created');

	} catch (error) {
		console.log(error) // Logging any errors that occur during the registration process
	} finally {
    if(client)
		  await client.close();
	}
})

router.get('/get-playlist/:id', async(req, res) => {
  let client;
  try{
    const { db, playlist } = await connectToDatabase(); // Connecting to the MongoDB server
    const collection = db.collection(playlist); // Getting the collection instance

    const userEmail = req.session.user.email;

    const result = await collection.findOne({email: userEmail, _id: new ObjectId(req.params.id)});
  
    if(result)
      res.status(200).send(result);
    else
      console.log("playlist not found")
  } catch (error) {
    console.log(error) // Logging any errors that occur during the registration process
  } finally {
    if(client)
      await client.close();
  }
})

router.get('/get-songs/:id', async(req, res) => {
  let client;
  try{
    const { db, playlist } = await connectToDatabase(); // Connecting to the MongoDB server
    const collection= db.collection(playlist); // Getting the collection instance
  
    const userEmail = req.session.user.email;

    const result = await collection.findOne({email: userEmail, _id: new ObjectId(req.params.id)});

    console.log("songs: ", result.songs);
    
    if (result) {
      res.status(200).send(result.songs);
    } else {
      res.status(404).send('Playlist not found');
    }
  } catch (error){
    console.log(error) // Logging any errors that occur during the registration process
  } finally {
    if(client)
      await client.close();
  }
})

router.delete('/delete/:id', async(req, res) => {
  let client;
  try{
    const { db, playlist } = await connectToDatabase(); // Connecting to the MongoDB server
    const collection = db.collection(playlist); // Getting the collection instance

    const userEmail = req.session.user.email;

    const result = await collection.deleteOne({ email: userEmail, _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).send('Playlist not found');
    }
    res.status(200).send('Playlist deleted');
  } catch (error) {
    console.log(error) // Logging any errors that occur during the registration process
  } finally {
    if(client)
      await client.close();
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

    // console.log('Retrieved playlists', data.body.items);
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