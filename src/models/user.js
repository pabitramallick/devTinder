const mongoose = require('mongoose');


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
    },
},{
    timestamps: true,
});
module.exports = mongoose.model('User', userSchema);

// module.exports = userModel;