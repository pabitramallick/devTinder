const express = require('express');

const app = express();
app.use('/test',(req, res, next) => {

res.send("hello from server");
    
    
    
})


hello = (req, res, next) => {
    res.send("hello from app.js");
}

console.log(hello.toString());


app.use('/hello',(req, res, next) => {

    res.send("hello hellwo from server");
        
        
        
    })

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    
});