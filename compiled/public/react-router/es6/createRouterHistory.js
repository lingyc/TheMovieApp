'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (createHistory) {
  var history = void 0;
  if (canUseDOM) history = (0, _useRouterHistory2.default)(createHistory)();
  return history;
};

var _useRouterHistory = require('./useRouterHistory');

var _useRouterHistory2 = _interopRequireDefault(_useRouterHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L2NyZWF0ZVJvdXRlckhpc3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2tCQUllLFVBQVUsYUFBVixFQUF5QjtBQUN0QyxNQUFJLFVBQVUsS0FBSyxDQUFuQjtBQUNBLE1BQUksU0FBSixFQUFlLFVBQVUsZ0NBQWlCLGFBQWpCLEdBQVY7QUFDZixTQUFPLE9BQVA7QUFDRCxDOztBQVJEOzs7Ozs7QUFFQSxJQUFJLFlBQVksQ0FBQyxFQUFFLE9BQU8sTUFBUCxLQUFrQixXQUFsQixJQUFpQyxPQUFPLFFBQXhDLElBQW9ELE9BQU8sUUFBUCxDQUFnQixhQUF0RSxDQUFqQiIsImZpbGUiOiJjcmVhdGVSb3V0ZXJIaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVzZVJvdXRlckhpc3RvcnkgZnJvbSAnLi91c2VSb3V0ZXJIaXN0b3J5JztcblxudmFyIGNhblVzZURPTSA9ICEhKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5kb2N1bWVudCAmJiB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChjcmVhdGVIaXN0b3J5KSB7XG4gIHZhciBoaXN0b3J5ID0gdm9pZCAwO1xuICBpZiAoY2FuVXNlRE9NKSBoaXN0b3J5ID0gdXNlUm91dGVySGlzdG9yeShjcmVhdGVIaXN0b3J5KSgpO1xuICByZXR1cm4gaGlzdG9yeTtcbn0iXX0=