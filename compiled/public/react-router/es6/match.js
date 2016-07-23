'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _createMemoryHistory = require('./createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _createTransitionManager = require('./createTransitionManager');

var _createTransitionManager2 = _interopRequireDefault(_createTransitionManager);

var _RouteUtils = require('./RouteUtils');

var _RouterUtils = require('./RouterUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

function _objectWithoutProperties(obj, keys) {
  var target = {};for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
  }return target;
}

/**
 * A high-level API to be used for server-side rendering.
 *
 * This function matches a location to a set of routes and calls
 * callback(error, redirectLocation, renderProps) when finished.
 *
 * Note: You probably don't want to use this in a browser unless you're using
 * server-side rendering with async routes.
 */
function match(_ref, callback) {
  var history = _ref.history;
  var routes = _ref.routes;
  var location = _ref.location;

  var options = _objectWithoutProperties(_ref, ['history', 'routes', 'location']);

  !(history || location) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'match needs a history or a location') : (0, _invariant2.default)(false) : void 0;

  history = history ? history : (0, _createMemoryHistory2.default)(options);
  var transitionManager = (0, _createTransitionManager2.default)(history, (0, _RouteUtils.createRoutes)(routes));

  var unlisten = void 0;

  if (location) {
    // Allow match({ location: '/the/path', ... })
    location = history.createLocation(location);
  } else {
    // Pick up the location from the history via synchronous history.listen
    // call if needed.
    unlisten = history.listen(function (historyLocation) {
      location = historyLocation;
    });
  }

  var router = (0, _RouterUtils.createRouterObject)(history, transitionManager);
  history = (0, _RouterUtils.createRoutingHistory)(history, transitionManager);

  transitionManager.match(location, function (error, redirectLocation, nextState) {
    callback(error, redirectLocation, nextState && _extends({}, nextState, {
      history: history,
      router: router,
      matchContext: { history: history, transitionManager: transitionManager, router: router }
    }));

    // Defer removing the listener to here to prevent DOM histories from having
    // to unwind DOM event listeners unnecessarily, in case callback renders a
    // <Router> and attaches another history listener.
    if (unlisten) {
      unlisten();
    }
  });
}

