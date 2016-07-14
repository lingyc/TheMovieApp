var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : '123',
    database : 'MainDatabase',
    charset  : 'utf8'
  }
});

var db = require('bookshelf')(knex);

db.knex.schema.hasTable('Stores').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('Stores', function (store) {
      store.increments('id').primary();
      store.string('name', 255);
      store.string('location', 255);
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('Items').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('Items', function (item) {
      item.increments('id').primary();
      item.string('name', 255);
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('StoresItems').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('StoresItems', function (storeitem) {
      storeitem.increments('id').primary();
      storeitem.integer('storeid', 255);
      storeitem.integer('itemid', 255);
      storeitem.integer('price', 255);
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = db;



