const express = require('express');

const app = express();

const { adminAuth, userAuth } = require('./middlewares/auth'); 

app.use('/admin', adminAuth); 


app.get("/normalPage",userAuth, (req, res) => {
console.log("Normal Page Middleware");
    
res.send("Normal Page");
})

app.get("/admin/user", (req, res) => {
    res.send("Admin Page");
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    
});