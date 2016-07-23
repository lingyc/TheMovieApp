'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTransitionManager;

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _Actions = require('history/lib/Actions');

var _computeChangedRoutes2 = require('./computeChangedRoutes');

var _computeChangedRoutes3 = _interopRequireDefault(_computeChangedRoutes2);

var _TransitionUtils = require('./TransitionUtils');

var _isActive2 = require('./isActive');

var _isActive3 = _interopRequireDefault(_isActive2);

var _getComponents = require('./getComponents');

var _getComponents2 = _interopRequireDefault(_getComponents);

var _matchRoutes = require('./matchRoutes');

var _matchRoutes2 = _interopRequireDefault(_matchRoutes);

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

function hasAnyProperties(object) {
  for (var p in object) {
    if (Object.prototype.hasOwnProperty.call(object, p)) return true;
  }return false;
}

function createTransitionManager(history, routes) {
  var state = {};

  // Signature should be (location, indexOnly), but needs to support (path,
  // query, indexOnly)
  function isActive(location) {
    var indexOnlyOrDeprecatedQuery = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var deprecatedIndexOnly = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    var indexOnly = void 0;
    if (indexOnlyOrDeprecatedQuery && indexOnlyOrDeprecatedQuery !== true || deprecatedIndexOnly !== null) {
      process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, '`isActive(pathname, query, indexOnly) is deprecated; use `isActive(location, indexOnly)` with a location descriptor instead. http://tiny.cc/router-isActivedeprecated') : void 0;
      location = { pathname: location, query: indexOnlyOrDeprecatedQuery };
      indexOnly = deprecatedIndexOnly || false;
    } else {
      location = history.createLocation(location);
      indexOnly = indexOnlyOrDeprecatedQuery;
    }

    return (0, _isActive3.default)(location, indexOnly, state.location, state.routes, state.params);
  }

  function createLocationFromRedirectInfo(location) {
    return history.createLocation(location, _Actions.REPLACE);
  }

  var partialNextState = void 0;

  function match(location, callback) {
    if (partialNextState && partialNextState.location === location) {
      // Continue from where we left off.
      finishMatch(partialNextState, callback);
    } else {
      (0, _matchRoutes2.default)(routes, location, function (error, nextState) {
        if (error) {
          callback(error);
        } else if (nextState) {
          finishMatch(_extends({}, nextState, { location: location }), callback);
        } else {
          callback();
        }
      });
    }
  }

  function finishMatch(nextState, callback) {
    var _computeChangedRoutes = (0, _computeChangedRoutes3.default)(state, nextState);

    var leaveRoutes = _computeChangedRoutes.leaveRoutes;
    var changeRoutes = _computeChangedRoutes.changeRoutes;
    var enterRoutes = _computeChangedRoutes.enterRoutes;

    (0, _TransitionUtils.runLeaveHooks)(leaveRoutes, state);

    // Tear down confirmation hooks for left routes
    leaveRoutes.filter(function (route) {
      return enterRoutes.indexOf(route) === -1;
    }).forEach(removeListenBeforeHooksForRoute);

    // change and enter hooks are run in series
    (0, _TransitionUtils.runChangeHooks)(changeRoutes, state, nextState, function (error, redirectInfo) {
      if (error || redirectInfo) return handleErrorOrRedirect(error, redirectInfo);

      (0, _TransitionUtils.runEnterHooks)(enterRoutes, nextState, finishEnterHooks);
    });

    function finishEnterHooks(error, redirectInfo) {
      if (error || redirectInfo) return handleErrorOrRedirect(error, redirectInfo);

      // TODO: Fetch components after state is updated.
      (0, _getComponents2.default)(nextState, function (error, components) {
        if (error) {
          callback(error);
        } else {
          // TODO: Make match a pure function and have some other API
          // for "match and update state".
          callback(null, null, state = _extends({}, nextState, { components: components }));
        }
      });
    }

    function handleErrorOrRedirect(error, redirectInfo) {
      if (error) callback(error);else callback(null, createLocationFromRedirectInfo(redirectInfo));
    }
  }

  var RouteGuid = 1;

  function getRouteID(route) {
    var create = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    return route.__id__ || create && (route.__id__ = RouteGuid++);
  }

  var RouteHooks = Object.create(null);

  function getRouteHooksForRoutes(routes) {
    return routes.reduce(function (hooks, route) {
      hooks.push.apply(hooks, RouteHooks[getRouteID(route)]);
      return hooks;
    }, []);
  }

  function transitionHook(location, callback) {
    (0, _matchRoutes2.default)(routes, location, function (error, nextState) {
      if (nextState == null) {
        // TODO: We didn't actually match anything, but hang
        // onto error/nextState so we don't have to matchRoutes
        // again in the listen callback.
        callback();
        return;
      }

      // Cache some state here so we don't have to
      // matchRoutes() again in the listen callback.
      partialNextState = _extends({}, nextState, { location: location });

      var hooks = getRouteHooksForRoutes((0, _computeChangedRoutes3.default)(state, partialNextState).leaveRoutes);

      var result = void 0;
      for (var i = 0, len = hooks.length; result == null && i < len; ++i) {
        // Passing the location arg here indicates to
        // the user that this is a transition hook.
        result = hooks[i](location);
      }

      callback(result);
    });
  }

  /* istanbul ignore next: untestable with Karma */
  function beforeUnloadHook() {
    // Synchronously check to see if any route hooks want
    // to prevent the current window/tab from closing.
    if (state.routes) {
      var hooks = getRouteHooksForRoutes(state.routes);

      var message = void 0;
      for (var i = 0, len = hooks.length; typeof message !== 'string' && i < len; ++i) {
        // Passing no args indicates to the user that this is a
        // beforeunload hook. We don't know the next location.
        message = hooks[i]();
      }

      return message;
    }
  }

  var unlistenBefore = void 0,
      unlistenBeforeUnload = void 0;

  function removeListenBeforeHooksForRoute(route) {
    var routeID = getRouteID(route, false);
    if (!routeID) {
      return;
    }

    delete RouteHooks[routeID];

    if (!hasAnyProperties(RouteHooks)) {
      // teardown transition & beforeunload hooks
      if (unlistenBefore) {
        unlistenBefore();
        unlistenBefore = null;
      }

      if (unlistenBeforeUnload) {
        unlistenBeforeUnload();
        unlistenBeforeUnload = null;
      }
    }
  }

  /**
   * Registers the given hook function to run before leaving the given route.
   *
   * During a normal transition, the hook function receives the next location
   * as its only argument and can return either a prompt message (string) to show the user,
   * to make sure they want to leave the page; or `false`, to prevent the transition.
   * Any other return value will have no effect.
   *
   * During the beforeunload event (in browsers) the hook receives no arguments.
   * In this case it must return a prompt message to prevent the transition.
   *
   * Returns a function that may be used to unbind the listener.
   */
  function listenBeforeLeavingRoute(route, hook) {
    // TODO: Warn if they register for a route that isn't currently
    // active. They're probably doing something wrong, like re-creating
    // route objects on every location change.
    var routeID = getRouteID(route);
    var hooks = RouteHooks[routeID];

    if (!hooks) {
      var thereWereNoRouteHooks = !hasAnyProperties(RouteHooks);

      RouteHooks[routeID] = [hook];

      if (thereWereNoRouteHooks) {
        // setup transition & beforeunload hooks
        unlistenBefore = history.listenBefore(transitionHook);

        if (history.listenBeforeUnload) unlistenBeforeUnload = history.listenBeforeUnload(beforeUnloadHook);
      }
    } else {
      if (hooks.indexOf(hook) === -1) {
        process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'adding multiple leave hooks for the same route is deprecated; manage multiple confirmations in your own code instead') : void 0;

        hooks.push(hook);
      }
    }

    return function () {
      var hooks = RouteHooks[routeID];

      if (hooks) {
        var newHooks = hooks.filter(function (item) {
          return item !== hook;
        });

        if (newHooks.length === 0) {
          removeListenBeforeHooksForRoute(route);
        } else {
          RouteHooks[routeID] = newHooks;
        }
      }
    };
  }

  /**
   * This is the API for stateful environments. As the location
   * changes, we update state and call the listener. We can also
   * gracefully handle errors and redirects.
   */
  function listen(listener) {
    // TODO: Only use a single history listener. Otherwise we'll
    // end up with multiple concurrent calls to match.
    return history.listen(function (location) {
      if (state.location === location) {
        listener(null, state);
      } else {
        match(location, function (error, redirectLocation, nextState) {
          if (error) {
            listener(error);
          } else if (redirectLocation) {
            history.transitionTo(redirectLocation);
          } else if (nextState) {
            listener(null, nextState);
          } else {
            process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'Location "%s" did not match any routes', location.pathname + location.search + location.hash) : void 0;
          }
        });
      }
    });
  }

  return {
    isActive: isActive,
    match: match,
    listenBeforeLeavingRoute: listenBeforeLeavingRoute,
    listen: listen
  };
}

