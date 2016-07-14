var express = require('express');
var mysql = require('mysql');
var handler = require('./lib/request-handler')
var app = express();


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

app.post('/', handler.loginUser)

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});