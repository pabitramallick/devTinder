const express = require('express');

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
const User = require('./models/user.js'); // Import the User model
const connectDB= require('./config/database.js'); // Import the database connection

app.post('/signUp', async (req, res) => {
    console.log('Received request:', req.body); // Log the received request body

    const user = new User(req.body
); // Create a new user 
try {
await user.save()

    .then(() => {
        console.log('User saved successfully');
        res.status(201).json({ message: 'User created' })

})
} catch (error) { 
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Error creating user' });
    
    
}
 })



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
