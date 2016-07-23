'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _RouteUtils = require('./RouteUtils');

var _PatternUtils = require('./PatternUtils');

var _InternalPropTypes = require('./InternalPropTypes');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var _React$PropTypes = _react2.default.PropTypes;
var string = _React$PropTypes.string;
var object = _React$PropTypes.object;

/**
 * A <Redirect> is used to declare another URL path a client should
 * be sent to when they request a given URL.
 *
 * Redirects are placed alongside routes in the route configuration
 * and are traversed in the same manner.
 */

var Redirect = _react2.default.createClass({
  displayName: 'Redirect',

  statics: {
    createRouteFromReactElement: function createRouteFromReactElement(element) {
      var route = (0, _RouteUtils.createRouteFromReactElement)(element);

      if (route.from) route.path = route.from;

      route.onEnter = function (nextState, replace) {
        var location = nextState.location;
        var params = nextState.params;

        var pathname = void 0;
        if (route.to.charAt(0) === '/') {
          pathname = (0, _PatternUtils.formatPattern)(route.to, params);
        } else if (!route.to) {
          pathname = location.pathname;
        } else {
          var routeIndex = nextState.routes.indexOf(route);
          var parentPattern = Redirect.getRoutePattern(nextState.routes, routeIndex - 1);
          var pattern = parentPattern.replace(/\/*$/, '/') + route.to;
          pathname = (0, _PatternUtils.formatPattern)(pattern, params);
        }

        replace({
          pathname: pathname,
          query: route.query || location.query,
          state: route.state || location.state
        });
      };

      return route;
    },
    getRoutePattern: function getRoutePattern(routes, routeIndex) {
      var parentPattern = '';

      for (var i = routeIndex; i >= 0; i--) {
        var route = routes[i];
        var pattern = route.path || '';

        parentPattern = pattern.replace(/\/*$/, '/') + parentPattern;

        if (pattern.indexOf('/') === 0) break;
      }

      return '/' + parentPattern;
    }
  },

  propTypes: {
    path: string,
    from: string, // Alias for path
    to: string.isRequired,
    query: object,
    state: object,
    onEnter: _InternalPropTypes.falsy,
    children: _InternalPropTypes.falsy
  },

  /* istanbul ignore next: sanity check */
  render: function render() {
    !false ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<Redirect> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
  }
});

exports.default = Redirect;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvbGliL1JlZGlyZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLFFBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxJQUFJLFNBQVMsUUFBUSxPQUFSLENBQWI7O0FBRUEsSUFBSSxVQUFVLHVCQUF1QixNQUF2QixDQUFkOztBQUVBLElBQUksYUFBYSxRQUFRLFdBQVIsQ0FBakI7O0FBRUEsSUFBSSxjQUFjLHVCQUF1QixVQUF2QixDQUFsQjs7QUFFQSxJQUFJLGNBQWMsUUFBUSxjQUFSLENBQWxCOztBQUVBLElBQUksZ0JBQWdCLFFBQVEsZ0JBQVIsQ0FBcEI7O0FBRUEsSUFBSSxxQkFBcUIsUUFBUSxxQkFBUixDQUF6Qjs7QUFFQSxTQUFTLHNCQUFULENBQWdDLEdBQWhDLEVBQXFDO0FBQUUsU0FBTyxPQUFPLElBQUksVUFBWCxHQUF3QixHQUF4QixHQUE4QixFQUFFLFNBQVMsR0FBWCxFQUFyQztBQUF3RDs7QUFFL0YsSUFBSSxtQkFBbUIsUUFBUSxPQUFSLENBQWdCLFNBQXZDO0FBQ0EsSUFBSSxTQUFTLGlCQUFpQixNQUE5QjtBQUNBLElBQUksU0FBUyxpQkFBaUIsTUFBOUI7O0FBRUE7Ozs7Ozs7O0FBUUEsSUFBSSxXQUFXLFFBQVEsT0FBUixDQUFnQixXQUFoQixDQUE0QjtBQUN6QyxlQUFhLFVBRDRCOztBQUl6QyxXQUFTO0FBQ1AsaUNBQTZCLFNBQVMsMkJBQVQsQ0FBcUMsT0FBckMsRUFBOEM7QUFDekUsVUFBSSxRQUFRLENBQUMsR0FBRyxZQUFZLDJCQUFoQixFQUE2QyxPQUE3QyxDQUFaOztBQUVBLFVBQUksTUFBTSxJQUFWLEVBQWdCLE1BQU0sSUFBTixHQUFhLE1BQU0sSUFBbkI7O0FBRWhCLFlBQU0sT0FBTixHQUFnQixVQUFVLFNBQVYsRUFBcUIsT0FBckIsRUFBOEI7QUFDNUMsWUFBSSxXQUFXLFVBQVUsUUFBekI7QUFDQSxZQUFJLFNBQVMsVUFBVSxNQUF2Qjs7QUFHQSxZQUFJLFdBQVcsS0FBSyxDQUFwQjtBQUNBLFlBQUksTUFBTSxFQUFOLENBQVMsTUFBVCxDQUFnQixDQUFoQixNQUF1QixHQUEzQixFQUFnQztBQUM5QixxQkFBVyxDQUFDLEdBQUcsY0FBYyxhQUFsQixFQUFpQyxNQUFNLEVBQXZDLEVBQTJDLE1BQTNDLENBQVg7QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDLE1BQU0sRUFBWCxFQUFlO0FBQ3BCLHFCQUFXLFNBQVMsUUFBcEI7QUFDRCxTQUZNLE1BRUE7QUFDTCxjQUFJLGFBQWEsVUFBVSxNQUFWLENBQWlCLE9BQWpCLENBQXlCLEtBQXpCLENBQWpCO0FBQ0EsY0FBSSxnQkFBZ0IsU0FBUyxlQUFULENBQXlCLFVBQVUsTUFBbkMsRUFBMkMsYUFBYSxDQUF4RCxDQUFwQjtBQUNBLGNBQUksVUFBVSxjQUFjLE9BQWQsQ0FBc0IsTUFBdEIsRUFBOEIsR0FBOUIsSUFBcUMsTUFBTSxFQUF6RDtBQUNBLHFCQUFXLENBQUMsR0FBRyxjQUFjLGFBQWxCLEVBQWlDLE9BQWpDLEVBQTBDLE1BQTFDLENBQVg7QUFDRDs7QUFFRCxnQkFBUTtBQUNOLG9CQUFVLFFBREo7QUFFTixpQkFBTyxNQUFNLEtBQU4sSUFBZSxTQUFTLEtBRnpCO0FBR04saUJBQU8sTUFBTSxLQUFOLElBQWUsU0FBUztBQUh6QixTQUFSO0FBS0QsT0F0QkQ7O0FBd0JBLGFBQU8sS0FBUDtBQUNELEtBL0JNO0FBZ0NQLHFCQUFpQixTQUFTLGVBQVQsQ0FBeUIsTUFBekIsRUFBaUMsVUFBakMsRUFBNkM7QUFDNUQsVUFBSSxnQkFBZ0IsRUFBcEI7O0FBRUEsV0FBSyxJQUFJLElBQUksVUFBYixFQUF5QixLQUFLLENBQTlCLEVBQWlDLEdBQWpDLEVBQXNDO0FBQ3BDLFlBQUksUUFBUSxPQUFPLENBQVAsQ0FBWjtBQUNBLFlBQUksVUFBVSxNQUFNLElBQU4sSUFBYyxFQUE1Qjs7QUFFQSx3QkFBZ0IsUUFBUSxPQUFSLENBQWdCLE1BQWhCLEVBQXdCLEdBQXhCLElBQStCLGFBQS9DOztBQUVBLFlBQUksUUFBUSxPQUFSLENBQWdCLEdBQWhCLE1BQXlCLENBQTdCLEVBQWdDO0FBQ2pDOztBQUVELGFBQU8sTUFBTSxhQUFiO0FBQ0Q7QUE3Q00sR0FKZ0M7O0FBb0R6QyxhQUFXO0FBQ1QsVUFBTSxNQURHO0FBRVQsVUFBTSxNQUZHLEVBRUs7QUFDZCxRQUFJLE9BQU8sVUFIRjtBQUlULFdBQU8sTUFKRTtBQUtULFdBQU8sTUFMRTtBQU1ULGFBQVMsbUJBQW1CLEtBTm5CO0FBT1QsY0FBVSxtQkFBbUI7QUFQcEIsR0FwRDhCOztBQThEekM7QUFDQSxVQUFRLFNBQVMsTUFBVCxHQUFrQjtBQUN4QixLQUFDLEtBQUQsR0FBUyxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLENBQUMsR0FBRyxZQUFZLE9BQWhCLEVBQXlCLEtBQXpCLEVBQWdDLGtGQUFoQyxDQUF4QyxHQUE4SixDQUFDLEdBQUcsWUFBWSxPQUFoQixFQUF5QixLQUF6QixDQUF2SyxHQUF5TSxLQUFLLENBQTlNO0FBQ0Q7QUFqRXdDLENBQTVCLENBQWY7O0FBb0VBLFFBQVEsT0FBUixHQUFrQixRQUFsQjtBQUNBLE9BQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakIiLCJmaWxlIjoiUmVkaXJlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9pbnZhcmlhbnQgPSByZXF1aXJlKCdpbnZhcmlhbnQnKTtcblxudmFyIF9pbnZhcmlhbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW52YXJpYW50KTtcblxudmFyIF9Sb3V0ZVV0aWxzID0gcmVxdWlyZSgnLi9Sb3V0ZVV0aWxzJyk7XG5cbnZhciBfUGF0dGVyblV0aWxzID0gcmVxdWlyZSgnLi9QYXR0ZXJuVXRpbHMnKTtcblxudmFyIF9JbnRlcm5hbFByb3BUeXBlcyA9IHJlcXVpcmUoJy4vSW50ZXJuYWxQcm9wVHlwZXMnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIF9SZWFjdCRQcm9wVHlwZXMgPSBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzO1xudmFyIHN0cmluZyA9IF9SZWFjdCRQcm9wVHlwZXMuc3RyaW5nO1xudmFyIG9iamVjdCA9IF9SZWFjdCRQcm9wVHlwZXMub2JqZWN0O1xuXG4vKipcbiAqIEEgPFJlZGlyZWN0PiBpcyB1c2VkIHRvIGRlY2xhcmUgYW5vdGhlciBVUkwgcGF0aCBhIGNsaWVudCBzaG91bGRcbiAqIGJlIHNlbnQgdG8gd2hlbiB0aGV5IHJlcXVlc3QgYSBnaXZlbiBVUkwuXG4gKlxuICogUmVkaXJlY3RzIGFyZSBwbGFjZWQgYWxvbmdzaWRlIHJvdXRlcyBpbiB0aGUgcm91dGUgY29uZmlndXJhdGlvblxuICogYW5kIGFyZSB0cmF2ZXJzZWQgaW4gdGhlIHNhbWUgbWFubmVyLlxuICovXG5cbnZhciBSZWRpcmVjdCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnUmVkaXJlY3QnLFxuXG5cbiAgc3RhdGljczoge1xuICAgIGNyZWF0ZVJvdXRlRnJvbVJlYWN0RWxlbWVudDogZnVuY3Rpb24gY3JlYXRlUm91dGVGcm9tUmVhY3RFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgIHZhciByb3V0ZSA9ICgwLCBfUm91dGVVdGlscy5jcmVhdGVSb3V0ZUZyb21SZWFjdEVsZW1lbnQpKGVsZW1lbnQpO1xuXG4gICAgICBpZiAocm91dGUuZnJvbSkgcm91dGUucGF0aCA9IHJvdXRlLmZyb207XG5cbiAgICAgIHJvdXRlLm9uRW50ZXIgPSBmdW5jdGlvbiAobmV4dFN0YXRlLCByZXBsYWNlKSB7XG4gICAgICAgIHZhciBsb2NhdGlvbiA9IG5leHRTdGF0ZS5sb2NhdGlvbjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IG5leHRTdGF0ZS5wYXJhbXM7XG5cblxuICAgICAgICB2YXIgcGF0aG5hbWUgPSB2b2lkIDA7XG4gICAgICAgIGlmIChyb3V0ZS50by5jaGFyQXQoMCkgPT09ICcvJykge1xuICAgICAgICAgIHBhdGhuYW1lID0gKDAsIF9QYXR0ZXJuVXRpbHMuZm9ybWF0UGF0dGVybikocm91dGUudG8sIHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXJvdXRlLnRvKSB7XG4gICAgICAgICAgcGF0aG5hbWUgPSBsb2NhdGlvbi5wYXRobmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgcm91dGVJbmRleCA9IG5leHRTdGF0ZS5yb3V0ZXMuaW5kZXhPZihyb3V0ZSk7XG4gICAgICAgICAgdmFyIHBhcmVudFBhdHRlcm4gPSBSZWRpcmVjdC5nZXRSb3V0ZVBhdHRlcm4obmV4dFN0YXRlLnJvdXRlcywgcm91dGVJbmRleCAtIDEpO1xuICAgICAgICAgIHZhciBwYXR0ZXJuID0gcGFyZW50UGF0dGVybi5yZXBsYWNlKC9cXC8qJC8sICcvJykgKyByb3V0ZS50bztcbiAgICAgICAgICBwYXRobmFtZSA9ICgwLCBfUGF0dGVyblV0aWxzLmZvcm1hdFBhdHRlcm4pKHBhdHRlcm4sIHBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXBsYWNlKHtcbiAgICAgICAgICBwYXRobmFtZTogcGF0aG5hbWUsXG4gICAgICAgICAgcXVlcnk6IHJvdXRlLnF1ZXJ5IHx8IGxvY2F0aW9uLnF1ZXJ5LFxuICAgICAgICAgIHN0YXRlOiByb3V0ZS5zdGF0ZSB8fCBsb2NhdGlvbi5zdGF0ZVxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiByb3V0ZTtcbiAgICB9LFxuICAgIGdldFJvdXRlUGF0dGVybjogZnVuY3Rpb24gZ2V0Um91dGVQYXR0ZXJuKHJvdXRlcywgcm91dGVJbmRleCkge1xuICAgICAgdmFyIHBhcmVudFBhdHRlcm4gPSAnJztcblxuICAgICAgZm9yICh2YXIgaSA9IHJvdXRlSW5kZXg7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHZhciByb3V0ZSA9IHJvdXRlc1tpXTtcbiAgICAgICAgdmFyIHBhdHRlcm4gPSByb3V0ZS5wYXRoIHx8ICcnO1xuXG4gICAgICAgIHBhcmVudFBhdHRlcm4gPSBwYXR0ZXJuLnJlcGxhY2UoL1xcLyokLywgJy8nKSArIHBhcmVudFBhdHRlcm47XG5cbiAgICAgICAgaWYgKHBhdHRlcm4uaW5kZXhPZignLycpID09PSAwKSBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICcvJyArIHBhcmVudFBhdHRlcm47XG4gICAgfVxuICB9LFxuXG4gIHByb3BUeXBlczoge1xuICAgIHBhdGg6IHN0cmluZyxcbiAgICBmcm9tOiBzdHJpbmcsIC8vIEFsaWFzIGZvciBwYXRoXG4gICAgdG86IHN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHF1ZXJ5OiBvYmplY3QsXG4gICAgc3RhdGU6IG9iamVjdCxcbiAgICBvbkVudGVyOiBfSW50ZXJuYWxQcm9wVHlwZXMuZmFsc3ksXG4gICAgY2hpbGRyZW46IF9JbnRlcm5hbFByb3BUeXBlcy5mYWxzeVxuICB9LFxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBzYW5pdHkgY2hlY2sgKi9cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgIWZhbHNlID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfaW52YXJpYW50Mi5kZWZhdWx0KShmYWxzZSwgJzxSZWRpcmVjdD4gZWxlbWVudHMgYXJlIGZvciByb3V0ZXIgY29uZmlndXJhdGlvbiBvbmx5IGFuZCBzaG91bGQgbm90IGJlIHJlbmRlcmVkJykgOiAoMCwgX2ludmFyaWFudDIuZGVmYXVsdCkoZmFsc2UpIDogdm9pZCAwO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gUmVkaXJlY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiXX0=