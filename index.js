const express = require("express")
const bodyParser = require("body-parser")
require("dotenv").config();
const placeRouter = require("./routes/places.router.js")
const cors = require('cors');

const app = express(); //initialize the express app
const PORT = process.env.APP_PORT;

app.use(bodyParser.json()); // telling middleware that we are going to be using json data in our whole application
app.use(cors());
app.use("/places", placeRouter)

app.listen()
