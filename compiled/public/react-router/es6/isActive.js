"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = isActive;

var _PatternUtils = require("./PatternUtils");

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

function deepEqual(a, b) {
  if (a == b) return true;

  if (a == null || b == null) return false;

  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
      return deepEqual(item, b[index]);
    });
  }

  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object') {
    for (var p in a) {
      if (!Object.prototype.hasOwnProperty.call(a, p)) {
        continue;
      }

      if (a[p] === undefined) {
        if (b[p] !== undefined) {
          return false;
        }
      } else if (!Object.prototype.hasOwnProperty.call(b, p)) {
        return false;
      } else if (!deepEqual(a[p], b[p])) {
        return false;
      }
    }

    return true;
  }

  return String(a) === String(b);
}

/**
 * Returns true if the current pathname matches the supplied one, net of
 * leading and trailing slash normalization. This is sufficient for an
 * indexOnly route match.
 */
function pathIsActive(pathname, currentPathname) {
  // Normalize leading slash for consistency. Leading slash on pathname has
  // already been normalized in isActive. See caveat there.
  if (currentPathname.charAt(0) !== '/') {
    currentPathname = '/' + currentPathname;
  }

  // Normalize the end of both path names too. Maybe `/foo/` shouldn't show
  // `/foo` as active, but in this case, we would already have failed the
  // match.
  if (pathname.charAt(pathname.length - 1) !== '/') {
    pathname += '/';
  }
  if (currentPathname.charAt(currentPathname.length - 1) !== '/') {
    currentPathname += '/';
  }

  return currentPathname === pathname;
}

/**
 * Returns true if the given pathname matches the active routes and params.
 */
function routeIsActive(pathname, routes, params) {
  var remainingPathname = pathname,
      paramNames = [],
      paramValues = [];

  // for...of would work here but it's probably slower post-transpilation.
  for (var i = 0, len = routes.length; i < len; ++i) {
    var route = routes[i];
    var pattern = route.path || '';

    if (pattern.charAt(0) === '/') {
      remainingPathname = pathname;
      paramNames = [];
      paramValues = [];
    }

    if (remainingPathname !== null && pattern) {
      var matched = (0, _PatternUtils.matchPattern)(pattern, remainingPathname);
      if (matched) {
        remainingPathname = matched.remainingPathname;
        paramNames = [].concat(paramNames, matched.paramNames);
        paramValues = [].concat(paramValues, matched.paramValues);
      } else {
        remainingPathname = null;
      }

      if (remainingPathname === '') {
        // We have an exact match on the route. Just check that all the params
        // match.
        // FIXME: This doesn't work on repeated params.
        return paramNames.every(function (paramName, index) {
          return String(paramValues[index]) === String(params[paramName]);
        });
      }
    }
  }

  return false;
}

/**
 * Returns true if all key/value pairs in the given query are
 * currently active.
 */
function queryIsActive(query, activeQuery) {
  if (activeQuery == null) return query == null;

  if (query == null) return true;

  return deepEqual(query, activeQuery);
}

/**
 * Returns true if a <Link> to the given pathname/query combination is
 * currently active.
 */
