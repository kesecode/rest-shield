const admin = require("firebase-admin");
const firebase = require("firebase");
const express = require('express');
const jwt = require('jsonwebtoken');

const serviceAccount = require("./secrets/firebase_key.json");
const firebaseConfig = require("./secrets/firebaseConfig.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();
const fire = firebase.initializeApp(firebaseConfig);
const app = express();


app.get('/', (req, res) => {
    return res.send('Hello');
});


app.get('/api/get/firebaseChat', async (req, res, next) => {
    const docRef = db.collection('coverage').doc('FirebaseChat');
    try {
        const doc = await docRef.get()
        if (!doc.exists) {
            return res.sendStatus(404)
        } else {
            res.json(createResponse(parseCoverage(JSON.stringify(doc.data()))))
        }
    } catch (error) {
        return next(error);
    }
});


app.post('/api/post', verifyToken, (req, res) => {
    const docRef = db.collection('coverage').doc('FirebaseChat');
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            return res.sendStatus(403);
        } else {
            const json = req.headers['json'];
            let cov = parseCoverage(json);
            docRef.update({ "coverage": cov });
            return res.sendStatus(200);
        }
    });
});


app.post('/api/auth', (req, res) => {
    const authHeader = req.headers['authorization']
    let username, password;
    if (typeof authHeader !== 'undefined') {
        const auth = authHeader.split(' ');
        username = auth[0];
        password = auth[1];
    } else {
        return res.sendStatus(500);
    }

    fire.auth().signInWithEmailAndPassword(username, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(user)
            jwt.sign({}, 'secretkey', { expiresIn: '30s' }, async (err, token) => {
                if (err) {
                    console.log(err)
                    return res.sendStatus(500);
                } else {
                    res.json({
                        token: token
                    });
                }
            });
        })
        .catch((error) => {
            return res.sendStatus(403);
        });
});


function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        return next();
    } else {
        return res.sendStatus(403);
    }
}


function parseCoverage(data) {
    const obj = JSON.parse(data)
    return obj.coverage
}


function createResponse(coverage) {
    let color = "brightgreen"
    if (coverage < 95) color = "green"
    if (coverage < 80) color = "yellowgreen"
    if (coverage < 70) color = "yellow"
    if (coverage < 60) color = "orange"
    if (coverage < 50) color = "red"

    return { "schemaVersion": 1, "label": "coverage", "message": String(coverage), "color": color }
}


app.listen(3001, () => {
    console.log('Server started on 3001');
});