const express = require('express');

const app = express();
app.get('/x', (req, res) => {

try {
    throw new Error('This is an error!');
    res.send('Data send');
} catch (error) { 
    console.error('Error occurred:', error);
    res.status(500).send('Internal Server Error');
    
    
}

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    
});