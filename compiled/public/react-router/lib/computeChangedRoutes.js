'use strict';

exports.__esModule = true;

var _PatternUtils = require('./PatternUtils');

function routeParamsChanged(route, prevState, nextState) {
  if (!route.path) return false;

  var paramNames = (0, _PatternUtils.getParamNames)(route.path);

  return paramNames.some(function (paramName) {
    return prevState.params[paramName] !== nextState.params[paramName];
  });
}

/**
 * Returns an object of { leaveRoutes, changeRoutes, enterRoutes } determined by
 * the change from prevState to nextState. We leave routes if either
 * 1) they are not in the next state or 2) they are in the next state
 * but their params have changed (i.e. /users/123 => /users/456).
 *
 * leaveRoutes are ordered starting at the leaf route of the tree
 * we're leaving up to the common parent route. enterRoutes are ordered
 * from the top of the tree we're entering down to the leaf route.
 *
 * changeRoutes are any routes that didn't leave or enter during
 * the transition.
 */
function computeChangedRoutes(prevState, nextState) {
  var prevRoutes = prevState && prevState.routes;
  var nextRoutes = nextState.routes;

  var leaveRoutes = void 0,
      changeRoutes = void 0,
      enterRoutes = void 0;
  if (prevRoutes) {
    (function () {
      var parentIsLeaving = false;
      leaveRoutes = prevRoutes.filter(function (route) {
        if (parentIsLeaving) {
          return true;
        } else {
          var isLeaving = nextRoutes.indexOf(route) === -1 || routeParamsChanged(route, prevState, nextState);
          if (isLeaving) parentIsLeaving = true;
          return isLeaving;
        }
      });

      // onLeave hooks start at the leaf route.
      leaveRoutes.reverse();

      enterRoutes = [];
      changeRoutes = [];

      nextRoutes.forEach(function (route) {
        var isNew = prevRoutes.indexOf(route) === -1;
        var paramsChanged = leaveRoutes.indexOf(route) !== -1;

        if (isNew || paramsChanged) enterRoutes.push(route);else changeRoutes.push(route);
      });
    })();
  } else {
    leaveRoutes = [];
    changeRoutes = [];
    enterRoutes = nextRoutes;
  }

  return {
    leaveRoutes: leaveRoutes,
    changeRoutes: changeRoutes,
    enterRoutes: enterRoutes
  };
}

