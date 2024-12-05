const express = require('express') // Importing the Express framework
const path = require('path') // Importing the Path module
const bodyParser = require('body-parser') // Importing the Body Parser middleware
const MongoClient = require('mongodb').MongoClient // Importing the MongoDB client
const BSON = require('bson') // Importing the BSON library
const multer = require('multer') // Importing the Multer middleware
const fs = require('fs') // Importing the File System module
const formData = require('form-data') // Importing the Form Data module
const cors = require('cors') // Importing the CORS middleware
const axios = require('axios');

//spotify routes
const authRoute = require('./Routes/SpotifyAuthClient.js');
const searchRoute = require('./Routes/search.js');
const userPlaylistsRoute = require('./Routes/Playlist.js');



require('dotenv').config() // Loading environment variables from .env file

const app = express() // Creating an instance of the Express application

const corsEnable = {
	origin: 'http://localhost:3000',
	credentials: true,
}
app.use(cors(corsEnable)) // Enabling CORS for all routes

app.use('/spotifyAuth', authRoute);
app.use('/search', searchRoute);
app.use('/userPlaylists', userPlaylistsRoute);


const PORT = process.env.PORT // Getting the port number from environment variables-
// MongoDB Atlas Connection
const uri = process.env.ATLAS_URI // Getting the MongoDB connection URI from environment variables
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }) // Creating a new MongoDB client

const dbName = process.env.DATABASE_NAME // Getting the database name from environment variables
const users = process.env.USERS_COLLECTION // Getting the collection name from environment variables


app.use(express.static(path.join(__dirname, '../radiohost/public'))) // Serving static files from the 'public' directory
app.use(bodyParser.urlencoded({ extended: true })) // Using the Body Parser middleware to parse URL-encoded data
app.use(bodyParser.json()) // Using the Body Parser middleware to parse JSON data



app.post('/register', async(req, res) => {
	try{
		await client.connect() // Connecting to the MongoDB server
		const { email, username, password } = req.body; // Extracting 'email', 'username', and 'password' from the request body
		const database = client.db(dbName) // Getting the database instance
		const collection = database.collection(users) // Getting the collection instance

		const data = await collection.findOne({email: email}) // Finding a document in the collection with matching email

		if(data){
			if(data.email == email) // Checking if the provided email matches the data
				res.status(400).send("Error") // Sending 'false' response if the email already exists
		}
		else {
			const result = await collection.insertOne({email: email, username: username, password: password}) // Inserting a new document into the collection
			res.status(200).send("Inserted") // Sending 'true' response if the registration is successful
		}
	} catch (error) {
		console.log(error) // Logging any errors that occur during the registration process
	} finally {
		await client.close() // Closing the MongoDB connection
	}
})





app.post('/login', async(req, res) => { // Handling POST requests to '/login' endpoint
	try{
		await client.connect() // Connecting to the MongoDB server
		const {usr, pwd} = req.body; // Extracting 'usr' and 'pwd' from the request body

		const database = client.db(dbName) // Getting the database instance
		const collection = database.collection(process.env.LOGIN_COLLECTION) // Getting the collection instance

		const data = await collection.findOne({email: usr, password: pwd}) // Finding a document in the collection with matching email and password

		if(data.email === null || data.password === null || usr === null) // Checking if the data is null or undefined
			res.send(false) // Sending 'false' response if the data is invalid
		if(req.body.usr === data.email && req.body.pwd === data.password) // Checking if the provided email and password match the data
			res.send(true) // Sending 'true' response if the login is successful
		else
			res.status(401).send(false) // Sending 'false' response with status code 401 (Unauthorized) if the login is unsuccessful
	} catch (error) {
		console.log(error) // Logging any errors that occur during the login process
	} finally {
		await client.close() // Closing the MongoDB connection
	}
})



app.listen(PORT, () => { // Starting the server and listening on the specified port
	console.log(`Listening on ${PORT}`) // Logging a message indicating that the server is running
})
