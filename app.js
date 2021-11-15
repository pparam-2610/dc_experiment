const express = require("express");
const cors = require("cors");
const axios = require("axios");

const { networkInterfaces } = require("os");

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === "IPv4" && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}

// File execution exports
// const { generateFile } = require("./generateFile");
// const { addJobToQueue } = require("./jobQueue");

// DB Exports
// const connectDB = require("./connect");
require("dotenv").config();
// const Job = require("./models/Jobs");

const app = express();
// const connectDB = require("connect.js");
const bodyParser = require("body-parser");
const Turf = require("./models/Turf");
const mongoose = require("mongoose");

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// const PORT = 5000;

// Middleware
app.enable("trust proxy");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let timestamp = new Date().getTime();
let delta;
// setInterval(async () => {
//   let startTime = new Date().getTime();
//   let data;
//   try {
//     data = await axios.post("http://localhost:8001/getTimestamp", startTime);
//   } catch (e) {
//     console.log("The error is: ", e);
//   }
//   let RTT = new Date().getTime() - startTime;
//   timestamp = data.data.timestamp + RTT / 2;
//   console.log("The timestamp is: ", timestamp);
// }, 100);

app.get("/", (req, res) => {
  //   res.json({ data: "The app is running, lesssssgo!!!!!!!!!!!" });
  res.sendFile(__dirname + "/client.html");

  console.log("GET / request served");
});

app.get("/getTimestamp", (req, res) => {
  res.json({
    // data: "The app is running, lesssssgo!!!!!!!!!!!",
    timestamp: new Date().getTime(),
  });
  console.log("GET / request served");
});

app.get("/getBerleyTimestamp", (req, res) => {
  console.log("In server : ", 1634949412335);
  res.json({
    timestamp: timestamp,
    ip: results["eth0"][0],
  });
});

app.get("/sendTime", (req, res) => {
  res.json({
    timestamp: new Date().getTime(),
  });
});

app.post("/sendTime", (req, res) => {
  timestamp = req.body.timestamp;
  res.send("ok");
});

app.post("/registerTurf", async (req, res) => {
  //   timestamp = req.body.timestamp;
  //   res.send("ok");
  console.log("Body: ", req.body);

  let turf = await Turf.create({
    name: req.body.name,
    address: req.body.address,
    size: req.body.size,
  });
  console.log("turf: ", turf);
  res.json({
    data: turf,
    ip: results["eth0"][0],
  });
});

app.get("/getTurf", async (req, res) => {
  //   timestamp = req.body.timestamp;
  //   res.send("ok");
  console.log("Body: ", req.body);

  let turfs = await Turf.find();
  console.log("turf: ", turfs);
  res.json({
    data: turfs,
    ip: results["eth0"][0],
  });
});

app.listen(process.env.LISTEN_PORT, async () => {
  //   try {
  //     await connectDB(
  //       "mongodb+srv://bhushan:PakistanAllah786@cluster0.y86tf.mongodb.net/test"
  //     );

  //   } catch (e) {
  //     console.log("Cannot connect: ", e);
  //   }
  mongoose
    .connect(
      "mongodb+srv://bhushan:PakistanAllah786@cluster0.y86tf.mongodb.net/test"
    )
    .then(() => console.log("Connected to the db... "))
    .catch((err) => console.log(err));
  console.log("Starting at port:", process.env.LISTEN_PORT);
});
