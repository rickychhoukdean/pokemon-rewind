const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();
let db;
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.json());

const uri =
  "mongodb+srv://test:test123@cluster0.prm7w.mongodb.net/pokemon?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect((err) => {
  const pokemonCardsCollection = client.db("pokemon").collection("cards");

  app.get("/api/cards", (req, res) => {
    pokemonCardsCollection
      .find()
      .toArray()
      .then((cards) => {
        res.send({ cards });
      });
  });

  app.post("/api/cards", (req, res) => {
    const cardsArray = req.body.cards;

    pokemonCardsCollection
      .insertMany(cardsArray)
      .then((status) => {
        res.status(200).send({ status });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ status });
      });
  });

  app.delete("/api/cards", (req, res) => {
    pokemonCardsCollection
      .remove({})
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const port = process.env.PORT || 5000;
  app.listen(port);

  console.log("App is listening on port " + port);
});
