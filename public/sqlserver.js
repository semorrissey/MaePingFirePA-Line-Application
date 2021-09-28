const express = require('express');
const bodyParser = require('body-parser');
const mysqlConnection = require("./testconnection");
const Nasa_Firms = require("./routes/nasa_firms")

var app = express();
app.use(bodyParser.json());

app.use('/nasa_firms', Nasa_Firms)

app.listen(3000);