exports.default = computeChangedRoutes;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvbGliL2NvbXB1dGVDaGFuZ2VkUm91dGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLFFBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxJQUFJLGdCQUFnQixRQUFRLGdCQUFSLENBQXBCOztBQUVBLFNBQVMsa0JBQVQsQ0FBNEIsS0FBNUIsRUFBbUMsU0FBbkMsRUFBOEMsU0FBOUMsRUFBeUQ7QUFDdkQsTUFBSSxDQUFDLE1BQU0sSUFBWCxFQUFpQixPQUFPLEtBQVA7O0FBRWpCLE1BQUksYUFBYSxDQUFDLEdBQUcsY0FBYyxhQUFsQixFQUFpQyxNQUFNLElBQXZDLENBQWpCOztBQUVBLFNBQU8sV0FBVyxJQUFYLENBQWdCLFVBQVUsU0FBVixFQUFxQjtBQUMxQyxXQUFPLFVBQVUsTUFBVixDQUFpQixTQUFqQixNQUFnQyxVQUFVLE1BQVYsQ0FBaUIsU0FBakIsQ0FBdkM7QUFDRCxHQUZNLENBQVA7QUFHRDs7QUFFRDs7Ozs7Ozs7Ozs7OztBQWFBLFNBQVMsb0JBQVQsQ0FBOEIsU0FBOUIsRUFBeUMsU0FBekMsRUFBb0Q7QUFDbEQsTUFBSSxhQUFhLGFBQWEsVUFBVSxNQUF4QztBQUNBLE1BQUksYUFBYSxVQUFVLE1BQTNCOztBQUVBLE1BQUksY0FBYyxLQUFLLENBQXZCO0FBQUEsTUFDSSxlQUFlLEtBQUssQ0FEeEI7QUFBQSxNQUVJLGNBQWMsS0FBSyxDQUZ2QjtBQUdBLE1BQUksVUFBSixFQUFnQjtBQUNkLEtBQUMsWUFBWTtBQUNYLFVBQUksa0JBQWtCLEtBQXRCO0FBQ0Esb0JBQWMsV0FBVyxNQUFYLENBQWtCLFVBQVUsS0FBVixFQUFpQjtBQUMvQyxZQUFJLGVBQUosRUFBcUI7QUFDbkIsaUJBQU8sSUFBUDtBQUNELFNBRkQsTUFFTztBQUNMLGNBQUksWUFBWSxXQUFXLE9BQVgsQ0FBbUIsS0FBbkIsTUFBOEIsQ0FBQyxDQUEvQixJQUFvQyxtQkFBbUIsS0FBbkIsRUFBMEIsU0FBMUIsRUFBcUMsU0FBckMsQ0FBcEQ7QUFDQSxjQUFJLFNBQUosRUFBZSxrQkFBa0IsSUFBbEI7QUFDZixpQkFBTyxTQUFQO0FBQ0Q7QUFDRixPQVJhLENBQWQ7O0FBVUE7QUFDQSxrQkFBWSxPQUFaOztBQUVBLG9CQUFjLEVBQWQ7QUFDQSxxQkFBZSxFQUFmOztBQUVBLGlCQUFXLE9BQVgsQ0FBbUIsVUFBVSxLQUFWLEVBQWlCO0FBQ2xDLFlBQUksUUFBUSxXQUFXLE9BQVgsQ0FBbUIsS0FBbkIsTUFBOEIsQ0FBQyxDQUEzQztBQUNBLFlBQUksZ0JBQWdCLFlBQVksT0FBWixDQUFvQixLQUFwQixNQUErQixDQUFDLENBQXBEOztBQUVBLFlBQUksU0FBUyxhQUFiLEVBQTRCLFlBQVksSUFBWixDQUFpQixLQUFqQixFQUE1QixLQUF5RCxhQUFhLElBQWIsQ0FBa0IsS0FBbEI7QUFDMUQsT0FMRDtBQU1ELEtBeEJEO0FBeUJELEdBMUJELE1BMEJPO0FBQ0wsa0JBQWMsRUFBZDtBQUNBLG1CQUFlLEVBQWY7QUFDQSxrQkFBYyxVQUFkO0FBQ0Q7O0FBRUQsU0FBTztBQUNMLGlCQUFhLFdBRFI7QUFFTCxrQkFBYyxZQUZUO0FBR0wsaUJBQWE7QUFIUixHQUFQO0FBS0Q7O0FBRUQsUUFBUSxPQUFSLEdBQWtCLG9CQUFsQjtBQUNBLE9BQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsQ0FBakIiLCJmaWxlIjoiY29tcHV0ZUNoYW5nZWRSb3V0ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfUGF0dGVyblV0aWxzID0gcmVxdWlyZSgnLi9QYXR0ZXJuVXRpbHMnKTtcblxuZnVuY3Rpb24gcm91dGVQYXJhbXNDaGFuZ2VkKHJvdXRlLCBwcmV2U3RhdGUsIG5leHRTdGF0ZSkge1xuICBpZiAoIXJvdXRlLnBhdGgpIHJldHVybiBmYWxzZTtcblxuICB2YXIgcGFyYW1OYW1lcyA9ICgwLCBfUGF0dGVyblV0aWxzLmdldFBhcmFtTmFtZXMpKHJvdXRlLnBhdGgpO1xuXG4gIHJldHVybiBwYXJhbU5hbWVzLnNvbWUoZnVuY3Rpb24gKHBhcmFtTmFtZSkge1xuICAgIHJldHVybiBwcmV2U3RhdGUucGFyYW1zW3BhcmFtTmFtZV0gIT09IG5leHRTdGF0ZS5wYXJhbXNbcGFyYW1OYW1lXTtcbiAgfSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3Qgb2YgeyBsZWF2ZVJvdXRlcywgY2hhbmdlUm91dGVzLCBlbnRlclJvdXRlcyB9IGRldGVybWluZWQgYnlcbiAqIHRoZSBjaGFuZ2UgZnJvbSBwcmV2U3RhdGUgdG8gbmV4dFN0YXRlLiBXZSBsZWF2ZSByb3V0ZXMgaWYgZWl0aGVyXG4gKiAxKSB0aGV5IGFyZSBub3QgaW4gdGhlIG5leHQgc3RhdGUgb3IgMikgdGhleSBhcmUgaW4gdGhlIG5leHQgc3RhdGVcbiAqIGJ1dCB0aGVpciBwYXJhbXMgaGF2ZSBjaGFuZ2VkIChpLmUuIC91c2Vycy8xMjMgPT4gL3VzZXJzLzQ1NikuXG4gKlxuICogbGVhdmVSb3V0ZXMgYXJlIG9yZGVyZWQgc3RhcnRpbmcgYXQgdGhlIGxlYWYgcm91dGUgb2YgdGhlIHRyZWVcbiAqIHdlJ3JlIGxlYXZpbmcgdXAgdG8gdGhlIGNvbW1vbiBwYXJlbnQgcm91dGUuIGVudGVyUm91dGVzIGFyZSBvcmRlcmVkXG4gKiBmcm9tIHRoZSB0b3Agb2YgdGhlIHRyZWUgd2UncmUgZW50ZXJpbmcgZG93biB0byB0aGUgbGVhZiByb3V0ZS5cbiAqXG4gKiBjaGFuZ2VSb3V0ZXMgYXJlIGFueSByb3V0ZXMgdGhhdCBkaWRuJ3QgbGVhdmUgb3IgZW50ZXIgZHVyaW5nXG4gKiB0aGUgdHJhbnNpdGlvbi5cbiAqL1xuZnVuY3Rpb24gY29tcHV0ZUNoYW5nZWRSb3V0ZXMocHJldlN0YXRlLCBuZXh0U3RhdGUpIHtcbiAgdmFyIHByZXZSb3V0ZXMgPSBwcmV2U3RhdGUgJiYgcHJldlN0YXRlLnJvdXRlcztcbiAgdmFyIG5leHRSb3V0ZXMgPSBuZXh0U3RhdGUucm91dGVzO1xuXG4gIHZhciBsZWF2ZVJvdXRlcyA9IHZvaWQgMCxcbiAgICAgIGNoYW5nZVJvdXRlcyA9IHZvaWQgMCxcbiAgICAgIGVudGVyUm91dGVzID0gdm9pZCAwO1xuICBpZiAocHJldlJvdXRlcykge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcGFyZW50SXNMZWF2aW5nID0gZmFsc2U7XG4gICAgICBsZWF2ZVJvdXRlcyA9IHByZXZSb3V0ZXMuZmlsdGVyKGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICBpZiAocGFyZW50SXNMZWF2aW5nKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGlzTGVhdmluZyA9IG5leHRSb3V0ZXMuaW5kZXhPZihyb3V0ZSkgPT09IC0xIHx8IHJvdXRlUGFyYW1zQ2hhbmdlZChyb3V0ZSwgcHJldlN0YXRlLCBuZXh0U3RhdGUpO1xuICAgICAgICAgIGlmIChpc0xlYXZpbmcpIHBhcmVudElzTGVhdmluZyA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGlzTGVhdmluZztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIG9uTGVhdmUgaG9va3Mgc3RhcnQgYXQgdGhlIGxlYWYgcm91dGUuXG4gICAgICBsZWF2ZVJvdXRlcy5yZXZlcnNlKCk7XG5cbiAgICAgIGVudGVyUm91dGVzID0gW107XG4gICAgICBjaGFuZ2VSb3V0ZXMgPSBbXTtcblxuICAgICAgbmV4dFJvdXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICB2YXIgaXNOZXcgPSBwcmV2Um91dGVzLmluZGV4T2Yocm91dGUpID09PSAtMTtcbiAgICAgICAgdmFyIHBhcmFtc0NoYW5nZWQgPSBsZWF2ZVJvdXRlcy5pbmRleE9mKHJvdXRlKSAhPT0gLTE7XG5cbiAgICAgICAgaWYgKGlzTmV3IHx8IHBhcmFtc0NoYW5nZWQpIGVudGVyUm91dGVzLnB1c2gocm91dGUpO2Vsc2UgY2hhbmdlUm91dGVzLnB1c2gocm91dGUpO1xuICAgICAgfSk7XG4gICAgfSkoKTtcbiAgfSBlbHNlIHtcbiAgICBsZWF2ZVJvdXRlcyA9IFtdO1xuICAgIGNoYW5nZVJvdXRlcyA9IFtdO1xuICAgIGVudGVyUm91dGVzID0gbmV4dFJvdXRlcztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbGVhdmVSb3V0ZXM6IGxlYXZlUm91dGVzLFxuICAgIGNoYW5nZVJvdXRlczogY2hhbmdlUm91dGVzLFxuICAgIGVudGVyUm91dGVzOiBlbnRlclJvdXRlc1xuICB9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSBjb21wdXRlQ2hhbmdlZFJvdXRlcztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyJdfQ==