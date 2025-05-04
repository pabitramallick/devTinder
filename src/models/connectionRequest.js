const mangoose = require('mongoose');
const connectionRequestSchema = new mangoose.Schema({
    fromUserId:{
        type: mangoose.Schema.Types.ObjectId,
        required: true,
        ref :'User', // Reference to the User model
        
    
    },
    toUserId:{
        type: mangoose.Schema.Types.ObjectId,
        ref:'User', 
    required: true,
    },
    status:{
        type: String,
        required: true,
        enum: {values:['ignored','interested', 'accepted', 'rejected'],
            message: 'Status must be either pending, accepted, or rejected'
        }
        
    },
}
,{
    timestamps: true,
},
);

// connectionRequestSchema.pre( 'save', function (next) {
// const connectionRequests = this; 
// if(connectionRequests.fromUserId.equals(connectionRequests.toUserId)){
// throw new Error('You cannot send a connection request to yourself'); // Check if the sender and recipient are the same user
// }   
// next(); // Call the next middleware with the error
//     })

connectionRequestSchema.pre('save', function (next) {
    if (this.fromUserId.equals(this.toUserId)) {
        return next(new Error('You cannot send a connection request to yourself'));
    }
    next();
});

const ConnectionRequestModel = new mangoose.model('ConnectionRequest', connectionRequestSchema); // Create the model using the schema

module.exports = ConnectionRequestModel; // Export the model for use in other files