'use strict';

var db = require('../dbConnection');

//create friendRequest model
var allRequest = db.Model.extend({
  tableName: 'allRequests',
  hasTimestamps: true
});

module.exports = allRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9tb2RlbHMvYWxsUmVxdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksS0FBSyxRQUFRLGlCQUFSLENBQVQ7O0FBRUE7QUFDQSxJQUFJLGFBQWEsR0FBRyxLQUFILENBQVMsTUFBVCxDQUFnQjtBQUMvQixhQUFXLGFBRG9CO0FBRS9CLGlCQUFlO0FBRmdCLENBQWhCLENBQWpCOztBQUtBLE9BQU8sT0FBUCxHQUFpQixVQUFqQiIsImZpbGUiOiJhbGxSZXF1ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGRiID0gcmVxdWlyZSgnLi4vZGJDb25uZWN0aW9uJyk7XG5cbi8vY3JlYXRlIGZyaWVuZFJlcXVlc3QgbW9kZWxcbnZhciBhbGxSZXF1ZXN0ID0gZGIuTW9kZWwuZXh0ZW5kKHtcbiAgdGFibGVOYW1lOiAnYWxsUmVxdWVzdHMnLFxuICBoYXNUaW1lc3RhbXBzOiB0cnVlXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBhbGxSZXF1ZXN0O1xuIl19