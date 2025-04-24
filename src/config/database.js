const mongoose = require('mongoose');

const connectDB = async () => {
   
await mongoose.connect('mongodb+srv://namasteDev:lVKQpxDWi8tncHJE@namastenode.omkkgds.mongodb.net/')};

module.exports = connectDB   
 