const express = require('express');
const requestRouter = express.Router();
const User = require('../models/user.js'); // Import the User model
const {userAuth} = require('../middlewares/auth.js'); // Import the user authentication middleware
const ConnectionRequest = require('../models/connectionRequest.js'); // Import the connection request model


requestRouter.post('/request/send/:status/:toUserId',userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id; // Get the authenticated user's ID from the request
        const toUserId = req.params.toUserId; // Get the recipient's user ID from the request parameters
        const status = req.params.status;  
        const allowedStatuses = ['ignored', 'interested']
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status'+status }); // Check if the status is valid
        }
        const toUser = await User.findById(toUserId); // Find the recipient user by ID
        if (!toUser) {
            return res.status(404).json({ message: 'User not found' }); // Check if the recipient user exists
        message: 'User not found' 
        }
        
        const existingconnectionRequest = await ConnectionRequest.findOne({
            $or:[ { fromUserId, toUserId },
             { fromUserId: toUserId, toUserId: fromUserId }],
            
        })
        if (existingconnectionRequest) {
            return res.status(400).json({ message: 'Connection request already exists' }); // Check if a connection request already exists between the users
        }
        const connectionRequest = await ConnectionRequest.create({ fromUserId, toUserId, status})
       const data= await connectionRequest.save(); // Save the connection request to the database
       res.json({ message: req.user.firstName + ' ' + req.user.lastName +' '+status + ' connection request to ' + toUser.firstName + ' ' + toUser.lastName,  
        data }); // Send a 
    } catch (error) {
       console.error('Error sending connection request:', error.message);
        return res.status(400).json({ message: error.message }); // Send an
        
        
    }
    // res.send(user.firstName + ' ' + user.lastName + ' has sent you a connection request.'); // Send a response to the client
})


requestRouter.post('/request/review/:status/:requestId',userAuth,  async (req, res) => {
try {
    const loggedInUser = req.user; // Get the authenticated user's ID from the request
    const allowedStatuses = ['accepted', 'rejected']; // Define allowed statuses for connection requests
    const {status, requestId} = req.params
     if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' }); // Check if the status is valid
}
const connectionRequest = await ConnectionRequest.findOne(
    {    _id:requestId,
        toUserId: loggedInUser._id, // Check if the request belongs to the logged-in user
        status: "interested" // Check if the request is in the 'interested' status
    }); // Find the connection request by ID

    if (!connectionRequest) {
        return res.status(404).json({ message: 'Connection request not found or already reviewed' }); // Check if the connection request exists and is in the correct status
    }
 
connectionRequest.status = status; // Update the status of the connection request
const data = await connectionRequest.save(); // Save the updated connection request to the database
res.json({ message: 'Connection request ' + status + ' successfully', data }); // Send a response to the client



} catch (error) {
     console.error('Error reviewing connection request:', error.message);
    return res.status(400).send({ message: error.message }); // Send an error response
    
}})

module.exports = requestRouter; // Export the request router
