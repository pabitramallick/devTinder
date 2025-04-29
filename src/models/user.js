const { validate } = require('email-validator');
const mongoose = require('mongoose');
const validator = require('validator'); // Import the validator 
// const validator = require('validator');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const bcrypt = require('bcrypt'); // Import the bcrypt library for password hashing

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    },
    lastName: {
        type: String,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
           
            if(!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            
        }
        }
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })) {
                throw new Error('Password must be strong and contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and symbols.');
            }}
    },
},{
    timestamps: true,
});

userSchema.methods.getJWT = async function() {
    const user = this; // Get the user instance
    // const token1 = await jwt.sign({ _id: user},"pabitrasecretkey",{expiresIn:"1m"}); // Generate a JWT token using the user's ID
    const token =await jwt.sign({ userId: user._id },"pabitrasecretkey",{expiresIn:"1m"} );
    return token; // Return the generated token

}

userSchema.methods.verifyPassword = async function(passwordInputbyUser) 
{
    console.log('Password input by user:', passwordInputbyUser);
    
    const user = this; // Get the user instance
    const passwordHash = user.password; 
    const isPasswordValid = await bcrypt.compare(passwordInputbyUser,passwordHash);
    return isPasswordValid; // Return true if the password is valid, false otherwise
}
module.exports = mongoose.model('User', userSchema);

// module.exports = userModel;