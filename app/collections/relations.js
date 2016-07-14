var db = require('../dbConnection');
var Relation = require('../models/relation');

//create user relationships collection
var Relations = new db.Collection();
Relations.model = Relation;

module.exports = Relations;