exports.default = match;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L21hdGNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBVEEsSUFBSSxXQUFXLE9BQU8sTUFBUCxJQUFpQixVQUFVLE1BQVYsRUFBa0I7QUFBRSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUFFLFFBQUksU0FBUyxVQUFVLENBQVYsQ0FBYixDQUEyQixLQUFLLElBQUksR0FBVCxJQUFnQixNQUFoQixFQUF3QjtBQUFFLFVBQUksT0FBTyxTQUFQLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLENBQXFDLE1BQXJDLEVBQTZDLEdBQTdDLENBQUosRUFBdUQ7QUFBRSxlQUFPLEdBQVAsSUFBYyxPQUFPLEdBQVAsQ0FBZDtBQUE0QjtBQUFFO0FBQUUsR0FBQyxPQUFPLE1BQVA7QUFBZ0IsQ0FBaFE7O0FBRUEsU0FBUyx3QkFBVCxDQUFrQyxHQUFsQyxFQUF1QyxJQUF2QyxFQUE2QztBQUFFLE1BQUksU0FBUyxFQUFiLENBQWlCLEtBQUssSUFBSSxDQUFULElBQWMsR0FBZCxFQUFtQjtBQUFFLFFBQUksS0FBSyxPQUFMLENBQWEsQ0FBYixLQUFtQixDQUF2QixFQUEwQixTQUFVLElBQUksQ0FBQyxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBcUMsR0FBckMsRUFBMEMsQ0FBMUMsQ0FBTCxFQUFtRCxTQUFVLE9BQU8sQ0FBUCxJQUFZLElBQUksQ0FBSixDQUFaO0FBQXFCLEdBQUMsT0FBTyxNQUFQO0FBQWdCOztBQVM1Tjs7Ozs7Ozs7O0FBU0EsU0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixRQUFyQixFQUErQjtBQUM3QixNQUFJLFVBQVUsS0FBSyxPQUFuQjtBQUNBLE1BQUksU0FBUyxLQUFLLE1BQWxCO0FBQ0EsTUFBSSxXQUFXLEtBQUssUUFBcEI7O0FBRUEsTUFBSSxVQUFVLHlCQUF5QixJQUF6QixFQUErQixDQUFDLFNBQUQsRUFBWSxRQUFaLEVBQXNCLFVBQXRCLENBQS9CLENBQWQ7O0FBRUEsSUFBRSxXQUFXLFFBQWIsSUFBeUIsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3Qyx5QkFBVSxLQUFWLEVBQWlCLHFDQUFqQixDQUF4QyxHQUFrRyx5QkFBVSxLQUFWLENBQTNILEdBQThJLEtBQUssQ0FBbko7O0FBRUEsWUFBVSxVQUFVLE9BQVYsR0FBb0IsbUNBQW9CLE9BQXBCLENBQTlCO0FBQ0EsTUFBSSxvQkFBb0IsdUNBQXdCLE9BQXhCLEVBQWlDLDhCQUFhLE1BQWIsQ0FBakMsQ0FBeEI7O0FBRUEsTUFBSSxXQUFXLEtBQUssQ0FBcEI7O0FBRUEsTUFBSSxRQUFKLEVBQWM7QUFDWjtBQUNBLGVBQVcsUUFBUSxjQUFSLENBQXVCLFFBQXZCLENBQVg7QUFDRCxHQUhELE1BR087QUFDTDtBQUNBO0FBQ0EsZUFBVyxRQUFRLE1BQVIsQ0FBZSxVQUFVLGVBQVYsRUFBMkI7QUFDbkQsaUJBQVcsZUFBWDtBQUNELEtBRlUsQ0FBWDtBQUdEOztBQUVELE1BQUksU0FBUyxxQ0FBbUIsT0FBbkIsRUFBNEIsaUJBQTVCLENBQWI7QUFDQSxZQUFVLHVDQUFxQixPQUFyQixFQUE4QixpQkFBOUIsQ0FBVjs7QUFFQSxvQkFBa0IsS0FBbEIsQ0FBd0IsUUFBeEIsRUFBa0MsVUFBVSxLQUFWLEVBQWlCLGdCQUFqQixFQUFtQyxTQUFuQyxFQUE4QztBQUM5RSxhQUFTLEtBQVQsRUFBZ0IsZ0JBQWhCLEVBQWtDLGFBQWEsU0FBUyxFQUFULEVBQWEsU0FBYixFQUF3QjtBQUNyRSxlQUFTLE9BRDREO0FBRXJFLGNBQVEsTUFGNkQ7QUFHckUsb0JBQWMsRUFBRSxTQUFTLE9BQVgsRUFBb0IsbUJBQW1CLGlCQUF2QyxFQUEwRCxRQUFRLE1BQWxFO0FBSHVELEtBQXhCLENBQS9DOztBQU1BO0FBQ0E7QUFDQTtBQUNBLFFBQUksUUFBSixFQUFjO0FBQ1o7QUFDRDtBQUNGLEdBYkQ7QUFjRDs7a0JBRWMsSyIsImZpbGUiOiJtYXRjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhvYmosIGtleXMpIHsgdmFyIHRhcmdldCA9IHt9OyBmb3IgKHZhciBpIGluIG9iaikgeyBpZiAoa2V5cy5pbmRleE9mKGkpID49IDApIGNvbnRpbnVlOyBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBjb250aW51ZTsgdGFyZ2V0W2ldID0gb2JqW2ldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuXG5pbXBvcnQgY3JlYXRlTWVtb3J5SGlzdG9yeSBmcm9tICcuL2NyZWF0ZU1lbW9yeUhpc3RvcnknO1xuaW1wb3J0IGNyZWF0ZVRyYW5zaXRpb25NYW5hZ2VyIGZyb20gJy4vY3JlYXRlVHJhbnNpdGlvbk1hbmFnZXInO1xuaW1wb3J0IHsgY3JlYXRlUm91dGVzIH0gZnJvbSAnLi9Sb3V0ZVV0aWxzJztcbmltcG9ydCB7IGNyZWF0ZVJvdXRlck9iamVjdCwgY3JlYXRlUm91dGluZ0hpc3RvcnkgfSBmcm9tICcuL1JvdXRlclV0aWxzJztcblxuLyoqXG4gKiBBIGhpZ2gtbGV2ZWwgQVBJIHRvIGJlIHVzZWQgZm9yIHNlcnZlci1zaWRlIHJlbmRlcmluZy5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIG1hdGNoZXMgYSBsb2NhdGlvbiB0byBhIHNldCBvZiByb3V0ZXMgYW5kIGNhbGxzXG4gKiBjYWxsYmFjayhlcnJvciwgcmVkaXJlY3RMb2NhdGlvbiwgcmVuZGVyUHJvcHMpIHdoZW4gZmluaXNoZWQuXG4gKlxuICogTm90ZTogWW91IHByb2JhYmx5IGRvbid0IHdhbnQgdG8gdXNlIHRoaXMgaW4gYSBicm93c2VyIHVubGVzcyB5b3UncmUgdXNpbmdcbiAqIHNlcnZlci1zaWRlIHJlbmRlcmluZyB3aXRoIGFzeW5jIHJvdXRlcy5cbiAqL1xuZnVuY3Rpb24gbWF0Y2goX3JlZiwgY2FsbGJhY2spIHtcbiAgdmFyIGhpc3RvcnkgPSBfcmVmLmhpc3Rvcnk7XG4gIHZhciByb3V0ZXMgPSBfcmVmLnJvdXRlcztcbiAgdmFyIGxvY2F0aW9uID0gX3JlZi5sb2NhdGlvbjtcblxuICB2YXIgb3B0aW9ucyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcmVmLCBbJ2hpc3RvcnknLCAncm91dGVzJywgJ2xvY2F0aW9uJ10pO1xuXG4gICEoaGlzdG9yeSB8fCBsb2NhdGlvbikgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnbWF0Y2ggbmVlZHMgYSBoaXN0b3J5IG9yIGEgbG9jYXRpb24nKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG5cbiAgaGlzdG9yeSA9IGhpc3RvcnkgPyBoaXN0b3J5IDogY3JlYXRlTWVtb3J5SGlzdG9yeShvcHRpb25zKTtcbiAgdmFyIHRyYW5zaXRpb25NYW5hZ2VyID0gY3JlYXRlVHJhbnNpdGlvbk1hbmFnZXIoaGlzdG9yeSwgY3JlYXRlUm91dGVzKHJvdXRlcykpO1xuXG4gIHZhciB1bmxpc3RlbiA9IHZvaWQgMDtcblxuICBpZiAobG9jYXRpb24pIHtcbiAgICAvLyBBbGxvdyBtYXRjaCh7IGxvY2F0aW9uOiAnL3RoZS9wYXRoJywgLi4uIH0pXG4gICAgbG9jYXRpb24gPSBoaXN0b3J5LmNyZWF0ZUxvY2F0aW9uKGxvY2F0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBQaWNrIHVwIHRoZSBsb2NhdGlvbiBmcm9tIHRoZSBoaXN0b3J5IHZpYSBzeW5jaHJvbm91cyBoaXN0b3J5Lmxpc3RlblxuICAgIC8vIGNhbGwgaWYgbmVlZGVkLlxuICAgIHVubGlzdGVuID0gaGlzdG9yeS5saXN0ZW4oZnVuY3Rpb24gKGhpc3RvcnlMb2NhdGlvbikge1xuICAgICAgbG9jYXRpb24gPSBoaXN0b3J5TG9jYXRpb247XG4gICAgfSk7XG4gIH1cblxuICB2YXIgcm91dGVyID0gY3JlYXRlUm91dGVyT2JqZWN0KGhpc3RvcnksIHRyYW5zaXRpb25NYW5hZ2VyKTtcbiAgaGlzdG9yeSA9IGNyZWF0ZVJvdXRpbmdIaXN0b3J5KGhpc3RvcnksIHRyYW5zaXRpb25NYW5hZ2VyKTtcblxuICB0cmFuc2l0aW9uTWFuYWdlci5tYXRjaChsb2NhdGlvbiwgZnVuY3Rpb24gKGVycm9yLCByZWRpcmVjdExvY2F0aW9uLCBuZXh0U3RhdGUpIHtcbiAgICBjYWxsYmFjayhlcnJvciwgcmVkaXJlY3RMb2NhdGlvbiwgbmV4dFN0YXRlICYmIF9leHRlbmRzKHt9LCBuZXh0U3RhdGUsIHtcbiAgICAgIGhpc3Rvcnk6IGhpc3RvcnksXG4gICAgICByb3V0ZXI6IHJvdXRlcixcbiAgICAgIG1hdGNoQ29udGV4dDogeyBoaXN0b3J5OiBoaXN0b3J5LCB0cmFuc2l0aW9uTWFuYWdlcjogdHJhbnNpdGlvbk1hbmFnZXIsIHJvdXRlcjogcm91dGVyIH1cbiAgICB9KSk7XG5cbiAgICAvLyBEZWZlciByZW1vdmluZyB0aGUgbGlzdGVuZXIgdG8gaGVyZSB0byBwcmV2ZW50IERPTSBoaXN0b3JpZXMgZnJvbSBoYXZpbmdcbiAgICAvLyB0byB1bndpbmQgRE9NIGV2ZW50IGxpc3RlbmVycyB1bm5lY2Vzc2FyaWx5LCBpbiBjYXNlIGNhbGxiYWNrIHJlbmRlcnMgYVxuICAgIC8vIDxSb3V0ZXI+IGFuZCBhdHRhY2hlcyBhbm90aGVyIGhpc3RvcnkgbGlzdGVuZXIuXG4gICAgaWYgKHVubGlzdGVuKSB7XG4gICAgICB1bmxpc3RlbigpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hdGNoOyJdfQ==