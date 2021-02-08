const admin = require("firebase-admin");
const auth = require("firebase");
const express = require('express');
const jwt = require('jsonwebtoken');

const serviceAccount = require("./secrets/firestoreKey.json");
const firebaseConfig = require("./secrets/firebaseConfig.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const PORT = 3001
const router = express();
const firebase = auth.initializeApp(firebaseConfig);
const firestore = admin.firestore();


router.get('/', (req, res) => {
    return res.send('Hello');
});


router.get('/api/get/firebaseChat', async (req, res, next) => {
    const docRef = firestore.collection('coverage').doc('FirebaseChat');
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


router.post('/api/post', verifyToken, (req, res) => {
    const docRef = firestore.collection('coverage').doc('FirebaseChat');
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            return res.sendStatus(403);
        } else {
            const json = req.headers['json'];
            let cov = Math.floor(parseCoverage(json) * 100);
            docRef.update({ "coverage": cov });
            return res.sendStatus(200);
        }
    });
});


router.post('/api/auth', (req, res) => {
    const authHeader = req.headers['authorization']
    let username, password;
    if (typeof authHeader !== 'undefined') {
        const auth = authHeader.split(' ');
        username = auth[0];
        password = auth[1];
    } else {
        return res.sendStatus(500);
    }

    firebase.auth().signInWithEmailAndPassword(username, password)
        .then((userCredential) => {
            // Signed in
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

    return { "schemaVersion": 1, "label": "coverage", "message": String(coverage) + '%', "color": color }
}


router.listen(PORT, () => {
    console.log('Server started on ', PORT);
});
