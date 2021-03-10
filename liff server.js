const line = require('@line/bot-sdk');
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 5000;
const myLiffId = process.env.MY_LIFF_ID;
//const wget = require('node-wget');
const https = require("https");
const fs = require("fs");
const request = require('request');
const bodyParser = require("body-parser");

require('dotenv').config();

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

app.use(express.static('public'));

app.get('/send-id', function(req, res) {
  res.json({
    id: myLiffId
  });
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/LIFF.html");
});

app.get("/Home", function(req, res) {
  res.sendFile(__dirname + "/public/LIFF.html");
});

app.get("/LINE", function(req, res) {
  res.sendFile(__dirname + "/public/line.html");
});

app.get("/Fire%20Timeline", function(req, res) {
  res.sendFile(__dirname + "/public/firetimeline.html")
});

app.get("/CuSense", function(req, res) {
  res.sendFile(__dirname + "/public/cusense.html")
});

app.get("/Windy", function(req, res) {
  res.sendFile(__dirname + "/public/windy.html")
});

app.get("/Nasa%20FIRMS", function(req, res) {
  res.sendFile(__dirname + "/public/nasafirms.html")
});

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});


//mongodb connection setup
const password = process.env.DB_PASSWORD;
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://tester:${NP5qWIzDkP6lK9Tv}@cluster0.em7pv.mongodb.net/SiteDatabase?retryWrites=true&w=majority`;
const dbClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let collection = null;
dbClient.connect(err => {
  collection = dbClient.db("SiteDatabase").collection("Accounts");
});

//parsing Nasa information

//reads file into array and converts to JSON
fs.readFile(__dirname + '/public/tmp/VIIRS_I_SouthEast_Asia_VNP14IMGTDL_NRT_2021068.txt', function(err, data) {
  if (err) throw err;
  var array = data.toString().split("\n");
  var jsonKeys = array[0].split(",");
  array.splice(0, 1);

  var jsonResult = new Array;

  for (i in array) {
    var temp = array[i].split(",");
    var json = {};
    for (j in temp) {
      json[jsonKeys[j]] = temp[j];
    }
    jsonResult.push(JSON.stringify(json));
  }
  var temp = [{
    "pepe": 1
  }, {
    "pepe": 2
  }];
  var temp2 = [temp];
  console.log(temp);
  console.log(temp2);
  var payload = [jsonResult];
  fetch("https://maepingfirepa.herokuapp.com/push", {
    method: "POST",
    body: temp2,
    headers: {
      "Content-Type": "application/json"
    }
  });
});
//requests from database
app.post("/push", function(req, res) {
  collection.insertMany(req.body).then(dbresponse => {
    res.json(dbresponse.ops[0]);
  });
});


// fetch from source apis

async function csvDownload() {
  const url = 'https://nrt3.modaps.eosdis.nasa.gov/api/v2/content/archives/FIRMS/README.pdf'; // link to file you want to download
  const path = "/public/tmp/" // where to save a file

  const downloadFile = (async (url, path) => {
    const res = await fetch(url, {
      headers: {
        'Authorization': 'Bearer bWFlcGluZ25vZmlyZTpiV0ZsY0dsdVoyNXZabWx5WlVCbmJXRnBiQzVqYjIwPToxNjE1MjUyMTUxOmEwZTc5OTg4YzI2Yjg5ZTMxZWViYzFlOGI5MzQ4MGFkMzVmNTQwNzQ'
      }
    });
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
  });
  console.log("i worked");
  return true;
}

async function windyFetch() {
  return await fetch('https://api.windy.com/api/point-forecast/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: 17.573,
        lon: 98.808,
        model: "gfs",
        parameters: ["temp", "precip", "wind", "windGust", "ptype", "rh", "pressure", "cosc"],
        levels: ["surface"],
        key: '8Cq5Sg5sJRRvjtj58rFQurjPUfFaVGCH'
      })
    })
    .then(response => {
      return response.json();
    })
    .then(responseData => {
      console.log(responseData);
      return responseData;
    })
}

async function cuSenseFetch(sensor) {
  return await fetch('https://www.cusense.net:8082/api/v1/sensorData/realtime/all', {
      method: 'POST',
      headers: {
        'X-Gravitee-Api-Key': '3d9c7df5-1262-45ad-a311-ff5ae72b4cb8',
        'Content-Type': 'application/json'
      },
      body: '{\"topic\":\"' + sensor + '\"}'
    })
    .then(response => {
      let json = response.json();
      return json;
    })
    .then(responseData => {
      const stationData = responseData[sensor].data;
      stationData.name = responseData[sensor].info["name"];
      stationData.province = responseData[sensor].info["province"];
      stationData.sensor = responseData[sensor].info["project"];

      const date = new Date(stationData[0].time.substr(0, 19));
      const messageResponse = "Data provided by " + stationData.sensor + " for " + stationData.name + " in " + stationData.province + "\n" + "On " + date.toDateString() +
        ", \n" + "The temperature is " + stationData[0].temp + " ℃, \n" + "PM1 concentration is " + stationData[0]["pm1"] + " µg/m3, \n" + "PM25 concentration is " + stationData[0]["pm25"] + " µg/m3, \n" + "PM10 concentration is " + stationData[0]["pm10"] + " µg/m3, \n" + "The humidity is " + stationData[0].humid + "%. \n" + "Data changes every hour!";

      return messageResponse;
    });
}

// event handler
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a text message
  const echo = {
    type: 'text',
    text: event.message.text
  };
  if (event.message.text.match("NASA FIRMS")) {
    let test = csvDownload();
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: "Currently, our Nasa FIRMS Fire Hotspot tool is underdevelopment. \n \n \n Please take a look at the following to see our webpage to view the tool: \n \n https://maepingfirepa.herokuapp.com/Fire%20Timeline"
    });
  } else if (event.message.text.match("CUsense")) {

    let sensorOne = await cuSenseFetch("cusensor3/8CAAB5852984");
    let sensorTwo = await cuSenseFetch("cusensor3/8CAAB5851AD4");
    return client.replyMessage(event.replyToken, [{
      type: 'text',
      text: sensorOne + "\n \n \n" + sensorTwo + "\n \n \n"
    }, {
      type: 'text',
      text: "For more info look at : https://cusense.net/map"
    }]);
  } else if (event.message.text.match("Windy")) {

    let windyData = await windyFetch();
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: "To view our Windy App, please take a look at the following link which includes the app itself: \n \n https://maepingfirepa.herokuapp.com/Windy "
    });
  } else if (event.message.text.match("About Bushfire")) {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: "Currently, our 'About Bushfire' section is underdevelopment. \n \n \n Please take a look at the following to see instructional videos about wildfires \n \n https://maepingfirepa.herokuapp.com/Windy"
    });
  }
  // use reply API
  return client.replyMessage(event.replyToken,
    echo);
}

app.listen(port, () => console.log(`app listening on port ${port}!`));