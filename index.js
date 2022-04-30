require('dotenv').config();
const express = require('express');
const querystring = require('querystring');
const axios = require('axios');
const app = express();
const port = 8888;

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = 'user-read-private user-read-email';

    const queryParams = querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: scope
    });
    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const payload = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
        }
    };
    axios(payload).then(response => {
        if (response.status === 200) {
            const { access_token, refresh_token } = response.data;
            const queryParams = querystring.stringify({
                access_token,
                refresh_token
            });
            res.redirect(`http://localhost:3000/?${queryParams}`);
        } else {
            res.redirect(`/?${querystring.stringify({error: 'invalid_token'})}`);
        }
    }).catch(err => {
        res.send(err);
    });
});

app.get('/refresh_token', (req, res) => {
    const {refresh_token} = req.query;
    const payload = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
        }
    };
    axios(payload).then(response => {
        res.send(JSON.stringify(response.data, null, 2));       
    }).catch(err => {
        res.send(err);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});