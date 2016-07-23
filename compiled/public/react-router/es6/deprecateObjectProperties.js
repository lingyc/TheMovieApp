'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canUseMembrane = undefined;

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canUseMembrane = exports.canUseMembrane = false;

// No-op by default.
var deprecateObjectProperties = function deprecateObjectProperties(object) {
  return object;
};

if (process.env.NODE_ENV !== 'production') {
  try {
    if (Object.defineProperty({}, 'x', {
      get: function get() {
        return true;
      }
    }).x) {
      exports.canUseMembrane = canUseMembrane = true;
    }
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */

  if (canUseMembrane) {
    deprecateObjectProperties = function deprecateObjectProperties(object, message) {
      // Wrap the deprecated object in a membrane to warn on property access.
      var membrane = {};

      var _loop = function _loop(prop) {
        if (!Object.prototype.hasOwnProperty.call(object, prop)) {
          return 'continue';
        }

        if (typeof object[prop] === 'function') {
          // Can't use fat arrow here because of use of arguments below.
          membrane[prop] = function () {
            process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, message) : void 0;
            return object[prop].apply(object, arguments);
          };
          return 'continue';
        }

        // These properties are non-enumerable to prevent React dev tools from
        // seeing them and causing spurious warnings when accessing them. In
        // principle this could be done with a proxy, but support for the
        // ownKeys trap on proxies is not universal, even among browsers that
        // otherwise support proxies.
        Object.defineProperty(membrane, prop, {
          get: function get() {
            process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, message) : void 0;
            return object[prop];
          }
        });
      };

      for (var prop in object) {
        var _ret = _loop(prop);

        if (_ret === 'continue') continue;
      }

      return membrane;
    };
  }
}

