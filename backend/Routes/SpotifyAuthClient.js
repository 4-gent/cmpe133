
const express = require('express');
const router = express.Router();
const axios = require('axios');

// dont need routes/spotify... since its in same directory
const SpotifyTokenRoute = require('./SpotifyTokens.js');
const SpotifySearchTest = require('./search.js');


const spotifyApi = SpotifyTokenRoute.getSpotifyApi();


router.get('/auth', async(req, res) => {
	try{
		let scopes = ['user-library-read', 'user-top-read', 'playlist-read-collaborative', 'streaming'];

		// Setting credentials
		let authorizeURL = spotifyApi.createAuthorizeURL(scopes);
		//console.log(authorizeURL);
		res.redirect(authorizeURL);
		/*
		res.json({
			message: authorizeURL
		});
		*/
	} catch (error) {
		console.log(error) // Logging any errors that occur during the registration process
	} finally {
		
	}
})

router.get('/fetchTokens', async(req, res) => {
	try{

		
		await generateToken(req.query.code);


		res.redirect('http://localhost:3000');

	} catch (error) {
		console.log(error) // Logging any errors that occur during the registration process
	} finally {
		
	}
})

async function generateToken(Acode){
    try{
        
		let authCode = Acode;
        let data = await spotifyApi.authorizationCodeGrant(authCode);
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];
        const expire = data.body['expires_in'];
        
        
        SpotifyTokenRoute.setTokens(accessToken, refreshToken, expire);
        
     
    } catch(err){
        console.log("Error occured: ", err);
    }
}

module.exports = router;

