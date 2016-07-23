'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _RouteUtils = require('./RouteUtils');

var _InternalPropTypes = require('./InternalPropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var func = _react2.default.PropTypes.func;

/**
 * An <IndexRoute> is used to specify its parent's <Route indexRoute> in
 * a JSX route config.
 */

var IndexRoute = _react2.default.createClass({
  displayName: 'IndexRoute',

  statics: {
    createRouteFromReactElement: function createRouteFromReactElement(element, parentRoute) {
      /* istanbul ignore else: sanity check */
      if (parentRoute) {
        parentRoute.indexRoute = (0, _RouteUtils.createRouteFromReactElement)(element);
      } else {
        process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'An <IndexRoute> does not make sense at the root of your route config') : void 0;
      }
    }
  },

  propTypes: {
    path: _InternalPropTypes.falsy,
    component: _InternalPropTypes.component,
    components: _InternalPropTypes.components,
    getComponent: func,
    getComponents: func
  },

  /* istanbul ignore next: sanity check */
  render: function render() {
    !false ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<IndexRoute> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
  }
});

exports.default = IndexRoute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L0luZGV4Um91dGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFJLE9BQU8sZ0JBQU0sU0FBTixDQUFnQixJQUEzQjs7QUFFQTs7Ozs7QUFLQSxJQUFJLGFBQWEsZ0JBQU0sV0FBTixDQUFrQjtBQUNqQyxlQUFhLFlBRG9COztBQUlqQyxXQUFTO0FBQ1AsaUNBQTZCLFNBQVMsMkJBQVQsQ0FBcUMsT0FBckMsRUFBOEMsV0FBOUMsRUFBMkQ7QUFDdEY7QUFDQSxVQUFJLFdBQUosRUFBaUI7QUFDZixvQkFBWSxVQUFaLEdBQXlCLDZDQUE2QixPQUE3QixDQUF6QjtBQUNELE9BRkQsTUFFTztBQUNMLGdCQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLDZCQUFRLEtBQVIsRUFBZSxzRUFBZixDQUF4QyxHQUFpSSxLQUFLLENBQXRJO0FBQ0Q7QUFDRjtBQVJNLEdBSndCOztBQWVqQyxhQUFXO0FBQ1Qsa0NBRFM7QUFFVCwyQ0FGUztBQUdULDZDQUhTO0FBSVQsa0JBQWMsSUFKTDtBQUtULG1CQUFlO0FBTE4sR0Fmc0I7O0FBdUJqQztBQUNBLFVBQVEsU0FBUyxNQUFULEdBQWtCO0FBQ3hCLEtBQUMsS0FBRCxHQUFTLFFBQVEsR0FBUixDQUFZLFFBQVosS0FBeUIsWUFBekIsR0FBd0MseUJBQVUsS0FBVixFQUFpQixvRkFBakIsQ0FBeEMsR0FBaUoseUJBQVUsS0FBVixDQUExSixHQUE2SyxLQUFLLENBQWxMO0FBQ0Q7QUExQmdDLENBQWxCLENBQWpCOztrQkE2QmUsVSIsImZpbGUiOiJJbmRleFJvdXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB3YXJuaW5nIGZyb20gJy4vcm91dGVyV2FybmluZyc7XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgeyBjcmVhdGVSb3V0ZUZyb21SZWFjdEVsZW1lbnQgYXMgX2NyZWF0ZVJvdXRlRnJvbVJlYWN0RWxlbWVudCB9IGZyb20gJy4vUm91dGVVdGlscyc7XG5pbXBvcnQgeyBjb21wb25lbnQsIGNvbXBvbmVudHMsIGZhbHN5IH0gZnJvbSAnLi9JbnRlcm5hbFByb3BUeXBlcyc7XG5cbnZhciBmdW5jID0gUmVhY3QuUHJvcFR5cGVzLmZ1bmM7XG5cbi8qKlxuICogQW4gPEluZGV4Um91dGU+IGlzIHVzZWQgdG8gc3BlY2lmeSBpdHMgcGFyZW50J3MgPFJvdXRlIGluZGV4Um91dGU+IGluXG4gKiBhIEpTWCByb3V0ZSBjb25maWcuXG4gKi9cblxudmFyIEluZGV4Um91dGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnSW5kZXhSb3V0ZScsXG5cblxuICBzdGF0aWNzOiB7XG4gICAgY3JlYXRlUm91dGVGcm9tUmVhY3RFbGVtZW50OiBmdW5jdGlvbiBjcmVhdGVSb3V0ZUZyb21SZWFjdEVsZW1lbnQoZWxlbWVudCwgcGFyZW50Um91dGUpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlOiBzYW5pdHkgY2hlY2sgKi9cbiAgICAgIGlmIChwYXJlbnRSb3V0ZSkge1xuICAgICAgICBwYXJlbnRSb3V0ZS5pbmRleFJvdXRlID0gX2NyZWF0ZVJvdXRlRnJvbVJlYWN0RWxlbWVudChlbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnQW4gPEluZGV4Um91dGU+IGRvZXMgbm90IG1ha2Ugc2Vuc2UgYXQgdGhlIHJvb3Qgb2YgeW91ciByb3V0ZSBjb25maWcnKSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgcGF0aDogZmFsc3ksXG4gICAgY29tcG9uZW50OiBjb21wb25lbnQsXG4gICAgY29tcG9uZW50czogY29tcG9uZW50cyxcbiAgICBnZXRDb21wb25lbnQ6IGZ1bmMsXG4gICAgZ2V0Q29tcG9uZW50czogZnVuY1xuICB9LFxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBzYW5pdHkgY2hlY2sgKi9cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgIWZhbHNlID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJzxJbmRleFJvdXRlPiBlbGVtZW50cyBhcmUgZm9yIHJvdXRlciBjb25maWd1cmF0aW9uIG9ubHkgYW5kIHNob3VsZCBub3QgYmUgcmVuZGVyZWQnKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBJbmRleFJvdXRlOyJdfQ==