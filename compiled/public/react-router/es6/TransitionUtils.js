'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runEnterHooks = runEnterHooks;
exports.runChangeHooks = runChangeHooks;
exports.runLeaveHooks = runLeaveHooks;

var _AsyncUtils = require('./AsyncUtils');

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createTransitionHook(hook, route, asyncArity) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    hook.apply(route, args);

    if (hook.length < asyncArity) {
      var callback = args[args.length - 1];
      // Assume hook executes synchronously and
      // automatically call the callback.
      callback();
    }
  };
}

function getEnterHooks(routes) {
  return routes.reduce(function (hooks, route) {
    if (route.onEnter) hooks.push(createTransitionHook(route.onEnter, route, 3));

    return hooks;
  }, []);
}

function getChangeHooks(routes) {
  return routes.reduce(function (hooks, route) {
    if (route.onChange) hooks.push(createTransitionHook(route.onChange, route, 4));
    return hooks;
  }, []);
}

function runTransitionHooks(length, iter, callback) {
  if (!length) {
    callback();
    return;
  }

  var redirectInfo = void 0;
  function replace(location, deprecatedPathname, deprecatedQuery) {
    if (deprecatedPathname) {
      process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, '`replaceState(state, pathname, query) is deprecated; use `replace(location)` with a location descriptor instead. http://tiny.cc/router-isActivedeprecated') : void 0;
      redirectInfo = {
        pathname: deprecatedPathname,
        query: deprecatedQuery,
        state: location
      };

      return;
    }

    redirectInfo = location;
  }

  (0, _AsyncUtils.loopAsync)(length, function (index, next, done) {
    iter(index, replace, function (error) {
      if (error || redirectInfo) {
        done(error, redirectInfo); // No need to continue.
      } else {
        next();
      }
    });
  }, callback);
}

/**
 * Runs all onEnter hooks in the given array of routes in order
 * with onEnter(nextState, replace, callback) and calls
 * callback(error, redirectInfo) when finished. The first hook
 * to use replace short-circuits the loop.
 *
 * If a hook needs to run asynchronously, it may use the callback
 * function. However, doing so will cause the transition to pause,
 * which could lead to a non-responsive UI if the hook is slow.
 */
function runEnterHooks(routes, nextState, callback) {
  var hooks = getEnterHooks(routes);
  return runTransitionHooks(hooks.length, function (index, replace, next) {
    hooks[index](nextState, replace, next);
  }, callback);
}

/**
 * Runs all onChange hooks in the given array of routes in order
 * with onChange(prevState, nextState, replace, callback) and calls
 * callback(error, redirectInfo) when finished. The first hook
 * to use replace short-circuits the loop.
 *
 * If a hook needs to run asynchronously, it may use the callback
 * function. However, doing so will cause the transition to pause,
 * which could lead to a non-responsive UI if the hook is slow.
 */
function runChangeHooks(routes, state, nextState, callback) {
  var hooks = getChangeHooks(routes);
  return runTransitionHooks(hooks.length, function (index, replace, next) {
    hooks[index](state, nextState, replace, next);
  }, callback);
}

/**
 * Runs all onLeave hooks in the given array of routes in order.
 */
