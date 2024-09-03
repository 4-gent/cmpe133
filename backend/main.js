const express = require('express') // Importing the Express framework
const path = require('path') // Importing the Path module
const bodyParser = require('body-parser') // Importing the Body Parser middleware
const MongoClient = require('mongodb').MongoClient // Importing the MongoDB client
const BSON = require('bson') // Importing the BSON library
const multer = require('multer') // Importing the Multer middleware
const fs = require('fs') // Importing the File System module
const formData = require('form-data') // Importing the Form Data module

require('dotenv').config() // Loading environment variables from .env file

const app = express() // Creating an instance of the Express application

const PORT = process.env.PORT // Getting the port number from environment variables

// MongoDB Atlas Connection
const uri = process.env.MONGODB_URI // Getting the MongoDB connection URI from environment variables
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }) // Creating a new MongoDB client

const dbName = process.env.DATABASE_NAME // Getting the database name from environment variables
const collectionName = process.env.COLLECTION_NAME // Getting the collection name from environment variables

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
