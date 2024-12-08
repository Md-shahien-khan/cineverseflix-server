require('dotenv').config();
const express = require('express'); 
const cors = require('cors'); 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express(); 
const port = process.env.PORT || 5000;  

app.use(cors()); 
app.use(express.json());   

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5uoh0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const movieCollection = client.db('movieDB').collection('movie');
    const userCollection = client.db('movieDB').collection('users');
    const favoritesCollection = client.db('movieDB').collection('favorites');



    // FAvorite Movie Database
    // Insert favorite movies
    app.post('/favMovies', async (req, res) => {
      const newFavMovie = req.body;
      console.log("Received movies:", newFavMovie); // Log the movie data
      const result = await favoritesCollection.insertOne(newFavMovie);
      console.log("Inserted movie result:", result); // Log the result of insertion
      res.send(result);
    });
    
    // Get favorite movies
    app.get('/favMovies', async (req, res) => {
      const cursor = favoritesCollection.find();
      const result = await cursor.toArray();
      console.log("Favorites:", result);  // Log the full favorite movies data
      res.send(result);  // Return the full movie objects
    });

    app.delete('/favMovies/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await favoritesCollection.deleteOne(query);
        res.send(result);
        // console.log(id);
    });






    // Movies database
    // Get all movies
    app.get('/movies', async (req, res) => {
      const cursor = movieCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Insert new movie
    app.post('/movies', async (req, res) => {
      const newMovie = req.body;
      console.log("Inserting movie:", newMovie);  // Log the movie data
      const result = await movieCollection.insertOne(newMovie);
      res.send(result);
    });

    // Get movie details by id
    app.get('/movies/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.findOne(query);
      res.send(result);
    });

    // movie update
    app.put('/movies/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const options = { upsert : true };
      const updatedMovieDetails = req.body;
      const updatedMovie = {
        $set : {
          imageUrl : updatedMovieDetails.imageUrl,
          title : updatedMovieDetails.title, 
          genres : updatedMovieDetails.genres, 
          director : updatedMovieDetails.director, 
          duration : updatedMovieDetails.duration, 
          releaseDate : updatedMovieDetails.releaseDate, 
          earned : updatedMovieDetails.earned, 
          rating : updatedMovieDetails.rating, 
          summary : updatedMovieDetails.summary, 
          movieWebsite : updatedMovieDetails.movieWebsite
        }
      }
      const result = await movieCollection.updateOne(filter, updatedMovie, options);
      res.send(result);
     })

    // Delete movie by id
    app.delete('/movies/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.deleteOne(query);
      res.send(result);
    });






    // Users Database
    // Users CRUD operations
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.patch('/users', async (req, res) => {
      const email = req.body.email;
      const filter = { email };
      const updatedDoc = { $set: { lastSignInTime: req.body?.lastSignInTime } };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {     
    res.send('Cineverse flix movie server is running'); 
});

app.listen(port, () => {
    console.log(`Cineverse flix is running on port ${port}`)
});
