const express = require('express');
const profileRouter = express.Router();
const User = require('../models/user.js'); // Import the User model
const {userAuth} = require('../middlewares/auth.js'); // Import the user authentication middleware
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing


profileRouter.get('/profile',userAuth, async (req, res) => {

    try {
        const user = req.user; // Get the user from the request object (set by the middleware)

        res.send( user ); // Send the user ID as a response

    } catch (error) {
         console.error('Error retrieving user:', error);
        
        
    }
   
})

profileRouter.patch('/updateProfile',userAuth, async (req, res) => {
    console.log('Received request:', req.body); // Log the received request body

    try {
        const userID = req.user._id; // Get the user ID from the request object (set by the middleware)
        const updatedData = req.body; // Get the updated data from the request body

        const ALLOWED_UPDATES = ['firstName', 'lastName', 'email','password']; // Add 'email' also if you want to allow email update
        const isValidOperation = Object.keys(updatedData).every((update) => ALLOWED_UPDATES.includes(update)); // Check if all updates are allowed

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' }); // Send an error response if any update is not allowed
        }

        const user = await User.findByIdAndUpdate(userID, updatedData, { new: true }); // Update the user in the database and return the updated user

        if (!user) {
            return res.status(404).send(); // Send a 404 response if the user is not found
        }

        res.send(user); // Send the updated user as a response

    } catch (error) {
         console.error('Error updating user:', error);
         res.status(500).json({ message: 'Error updating user' });
    }
})

profileRouter.patch('/forgotPassword', async (req, res) => {
    console.log('Received request:', req.body); // Log the received request body

    try {
        const { email, password } = req.body; // Extract from request body
        const user = await User.findOne({ email:email }); // Find the user by email

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' }); // Send an error response if the user is not found
        }

        const passwordHash = await bcrypt.hash(password, 10); // Hash the new password
        user.password = passwordHash; // Update the user's password

        await user.save(); // Save the updated user to the database

        res.status(200).json({ message: 'Password updated successfully' }); // Send a success response

    } catch (error) {
         console.error('Error updating password:', error);
         res.status(500).json({ message: 'Error updating password' });
    }
})

module.exports = profileRouter; // Export the profile router
