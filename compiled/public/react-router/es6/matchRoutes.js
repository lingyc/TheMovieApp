"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = matchRoutes;

var _AsyncUtils = require("./AsyncUtils");

var _makeStateWithLocation = require("./makeStateWithLocation");

var _makeStateWithLocation2 = _interopRequireDefault(_makeStateWithLocation);

var _PatternUtils = require("./PatternUtils");

var _routerWarning = require("./routerWarning");

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _RouteUtils = require("./RouteUtils");

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

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

function getChildRoutes(route, location, paramNames, paramValues, callback) {
  if (route.childRoutes) {
    return [null, route.childRoutes];
  }
  if (!route.getChildRoutes) {
    return [];
  }

  var sync = true,
      result = void 0;

  var partialNextState = {
    location: location,
    params: createParams(paramNames, paramValues)
  };

  var partialNextStateWithLocation = (0, _makeStateWithLocation2.default)(partialNextState, location);

  route.getChildRoutes(partialNextStateWithLocation, function (error, childRoutes) {
    childRoutes = !error && (0, _RouteUtils.createRoutes)(childRoutes);
    if (sync) {
      result = [error, childRoutes];
      return;
    }

    callback(error, childRoutes);
  });

  sync = false;
  return result; // Might be undefined.
}

function getIndexRoute(route, location, paramNames, paramValues, callback) {
  if (route.indexRoute) {
    callback(null, route.indexRoute);
  } else if (route.getIndexRoute) {
    var partialNextState = {
      location: location,
      params: createParams(paramNames, paramValues)
    };

    var partialNextStateWithLocation = (0, _makeStateWithLocation2.default)(partialNextState, location);

    route.getIndexRoute(partialNextStateWithLocation, function (error, indexRoute) {
      callback(error, !error && (0, _RouteUtils.createRoutes)(indexRoute)[0]);
    });
  } else if (route.childRoutes) {
    (function () {
      var pathless = route.childRoutes.filter(function (childRoute) {
        return !childRoute.path;
      });

      (0, _AsyncUtils.loopAsync)(pathless.length, function (index, next, done) {
        getIndexRoute(pathless[index], location, paramNames, paramValues, function (error, indexRoute) {
          if (error || indexRoute) {
            var routes = [pathless[index]].concat(Array.isArray(indexRoute) ? indexRoute : [indexRoute]);
            done(error, routes);
          } else {
            next();
          }
        });
      }, function (err, routes) {
        callback(null, routes);
      });
    })();
  } else {
    callback();
  }
}

function assignParams(params, paramNames, paramValues) {
  return paramNames.reduce(function (params, paramName, index) {
    var paramValue = paramValues && paramValues[index];

    if (Array.isArray(params[paramName])) {
      params[paramName].push(paramValue);
    } else if (paramName in params) {
      params[paramName] = [params[paramName], paramValue];
    } else {
      params[paramName] = paramValue;
    }

    return params;
  }, params);
}

function createParams(paramNames, paramValues) {
  return assignParams({}, paramNames, paramValues);
}

