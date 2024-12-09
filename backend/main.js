const express = require('express') // Importing the Express framework
const path = require('path') // Importing the Path module
const bodyParser = require('body-parser') // Importing the Body Parser middleware
const MongoClient = require('mongodb').MongoClient // Importing the MongoDB client
const cors = require('cors') // Importing the CORS middleware
const session = require('express-session') // Importing the Express Session middleware
const MongoStore = require('connect-mongo') // Importing the Connect Mongo middleware

require('dotenv').config() // Loading environment variables from .env file

//spotify routes
const authRoute = require('./Routes/SpotifyAuthClient.js');
const searchRoute = require('./Routes/search.js');
const userPlaylistsRoute = require('./Routes/Playlist.js');

const app = express() // Creating an instance of the Express application

app.set('trust proxy', 1); // Trust first proxy

const PORT = process.env.PORT // Getting the port number from environment variables-

// MongoDB Atlas Connection
const uri = process.env.ATLAS_URI // Getting the MongoDB connection URI from environment variables
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }) // Creating a new MongoDB client

const dbName = process.env.DATABASE_NAME // Getting the database name from environment variables
const users = process.env.USERS_COLLECTION // Getting the collection name from environment variables

app.use(express.static(path.join(__dirname, '../radiohost/public'))) // Serving static files from the 'public' directory
app.use(bodyParser.urlencoded({ extended: true })) // Using the Body Parser middleware to parse URL-encoded data
app.use(bodyParser.json()) // Using the Body Parser middleware to parse JSON data

const corsEnable = {
	origin: 'http://localhost:3000',
	credentials: true,
}
app.use(cors(corsEnable)) // Enabling CORS for all routes

app.use(
    session({
        secret: 'newkey',
        resave: false,
        saveUninitialized: false, // Set to false to prevent empty sessions
        store: MongoStore.create({
			mongoUrl: process.env.ATLAS_URI,
			dbName: process.env.DATABASE_NAME,
			collectionName: 'session',
		}),
		cookie: {
            secure: false, // Set to true only if using HTTPS
            httpOnly: true,
			sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);

app.use('/spotifyAuth', authRoute);
app.use('/search', searchRoute);
app.use('/userPlaylists', userPlaylistsRoute);

app.post('/register', async(req, res) => {
	try {
		console.log('Request body:', req.body); // Log the request body for debugging
	
		const { email, username, password } = req.body; // Extracting 'email', 'username', and 'password' from the request body
	
		if (!email || !username || !password) {
		  return res.status(400).send('Email, username, and password are required');
		}
	
		await client.connect(); // Connecting to the MongoDB server
		const database = client.db(dbName); // Getting the database instance
		const collection = database.collection(users); // Getting the collection instance
	
		const data = await collection.findOne({ email: email }); // Finding a document in the collection with matching email
	
		if (data) { // If a user with the provided email already exists
		  return res.status(400).send('User already exists');
		}
	
		await collection.insertOne({ email, username, password }); // Inserting the new user into the collection
		res.status(201).send('User registered successfully');
	  } catch (error) {
		console.error('Error during registration:', error);
		res.status(500).send('Internal server error');
	  } finally {
		await client.close(); // Ensure the client is closed after the operation
	  }
})

app.post('/login', async(req, res) => { // Handling POST requests to '/login' endpoint
	try{
		await client.connect() // Connecting to the MongoDB server
		const {email, password} = req.body; // Extracting 'usr' and 'pwd' from the request body

		if(email === null  || password === null)
			res.status(400).send('Email and password are required, please double check') // Sending a response with status code 400 (Bad Request) if the email or password is missing

		const database = client.db(dbName) // Getting the database instance
		const collection = database.collection(users) // Getting the collection instance

		const data = await collection.findOne({email: email, password: password}) // Finding a document in the collection with matching email and password

		if(!data){
			res.status(401).send("User doesn't exist") // Sending 'false' response with status code 401 (Unauthorized) if the login is unsuccessful
		} // Checking if the provided email and password match the data
		req.session.user = { email: email}
		console.log("Session info /login: ", req.session.user.email)
		req.session.save((err) => {
			if (err) {
				console.error('Session save error:', err);
				res.status(500).send('Session save error');
			} else {
				console.log("Session saved:", req.session.user.email);
				res.status(200).send(true);
			}
		});
	} catch (error) {
		console.log(error) // Logging any errors that occur during the login process
	} finally {
		await client.close() // Closing the MongoDB connection
	}
})

app.get('/getUser', async(req, res) => {
	try {
		console.log("Session info /getUser: ", req.session.user.email); // Debugging session
	
		if (req.session.user.email) {
		  await client.connect();
		  const database = client.db(dbName);
		  const collection = database.collection(users);
	
		  const user_data = await collection.findOne({ email: req.session.user.email });
	
		  if (user_data) {
			res.status(200).send(user_data);
		  } else {
			res.status(401).send("No user found");
		  }
		} else {
		  res.status(401).send("No session email found");
		}
	  } catch (error) {
		console.log(error);
		res.status(500).send('Internal server error');
	  } finally {
		await client.close();
	  }
})

app.get('/api/spotify-token', (req, res) => {
    res.json({ token: process.env.SPOTIFY_ACCESS_TOKEN });
});


app.listen(PORT, () => { // Starting the server and listening on the specified port
	console.log(`Listening on ${PORT}`) // Logging a message indicating that the server is running
})
