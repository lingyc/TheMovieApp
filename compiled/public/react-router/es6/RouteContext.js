'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var object = _react2.default.PropTypes.object;

/**
 * The RouteContext mixin provides a convenient way for route
 * components to set the route in context. This is needed for
 * routes that render elements that want to use the Lifecycle
 * mixin to prevent transitions.
 */

var RouteContext = {

  propTypes: {
    route: object.isRequired
  },

  childContextTypes: {
    route: object.isRequired
  },

  getChildContext: function getChildContext() {
    return {
      route: this.props.route
    };
  },
  componentWillMount: function componentWillMount() {
    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'The `RouteContext` mixin is deprecated. You can provide `this.props.route` on context with your own `contextTypes`. http://tiny.cc/router-routecontextmixin') : void 0;
  }
};

exports.default = RouteContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L1JvdXRlQ29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFJLFNBQVMsZ0JBQU0sU0FBTixDQUFnQixNQUE3Qjs7QUFFQTs7Ozs7OztBQU9BLElBQUksZUFBZTs7QUFFakIsYUFBVztBQUNULFdBQU8sT0FBTztBQURMLEdBRk07O0FBTWpCLHFCQUFtQjtBQUNqQixXQUFPLE9BQU87QUFERyxHQU5GOztBQVVqQixtQkFBaUIsU0FBUyxlQUFULEdBQTJCO0FBQzFDLFdBQU87QUFDTCxhQUFPLEtBQUssS0FBTCxDQUFXO0FBRGIsS0FBUDtBQUdELEdBZGdCO0FBZWpCLHNCQUFvQixTQUFTLGtCQUFULEdBQThCO0FBQ2hELFlBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MsNkJBQVEsS0FBUixFQUFlLDZKQUFmLENBQXhDLEdBQXdOLEtBQUssQ0FBN047QUFDRDtBQWpCZ0IsQ0FBbkI7O2tCQW9CZSxZIiwiZmlsZSI6IlJvdXRlQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB3YXJuaW5nIGZyb20gJy4vcm91dGVyV2FybmluZyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG52YXIgb2JqZWN0ID0gUmVhY3QuUHJvcFR5cGVzLm9iamVjdDtcblxuLyoqXG4gKiBUaGUgUm91dGVDb250ZXh0IG1peGluIHByb3ZpZGVzIGEgY29udmVuaWVudCB3YXkgZm9yIHJvdXRlXG4gKiBjb21wb25lbnRzIHRvIHNldCB0aGUgcm91dGUgaW4gY29udGV4dC4gVGhpcyBpcyBuZWVkZWQgZm9yXG4gKiByb3V0ZXMgdGhhdCByZW5kZXIgZWxlbWVudHMgdGhhdCB3YW50IHRvIHVzZSB0aGUgTGlmZWN5Y2xlXG4gKiBtaXhpbiB0byBwcmV2ZW50IHRyYW5zaXRpb25zLlxuICovXG5cbnZhciBSb3V0ZUNvbnRleHQgPSB7XG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgcm91dGU6IG9iamVjdC5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgY2hpbGRDb250ZXh0VHlwZXM6IHtcbiAgICByb3V0ZTogb2JqZWN0LmlzUmVxdWlyZWRcbiAgfSxcblxuICBnZXRDaGlsZENvbnRleHQ6IGZ1bmN0aW9uIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm91dGU6IHRoaXMucHJvcHMucm91dGVcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ1RoZSBgUm91dGVDb250ZXh0YCBtaXhpbiBpcyBkZXByZWNhdGVkLiBZb3UgY2FuIHByb3ZpZGUgYHRoaXMucHJvcHMucm91dGVgIG9uIGNvbnRleHQgd2l0aCB5b3VyIG93biBgY29udGV4dFR5cGVzYC4gaHR0cDovL3RpbnkuY2Mvcm91dGVyLXJvdXRlY29udGV4dG1peGluJykgOiB2b2lkIDA7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJvdXRlQ29udGV4dDsiXX0=