const express = require('express');
const authRouter = express.Router();
const User = require('../models/user.js'); // Import the User model
const bcrypt = require('bcrypt');
const {userAuth} = require('../middlewares/auth.js'); // Import the user authentication middleware


authRouter.post('/signUp', async (req, res) => {
    console.log('Received request:', req.body); // Log the received request body

    try {
        const { firstName, lastName, email, password } = req.body; // Extract from request body

        const passwordHash = await bcrypt.hash(password, 10);
        console.log('Password hash', passwordHash); // Log the hashed password

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });

        await user.save();
        console.log('User saved successfully');
        res.status(201).json({ message: 'User created' });

    } catch (error) { 
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});


authRouter.post('/login', async (req, res) => {
    console.log('Received request:', req.body); // Log the received request body

    try {
        const { email, password } = req.body; // Extract from request body
        const user = await User.findOne({ email:email }); 
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        const isPasswordValid = await user.verifyPassword(password);// Compare the password with the hashed password
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }else {
            console.log('User logged in successfully');
            // const token = jwt.sign({ userId: user._id },"pabitrasecretkey",{expiresIn:"1m"} ); // Generate a JWT token,
            const token = await user.getJWT(); // Generate a JWT token using the getJWT method in the User model
            console.log('Generated token:', token); // Log the generated token
            res.cookie("token",token,); // Set a cookie with the user ID
            res.send("user logged in successfully"); // Send a success response
            // res.status(200).json({ message: 'User logged in' });
        }

    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'error' });
    }
        
})

authRouter.post('/logout', userAuth, async (req, res) => {
    console.log('Received request:', req.body); // Log the received request body

    try {
        const user = req.user; // Get the authenticated user from the request
        console.log('User logged out:', user); // Log the user being logged out

        res.clearCookie("token"); // Clear the cookie
        res.status(200).json({ message: 'User logged out' }); // Send a success response

    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Error logging out user' });
    }
})

module.exports = authRouter;