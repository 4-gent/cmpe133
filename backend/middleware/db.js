const { MongoClient } = require('mongodb') // Importing the MongoDB client
require('dotenv').config() // Loading environment variables from .env file

const uri = process.env.ATLAS_URI // Getting the MongoDB connection URI from environment variables
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }) // Creating a new MongoDB client

async function connectToDatabase(){
    if(!client.topology || !client.topology.isConnected()){ // Checking if the client is connected to the MongoDB server
        await client.connect()
    }
    const dbName = process.env.DATABASE_NAME // Getting the database name from environment variables
    const db = client.db(dbName)
    const users = process.env.USERS_COLLECTION // Getting the collection name from environment variables
    const playlist = process.env.PLAYLIST_COLLECTION // Getting the collection name from environment variables

    return {client, db, users, playlist}
}

module.exports = { connectToDatabase, client }