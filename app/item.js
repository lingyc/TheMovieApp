var db = require('./dbConnection')

//create item model
var Item = db.Model.extend({
  tableName: 'Items'
});

//create item collection
var Items = new db.Collection();
Items.model = Item;

module.exports = Item;
module.exports = Items;