const express = require("express");
const Router = express.Router();
const https = require('https');
const csv = require('csvtojson');
const mysqlConnection = require('../testconnection')

var url = "https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_SouthEast_Asia_24h.csv"


function getData(url, res) {
  https.get(url, (resp) => {
    let data = '';
 
    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });
 
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        pcsv(data, res);
    });
 
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}


//latitude,longitude,brightness,scan,track,acq_date,acq_time,satellite,confidence,version,bright_t31,frp,daynight
function pcsv(csvStr, res) {
    csv({
       noheader:false,
   })
   .fromString(csvStr)
   .then((csvRow)=>{
        insertIntoDB(csvRow);
        res.send("Everything Was Inputted")
   })
}

function insertIntoDB(csvRow) {
    // insert statment
    
    // execute the insert statment
    
    for(var i = 0; i < csvRow.length; i++) {
        let sql = "INSERT INTO NASA_Firm_Data (latitude, longitude, brightness, scan, track, acq_date, acq_time, satellite, confidence, version, bright_t31, frp, daynight) VALUES(";

        for(var key in csvRow[i]) {
            sql = sql + `'${csvRow[i][key]}', `;
        }

        let finalSql = sql.substring(0, sql.length - 2);
        finalSql = finalSql + ')';


        mysqlConnection.query(finalSql, function(err,result) {
            if(err) {
                console.log(err)
            }
            else {
                console.log(finalSql);
            }
        })
    }
    
}

Router.get("/", (req, res) => {  
    getData(url,res);
})

module.exports = Router;