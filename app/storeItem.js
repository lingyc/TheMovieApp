var db = require('./dbConnection');

var StoresItem = db.Model.extend({
  tableName: 'StoresItems',
  store: function() {
    return this.belongsTo(Store,'storeid');
  },
  item: function() {
    return this.belongsTo(Item,'itemid');
  }
});

var StoresItems = new db.Collection();
StoresItems.model = StoresItem;

module.exports = StoresItem;
module.exports = StoresItems;