function matchRouteDeep(route, location, remainingPathname, paramNames, paramValues, callback) {
  var pattern = route.path || '';

  if (pattern.charAt(0) === '/') {
    remainingPathname = location.pathname;
    paramNames = [];
    paramValues = [];
  }

  // Only try to match the path if the route actually has a pattern, and if
  // we're not just searching for potential nested absolute paths.
  if (remainingPathname !== null && pattern) {
    try {
      var matched = (0, _PatternUtils.matchPattern)(pattern, remainingPathname);
      if (matched) {
        remainingPathname = matched.remainingPathname;
        paramNames = [].concat(paramNames, matched.paramNames);
        paramValues = [].concat(paramValues, matched.paramValues);
      } else {
        remainingPathname = null;
      }
    } catch (error) {
      callback(error);
    }

    // By assumption, pattern is non-empty here, which is the prerequisite for
    // actually terminating a match.
    if (remainingPathname === '') {
      var _ret2 = function () {
        var match = {
          routes: [route],
          params: createParams(paramNames, paramValues)
        };

        getIndexRoute(route, location, paramNames, paramValues, function (error, indexRoute) {
          if (error) {
            callback(error);
          } else {
            if (Array.isArray(indexRoute)) {
              var _match$routes;

              process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(indexRoute.every(function (route) {
                return !route.path;
              }), 'Index routes should not have paths') : void 0;
              (_match$routes = match.routes).push.apply(_match$routes, indexRoute);
            } else if (indexRoute) {
              process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(!indexRoute.path, 'Index routes should not have paths') : void 0;
              match.routes.push(indexRoute);
            }

            callback(null, match);
          }
        });

        return {
          v: void 0
        };
      }();

      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
    }
  }

  if (remainingPathname != null || route.childRoutes) {
    // Either a) this route matched at least some of the path or b)
    // we don't have to load this route's children asynchronously. In
    // either case continue checking for matches in the subtree.
    var onChildRoutes = function onChildRoutes(error, childRoutes) {
      if (error) {
        callback(error);
      } else if (childRoutes) {
        // Check the child routes to see if any of them match.
        matchRoutes(childRoutes, location, function (error, match) {
          if (error) {
            callback(error);
          } else if (match) {
            // A child route matched! Augment the match and pass it up the stack.
            match.routes.unshift(route);
            callback(null, match);
          } else {
            callback();
          }
        }, remainingPathname, paramNames, paramValues);
      } else {
        callback();
      }
    };

    var result = getChildRoutes(route, location, paramNames, paramValues, onChildRoutes);
    if (result) {
      onChildRoutes.apply(undefined, result);
    }
  } else {
    callback();
  }
}

/**
 * Asynchronously matches the given location to a set of routes and calls
 * callback(error, state) when finished. The state object will have the
 * following properties:
 *
 * - routes       An array of routes that matched, in hierarchical order
 * - params       An object of URL parameters
 *
 * Note: This operation may finish synchronously if no routes have an
 * asynchronous getChildRoutes method.
 */
