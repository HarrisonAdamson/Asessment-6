const express = require("express");
const {bots, playerRecord} = require("./Data");
const {shuffleArray} = require("./utils.js");
const path = require('path')
const app = express();

app.use(express.json());

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'eb2199ab63bd449484e570f032140407',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"))
})

app.get("/js", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.js"));
})

app.get("/styles", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.css"))
})

app.use(express.static(path.join(__dirname, "public")))

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(botsArr);
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffleArray(bots);
    res.status(200).send(shuffled);
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      res.status(200).send("You won!");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})