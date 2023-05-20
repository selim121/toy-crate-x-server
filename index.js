const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;


//middleware
app.use(cors());
app.use(express.json());
    



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d18ofon.mongodb.net/?retryWrites=true&w=majority`;


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

    //user-details
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
    
    //all-toys
    app.post('/toys', async(req, res) => {
        const toy = req.body;
        const result = await toysCollection.insertOne(toy);
        res.send(result);
    })

    app.get('/allToys', async(req, res) => {
        const result = await toysCollection.find({}).toArray();
        res.send(result);
    })

    //my-toys
    app.get('/my-toys/:email', async(req, res) => {
        const toys = await toysCollection.find({
            email: req.params.email,
        }).toArray();
        res.send(toys);
    })

    app.get('/details/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await toysCollection.findOne(query);
        res.send(result);
    })

    //sorting
    app.get('/my-toys/:email/ascending', async(req, res) => {
        const toys = await toysCollection.find({
            email: req.params.email,
        }).sort({ price: 1 }).toArray();
        res.send(toys);
    })
    app.get('/my-toys/:email/descending', async(req, res) => {
        const toys = await toysCollection.find({
            email: req.params.email,
        }).sort({ price: -1 }).toArray();
        res.send(toys);
    })

    //category
    app.get('/toy/:subCategory', async(req, res) => {
        const toy = await toysCollection.find({
            subCategory: req.params.subCategory,
        }).toArray();
        res.send(toy)
    })

    //delete toy
    app.delete('/toys/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await toysCollection.deleteOne(query);
        res.send(result);
    })

    //update toy
    app.get('/toy/update/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await toysCollection.findOne(query);
        res.send(result);
    })

    app.put('/toy/update/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updateToy = req.body;
        const toy = {
            $set: {
                name: updateToy.name,
                email: updateToy.email,
                productName: updateToy.productName,
                subCategory: updateToy.subCategory,
                price: updateToy.price,
                quantity: updateToy.quantity,
                rating: updateToy.rating,
                toyPhoto: updateToy.toyPhoto,
                details: updateToy.details,
            },
        };
        const result = await toysCollection.updateOne(filter, toy, options);
        res.send(result);
    })

    //search toy by name
    const indexKeys = {productName: 1};
    const indexOption = {name: 'productName'};
    const result = await toysCollection.createIndex(indexKeys, indexOption);

    app.get('/toySearchByName/:productName', async(req, res) => {
        const searchText = req.params.productName;
        const result = await toysCollection.find({
            $or: [
                {productName: {$regex: searchText, $options: 'i'}},
            ]
        }).toArray();
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