function isActive(_ref, indexOnly, currentLocation, routes, params) {
  var pathname = _ref.pathname;
  var query = _ref.query;

  if (currentLocation == null) return false;

  // TODO: This is a bit ugly. It keeps around support for treating pathnames
  // without preceding slashes as absolute paths, but possibly also works
  // around the same quirks with basenames as in matchRoutes.
  if (pathname.charAt(0) !== '/') {
    pathname = '/' + pathname;
  }

  if (!pathIsActive(pathname, currentLocation.pathname)) {
    // The path check is necessary and sufficient for indexOnly, but otherwise
    // we still need to check the routes.
    if (indexOnly || !routeIsActive(pathname, routes, params)) {
      return false;
    }
  }

  return queryIsActive(query, currentLocation.query);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L2lzQWN0aXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2tCQTBId0IsUTs7QUF4SHhCOztBQUZBLElBQUksVUFBVSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsU0FBTyxPQUFPLFFBQWQsTUFBMkIsUUFBM0QsR0FBc0UsVUFBVSxHQUFWLEVBQWU7QUFBRSxnQkFBYyxHQUFkLDBDQUFjLEdBQWQ7QUFBb0IsQ0FBM0csR0FBOEcsVUFBVSxHQUFWLEVBQWU7QUFBRSxTQUFPLE9BQU8sT0FBTyxNQUFQLEtBQWtCLFVBQXpCLElBQXVDLElBQUksV0FBSixLQUFvQixNQUEzRCxHQUFvRSxRQUFwRSxVQUFzRixHQUF0RiwwQ0FBc0YsR0FBdEYsQ0FBUDtBQUFtRyxDQUFoUDs7QUFJQSxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUI7QUFDdkIsTUFBSSxLQUFLLENBQVQsRUFBWSxPQUFPLElBQVA7O0FBRVosTUFBSSxLQUFLLElBQUwsSUFBYSxLQUFLLElBQXRCLEVBQTRCLE9BQU8sS0FBUDs7QUFFNUIsTUFBSSxNQUFNLE9BQU4sQ0FBYyxDQUFkLENBQUosRUFBc0I7QUFDcEIsV0FBTyxNQUFNLE9BQU4sQ0FBYyxDQUFkLEtBQW9CLEVBQUUsTUFBRixLQUFhLEVBQUUsTUFBbkMsSUFBNkMsRUFBRSxLQUFGLENBQVEsVUFBVSxJQUFWLEVBQWdCLEtBQWhCLEVBQXVCO0FBQ2pGLGFBQU8sVUFBVSxJQUFWLEVBQWdCLEVBQUUsS0FBRixDQUFoQixDQUFQO0FBQ0QsS0FGbUQsQ0FBcEQ7QUFHRDs7QUFFRCxNQUFJLENBQUMsT0FBTyxDQUFQLEtBQWEsV0FBYixHQUEyQixXQUEzQixHQUF5QyxRQUFRLENBQVIsQ0FBMUMsTUFBMEQsUUFBOUQsRUFBd0U7QUFDdEUsU0FBSyxJQUFJLENBQVQsSUFBYyxDQUFkLEVBQWlCO0FBQ2YsVUFBSSxDQUFDLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxDQUFyQyxFQUF3QyxDQUF4QyxDQUFMLEVBQWlEO0FBQy9DO0FBQ0Q7O0FBRUQsVUFBSSxFQUFFLENBQUYsTUFBUyxTQUFiLEVBQXdCO0FBQ3RCLFlBQUksRUFBRSxDQUFGLE1BQVMsU0FBYixFQUF3QjtBQUN0QixpQkFBTyxLQUFQO0FBQ0Q7QUFDRixPQUpELE1BSU8sSUFBSSxDQUFDLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxDQUFyQyxFQUF3QyxDQUF4QyxDQUFMLEVBQWlEO0FBQ3RELGVBQU8sS0FBUDtBQUNELE9BRk0sTUFFQSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUYsQ0FBVixFQUFnQixFQUFFLENBQUYsQ0FBaEIsQ0FBTCxFQUE0QjtBQUNqQyxlQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVELFdBQU8sSUFBUDtBQUNEOztBQUVELFNBQU8sT0FBTyxDQUFQLE1BQWMsT0FBTyxDQUFQLENBQXJCO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsU0FBUyxZQUFULENBQXNCLFFBQXRCLEVBQWdDLGVBQWhDLEVBQWlEO0FBQy9DO0FBQ0E7QUFDQSxNQUFJLGdCQUFnQixNQUFoQixDQUF1QixDQUF2QixNQUE4QixHQUFsQyxFQUF1QztBQUNyQyxzQkFBa0IsTUFBTSxlQUF4QjtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBLE1BQUksU0FBUyxNQUFULENBQWdCLFNBQVMsTUFBVCxHQUFrQixDQUFsQyxNQUF5QyxHQUE3QyxFQUFrRDtBQUNoRCxnQkFBWSxHQUFaO0FBQ0Q7QUFDRCxNQUFJLGdCQUFnQixNQUFoQixDQUF1QixnQkFBZ0IsTUFBaEIsR0FBeUIsQ0FBaEQsTUFBdUQsR0FBM0QsRUFBZ0U7QUFDOUQsdUJBQW1CLEdBQW5CO0FBQ0Q7O0FBRUQsU0FBTyxvQkFBb0IsUUFBM0I7QUFDRDs7QUFFRDs7O0FBR0EsU0FBUyxhQUFULENBQXVCLFFBQXZCLEVBQWlDLE1BQWpDLEVBQXlDLE1BQXpDLEVBQWlEO0FBQy9DLE1BQUksb0JBQW9CLFFBQXhCO0FBQUEsTUFDSSxhQUFhLEVBRGpCO0FBQUEsTUFFSSxjQUFjLEVBRmxCOztBQUlBO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLE1BQU0sT0FBTyxNQUE3QixFQUFxQyxJQUFJLEdBQXpDLEVBQThDLEVBQUUsQ0FBaEQsRUFBbUQ7QUFDakQsUUFBSSxRQUFRLE9BQU8sQ0FBUCxDQUFaO0FBQ0EsUUFBSSxVQUFVLE1BQU0sSUFBTixJQUFjLEVBQTVCOztBQUVBLFFBQUksUUFBUSxNQUFSLENBQWUsQ0FBZixNQUFzQixHQUExQixFQUErQjtBQUM3QiwwQkFBb0IsUUFBcEI7QUFDQSxtQkFBYSxFQUFiO0FBQ0Esb0JBQWMsRUFBZDtBQUNEOztBQUVELFFBQUksc0JBQXNCLElBQXRCLElBQThCLE9BQWxDLEVBQTJDO0FBQ3pDLFVBQUksVUFBVSxnQ0FBYSxPQUFiLEVBQXNCLGlCQUF0QixDQUFkO0FBQ0EsVUFBSSxPQUFKLEVBQWE7QUFDWCw0QkFBb0IsUUFBUSxpQkFBNUI7QUFDQSxxQkFBYSxHQUFHLE1BQUgsQ0FBVSxVQUFWLEVBQXNCLFFBQVEsVUFBOUIsQ0FBYjtBQUNBLHNCQUFjLEdBQUcsTUFBSCxDQUFVLFdBQVYsRUFBdUIsUUFBUSxXQUEvQixDQUFkO0FBQ0QsT0FKRCxNQUlPO0FBQ0wsNEJBQW9CLElBQXBCO0FBQ0Q7O0FBRUQsVUFBSSxzQkFBc0IsRUFBMUIsRUFBOEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsZUFBTyxXQUFXLEtBQVgsQ0FBaUIsVUFBVSxTQUFWLEVBQXFCLEtBQXJCLEVBQTRCO0FBQ2xELGlCQUFPLE9BQU8sWUFBWSxLQUFaLENBQVAsTUFBK0IsT0FBTyxPQUFPLFNBQVAsQ0FBUCxDQUF0QztBQUNELFNBRk0sQ0FBUDtBQUdEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPLEtBQVA7QUFDRDs7QUFFRDs7OztBQUlBLFNBQVMsYUFBVCxDQUF1QixLQUF2QixFQUE4QixXQUE5QixFQUEyQztBQUN6QyxNQUFJLGVBQWUsSUFBbkIsRUFBeUIsT0FBTyxTQUFTLElBQWhCOztBQUV6QixNQUFJLFNBQVMsSUFBYixFQUFtQixPQUFPLElBQVA7O0FBRW5CLFNBQU8sVUFBVSxLQUFWLEVBQWlCLFdBQWpCLENBQVA7QUFDRDs7QUFFRDs7OztBQUllLFNBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF3QixTQUF4QixFQUFtQyxlQUFuQyxFQUFvRCxNQUFwRCxFQUE0RCxNQUE1RCxFQUFvRTtBQUNqRixNQUFJLFdBQVcsS0FBSyxRQUFwQjtBQUNBLE1BQUksUUFBUSxLQUFLLEtBQWpCOztBQUVBLE1BQUksbUJBQW1CLElBQXZCLEVBQTZCLE9BQU8sS0FBUDs7QUFFN0I7QUFDQTtBQUNBO0FBQ0EsTUFBSSxTQUFTLE1BQVQsQ0FBZ0IsQ0FBaEIsTUFBdUIsR0FBM0IsRUFBZ0M7QUFDOUIsZUFBVyxNQUFNLFFBQWpCO0FBQ0Q7O0FBRUQsTUFBSSxDQUFDLGFBQWEsUUFBYixFQUF1QixnQkFBZ0IsUUFBdkMsQ0FBTCxFQUF1RDtBQUNyRDtBQUNBO0FBQ0EsUUFBSSxhQUFhLENBQUMsY0FBYyxRQUFkLEVBQXdCLE1BQXhCLEVBQWdDLE1BQWhDLENBQWxCLEVBQTJEO0FBQ3pELGFBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRUQsU0FBTyxjQUFjLEtBQWQsRUFBcUIsZ0JBQWdCLEtBQXJDLENBQVA7QUFDRCIsImZpbGUiOiJpc0FjdGl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5pbXBvcnQgeyBtYXRjaFBhdHRlcm4gfSBmcm9tICcuL1BhdHRlcm5VdGlscyc7XG5cbmZ1bmN0aW9uIGRlZXBFcXVhbChhLCBiKSB7XG4gIGlmIChhID09IGIpIHJldHVybiB0cnVlO1xuXG4gIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoYSkpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShiKSAmJiBhLmxlbmd0aCA9PT0gYi5sZW5ndGggJiYgYS5ldmVyeShmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBkZWVwRXF1YWwoaXRlbSwgYltpbmRleF0pO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKCh0eXBlb2YgYSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoYSkpID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIHAgaW4gYSkge1xuICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSwgcCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChhW3BdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGJbcF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoIWRlZXBFcXVhbChhW3BdLCBiW3BdKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gU3RyaW5nKGEpID09PSBTdHJpbmcoYik7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBjdXJyZW50IHBhdGhuYW1lIG1hdGNoZXMgdGhlIHN1cHBsaWVkIG9uZSwgbmV0IG9mXG4gKiBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaCBub3JtYWxpemF0aW9uLiBUaGlzIGlzIHN1ZmZpY2llbnQgZm9yIGFuXG4gKiBpbmRleE9ubHkgcm91dGUgbWF0Y2guXG4gKi9cbmZ1bmN0aW9uIHBhdGhJc0FjdGl2ZShwYXRobmFtZSwgY3VycmVudFBhdGhuYW1lKSB7XG4gIC8vIE5vcm1hbGl6ZSBsZWFkaW5nIHNsYXNoIGZvciBjb25zaXN0ZW5jeS4gTGVhZGluZyBzbGFzaCBvbiBwYXRobmFtZSBoYXNcbiAgLy8gYWxyZWFkeSBiZWVuIG5vcm1hbGl6ZWQgaW4gaXNBY3RpdmUuIFNlZSBjYXZlYXQgdGhlcmUuXG4gIGlmIChjdXJyZW50UGF0aG5hbWUuY2hhckF0KDApICE9PSAnLycpIHtcbiAgICBjdXJyZW50UGF0aG5hbWUgPSAnLycgKyBjdXJyZW50UGF0aG5hbWU7XG4gIH1cblxuICAvLyBOb3JtYWxpemUgdGhlIGVuZCBvZiBib3RoIHBhdGggbmFtZXMgdG9vLiBNYXliZSBgL2Zvby9gIHNob3VsZG4ndCBzaG93XG4gIC8vIGAvZm9vYCBhcyBhY3RpdmUsIGJ1dCBpbiB0aGlzIGNhc2UsIHdlIHdvdWxkIGFscmVhZHkgaGF2ZSBmYWlsZWQgdGhlXG4gIC8vIG1hdGNoLlxuICBpZiAocGF0aG5hbWUuY2hhckF0KHBhdGhuYW1lLmxlbmd0aCAtIDEpICE9PSAnLycpIHtcbiAgICBwYXRobmFtZSArPSAnLyc7XG4gIH1cbiAgaWYgKGN1cnJlbnRQYXRobmFtZS5jaGFyQXQoY3VycmVudFBhdGhuYW1lLmxlbmd0aCAtIDEpICE9PSAnLycpIHtcbiAgICBjdXJyZW50UGF0aG5hbWUgKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnRQYXRobmFtZSA9PT0gcGF0aG5hbWU7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBwYXRobmFtZSBtYXRjaGVzIHRoZSBhY3RpdmUgcm91dGVzIGFuZCBwYXJhbXMuXG4gKi9cbmZ1bmN0aW9uIHJvdXRlSXNBY3RpdmUocGF0aG5hbWUsIHJvdXRlcywgcGFyYW1zKSB7XG4gIHZhciByZW1haW5pbmdQYXRobmFtZSA9IHBhdGhuYW1lLFxuICAgICAgcGFyYW1OYW1lcyA9IFtdLFxuICAgICAgcGFyYW1WYWx1ZXMgPSBbXTtcblxuICAvLyBmb3IuLi5vZiB3b3VsZCB3b3JrIGhlcmUgYnV0IGl0J3MgcHJvYmFibHkgc2xvd2VyIHBvc3QtdHJhbnNwaWxhdGlvbi5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJvdXRlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIHZhciByb3V0ZSA9IHJvdXRlc1tpXTtcbiAgICB2YXIgcGF0dGVybiA9IHJvdXRlLnBhdGggfHwgJyc7XG5cbiAgICBpZiAocGF0dGVybi5jaGFyQXQoMCkgPT09ICcvJykge1xuICAgICAgcmVtYWluaW5nUGF0aG5hbWUgPSBwYXRobmFtZTtcbiAgICAgIHBhcmFtTmFtZXMgPSBbXTtcbiAgICAgIHBhcmFtVmFsdWVzID0gW107XG4gICAgfVxuXG4gICAgaWYgKHJlbWFpbmluZ1BhdGhuYW1lICE9PSBudWxsICYmIHBhdHRlcm4pIHtcbiAgICAgIHZhciBtYXRjaGVkID0gbWF0Y2hQYXR0ZXJuKHBhdHRlcm4sIHJlbWFpbmluZ1BhdGhuYW1lKTtcbiAgICAgIGlmIChtYXRjaGVkKSB7XG4gICAgICAgIHJlbWFpbmluZ1BhdGhuYW1lID0gbWF0Y2hlZC5yZW1haW5pbmdQYXRobmFtZTtcbiAgICAgICAgcGFyYW1OYW1lcyA9IFtdLmNvbmNhdChwYXJhbU5hbWVzLCBtYXRjaGVkLnBhcmFtTmFtZXMpO1xuICAgICAgICBwYXJhbVZhbHVlcyA9IFtdLmNvbmNhdChwYXJhbVZhbHVlcywgbWF0Y2hlZC5wYXJhbVZhbHVlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdQYXRobmFtZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZW1haW5pbmdQYXRobmFtZSA9PT0gJycpIHtcbiAgICAgICAgLy8gV2UgaGF2ZSBhbiBleGFjdCBtYXRjaCBvbiB0aGUgcm91dGUuIEp1c3QgY2hlY2sgdGhhdCBhbGwgdGhlIHBhcmFtc1xuICAgICAgICAvLyBtYXRjaC5cbiAgICAgICAgLy8gRklYTUU6IFRoaXMgZG9lc24ndCB3b3JrIG9uIHJlcGVhdGVkIHBhcmFtcy5cbiAgICAgICAgcmV0dXJuIHBhcmFtTmFtZXMuZXZlcnkoZnVuY3Rpb24gKHBhcmFtTmFtZSwgaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKHBhcmFtVmFsdWVzW2luZGV4XSkgPT09IFN0cmluZyhwYXJhbXNbcGFyYW1OYW1lXSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYWxsIGtleS92YWx1ZSBwYWlycyBpbiB0aGUgZ2l2ZW4gcXVlcnkgYXJlXG4gKiBjdXJyZW50bHkgYWN0aXZlLlxuICovXG5mdW5jdGlvbiBxdWVyeUlzQWN0aXZlKHF1ZXJ5LCBhY3RpdmVRdWVyeSkge1xuICBpZiAoYWN0aXZlUXVlcnkgPT0gbnVsbCkgcmV0dXJuIHF1ZXJ5ID09IG51bGw7XG5cbiAgaWYgKHF1ZXJ5ID09IG51bGwpIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBkZWVwRXF1YWwocXVlcnksIGFjdGl2ZVF1ZXJ5KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSA8TGluaz4gdG8gdGhlIGdpdmVuIHBhdGhuYW1lL3F1ZXJ5IGNvbWJpbmF0aW9uIGlzXG4gKiBjdXJyZW50bHkgYWN0aXZlLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0FjdGl2ZShfcmVmLCBpbmRleE9ubHksIGN1cnJlbnRMb2NhdGlvbiwgcm91dGVzLCBwYXJhbXMpIHtcbiAgdmFyIHBhdGhuYW1lID0gX3JlZi5wYXRobmFtZTtcbiAgdmFyIHF1ZXJ5ID0gX3JlZi5xdWVyeTtcblxuICBpZiAoY3VycmVudExvY2F0aW9uID09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICAvLyBUT0RPOiBUaGlzIGlzIGEgYml0IHVnbHkuIEl0IGtlZXBzIGFyb3VuZCBzdXBwb3J0IGZvciB0cmVhdGluZyBwYXRobmFtZXNcbiAgLy8gd2l0aG91dCBwcmVjZWRpbmcgc2xhc2hlcyBhcyBhYnNvbHV0ZSBwYXRocywgYnV0IHBvc3NpYmx5IGFsc28gd29ya3NcbiAgLy8gYXJvdW5kIHRoZSBzYW1lIHF1aXJrcyB3aXRoIGJhc2VuYW1lcyBhcyBpbiBtYXRjaFJvdXRlcy5cbiAgaWYgKHBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgcGF0aG5hbWUgPSAnLycgKyBwYXRobmFtZTtcbiAgfVxuXG4gIGlmICghcGF0aElzQWN0aXZlKHBhdGhuYW1lLCBjdXJyZW50TG9jYXRpb24ucGF0aG5hbWUpKSB7XG4gICAgLy8gVGhlIHBhdGggY2hlY2sgaXMgbmVjZXNzYXJ5IGFuZCBzdWZmaWNpZW50IGZvciBpbmRleE9ubHksIGJ1dCBvdGhlcndpc2VcbiAgICAvLyB3ZSBzdGlsbCBuZWVkIHRvIGNoZWNrIHRoZSByb3V0ZXMuXG4gICAgaWYgKGluZGV4T25seSB8fCAhcm91dGVJc0FjdGl2ZShwYXRobmFtZSwgcm91dGVzLCBwYXJhbXMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5SXNBY3RpdmUocXVlcnksIGN1cnJlbnRMb2NhdGlvbi5xdWVyeSk7XG59Il19