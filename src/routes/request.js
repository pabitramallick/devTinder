const express = require('express');
const requestRouter = express.Router();
const User = require('../models/user.js'); // Import the User model
const {userAuth} = require('../middlewares/auth.js'); // Import the user authentication middleware



requestRouter.post('/sendConnectionRequest',userAuth, async (req, res) => {
    console.log('Received request:', req.body); // Log the received request body
    
    res.send('Connection request sent'); // Send a response to the client
    
})

module.exports = requestRouter; // Export the request router
