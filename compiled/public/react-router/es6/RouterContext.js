"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _deprecateObjectProperties = require("./deprecateObjectProperties");

var _deprecateObjectProperties2 = _interopRequireDefault(_deprecateObjectProperties);

var _getRouteParams = require("./getRouteParams");

var _getRouteParams2 = _interopRequireDefault(_getRouteParams);

var _RouteUtils = require("./RouteUtils");

var _routerWarning = require("./routerWarning");

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _React$PropTypes = _react2.default.PropTypes;
var array = _React$PropTypes.array;
var func = _React$PropTypes.func;
var object = _React$PropTypes.object;

/**
 * A <RouterContext> renders the component tree for a given router state
 * and sets the history object and the current location in context.
 */

var RouterContext = _react2.default.createClass({
  displayName: 'RouterContext',

  propTypes: {
    history: object,
    router: object.isRequired,
    location: object.isRequired,
    routes: array.isRequired,
    params: object.isRequired,
    components: array.isRequired,
    createElement: func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      createElement: _react2.default.createElement
    };
  },

  childContextTypes: {
    history: object,
    location: object.isRequired,
    router: object.isRequired
  },

  getChildContext: function getChildContext() {
    var _props = this.props;
    var router = _props.router;
    var history = _props.history;
    var location = _props.location;

    if (!router) {
      process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, '`<RouterContext>` expects a `router` rather than a `history`') : void 0;

      router = _extends({}, history, {
        setRouteLeaveHook: history.listenBeforeLeavingRoute
      });
      delete router.listenBeforeLeavingRoute;
    }

    if (process.env.NODE_ENV !== 'production') {
      location = (0, _deprecateObjectProperties2.default)(location, '`context.location` is deprecated, please use a route component\'s `props.location` instead. http://tiny.cc/router-accessinglocation');
    }

    return { history: history, location: location, router: router };
  },
  createElement: function createElement(component, props) {
    return component == null ? null : this.props.createElement(component, props);
  },
  render: function render() {
    var _this = this;

    var _props2 = this.props;
    var history = _props2.history;
    var location = _props2.location;
    var routes = _props2.routes;
    var params = _props2.params;
    var components = _props2.components;

    var element = null;

    if (components) {
      element = components.reduceRight(function (element, components, index) {
        if (components == null) return element; // Don't create new children; use the grandchildren.

        var route = routes[index];
        var routeParams = (0, _getRouteParams2.default)(route, params);
        var props = {
          history: history,
          location: location,
          params: params,
          route: route,
          routeParams: routeParams,
          routes: routes
        };

        if ((0, _RouteUtils.isReactChildren)(element)) {
          props.children = element;
        } else if (element) {
          for (var prop in element) {
            if (Object.prototype.hasOwnProperty.call(element, prop)) props[prop] = element[prop];
          }
        }

        if ((typeof components === 'undefined' ? 'undefined' : _typeof(components)) === 'object') {
          var elements = {};

          for (var key in components) {
            if (Object.prototype.hasOwnProperty.call(components, key)) {
              // Pass through the key as a prop to createElement to allow
              // custom createElement functions to know which named component
              // they're rendering, for e.g. matching up to fetched data.
              elements[key] = _this.createElement(components[key], _extends({
                key: key }, props));
            }
          }

          return elements;
        }

        return _this.createElement(components, props);
      }, element);
    }

    !(element === null || element === false || _react2.default.isValidElement(element)) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'The root route must render a single element') : (0, _invariant2.default)(false) : void 0;

    return element;
  }
});

