'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeStateWithLocation;

var _deprecateObjectProperties = require('./deprecateObjectProperties');

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

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

function makeStateWithLocation(state, location) {
  if (process.env.NODE_ENV !== 'production' && _deprecateObjectProperties.canUseMembrane) {
    var stateWithLocation = _extends({}, state);

    // I don't use deprecateObjectProperties here because I want to keep the
    // same code path between development and production, in that we just
    // assign extra properties to the copy of the state object in both cases.

    var _loop = function _loop(prop) {
      if (!Object.prototype.hasOwnProperty.call(location, prop)) {
        return 'continue';
      }

      Object.defineProperty(stateWithLocation, prop, {
        get: function get() {
          process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'Accessing location properties directly from the first argument to `getComponent`, `getComponents`, `getChildRoutes`, and `getIndexRoute` is deprecated. That argument is now the router state (`nextState` or `partialNextState`) rather than the location. To access the location, use `nextState.location` or `partialNextState.location`.') : void 0;
          return location[prop];
        }
      });
    };

    for (var prop in location) {
      var _ret = _loop(prop);

      if (_ret === 'continue') continue;
    }

    return stateWithLocation;
  }

  return _extends({}, state, location);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L21ha2VTdGF0ZVdpdGhMb2NhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztrQkFLd0IscUI7O0FBSHhCOztBQUNBOzs7Ozs7QUFIQSxJQUFJLFdBQVcsT0FBTyxNQUFQLElBQWlCLFVBQVUsTUFBVixFQUFrQjtBQUFFLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQUUsUUFBSSxTQUFTLFVBQVUsQ0FBVixDQUFiLENBQTJCLEtBQUssSUFBSSxHQUFULElBQWdCLE1BQWhCLEVBQXdCO0FBQUUsVUFBSSxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBcUMsTUFBckMsRUFBNkMsR0FBN0MsQ0FBSixFQUF1RDtBQUFFLGVBQU8sR0FBUCxJQUFjLE9BQU8sR0FBUCxDQUFkO0FBQTRCO0FBQUU7QUFBRSxHQUFDLE9BQU8sTUFBUDtBQUFnQixDQUFoUTs7QUFLZSxTQUFTLHFCQUFULENBQStCLEtBQS9CLEVBQXNDLFFBQXRDLEVBQWdEO0FBQzdELE1BQUksUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6Qiw2Q0FBSixFQUE2RDtBQUMzRCxRQUFJLG9CQUFvQixTQUFTLEVBQVQsRUFBYSxLQUFiLENBQXhCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxRQUFJLFFBQVEsU0FBUyxLQUFULENBQWUsSUFBZixFQUFxQjtBQUMvQixVQUFJLENBQUMsT0FBTyxTQUFQLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLENBQXFDLFFBQXJDLEVBQStDLElBQS9DLENBQUwsRUFBMkQ7QUFDekQsZUFBTyxVQUFQO0FBQ0Q7O0FBRUQsYUFBTyxjQUFQLENBQXNCLGlCQUF0QixFQUF5QyxJQUF6QyxFQUErQztBQUM3QyxhQUFLLFNBQVMsR0FBVCxHQUFlO0FBQ2xCLGtCQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLDZCQUFRLEtBQVIsRUFBZSw4VUFBZixDQUF4QyxHQUF5WSxLQUFLLENBQTlZO0FBQ0EsaUJBQU8sU0FBUyxJQUFULENBQVA7QUFDRDtBQUo0QyxPQUEvQztBQU1ELEtBWEQ7O0FBYUEsU0FBSyxJQUFJLElBQVQsSUFBaUIsUUFBakIsRUFBMkI7QUFDekIsVUFBSSxPQUFPLE1BQU0sSUFBTixDQUFYOztBQUVBLFVBQUksU0FBUyxVQUFiLEVBQXlCO0FBQzFCOztBQUVELFdBQU8saUJBQVA7QUFDRDs7QUFFRCxTQUFPLFNBQVMsRUFBVCxFQUFhLEtBQWIsRUFBb0IsUUFBcEIsQ0FBUDtBQUNEIiwiZmlsZSI6Im1ha2VTdGF0ZVdpdGhMb2NhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmltcG9ydCB7IGNhblVzZU1lbWJyYW5lIH0gZnJvbSAnLi9kZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzJztcbmltcG9ydCB3YXJuaW5nIGZyb20gJy4vcm91dGVyV2FybmluZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2VTdGF0ZVdpdGhMb2NhdGlvbihzdGF0ZSwgbG9jYXRpb24pIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgY2FuVXNlTWVtYnJhbmUpIHtcbiAgICB2YXIgc3RhdGVXaXRoTG9jYXRpb24gPSBfZXh0ZW5kcyh7fSwgc3RhdGUpO1xuXG4gICAgLy8gSSBkb24ndCB1c2UgZGVwcmVjYXRlT2JqZWN0UHJvcGVydGllcyBoZXJlIGJlY2F1c2UgSSB3YW50IHRvIGtlZXAgdGhlXG4gICAgLy8gc2FtZSBjb2RlIHBhdGggYmV0d2VlbiBkZXZlbG9wbWVudCBhbmQgcHJvZHVjdGlvbiwgaW4gdGhhdCB3ZSBqdXN0XG4gICAgLy8gYXNzaWduIGV4dHJhIHByb3BlcnRpZXMgdG8gdGhlIGNvcHkgb2YgdGhlIHN0YXRlIG9iamVjdCBpbiBib3RoIGNhc2VzLlxuXG4gICAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AocHJvcCkge1xuICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobG9jYXRpb24sIHByb3ApKSB7XG4gICAgICAgIHJldHVybiAnY29udGludWUnO1xuICAgICAgfVxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc3RhdGVXaXRoTG9jYXRpb24sIHByb3AsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdBY2Nlc3NpbmcgbG9jYXRpb24gcHJvcGVydGllcyBkaXJlY3RseSBmcm9tIHRoZSBmaXJzdCBhcmd1bWVudCB0byBgZ2V0Q29tcG9uZW50YCwgYGdldENvbXBvbmVudHNgLCBgZ2V0Q2hpbGRSb3V0ZXNgLCBhbmQgYGdldEluZGV4Um91dGVgIGlzIGRlcHJlY2F0ZWQuIFRoYXQgYXJndW1lbnQgaXMgbm93IHRoZSByb3V0ZXIgc3RhdGUgKGBuZXh0U3RhdGVgIG9yIGBwYXJ0aWFsTmV4dFN0YXRlYCkgcmF0aGVyIHRoYW4gdGhlIGxvY2F0aW9uLiBUbyBhY2Nlc3MgdGhlIGxvY2F0aW9uLCB1c2UgYG5leHRTdGF0ZS5sb2NhdGlvbmAgb3IgYHBhcnRpYWxOZXh0U3RhdGUubG9jYXRpb25gLicpIDogdm9pZCAwO1xuICAgICAgICAgIHJldHVybiBsb2NhdGlvbltwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZvciAodmFyIHByb3AgaW4gbG9jYXRpb24pIHtcbiAgICAgIHZhciBfcmV0ID0gX2xvb3AocHJvcCk7XG5cbiAgICAgIGlmIChfcmV0ID09PSAnY29udGludWUnKSBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVXaXRoTG9jYXRpb247XG4gIH1cblxuICByZXR1cm4gX2V4dGVuZHMoe30sIHN0YXRlLCBsb2NhdGlvbik7XG59Il19