const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const BSON = require('bson')
const multer = require('multer')
const fs = require('fs')
const formData = require('form-data')

require('dotenv').config()

const app = express()

const PORT = process.env.PORT

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`)
})
