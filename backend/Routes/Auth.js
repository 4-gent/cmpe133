const router = require('express').Router(); // Importing the Router class from Express
const { connectToDatabase } = require('../middleware/db'); // Importing the MongoDB client

router.post('/register', async(req, res) => {
    let client;
	try {
		console.log('Request body:', req.body); // Log the request body for debugging
	
		const { email, username, password } = req.body; // Extracting 'email', 'username', and 'password' from the request body
	
		if (!email || !username || !password) {
		  return res.status(400).send('Email, username, and password are required');
		}
	
        const {client, db, users} = await connectToDatabase(); // Connecting to the database
		const collection = db.collection(users); // Getting the collection instance
	
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
        if(client)
            await client.close(); // Closing the MongoDB connection
      }
})

router.post('/login', async(req, res) => { // Handling POST requests to '/login' endpoint
    let client;
    try{
		const {email, password} = req.body; // Extracting 'usr' and 'pwd' from the request body

		if(email === null  || password === null)
			res.status(400).send('Email and password are required, please double check') // Sending a response with status code 400 (Bad Request) if the email or password is missing

        const {client, db, users} = await connectToDatabase(); // Connecting to the database
		const collection = db.collection(users); // Getting the collection instance

		const data = await collection.findOne({email: email}) // Finding a document in the collection with matching email and password

		if(!data){
			res.status(401).send("User doesn't exist") // Sending 'false' response with status code 401 (Unauthorized) if the login is unsuccessful
		} // Checking if the provided email and password match the data

        if (data.password !== password) { // If the password does not match
            return res.status(401).send('Incorrect password');
        }

        req.session.user = { email: email }; // Saving the user email in the session
        console.log("Session info /login: ", req.session.user.email);
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).send('Session save error');
            } else {
                return res.status(200).send('Login successful');
            }
        });
	} catch (error) {
		console.log(error) // Logging any errors that occur during the login process
	} finally {
        if(client)
            await client.close(); // Closing the MongoDB connection
	}
})

module.exports = router; // Exporting the router to be used in the main application