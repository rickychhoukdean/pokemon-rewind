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

  //Middleware to check if card collection has something inside it
  function checkDB(exists) {
    let response = "";
    let checker = "";

    exists
      ? (response = "There is no backup")
      : (response = "Backup already exists");
    return function (req, res, next) {
      pokemonCardsCollection
        .find()
        .toArray()
        .then((cards) => {
          if ((exists && cards.length > 0) || (!exists && cards.length == 0)) {
            next();
          } else res.status(400).send({ error: response });
        });
    };
  }

  //Upload backup to collection if collection is empty
  app.post("/api/cards", checkDB(false), (req, res) => {
    const cardsArray = req.body.cards;

    pokemonCardsCollection
      .insertMany(cardsArray)
      .then((status) => {
        res.status(200).send({ status });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ error: "An error occured posting the status" });
      });
  });
  //Deletes collection if it exists
  app.delete("/api/cards", checkDB(true), (req, res) => {
    pokemonCardsCollection
      .remove({})
      .then((response) => {
        res.status(200).send({ status: "Success, collection purged" });
      })
      .catch((err) => {
        res
          .status(400)
          .send({ error: "There was an error in purging the collection" });
      });
  });

  //Searches database if it exists
  app.get("/api/cards/", checkDB(true), (req, res) => {
    const queries = req.query;
    const name = queries.name;
    const rarity = queries.rarity;
    const hitpoint = queries.hitpoint;
    const nameRegex = new RegExp(".*" + name + ".*", "i");
    let queryObj = {};

    rarity ? (queryObj.rarity = rarity) : null;
    hitpoint ? (queryObj.hp = hitpoint) : null;
    name ? (queryObj.name = nameRegex) : null;

    pokemonCardsCollection
      .find(queryObj)
      .toArray()
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send({ error: "Error querying the database" });
      });
  });

  const port = process.env.PORT || 5000;
  app.listen(port);

  console.log("App is listening on port " + port);
});
