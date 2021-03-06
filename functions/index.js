const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const express = require("express");
const app = express();

app.get("/screams", (req, res) => {
    admin
        .firestore()
        .collection("screams")
        .orderBy("createdAt", "desc")
        .get()
        .then(data => {
            let screams = [];
            data.forEach(doc => {
                console.log(doc.data());
                screams.push({
                    screamId: doc.id,
                    ...doc.data()
                });
            });

            return res.json(screams);
        })
        .catch(err => console.error(err));
});

app.post("/scream", (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString
    };

    admin
        .firestore()
        .collection("screams")
        .add(newScream)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfuly` });
        })
        .catch(err => {
            res.status(500).json({ error: `something went wrong` });
            console.log(err);
        });
});

exports.api = functions.region("asia-east2").https.onRequest(app); // add prefix API to the URL