function matchRoutes(routes, location, callback, remainingPathname) {
  var paramNames = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];
  var paramValues = arguments.length <= 5 || arguments[5] === undefined ? [] : arguments[5];

  if (remainingPathname === undefined) {
    // TODO: This is a little bit ugly, but it works around a quirk in history
    // that strips the leading slash from pathnames when using basenames with
    // trailing slashes.
    if (location.pathname.charAt(0) !== '/') {
      location = _extends({}, location, {
        pathname: '/' + location.pathname
      });
    }
    remainingPathname = location.pathname;
  }

  (0, _AsyncUtils.loopAsync)(routes.length, function (index, next, done) {
    matchRouteDeep(routes[index], location, remainingPathname, paramNames, paramValues, function (error, match) {
      if (error || match) {
        done(error, match);
      } else {
        next();
      }
    });
  }, callback);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L21hdGNoUm91dGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2tCQWdOd0IsVzs7QUE1TXhCOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQVJBLElBQUksV0FBVyxPQUFPLE1BQVAsSUFBaUIsVUFBVSxNQUFWLEVBQWtCO0FBQUUsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFBRSxRQUFJLFNBQVMsVUFBVSxDQUFWLENBQWIsQ0FBMkIsS0FBSyxJQUFJLEdBQVQsSUFBZ0IsTUFBaEIsRUFBd0I7QUFBRSxVQUFJLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxNQUFyQyxFQUE2QyxHQUE3QyxDQUFKLEVBQXVEO0FBQUUsZUFBTyxHQUFQLElBQWMsT0FBTyxHQUFQLENBQWQ7QUFBNEI7QUFBRTtBQUFFLEdBQUMsT0FBTyxNQUFQO0FBQWdCLENBQWhROztBQUVBLElBQUksVUFBVSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsU0FBTyxPQUFPLFFBQWQsTUFBMkIsUUFBM0QsR0FBc0UsVUFBVSxHQUFWLEVBQWU7QUFBRSxnQkFBYyxHQUFkLDBDQUFjLEdBQWQ7QUFBb0IsQ0FBM0csR0FBOEcsVUFBVSxHQUFWLEVBQWU7QUFBRSxTQUFPLE9BQU8sT0FBTyxNQUFQLEtBQWtCLFVBQXpCLElBQXVDLElBQUksV0FBSixLQUFvQixNQUEzRCxHQUFvRSxRQUFwRSxVQUFzRixHQUF0RiwwQ0FBc0YsR0FBdEYsQ0FBUDtBQUFtRyxDQUFoUDs7QUFRQSxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsRUFBK0IsUUFBL0IsRUFBeUMsVUFBekMsRUFBcUQsV0FBckQsRUFBa0UsUUFBbEUsRUFBNEU7QUFDMUUsTUFBSSxNQUFNLFdBQVYsRUFBdUI7QUFDckIsV0FBTyxDQUFDLElBQUQsRUFB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QUFVLENBQVYsTUFBaUIsU0FBMUMsR0FBc0QsRUFBdEQsR0FBMkQsVUFBVSxDQUFWLENBQTVFO0FBQ0EsTUFBSSxjQUFjLFVBQVUsTUFBVixJQUFvQixDQUFwQixJQUF5QixVQUFVLENBQVYsTUFBaUIsU0FBMUMsR0FBc0QsRUFBdEQsR0FBMkQsVUFBVSxDQUFWLENBQTdFOztBQUVBLE1BQUksc0JBQXNCLFNBQTFCLEVBQXFDO0FBQ25DO0FBQ0E7QUFDQTtBQUNBLFFBQUksU0FBUyxRQUFULENBQWtCLE1BQWxCLENBQXlCLENBQXpCLE1BQWdDLEdBQXBDLEVBQXlDO0FBQ3ZDLGlCQUFXLFNBQVMsRUFBVCxFQUFhLFFBQWIsRUFBdUI7QUFDaEMsa0JBQVUsTUFBTSxTQUFTO0FBRE8sT0FBdkIsQ0FBWDtBQUdEO0FBQ0Qsd0JBQW9CLFNBQVMsUUFBN0I7QUFDRDs7QUFFRCw2QkFBVSxPQUFPLE1BQWpCLEVBQXlCLFVBQVUsS0FBVixFQUFpQixJQUFqQixFQUF1QixJQUF2QixFQUE2QjtBQUNwRCxtQkFBZSxPQUFPLEtBQVAsQ0FBZixFQUE4QixRQUE5QixFQUF3QyxpQkFBeEMsRUFBMkQsVUFBM0QsRUFBdUUsV0FBdkUsRUFBb0YsVUFBVSxLQUFWLEVBQWlCLEtBQWpCLEVBQXdCO0FBQzFHLFVBQUksU0FBUyxLQUFiLEVBQW9CO0FBQ2xCLGFBQUssS0FBTCxFQUFZLEtBQVo7QUFDRCxPQUZELE1BRU87QUFDTDtBQUNEO0FBQ0YsS0FORDtBQU9ELEdBUkQsRUFRRyxRQVJIO0FBU0QiLCJmaWxlIjoibWF0Y2hSb3V0ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuaW1wb3J0IHsgbG9vcEFzeW5jIH0gZnJvbSAnLi9Bc3luY1V0aWxzJztcbmltcG9ydCBtYWtlU3RhdGVXaXRoTG9jYXRpb24gZnJvbSAnLi9tYWtlU3RhdGVXaXRoTG9jYXRpb24nO1xuaW1wb3J0IHsgbWF0Y2hQYXR0ZXJuIH0gZnJvbSAnLi9QYXR0ZXJuVXRpbHMnO1xuaW1wb3J0IHdhcm5pbmcgZnJvbSAnLi9yb3V0ZXJXYXJuaW5nJztcbmltcG9ydCB7IGNyZWF0ZVJvdXRlcyB9IGZyb20gJy4vUm91dGVVdGlscyc7XG5cbmZ1bmN0aW9uIGdldENoaWxkUm91dGVzKHJvdXRlLCBsb2NhdGlvbiwgcGFyYW1OYW1lcywgcGFyYW1WYWx1ZXMsIGNhbGxiYWNrKSB7XG4gIGlmIChyb3V0ZS5jaGlsZFJvdXRlcykge1xuICAgIHJldHVybiBbbnVsbCwgcm91dGUuY2hpbGRSb3V0ZXNdO1xuICB9XG4gIGlmICghcm91dGUuZ2V0Q2hpbGRSb3V0ZXMpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICB2YXIgc3luYyA9IHRydWUsXG4gICAgICByZXN1bHQgPSB2b2lkIDA7XG5cbiAgdmFyIHBhcnRpYWxOZXh0U3RhdGUgPSB7XG4gICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgIHBhcmFtczogY3JlYXRlUGFyYW1zKHBhcmFtTmFtZXMsIHBhcmFtVmFsdWVzKVxuICB9O1xuXG4gIHZhciBwYXJ0aWFsTmV4dFN0YXRlV2l0aExvY2F0aW9uID0gbWFrZVN0YXRlV2l0aExvY2F0aW9uKHBhcnRpYWxOZXh0U3RhdGUsIGxvY2F0aW9uKTtcblxuICByb3V0ZS5nZXRDaGlsZFJvdXRlcyhwYXJ0aWFsTmV4dFN0YXRlV2l0aExvY2F0aW9uLCBmdW5jdGlvbiAoZXJyb3IsIGNoaWxkUm91dGVzKSB7XG4gICAgY2hpbGRSb3V0ZXMgPSAhZXJyb3IgJiYgY3JlYXRlUm91dGVzKGNoaWxkUm91dGVzKTtcbiAgICBpZiAoc3luYykge1xuICAgICAgcmVzdWx0ID0gW2Vycm9yLCBjaGlsZFJvdXRlc107XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2FsbGJhY2soZXJyb3IsIGNoaWxkUm91dGVzKTtcbiAgfSk7XG5cbiAgc3luYyA9IGZhbHNlO1xuICByZXR1cm4gcmVzdWx0OyAvLyBNaWdodCBiZSB1bmRlZmluZWQuXG59XG5cbmZ1bmN0aW9uIGdldEluZGV4Um91dGUocm91dGUsIGxvY2F0aW9uLCBwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcywgY2FsbGJhY2spIHtcbiAgaWYgKHJvdXRlLmluZGV4Um91dGUpIHtcbiAgICBjYWxsYmFjayhudWxsLCByb3V0ZS5pbmRleFJvdXRlKTtcbiAgfSBlbHNlIGlmIChyb3V0ZS5nZXRJbmRleFJvdXRlKSB7XG4gICAgdmFyIHBhcnRpYWxOZXh0U3RhdGUgPSB7XG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgICBwYXJhbXM6IGNyZWF0ZVBhcmFtcyhwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcylcbiAgICB9O1xuXG4gICAgdmFyIHBhcnRpYWxOZXh0U3RhdGVXaXRoTG9jYXRpb24gPSBtYWtlU3RhdGVXaXRoTG9jYXRpb24ocGFydGlhbE5leHRTdGF0ZSwgbG9jYXRpb24pO1xuXG4gICAgcm91dGUuZ2V0SW5kZXhSb3V0ZShwYXJ0aWFsTmV4dFN0YXRlV2l0aExvY2F0aW9uLCBmdW5jdGlvbiAoZXJyb3IsIGluZGV4Um91dGUpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCAhZXJyb3IgJiYgY3JlYXRlUm91dGVzKGluZGV4Um91dGUpWzBdKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChyb3V0ZS5jaGlsZFJvdXRlcykge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcGF0aGxlc3MgPSByb3V0ZS5jaGlsZFJvdXRlcy5maWx0ZXIoZnVuY3Rpb24gKGNoaWxkUm91dGUpIHtcbiAgICAgICAgcmV0dXJuICFjaGlsZFJvdXRlLnBhdGg7XG4gICAgICB9KTtcblxuICAgICAgbG9vcEFzeW5jKHBhdGhsZXNzLmxlbmd0aCwgZnVuY3Rpb24gKGluZGV4LCBuZXh0LCBkb25lKSB7XG4gICAgICAgIGdldEluZGV4Um91dGUocGF0aGxlc3NbaW5kZXhdLCBsb2NhdGlvbiwgcGFyYW1OYW1lcywgcGFyYW1WYWx1ZXMsIGZ1bmN0aW9uIChlcnJvciwgaW5kZXhSb3V0ZSkge1xuICAgICAgICAgIGlmIChlcnJvciB8fCBpbmRleFJvdXRlKSB7XG4gICAgICAgICAgICB2YXIgcm91dGVzID0gW3BhdGhsZXNzW2luZGV4XV0uY29uY2F0KEFycmF5LmlzQXJyYXkoaW5kZXhSb3V0ZSkgPyBpbmRleFJvdXRlIDogW2luZGV4Um91dGVdKTtcbiAgICAgICAgICAgIGRvbmUoZXJyb3IsIHJvdXRlcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSwgZnVuY3Rpb24gKGVyciwgcm91dGVzKSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJvdXRlcyk7XG4gICAgICB9KTtcbiAgICB9KSgpO1xuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzaWduUGFyYW1zKHBhcmFtcywgcGFyYW1OYW1lcywgcGFyYW1WYWx1ZXMpIHtcbiAgcmV0dXJuIHBhcmFtTmFtZXMucmVkdWNlKGZ1bmN0aW9uIChwYXJhbXMsIHBhcmFtTmFtZSwgaW5kZXgpIHtcbiAgICB2YXIgcGFyYW1WYWx1ZSA9IHBhcmFtVmFsdWVzICYmIHBhcmFtVmFsdWVzW2luZGV4XTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtc1twYXJhbU5hbWVdKSkge1xuICAgICAgcGFyYW1zW3BhcmFtTmFtZV0ucHVzaChwYXJhbVZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHBhcmFtTmFtZSBpbiBwYXJhbXMpIHtcbiAgICAgIHBhcmFtc1twYXJhbU5hbWVdID0gW3BhcmFtc1twYXJhbU5hbWVdLCBwYXJhbVZhbHVlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyYW1zW3BhcmFtTmFtZV0gPSBwYXJhbVZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG4gIH0sIHBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBhcmFtcyhwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcykge1xuICByZXR1cm4gYXNzaWduUGFyYW1zKHt9LCBwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcyk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoUm91dGVEZWVwKHJvdXRlLCBsb2NhdGlvbiwgcmVtYWluaW5nUGF0aG5hbWUsIHBhcmFtTmFtZXMsIHBhcmFtVmFsdWVzLCBjYWxsYmFjaykge1xuICB2YXIgcGF0dGVybiA9IHJvdXRlLnBhdGggfHwgJyc7XG5cbiAgaWYgKHBhdHRlcm4uY2hhckF0KDApID09PSAnLycpIHtcbiAgICByZW1haW5pbmdQYXRobmFtZSA9IGxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIHBhcmFtTmFtZXMgPSBbXTtcbiAgICBwYXJhbVZhbHVlcyA9IFtdO1xuICB9XG5cbiAgLy8gT25seSB0cnkgdG8gbWF0Y2ggdGhlIHBhdGggaWYgdGhlIHJvdXRlIGFjdHVhbGx5IGhhcyBhIHBhdHRlcm4sIGFuZCBpZlxuICAvLyB3ZSdyZSBub3QganVzdCBzZWFyY2hpbmcgZm9yIHBvdGVudGlhbCBuZXN0ZWQgYWJzb2x1dGUgcGF0aHMuXG4gIGlmIChyZW1haW5pbmdQYXRobmFtZSAhPT0gbnVsbCAmJiBwYXR0ZXJuKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBtYXRjaGVkID0gbWF0Y2hQYXR0ZXJuKHBhdHRlcm4sIHJlbWFpbmluZ1BhdGhuYW1lKTtcbiAgICAgIGlmIChtYXRjaGVkKSB7XG4gICAgICAgIHJlbWFpbmluZ1BhdGhuYW1lID0gbWF0Y2hlZC5yZW1haW5pbmdQYXRobmFtZTtcbiAgICAgICAgcGFyYW1OYW1lcyA9IFtdLmNvbmNhdChwYXJhbU5hbWVzLCBtYXRjaGVkLnBhcmFtTmFtZXMpO1xuICAgICAgICBwYXJhbVZhbHVlcyA9IFtdLmNvbmNhdChwYXJhbVZhbHVlcywgbWF0Y2hlZC5wYXJhbVZhbHVlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdQYXRobmFtZSA9IG51bGw7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICB9XG5cbiAgICAvLyBCeSBhc3N1bXB0aW9uLCBwYXR0ZXJuIGlzIG5vbi1lbXB0eSBoZXJlLCB3aGljaCBpcyB0aGUgcHJlcmVxdWlzaXRlIGZvclxuICAgIC8vIGFjdHVhbGx5IHRlcm1pbmF0aW5nIGEgbWF0Y2guXG4gICAgaWYgKHJlbWFpbmluZ1BhdGhuYW1lID09PSAnJykge1xuICAgICAgdmFyIF9yZXQyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbWF0Y2ggPSB7XG4gICAgICAgICAgcm91dGVzOiBbcm91dGVdLFxuICAgICAgICAgIHBhcmFtczogY3JlYXRlUGFyYW1zKHBhcmFtTmFtZXMsIHBhcmFtVmFsdWVzKVxuICAgICAgICB9O1xuXG4gICAgICAgIGdldEluZGV4Um91dGUocm91dGUsIGxvY2F0aW9uLCBwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcywgZnVuY3Rpb24gKGVycm9yLCBpbmRleFJvdXRlKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGluZGV4Um91dGUpKSB7XG4gICAgICAgICAgICAgIHZhciBfbWF0Y2gkcm91dGVzO1xuXG4gICAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGluZGV4Um91dGUuZXZlcnkoZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICFyb3V0ZS5wYXRoO1xuICAgICAgICAgICAgICB9KSwgJ0luZGV4IHJvdXRlcyBzaG91bGQgbm90IGhhdmUgcGF0aHMnKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgKF9tYXRjaCRyb3V0ZXMgPSBtYXRjaC5yb3V0ZXMpLnB1c2guYXBwbHkoX21hdGNoJHJvdXRlcywgaW5kZXhSb3V0ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4Um91dGUpIHtcbiAgICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoIWluZGV4Um91dGUucGF0aCwgJ0luZGV4IHJvdXRlcyBzaG91bGQgbm90IGhhdmUgcGF0aHMnKSA6IHZvaWQgMDtcbiAgICAgICAgICAgICAgbWF0Y2gucm91dGVzLnB1c2goaW5kZXhSb3V0ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG1hdGNoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdjogdm9pZCAwXG4gICAgICAgIH07XG4gICAgICB9KCk7XG5cbiAgICAgIGlmICgodHlwZW9mIF9yZXQyID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihfcmV0MikpID09PSBcIm9iamVjdFwiKSByZXR1cm4gX3JldDIudjtcbiAgICB9XG4gIH1cblxuICBpZiAocmVtYWluaW5nUGF0aG5hbWUgIT0gbnVsbCB8fCByb3V0ZS5jaGlsZFJvdXRlcykge1xuICAgIC8vIEVpdGhlciBhKSB0aGlzIHJvdXRlIG1hdGNoZWQgYXQgbGVhc3Qgc29tZSBvZiB0aGUgcGF0aCBvciBiKVxuICAgIC8vIHdlIGRvbid0IGhhdmUgdG8gbG9hZCB0aGlzIHJvdXRlJ3MgY2hpbGRyZW4gYXN5bmNocm9ub3VzbHkuIEluXG4gICAgLy8gZWl0aGVyIGNhc2UgY29udGludWUgY2hlY2tpbmcgZm9yIG1hdGNoZXMgaW4gdGhlIHN1YnRyZWUuXG4gICAgdmFyIG9uQ2hpbGRSb3V0ZXMgPSBmdW5jdGlvbiBvbkNoaWxkUm91dGVzKGVycm9yLCBjaGlsZFJvdXRlcykge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hpbGRSb3V0ZXMpIHtcbiAgICAgICAgLy8gQ2hlY2sgdGhlIGNoaWxkIHJvdXRlcyB0byBzZWUgaWYgYW55IG9mIHRoZW0gbWF0Y2guXG4gICAgICAgIG1hdGNoUm91dGVzKGNoaWxkUm91dGVzLCBsb2NhdGlvbiwgZnVuY3Rpb24gKGVycm9yLCBtYXRjaCkge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIC8vIEEgY2hpbGQgcm91dGUgbWF0Y2hlZCEgQXVnbWVudCB0aGUgbWF0Y2ggYW5kIHBhc3MgaXQgdXAgdGhlIHN0YWNrLlxuICAgICAgICAgICAgbWF0Y2gucm91dGVzLnVuc2hpZnQocm91dGUpO1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgbWF0Y2gpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgcmVtYWluaW5nUGF0aG5hbWUsIHBhcmFtTmFtZXMsIHBhcmFtVmFsdWVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciByZXN1bHQgPSBnZXRDaGlsZFJvdXRlcyhyb3V0ZSwgbG9jYXRpb24sIHBhcmFtTmFtZXMsIHBhcmFtVmFsdWVzLCBvbkNoaWxkUm91dGVzKTtcbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICBvbkNoaWxkUm91dGVzLmFwcGx5KHVuZGVmaW5lZCwgcmVzdWx0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2soKTtcbiAgfVxufVxuXG4vKipcbiAqIEFzeW5jaHJvbm91c2x5IG1hdGNoZXMgdGhlIGdpdmVuIGxvY2F0aW9uIHRvIGEgc2V0IG9mIHJvdXRlcyBhbmQgY2FsbHNcbiAqIGNhbGxiYWNrKGVycm9yLCBzdGF0ZSkgd2hlbiBmaW5pc2hlZC4gVGhlIHN0YXRlIG9iamVjdCB3aWxsIGhhdmUgdGhlXG4gKiBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAtIHJvdXRlcyAgICAgICBBbiBhcnJheSBvZiByb3V0ZXMgdGhhdCBtYXRjaGVkLCBpbiBoaWVyYXJjaGljYWwgb3JkZXJcbiAqIC0gcGFyYW1zICAgICAgIEFuIG9iamVjdCBvZiBVUkwgcGFyYW1ldGVyc1xuICpcbiAqIE5vdGU6IFRoaXMgb3BlcmF0aW9uIG1heSBmaW5pc2ggc3luY2hyb25vdXNseSBpZiBubyByb3V0ZXMgaGF2ZSBhblxuICogYXN5bmNocm9ub3VzIGdldENoaWxkUm91dGVzIG1ldGhvZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWF0Y2hSb3V0ZXMocm91dGVzLCBsb2NhdGlvbiwgY2FsbGJhY2ssIHJlbWFpbmluZ1BhdGhuYW1lKSB7XG4gIHZhciBwYXJhbU5hbWVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSA0IHx8IGFyZ3VtZW50c1s0XSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbNF07XG4gIHZhciBwYXJhbVZhbHVlcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gNSB8fCBhcmd1bWVudHNbNV0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzVdO1xuXG4gIGlmIChyZW1haW5pbmdQYXRobmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gVE9ETzogVGhpcyBpcyBhIGxpdHRsZSBiaXQgdWdseSwgYnV0IGl0IHdvcmtzIGFyb3VuZCBhIHF1aXJrIGluIGhpc3RvcnlcbiAgICAvLyB0aGF0IHN0cmlwcyB0aGUgbGVhZGluZyBzbGFzaCBmcm9tIHBhdGhuYW1lcyB3aGVuIHVzaW5nIGJhc2VuYW1lcyB3aXRoXG4gICAgLy8gdHJhaWxpbmcgc2xhc2hlcy5cbiAgICBpZiAobG9jYXRpb24ucGF0aG5hbWUuY2hhckF0KDApICE9PSAnLycpIHtcbiAgICAgIGxvY2F0aW9uID0gX2V4dGVuZHMoe30sIGxvY2F0aW9uLCB7XG4gICAgICAgIHBhdGhuYW1lOiAnLycgKyBsb2NhdGlvbi5wYXRobmFtZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJlbWFpbmluZ1BhdGhuYW1lID0gbG9jYXRpb24ucGF0aG5hbWU7XG4gIH1cblxuICBsb29wQXN5bmMocm91dGVzLmxlbmd0aCwgZnVuY3Rpb24gKGluZGV4LCBuZXh0LCBkb25lKSB7XG4gICAgbWF0Y2hSb3V0ZURlZXAocm91dGVzW2luZGV4XSwgbG9jYXRpb24sIHJlbWFpbmluZ1BhdGhuYW1lLCBwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcywgZnVuY3Rpb24gKGVycm9yLCBtYXRjaCkge1xuICAgICAgaWYgKGVycm9yIHx8IG1hdGNoKSB7XG4gICAgICAgIGRvbmUoZXJyb3IsIG1hdGNoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSwgY2FsbGJhY2spO1xufSJdfQ==