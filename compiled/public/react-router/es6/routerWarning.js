'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = routerWarning;
exports._resetWarned = _resetWarned;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var warned = {};

function routerWarning(falseToWarn, message) {
  // Only issue deprecation warnings once.
  if (message.indexOf('deprecated') !== -1) {
    if (warned[message]) {
      return;
    }

    warned[message] = true;
  }

  message = '[react-router] ' + message;

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  _warning2.default.apply(undefined, [falseToWarn, message].concat(args));
}

function _resetWarned() {
  warned = {};
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L3JvdXRlcldhcm5pbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBSXdCLGE7UUFtQlIsWSxHQUFBLFk7O0FBdkJoQjs7Ozs7O0FBRUEsSUFBSSxTQUFTLEVBQWI7O0FBRWUsU0FBUyxhQUFULENBQXVCLFdBQXZCLEVBQW9DLE9BQXBDLEVBQTZDO0FBQzFEO0FBQ0EsTUFBSSxRQUFRLE9BQVIsQ0FBZ0IsWUFBaEIsTUFBa0MsQ0FBQyxDQUF2QyxFQUEwQztBQUN4QyxRQUFJLE9BQU8sT0FBUCxDQUFKLEVBQXFCO0FBQ25CO0FBQ0Q7O0FBRUQsV0FBTyxPQUFQLElBQWtCLElBQWxCO0FBQ0Q7O0FBRUQsWUFBVSxvQkFBb0IsT0FBOUI7O0FBRUEsT0FBSyxJQUFJLE9BQU8sVUFBVSxNQUFyQixFQUE2QixPQUFPLE1BQU0sT0FBTyxDQUFQLEdBQVcsT0FBTyxDQUFsQixHQUFzQixDQUE1QixDQUFwQyxFQUFvRSxPQUFPLENBQWhGLEVBQW1GLE9BQU8sSUFBMUYsRUFBZ0csTUFBaEcsRUFBd0c7QUFDdEcsU0FBSyxPQUFPLENBQVosSUFBaUIsVUFBVSxJQUFWLENBQWpCO0FBQ0Q7O0FBRUQsb0JBQVEsS0FBUixDQUFjLFNBQWQsRUFBeUIsQ0FBQyxXQUFELEVBQWMsT0FBZCxFQUF1QixNQUF2QixDQUE4QixJQUE5QixDQUF6QjtBQUNEOztBQUVNLFNBQVMsWUFBVCxHQUF3QjtBQUM3QixXQUFTLEVBQVQ7QUFDRCIsImZpbGUiOiJyb3V0ZXJXYXJuaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHdhcm5pbmcgZnJvbSAnd2FybmluZyc7XG5cbnZhciB3YXJuZWQgPSB7fTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm91dGVyV2FybmluZyhmYWxzZVRvV2FybiwgbWVzc2FnZSkge1xuICAvLyBPbmx5IGlzc3VlIGRlcHJlY2F0aW9uIHdhcm5pbmdzIG9uY2UuXG4gIGlmIChtZXNzYWdlLmluZGV4T2YoJ2RlcHJlY2F0ZWQnKSAhPT0gLTEpIHtcbiAgICBpZiAod2FybmVkW21lc3NhZ2VdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgd2FybmVkW21lc3NhZ2VdID0gdHJ1ZTtcbiAgfVxuXG4gIG1lc3NhZ2UgPSAnW3JlYWN0LXJvdXRlcl0gJyArIG1lc3NhZ2U7XG5cbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMiA/IF9sZW4gLSAyIDogMCksIF9rZXkgPSAyOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB3YXJuaW5nLmFwcGx5KHVuZGVmaW5lZCwgW2ZhbHNlVG9XYXJuLCBtZXNzYWdlXS5jb25jYXQoYXJncykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX3Jlc2V0V2FybmVkKCkge1xuICB3YXJuZWQgPSB7fTtcbn0iXX0=