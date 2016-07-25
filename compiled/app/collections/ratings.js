'use strict';

var db = require('../dbConnection');
var Rating = require('../models/rating');

//create rating collection
var Ratings = new db.Collection();
Ratings.model = Rating;

module.exports = Ratings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9jb2xsZWN0aW9ucy9yYXRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxLQUFLLFFBQVEsaUJBQVIsQ0FBVDtBQUNBLElBQUksU0FBUyxRQUFRLGtCQUFSLENBQWI7O0FBRUE7QUFDQSxJQUFJLFVBQVUsSUFBSSxHQUFHLFVBQVAsRUFBZDtBQUNBLFFBQVEsS0FBUixHQUFnQixNQUFoQjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsT0FBakIiLCJmaWxlIjoicmF0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBkYiA9IHJlcXVpcmUoJy4uL2RiQ29ubmVjdGlvbicpO1xudmFyIFJhdGluZyA9IHJlcXVpcmUoJy4uL21vZGVscy9yYXRpbmcnKTtcblxuLy9jcmVhdGUgcmF0aW5nIGNvbGxlY3Rpb25cbnZhciBSYXRpbmdzID0gbmV3IGRiLkNvbGxlY3Rpb24oKTtcblJhdGluZ3MubW9kZWwgPSBSYXRpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gUmF0aW5nczsiXX0=