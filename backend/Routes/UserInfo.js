const router = require("express").Router();
const { connectToDatabase } = require('../middleware/db'); // Importing the MongoDB client

router.get('/getUser', async(req, res) => {
    let client;
	try {
		console.log("Session info /getUser: ", req.session.user.email); // Debugging session
	
		if (req.session.user.email) {
          const {client, db, users} = await connectToDatabase(); // Connecting to the database
          const collection = db.collection(users); // Getting the collection instance

		  const user_data = await collection.findOne({ email: req.session.user.email });
	
		  if (user_data) {
            console.log("user data: ", user_data);
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
        if (client){
		    await client.close();
        }
	  }
})

module.exports = router; // Exporting the router object to be used in the main application