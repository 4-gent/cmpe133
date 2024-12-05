const express = require('express') // Importing the Express framework
const SpotifyTokenRoute = require('./SpotifyTokens.js');
const router = express.Router();


const spotifyApi = SpotifyTokenRoute.getSpotifyApi();


router.get('/searchAll', async(req, res) =>{
     console.log("search works");

     let musicSearchRes = await musicSearch("Ado");
     //await GetAuthUser();
     res.send(musicSearchRes);
     
 });

async function musicSearch(searchInput){
    spotifyApi.searchTracks(searchInput).then(function(data) {
          //console.log('Search results: ', data.body.tracks);
          let resArray = data.body.tracks.items;
          let searchRes = [];
          for (let song of resArray){
            let songItem = {
                songName: song.name,
                artist: song.artists,
                songUri: song.uri, 
                songId: song.id,
                album: song.album.name,
                albumImages: song.album.images,
                albumId: song.album.id,
                albumUri: song.album.uri
            };
            searchRes.push(songItem);
            console.log(songItem);

          }
          return searchRes;
    }, function(err) {
          console.error(err);
    });
}



router.post('/', function(req, res){
    console.log("search post works")
    
});
 
 
module.exports = router;