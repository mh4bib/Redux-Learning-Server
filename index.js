const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const jwt = require('jsonwebtoken')
require("dotenv").config();

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
    const skillsCollection = client.db("redux-learning").collection("skills");
    const educationCollection = client
      .db("redux-learning")
      .collection("education");
    const experienceCollection = client
      .db("redux-learning")
      .collection("experience");
    const forumsAnswerCollection = client
      .db("redux-learning")
      .collection("forumsAnswer");
    const userAnswerCollection = client
      .db("redux-learning")
      .collection("userAnswer");
    const progressCollection = client
      .db("redux-learning")
      .collection("userProgress");

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

    app.delete("/routes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await routesCollection.deleteOne(query);
      res.send(result);
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

    app.delete("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email: email });
      const isAdmin = user?.role === "admin";
      res.send(isAdmin);
    });

    app.put("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const requester = req.body.email;
      console.log(email, requester);
      const requesterAccount = await usersCollection.findOne({
        email: requester,
      });
      if (requesterAccount.role === "admin") {
        const filter = { email: email };
        const updateDoc = {
          $set: { role: "admin" },
        };
        const result = await usersCollection.updateOne(filter, updateDoc);

        res.send(result);
      }
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
      console.log(forumsAnswer);
      res.send(forumsAnswer);
    });

    // userAnswer
    app.post("/userAnswer", async (req, res) => {
      const newItem = req.body;
      const result = await userAnswerCollection.insertOne(newItem);
      console.log(result);
      // res.send({result : 'success'})
      res.send(result);
    });

    // app.put("/userAnswer/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const updateTopic = req.body;
    //   const filter = { email: email };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: {
    //       selectedAns: updateTopic.selectedAns,
    //       result: updateTopic.result,
    //       quizTitle: updateTopic.quizTitle,
    //       completed: updateTopic.completed,
    //       // quantity: updateTopic.quantity,
    //     },
    //   };
    //   const result = await userAnswerCollection.updateOne(
    //     filter,
    //     updateDoc,
    //     options
    //   );
    //   res.send(result);
    //   console.log(result);
    // });

    app.get("/userAnswer/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = userAnswerCollection.find(query);
      const forumsAnswer = await cursor.toArray();
      console.log(forumsAnswer);
      res.send(forumsAnswer);
    });

    // user skills update

    app.put("/skills/:email", async (req, res) => {
      const email = req.params.email;
      const userInfo = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: userInfo,
      };
      const result = await skillsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/skills/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await skillsCollection.findOne(filter);
      res.send(result);
    });

    // education update

    app.put("/education/:email", async (req, res) => {
      const email = req.params.email;
      const userInfo = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: userInfo,
      };
      const result = await educationCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/education/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await educationCollection.findOne(filter);
      res.send(result);
    });

    // experience update
    app.put("/experience/:email", async (req, res) => {
      const email = req.params.email;
      const userInfo = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: userInfo,
      };
      const result = await experienceCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/experience/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await experienceCollection.findOne(filter);
      res.send(result);
    });

    //ProgressBar
    app.put("/progress/:email", async (req, res) => {
      const email = req.params.email;
      const progress = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          progress: progress.progress,
          blog: progress.blog,
          position: progress.position,
        },
      };
      const result = await progressCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/progress/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await progressCollection.findOne(filter);
      res.send(result);
    });

    app.post("/progress", async (req, res) => {
      const newItem = req.body;
      const result = await progressCollection.insertOne(newItem);
      console.log(result);
      // res.send({result : 'success'})
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Online");
});

app.listen(port, () => {
  console.log("Server on port", port);
});
