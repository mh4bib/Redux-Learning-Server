const express = require('express');
const cors = require('cors')
const app = express();
// const jwt = require('jsonwebtoken')
require('dotenv').config();

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;

//middleware
app.use(
    cors({
      origin: true,
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jyjlkyq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        console.log('server online')
        const documentationsCollection = client.db('redux-learning').collection('documentations'); 
        const usersCollection = client.db('redux-learning').collection('users'); 

        //--------post a documentation
        app.post('/doc', async (req, res) => {
            const newItem = req.body;
            console.log('new item added', newItem);
            const result= await documentationsCollection.insertOne(newItem);
            // res.send({result : 'success'})
            res.send(result)
        });

        //-----get all doc
        app.get('/doc', async (req, res) => {
            const query ={};
            const cursor = documentationsCollection.find(query)
            const documentations = await cursor.toArray();
            res.send(documentations);
        })

        //--- get individual doc
        app.get('/doc/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await documentationsCollection.findOne(query);
            res.send(result)
        })

        //-----modify individual doc
        app.put('/doc/:id', async (req, res) => {
            const id = req.params.id;
            const updateTopic = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc ={
                $set: {
                    quantity:updateTopic.quantity
                }
            };
            const result = await documentationsCollection.updateOne(filter, updateDoc, options);
            res.send(result)
            console.log(result)
        })

        //----------delete a doc
        app.delete('/doc/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await documentationsCollection.deleteOne(query);
            res.send(result);
            console.log(id, result)
        })

// Users 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const users = await usersCollection.find().toArray();
            res.send(users);
            console.log(users);
        });

        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await usersCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send(isAdmin);
        })






    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Server Online');
})

app.listen(port, () => {
    console.log('Server on port', port)
})