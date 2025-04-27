const { validate } = require('email-validator');
const mongoose = require('mongoose');
const validator = require('validator'); // Import the validator 
// const validator = require('validator');

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
module.exports = mongoose.model('User', userSchema);

// module.exports = userModel;