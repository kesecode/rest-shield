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

app.post('/api/post', (req, res) => {
    res.json({
        message: 'Post'
    })
});

app.post('/api/login', (req, res) => {
    //Mock user
    const user = {
        id: 1,
        username: 'action',
        email: 'abc@test.de'
    }

    jwt.sign({user}, 'secretkey', (err, token) => {
        res.json({
            token
        });
    });
});


app.listen(3001, () => console.log('Server started on 3001'));