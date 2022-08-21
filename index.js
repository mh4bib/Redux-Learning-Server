const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const jwt = require('jsonwebtoken')

require('dotenv').config();
// const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');



// const ObjectId = require('mongodb').ObjectId;

//middleware
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jyjlkyq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const documentationsCollection = client
      .db("redux-learning")
      .collection("documentations");
    const routesCollection = client.db("redux-learning").collection("routes");
    const usersCollection = client.db("redux-learning").collection("users");
    const quizzesCollection = client.db("redux-learning").collection("quizzes");
    const userInfoCollection = client
      .db("redux-learning")
      .collection("userInfo");
    const reviewsCollection = client.db("redux-learning").collection("reviews");
    const forumsCollection = client.db("redux-learning").collection("forums");
    const forumsAnswerCollection = client.db("redux-learning").collection("forumsAnswer");

    // Nested Route
    app.post("/routes", async (req, res) => {
      const newItem = req.body;
      const result = await routesCollection.insertOne(newItem);
      res.send(result);
    });

    app.get("/routes", async (req, res) => {
      const query = {};
      const cursor = await routesCollection.find(query);
      const routes = await cursor.toArray();
      res.send(routes);
    });

    //--------post a documentation
    app.post("/doc", async (req, res) => {
      const newItem = req.body;
      console.log("new item added", newItem);
      const result = await documentationsCollection.insertOne(newItem);
      // res.send({result : 'success'})
      res.send(result);
    });

    //-----get all doc
    app.get("/doc", async (req, res) => {
      const query = {};
      const cursor = documentationsCollection.find(query);
      const documentations = await cursor.toArray();
      res.send(documentations);
    });

    //--- get individual doc
    app.get("/doc/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await documentationsCollection.findOne(query);
      res.send(result);
    });

    //-----modify individual doc
    app.put("/doc/:id", async (req, res) => {
      const id = req.params.id;
      const updateTopic = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateTopic.quantity,
        },
      };
      const result = await documentationsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
      console.log(result);
    });

    //----------delete a doc
    app.delete("/doc/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await documentationsCollection.deleteOne(query);
      res.send(result);
      console.log(id, result);
    });

    // Users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email: email });
      const isAdmin = user?.role === "admin";
      res.send(isAdmin);
    });

    // UserInfo
    app.put("/userInfo/:email", async (req, res) => {
      const email = req.params.email;
      const userInfo = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: userInfo,
      };
      const result = await userInfoCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/userInfo/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userInfoCollection.findOne({ email: email });
      res.send(user);
    });

    // Quizzes
    app.post("/quizzes", async (req, res) => {
      const newItem = req.body;
      const result = await quizzesCollection.insertOne(newItem);
      // res.send({result : 'success'})
      res.send(result);
    });

    app.get("/quizzes", async (req, res) => {
      const query = {};
      const cursor = await quizzesCollection.find(query);
      const quizzes = await cursor.toArray();
      res.send(quizzes);
    });

    // reviews
    app.post("/reviews", async (req, res) => {
      const newItem = req.body;
      const result = await reviewsCollection.insertOne(newItem);
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // forums 
    app.post("/forums", async (req, res) => {
      const newItem = req.body;
      const result = await forumsCollection.insertOne(newItem);
      res.send(result);
    });

    app.get("/forums", async (req, res) => {
      const query = {};
      const cursor = forumsCollection.find(query);
      const forums = await cursor.toArray();
      res.send(forums);
    });

    // forums Answer
    app.post("/forumsAnswer", async (req, res) => {
      const newItem = req.body;
      const result = await forumsAnswerCollection.insertOne(newItem);
      res.send(result);
    });

    app.get("/forumsAnswer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { ansID: id };
      const cursor = forumsAnswerCollection.find(query);
      const forumsAnswer = await cursor.toArray();
      res.send(forumsAnswer);
    });

    

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/email", async(req,res) => {
    res.send({status: true})
})


app.get('/', (req, res) => {
    res.send('Server Online');
})


app.listen(port, () => {
  console.log("Server on port", port);
});
