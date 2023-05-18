const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;


//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d18ofon.mongodb.net/?retryWrites=true&w=majority`;


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    next();
  });

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    
      

    const usersCollection = client.db("toyCrateX").collection("users");
    const toysCollection = client.db("toyCrateX").collection("toys");

    //users
    app.post('/users', async(req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
        console.log(result);
    })

    
    app.get('/allUsers', async(req, res) => {
        const result = await usersCollection.find({}).toArray();
        res.send(result);
    })
    
    //toys
    app.post('/toys', async(req, res) => {
        const toy = req.body;
        const result = await toysCollection.insertOne(toy);
        console.log(result);
    })

    app.get('/allToys', async(req, res) => {
        const result = await toysCollection.find({}).toArray();
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('ToyCrateX is running');
})

app.listen(port, () => {
    console.log(`ToyCrateX is running on port ${port}`);
})