function runLeaveHooks(routes, prevState) {
  for (var i = 0, len = routes.length; i < len; ++i) {
    if (routes[i].onLeave) routes[i].onLeave.call(routes[i], prevState);
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L1RyYW5zaXRpb25VdGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQThFZ0IsYSxHQUFBLGE7UUFpQkEsYyxHQUFBLGM7UUFVQSxhLEdBQUEsYTs7QUF6R2hCOztBQUNBOzs7Ozs7QUFFQSxTQUFTLG9CQUFULENBQThCLElBQTlCLEVBQW9DLEtBQXBDLEVBQTJDLFVBQTNDLEVBQXVEO0FBQ3JELFNBQU8sWUFBWTtBQUNqQixTQUFLLElBQUksT0FBTyxVQUFVLE1BQXJCLEVBQTZCLE9BQU8sTUFBTSxJQUFOLENBQXBDLEVBQWlELE9BQU8sQ0FBN0QsRUFBZ0UsT0FBTyxJQUF2RSxFQUE2RSxNQUE3RSxFQUFxRjtBQUNuRixXQUFLLElBQUwsSUFBYSxVQUFVLElBQVYsQ0FBYjtBQUNEOztBQUVELFNBQUssS0FBTCxDQUFXLEtBQVgsRUFBa0IsSUFBbEI7O0FBRUEsUUFBSSxLQUFLLE1BQUwsR0FBYyxVQUFsQixFQUE4QjtBQUM1QixVQUFJLFdBQVcsS0FBSyxLQUFLLE1BQUwsR0FBYyxDQUFuQixDQUFmO0FBQ0E7QUFDQTtBQUNBO0FBQ0Q7QUFDRixHQWJEO0FBY0Q7O0FBRUQsU0FBUyxhQUFULENBQXVCLE1BQXZCLEVBQStCO0FBQzdCLFNBQU8sT0FBTyxNQUFQLENBQWMsVUFBVSxLQUFWLEVBQWlCLEtBQWpCLEVBQXdCO0FBQzNDLFFBQUksTUFBTSxPQUFWLEVBQW1CLE1BQU0sSUFBTixDQUFXLHFCQUFxQixNQUFNLE9BQTNCLEVBQW9DLEtBQXBDLEVBQTJDLENBQTNDLENBQVg7O0FBRW5CLFdBQU8sS0FBUDtBQUNELEdBSk0sRUFJSixFQUpJLENBQVA7QUFLRDs7QUFFRCxTQUFTLGNBQVQsQ0FBd0IsTUFBeEIsRUFBZ0M7QUFDOUIsU0FBTyxPQUFPLE1BQVAsQ0FBYyxVQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBd0I7QUFDM0MsUUFBSSxNQUFNLFFBQVYsRUFBb0IsTUFBTSxJQUFOLENBQVcscUJBQXFCLE1BQU0sUUFBM0IsRUFBcUMsS0FBckMsRUFBNEMsQ0FBNUMsQ0FBWDtBQUNwQixXQUFPLEtBQVA7QUFDRCxHQUhNLEVBR0osRUFISSxDQUFQO0FBSUQ7O0FBRUQsU0FBUyxrQkFBVCxDQUE0QixNQUE1QixFQUFvQyxJQUFwQyxFQUEwQyxRQUExQyxFQUFvRDtBQUNsRCxNQUFJLENBQUMsTUFBTCxFQUFhO0FBQ1g7QUFDQTtBQUNEOztBQUVELE1BQUksZUFBZSxLQUFLLENBQXhCO0FBQ0EsV0FBUyxPQUFULENBQWlCLFFBQWpCLEVBQTJCLGtCQUEzQixFQUErQyxlQUEvQyxFQUFnRTtBQUM5RCxRQUFJLGtCQUFKLEVBQXdCO0FBQ3RCLGNBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsNkJBQVEsS0FBUixFQUFlLDJKQUFmLENBQXhDLEdBQXNOLEtBQUssQ0FBM047QUFDQSxxQkFBZTtBQUNiLGtCQUFVLGtCQURHO0FBRWIsZUFBTyxlQUZNO0FBR2IsZUFBTztBQUhNLE9BQWY7O0FBTUE7QUFDRDs7QUFFRCxtQkFBZSxRQUFmO0FBQ0Q7O0FBRUQsNkJBQVUsTUFBVixFQUFrQixVQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkI7QUFDN0MsU0FBSyxLQUFMLEVBQVksT0FBWixFQUFxQixVQUFVLEtBQVYsRUFBaUI7QUFDcEMsVUFBSSxTQUFTLFlBQWIsRUFBMkI7QUFDekIsYUFBSyxLQUFMLEVBQVksWUFBWixFQUEyQjtBQUM1QixPQUZELE1BRU87QUFDTDtBQUNEO0FBQ0YsS0FORDtBQU9ELEdBUkQsRUFRRyxRQVJIO0FBU0Q7O0FBRUQ7Ozs7Ozs7Ozs7QUFVTyxTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsRUFBK0IsU0FBL0IsRUFBMEMsUUFBMUMsRUFBb0Q7QUFDekQsTUFBSSxRQUFRLGNBQWMsTUFBZCxDQUFaO0FBQ0EsU0FBTyxtQkFBbUIsTUFBTSxNQUF6QixFQUFpQyxVQUFVLEtBQVYsRUFBaUIsT0FBakIsRUFBMEIsSUFBMUIsRUFBZ0M7QUFDdEUsVUFBTSxLQUFOLEVBQWEsU0FBYixFQUF3QixPQUF4QixFQUFpQyxJQUFqQztBQUNELEdBRk0sRUFFSixRQUZJLENBQVA7QUFHRDs7QUFFRDs7Ozs7Ozs7OztBQVVPLFNBQVMsY0FBVCxDQUF3QixNQUF4QixFQUFnQyxLQUFoQyxFQUF1QyxTQUF2QyxFQUFrRCxRQUFsRCxFQUE0RDtBQUNqRSxNQUFJLFFBQVEsZUFBZSxNQUFmLENBQVo7QUFDQSxTQUFPLG1CQUFtQixNQUFNLE1BQXpCLEVBQWlDLFVBQVUsS0FBVixFQUFpQixPQUFqQixFQUEwQixJQUExQixFQUFnQztBQUN0RSxVQUFNLEtBQU4sRUFBYSxLQUFiLEVBQW9CLFNBQXBCLEVBQStCLE9BQS9CLEVBQXdDLElBQXhDO0FBQ0QsR0FGTSxFQUVKLFFBRkksQ0FBUDtBQUdEOztBQUVEOzs7QUFHTyxTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsRUFBK0IsU0FBL0IsRUFBMEM7QUFDL0MsT0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLE1BQU0sT0FBTyxNQUE3QixFQUFxQyxJQUFJLEdBQXpDLEVBQThDLEVBQUUsQ0FBaEQsRUFBbUQ7QUFDakQsUUFBSSxPQUFPLENBQVAsRUFBVSxPQUFkLEVBQXVCLE9BQU8sQ0FBUCxFQUFVLE9BQVYsQ0FBa0IsSUFBbEIsQ0FBdUIsT0FBTyxDQUFQLENBQXZCLEVBQWtDLFNBQWxDO0FBQ3hCO0FBQ0YiLCJmaWxlIjoiVHJhbnNpdGlvblV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbG9vcEFzeW5jIH0gZnJvbSAnLi9Bc3luY1V0aWxzJztcbmltcG9ydCB3YXJuaW5nIGZyb20gJy4vcm91dGVyV2FybmluZyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVRyYW5zaXRpb25Ib29rKGhvb2ssIHJvdXRlLCBhc3luY0FyaXR5KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgaG9vay5hcHBseShyb3V0ZSwgYXJncyk7XG5cbiAgICBpZiAoaG9vay5sZW5ndGggPCBhc3luY0FyaXR5KSB7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XG4gICAgICAvLyBBc3N1bWUgaG9vayBleGVjdXRlcyBzeW5jaHJvbm91c2x5IGFuZFxuICAgICAgLy8gYXV0b21hdGljYWxseSBjYWxsIHRoZSBjYWxsYmFjay5cbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRFbnRlckhvb2tzKHJvdXRlcykge1xuICByZXR1cm4gcm91dGVzLnJlZHVjZShmdW5jdGlvbiAoaG9va3MsIHJvdXRlKSB7XG4gICAgaWYgKHJvdXRlLm9uRW50ZXIpIGhvb2tzLnB1c2goY3JlYXRlVHJhbnNpdGlvbkhvb2socm91dGUub25FbnRlciwgcm91dGUsIDMpKTtcblxuICAgIHJldHVybiBob29rcztcbiAgfSwgW10pO1xufVxuXG5mdW5jdGlvbiBnZXRDaGFuZ2VIb29rcyhyb3V0ZXMpIHtcbiAgcmV0dXJuIHJvdXRlcy5yZWR1Y2UoZnVuY3Rpb24gKGhvb2tzLCByb3V0ZSkge1xuICAgIGlmIChyb3V0ZS5vbkNoYW5nZSkgaG9va3MucHVzaChjcmVhdGVUcmFuc2l0aW9uSG9vayhyb3V0ZS5vbkNoYW5nZSwgcm91dGUsIDQpKTtcbiAgICByZXR1cm4gaG9va3M7XG4gIH0sIFtdKTtcbn1cblxuZnVuY3Rpb24gcnVuVHJhbnNpdGlvbkhvb2tzKGxlbmd0aCwgaXRlciwgY2FsbGJhY2spIHtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBjYWxsYmFjaygpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciByZWRpcmVjdEluZm8gPSB2b2lkIDA7XG4gIGZ1bmN0aW9uIHJlcGxhY2UobG9jYXRpb24sIGRlcHJlY2F0ZWRQYXRobmFtZSwgZGVwcmVjYXRlZFF1ZXJ5KSB7XG4gICAgaWYgKGRlcHJlY2F0ZWRQYXRobmFtZSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdgcmVwbGFjZVN0YXRlKHN0YXRlLCBwYXRobmFtZSwgcXVlcnkpIGlzIGRlcHJlY2F0ZWQ7IHVzZSBgcmVwbGFjZShsb2NhdGlvbilgIHdpdGggYSBsb2NhdGlvbiBkZXNjcmlwdG9yIGluc3RlYWQuIGh0dHA6Ly90aW55LmNjL3JvdXRlci1pc0FjdGl2ZWRlcHJlY2F0ZWQnKSA6IHZvaWQgMDtcbiAgICAgIHJlZGlyZWN0SW5mbyA9IHtcbiAgICAgICAgcGF0aG5hbWU6IGRlcHJlY2F0ZWRQYXRobmFtZSxcbiAgICAgICAgcXVlcnk6IGRlcHJlY2F0ZWRRdWVyeSxcbiAgICAgICAgc3RhdGU6IGxvY2F0aW9uXG4gICAgICB9O1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmVkaXJlY3RJbmZvID0gbG9jYXRpb247XG4gIH1cblxuICBsb29wQXN5bmMobGVuZ3RoLCBmdW5jdGlvbiAoaW5kZXgsIG5leHQsIGRvbmUpIHtcbiAgICBpdGVyKGluZGV4LCByZXBsYWNlLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvciB8fCByZWRpcmVjdEluZm8pIHtcbiAgICAgICAgZG9uZShlcnJvciwgcmVkaXJlY3RJbmZvKTsgLy8gTm8gbmVlZCB0byBjb250aW51ZS5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSwgY2FsbGJhY2spO1xufVxuXG4vKipcbiAqIFJ1bnMgYWxsIG9uRW50ZXIgaG9va3MgaW4gdGhlIGdpdmVuIGFycmF5IG9mIHJvdXRlcyBpbiBvcmRlclxuICogd2l0aCBvbkVudGVyKG5leHRTdGF0ZSwgcmVwbGFjZSwgY2FsbGJhY2spIGFuZCBjYWxsc1xuICogY2FsbGJhY2soZXJyb3IsIHJlZGlyZWN0SW5mbykgd2hlbiBmaW5pc2hlZC4gVGhlIGZpcnN0IGhvb2tcbiAqIHRvIHVzZSByZXBsYWNlIHNob3J0LWNpcmN1aXRzIHRoZSBsb29wLlxuICpcbiAqIElmIGEgaG9vayBuZWVkcyB0byBydW4gYXN5bmNocm9ub3VzbHksIGl0IG1heSB1c2UgdGhlIGNhbGxiYWNrXG4gKiBmdW5jdGlvbi4gSG93ZXZlciwgZG9pbmcgc28gd2lsbCBjYXVzZSB0aGUgdHJhbnNpdGlvbiB0byBwYXVzZSxcbiAqIHdoaWNoIGNvdWxkIGxlYWQgdG8gYSBub24tcmVzcG9uc2l2ZSBVSSBpZiB0aGUgaG9vayBpcyBzbG93LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcnVuRW50ZXJIb29rcyhyb3V0ZXMsIG5leHRTdGF0ZSwgY2FsbGJhY2spIHtcbiAgdmFyIGhvb2tzID0gZ2V0RW50ZXJIb29rcyhyb3V0ZXMpO1xuICByZXR1cm4gcnVuVHJhbnNpdGlvbkhvb2tzKGhvb2tzLmxlbmd0aCwgZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlLCBuZXh0KSB7XG4gICAgaG9va3NbaW5kZXhdKG5leHRTdGF0ZSwgcmVwbGFjZSwgbmV4dCk7XG4gIH0sIGNhbGxiYWNrKTtcbn1cblxuLyoqXG4gKiBSdW5zIGFsbCBvbkNoYW5nZSBob29rcyBpbiB0aGUgZ2l2ZW4gYXJyYXkgb2Ygcm91dGVzIGluIG9yZGVyXG4gKiB3aXRoIG9uQ2hhbmdlKHByZXZTdGF0ZSwgbmV4dFN0YXRlLCByZXBsYWNlLCBjYWxsYmFjaykgYW5kIGNhbGxzXG4gKiBjYWxsYmFjayhlcnJvciwgcmVkaXJlY3RJbmZvKSB3aGVuIGZpbmlzaGVkLiBUaGUgZmlyc3QgaG9va1xuICogdG8gdXNlIHJlcGxhY2Ugc2hvcnQtY2lyY3VpdHMgdGhlIGxvb3AuXG4gKlxuICogSWYgYSBob29rIG5lZWRzIHRvIHJ1biBhc3luY2hyb25vdXNseSwgaXQgbWF5IHVzZSB0aGUgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uLiBIb3dldmVyLCBkb2luZyBzbyB3aWxsIGNhdXNlIHRoZSB0cmFuc2l0aW9uIHRvIHBhdXNlLFxuICogd2hpY2ggY291bGQgbGVhZCB0byBhIG5vbi1yZXNwb25zaXZlIFVJIGlmIHRoZSBob29rIGlzIHNsb3cuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBydW5DaGFuZ2VIb29rcyhyb3V0ZXMsIHN0YXRlLCBuZXh0U3RhdGUsIGNhbGxiYWNrKSB7XG4gIHZhciBob29rcyA9IGdldENoYW5nZUhvb2tzKHJvdXRlcyk7XG4gIHJldHVybiBydW5UcmFuc2l0aW9uSG9va3MoaG9va3MubGVuZ3RoLCBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2UsIG5leHQpIHtcbiAgICBob29rc1tpbmRleF0oc3RhdGUsIG5leHRTdGF0ZSwgcmVwbGFjZSwgbmV4dCk7XG4gIH0sIGNhbGxiYWNrKTtcbn1cblxuLyoqXG4gKiBSdW5zIGFsbCBvbkxlYXZlIGhvb2tzIGluIHRoZSBnaXZlbiBhcnJheSBvZiByb3V0ZXMgaW4gb3JkZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBydW5MZWF2ZUhvb2tzKHJvdXRlcywgcHJldlN0YXRlKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSByb3V0ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAocm91dGVzW2ldLm9uTGVhdmUpIHJvdXRlc1tpXS5vbkxlYXZlLmNhbGwocm91dGVzW2ldLCBwcmV2U3RhdGUpO1xuICB9XG59Il19