var express = require('express');
var mysql = require('mysql');
var handler = require('./lib/request-handler')
var app = express();
var bodyParser = require('body-parser');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345"
});



con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/compiled', express.static(__dirname + '/compiled'));

app.post('/', handler.loginUser)




app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});