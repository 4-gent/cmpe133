const MongoStore = require('connect-mongo') // Importing the Connect Mongo middleware
const session = require('express-session') // Importing the Express Session middleware
require('dotenv').config() // Importing the dotenv module to read environment variables

const sessionMiddleware = session({
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
});

module.exports = sessionMiddleware;