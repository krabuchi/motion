require('dotenv').config();
const express = require('express');
const app = express();
const port = 8888;

const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI} = process.env;

app.get('/login', (req, res) => {
    res.redirect(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`);
});
 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});