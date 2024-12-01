const express = require('express') // Importing the Express framework
const SpotifyTokenRoute = require('./SpotifyTokens.js');
const router = express.Router();


const spotifyApi = SpotifyTokenRoute.getSpotifyApi();


router.get('/searchAll', async(req, res) =>{
     console.log("search works");
     await musicSearch("jazz");
     res.send();
     
 });

async function musicSearch(searchInput){
    spotifyApi.searchTracks(searchInput).then(function(data) {
          console.log('Search results: ', data.body.tracks);
    }, function(err) {
          console.error(err);
    });
}

router.post('/', function(req, res){
    console.log("search post works")
    
});
 
 
module.exports = router;