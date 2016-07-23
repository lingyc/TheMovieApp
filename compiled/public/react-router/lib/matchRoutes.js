'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.__esModule = true;

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

exports.default = matchRoutes;

var _AsyncUtils = require('./AsyncUtils');

var _makeStateWithLocation = require('./makeStateWithLocation');

var _makeStateWithLocation2 = _interopRequireDefault(_makeStateWithLocation);

var _PatternUtils = require('./PatternUtils');

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _RouteUtils = require('./RouteUtils');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

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
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvbGliL21hdGNoUm91dGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBRUEsUUFBUSxVQUFSLEdBQXFCLElBQXJCOztBQUVBLElBQUksV0FBVyxPQUFPLE1BQVAsSUFBaUIsVUFBVSxNQUFWLEVBQWtCO0FBQUUsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFBRSxRQUFJLFNBQVMsVUFBVSxDQUFWLENBQWIsQ0FBMkIsS0FBSyxJQUFJLEdBQVQsSUFBZ0IsTUFBaEIsRUFBd0I7QUFBRSxVQUFJLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxNQUFyQyxFQUE2QyxHQUE3QyxDQUFKLEVBQXVEO0FBQUUsZUFBTyxHQUFQLElBQWMsT0FBTyxHQUFQLENBQWQ7QUFBNEI7QUFBRTtBQUFFLEdBQUMsT0FBTyxNQUFQO0FBQWdCLENBQWhROztBQUVBLElBQUksVUFBVSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsU0FBTyxPQUFPLFFBQWQsTUFBMkIsUUFBM0QsR0FBc0UsVUFBVSxHQUFWLEVBQWU7QUFBRSxnQkFBYyxHQUFkLDBDQUFjLEdBQWQ7QUFBb0IsQ0FBM0csR0FBOEcsVUFBVSxHQUFWLEVBQWU7QUFBRSxTQUFPLE9BQU8sT0FBTyxNQUFQLEtBQWtCLFVBQXpCLElBQXVDLElBQUksV0FBSixLQUFvQixNQUEzRCxHQUFvRSxRQUFwRSxVQUFzRixHQUF0RiwwQ0FBc0YsR0FBdEYsQ0FBUDtBQUFtRyxDQUFoUDs7QUFFQSxRQUFRLE9BQVIsR0FBa0IsV0FBbEI7O0FBRUEsSUFBSSxjQUFjLFFBQVEsY0FBUixDQUFsQjs7QUFFQSxJQUFJLHlCQUF5QixRQUFRLHlCQUFSLENBQTdCOztBQUVBLElBQUksMEJBQTBCLHVCQUF1QixzQkFBdkIsQ0FBOUI7O0FBRUEsSUFBSSxnQkFBZ0IsUUFBUSxnQkFBUixDQUFwQjs7QUFFQSxJQUFJLGlCQUFpQixRQUFRLGlCQUFSLENBQXJCOztBQUVBLElBQUksa0JBQWtCLHVCQUF1QixjQUF2QixDQUF0Qjs7QUFFQSxJQUFJLGNBQWMsUUFBUSxjQUFSLENBQWxCOztBQUVBLFNBQVMsc0JBQVQsQ0FBZ0MsR0FBaEMsRUFBcUM7QUFBRSxTQUFPLE9BQU8sSUFBSSxVQUFYLEdBQXdCLEdBQXhCLEdBQThCLEVBQUUsU0FBUyxHQUFYLEVBQXJDO0FBQXdEOztBQUUvRixTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsRUFBK0IsUUFBL0IsRUFBeUMsVUFBekMsRUFBcUQsV0FBckQsRUFBa0UsUUFBbEUsRUFBNEU7QUFDMUUsTUFBSSxNQUFNLFdBQVYsRUFBdUI7QUFDckIsV0FBTyxDQUFDLElBQUQsRUFBTyxNQUFNLFdBQWIsQ0FBUDtBQUNEO0FBQ0QsTUFBSSxDQUFDLE1BQU0sY0FBWCxFQUEyQjtBQUN6QixXQUFPLEVBQVA7QUFDRDs7QUFFRCxNQUFJLE9BQU8sSUFBWDtBQUFBLE1BQ0ksU0FBUyxLQUFLLENBRGxCOztBQUdBLE1BQUksbUJBQW1CO0FBQ3JCLGNBQVUsUUFEVztBQUVyQixZQUFRLGFBQWEsVUFBYixFQUF5QixXQUF6QjtBQUZhLEdBQXZCOztBQUtBLE1BQUksK0JBQStCLENBQUMsR0FBRyx3QkFBd0IsT0FBNUIsRUFBcUMsZ0JBQXJDLEVBQXVELFFBQXZELENBQW5DOztBQUVBLFFBQU0sY0FBTixDQUFxQiw0QkFBckIsRUFBbUQsVUFBVSxLQUFWLEVBQWlCLFdBQWpCLEVBQThCO0FBQy9FLGtCQUFjLENBQUMsS0FBRCxJQUFVLENBQUMsR0FBRyxZQUFZLFlBQWhCLEVBQThCLFdBQTlCLENBQXhCO0FBQ0EsUUFBSSxJQUFKLEVBQVU7QUFDUixlQUFTLENBQUMsS0FBRCxFQUFRLFdBQVIsQ0FBVDtBQUNBO0FBQ0Q7O0FBRUQsYUFBUyxLQUFULEVBQWdCLFdBQWhCO0FBQ0QsR0FSRDs7QUFVQSxTQUFPLEtBQVA7QUFDQSxTQUFPLE1BQVAsQ0FBZTtBQUNoQjs7QUFFRCxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEIsUUFBOUIsRUFBd0MsVUFBeEMsRUFBb0QsV0FBcEQsRUFBaUUsUUFBakUsRUFBMkU7QUFDekUsTUFBSSxNQUFNLFVBQVYsRUFBc0I7QUFDcEIsYUFBUyxJQUFULEVBQWUsTUFBTSxVQUFyQjtBQUNELEdBRkQsTUFFTyxJQUFJLE1BQU0sYUFBVixFQUF5QjtBQUM5QixRQUFJLG1CQUFtQjtBQUNyQixnQkFBVSxRQURXO0FBRXJCLGNBQVEsYUFBYSxVQUFiLEVBQXlCLFdBQXpCO0FBRmEsS0FBdkI7O0FBS0EsUUFBSSwrQkFBK0IsQ0FBQyxHQUFHLHdCQUF3QixPQUE1QixFQUFxQyxnQkFBckMsRUFBdUQsUUFBdkQsQ0FBbkM7O0FBRUEsVUFBTSxhQUFOLENBQW9CLDRCQUFwQixFQUFrRCxVQUFVLEtBQVYsRUFBaUIsVUFBakIsRUFBNkI7QUFDN0UsZUFBUyxLQUFULEVBQWdCLENBQUMsS0FBRCxJQUFVLENBQUMsR0FBRyxZQUFZLFlBQWhCLEVBQThCLFVBQTlCLEVBQTBDLENBQTFDLENBQTFCO0FBQ0QsS0FGRDtBQUdELEdBWE0sTUFXQSxJQUFJLE1BQU0sV0FBVixFQUF1QjtBQUM1QixLQUFDLFlBQVk7QUFDWCxVQUFJLFdBQVcsTUFBTSxXQUFOLENBQWtCLE1BQWxCLENBQXlCLFVBQVUsVUFBVixFQUFzQjtBQUM1RCxlQUFPLENBQUMsV0FBVyxJQUFuQjtBQUNELE9BRmMsQ0FBZjs7QUFJQSxPQUFDLEdBQUcsWUFBWSxTQUFoQixFQUEyQixTQUFTLE1BQXBDLEVBQTRDLFVBQVUsS0FBVixFQUFpQixJQUFqQixFQUF1QixJQUF2QixFQUE2QjtBQUN2RSxzQkFBYyxTQUFTLEtBQVQsQ0FBZCxFQUErQixRQUEvQixFQUF5QyxVQUF6QyxFQUFxRCxXQUFyRCxFQUFrRSxVQUFVLEtBQVYsRUFBaUIsVUFBakIsRUFBNkI7QUFDN0YsY0FBSSxTQUFTLFVBQWIsRUFBeUI7QUFDdkIsZ0JBQUksU0FBUyxDQUFDLFNBQVMsS0FBVCxDQUFELEVBQWtCLE1BQWxCLENBQXlCLE1BQU0sT0FBTixDQUFjLFVBQWQsSUFBNEIsVUFBNUIsR0FBeUMsQ0FBQyxVQUFELENBQWxFLENBQWI7QUFDQSxpQkFBSyxLQUFMLEVBQVksTUFBWjtBQUNELFdBSEQsTUFHTztBQUNMO0FBQ0Q7QUFDRixTQVBEO0FBUUQsT0FURCxFQVNHLFVBQVUsR0FBVixFQUFlLE1BQWYsRUFBdUI7QUFDeEIsaUJBQVMsSUFBVCxFQUFlLE1BQWY7QUFDRCxPQVhEO0FBWUQsS0FqQkQ7QUFrQkQsR0FuQk0sTUFtQkE7QUFDTDtBQUNEO0FBQ0Y7O0FBRUQsU0FBUyxZQUFULENBQXNCLE1BQXRCLEVBQThCLFVBQTlCLEVBQTBDLFdBQTFDLEVBQXVEO0FBQ3JELFNBQU8sV0FBVyxNQUFYLENBQWtCLFVBQVUsTUFBVixFQUFrQixTQUFsQixFQUE2QixLQUE3QixFQUFvQztBQUMzRCxRQUFJLGFBQWEsZUFBZSxZQUFZLEtBQVosQ0FBaEM7O0FBRUEsUUFBSSxNQUFNLE9BQU4sQ0FBYyxPQUFPLFNBQVAsQ0FBZCxDQUFKLEVBQXNDO0FBQ3BDLGFBQU8sU0FBUCxFQUFrQixJQUFsQixDQUF1QixVQUF2QjtBQUNELEtBRkQsTUFFTyxJQUFJLGFBQWEsTUFBakIsRUFBeUI7QUFDOUIsYUFBTyxTQUFQLElBQW9CLENBQUMsT0FBTyxTQUFQLENBQUQsRUFBb0IsVUFBcEIsQ0FBcEI7QUFDRCxLQUZNLE1BRUE7QUFDTCxhQUFPLFNBQVAsSUFBb0IsVUFBcEI7QUFDRDs7QUFFRCxXQUFPLE1BQVA7QUFDRCxHQVpNLEVBWUosTUFaSSxDQUFQO0FBYUQ7O0FBRUQsU0FBUyxZQUFULENBQXNCLFVBQXRCLEVBQWtDLFdBQWxDLEVBQStDO0FBQzdDLFNBQU8sYUFBYSxFQUFiLEVBQWlCLFVBQWpCLEVBQTZCLFdBQTdCLENBQVA7QUFDRDs7QUFFRCxTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsRUFBK0IsUUFBL0IsRUFBeUMsaUJBQXpDLEVBQTRELFVBQTVELEVBQXdFLFdBQXhFLEVBQXFGLFFBQXJGLEVBQStGO0FBQzdGLE1BQUksVUFBVSxNQUFNLElBQU4sSUFBYyxFQUE1Qjs7QUFFQSxNQUFJLFFBQVEsTUFBUixDQUFlLENBQWYsTUFBc0IsR0FBMUIsRUFBK0I7QUFDN0Isd0JBQW9CLFNBQVMsUUFBN0I7QUFDQSxpQkFBYSxFQUFiO0FBQ0Esa0JBQWMsRUFBZDtBQUNEOztBQUVEO0FBQ0E7QUFDQSxNQUFJLHNCQUFzQixJQUF0QixJQUE4QixPQUFsQyxFQUEyQztBQUN6QyxRQUFJO0FBQ0YsVUFBSSxVQUFVLENBQUMsR0FBRyxjQUFjLFlBQWxCLEVBQWdDLE9BQWhDLEVBQXlDLGlCQUF6QyxDQUFkO0FBQ0EsVUFBSSxPQUFKLEVBQWE7QUFDWCw0QkFBb0IsUUFBUSxpQkFBNUI7QUFDQSxxQkFBYSxHQUFHLE1BQUgsQ0FBVSxVQUFWLEVBQXNCLFFBQVEsVUFBOUIsQ0FBYjtBQUNBLHNCQUFjLEdBQUcsTUFBSCxDQUFVLFdBQVYsRUFBdUIsUUFBUSxXQUEvQixDQUFkO0FBQ0QsT0FKRCxNQUlPO0FBQ0wsNEJBQW9CLElBQXBCO0FBQ0Q7QUFDRixLQVRELENBU0UsT0FBTyxLQUFQLEVBQWM7QUFDZCxlQUFTLEtBQVQ7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsUUFBSSxzQkFBc0IsRUFBMUIsRUFBOEI7QUFDNUIsVUFBSSxRQUFRLFlBQVk7QUFDdEIsWUFBSSxRQUFRO0FBQ1Ysa0JBQVEsQ0FBQyxLQUFELENBREU7QUFFVixrQkFBUSxhQUFhLFVBQWIsRUFBeUIsV0FBekI7QUFGRSxTQUFaOztBQUtBLHNCQUFjLEtBQWQsRUFBcUIsUUFBckIsRUFBK0IsVUFBL0IsRUFBMkMsV0FBM0MsRUFBd0QsVUFBVSxLQUFWLEVBQWlCLFVBQWpCLEVBQTZCO0FBQ25GLGNBQUksS0FBSixFQUFXO0FBQ1QscUJBQVMsS0FBVDtBQUNELFdBRkQsTUFFTztBQUNMLGdCQUFJLE1BQU0sT0FBTixDQUFjLFVBQWQsQ0FBSixFQUErQjtBQUM3QixrQkFBSSxhQUFKOztBQUVBLHNCQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLENBQUMsR0FBRyxnQkFBZ0IsT0FBcEIsRUFBNkIsV0FBVyxLQUFYLENBQWlCLFVBQVUsS0FBVixFQUFpQjtBQUNyRyx1QkFBTyxDQUFDLE1BQU0sSUFBZDtBQUNELGVBRm9FLENBQTdCLEVBRXBDLG9DQUZvQyxDQUF4QyxHQUU0QyxLQUFLLENBRmpEO0FBR0EsZUFBQyxnQkFBZ0IsTUFBTSxNQUF2QixFQUErQixJQUEvQixDQUFvQyxLQUFwQyxDQUEwQyxhQUExQyxFQUF5RCxVQUF6RDtBQUNELGFBUEQsTUFPTyxJQUFJLFVBQUosRUFBZ0I7QUFDckIsc0JBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsQ0FBQyxHQUFHLGdCQUFnQixPQUFwQixFQUE2QixDQUFDLFdBQVcsSUFBekMsRUFBK0Msb0NBQS9DLENBQXhDLEdBQStILEtBQUssQ0FBcEk7QUFDQSxvQkFBTSxNQUFOLENBQWEsSUFBYixDQUFrQixVQUFsQjtBQUNEOztBQUVELHFCQUFTLElBQVQsRUFBZSxLQUFmO0FBQ0Q7QUFDRixTQWxCRDs7QUFvQkEsZUFBTztBQUNMLGFBQUcsS0FBSztBQURILFNBQVA7QUFHRCxPQTdCVyxFQUFaOztBQStCQSxVQUFJLENBQUMsT0FBTyxLQUFQLEtBQWlCLFdBQWpCLEdBQStCLFdBQS9CLEdBQTZDLFFBQVEsS0FBUixDQUE5QyxNQUFrRSxRQUF0RSxFQUFnRixPQUFPLE1BQU0sQ0FBYjtBQUNqRjtBQUNGOztBQUVELE1BQUkscUJBQXFCLElBQXJCLElBQTZCLE1BQU0sV0FBdkMsRUFBb0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0EsUUFBSSxnQkFBZ0IsU0FBUyxhQUFULENBQXVCLEtBQXZCLEVBQThCLFdBQTlCLEVBQTJDO0FBQzdELFVBQUksS0FBSixFQUFXO0FBQ1QsaUJBQVMsS0FBVDtBQUNELE9BRkQsTUFFTyxJQUFJLFdBQUosRUFBaUI7QUFDdEI7QUFDQSxvQkFBWSxXQUFaLEVBQXlCLFFBQXpCLEVBQW1DLFVBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QjtBQUN6RCxjQUFJLEtBQUosRUFBVztBQUNULHFCQUFTLEtBQVQ7QUFDRCxXQUZELE1BRU8sSUFBSSxLQUFKLEVBQVc7QUFDaEI7QUFDQSxrQkFBTSxNQUFOLENBQWEsT0FBYixDQUFxQixLQUFyQjtBQUNBLHFCQUFTLElBQVQsRUFBZSxLQUFmO0FBQ0QsV0FKTSxNQUlBO0FBQ0w7QUFDRDtBQUNGLFNBVkQsRUFVRyxpQkFWSCxFQVVzQixVQVZ0QixFQVVrQyxXQVZsQztBQVdELE9BYk0sTUFhQTtBQUNMO0FBQ0Q7QUFDRixLQW5CRDs7QUFxQkEsUUFBSSxTQUFTLGVBQWUsS0FBZixFQUFzQixRQUF0QixFQUFnQyxVQUFoQyxFQUE0QyxXQUE1QyxFQUF5RCxhQUF6RCxDQUFiO0FBQ0EsUUFBSSxNQUFKLEVBQVk7QUFDVixvQkFBYyxLQUFkLENBQW9CLFNBQXBCLEVBQStCLE1BQS9CO0FBQ0Q7QUFDRixHQTdCRCxNQTZCTztBQUNMO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7QUFXQSxTQUFTLFdBQVQsQ0FBcUIsTUFBckIsRUFBNkIsUUFBN0IsRUFBdUMsUUFBdkMsRUFBaUQsaUJBQWpELEVBQW9FO0FBQ2xFLE1BQUksYUFBYSxVQUFVLE1BQVYsSUFBb0IsQ0FBcEIsSUFBeUIsVUFBVSxDQUFWLE1BQWlCLFNBQTFDLEdBQXNELEVBQXRELEdBQTJELFVBQVUsQ0FBVixDQUE1RTtBQUNBLE1BQUksY0FBYyxVQUFVLE1BQVYsSUFBb0IsQ0FBcEIsSUFBeUIsVUFBVSxDQUFWLE1BQWlCLFNBQTFDLEdBQXNELEVBQXRELEdBQTJELFVBQVUsQ0FBVixDQUE3RTs7QUFFQSxNQUFJLHNCQUFzQixTQUExQixFQUFxQztBQUNuQztBQUNBO0FBQ0E7QUFDQSxRQUFJLFNBQVMsUUFBVCxDQUFrQixNQUFsQixDQUF5QixDQUF6QixNQUFnQyxHQUFwQyxFQUF5QztBQUN2QyxpQkFBVyxTQUFTLEVBQVQsRUFBYSxRQUFiLEVBQXVCO0FBQ2hDLGtCQUFVLE1BQU0sU0FBUztBQURPLE9BQXZCLENBQVg7QUFHRDtBQUNELHdCQUFvQixTQUFTLFFBQTdCO0FBQ0Q7O0FBRUQsR0FBQyxHQUFHLFlBQVksU0FBaEIsRUFBMkIsT0FBTyxNQUFsQyxFQUEwQyxVQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkI7QUFDckUsbUJBQWUsT0FBTyxLQUFQLENBQWYsRUFBOEIsUUFBOUIsRUFBd0MsaUJBQXhDLEVBQTJELFVBQTNELEVBQXVFLFdBQXZFLEVBQW9GLFVBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QjtBQUMxRyxVQUFJLFNBQVMsS0FBYixFQUFvQjtBQUNsQixhQUFLLEtBQUwsRUFBWSxLQUFaO0FBQ0QsT0FGRCxNQUVPO0FBQ0w7QUFDRDtBQUNGLEtBTkQ7QUFPRCxHQVJELEVBUUcsUUFSSDtBQVNEO0FBQ0QsT0FBTyxPQUFQLEdBQWlCLFFBQVEsU0FBUixDQUFqQiIsImZpbGUiOiJtYXRjaFJvdXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IG1hdGNoUm91dGVzO1xuXG52YXIgX0FzeW5jVXRpbHMgPSByZXF1aXJlKCcuL0FzeW5jVXRpbHMnKTtcblxudmFyIF9tYWtlU3RhdGVXaXRoTG9jYXRpb24gPSByZXF1aXJlKCcuL21ha2VTdGF0ZVdpdGhMb2NhdGlvbicpO1xuXG52YXIgX21ha2VTdGF0ZVdpdGhMb2NhdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYWtlU3RhdGVXaXRoTG9jYXRpb24pO1xuXG52YXIgX1BhdHRlcm5VdGlscyA9IHJlcXVpcmUoJy4vUGF0dGVyblV0aWxzJyk7XG5cbnZhciBfcm91dGVyV2FybmluZyA9IHJlcXVpcmUoJy4vcm91dGVyV2FybmluZycpO1xuXG52YXIgX3JvdXRlcldhcm5pbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcm91dGVyV2FybmluZyk7XG5cbnZhciBfUm91dGVVdGlscyA9IHJlcXVpcmUoJy4vUm91dGVVdGlscycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBnZXRDaGlsZFJvdXRlcyhyb3V0ZSwgbG9jYXRpb24sIHBhcmFtTmFtZXMsIHBhcmFtVmFsdWVzLCBjYWxsYmFjaykge1xuICBpZiAocm91dGUuY2hpbGRSb3V0ZXMpIHtcbiAgICByZXR1cm4gW251bGwsIHJvdXRlLmNoaWxkUm91dGVzXTtcbiAgfVxuICBpZiAoIXJvdXRlLmdldENoaWxkUm91dGVzKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIHN5bmMgPSB0cnVlLFxuICAgICAgcmVzdWx0ID0gdm9pZCAwO1xuXG4gIHZhciBwYXJ0aWFsTmV4dFN0YXRlID0ge1xuICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcbiAgICBwYXJhbXM6IGNyZWF0ZVBhcmFtcyhwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcylcbiAgfTtcblxuICB2YXIgcGFydGlhbE5leHRTdGF0ZVdpdGhMb2NhdGlvbiA9ICgwLCBfbWFrZVN0YXRlV2l0aExvY2F0aW9uMi5kZWZhdWx0KShwYXJ0aWFsTmV4dFN0YXRlLCBsb2NhdGlvbik7XG5cbiAgcm91dGUuZ2V0Q2hpbGRSb3V0ZXMocGFydGlhbE5leHRTdGF0ZVdpdGhMb2NhdGlvbiwgZnVuY3Rpb24gKGVycm9yLCBjaGlsZFJvdXRlcykge1xuICAgIGNoaWxkUm91dGVzID0gIWVycm9yICYmICgwLCBfUm91dGVVdGlscy5jcmVhdGVSb3V0ZXMpKGNoaWxkUm91dGVzKTtcbiAgICBpZiAoc3luYykge1xuICAgICAgcmVzdWx0ID0gW2Vycm9yLCBjaGlsZFJvdXRlc107XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2FsbGJhY2soZXJyb3IsIGNoaWxkUm91dGVzKTtcbiAgfSk7XG5cbiAgc3luYyA9IGZhbHNlO1xuICByZXR1cm4gcmVzdWx0OyAvLyBNaWdodCBiZSB1bmRlZmluZWQuXG59XG5cbmZ1bmN0aW9uIGdldEluZGV4Um91dGUocm91dGUsIGxvY2F0aW9uLCBwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcywgY2FsbGJhY2spIHtcbiAgaWYgKHJvdXRlLmluZGV4Um91dGUpIHtcbiAgICBjYWxsYmFjayhudWxsLCByb3V0ZS5pbmRleFJvdXRlKTtcbiAgfSBlbHNlIGlmIChyb3V0ZS5nZXRJbmRleFJvdXRlKSB7XG4gICAgdmFyIHBhcnRpYWxOZXh0U3RhdGUgPSB7XG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgICBwYXJhbXM6IGNyZWF0ZVBhcmFtcyhwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcylcbiAgICB9O1xuXG4gICAgdmFyIHBhcnRpYWxOZXh0U3RhdGVXaXRoTG9jYXRpb24gPSAoMCwgX21ha2VTdGF0ZVdpdGhMb2NhdGlvbjIuZGVmYXVsdCkocGFydGlhbE5leHRTdGF0ZSwgbG9jYXRpb24pO1xuXG4gICAgcm91dGUuZ2V0SW5kZXhSb3V0ZShwYXJ0aWFsTmV4dFN0YXRlV2l0aExvY2F0aW9uLCBmdW5jdGlvbiAoZXJyb3IsIGluZGV4Um91dGUpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCAhZXJyb3IgJiYgKDAsIF9Sb3V0ZVV0aWxzLmNyZWF0ZVJvdXRlcykoaW5kZXhSb3V0ZSlbMF0pO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHJvdXRlLmNoaWxkUm91dGVzKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwYXRobGVzcyA9IHJvdXRlLmNoaWxkUm91dGVzLmZpbHRlcihmdW5jdGlvbiAoY2hpbGRSb3V0ZSkge1xuICAgICAgICByZXR1cm4gIWNoaWxkUm91dGUucGF0aDtcbiAgICAgIH0pO1xuXG4gICAgICAoMCwgX0FzeW5jVXRpbHMubG9vcEFzeW5jKShwYXRobGVzcy5sZW5ndGgsIGZ1bmN0aW9uIChpbmRleCwgbmV4dCwgZG9uZSkge1xuICAgICAgICBnZXRJbmRleFJvdXRlKHBhdGhsZXNzW2luZGV4XSwgbG9jYXRpb24sIHBhcmFtTmFtZXMsIHBhcmFtVmFsdWVzLCBmdW5jdGlvbiAoZXJyb3IsIGluZGV4Um91dGUpIHtcbiAgICAgICAgICBpZiAoZXJyb3IgfHwgaW5kZXhSb3V0ZSkge1xuICAgICAgICAgICAgdmFyIHJvdXRlcyA9IFtwYXRobGVzc1tpbmRleF1dLmNvbmNhdChBcnJheS5pc0FycmF5KGluZGV4Um91dGUpID8gaW5kZXhSb3V0ZSA6IFtpbmRleFJvdXRlXSk7XG4gICAgICAgICAgICBkb25lKGVycm9yLCByb3V0ZXMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIsIHJvdXRlcykge1xuICAgICAgICBjYWxsYmFjayhudWxsLCByb3V0ZXMpO1xuICAgICAgfSk7XG4gICAgfSkoKTtcbiAgfSBlbHNlIHtcbiAgICBjYWxsYmFjaygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2lnblBhcmFtcyhwYXJhbXMsIHBhcmFtTmFtZXMsIHBhcmFtVmFsdWVzKSB7XG4gIHJldHVybiBwYXJhbU5hbWVzLnJlZHVjZShmdW5jdGlvbiAocGFyYW1zLCBwYXJhbU5hbWUsIGluZGV4KSB7XG4gICAgdmFyIHBhcmFtVmFsdWUgPSBwYXJhbVZhbHVlcyAmJiBwYXJhbVZhbHVlc1tpbmRleF07XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJhbXNbcGFyYW1OYW1lXSkpIHtcbiAgICAgIHBhcmFtc1twYXJhbU5hbWVdLnB1c2gocGFyYW1WYWx1ZSk7XG4gICAgfSBlbHNlIGlmIChwYXJhbU5hbWUgaW4gcGFyYW1zKSB7XG4gICAgICBwYXJhbXNbcGFyYW1OYW1lXSA9IFtwYXJhbXNbcGFyYW1OYW1lXSwgcGFyYW1WYWx1ZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmFtc1twYXJhbU5hbWVdID0gcGFyYW1WYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYW1zO1xuICB9LCBwYXJhbXMpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQYXJhbXMocGFyYW1OYW1lcywgcGFyYW1WYWx1ZXMpIHtcbiAgcmV0dXJuIGFzc2lnblBhcmFtcyh7fSwgcGFyYW1OYW1lcywgcGFyYW1WYWx1ZXMpO1xufVxuXG5mdW5jdGlvbiBtYXRjaFJvdXRlRGVlcChyb3V0ZSwgbG9jYXRpb24sIHJlbWFpbmluZ1BhdGhuYW1lLCBwYXJhbU5hbWVzLCBwYXJhbVZhbHVlcywgY2FsbGJhY2spIHtcbiAgdmFyIHBhdHRlcm4gPSByb3V0ZS5wYXRoIHx8ICcnO1xuXG4gIGlmIChwYXR0ZXJuLmNoYXJBdCgwKSA9PT0gJy8nKSB7XG4gICAgcmVtYWluaW5nUGF0aG5hbWUgPSBsb2NhdGlvbi5wYXRobmFtZTtcbiAgICBwYXJhbU5hbWVzID0gW107XG4gICAgcGFyYW1WYWx1ZXMgPSBbXTtcbiAgfVxuXG4gIC8vIE9ubHkgdHJ5IHRvIG1hdGNoIHRoZSBwYXRoIGlmIHRoZSByb3V0ZSBhY3R1YWxseSBoYXMgYSBwYXR0ZXJuLCBhbmQgaWZcbiAgLy8gd2UncmUgbm90IGp1c3Qgc2VhcmNoaW5nIGZvciBwb3RlbnRpYWwgbmVzdGVkIGFic29sdXRlIHBhdGhzLlxuICBpZiAocmVtYWluaW5nUGF0aG5hbWUgIT09IG51bGwgJiYgcGF0dGVybikge1xuICAgIHRyeSB7XG4gICAgICB2YXIgbWF0Y2hlZCA9ICgwLCBfUGF0dGVyblV0aWxzLm1hdGNoUGF0dGVybikocGF0dGVybiwgcmVtYWluaW5nUGF0aG5hbWUpO1xuICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgcmVtYWluaW5nUGF0aG5hbWUgPSBtYXRjaGVkLnJlbWFpbmluZ1BhdGhuYW1lO1xuICAgICAgICBwYXJhbU5hbWVzID0gW10uY29uY2F0KHBhcmFtTmFtZXMsIG1hdGNoZWQucGFyYW1OYW1lcyk7XG4gICAgICAgIHBhcmFtVmFsdWVzID0gW10uY29uY2F0KHBhcmFtVmFsdWVzLCBtYXRjaGVkLnBhcmFtVmFsdWVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbWFpbmluZ1BhdGhuYW1lID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgIH1cblxuICAgIC8vIEJ5IGFzc3VtcHRpb24sIHBhdHRlcm4gaXMgbm9uLWVtcHR5IGhlcmUsIHdoaWNoIGlzIHRoZSBwcmVyZXF1aXNpdGUgZm9yXG4gICAgLy8gYWN0dWFsbHkgdGVybWluYXRpbmcgYSBtYXRjaC5cbiAgICBpZiAocmVtYWluaW5nUGF0aG5hbWUgPT09ICcnKSB7XG4gICAgICB2YXIgX3JldDIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHtcbiAgICAgICAgICByb3V0ZXM6IFtyb3V0ZV0sXG4gICAgICAgICAgcGFyYW1zOiBjcmVhdGVQYXJhbXMocGFyYW1OYW1lcywgcGFyYW1WYWx1ZXMpXG4gICAgICAgIH07XG5cbiAgICAgICAgZ2V0SW5kZXhSb3V0ZShyb3V0ZSwgbG9jYXRpb24sIHBhcmFtTmFtZXMsIHBhcmFtVmFsdWVzLCBmdW5jdGlvbiAoZXJyb3IsIGluZGV4Um91dGUpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW5kZXhSb3V0ZSkpIHtcbiAgICAgICAgICAgICAgdmFyIF9tYXRjaCRyb3V0ZXM7XG5cbiAgICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfcm91dGVyV2FybmluZzIuZGVmYXVsdCkoaW5kZXhSb3V0ZS5ldmVyeShmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIXJvdXRlLnBhdGg7XG4gICAgICAgICAgICAgIH0pLCAnSW5kZXggcm91dGVzIHNob3VsZCBub3QgaGF2ZSBwYXRocycpIDogdm9pZCAwO1xuICAgICAgICAgICAgICAoX21hdGNoJHJvdXRlcyA9IG1hdGNoLnJvdXRlcykucHVzaC5hcHBseShfbWF0Y2gkcm91dGVzLCBpbmRleFJvdXRlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXhSb3V0ZSkge1xuICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gKDAsIF9yb3V0ZXJXYXJuaW5nMi5kZWZhdWx0KSghaW5kZXhSb3V0ZS5wYXRoLCAnSW5kZXggcm91dGVzIHNob3VsZCBub3QgaGF2ZSBwYXRocycpIDogdm9pZCAwO1xuICAgICAgICAgICAgICBtYXRjaC5yb3V0ZXMucHVzaChpbmRleFJvdXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgbWF0Y2gpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2OiB2b2lkIDBcbiAgICAgICAgfTtcbiAgICAgIH0oKTtcblxuICAgICAgaWYgKCh0eXBlb2YgX3JldDIgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKF9yZXQyKSkgPT09IFwib2JqZWN0XCIpIHJldHVybiBfcmV0Mi52O1xuICAgIH1cbiAgfVxuXG4gIGlmIChyZW1haW5pbmdQYXRobmFtZSAhPSBudWxsIHx8IHJvdXRlLmNoaWxkUm91dGVzKSB7XG4gICAgLy8gRWl0aGVyIGEpIHRoaXMgcm91dGUgbWF0Y2hlZCBhdCBsZWFzdCBzb21lIG9mIHRoZSBwYXRoIG9yIGIpXG4gICAgLy8gd2UgZG9uJ3QgaGF2ZSB0byBsb2FkIHRoaXMgcm91dGUncyBjaGlsZHJlbiBhc3luY2hyb25vdXNseS4gSW5cbiAgICAvLyBlaXRoZXIgY2FzZSBjb250aW51ZSBjaGVja2luZyBmb3IgbWF0Y2hlcyBpbiB0aGUgc3VidHJlZS5cbiAgICB2YXIgb25DaGlsZFJvdXRlcyA9IGZ1bmN0aW9uIG9uQ2hpbGRSb3V0ZXMoZXJyb3IsIGNoaWxkUm91dGVzKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgICAgfSBlbHNlIGlmIChjaGlsZFJvdXRlcykge1xuICAgICAgICAvLyBDaGVjayB0aGUgY2hpbGQgcm91dGVzIHRvIHNlZSBpZiBhbnkgb2YgdGhlbSBtYXRjaC5cbiAgICAgICAgbWF0Y2hSb3V0ZXMoY2hpbGRSb3V0ZXMsIGxvY2F0aW9uLCBmdW5jdGlvbiAoZXJyb3IsIG1hdGNoKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgICAgfSBlbHNlIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgLy8gQSBjaGlsZCByb3V0ZSBtYXRjaGVkISBBdWdtZW50IHRoZSBtYXRjaCBhbmQgcGFzcyBpdCB1cCB0aGUgc3RhY2suXG4gICAgICAgICAgICBtYXRjaC5yb3V0ZXMudW5zaGlmdChyb3V0ZSk7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBtYXRjaCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCByZW1haW5pbmdQYXRobmFtZSwgcGFyYW1OYW1lcywgcGFyYW1WYWx1ZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHJlc3VsdCA9IGdldENoaWxkUm91dGVzKHJvdXRlLCBsb2NhdGlvbiwgcGFyYW1OYW1lcywgcGFyYW1WYWx1ZXMsIG9uQ2hpbGRSb3V0ZXMpO1xuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIG9uQ2hpbGRSb3V0ZXMuYXBwbHkodW5kZWZpbmVkLCByZXN1bHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjYWxsYmFjaygpO1xuICB9XG59XG5cbi8qKlxuICogQXN5bmNocm9ub3VzbHkgbWF0Y2hlcyB0aGUgZ2l2ZW4gbG9jYXRpb24gdG8gYSBzZXQgb2Ygcm91dGVzIGFuZCBjYWxsc1xuICogY2FsbGJhY2soZXJyb3IsIHN0YXRlKSB3aGVuIGZpbmlzaGVkLiBUaGUgc3RhdGUgb2JqZWN0IHdpbGwgaGF2ZSB0aGVcbiAqIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqIC0gcm91dGVzICAgICAgIEFuIGFycmF5IG9mIHJvdXRlcyB0aGF0IG1hdGNoZWQsIGluIGhpZXJhcmNoaWNhbCBvcmRlclxuICogLSBwYXJhbXMgICAgICAgQW4gb2JqZWN0IG9mIFVSTCBwYXJhbWV0ZXJzXG4gKlxuICogTm90ZTogVGhpcyBvcGVyYXRpb24gbWF5IGZpbmlzaCBzeW5jaHJvbm91c2x5IGlmIG5vIHJvdXRlcyBoYXZlIGFuXG4gKiBhc3luY2hyb25vdXMgZ2V0Q2hpbGRSb3V0ZXMgbWV0aG9kLlxuICovXG5mdW5jdGlvbiBtYXRjaFJvdXRlcyhyb3V0ZXMsIGxvY2F0aW9uLCBjYWxsYmFjaywgcmVtYWluaW5nUGF0aG5hbWUpIHtcbiAgdmFyIHBhcmFtTmFtZXMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDQgfHwgYXJndW1lbnRzWzRdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1s0XTtcbiAgdmFyIHBhcmFtVmFsdWVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSA1IHx8IGFyZ3VtZW50c1s1XSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbNV07XG5cbiAgaWYgKHJlbWFpbmluZ1BhdGhuYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyBUT0RPOiBUaGlzIGlzIGEgbGl0dGxlIGJpdCB1Z2x5LCBidXQgaXQgd29ya3MgYXJvdW5kIGEgcXVpcmsgaW4gaGlzdG9yeVxuICAgIC8vIHRoYXQgc3RyaXBzIHRoZSBsZWFkaW5nIHNsYXNoIGZyb20gcGF0aG5hbWVzIHdoZW4gdXNpbmcgYmFzZW5hbWVzIHdpdGhcbiAgICAvLyB0cmFpbGluZyBzbGFzaGVzLlxuICAgIGlmIChsb2NhdGlvbi5wYXRobmFtZS5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgbG9jYXRpb24gPSBfZXh0ZW5kcyh7fSwgbG9jYXRpb24sIHtcbiAgICAgICAgcGF0aG5hbWU6ICcvJyArIGxvY2F0aW9uLnBhdGhuYW1lXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVtYWluaW5nUGF0aG5hbWUgPSBsb2NhdGlvbi5wYXRobmFtZTtcbiAgfVxuXG4gICgwLCBfQXN5bmNVdGlscy5sb29wQXN5bmMpKHJvdXRlcy5sZW5ndGgsIGZ1bmN0aW9uIChpbmRleCwgbmV4dCwgZG9uZSkge1xuICAgIG1hdGNoUm91dGVEZWVwKHJvdXRlc1tpbmRleF0sIGxvY2F0aW9uLCByZW1haW5pbmdQYXRobmFtZSwgcGFyYW1OYW1lcywgcGFyYW1WYWx1ZXMsIGZ1bmN0aW9uIChlcnJvciwgbWF0Y2gpIHtcbiAgICAgIGlmIChlcnJvciB8fCBtYXRjaCkge1xuICAgICAgICBkb25lKGVycm9yLCBtYXRjaCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sIGNhbGxiYWNrKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyJdfQ==