var db = require('../dbConnection')
var User = require('../models/user');

//create movies collection
var Users = new db.Collection();
Users.model = User;

module.exports = Users;