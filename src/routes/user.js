const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth.js'); // Import the user authentication middleware
const ConnectionRequest = require('../models/connectionRequest.js'); 
const USER_SAFE_DATA =  ['firstName', 'lastName', 'email']; // Define the fields to be populated in the response
const User = require('../models/user.js'); 
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
try {
    const loggedInUser = req.user; 
    const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id, 
        status: "interested" 
        
    }).populate('fromUserId', USER_SAFE_DATA); 
    res.json({ message: 'Connection requests retrieved successfully', connectionRequests }); // 
} catch (error) {
    
       console.error('Error retrieving connection requests:', error.message);
         return res.status(400).json({ message: error.message }); // Send an error response
}
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user; 
      const connections = await ConnectionRequest.find({
        $or: [
          { fromUserId: loggedInUser._id, status: 'accepted' },
          { toUserId: loggedInUser._id, status: 'accepted' }
        ]
    }) .populate('fromUserId', ['firstName', 'lastName', 'email']).populate('toUserId', ['firstName', 'lastName', 'email']); 
    const data = connections.map((row) =>{
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId; // If the logged-in user is the sender, return the recipient's data
        }  
        return row.fromUserId; // If the logged-in user is the recipient, return the sender's data    
    }); 
    res.json({ message: 'Connection requests retrieved successfully', data }); // 
    } catch (error) {
        console.error('Error retrieving connections:', error.message);
        return res.status(400).json({ message: error.message }); 
    }
})


userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1; 
        let limit = parseInt(req.query.limit) || 10; 
        limit = limit > 50 ? 50 : limit; // Limit the maximum number of results to 100
          
        const skip = (page - 1) * limit; 
        const connectionsRequests = await ConnectionRequest.find({
              $or: [
                { fromUserId: loggedInUser._id},
                { toUserId: loggedInUser._id}
              ]
        }).select('fromUserId toUserId')


        const hideUsersFromFeed = new Set(); 
connectionsRequests.forEach((req) => {
           
                hideUsersFromFeed.add(req.toUserId._id.toString()); // Add the recipient's ID to the set
          
                hideUsersFromFeed.add(req.fromUserId._id.toString()); // Add the sender's ID to the set
            })
            console.log('hideUsersFromFeed:', hideUsersFromFeed); // Log the set of user IDs to be hidden from the feed
            const users = await User.find({
                $and: [
                    { _id: { $nin: Array.from(hideUsersFromFeed) } }, // Exclude users in the set from the feed
                    { _id: { $ne: loggedInUser._id } } // Exclude the logged-in user from the feed
                ],
            }).select(USER_SAFE_DATA).skip(skip).limit(limit); 





           res.send({ message: 'Feed retrieved successfully', users }); // Send the feed data as a response 







    } catch (error) {
         console.error('Error retrieving feed:', error.message);
         return res.status(400).json({ message: error.message }); 
        
    }
})



module.exports = userRouter; // Export the router for use in other files