const express = require('express');

const app = express();

const User = require('./models/user.js'); // Import the User model
const connectDB= require('./config/database.js'); // Import the database connection

app.post('/signUp', async (req, res) => {
    const user = new User({
        firstName:"Lucy",
        lastName: "singha",
        email: "pabitramallik55ss9@gmail.com",
        password: "xyz1232",
       
    }); // Create a new user 
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



connectDB().then(() => {
    console.log('MongoDB connection established');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
        
    });
}).catch((error) => {
    console.error('MongoDB connection error:', error);
})
