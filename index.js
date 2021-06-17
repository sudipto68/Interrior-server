const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const ObjectID = require("mongodb").ObjectID;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zfos2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const reviewCollection = client.db("interrior").collection("reviews");
  const bookingCollection = client.db("interrior").collection("booking");

  app.get("/review", (req, res) => {
    reviewCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/booking", (req, res) => {
    bookingCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

   app.get("/bookList/:email", (req, res) => {
    const email = req.params.email;
    bookingCollection.find({ email: email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addReview", (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review).then((result) => {
      res.send(result.insertedCount);
      console.log(result);
    });
  });
  app.post("/addBooking", (req, res) => {
    const review = req.body;
    bookingCollection.insertOne(review).then((result) => {
      res.send(result.insertedCount);
      console.log(result);
    });
  });
});

app.listen(process.env.PORT || port);
