const express = require('express'); 
const cors = require('cors'); 
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express(); 
const port = process.env.PORT || 5000;  



app.use(cors()); 
app.use(express.json());   



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5uoh0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
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
    await client.connect();

    // collection 
    const movieCollection = client.db('movieDB').collection('movie');

    // collection user
    const userCollection = client.db('movieDB').collection('users');

   // New collection for favorites
    const favoritesCollection = client.db('movieDB').collection('favorites');

 
    // favorite movie related
    // app.post('/movies/:id', async (req, res) => {
    //     const { title, description } = req.body;
    //     const newFavorite = new Favorite({ title, description });  
    //     await newFavorite.save(); 
    //     res.json(newFavorite);  
    //   });

    















    // read
    app.get('/movies', async(req, res) =>{
        const cursor = movieCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });


    // create - post
    app.post('/movies', async(req, res) => {
        const newMovie = req.body;
        console.log(newMovie);
        const result = await movieCollection.insertOne(newMovie);
        res.send(result);
    });

    // get api for movie details in client side
    app.get('/movies/:id', async(req , res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result =  await movieCollection.findOne(query);
        res.send(result);
    });

    // delete operation
    app.delete('/movies/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await movieCollection.deleteOne(query);
        res.send(result);
    })











    // get users
    app.get('/users', async(req, res) =>{
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    // users related api
    app.post('/users', async(req, res) =>{
        const newUser = req.body;
        console.log('creating new user', newUser);
        const result = await userCollection.insertOne(newUser);
        res.send(result);
    });

    app.patch('/users', async(req, res) =>{
        const email = req.body.email;
        const filter = { email }
        const updatedDoc = {
            $set : {
                lastSignInTime : req.body?.lastSignInTime
            }
        };
        const result = await userCollection.updateOne(filter, updatedDoc);
        res.send(result);
    })

    // delete user
    app.delete('/users/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        res.send(result);
    });

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
    res.send('Cineverse flix movie server is running'); });  

app.listen(port, () =>{
    console.log(`Cine verse flix is running on port ${port}`)
});