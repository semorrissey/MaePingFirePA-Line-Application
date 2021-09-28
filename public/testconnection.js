const mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "saidas#1120",
    database : "MaePingNoFire",
    multipleStatements : true
});

mysqlConnection.connect((err) => {
    if(err) throw err;
    console.log("Connected");
});

module.exports = mysqlConnection;
