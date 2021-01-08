const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("./permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-curd-restapi-f8f19-default-rtdb.firebaseio.com",
});

const express = require("express");
const app = express();
const db = admin.firestore();
const cors = require("cors");
app.use(
  cors({
    origin: true,
  })
);

// Routes
app.get("/api", (req, res) => {
  return res.status(200).send("Api Working Well");
});

// Create

app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db
        .collection("users")
        .doc("/" + req.body.id + "/")
        .create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  })();
});

// Read

app.get("/api/read/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("users").doc(req.params.id);
      let product = await document.get();
      let response = product.data();

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  })();
});

// Read app api

app.get("/api/read/", (req, res) => {
  (async () => {
    try {
      let query = db.collection("users");
      let response = [];

      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs;
        for (let doc of docs) {
          const selectedItem = {
            id: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            password: doc.data().password,
          };
          response.push(selectedItem);
        }
        return response;
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  })();
});

// Update

app.put("/api/update/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("users").doc(req.params.id);
      await document.update({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  })();
});

// Delete
app.delete("/api/delete/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("users").doc(req.params.id);
      await document.delete();
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  })();
});

// Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
