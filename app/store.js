var db = require('./dbConnection');

//create store model
var Store = db.Model.extend({
  tableName: 'Stores'
});

//create store collection
var Stores = new db.Collection();
Stores.model = Store;

module.exports = Store;
module.exports = Stores;