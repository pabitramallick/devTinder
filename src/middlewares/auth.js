const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const User = require('../models/user.js'); // Import the User model

    const userAuth = async (req, res, next) => {
        console.log("user auth Middleware");
        try {
            const token = req.cookies.token;
            console.log('Token from cookies:', token);
        
            if (!token) {
                throw new Error('Token not found');
            }
        
            const decodedToken = await jwt.verify(token, "pabitrasecretkey");
            console.log('Decoded Token:', decodedToken);
        
            // const {_id} = decodedToken._id;
        
            // const user = await User.findById(_id);
            
const { userId } = decodedToken; // Correct field
const user = await User.findById(userId); // Correct field
            console.log('User found:', user);
        
            if (!user) {
                throw new Error('User not found with this id');
            }
        
            req.user = user;
            next();
        } catch (error) {
            console.error('Auth Error:', error.message); // <<< print only error.message
            res.status(401).json({ message: 'Unauthorized', error: error.message });
        }
        
    //    try {
    //     const token = req.cookies.token; // Get the token from cookies
    //     // const {token} = req.cookies; // Get the token from cookies
    //     console.log(token); // Log the token for debugging
        
    //     if (!token) {
    //         // return res.status(401).json({ message: 'Unauthorized' }); // If no token, send unauthorized response
    //         throw new Error('token is not valid...'); // Throw an error if no token is provided
    //     }
    //     const decodedToken = await jwt.verify(token, "pabitrasecretkey"); // Verify the token
    //     const {_id} = decodedToken; // Extract the user ID from the token
    //   const user = await User.findById(_id); // Find the user by ID
    //     if (!user) {
    //         return res.status(401).json({ message: 'Unauthorized' }); // If user not found, send unauthorized response
    //     }else {
    //         console.log(user); // Log the user for debugging
    //     }
    //     req.user = user; // Attach the user to the request object
    //     next(); // Call the next middleware or route handler
    //    } catch (error) {
    //          console.error('Error in userAuth middleware:', error); // Log the error for debugging
    //     res.status(401).json({ message: 'Unauthorized' }); // Send unauthorized response
        
    //    }
    }

    module.exports = {userAuth}; // Export the middleware function for use in other files