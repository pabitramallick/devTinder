const express = require('express');

const app = express();



app.use('/user', (req, res, next) => {
    // console.log('Middleware for /user route');
    res.send('Middleware response for /user route');
    next(); // Call the next middleware or route handler
})
app.get('/user', (req, res) => {
res.send({name:"John Doe", age: 30, email:"xyz"} )
})
app.post('/user', (req, res) => {
    res.send("data saved to database ")
})
    
app.use('/test',(req, res) => {
res.send("test from server");

})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
    
});