const express = require('express');
const profileRouter = express.Router();
const User = require('../models/user.js'); // Import the User model
const {userAuth} = require('../middlewares/auth.js'); // Import the user authentication middleware


profileRouter.get('/profile',userAuth, async (req, res) => {

    try {
        const user = req.user; // Get the user from the request object (set by the middleware)

        res.send( user ); // Send the user ID as a response

    } catch (error) {
         console.error('Error retrieving user:', error);
        
        
    }
   
})

module.exports = profileRouter; // Export the profile router