//export default useRoutes
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L2NyZWF0ZVRyYW5zaXRpb25NYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQWdCd0IsdUI7O0FBZHhCOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQVJBLElBQUksV0FBVyxPQUFPLE1BQVAsSUFBaUIsVUFBVSxNQUFWLEVBQWtCO0FBQUUsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFBRSxRQUFJLFNBQVMsVUFBVSxDQUFWLENBQWIsQ0FBMkIsS0FBSyxJQUFJLEdBQVQsSUFBZ0IsTUFBaEIsRUFBd0I7QUFBRSxVQUFJLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxNQUFyQyxFQUE2QyxHQUE3QyxDQUFKLEVBQXVEO0FBQUUsZUFBTyxHQUFQLElBQWMsT0FBTyxHQUFQLENBQWQ7QUFBNEI7QUFBRTtBQUFFLEdBQUMsT0FBTyxNQUFQO0FBQWdCLENBQWhROztBQVVBLFNBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0M7QUFDaEMsT0FBSyxJQUFJLENBQVQsSUFBYyxNQUFkLEVBQXNCO0FBQ3BCLFFBQUksT0FBTyxTQUFQLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLENBQXFDLE1BQXJDLEVBQTZDLENBQTdDLENBQUosRUFBcUQsT0FBTyxJQUFQO0FBQ3RELFVBQU8sS0FBUDtBQUNGOztBQUVjLFNBQVMsdUJBQVQsQ0FBaUMsT0FBakMsRUFBMEMsTUFBMUMsRUFBa0Q7QUFDL0QsTUFBSSxRQUFRLEVBQVo7O0FBRUE7QUFDQTtBQUNBLFdBQVMsUUFBVCxDQUFrQixRQUFsQixFQUE0QjtBQUMxQixRQUFJLDZCQUE2QixVQUFVLE1BQVYsSUFBb0IsQ0FBcEIsSUFBeUIsVUFBVSxDQUFWLE1BQWlCLFNBQTFDLEdBQXNELEtBQXRELEdB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Q0wscUJBQVcsT0FBWCxJQUFzQixRQUF0QjtBQUNEO0FBQ0Y7QUFDRixLQWREO0FBZUQ7O0FBRUQ7Ozs7O0FBS0EsV0FBUyxNQUFULENBQWdCLFFBQWhCLEVBQTBCO0FBQ3hCO0FBQ0E7QUFDQSxXQUFPLFFBQVEsTUFBUixDQUFlLFVBQVUsUUFBVixFQUFvQjtBQUN4QyxVQUFJLE1BQU0sUUFBTixLQUFtQixRQUF2QixFQUFpQztBQUMvQixpQkFBUyxJQUFULEVBQWUsS0FBZjtBQUNELE9BRkQsTUFFTztBQUNMLGNBQU0sUUFBTixFQUFnQixVQUFVLEtBQVYsRUFBaUIsZ0JBQWpCLEVBQW1DLFNBQW5DLEVBQThDO0FBQzVELGNBQUksS0FBSixFQUFXO0FBQ1QscUJBQVMsS0FBVDtBQUNELFdBRkQsTUFFTyxJQUFJLGdCQUFKLEVBQXNCO0FBQzNCLG9CQUFRLFlBQVIsQ0FBcUIsZ0JBQXJCO0FBQ0QsV0FGTSxNQUVBLElBQUksU0FBSixFQUFlO0FBQ3BCLHFCQUFTLElBQVQsRUFBZSxTQUFmO0FBQ0QsV0FGTSxNQUVBO0FBQ0wsb0JBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsNkJBQVEsS0FBUixFQUFlLHdDQUFmLEVBQXlELFNBQVMsUUFBVCxHQUFvQixTQUFTLE1BQTdCLEdBQXNDLFNBQVMsSUFBeEcsQ0FBeEMsR0FBd0osS0FBSyxDQUE3SjtBQUNEO0FBQ0YsU0FWRDtBQVdEO0FBQ0YsS0FoQk0sQ0FBUDtBQWlCRDs7QUFFRCxTQUFPO0FBQ0wsY0FBVSxRQURMO0FBRUwsV0FBTyxLQUZGO0FBR0wsOEJBQTBCLHdCQUhyQjtBQUlMLFlBQVE7QUFKSCxHQUFQO0FBTUQ7O0FBRUQiLCJmaWxlIjoiY3JlYXRlVHJhbnNpdGlvbk1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5pbXBvcnQgd2FybmluZyBmcm9tICcuL3JvdXRlcldhcm5pbmcnO1xuaW1wb3J0IHsgUkVQTEFDRSB9IGZyb20gJ2hpc3RvcnkvbGliL0FjdGlvbnMnO1xuaW1wb3J0IGNvbXB1dGVDaGFuZ2VkUm91dGVzIGZyb20gJy4vY29tcHV0ZUNoYW5nZWRSb3V0ZXMnO1xuaW1wb3J0IHsgcnVuRW50ZXJIb29rcywgcnVuQ2hhbmdlSG9va3MsIHJ1bkxlYXZlSG9va3MgfSBmcm9tICcuL1RyYW5zaXRpb25VdGlscyc7XG5pbXBvcnQgX2lzQWN0aXZlIGZyb20gJy4vaXNBY3RpdmUnO1xuaW1wb3J0IGdldENvbXBvbmVudHMgZnJvbSAnLi9nZXRDb21wb25lbnRzJztcbmltcG9ydCBtYXRjaFJvdXRlcyBmcm9tICcuL21hdGNoUm91dGVzJztcblxuZnVuY3Rpb24gaGFzQW55UHJvcGVydGllcyhvYmplY3QpIHtcbiAgZm9yICh2YXIgcCBpbiBvYmplY3QpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcCkpIHJldHVybiB0cnVlO1xuICB9cmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVUcmFuc2l0aW9uTWFuYWdlcihoaXN0b3J5LCByb3V0ZXMpIHtcbiAgdmFyIHN0YXRlID0ge307XG5cbiAgLy8gU2lnbmF0dXJlIHNob3VsZCBiZSAobG9jYXRpb24sIGluZGV4T25seSksIGJ1dCBuZWVkcyB0byBzdXBwb3J0IChwYXRoLFxuICAvLyBxdWVyeSwgaW5kZXhPbmx5KVxuICBmdW5jdGlvbiBpc0FjdGl2ZShsb2NhdGlvbikge1xuICAgIHZhciBpbmRleE9ubHlPckRlcHJlY2F0ZWRRdWVyeSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuICAgIHZhciBkZXByZWNhdGVkSW5kZXhPbmx5ID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGFyZ3VtZW50c1syXTtcblxuICAgIHZhciBpbmRleE9ubHkgPSB2b2lkIDA7XG4gICAgaWYgKGluZGV4T25seU9yRGVwcmVjYXRlZFF1ZXJ5ICYmIGluZGV4T25seU9yRGVwcmVjYXRlZFF1ZXJ5ICE9PSB0cnVlIHx8IGRlcHJlY2F0ZWRJbmRleE9ubHkgIT09IG51bGwpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnYGlzQWN0aXZlKHBhdGhuYW1lLCBxdWVyeSwgaW5kZXhPbmx5KSBpcyBkZXByZWNhdGVkOyB1c2UgYGlzQWN0aXZlKGxvY2F0aW9uLCBpbmRleE9ubHkpYCB3aXRoIGEgbG9jYXRpb24gZGVzY3JpcHRvciBpbnN0ZWFkLiBodHRwOi8vdGlueS5jYy9yb3V0ZXItaXNBY3RpdmVkZXByZWNhdGVkJykgOiB2b2lkIDA7XG4gICAgICBsb2NhdGlvbiA9IHsgcGF0aG5hbWU6IGxvY2F0aW9uLCBxdWVyeTogaW5kZXhPbmx5T3JEZXByZWNhdGVkUXVlcnkgfTtcbiAgICAgIGluZGV4T25seSA9IGRlcHJlY2F0ZWRJbmRleE9ubHkgfHwgZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2F0aW9uID0gaGlzdG9yeS5jcmVhdGVMb2NhdGlvbihsb2NhdGlvbik7XG4gICAgICBpbmRleE9ubHkgPSBpbmRleE9ubHlPckRlcHJlY2F0ZWRRdWVyeTtcbiAgICB9XG5cbiAgICByZXR1cm4gX2lzQWN0aXZlKGxvY2F0aW9uLCBpbmRleE9ubHksIHN0YXRlLmxvY2F0aW9uLCBzdGF0ZS5yb3V0ZXMsIHN0YXRlLnBhcmFtcyk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVMb2NhdGlvbkZyb21SZWRpcmVjdEluZm8obG9jYXRpb24pIHtcbiAgICByZXR1cm4gaGlzdG9yeS5jcmVhdGVMb2NhdGlvbihsb2NhdGlvbiwgUkVQTEFDRSk7XG4gIH1cblxuICB2YXIgcGFydGlhbE5leHRTdGF0ZSA9IHZvaWQgMDtcblxuICBmdW5jdGlvbiBtYXRjaChsb2NhdGlvbiwgY2FsbGJhY2spIHtcbiAgICBpZiAocGFydGlhbE5leHRTdGF0ZSAmJiBwYXJ0aWFsTmV4dFN0YXRlLmxvY2F0aW9uID09PSBsb2NhdGlvbikge1xuICAgICAgLy8gQ29udGludWUgZnJvbSB3aGVyZSB3ZSBsZWZ0IG9mZi5cbiAgICAgIGZpbmlzaE1hdGNoKHBhcnRpYWxOZXh0U3RhdGUsIGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWF0Y2hSb3V0ZXMocm91dGVzLCBsb2NhdGlvbiwgZnVuY3Rpb24gKGVycm9yLCBuZXh0U3RhdGUpIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgICAgICB9IGVsc2UgaWYgKG5leHRTdGF0ZSkge1xuICAgICAgICAgIGZpbmlzaE1hdGNoKF9leHRlbmRzKHt9LCBuZXh0U3RhdGUsIHsgbG9jYXRpb246IGxvY2F0aW9uIH0pLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZmluaXNoTWF0Y2gobmV4dFN0YXRlLCBjYWxsYmFjaykge1xuICAgIHZhciBfY29tcHV0ZUNoYW5nZWRSb3V0ZXMgPSBjb21wdXRlQ2hhbmdlZFJvdXRlcyhzdGF0ZSwgbmV4dFN0YXRlKTtcblxuICAgIHZhciBsZWF2ZVJvdXRlcyA9IF9jb21wdXRlQ2hhbmdlZFJvdXRlcy5sZWF2ZVJvdXRlcztcbiAgICB2YXIgY2hhbmdlUm91dGVzID0gX2NvbXB1dGVDaGFuZ2VkUm91dGVzLmNoYW5nZVJvdXRlcztcbiAgICB2YXIgZW50ZXJSb3V0ZXMgPSBfY29tcHV0ZUNoYW5nZWRSb3V0ZXMuZW50ZXJSb3V0ZXM7XG5cblxuICAgIHJ1bkxlYXZlSG9va3MobGVhdmVSb3V0ZXMsIHN0YXRlKTtcblxuICAgIC8vIFRlYXIgZG93biBjb25maXJtYXRpb24gaG9va3MgZm9yIGxlZnQgcm91dGVzXG4gICAgbGVhdmVSb3V0ZXMuZmlsdGVyKGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgcmV0dXJuIGVudGVyUm91dGVzLmluZGV4T2Yocm91dGUpID09PSAtMTtcbiAgICB9KS5mb3JFYWNoKHJlbW92ZUxpc3RlbkJlZm9yZUhvb2tzRm9yUm91dGUpO1xuXG4gICAgLy8gY2hhbmdlIGFuZCBlbnRlciBob29rcyBhcmUgcnVuIGluIHNlcmllc1xuICAgIHJ1bkNoYW5nZUhvb2tzKGNoYW5nZVJvdXRlcywgc3RhdGUsIG5leHRTdGF0ZSwgZnVuY3Rpb24gKGVycm9yLCByZWRpcmVjdEluZm8pIHtcbiAgICAgIGlmIChlcnJvciB8fCByZWRpcmVjdEluZm8pIHJldHVybiBoYW5kbGVFcnJvck9yUmVkaXJlY3QoZXJyb3IsIHJlZGlyZWN0SW5mbyk7XG5cbiAgICAgIHJ1bkVudGVySG9va3MoZW50ZXJSb3V0ZXMsIG5leHRTdGF0ZSwgZmluaXNoRW50ZXJIb29rcyk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBmaW5pc2hFbnRlckhvb2tzKGVycm9yLCByZWRpcmVjdEluZm8pIHtcbiAgICAgIGlmIChlcnJvciB8fCByZWRpcmVjdEluZm8pIHJldHVybiBoYW5kbGVFcnJvck9yUmVkaXJlY3QoZXJyb3IsIHJlZGlyZWN0SW5mbyk7XG5cbiAgICAgIC8vIFRPRE86IEZldGNoIGNvbXBvbmVudHMgYWZ0ZXIgc3RhdGUgaXMgdXBkYXRlZC5cbiAgICAgIGdldENvbXBvbmVudHMobmV4dFN0YXRlLCBmdW5jdGlvbiAoZXJyb3IsIGNvbXBvbmVudHMpIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRPRE86IE1ha2UgbWF0Y2ggYSBwdXJlIGZ1bmN0aW9uIGFuZCBoYXZlIHNvbWUgb3RoZXIgQVBJXG4gICAgICAgICAgLy8gZm9yIFwibWF0Y2ggYW5kIHVwZGF0ZSBzdGF0ZVwiLlxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG51bGwsIHN0YXRlID0gX2V4dGVuZHMoe30sIG5leHRTdGF0ZSwgeyBjb21wb25lbnRzOiBjb21wb25lbnRzIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlRXJyb3JPclJlZGlyZWN0KGVycm9yLCByZWRpcmVjdEluZm8pIHtcbiAgICAgIGlmIChlcnJvcikgY2FsbGJhY2soZXJyb3IpO2Vsc2UgY2FsbGJhY2sobnVsbCwgY3JlYXRlTG9jYXRpb25Gcm9tUmVkaXJlY3RJbmZvKHJlZGlyZWN0SW5mbykpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBSb3V0ZUd1aWQgPSAxO1xuXG4gIGZ1bmN0aW9uIGdldFJvdXRlSUQocm91dGUpIHtcbiAgICB2YXIgY3JlYXRlID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIHJldHVybiByb3V0ZS5fX2lkX18gfHwgY3JlYXRlICYmIChyb3V0ZS5fX2lkX18gPSBSb3V0ZUd1aWQrKyk7XG4gIH1cblxuICB2YXIgUm91dGVIb29rcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgZnVuY3Rpb24gZ2V0Um91dGVIb29rc0ZvclJvdXRlcyhyb3V0ZXMpIHtcbiAgICByZXR1cm4gcm91dGVzLnJlZHVjZShmdW5jdGlvbiAoaG9va3MsIHJvdXRlKSB7XG4gICAgICBob29rcy5wdXNoLmFwcGx5KGhvb2tzLCBSb3V0ZUhvb2tzW2dldFJvdXRlSUQocm91dGUpXSk7XG4gICAgICByZXR1cm4gaG9va3M7XG4gICAgfSwgW10pO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhbnNpdGlvbkhvb2sobG9jYXRpb24sIGNhbGxiYWNrKSB7XG4gICAgbWF0Y2hSb3V0ZXMocm91dGVzLCBsb2NhdGlvbiwgZnVuY3Rpb24gKGVycm9yLCBuZXh0U3RhdGUpIHtcbiAgICAgIGlmIChuZXh0U3RhdGUgPT0gbnVsbCkge1xuICAgICAgICAvLyBUT0RPOiBXZSBkaWRuJ3QgYWN0dWFsbHkgbWF0Y2ggYW55dGhpbmcsIGJ1dCBoYW5nXG4gICAgICAgIC8vIG9udG8gZXJyb3IvbmV4dFN0YXRlIHNvIHdlIGRvbid0IGhhdmUgdG8gbWF0Y2hSb3V0ZXNcbiAgICAgICAgLy8gYWdhaW4gaW4gdGhlIGxpc3RlbiBjYWxsYmFjay5cbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBDYWNoZSBzb21lIHN0YXRlIGhlcmUgc28gd2UgZG9uJ3QgaGF2ZSB0b1xuICAgICAgLy8gbWF0Y2hSb3V0ZXMoKSBhZ2FpbiBpbiB0aGUgbGlzdGVuIGNhbGxiYWNrLlxuICAgICAgcGFydGlhbE5leHRTdGF0ZSA9IF9leHRlbmRzKHt9LCBuZXh0U3RhdGUsIHsgbG9jYXRpb246IGxvY2F0aW9uIH0pO1xuXG4gICAgICB2YXIgaG9va3MgPSBnZXRSb3V0ZUhvb2tzRm9yUm91dGVzKGNvbXB1dGVDaGFuZ2VkUm91dGVzKHN0YXRlLCBwYXJ0aWFsTmV4dFN0YXRlKS5sZWF2ZVJvdXRlcyk7XG5cbiAgICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gaG9va3MubGVuZ3RoOyByZXN1bHQgPT0gbnVsbCAmJiBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgLy8gUGFzc2luZyB0aGUgbG9jYXRpb24gYXJnIGhlcmUgaW5kaWNhdGVzIHRvXG4gICAgICAgIC8vIHRoZSB1c2VyIHRoYXQgdGhpcyBpcyBhIHRyYW5zaXRpb24gaG9vay5cbiAgICAgICAgcmVzdWx0ID0gaG9va3NbaV0obG9jYXRpb24pO1xuICAgICAgfVxuXG4gICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IHVudGVzdGFibGUgd2l0aCBLYXJtYSAqL1xuICBmdW5jdGlvbiBiZWZvcmVVbmxvYWRIb29rKCkge1xuICAgIC8vIFN5bmNocm9ub3VzbHkgY2hlY2sgdG8gc2VlIGlmIGFueSByb3V0ZSBob29rcyB3YW50XG4gICAgLy8gdG8gcHJldmVudCB0aGUgY3VycmVudCB3aW5kb3cvdGFiIGZyb20gY2xvc2luZy5cbiAgICBpZiAoc3RhdGUucm91dGVzKSB7XG4gICAgICB2YXIgaG9va3MgPSBnZXRSb3V0ZUhvb2tzRm9yUm91dGVzKHN0YXRlLnJvdXRlcyk7XG5cbiAgICAgIHZhciBtZXNzYWdlID0gdm9pZCAwO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGhvb2tzLmxlbmd0aDsgdHlwZW9mIG1lc3NhZ2UgIT09ICdzdHJpbmcnICYmIGkgPCBsZW47ICsraSkge1xuICAgICAgICAvLyBQYXNzaW5nIG5vIGFyZ3MgaW5kaWNhdGVzIHRvIHRoZSB1c2VyIHRoYXQgdGhpcyBpcyBhXG4gICAgICAgIC8vIGJlZm9yZXVubG9hZCBob29rLiBXZSBkb24ndCBrbm93IHRoZSBuZXh0IGxvY2F0aW9uLlxuICAgICAgICBtZXNzYWdlID0gaG9va3NbaV0oKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfVxuICB9XG5cbiAgdmFyIHVubGlzdGVuQmVmb3JlID0gdm9pZCAwLFxuICAgICAgdW5saXN0ZW5CZWZvcmVVbmxvYWQgPSB2b2lkIDA7XG5cbiAgZnVuY3Rpb24gcmVtb3ZlTGlzdGVuQmVmb3JlSG9va3NGb3JSb3V0ZShyb3V0ZSkge1xuICAgIHZhciByb3V0ZUlEID0gZ2V0Um91dGVJRChyb3V0ZSwgZmFsc2UpO1xuICAgIGlmICghcm91dGVJRCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRlbGV0ZSBSb3V0ZUhvb2tzW3JvdXRlSURdO1xuXG4gICAgaWYgKCFoYXNBbnlQcm9wZXJ0aWVzKFJvdXRlSG9va3MpKSB7XG4gICAgICAvLyB0ZWFyZG93biB0cmFuc2l0aW9uICYgYmVmb3JldW5sb2FkIGhvb2tzXG4gICAgICBpZiAodW5saXN0ZW5CZWZvcmUpIHtcbiAgICAgICAgdW5saXN0ZW5CZWZvcmUoKTtcbiAgICAgICAgdW5saXN0ZW5CZWZvcmUgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAodW5saXN0ZW5CZWZvcmVVbmxvYWQpIHtcbiAgICAgICAgdW5saXN0ZW5CZWZvcmVVbmxvYWQoKTtcbiAgICAgICAgdW5saXN0ZW5CZWZvcmVVbmxvYWQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgdGhlIGdpdmVuIGhvb2sgZnVuY3Rpb24gdG8gcnVuIGJlZm9yZSBsZWF2aW5nIHRoZSBnaXZlbiByb3V0ZS5cbiAgICpcbiAgICogRHVyaW5nIGEgbm9ybWFsIHRyYW5zaXRpb24sIHRoZSBob29rIGZ1bmN0aW9uIHJlY2VpdmVzIHRoZSBuZXh0IGxvY2F0aW9uXG4gICAqIGFzIGl0cyBvbmx5IGFyZ3VtZW50IGFuZCBjYW4gcmV0dXJuIGVpdGhlciBhIHByb21wdCBtZXNzYWdlIChzdHJpbmcpIHRvIHNob3cgdGhlIHVzZXIsXG4gICAqIHRvIG1ha2Ugc3VyZSB0aGV5IHdhbnQgdG8gbGVhdmUgdGhlIHBhZ2U7IG9yIGBmYWxzZWAsIHRvIHByZXZlbnQgdGhlIHRyYW5zaXRpb24uXG4gICAqIEFueSBvdGhlciByZXR1cm4gdmFsdWUgd2lsbCBoYXZlIG5vIGVmZmVjdC5cbiAgICpcbiAgICogRHVyaW5nIHRoZSBiZWZvcmV1bmxvYWQgZXZlbnQgKGluIGJyb3dzZXJzKSB0aGUgaG9vayByZWNlaXZlcyBubyBhcmd1bWVudHMuXG4gICAqIEluIHRoaXMgY2FzZSBpdCBtdXN0IHJldHVybiBhIHByb21wdCBtZXNzYWdlIHRvIHByZXZlbnQgdGhlIHRyYW5zaXRpb24uXG4gICAqXG4gICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IG1heSBiZSB1c2VkIHRvIHVuYmluZCB0aGUgbGlzdGVuZXIuXG4gICAqL1xuICBmdW5jdGlvbiBsaXN0ZW5CZWZvcmVMZWF2aW5nUm91dGUocm91dGUsIGhvb2spIHtcbiAgICAvLyBUT0RPOiBXYXJuIGlmIHRoZXkgcmVnaXN0ZXIgZm9yIGEgcm91dGUgdGhhdCBpc24ndCBjdXJyZW50bHlcbiAgICAvLyBhY3RpdmUuIFRoZXkncmUgcHJvYmFibHkgZG9pbmcgc29tZXRoaW5nIHdyb25nLCBsaWtlIHJlLWNyZWF0aW5nXG4gICAgLy8gcm91dGUgb2JqZWN0cyBvbiBldmVyeSBsb2NhdGlvbiBjaGFuZ2UuXG4gICAgdmFyIHJvdXRlSUQgPSBnZXRSb3V0ZUlEKHJvdXRlKTtcbiAgICB2YXIgaG9va3MgPSBSb3V0ZUhvb2tzW3JvdXRlSURdO1xuXG4gICAgaWYgKCFob29rcykge1xuICAgICAgdmFyIHRoZXJlV2VyZU5vUm91dGVIb29rcyA9ICFoYXNBbnlQcm9wZXJ0aWVzKFJvdXRlSG9va3MpO1xuXG4gICAgICBSb3V0ZUhvb2tzW3JvdXRlSURdID0gW2hvb2tdO1xuXG4gICAgICBpZiAodGhlcmVXZXJlTm9Sb3V0ZUhvb2tzKSB7XG4gICAgICAgIC8vIHNldHVwIHRyYW5zaXRpb24gJiBiZWZvcmV1bmxvYWQgaG9va3NcbiAgICAgICAgdW5saXN0ZW5CZWZvcmUgPSBoaXN0b3J5Lmxpc3RlbkJlZm9yZSh0cmFuc2l0aW9uSG9vayk7XG5cbiAgICAgICAgaWYgKGhpc3RvcnkubGlzdGVuQmVmb3JlVW5sb2FkKSB1bmxpc3RlbkJlZm9yZVVubG9hZCA9IGhpc3RvcnkubGlzdGVuQmVmb3JlVW5sb2FkKGJlZm9yZVVubG9hZEhvb2spO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaG9va3MuaW5kZXhPZihob29rKSA9PT0gLTEpIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdhZGRpbmcgbXVsdGlwbGUgbGVhdmUgaG9va3MgZm9yIHRoZSBzYW1lIHJvdXRlIGlzIGRlcHJlY2F0ZWQ7IG1hbmFnZSBtdWx0aXBsZSBjb25maXJtYXRpb25zIGluIHlvdXIgb3duIGNvZGUgaW5zdGVhZCcpIDogdm9pZCAwO1xuXG4gICAgICAgIGhvb2tzLnB1c2goaG9vayk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBob29rcyA9IFJvdXRlSG9va3Nbcm91dGVJRF07XG5cbiAgICAgIGlmIChob29rcykge1xuICAgICAgICB2YXIgbmV3SG9va3MgPSBob29rcy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbSAhPT0gaG9vaztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG5ld0hvb2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbkJlZm9yZUhvb2tzRm9yUm91dGUocm91dGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFJvdXRlSG9va3Nbcm91dGVJRF0gPSBuZXdIb29rcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgQVBJIGZvciBzdGF0ZWZ1bCBlbnZpcm9ubWVudHMuIEFzIHRoZSBsb2NhdGlvblxuICAgKiBjaGFuZ2VzLCB3ZSB1cGRhdGUgc3RhdGUgYW5kIGNhbGwgdGhlIGxpc3RlbmVyLiBXZSBjYW4gYWxzb1xuICAgKiBncmFjZWZ1bGx5IGhhbmRsZSBlcnJvcnMgYW5kIHJlZGlyZWN0cy5cbiAgICovXG4gIGZ1bmN0aW9uIGxpc3RlbihsaXN0ZW5lcikge1xuICAgIC8vIFRPRE86IE9ubHkgdXNlIGEgc2luZ2xlIGhpc3RvcnkgbGlzdGVuZXIuIE90aGVyd2lzZSB3ZSdsbFxuICAgIC8vIGVuZCB1cCB3aXRoIG11bHRpcGxlIGNvbmN1cnJlbnQgY2FsbHMgdG8gbWF0Y2guXG4gICAgcmV0dXJuIGhpc3RvcnkubGlzdGVuKGZ1bmN0aW9uIChsb2NhdGlvbikge1xuICAgICAgaWYgKHN0YXRlLmxvY2F0aW9uID09PSBsb2NhdGlvbikge1xuICAgICAgICBsaXN0ZW5lcihudWxsLCBzdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXRjaChsb2NhdGlvbiwgZnVuY3Rpb24gKGVycm9yLCByZWRpcmVjdExvY2F0aW9uLCBuZXh0U3RhdGUpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyKGVycm9yKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlZGlyZWN0TG9jYXRpb24pIHtcbiAgICAgICAgICAgIGhpc3RvcnkudHJhbnNpdGlvblRvKHJlZGlyZWN0TG9jYXRpb24pO1xuICAgICAgICAgIH0gZWxzZSBpZiAobmV4dFN0YXRlKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcihudWxsLCBuZXh0U3RhdGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0xvY2F0aW9uIFwiJXNcIiBkaWQgbm90IG1hdGNoIGFueSByb3V0ZXMnLCBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCArIGxvY2F0aW9uLmhhc2gpIDogdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGlzQWN0aXZlOiBpc0FjdGl2ZSxcbiAgICBtYXRjaDogbWF0Y2gsXG4gICAgbGlzdGVuQmVmb3JlTGVhdmluZ1JvdXRlOiBsaXN0ZW5CZWZvcmVMZWF2aW5nUm91dGUsXG4gICAgbGlzdGVuOiBsaXN0ZW5cbiAgfTtcbn1cblxuLy9leHBvcnQgZGVmYXVsdCB1c2VSb3V0ZXMiXX0=