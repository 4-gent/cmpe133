const express = require('express') // Importing the Express framework
const SpotifyTokenRoute = require('./SpotifyTokens.js');
const router = express.Router();
const cors = require('cors') // Importing the CORS middleware

const spotifyApi = SpotifyTokenRoute.getSpotifyApi();

const corsEnable = {
	origin: 'http://localhost:3000',
	credentials: true,
}
router.use(cors(corsEnable)) // Enabling CORS for all routes

router.get('/searchAll', async(req, res) =>{
    
    const query = req.query.q;
    let musicSearchRes = await musicSearch(query);
     //await GetAuthUser();
     //console.log("Formatted search results:", musicSearchRes);
     res.json(musicSearchRes);

     
 });

async function musicSearch(searchInput){
        try {
        const data = await spotifyApi.searchTracks(searchInput);
        //   console.log('Search results: ', data.body.tracks);
          let resArray = data.body.tracks.items;
          let searchRes = [];

          resArray.forEach((song) => {
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
            // console.log(songItem);
          });
          
          return searchRes;
    } catch(err) {
          console.error(err);
    }
}



router.post('/', function(req, res){
    console.log("search post works")
    
});
 
 
module.exports = router;