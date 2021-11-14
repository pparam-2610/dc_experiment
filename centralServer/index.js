const express = require("express");
const cors = require("cors");
const axios = require("axios");

// File execution exports
// const { generateFile } = require("./generateFile");
// const { addJobToQueue } = require("./jobQueue");

// DB Exports
// const connectDB = require("./connect");
require("dotenv").config();
// const Job = require("./models/Jobs");

const app = express();
// const PORT = 5000;

// Middleware
app.enable("trust proxy");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/central", (req, res) => {
  //   res.json({ data: "The app is running, lesssssgo!!!!!!!!!!!" });
  res.sendFile(__dirname + "/client.html");

  console.log("GET / request served");
});

app.get("/central/getTimestamp", (req, res) => {
  res.json({
    data: "The app is running, lesssssgo!!!!!!!!!!!",
    timestamp: new Date().getTime(),
  });
  console.log("GET / request served");
});

app.get("/central/syncTime", async (req, res) => {
  try {
    let startTime1 = new Date().getTime();
    let data1 = await axios.get(
      "http://dockernginxloadbalancer_api_1:3003/sendTime"
    );
    let RTT1 = new Date().getTime() - startTime1;

    let startTime2 = new Date().getTime();
    let data2 = await axios.get(
      "http://dockernginxloadbalancer_api_2:3003/sendTime"
    );
    let RTT2 = new Date().getTime() - startTime2;

    let startTime3 = new Date().getTime();
    let data3 = await axios.get(
      "http://dockernginxloadbalancer_api_3:3003/sendTime"
    );
    let RTT3 = new Date().getTime() - startTime3;

    let timestamp1 = data1.data.timestamp;
    let timestamp2 = data2.data.timestamp;
    let timestamp3 = data3.data.timestamp;

    let averageTime =
      (timestamp1 + timestamp2 + timestamp3) / 3 + RTT1 + RTT2 + RTT3;
    await axios.post("http://dockernginxloadbalancer_api_1:3003/sendTime", {
      timestamp: averageTime,
    });
    await axios.post("http://dockernginxloadbalancer_api_2:3003/sendTime", {
      timestamp: averageTime,
    });
    await axios.post("http://dockernginxloadbalancer_api_3:3003/sendTime", {
      timestamp: averageTime,
    });
    console.log("The average is: ", averageTime);

    res.json({
      timestamp: averageTime,
    });
  } catch (e) {
    console.log("The error in syncing time is: ", e);
  }
});

app.listen(process.env.LISTEN_PORT, () => {
  console.log("Starting server at port:", process.env.LISTEN_PORT);
});