exports.default = deprecateObjectProperties;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L2RlcHJlY2F0ZU9iamVjdFByb3BlcnRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7QUFFTyxJQUFJLDBDQUFpQixLQUFyQjs7QUFFUDtBQUNBLElBQUksNEJBQTRCLFNBQVMseUJBQVQsQ0FBbUMsTUFBbkMsRUFBMkM7QUFDekUsU0FBTyxNQUFQO0FBQ0QsQ0FGRDs7QUFJQSxJQUFJLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBN0IsRUFBMkM7QUFDekMsTUFBSTtBQUNGLFFBQUksT0FBTyxjQUFQLENBQXNCLEVBQXRCLEVBQTBCLEdBQTFCLEVBQStCO0FBQ2pDLFdBQUssU0FBUyxHQUFULEdBQWU7QUFDbEIsZUFBTyxJQUFQO0FBQ0Q7QUFIZ0MsS0FBL0IsRUFJRCxDQUpILEVBSU07QUFDSixjQWRLLGNBY0wsb0JBQWlCLElBQWpCO0FBQ0Q7QUFDRDtBQUNELEdBVEQsQ0FTRSxPQUFPLENBQVAsRUFBVSxDQUFFO0FBQ2Q7O0FBRUEsTUFBSSxjQUFKLEVBQW9CO0FBQ2xCLGdDQUE0QixTQUFTLHlCQUFULENBQW1DLE1BQW5DLEVBQTJDLE9BQTNDLEVBQW9EO0FBQzlFO0FBQ0EsVUFBSSxXQUFXLEVBQWY7O0FBRUEsVUFBSSxRQUFRLFNBQVMsS0FBVCxDQUFlLElBQWYsRUFBcUI7QUFDL0IsWUFBSSxDQUFDLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxNQUFyQyxFQUE2QyxJQUE3QyxDQUFMLEVBQXlEO0FBQ3ZELGlCQUFPLFVBQVA7QUFDRDs7QUFFRCxZQUFJLE9BQU8sT0FBTyxJQUFQLENBQVAsS0FBd0IsVUFBNUIsRUFBd0M7QUFDdEM7QUFDQSxtQkFBUyxJQUFULElBQWlCLFlBQVk7QUFDM0Isb0JBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsNkJBQVEsS0FBUixFQUFlLE9BQWYsQ0FBeEMsR0FBa0UsS0FBSyxDQUF2RTtBQUNBLG1CQUFPLE9BQU8sSUFBUCxFQUFhLEtBQWIsQ0FBbUIsTUFBbkIsRUFBMkIsU0FBM0IsQ0FBUDtBQUNELFdBSEQ7QUFJQSxpQkFBTyxVQUFQO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU8sY0FBUCxDQUFzQixRQUF0QixFQUFnQyxJQUFoQyxFQUFzQztBQUNwQyxlQUFLLFNBQVMsR0FBVCxHQUFlO0FBQ2xCLG9CQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLDZCQUFRLEtBQVIsRUFBZSxPQUFmLENBQXhDLEdBQWtFLEtBQUssQ0FBdkU7QUFDQSxtQkFBTyxPQUFPLElBQVAsQ0FBUDtBQUNEO0FBSm1DLFNBQXRDO0FBTUQsT0F6QkQ7O0FBMkJBLFdBQUssSUFBSSxJQUFULElBQWlCLE1BQWpCLEVBQXlCO0FBQ3ZCLFlBQUksT0FBTyxNQUFNLElBQU4sQ0FBWDs7QUFFQSxZQUFJLFNBQVMsVUFBYixFQUF5QjtBQUMxQjs7QUFFRCxhQUFPLFFBQVA7QUFDRCxLQXRDRDtBQXVDRDtBQUNGOztrQkFFYyx5QiIsImZpbGUiOiJkZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHdhcm5pbmcgZnJvbSAnLi9yb3V0ZXJXYXJuaW5nJztcblxuZXhwb3J0IHZhciBjYW5Vc2VNZW1icmFuZSA9IGZhbHNlO1xuXG4vLyBOby1vcCBieSBkZWZhdWx0LlxudmFyIGRlcHJlY2F0ZU9iamVjdFByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzKG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0O1xufTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdHJ5IHtcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAneCcsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KS54KSB7XG4gICAgICBjYW5Vc2VNZW1icmFuZSA9IHRydWU7XG4gICAgfVxuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWVtcHR5ICovXG4gIH0gY2F0Y2ggKGUpIHt9XG4gIC8qIGVzbGludC1lbmFibGUgbm8tZW1wdHkgKi9cblxuICBpZiAoY2FuVXNlTWVtYnJhbmUpIHtcbiAgICBkZXByZWNhdGVPYmplY3RQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVwcmVjYXRlT2JqZWN0UHJvcGVydGllcyhvYmplY3QsIG1lc3NhZ2UpIHtcbiAgICAgIC8vIFdyYXAgdGhlIGRlcHJlY2F0ZWQgb2JqZWN0IGluIGEgbWVtYnJhbmUgdG8gd2FybiBvbiBwcm9wZXJ0eSBhY2Nlc3MuXG4gICAgICB2YXIgbWVtYnJhbmUgPSB7fTtcblxuICAgICAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AocHJvcCkge1xuICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3ApKSB7XG4gICAgICAgICAgcmV0dXJuICdjb250aW51ZSc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG9iamVjdFtwcm9wXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIC8vIENhbid0IHVzZSBmYXQgYXJyb3cgaGVyZSBiZWNhdXNlIG9mIHVzZSBvZiBhcmd1bWVudHMgYmVsb3cuXG4gICAgICAgICAgbWVtYnJhbmVbcHJvcF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgbWVzc2FnZSkgOiB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0W3Byb3BdLmFwcGx5KG9iamVjdCwgYXJndW1lbnRzKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiAnY29udGludWUnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlc2UgcHJvcGVydGllcyBhcmUgbm9uLWVudW1lcmFibGUgdG8gcHJldmVudCBSZWFjdCBkZXYgdG9vbHMgZnJvbVxuICAgICAgICAvLyBzZWVpbmcgdGhlbSBhbmQgY2F1c2luZyBzcHVyaW91cyB3YXJuaW5ncyB3aGVuIGFjY2Vzc2luZyB0aGVtLiBJblxuICAgICAgICAvLyBwcmluY2lwbGUgdGhpcyBjb3VsZCBiZSBkb25lIHdpdGggYSBwcm94eSwgYnV0IHN1cHBvcnQgZm9yIHRoZVxuICAgICAgICAvLyBvd25LZXlzIHRyYXAgb24gcHJveGllcyBpcyBub3QgdW5pdmVyc2FsLCBldmVuIGFtb25nIGJyb3dzZXJzIHRoYXRcbiAgICAgICAgLy8gb3RoZXJ3aXNlIHN1cHBvcnQgcHJveGllcy5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG1lbWJyYW5lLCBwcm9wLCB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgbWVzc2FnZSkgOiB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0W3Byb3BdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBwcm9wIGluIG9iamVjdCkge1xuICAgICAgICB2YXIgX3JldCA9IF9sb29wKHByb3ApO1xuXG4gICAgICAgIGlmIChfcmV0ID09PSAnY29udGludWUnKSBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1lbWJyYW5lO1xuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVwcmVjYXRlT2JqZWN0UHJvcGVydGllczsiXX0=