const express = require('express');

const app = express();




app.get(/u/, (req, res) => {
    console.log(req.query);
    
res.send({name:"John Doe", age: 30, email:"xyz"} )
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
    
});