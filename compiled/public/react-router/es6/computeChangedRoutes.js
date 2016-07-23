'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L2NvbXB1dGVDaGFuZ2VkUm91dGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUVBLFNBQVMsa0JBQVQsQ0FBNEIsS0FBNUIsRUFBbUMsU0FBbkMsRUFBOEMsU0FBOUMsRUFBeUQ7QUFDdkQsTUFBSSxDQUFDLE1BQU0sSUFBWCxFQUFpQixPQUFPLEtBQVA7O0FBRWpCLE1BQUksYUFBYSxpQ0FBYyxNQUFNLElBQXBCLENBQWpCOztBQUVBLFNBQU8sV0FBVyxJQUFYLENBQWdCLFVBQVUsU0FBVixFQUFxQjtBQUMxQyxXQUFPLFVBQVUsTUFBVixDQUFpQixTQUFqQixNQUFnQyxVQUFVLE1BQVYsQ0FBaUIsU0FBakIsQ0FBdkM7QUFDRCxHQUZNLENBQVA7QUFHRDs7QUFFRDs7Ozs7Ozs7Ozs7OztBQWFBLFNBQVMsb0JBQVQsQ0FBOEIsU0FBOUIsRUFBeUMsU0FBekMsRUFBb0Q7QUFDbEQsTUFBSSxhQUFhLGFBQWEsVUFBVSxNQUF4QztBQUNBLE1BQUksYUFBYSxVQUFVLE1BQTNCOztBQUVBLE1BQUksY0FBYyxLQUFLLENBQXZCO0FBQUEsTUFDSSxlQUFlLEtBQUssQ0FEeEI7QUFBQSxNQUVJLGNBQWMsS0FBSyxDQUZ2QjtBQUdBLE1BQUksVUFBSixFQUFnQjtBQUNkLEtBQUMsWUFBWTtBQUNYLFVBQUksa0JBQWtCLEtBQXRCO0FBQ0Esb0JBQWMsV0FBVyxNQUFYLENBQWtCLFVBQVUsS0FBVixFQUFpQjtBQUMvQyxZQUFJLGVBQUosRUFBcUI7QUFDbkIsaUJBQU8sSUFBUDtBQUNELFNBRkQsTUFFTztBQUNMLGNBQUksWUFBWSxXQUFXLE9BQVgsQ0FBbUIsS0FBbkIsTUFBOEIsQ0FBQyxDQUEvQixJQUFvQyxtQkFBbUIsS0FBbkIsRUFBMEIsU0FBMUIsRUFBcUMsU0FBckMsQ0FBcEQ7QUFDQSxjQUFJLFNBQUosRUFBZSxrQkFBa0IsSUFBbEI7QUFDZixpQkFBTyxTQUFQO0FBQ0Q7QUFDRixPQVJhLENBQWQ7O0FBVUE7QUFDQSxrQkFBWSxPQUFaOztBQUVBLG9CQUFjLEVBQWQ7QUFDQSxxQkFBZSxFQUFmOztBQUVBLGlCQUFXLE9BQVgsQ0FBbUIsVUFBVSxLQUFWLEVBQWlCO0FBQ2xDLFlBQUksUUFBUSxXQUFXLE9BQVgsQ0FBbUIsS0FBbkIsTUFBOEIsQ0FBQyxDQUEzQztBQUNBLFlBQUksZ0JBQWdCLFlBQVksT0FBWixDQUFvQixLQUFwQixNQUErQixDQUFDLENBQXBEOztBQUVBLFlBQUksU0FBUyxhQUFiLEVBQTRCLFlBQVksSUFBWixDQUFpQixLQUFqQixFQUE1QixLQUF5RCxhQUFhLElBQWIsQ0FBa0IsS0FBbEI7QUFDMUQsT0FMRDtBQU1ELEtBeEJEO0FBeUJELEdBMUJELE1BMEJPO0FBQ0wsa0JBQWMsRUFBZDtBQUNBLG1CQUFlLEVBQWY7QUFDQSxrQkFBYyxVQUFkO0FBQ0Q7O0FBRUQsU0FBTztBQUNMLGlCQUFhLFdBRFI7QUFFTCxrQkFBYyxZQUZUO0FBR0wsaUJBQWE7QUFIUixHQUFQO0FBS0Q7O2tCQUVjLG9CIiwiZmlsZSI6ImNvbXB1dGVDaGFuZ2VkUm91dGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0UGFyYW1OYW1lcyB9IGZyb20gJy4vUGF0dGVyblV0aWxzJztcblxuZnVuY3Rpb24gcm91dGVQYXJhbXNDaGFuZ2VkKHJvdXRlLCBwcmV2U3RhdGUsIG5leHRTdGF0ZSkge1xuICBpZiAoIXJvdXRlLnBhdGgpIHJldHVybiBmYWxzZTtcblxuICB2YXIgcGFyYW1OYW1lcyA9IGdldFBhcmFtTmFtZXMocm91dGUucGF0aCk7XG5cbiAgcmV0dXJuIHBhcmFtTmFtZXMuc29tZShmdW5jdGlvbiAocGFyYW1OYW1lKSB7XG4gICAgcmV0dXJuIHByZXZTdGF0ZS5wYXJhbXNbcGFyYW1OYW1lXSAhPT0gbmV4dFN0YXRlLnBhcmFtc1twYXJhbU5hbWVdO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCBvZiB7IGxlYXZlUm91dGVzLCBjaGFuZ2VSb3V0ZXMsIGVudGVyUm91dGVzIH0gZGV0ZXJtaW5lZCBieVxuICogdGhlIGNoYW5nZSBmcm9tIHByZXZTdGF0ZSB0byBuZXh0U3RhdGUuIFdlIGxlYXZlIHJvdXRlcyBpZiBlaXRoZXJcbiAqIDEpIHRoZXkgYXJlIG5vdCBpbiB0aGUgbmV4dCBzdGF0ZSBvciAyKSB0aGV5IGFyZSBpbiB0aGUgbmV4dCBzdGF0ZVxuICogYnV0IHRoZWlyIHBhcmFtcyBoYXZlIGNoYW5nZWQgKGkuZS4gL3VzZXJzLzEyMyA9PiAvdXNlcnMvNDU2KS5cbiAqXG4gKiBsZWF2ZVJvdXRlcyBhcmUgb3JkZXJlZCBzdGFydGluZyBhdCB0aGUgbGVhZiByb3V0ZSBvZiB0aGUgdHJlZVxuICogd2UncmUgbGVhdmluZyB1cCB0byB0aGUgY29tbW9uIHBhcmVudCByb3V0ZS4gZW50ZXJSb3V0ZXMgYXJlIG9yZGVyZWRcbiAqIGZyb20gdGhlIHRvcCBvZiB0aGUgdHJlZSB3ZSdyZSBlbnRlcmluZyBkb3duIHRvIHRoZSBsZWFmIHJvdXRlLlxuICpcbiAqIGNoYW5nZVJvdXRlcyBhcmUgYW55IHJvdXRlcyB0aGF0IGRpZG4ndCBsZWF2ZSBvciBlbnRlciBkdXJpbmdcbiAqIHRoZSB0cmFuc2l0aW9uLlxuICovXG5mdW5jdGlvbiBjb21wdXRlQ2hhbmdlZFJvdXRlcyhwcmV2U3RhdGUsIG5leHRTdGF0ZSkge1xuICB2YXIgcHJldlJvdXRlcyA9IHByZXZTdGF0ZSAmJiBwcmV2U3RhdGUucm91dGVzO1xuICB2YXIgbmV4dFJvdXRlcyA9IG5leHRTdGF0ZS5yb3V0ZXM7XG5cbiAgdmFyIGxlYXZlUm91dGVzID0gdm9pZCAwLFxuICAgICAgY2hhbmdlUm91dGVzID0gdm9pZCAwLFxuICAgICAgZW50ZXJSb3V0ZXMgPSB2b2lkIDA7XG4gIGlmIChwcmV2Um91dGVzKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwYXJlbnRJc0xlYXZpbmcgPSBmYWxzZTtcbiAgICAgIGxlYXZlUm91dGVzID0gcHJldlJvdXRlcy5maWx0ZXIoZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgIGlmIChwYXJlbnRJc0xlYXZpbmcpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgaXNMZWF2aW5nID0gbmV4dFJvdXRlcy5pbmRleE9mKHJvdXRlKSA9PT0gLTEgfHwgcm91dGVQYXJhbXNDaGFuZ2VkKHJvdXRlLCBwcmV2U3RhdGUsIG5leHRTdGF0ZSk7XG4gICAgICAgICAgaWYgKGlzTGVhdmluZykgcGFyZW50SXNMZWF2aW5nID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gaXNMZWF2aW5nO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gb25MZWF2ZSBob29rcyBzdGFydCBhdCB0aGUgbGVhZiByb3V0ZS5cbiAgICAgIGxlYXZlUm91dGVzLnJldmVyc2UoKTtcblxuICAgICAgZW50ZXJSb3V0ZXMgPSBbXTtcbiAgICAgIGNoYW5nZVJvdXRlcyA9IFtdO1xuXG4gICAgICBuZXh0Um91dGVzLmZvckVhY2goZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICAgIHZhciBpc05ldyA9IHByZXZSb3V0ZXMuaW5kZXhPZihyb3V0ZSkgPT09IC0xO1xuICAgICAgICB2YXIgcGFyYW1zQ2hhbmdlZCA9IGxlYXZlUm91dGVzLmluZGV4T2Yocm91dGUpICE9PSAtMTtcblxuICAgICAgICBpZiAoaXNOZXcgfHwgcGFyYW1zQ2hhbmdlZCkgZW50ZXJSb3V0ZXMucHVzaChyb3V0ZSk7ZWxzZSBjaGFuZ2VSb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgICB9KTtcbiAgICB9KSgpO1xuICB9IGVsc2Uge1xuICAgIGxlYXZlUm91dGVzID0gW107XG4gICAgY2hhbmdlUm91dGVzID0gW107XG4gICAgZW50ZXJSb3V0ZXMgPSBuZXh0Um91dGVzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsZWF2ZVJvdXRlczogbGVhdmVSb3V0ZXMsXG4gICAgY2hhbmdlUm91dGVzOiBjaGFuZ2VSb3V0ZXMsXG4gICAgZW50ZXJSb3V0ZXM6IGVudGVyUm91dGVzXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXB1dGVDaGFuZ2VkUm91dGVzOyJdfQ==