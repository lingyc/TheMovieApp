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

var _Redirect = require('./Redirect');

var _Redirect2 = _interopRequireDefault(_Redirect);

var _InternalPropTypes = require('./InternalPropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _React$PropTypes = _react2.default.PropTypes;
var string = _React$PropTypes.string;
var object = _React$PropTypes.object;

/**
 * An <IndexRedirect> is used to redirect from an indexRoute.
 */

var IndexRedirect = _react2.default.createClass({
  displayName: 'IndexRedirect',

  statics: {
    createRouteFromReactElement: function createRouteFromReactElement(element, parentRoute) {
      /* istanbul ignore else: sanity check */
      if (parentRoute) {
        parentRoute.indexRoute = _Redirect2.default.createRouteFromReactElement(element);
      } else {
        process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'An <IndexRedirect> does not make sense at the root of your route config') : void 0;
      }
    }
  },

  propTypes: {
    to: string.isRequired,
    query: object,
    state: object,
    onEnter: _InternalPropTypes.falsy,
    children: _InternalPropTypes.falsy
  },

  /* istanbul ignore next: sanity check */
  render: function render() {
    !false ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<IndexRedirect> elements are for router configuration only and should not be rendered') : (0, _invariant2.default)(false) : void 0;
  }
});

exports.default = IndexRedirect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L0luZGV4UmVkaXJlY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLElBQUksbUJBQW1CLGdCQUFNLFNBQTdCO0FBQ0EsSUFBSSxTQUFTLGlCQUFpQixNQUE5QjtBQUNBLElBQUksU0FBUyxpQkFBaUIsTUFBOUI7O0FBRUE7Ozs7QUFJQSxJQUFJLGdCQUFnQixnQkFBTSxXQUFOLENBQWtCO0FBQ3BDLGVBQWEsZUFEdUI7O0FBSXBDLFdBQVM7QUFDUCxpQ0FBNkIsU0FBUywyQkFBVCxDQUFxQyxPQUFyQyxFQUE4QyxXQUE5QyxFQUEyRDtBQUN0RjtBQUNBLFVBQUksV0FBSixFQUFpQjtBQUNmLG9CQUFZLFVBQVosR0FBeUIsbUJBQVMsMkJBQVQsQ0FBcUMsT0FBckMsQ0FBekI7QUFDRCxPQUZELE1BRU87QUFDTCxnQkFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3Qyw2QkFBUSxLQUFSLEVBQWUseUVBQWYsQ0FBeEMsR0FBb0ksS0FBSyxDQUF6STtBQUNEO0FBQ0Y7QUFSTSxHQUoyQjs7QUFlcEMsYUFBVztBQUNULFFBQUksT0FBTyxVQURGO0FBRVQsV0FBTyxNQUZFO0FBR1QsV0FBTyxNQUhFO0FBSVQscUNBSlM7QUFLVDtBQUxTLEdBZnlCOztBQXVCcEM7QUFDQSxVQUFRLFNBQVMsTUFBVCxHQUFrQjtBQUN4QixLQUFDLEtBQUQsR0FBUyxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLHlCQUFVLEtBQVYsRUFBaUIsdUZBQWpCLENBQXhDLEdBQW9KLHlCQUFVLEtBQVYsQ0FBN0osR0FBZ0wsS0FBSyxDQUFyTDtBQUNEO0FBMUJtQyxDQUFsQixDQUFwQjs7a0JBNkJlLGEiLCJmaWxlIjoiSW5kZXhSZWRpcmVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgd2FybmluZyBmcm9tICcuL3JvdXRlcldhcm5pbmcnO1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuaW1wb3J0IFJlZGlyZWN0IGZyb20gJy4vUmVkaXJlY3QnO1xuaW1wb3J0IHsgZmFsc3kgfSBmcm9tICcuL0ludGVybmFsUHJvcFR5cGVzJztcblxudmFyIF9SZWFjdCRQcm9wVHlwZXMgPSBSZWFjdC5Qcm9wVHlwZXM7XG52YXIgc3RyaW5nID0gX1JlYWN0JFByb3BUeXBlcy5zdHJpbmc7XG52YXIgb2JqZWN0ID0gX1JlYWN0JFByb3BUeXBlcy5vYmplY3Q7XG5cbi8qKlxuICogQW4gPEluZGV4UmVkaXJlY3Q+IGlzIHVzZWQgdG8gcmVkaXJlY3QgZnJvbSBhbiBpbmRleFJvdXRlLlxuICovXG5cbnZhciBJbmRleFJlZGlyZWN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0luZGV4UmVkaXJlY3QnLFxuXG5cbiAgc3RhdGljczoge1xuICAgIGNyZWF0ZVJvdXRlRnJvbVJlYWN0RWxlbWVudDogZnVuY3Rpb24gY3JlYXRlUm91dGVGcm9tUmVhY3RFbGVtZW50KGVsZW1lbnQsIHBhcmVudFJvdXRlKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZTogc2FuaXR5IGNoZWNrICovXG4gICAgICBpZiAocGFyZW50Um91dGUpIHtcbiAgICAgICAgcGFyZW50Um91dGUuaW5kZXhSb3V0ZSA9IFJlZGlyZWN0LmNyZWF0ZVJvdXRlRnJvbVJlYWN0RWxlbWVudChlbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnQW4gPEluZGV4UmVkaXJlY3Q+IGRvZXMgbm90IG1ha2Ugc2Vuc2UgYXQgdGhlIHJvb3Qgb2YgeW91ciByb3V0ZSBjb25maWcnKSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgdG86IHN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHF1ZXJ5OiBvYmplY3QsXG4gICAgc3RhdGU6IG9iamVjdCxcbiAgICBvbkVudGVyOiBmYWxzeSxcbiAgICBjaGlsZHJlbjogZmFsc3lcbiAgfSxcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogc2FuaXR5IGNoZWNrICovXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICFmYWxzZSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICc8SW5kZXhSZWRpcmVjdD4gZWxlbWVudHMgYXJlIGZvciByb3V0ZXIgY29uZmlndXJhdGlvbiBvbmx5IGFuZCBzaG91bGQgbm90IGJlIHJlbmRlcmVkJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdm9pZCAwO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSW5kZXhSZWRpcmVjdDsiXX0=