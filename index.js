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