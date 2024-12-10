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
    const { db, playlist } = await connectToDatabase(); // Connecting to the MongoDB server
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

    console.log(req.params.id)

    const result = await collection.findOne({email: userEmail, _id: new ObjectId(req.params.id)});
  
    if(result){
      req.session.playlist = { playlistId: req.params.id }; // Saving the user email in the session
      console.log("Session info /playlist/get-playlist: ", req.session.playlist);
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).send('Session save error');
        } else {
          console.log("playlist found")
          return res.status(200).send(result);
        }
      });
    }
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

// Add a song to a playlist
router.put('/addSong', async (req, res) => {
  let client;
  try {
    const { playlistId, item } = req.body;
    const userEmail = req.session.user.email;

    if (!playlistId || !item) {
      return res.status(400).send('Playlist ID and item are required');
    }

    const { db, playlist } = await connectToDatabase(); // Connecting to the MongoDB server
    const collection = db.collection(playlist); // Getting the collection instance

    console.log("playlistId: ", playlistId);
    console.log("item: ", item);

    // Find the playlist by playlistId and userEmail
    const result = await collection.findOne({ _id: new ObjectId(playlistId), email: userEmail });

    if (!result) {
      console.log("playlist not found ", result);
      return res.status(404).send('Playlist not found');
    }

    // Check if the song is already in the songs array based on songlink
    const songExists = result.songs.some(song => song.songlink === item.songlink);

    if (!songExists) {
      result.songs.push(item);
    }

    // Update the playlist in the database
    await collection.updateOne(
      { _id: new ObjectId(playlistId), email: userEmail },
      { $set: { songs: result.songs } }
    );

    res.status(200).send('Song added to playlist');
  } catch (error) {
    console.log(error); // Logging any errors that occur during the process
    res.status(500).send('Error adding song to playlist');
  } finally {
    if (client) {
      await client.close();
    }
  }
});

// Delete a song from a playlist
router.delete('/delete-song/', async (req, res) => {
  let client;
  try {
    const { playlistId } = req.session.playlist;
    const { songlink } = req.body;
    const userEmail = req.session.user.email;

    console.log("playlistId: ", playlistId);
    console.log("songlink: ", songlink);
    console.log("userEmail: ", userEmail);

    if (!playlistId || !songlink) {
      return res.status(400).send('Playlist ID and Song link are required');
    }

    const { db, playlist } = await connectToDatabase(); // Connecting to the MongoDB server
    const collection = db.collection(playlist); // Getting the collection instance

    // Find the playlist by playlistId and userEmail
    const result = await collection.findOne({ _id: new ObjectId(playlistId), email: userEmail });

    if (!result) {
      console.log("playlist not found ", result);
      return res.status(404).send('Playlist not found');
    }

    // Remove the song from the songs array based on songlink
    result.songs = result.songs.filter(song => song.songlink !== songlink);

    // Update the playlist in the database
    await collection.updateOne(
      { _id: new ObjectId(playlistId), email: userEmail },
      { $set: { songs: result.songs } }
    );

    res.status(200).send('Song removed from playlist');
  } catch (error) {
    console.log(error); // Logging any errors that occur during the process
    res.status(500).send('Internal server error');
  } finally {
    if (client) {
      await client.close();
    }
  }
});

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