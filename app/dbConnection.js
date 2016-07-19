var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : '12345',
    database : 'MainDatabase',
    charset  : 'utf8'
  }
});

var db = require('bookshelf')(knex);

db.knex.schema.hasTable('movies').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('movies', function (movie) {
      movie.increments('id').primary();
      movie.string('title', 255).unique();
      movie.string('genre', 255);
      movie.string('poster', 255);
      movie.string('release_date', 255);
      movie.interger('imdbRating');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('ratings').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('ratings', function (rating) {
      rating.increments('id').primary();
      rating.integer('score');
      rating.integer('movieid');
      rating.integer('userid');
      rating.string('review', 255);
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function(user) {
      user.increments('id').primary();
      user.string('username', 255).unique();
      user.string('password', 255);
      user.string('email', 255);
      user.string('firstName', 255);
      user.string('lastName', 255);
      user.string('profilePicture', 255);
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('relations').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('relations', function(relation) {
      relation.increments('id').primary();
      relation.integer('user1id');
      relation.integer('user2id');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('friendRequests').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('friendRequests', function(friendRequest) {
      friendRequest.increments('id').primary();
      friendRequest.integer('requestor');
      friendRequest.integer('requestee');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('watchRequests').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('watchRequests', function(watchRequest) {
      watchRequest.increments('id').primary();
      watchRequest.integer('requestor');
      watchRequest.integer('requestee');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});



module.exports = db;



