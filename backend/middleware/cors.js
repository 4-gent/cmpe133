const cors = require('cors') // Importing the CORS middleware

const corsEnable = {
    origin: 'http://localhost:3000',
    credentials: true,
}

const corsMiddleware = cors(corsEnable) // Enabling CORS for all routes

module.exports = corsMiddleware // Exporting the CORS middleware