exports.default = RouterContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L1JvdXRlckNvbnRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFJQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFWQSxJQUFJLFVBQVUsT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLFNBQU8sT0FBTyxRQUFkLE1BQTJCLFFBQTNELEdBQXNFLFVBQVUsR0FBVixFQUFlO0FBQUUsZ0JBQWMsR0FBZCwwQ0FBYyxHQUFkO0FBQW9CLENBQTNHLEdBQThHLFVBQVUsR0FBVixFQUFlO0FBQUUsU0FBTyxPQUFPLE9BQU8sTUFBUCxLQUFrQixVQUF6QixJQUF1QyxJQUFJLFdBQUosS0FBb0IsTUFBM0QsR0FBb0UsUUFBcEUsVUFBc0YsR0FBdEYsMENBQXNGLEdBQXRGLENBQVA7QUFBbUcsQ0FBaFA7O0FBRUEsSUFBSSxXQUFXLE9BQU8sTUFBUCxJQUFpQixVQUFVLE1BQVYsRUFBa0I7QUFBRSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUFFLFFBQUksU0FBUyxVQUFVLENBQVYsQ0FBYixDQUEyQixLQUFLLElBQUksR0FBVCxJQUFnQixNQUFoQixFQUF3QjtBQUFFLFVBQUksT0FBTyxTQUFQLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLENBQXFDLE1BQXJDLEVBQTZDLEdBQTdDLENBQUosRUFBdUQ7QUFBRSxlQUFPLEdBQVAsSUFBYyxPQUFPLEdBQVAsQ0FBZDtBQUE0QjtBQUFFO0FBQUUsR0FBQyxPQUFPLE1BQVA7QUFBZ0IsQ0FBaFE7O0FBVUEsSUFBSSxtQkFBbUIsZ0JBQU0sU0FBN0I7QUFDQSxJQUFJLFFBQVEsaUJBQWlCLEtBQTdCO0FBQ0EsSUFBSSxPQUFPLGlCQUFpQixJQUE1QjtBQUNBLElBQUksU0FBUyxpQkFBaUIsTUFBOUI7O0FBRUE7Ozs7O0FBS0EsSUFB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TUFBTSxJQUFOLElBQWMsUUFBUSxJQUFSLENBQWQ7QUFDMUQ7QUFDRjs7QUFFRCxZQUFJLENBQUMsT0FBTyxVQUFQLEtBQXNCLFdBQXRCLEdBQW9DLFdBQXBDLEdBQWtELFFBQVEsVUFBUixDQUFuRCxNQUE0RSxRQUFoRixFQUEwRjtBQUN4RixjQUFJLFdBQVcsRUFBZjs7QUFFQSxlQUFLLElBQUksR0FBVCxJQUFnQixVQUFoQixFQUE0QjtBQUMxQixnQkFBSSxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBcUMsVUFBckMsRUFBaUQsR0FBakQsQ0FBSixFQUEyRDtBQUN6RDtBQUNBO0FBQ0E7QUFDQSx1QkFBUyxHQUFULElBQWdCLE1BQU0sYUFBTixDQUFvQixXQUFXLEdBQVgsQ0FBcEIsRUFBcUMsU0FBUztBQUM1RCxxQkFBSyxHQUR1RCxFQUFULEVBQ3ZDLEtBRHVDLENBQXJDLENBQWhCO0FBRUQ7QUFDRjs7QUFFRCxpQkFBTyxRQUFQO0FBQ0Q7O0FBRUQsZUFBTyxNQUFNLGFBQU4sQ0FBb0IsVUFBcEIsRUFBZ0MsS0FBaEMsQ0FBUDtBQUNELE9BdkNTLEVBdUNQLE9BdkNPLENBQVY7QUF3Q0Q7O0FBRUQsTUFBRSxZQUFZLElBQVosSUFBb0IsWUFBWSxLQUFoQyxJQUF5QyxnQkFBTSxjQUFOLENBQXFCLE9BQXJCLENBQTNDLElBQTRFLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MseUJBQVUsS0FBVixFQUFpQiw2Q0FBakIsQ0FBeEMsR0FBMEcseUJBQVUsS0FBVixDQUF0TCxHQUF5TSxLQUFLLENBQTlNOztBQUVBLFdBQU8sT0FBUDtBQUNEO0FBN0dtQyxDQUFsQixDQUFwQjs7a0JBZ0hlLGEiLCJmaWxlIjoiUm91dGVyQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgZGVwcmVjYXRlT2JqZWN0UHJvcGVydGllcyBmcm9tICcuL2RlcHJlY2F0ZU9iamVjdFByb3BlcnRpZXMnO1xuaW1wb3J0IGdldFJvdXRlUGFyYW1zIGZyb20gJy4vZ2V0Um91dGVQYXJhbXMnO1xuaW1wb3J0IHsgaXNSZWFjdENoaWxkcmVuIH0gZnJvbSAnLi9Sb3V0ZVV0aWxzJztcbmltcG9ydCB3YXJuaW5nIGZyb20gJy4vcm91dGVyV2FybmluZyc7XG5cbnZhciBfUmVhY3QkUHJvcFR5cGVzID0gUmVhY3QuUHJvcFR5cGVzO1xudmFyIGFycmF5ID0gX1JlYWN0JFByb3BUeXBlcy5hcnJheTtcbnZhciBmdW5jID0gX1JlYWN0JFByb3BUeXBlcy5mdW5jO1xudmFyIG9iamVjdCA9IF9SZWFjdCRQcm9wVHlwZXMub2JqZWN0O1xuXG4vKipcbiAqIEEgPFJvdXRlckNvbnRleHQ+IHJlbmRlcnMgdGhlIGNvbXBvbmVudCB0cmVlIGZvciBhIGdpdmVuIHJvdXRlciBzdGF0ZVxuICogYW5kIHNldHMgdGhlIGhpc3Rvcnkgb2JqZWN0IGFuZCB0aGUgY3VycmVudCBsb2NhdGlvbiBpbiBjb250ZXh0LlxuICovXG5cbnZhciBSb3V0ZXJDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1JvdXRlckNvbnRleHQnLFxuXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgaGlzdG9yeTogb2JqZWN0LFxuICAgIHJvdXRlcjogb2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbG9jYXRpb246IG9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHJvdXRlczogYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBwYXJhbXM6IG9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbXBvbmVudHM6IGFycmF5LmlzUmVxdWlyZWQsXG4gICAgY3JlYXRlRWxlbWVudDogZnVuYy5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNyZWF0ZUVsZW1lbnQ6IFJlYWN0LmNyZWF0ZUVsZW1lbnRcbiAgICB9O1xuICB9LFxuXG5cbiAgY2hpbGRDb250ZXh0VHlwZXM6IHtcbiAgICBoaXN0b3J5OiBvYmplY3QsXG4gICAgbG9jYXRpb246IG9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHJvdXRlcjogb2JqZWN0LmlzUmVxdWlyZWRcbiAgfSxcblxuICBnZXRDaGlsZENvbnRleHQ6IGZ1bmN0aW9uIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICB2YXIgX3Byb3BzID0gdGhpcy5wcm9wcztcbiAgICB2YXIgcm91dGVyID0gX3Byb3BzLnJvdXRlcjtcbiAgICB2YXIgaGlzdG9yeSA9IF9wcm9wcy5oaXN0b3J5O1xuICAgIHZhciBsb2NhdGlvbiA9IF9wcm9wcy5sb2NhdGlvbjtcblxuICAgIGlmICghcm91dGVyKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ2A8Um91dGVyQ29udGV4dD5gIGV4cGVjdHMgYSBgcm91dGVyYCByYXRoZXIgdGhhbiBhIGBoaXN0b3J5YCcpIDogdm9pZCAwO1xuXG4gICAgICByb3V0ZXIgPSBfZXh0ZW5kcyh7fSwgaGlzdG9yeSwge1xuICAgICAgICBzZXRSb3V0ZUxlYXZlSG9vazogaGlzdG9yeS5saXN0ZW5CZWZvcmVMZWF2aW5nUm91dGVcbiAgICAgIH0pO1xuICAgICAgZGVsZXRlIHJvdXRlci5saXN0ZW5CZWZvcmVMZWF2aW5nUm91dGU7XG4gICAgfVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGxvY2F0aW9uID0gZGVwcmVjYXRlT2JqZWN0UHJvcGVydGllcyhsb2NhdGlvbiwgJ2Bjb250ZXh0LmxvY2F0aW9uYCBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGEgcm91dGUgY29tcG9uZW50XFwncyBgcHJvcHMubG9jYXRpb25gIGluc3RlYWQuIGh0dHA6Ly90aW55LmNjL3JvdXRlci1hY2Nlc3Npbmdsb2NhdGlvbicpO1xuICAgIH1cblxuICAgIHJldHVybiB7IGhpc3Rvcnk6IGhpc3RvcnksIGxvY2F0aW9uOiBsb2NhdGlvbiwgcm91dGVyOiByb3V0ZXIgfTtcbiAgfSxcbiAgY3JlYXRlRWxlbWVudDogZnVuY3Rpb24gY3JlYXRlRWxlbWVudChjb21wb25lbnQsIHByb3BzKSB7XG4gICAgcmV0dXJuIGNvbXBvbmVudCA9PSBudWxsID8gbnVsbCA6IHRoaXMucHJvcHMuY3JlYXRlRWxlbWVudChjb21wb25lbnQsIHByb3BzKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBfcHJvcHMyID0gdGhpcy5wcm9wcztcbiAgICB2YXIgaGlzdG9yeSA9IF9wcm9wczIuaGlzdG9yeTtcbiAgICB2YXIgbG9jYXRpb24gPSBfcHJvcHMyLmxvY2F0aW9uO1xuICAgIHZhciByb3V0ZXMgPSBfcHJvcHMyLnJvdXRlcztcbiAgICB2YXIgcGFyYW1zID0gX3Byb3BzMi5wYXJhbXM7XG4gICAgdmFyIGNvbXBvbmVudHMgPSBfcHJvcHMyLmNvbXBvbmVudHM7XG5cbiAgICB2YXIgZWxlbWVudCA9IG51bGw7XG5cbiAgICBpZiAoY29tcG9uZW50cykge1xuICAgICAgZWxlbWVudCA9IGNvbXBvbmVudHMucmVkdWNlUmlnaHQoZnVuY3Rpb24gKGVsZW1lbnQsIGNvbXBvbmVudHMsIGluZGV4KSB7XG4gICAgICAgIGlmIChjb21wb25lbnRzID09IG51bGwpIHJldHVybiBlbGVtZW50OyAvLyBEb24ndCBjcmVhdGUgbmV3IGNoaWxkcmVuOyB1c2UgdGhlIGdyYW5kY2hpbGRyZW4uXG5cbiAgICAgICAgdmFyIHJvdXRlID0gcm91dGVzW2luZGV4XTtcbiAgICAgICAgdmFyIHJvdXRlUGFyYW1zID0gZ2V0Um91dGVQYXJhbXMocm91dGUsIHBhcmFtcyk7XG4gICAgICAgIHZhciBwcm9wcyA9IHtcbiAgICAgICAgICBoaXN0b3J5OiBoaXN0b3J5LFxuICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcbiAgICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgICByb3V0ZTogcm91dGUsXG4gICAgICAgICAgcm91dGVQYXJhbXM6IHJvdXRlUGFyYW1zLFxuICAgICAgICAgIHJvdXRlczogcm91dGVzXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGlzUmVhY3RDaGlsZHJlbihlbGVtZW50KSkge1xuICAgICAgICAgIHByb3BzLmNoaWxkcmVuID0gZWxlbWVudDtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBlbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGVsZW1lbnQsIHByb3ApKSBwcm9wc1twcm9wXSA9IGVsZW1lbnRbcHJvcF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCh0eXBlb2YgY29tcG9uZW50cyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoY29tcG9uZW50cykpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHZhciBlbGVtZW50cyA9IHt9O1xuXG4gICAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29tcG9uZW50cywga2V5KSkge1xuICAgICAgICAgICAgICAvLyBQYXNzIHRocm91Z2ggdGhlIGtleSBhcyBhIHByb3AgdG8gY3JlYXRlRWxlbWVudCB0byBhbGxvd1xuICAgICAgICAgICAgICAvLyBjdXN0b20gY3JlYXRlRWxlbWVudCBmdW5jdGlvbnMgdG8ga25vdyB3aGljaCBuYW1lZCBjb21wb25lbnRcbiAgICAgICAgICAgICAgLy8gdGhleSdyZSByZW5kZXJpbmcsIGZvciBlLmcuIG1hdGNoaW5nIHVwIHRvIGZldGNoZWQgZGF0YS5cbiAgICAgICAgICAgICAgZWxlbWVudHNba2V5XSA9IF90aGlzLmNyZWF0ZUVsZW1lbnQoY29tcG9uZW50c1trZXldLCBfZXh0ZW5kcyh7XG4gICAgICAgICAgICAgICAga2V5OiBrZXkgfSwgcHJvcHMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3RoaXMuY3JlYXRlRWxlbWVudChjb21wb25lbnRzLCBwcm9wcyk7XG4gICAgICB9LCBlbGVtZW50KTtcbiAgICB9XG5cbiAgICAhKGVsZW1lbnQgPT09IG51bGwgfHwgZWxlbWVudCA9PT0gZmFsc2UgfHwgUmVhY3QuaXNWYWxpZEVsZW1lbnQoZWxlbWVudCkpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1RoZSByb290IHJvdXRlIG11c3QgcmVuZGVyIGEgc2luZ2xlIGVsZW1lbnQnKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFJvdXRlckNvbnRleHQ7Il19