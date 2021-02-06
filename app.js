const admin = require("firebase-admin");
const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs');

const serviceAccount = require("./secrets/firebase_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()
const app = express()

app.get('/api/get', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            const repo = req.headers['repo'];
            if(typeof repo !== undefined) {
                //get doc
                const repoRef = db.collection('coverage').doc(repo);
                const doc = await repoRef.get();
                if (!doc.exists) {
                    res.sendStatus(404)
                  } else {
                      res.json({
                          coverage: doc.data()
                      })
                  }
            } else {
                res.sendStatus(403)
            }
        }
    });
});

app.post('/api/post', verifyToken, (req, res) => {
    
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


app.listen(3001, () => {
    console.log('Server started on 3001')
    //generate token
    jwt.sign({}, 'secretkey', {/*expiresIn: '30s'*/}, async (err, token) => {
        if(err) {
            console.log(err)
        } else {
            const tokenRef = db.collection('token');
            await tokenRef.doc('actions-token').set({
                token: token
              });
        }
    });
});