const line = require('@line/bot-sdk');
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 5000;
const myLiffId = process.env.MY_LIFF_ID;

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

// event handler
function handleEvent(event) {
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
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: "Appropriate Message for NASA FIRMS will be sent"
    });
  } else if (event.message.text.match("CUsense")) {

    const fetchCall = await fetch('https://www.cusense.net:8082/api/v1/sensorData/realtime/all', {
        method: 'POST',
        headers: {
          'X-Gravitee-Api-Key': '3d9c7df5-1262-45ad-a311-ff5ae72b4cb8',
          'Content-Type': 'application/json'
        },
        body: '{\"topic\":\"cusensor2/60019440B80B\"}'
      })
      .then(response => {
        let json = response.json();
        return json;
      })
      .then(responseData => {
        const stationData = responseData["cusensor2/60019440B80B"].data;
        stationData.name = responseData["cusensor2/60019440B80B"].info["name"];
        stationData.province = responseData["cusensor2/60019440B80B"].info["province"];

        const date = new Date(stationData[0].time.substr(0, 18));
        const messageResponse = "On " + date.toDateString() + ", \n" + "The temperature is " + stationData[0].temp + " ℃, \n" + "PM1 concentration is " + stationData[0]["pm1"] + ", \n" + "PM25 concentration is " + stationData[0]["pm25"] + ", \n" + "PM10 concentration is " + stationData[0]["pm10"] + ", \n" + "CO2 concentration is " + stationData[0]["co2"] + ", \n" + "The humidity is " + stationData[0].humid;

        return messageResponse;
      })
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: fetchCall
    });
  } else if (event.message.text.match("Windy")) {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: "Appropriate Message for Windy will be sent"
    });
  } else if (event.message.text.match("About Bushfire")) {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: "Appropriate Message for About Bushfire will be sent"
    });
  }
  // use reply API
  return client.replyMessage(event.replyToken,
    echo);
}

app.listen(port, () => console.log(`app listening on port ${port}!`));