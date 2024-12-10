const express = require('express') // Importing the Express framework
const path = require('path') // Importing the Path module
const bodyParser = require('body-parser') // Importing the Body Parser middleware

require('dotenv').config() // Loading environment variables from .env file

// Spotify Routes
const spotifyAuth = require('./Routes/SpotifyAuthClient.js');
const searchRoute = require('./Routes/search.js');
const userPlaylistsRoute = require('./Routes/Playlist.js');

// User Based Routes
const authRoute = require('./Routes/Auth.js');
const userRoute = require('./Routes/UserInfo.js');

// Middleware
const app = express() // Creating an instance of the Express application
const corsMiddleware = require('./middleware/cors.js') // Importing the CORS middleware
const sessionMiddleware = require('./middleware/session.js') // Importing the Session middleware

app.set('trust proxy', 1); // Trust first proxy
app.use(express.static(path.join(__dirname, '../radiohost/public'))) // Serving static files from the 'public' directory
app.use(bodyParser.urlencoded({ extended: true })) // Using the Body Parser middleware to parse URL-encoded data
app.use(bodyParser.json()) // Using the Body Parser middleware to parse JSON data
app.use(corsMiddleware) // Enabling CORS for all routes
app.use(sessionMiddleware) // Using the Session middleware

// Spotify Routes
app.use('/spotifyAuth', spotifyAuth);
app.use('/search', searchRoute);
app.use('/playlists', userPlaylistsRoute);

// User Based Routes
app.use('/auth', authRoute);
app.use('/user', userRoute);

app.get('/api/spotify-token', (req, res) => {
    res.json({ token: process.env.SPOTIFY_ACCESS_TOKEN });
});

// Server start
const PORT = process.env.PORT // Getting the port number from environment variables-
app.listen(PORT, () => { // Starting the server and listening on the specified port
	console.log(`Listening on ${PORT}`) // Logging a message indicating that the server is running
})
