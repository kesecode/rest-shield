const admin = require("firebase-admin");
const express = require('express')
const jwt = require('jsonwebtoken')

const serviceAccount = require("./secrets/firebase_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()
const app = express()

app.get('/api/get', (req, res) => {
    res.json({
        message: 'Get'
    })
});

app.post('/api/post', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            res.json({
                message: 'Post'
            })
        }
    });
});

app.post('/api/login', (req, res) => {
    //Mock user
    const user = {
        id: 1,
        username: 'action',
        email: 'abc@test.de'
    }

    jwt.sign({user}, 'secretkey', {expiresIn: '30s'}, (err, token) => {
        res.json({
            token
        });
    });
});


// verify token

function verifyToken(req, res, next) {
    // get auth header value
    const bearerHeader = req.headers['authorization']
    // check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // split at the space
        const bearer = bearerHeader.split(' ');
        // get token from array
        const bearerToken = bearer[1];
        // set the token
        req.token = bearerToken;
        // next middleware
        next();
    } else {
        res.sendStatus(403);
    }
}


app.listen(3001, () => console.log('Server started on 3001'));