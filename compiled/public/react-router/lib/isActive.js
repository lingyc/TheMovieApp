'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

exports.default = isActive;

var _PatternUtils = require('./PatternUtils');

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
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvbGliL2lzQWN0aXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBRUEsUUFBUSxVQUFSLEdBQXFCLElBQXJCOztBQUVBLElBQUksVUFBVSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsU0FBTyxPQUFPLFFBQWQsTUFBMkIsUUFBM0QsR0FBc0UsVUFBVSxHQUFWLEVBQWU7QUFBRSxnQkFBYyxHQUFkLDBDQUFjLEdBQWQ7QUFBb0IsQ0FBM0csR0FBOEcsVUFBVSxHQUFWLEVBQWU7QUFBRSxTQUFPLE9BQU8sT0FBTyxNQUFQLEtBQWtCLFVBQXpCLElBQXVDLElBQUksV0FBSixLQUFvQixNQUEzRCxHQUFvRSxRQUFwRSxVQUFzRixHQUF0RiwwQ0FBc0YsR0FBdEYsQ0FBUDtBQUFtRyxDQUFoUDs7QUFFQSxRQUFRLE9BQVIsR0FBa0IsUUFBbEI7O0FBRUEsSUFBSSxnQkFBZ0IsUUFBUSxnQkFBUixDQUFwQjs7QUFFQSxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUI7QUFDdkIsTUFBSSxLQUFLLENBQVQsRUFBWSxPQUFPLElBQVA7O0FBRVosTUFBSSxLQUFLLElBQUwsSUFBYSxLQUFLLElBQXRCLEVBQTRCLE9BQU8sS0FBUDs7QUFFNUIsTUFBSSxNQUFNLE9BQU4sQ0FBYyxDQUFkLENBQUosRUFBc0I7QUFDcEIsV0FBTyxNQUFNLE9BQU4sQ0FBYyxDQUFkLEtBQW9CLEVBQUUsTUFBRixLQUFhLEVBQUUsTUFBbkMsSUFBNkMsRUFBRSxLQUFGLENBQVEsVUFBVSxJQUFWLEVBQWdCLEtBQWhCLEVBQXVCO0FBQ2pGLGFBQU8sVUFBVSxJQUFWLEVBQWdCLEVBQUUsS0FBRixDQUFoQixDQUFQO0FBQ0QsS0FGbUQsQ0FBcEQ7QUFHRDs7QUFFRCxNQUFJLENBQUMsT0FBTyxDQUFQLEtBQWEsV0FBYixHQUEyQixXQUEzQixHQUF5QyxRQUFRLENBQVIsQ0FBMUMsTUFB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QUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEIsV0FBOUIsRUFBMkM7QUFDekMsTUFBSSxlQUFlLElBQW5CLEVBQXlCLE9BQU8sU0FBUyxJQUFoQjs7QUFFekIsTUFBSSxTQUFTLElBQWIsRUFBbUIsT0FBTyxJQUFQOztBQUVuQixTQUFPLFVBQVUsS0FBVixFQUFpQixXQUFqQixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQSxTQUFTLFFBQVQsQ0FBa0IsSUFBbEIsRUFBd0IsU0FBeEIsRUFBbUMsZUFBbkMsRUFBb0QsTUFBcEQsRUFBNEQsTUFBNUQsRUFBb0U7QUFDbEUsTUFBSSxXQUFXLEtBQUssUUFBcEI7QUFDQSxNQUFJLFFBQVEsS0FBSyxLQUFqQjs7QUFFQSxNQUFJLG1CQUFtQixJQUF2QixFQUE2QixPQUFPLEtBQVA7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBLE1BQUksU0FBUyxNQUFULENBQWdCLENBQWhCLE1BQXVCLEdBQTNCLEVBQWdDO0FBQzlCLGVBQVcsTUFBTSxRQUFqQjtBQUNEOztBQUVELE1BQUksQ0FBQyxhQUFhLFFBQWIsRUFBdUIsZ0JBQWdCLFFBQXZDLENBQUwsRUFBdUQ7QUFDckQ7QUFDQTtBQUNBLFFBQUksYUFBYSxDQUFDLGNBQWMsUUFBZCxFQUF3QixNQUF4QixFQUFnQyxNQUFoQyxDQUFsQixFQUEyRDtBQUN6RCxhQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVELFNBQU8sY0FBYyxLQUFkLEVBQXFCLGdCQUFnQixLQUFyQyxDQUFQO0FBQ0Q7QUFDRCxPQUFPLE9BQVAsR0FBaUIsUUFBUSxTQUFSLENBQWpCIiwiZmlsZSI6ImlzQWN0aXZlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gaXNBY3RpdmU7XG5cbnZhciBfUGF0dGVyblV0aWxzID0gcmVxdWlyZSgnLi9QYXR0ZXJuVXRpbHMnKTtcblxuZnVuY3Rpb24gZGVlcEVxdWFsKGEsIGIpIHtcbiAgaWYgKGEgPT0gYikgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICBpZiAoQXJyYXkuaXNBcnJheShhKSkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGIpICYmIGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJiBhLmV2ZXJ5KGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgcmV0dXJuIGRlZXBFcXVhbChpdGVtLCBiW2luZGV4XSk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAoKHR5cGVvZiBhID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihhKSkgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIgcCBpbiBhKSB7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhLCBwKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFbcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoYltwXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICghZGVlcEVxdWFsKGFbcF0sIGJbcF0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBTdHJpbmcoYSkgPT09IFN0cmluZyhiKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGN1cnJlbnQgcGF0aG5hbWUgbWF0Y2hlcyB0aGUgc3VwcGxpZWQgb25lLCBuZXQgb2ZcbiAqIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoIG5vcm1hbGl6YXRpb24uIFRoaXMgaXMgc3VmZmljaWVudCBmb3IgYW5cbiAqIGluZGV4T25seSByb3V0ZSBtYXRjaC5cbiAqL1xuZnVuY3Rpb24gcGF0aElzQWN0aXZlKHBhdGhuYW1lLCBjdXJyZW50UGF0aG5hbWUpIHtcbiAgLy8gTm9ybWFsaXplIGxlYWRpbmcgc2xhc2ggZm9yIGNvbnNpc3RlbmN5LiBMZWFkaW5nIHNsYXNoIG9uIHBhdGhuYW1lIGhhc1xuICAvLyBhbHJlYWR5IGJlZW4gbm9ybWFsaXplZCBpbiBpc0FjdGl2ZS4gU2VlIGNhdmVhdCB0aGVyZS5cbiAgaWYgKGN1cnJlbnRQYXRobmFtZS5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgIGN1cnJlbnRQYXRobmFtZSA9ICcvJyArIGN1cnJlbnRQYXRobmFtZTtcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgZW5kIG9mIGJvdGggcGF0aCBuYW1lcyB0b28uIE1heWJlIGAvZm9vL2Agc2hvdWxkbid0IHNob3dcbiAgLy8gYC9mb29gIGFzIGFjdGl2ZSwgYnV0IGluIHRoaXMgY2FzZSwgd2Ugd291bGQgYWxyZWFkeSBoYXZlIGZhaWxlZCB0aGVcbiAgLy8gbWF0Y2guXG4gIGlmIChwYXRobmFtZS5jaGFyQXQocGF0aG5hbWUubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgIHBhdGhuYW1lICs9ICcvJztcbiAgfVxuICBpZiAoY3VycmVudFBhdGhuYW1lLmNoYXJBdChjdXJyZW50UGF0aG5hbWUubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgIGN1cnJlbnRQYXRobmFtZSArPSAnLyc7XG4gIH1cblxuICByZXR1cm4gY3VycmVudFBhdGhuYW1lID09PSBwYXRobmFtZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIHBhdGhuYW1lIG1hdGNoZXMgdGhlIGFjdGl2ZSByb3V0ZXMgYW5kIHBhcmFtcy5cbiAqL1xuZnVuY3Rpb24gcm91dGVJc0FjdGl2ZShwYXRobmFtZSwgcm91dGVzLCBwYXJhbXMpIHtcbiAgdmFyIHJlbWFpbmluZ1BhdGhuYW1lID0gcGF0aG5hbWUsXG4gICAgICBwYXJhbU5hbWVzID0gW10sXG4gICAgICBwYXJhbVZhbHVlcyA9IFtdO1xuXG4gIC8vIGZvci4uLm9mIHdvdWxkIHdvcmsgaGVyZSBidXQgaXQncyBwcm9iYWJseSBzbG93ZXIgcG9zdC10cmFuc3BpbGF0aW9uLlxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcm91dGVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHJvdXRlID0gcm91dGVzW2ldO1xuICAgIHZhciBwYXR0ZXJuID0gcm91dGUucGF0aCB8fCAnJztcblxuICAgIGlmIChwYXR0ZXJuLmNoYXJBdCgwKSA9PT0gJy8nKSB7XG4gICAgICByZW1haW5pbmdQYXRobmFtZSA9IHBhdGhuYW1lO1xuICAgICAgcGFyYW1OYW1lcyA9IFtdO1xuICAgICAgcGFyYW1WYWx1ZXMgPSBbXTtcbiAgICB9XG5cbiAgICBpZiAocmVtYWluaW5nUGF0aG5hbWUgIT09IG51bGwgJiYgcGF0dGVybikge1xuICAgICAgdmFyIG1hdGNoZWQgPSAoMCwgX1BhdHRlcm5VdGlscy5tYXRjaFBhdHRlcm4pKHBhdHRlcm4sIHJlbWFpbmluZ1BhdGhuYW1lKTtcbiAgICAgIGlmIChtYXRjaGVkKSB7XG4gICAgICAgIHJlbWFpbmluZ1BhdGhuYW1lID0gbWF0Y2hlZC5yZW1haW5pbmdQYXRobmFtZTtcbiAgICAgICAgcGFyYW1OYW1lcyA9IFtdLmNvbmNhdChwYXJhbU5hbWVzLCBtYXRjaGVkLnBhcmFtTmFtZXMpO1xuICAgICAgICBwYXJhbVZhbHVlcyA9IFtdLmNvbmNhdChwYXJhbVZhbHVlcywgbWF0Y2hlZC5wYXJhbVZhbHVlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdQYXRobmFtZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZW1haW5pbmdQYXRobmFtZSA9PT0gJycpIHtcbiAgICAgICAgLy8gV2UgaGF2ZSBhbiBleGFjdCBtYXRjaCBvbiB0aGUgcm91dGUuIEp1c3QgY2hlY2sgdGhhdCBhbGwgdGhlIHBhcmFtc1xuICAgICAgICAvLyBtYXRjaC5cbiAgICAgICAgLy8gRklYTUU6IFRoaXMgZG9lc24ndCB3b3JrIG9uIHJlcGVhdGVkIHBhcmFtcy5cbiAgICAgICAgcmV0dXJuIHBhcmFtTmFtZXMuZXZlcnkoZnVuY3Rpb24gKHBhcmFtTmFtZSwgaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKHBhcmFtVmFsdWVzW2luZGV4XSkgPT09IFN0cmluZyhwYXJhbXNbcGFyYW1OYW1lXSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYWxsIGtleS92YWx1ZSBwYWlycyBpbiB0aGUgZ2l2ZW4gcXVlcnkgYXJlXG4gKiBjdXJyZW50bHkgYWN0aXZlLlxuICovXG5mdW5jdGlvbiBxdWVyeUlzQWN0aXZlKHF1ZXJ5LCBhY3RpdmVRdWVyeSkge1xuICBpZiAoYWN0aXZlUXVlcnkgPT0gbnVsbCkgcmV0dXJuIHF1ZXJ5ID09IG51bGw7XG5cbiAgaWYgKHF1ZXJ5ID09IG51bGwpIHJldHVybiB0cnVlO1xuXG4gIHJldHVybiBkZWVwRXF1YWwocXVlcnksIGFjdGl2ZVF1ZXJ5KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSA8TGluaz4gdG8gdGhlIGdpdmVuIHBhdGhuYW1lL3F1ZXJ5IGNvbWJpbmF0aW9uIGlzXG4gKiBjdXJyZW50bHkgYWN0aXZlLlxuICovXG5mdW5jdGlvbiBpc0FjdGl2ZShfcmVmLCBpbmRleE9ubHksIGN1cnJlbnRMb2NhdGlvbiwgcm91dGVzLCBwYXJhbXMpIHtcbiAgdmFyIHBhdGhuYW1lID0gX3JlZi5wYXRobmFtZTtcbiAgdmFyIHF1ZXJ5ID0gX3JlZi5xdWVyeTtcblxuICBpZiAoY3VycmVudExvY2F0aW9uID09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICAvLyBUT0RPOiBUaGlzIGlzIGEgYml0IHVnbHkuIEl0IGtlZXBzIGFyb3VuZCBzdXBwb3J0IGZvciB0cmVhdGluZyBwYXRobmFtZXNcbiAgLy8gd2l0aG91dCBwcmVjZWRpbmcgc2xhc2hlcyBhcyBhYnNvbHV0ZSBwYXRocywgYnV0IHBvc3NpYmx5IGFsc28gd29ya3NcbiAgLy8gYXJvdW5kIHRoZSBzYW1lIHF1aXJrcyB3aXRoIGJhc2VuYW1lcyBhcyBpbiBtYXRjaFJvdXRlcy5cbiAgaWYgKHBhdGhuYW1lLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgcGF0aG5hbWUgPSAnLycgKyBwYXRobmFtZTtcbiAgfVxuXG4gIGlmICghcGF0aElzQWN0aXZlKHBhdGhuYW1lLCBjdXJyZW50TG9jYXRpb24ucGF0aG5hbWUpKSB7XG4gICAgLy8gVGhlIHBhdGggY2hlY2sgaXMgbmVjZXNzYXJ5IGFuZCBzdWZmaWNpZW50IGZvciBpbmRleE9ubHksIGJ1dCBvdGhlcndpc2VcbiAgICAvLyB3ZSBzdGlsbCBuZWVkIHRvIGNoZWNrIHRoZSByb3V0ZXMuXG4gICAgaWYgKGluZGV4T25seSB8fCAhcm91dGVJc0FjdGl2ZShwYXRobmFtZSwgcm91dGVzLCBwYXJhbXMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5SXNBY3RpdmUocXVlcnksIGN1cnJlbnRMb2NhdGlvbi5xdWVyeSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiXX0=