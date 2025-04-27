const express = require('express');

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
const User = require('./models/user.js'); // Import the User model
const connectDB= require('./config/database.js'); // Import the database connection
const bcrypt = require('bcrypt');
app.post('/signUp', async (req, res) => {
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

app.post('/login', async (req, res) => {
    console.log('Received request:', req.body); // Log the received request body

    try {
        const { email, password } = req.body; // Extract from request body
        const user = await User.findOne({ email:email }); 
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password); // Compare the password with the hashed password
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }else {
            console.log('User logged in successfully');
            res.cookie('userID', user._id, { httpOnly: true }); // Set a cookie with the user ID
            res.send("user logged in successfully"); // Send a success response
            // res.status(200).json({ message: 'User logged in' });
        }

    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'error' });
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

// app.update('/updateUser', async (req, res) => {
//     const userID = req.body.userID; // Get the email from the request body
//     const updatedData = req.body; // Get the updated data from the request body
//     try {
//         const user = await User.findOneAndUpdate({ userID }, updatedData, { new: true }) // Find and update the user
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(user); // Send the updated user as a response
//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(500).json({ message: 'Error updating user' });
//     }
// })

// app.patch('/updateUser', async (req, res) => {
//     const userID = req.body.userID; // Get the email from the request body
//     const updatedData = req.body; // Get the updated data from the request body
//     console.log('Received request:', req.body); // Log the received request body

//     try {
//         const ALLOWED_UPDATES = ['firstName', 'lastName']; // Define the allowed fields for update
//         // const updates = Object.keys(updatedData); // Get the keys of the updated data
//         const isUpdateAllowed = Object.keys(updatedData).every((update) => ALLOWED_UPDATES.includes(update)); // Check if all updates are allowed
//         if (!isUpdateAllowed) {
//             // return res.status(400).json({ message: 'Invalid updates!' }); // If not, send an error response
//             throw new Error("Update not allowed!"); // If not, throw an error 
//         } 
//         // else {
//         //      console.log('Valid updates:', updatedData); 
//         // }
//         const user = await User.findOneAndUpdate({_id: userID }, updatedData, { new: true }) // Find and update the user
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(user); // Send the updated user as a response
//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(500).json({ message: 'Error updating user' });
//     }
// })

// app.patch('/updateUser/:userID', async (req, res) => {
//     console.log('Received request:', req.body); 

//     try {
//         const userID = req.params.userID; // Get userID from URL params
//         // const updatedData = req.body; // Get the fields to update from body

//         const {  ...fieldsToUpdate } = req.body; // Separate userID and other fields

//         const ALLOWED_UPDATES = ['firstName', 'lastName','email'];
//         const isUpdateAllowed = Object.keys(fieldsToUpdate).every((update) => ALLOWED_UPDATES.includes(update));

//         if (!isUpdateAllowed) {
//             throw new Error("Update not allowed!");
//         }

//         const user = await User.findOneAndUpdate({_id: userID }, fieldsToUpdate, { new: true });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.json(user);
//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(500).json({ message: 'Error updating user' });
//     }
// });


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
