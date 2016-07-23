'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _RouteUtils = require('./RouteUtils');

var _PatternUtils = require('./PatternUtils');

var _InternalPropTypes = require('./InternalPropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L1JlZGlyZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLElBQUksbUJBQW1CLGdCQUFNLFNBQTdCO0FBQ0EsSUFBSSxTQUFTLGlCQUFpQixNQUE5QjtBQUNBLElBQUksU0FBUyxpQkFBaUIsTUFBOUI7O0FBRUE7Ozs7Ozs7O0FBUUEsSUFBSSxXQUFXLGdCQUFNLFdBQU4sQ0FBa0I7QUFDL0IsZUFBYSxVQURrQjs7QUFJL0IsV0FBUztBQUNQLGlDQUE2QixTQUFTLDJCQUFULENBQXFDLE9BQXJDLEVBQThDO0FBQ3pFLFVBQUksUUFBUSw2Q0FBNkIsT0FBN0IsQ0FBWjs7QUFFQSxVQUFJLE1BQU0sSUFBVixFQUFnQixNQUFNLElBQU4sR0FBYSxNQUFNLElBQW5COztBQUVoQixZQUFNLE9BQU4sR0FBZ0IsVUFBVSxTQUFWLEVBQXFCLE9BQXJCLEVBQThCO0FBQzVDLFlBQUksV0FBVyxVQUFVLFFBQXpCO0FBQ0EsWUFBSSxTQUFTLFVBQVUsTUFBdkI7O0FBR0EsWUFBSSxXQUFXLEtBQUssQ0FBcEI7QUFDQSxZQUFJLE1BQU0sRUFBTixDQUFTLE1BQVQsQ0FBZ0IsQ0FBaEIsTUFBdUIsR0FBM0IsRUFBZ0M7QUFDOUIscUJBQVcsaUNBQWMsTUFBTSxFQUFwQixFQUF3QixNQUF4QixDQUFYO0FBQ0QsU0FGRCxNQUVPLElBQUksQ0FBQyxNQUFNLEVBQVgsRUFBZTtBQUNwQixxQkFBVyxTQUFTLFFBQXBCO0FBQ0QsU0FGTSxNQUVBO0FBQ0wsY0FBSSxhQUFhLFVBQVUsTUFBVixDQUFpQixPQUFqQixDQUF5QixLQUF6QixDQUFqQjtBQUNBLGNBQUksZ0JBQWdCLFNBQVMsZUFBVCxDQUF5QixVQUFVLE1BQW5DLEVBQTJDLGFBQWEsQ0FBeEQsQ0FBcEI7QUFDQSxjQUFJLFVBQVUsY0FBYyxPQUFkLENBQXNCLE1BQXRCLEVBQThCLEdBQTlCLElBQXFDLE1BQU0sRUFBekQ7QUFDQSxxQkFBVyxpQ0FBYyxPQUFkLEVBQXVCLE1BQXZCLENBQVg7QUFDRDs7QUFFRCxnQkFBUTtBQUNOLG9CQUFVLFFBREo7QUFFTixpQkFBTyxNQUFNLEtBQU4sSUFBZSxTQUFTLEtBRnpCO0FBR04saUJBQU8sTUFBTSxLQUFOLElBQWUsU0FBUztBQUh6QixTQUFSO0FBS0QsT0F0QkQ7O0FBd0JBLGFBQU8sS0FBUDtBQUNELEtBL0JNO0FBZ0NQLHFCQUFpQixTQUFTLGVBQVQsQ0FBeUIsTUFBekIsRUFBaUMsVUFBakMsRUFBNkM7QUFDNUQsVUFBSSxnQkFBZ0IsRUFBcEI7O0FBRUEsV0FBSyxJQUFJLElBQUksVUFBYixFQUF5QixLQUFLLENBQTlCLEVBQWlDLEdBQWpDLEVBQXNDO0FBQ3BDLFlBQUksUUFBUSxPQUFPLENBQVAsQ0FBWjtBQUNBLFlBQUksVUFBVSxNQUFNLElBQU4sSUFBYyxFQUE1Qjs7QUFFQSx3QkFBZ0IsUUFBUSxPQUFSLENBQWdCLE1BQWhCLEVBQXdCLEdBQXhCLElBQStCLGFBQS9DOztBQUVBLFlBQUksUUFBUSxPQUFSLENBQWdCLEdBQWhCLE1BQXlCLENBQTdCLEVBQWdDO0FBQ2pDOztBQUVELGFBQU8sTUFBTSxhQUFiO0FBQ0Q7QUE3Q00sR0FKc0I7O0FBb0QvQixhQUFXO0FBQ1QsVUFBTSxNQURHO0FBRVQsVUFBTSxNQUZHLEVBRUs7QUFDZCxRQUFJLE9BQU8sVUFIRjtBQUlULFdBQU8sTUFKRTtBQUtULFdBQU8sTUFMRTtBQU1ULHFDQU5TO0FBT1Q7QUFQUyxHQXBEb0I7O0FBOEQvQjtBQUNBLFVBQVEsU0FBUyxNQUFULEdBQWtCO0FBQ3hCLEtBQUMsS0FBRCxHQUFTLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MseUJBQVUsS0FBVixFQUFpQixrRkFBakIsQ0FBeEMsR0FBK0kseUJBQVUsS0FBVixDQUF4SixHQUEySyxLQUFLLENBQWhMO0FBQ0Q7QUFqRThCLENBQWxCLENBQWY7O2tCQW9FZSxRIiwiZmlsZSI6IlJlZGlyZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcbmltcG9ydCB7IGNyZWF0ZVJvdXRlRnJvbVJlYWN0RWxlbWVudCBhcyBfY3JlYXRlUm91dGVGcm9tUmVhY3RFbGVtZW50IH0gZnJvbSAnLi9Sb3V0ZVV0aWxzJztcbmltcG9ydCB7IGZvcm1hdFBhdHRlcm4gfSBmcm9tICcuL1BhdHRlcm5VdGlscyc7XG5pbXBvcnQgeyBmYWxzeSB9IGZyb20gJy4vSW50ZXJuYWxQcm9wVHlwZXMnO1xuXG52YXIgX1JlYWN0JFByb3BUeXBlcyA9IFJlYWN0LlByb3BUeXBlcztcbnZhciBzdHJpbmcgPSBfUmVhY3QkUHJvcFR5cGVzLnN0cmluZztcbnZhciBvYmplY3QgPSBfUmVhY3QkUHJvcFR5cGVzLm9iamVjdDtcblxuLyoqXG4gKiBBIDxSZWRpcmVjdD4gaXMgdXNlZCB0byBkZWNsYXJlIGFub3RoZXIgVVJMIHBhdGggYSBjbGllbnQgc2hvdWxkXG4gKiBiZSBzZW50IHRvIHdoZW4gdGhleSByZXF1ZXN0IGEgZ2l2ZW4gVVJMLlxuICpcbiAqIFJlZGlyZWN0cyBhcmUgcGxhY2VkIGFsb25nc2lkZSByb3V0ZXMgaW4gdGhlIHJvdXRlIGNvbmZpZ3VyYXRpb25cbiAqIGFuZCBhcmUgdHJhdmVyc2VkIGluIHRoZSBzYW1lIG1hbm5lci5cbiAqL1xuXG52YXIgUmVkaXJlY3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnUmVkaXJlY3QnLFxuXG5cbiAgc3RhdGljczoge1xuICAgIGNyZWF0ZVJvdXRlRnJvbVJlYWN0RWxlbWVudDogZnVuY3Rpb24gY3JlYXRlUm91dGVGcm9tUmVhY3RFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgIHZhciByb3V0ZSA9IF9jcmVhdGVSb3V0ZUZyb21SZWFjdEVsZW1lbnQoZWxlbWVudCk7XG5cbiAgICAgIGlmIChyb3V0ZS5mcm9tKSByb3V0ZS5wYXRoID0gcm91dGUuZnJvbTtcblxuICAgICAgcm91dGUub25FbnRlciA9IGZ1bmN0aW9uIChuZXh0U3RhdGUsIHJlcGxhY2UpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gbmV4dFN0YXRlLmxvY2F0aW9uO1xuICAgICAgICB2YXIgcGFyYW1zID0gbmV4dFN0YXRlLnBhcmFtcztcblxuXG4gICAgICAgIHZhciBwYXRobmFtZSA9IHZvaWQgMDtcbiAgICAgICAgaWYgKHJvdXRlLnRvLmNoYXJBdCgwKSA9PT0gJy8nKSB7XG4gICAgICAgICAgcGF0aG5hbWUgPSBmb3JtYXRQYXR0ZXJuKHJvdXRlLnRvLCBwYXJhbXMpO1xuICAgICAgICB9IGVsc2UgaWYgKCFyb3V0ZS50bykge1xuICAgICAgICAgIHBhdGhuYW1lID0gbG9jYXRpb24ucGF0aG5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHJvdXRlSW5kZXggPSBuZXh0U3RhdGUucm91dGVzLmluZGV4T2Yocm91dGUpO1xuICAgICAgICAgIHZhciBwYXJlbnRQYXR0ZXJuID0gUmVkaXJlY3QuZ2V0Um91dGVQYXR0ZXJuKG5leHRTdGF0ZS5yb3V0ZXMsIHJvdXRlSW5kZXggLSAxKTtcbiAgICAgICAgICB2YXIgcGF0dGVybiA9IHBhcmVudFBhdHRlcm4ucmVwbGFjZSgvXFwvKiQvLCAnLycpICsgcm91dGUudG87XG4gICAgICAgICAgcGF0aG5hbWUgPSBmb3JtYXRQYXR0ZXJuKHBhdHRlcm4sIHBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXBsYWNlKHtcbiAgICAgICAgICBwYXRobmFtZTogcGF0aG5hbWUsXG4gICAgICAgICAgcXVlcnk6IHJvdXRlLnF1ZXJ5IHx8IGxvY2F0aW9uLnF1ZXJ5LFxuICAgICAgICAgIHN0YXRlOiByb3V0ZS5zdGF0ZSB8fCBsb2NhdGlvbi5zdGF0ZVxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiByb3V0ZTtcbiAgICB9LFxuICAgIGdldFJvdXRlUGF0dGVybjogZnVuY3Rpb24gZ2V0Um91dGVQYXR0ZXJuKHJvdXRlcywgcm91dGVJbmRleCkge1xuICAgICAgdmFyIHBhcmVudFBhdHRlcm4gPSAnJztcblxuICAgICAgZm9yICh2YXIgaSA9IHJvdXRlSW5kZXg7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHZhciByb3V0ZSA9IHJvdXRlc1tpXTtcbiAgICAgICAgdmFyIHBhdHRlcm4gPSByb3V0ZS5wYXRoIHx8ICcnO1xuXG4gICAgICAgIHBhcmVudFBhdHRlcm4gPSBwYXR0ZXJuLnJlcGxhY2UoL1xcLyokLywgJy8nKSArIHBhcmVudFBhdHRlcm47XG5cbiAgICAgICAgaWYgKHBhdHRlcm4uaW5kZXhPZignLycpID09PSAwKSBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICcvJyArIHBhcmVudFBhdHRlcm47XG4gICAgfVxuICB9LFxuXG4gIHByb3BUeXBlczoge1xuICAgIHBhdGg6IHN0cmluZyxcbiAgICBmcm9tOiBzdHJpbmcsIC8vIEFsaWFzIGZvciBwYXRoXG4gICAgdG86IHN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHF1ZXJ5OiBvYmplY3QsXG4gICAgc3RhdGU6IG9iamVjdCxcbiAgICBvbkVudGVyOiBmYWxzeSxcbiAgICBjaGlsZHJlbjogZmFsc3lcbiAgfSxcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogc2FuaXR5IGNoZWNrICovXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICFmYWxzZSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICc8UmVkaXJlY3Q+IGVsZW1lbnRzIGFyZSBmb3Igcm91dGVyIGNvbmZpZ3VyYXRpb24gb25seSBhbmQgc2hvdWxkIG5vdCBiZSByZW5kZXJlZCcpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFJlZGlyZWN0OyJdfQ==