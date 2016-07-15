var express = require('express');
var mysql = require('mysql');
var handler = require('./lib/request-handler')
var app = express();
var bodyParser = require('body-parser');
var sessions = require("client-sessions");


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345"
});

app.use(sessions({
  cookieName: 'mySession', // cookie name dictates the key name added to the request object
  secret: 'blargadeeblargblarg', // should be a large unguessable string
  resave: true,
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  saveInitialized: true
}));

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

app.post('/signup', handler.signupUser);
app.post('/login', handler.signinUser);

app.get('/login',function(req,res){

console.log('loeijwfloejfelifjdp')

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});