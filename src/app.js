const express = require('express');

const app = express();
const cookieParser = require('cookie-parser'); // Import cookie-parser to handle cookies
app.use(express.json()); // Middleware to parse JSON request bodies
app.use (cookieParser()); // Use cookie-parser middleware to parse cookies
const User = require('./models/user.js'); // Import the User model
const connectDB= require('./config/database.js'); // Import the database connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation and verification
const {userAuth} = require('./middlewares/auth.js'); // Import the user authentication middleware

const authRouter = require('./routes/auth.js'); // Import the authentication routes
const requestRouter = require('./routes/request.js'); // Import the request routes
const profileRouter = require('./routes/profile.js'); // Import the profile
const userRouter = require('./routes/user.js'); // Import the user routes


app.use("/", authRouter); // Use the authentication routes under the '/auth' path
app.use("/", requestRouter); // Use the request routes under the '/request' path
app.use("/", profileRouter); // Use the profile routes under the '/profile' path
app.use("/", userRouter); 


app.get('/getUsers', async (req, res) => {
    const userEmail = req.body.email; // Get the email from the request body
   try {
   const user = await User.findOne({ email: userEmail }) 
  
    if (user.length === 0) {
        res.status(404).send('No users found' );
    } else {
   res.send(user); 
        
    }
   } catch (error) {
    res.status(500).json({ message: 'Error retrieving users' });
   }
})



app.delete('/deleteUser', async (req, res) => {
    const userID = req.body.userID; // Get the email from the
    try {
        const user = await User .findOneAndDelete({userID})
    } catch (error) {
         console.error('Error deleting user:', error);
  res.status(500).json({ message: 'Error deleting user' });        
        
    }
})


app.patch('/updateUser/:userID', async (req, res) => {
    console.log('Received request:', req.body); 

    try {
        const userID = req.params.userID;
        const updatedData = req.body;

        const ALLOWED_UPDATES = ['firstName', 'lastName', 'email','password']; // Add 'email' also if you want to allow email update
        const isUpdateAllowed = Object.keys(updatedData).every((update) => ALLOWED_UPDATES.includes(update));

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed!");
        }

        const user = await User.findOneAndUpdate(
            { _id: userID },
            updatedData,
            { new: true, runValidators: true } // very important!
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: error.message || 'Error updating user' });
    }
});



app.get('/getAllUsers', async (req, res) => {
    try {
        const users = await User.find(); // Retrieve all users from the database
        res.send(users); // Send the list of users as a response
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users' });
    }
})




connectDB().then(() => {
    console.log('MongoDB connection established');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
        
    });
}).catch((error) => {
    console.error('MongoDB connection error:', error);
})
