
const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors') // Importing the CORS middleware

// dont need routes/spotify... since its in same directory
const SpotifyTokenRoute = require('./SpotifyTokens.js');

const corsEnable = {
	origin: 'http://localhost:3000',
	credentials: true,
}
router.use(cors(corsEnable)) // Enabling CORS for all routes

const spotifyApi = SpotifyTokenRoute.getSpotifyApi();


router.get('/auth', async(req, res) => {
	try{
		let scopes = ['user-library-read', 'user-top-read', 'streaming', 'playlist-read-collaborative', 
			'user-follow-read', 'playlist-modify-public', 'playlist-modify-private'
		];

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

		res.redirect('http://localhost:3000/home');

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
        
		//can only get user after setting tokens
		await GetAuthUser();
		
     
    } catch(err){
        console.log("Error occured: ", err);
    }
}

async function GetAuthUser() {
	spotifyApi.getMe().then(function(data) {
		//console.log('Some information about the authenticated user', data.body);
		let username = data.body.id;
		SpotifyTokenRoute.setUser(username);
	}, function(err) {
		console.log('Something went wrong!', err);
	});
  }

router.get('/getAccessToken', (req, res) => {
	try {
	  	const accessToken = SpotifyTokenRoute.getAccessToken();
		res.json({ accessToken });
	  
	} catch (error) {
	  	console.error('Error fetching access token:', error);
	  	res.status(500).json({ message: "Error fetching access token" });
	}
});

module.exports = router;

