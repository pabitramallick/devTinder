const express = require('express');

const app = express();




app.use("/user", (req, res,next) => {
    res.send("User route is working!");
    console.log("User route is working!");
    next();
    
});
app.use("/product", (req, res,next) => {
   res.send("Product route is working!");
    console.log("Product route is working!");
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
    
});