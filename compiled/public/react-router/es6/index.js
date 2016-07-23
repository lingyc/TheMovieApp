'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMemoryHistory = exports.hashHistory = exports.browserHistory = exports.applyRouterMiddleware = exports.formatPattern = exports.useRouterHistory = exports.match = exports.routerShape = exports.locationShape = exports.PropTypes = exports.RoutingContext = exports.RouterContext = exports.createRoutes = exports.useRoutes = exports.RouteContext = exports.Lifecycle = exports.History = exports.Route = exports.Redirect = exports.IndexRoute = exports.IndexRedirect = exports.withRouter = exports.IndexLink = exports.Link = exports.Router = undefined;

var _RouteUtils = require('./RouteUtils');

Object.defineProperty(exports, 'createRoutes', {
  enumerable: true,
  get: function get() {
    return _RouteUtils.createRoutes;
  }
});

var _PropTypes2 = require('./PropTypes');

Object.defineProperty(exports, 'locationShape', {
  enumerable: true,
  get: function get() {
    return _PropTypes2.locationShape;
  }
});
Object.defineProperty(exports, 'routerShape', {
  enumerable: true,
  get: function get() {
    return _PropTypes2.routerShape;
  }
});

var _PatternUtils = require('./PatternUtils');

Object.defineProperty(exports, 'formatPattern', {
  enumerable: true,
  get: function get() {
    return _PatternUtils.formatPattern;
  }
});

var _Router2 = require('./Router');

var _Router3 = _interopRequireDefault(_Router2);

var _Link2 = require('./Link');

var _Link3 = _interopRequireDefault(_Link2);

var _IndexLink2 = require('./IndexLink');

var _IndexLink3 = _interopRequireDefault(_IndexLink2);

var _withRouter2 = require('./withRouter');

var _withRouter3 = _interopRequireDefault(_withRouter2);

var _IndexRedirect2 = require('./IndexRedirect');

var _IndexRedirect3 = _interopRequireDefault(_IndexRedirect2);

var _IndexRoute2 = require('./IndexRoute');

var _IndexRoute3 = _interopRequireDefault(_IndexRoute2);

var _Redirect2 = require('./Redirect');

var _Redirect3 = _interopRequireDefault(_Redirect2);

var _Route2 = require('./Route');

var _Route3 = _interopRequireDefault(_Route2);

var _History2 = require('./History');

var _History3 = _interopRequireDefault(_History2);

var _Lifecycle2 = require('./Lifecycle');

var _Lifecycle3 = _interopRequireDefault(_Lifecycle2);

var _RouteContext2 = require('./RouteContext');

var _RouteContext3 = _interopRequireDefault(_RouteContext2);

var _useRoutes2 = require('./useRoutes');

var _useRoutes3 = _interopRequireDefault(_useRoutes2);

var _RouterContext2 = require('./RouterContext');

var _RouterContext3 = _interopRequireDefault(_RouterContext2);

var _RoutingContext2 = require('./RoutingContext');

var _RoutingContext3 = _interopRequireDefault(_RoutingContext2);

var _PropTypes3 = _interopRequireDefault(_PropTypes2);

var _match2 = require('./match');

var _match3 = _interopRequireDefault(_match2);

var _useRouterHistory2 = require('./useRouterHistory');

var _useRouterHistory3 = _interopRequireDefault(_useRouterHistory2);

var _applyRouterMiddleware2 = require('./applyRouterMiddleware');

var _applyRouterMiddleware3 = _interopRequireDefault(_applyRouterMiddleware2);

var _browserHistory2 = require('./browserHistory');

var _browserHistory3 = _interopRequireDefault(_browserHistory2);

var _hashHistory2 = require('./hashHistory');

var _hashHistory3 = _interopRequireDefault(_hashHistory2);

var _createMemoryHistory2 = require('./createMemoryHistory');

var _createMemoryHistory3 = _interopRequireDefault(_createMemoryHistory2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Router = _Router3.default; /* components */

exports.Link = _Link3.default;
exports.IndexLink = _IndexLink3.default;
exports.withRouter = _withRouter3.default;

/* components (configuration) */

exports.IndexRedirect = _IndexRedirect3.default;
exports.IndexRoute = _IndexRoute3.default;
exports.Redirect = _Redirect3.default;
exports.Route = _Route3.default;

/* mixins */

exports.History = _History3.default;
exports.Lifecycle = _Lifecycle3.default;
exports.RouteContext = _RouteContext3.default;

/* utils */

exports.useRoutes = _useRoutes3.default;
exports.RouterContext = _RouterContext3.default;
exports.RoutingContext = _RoutingContext3.default;
exports.PropTypes = _PropTypes3.default;
exports.match = _match3.default;
exports.useRouterHistory = _useRouterHistory3.default;
exports.applyRouterMiddleware = _applyRouterMiddleware3.default;

/* histories */

exports.browserHistory = _browserHistory3.default;
exports.hashHistory = _hashHistory3.default;
exports.createMemoryHistory = _createMemoryHistory3.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozt1QkFtQ1MsWTs7OztBQUtUOzs7Ozt1QkFHUyxhOzs7Ozs7dUJBQWUsVzs7Ozs7Ozs7O3lCQU1mLGE7Ozs7QUFoRFQ7Ozs7QUFFQTs7OztBQUVBOzs7O0FBRUE7Ozs7QUFLQTs7OztBQUVBOzs7O0FBRUE7Ozs7QUFFQTs7OztBQUtBOzs7O0FBRUE7Ozs7QUFFQTs7OztBQUtBOzs7O0FBSUE7Ozs7QUFFQTs7Ozs7O0FBTUE7Ozs7QUFFQTs7OztBQUlBOzs7O0FBS0E7Ozs7QUFFQTs7OztBQUVBOzs7Ozs7UUF6RG9CLE0sb0JBRnBCOztRQUlrQixJO1FBRUssUztRQUVDLFU7O0FBRXhCOztRQUcyQixhO1FBRUgsVTtRQUVGLFE7UUFFSCxLOztBQUVuQjs7UUFHcUIsTztRQUVFLFM7UUFFRyxZOztBQUUxQjs7UUFHdUIsUztRQUlJLGE7UUFFQyxjO1FBRUwsUztRQUlKLEs7UUFFVyxnQjtRQUlLLHFCOztBQUVuQzs7UUFHNEIsYztRQUVILFc7UUFFUSxtQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGNvbXBvbmVudHMgKi9cbmltcG9ydCBfUm91dGVyIGZyb20gJy4vUm91dGVyJztcbmV4cG9ydCB7IF9Sb3V0ZXIgYXMgUm91dGVyIH07XG5pbXBvcnQgX0xpbmsgZnJvbSAnLi9MaW5rJztcbmV4cG9ydCB7IF9MaW5rIGFzIExpbmsgfTtcbmltcG9ydCBfSW5kZXhMaW5rIGZyb20gJy4vSW5kZXhMaW5rJztcbmV4cG9ydCB7IF9JbmRleExpbmsgYXMgSW5kZXhMaW5rIH07XG5pbXBvcnQgX3dpdGhSb3V0ZXIgZnJvbSAnLi93aXRoUm91dGVyJztcbmV4cG9ydCB7IF93aXRoUm91dGVyIGFzIHdpdGhSb3V0ZXIgfTtcblxuLyogY29tcG9uZW50cyAoY29uZmlndXJhdGlvbikgKi9cblxuaW1wb3J0IF9JbmRleFJlZGlyZWN0IGZyb20gJy4vSW5kZXhSZWRpcmVjdCc7XG5leHBvcnQgeyBfSW5kZXhSZWRpcmVjdCBhcyBJbmRleFJlZGlyZWN0IH07XG5pbXBvcnQgX0luZGV4Um91dGUgZnJvbSAnLi9JbmRleFJvdXRlJztcbmV4cG9ydCB7IF9JbmRleFJvdXRlIGFzIEluZGV4Um91dGUgfTtcbmltcG9ydCBfUmVkaXJlY3QgZnJvbSAnLi9SZWRpcmVjdCc7XG5leHBvcnQgeyBfUmVkaXJlY3QgYXMgUmVkaXJlY3QgfTtcbmltcG9ydCBfUm91dGUgZnJvbSAnLi9Sb3V0ZSc7XG5leHBvcnQgeyBfUm91dGUgYXMgUm91dGUgfTtcblxuLyogbWl4aW5zICovXG5cbmltcG9ydCBfSGlzdG9yeSBmcm9tICcuL0hpc3RvcnknO1xuZXhwb3J0IHsgX0hpc3RvcnkgYXMgSGlzdG9yeSB9O1xuaW1wb3J0IF9MaWZlY3ljbGUgZnJvbSAnLi9MaWZlY3ljbGUnO1xuZXhwb3J0IHsgX0xpZmVjeWNsZSBhcyBMaWZlY3ljbGUgfTtcbmltcG9ydCBfUm91dGVDb250ZXh0IGZyb20gJy4vUm91dGVDb250ZXh0JztcbmV4cG9ydCB7IF9Sb3V0ZUNvbnRleHQgYXMgUm91dGVDb250ZXh0IH07XG5cbi8qIHV0aWxzICovXG5cbmltcG9ydCBfdXNlUm91dGVzIGZyb20gJy4vdXNlUm91dGVzJztcbmV4cG9ydCB7IF91c2VSb3V0ZXMgYXMgdXNlUm91dGVzIH07XG5cbmV4cG9ydCB7IGNyZWF0ZVJvdXRlcyB9IGZyb20gJy4vUm91dGVVdGlscyc7XG5pbXBvcnQgX1JvdXRlckNvbnRleHQgZnJvbSAnLi9Sb3V0ZXJDb250ZXh0JztcbmV4cG9ydCB7IF9Sb3V0ZXJDb250ZXh0IGFzIFJvdXRlckNvbnRleHQgfTtcbmltcG9ydCBfUm91dGluZ0NvbnRleHQgZnJvbSAnLi9Sb3V0aW5nQ29udGV4dCc7XG5leHBvcnQgeyBfUm91dGluZ0NvbnRleHQgYXMgUm91dGluZ0NvbnRleHQgfTtcbmltcG9ydCBfUHJvcFR5cGVzIGZyb20gJy4vUHJvcFR5cGVzJztcbmV4cG9ydCB7IF9Qcm9wVHlwZXMgYXMgUHJvcFR5cGVzIH07XG5cbmV4cG9ydCB7IGxvY2F0aW9uU2hhcGUsIHJvdXRlclNoYXBlIH0gZnJvbSAnLi9Qcm9wVHlwZXMnO1xuaW1wb3J0IF9tYXRjaCBmcm9tICcuL21hdGNoJztcbmV4cG9ydCB7IF9tYXRjaCBhcyBtYXRjaCB9O1xuaW1wb3J0IF91c2VSb3V0ZXJIaXN0b3J5IGZyb20gJy4vdXNlUm91dGVySGlzdG9yeSc7XG5leHBvcnQgeyBfdXNlUm91dGVySGlzdG9yeSBhcyB1c2VSb3V0ZXJIaXN0b3J5IH07XG5cbmV4cG9ydCB7IGZvcm1hdFBhdHRlcm4gfSBmcm9tICcuL1BhdHRlcm5VdGlscyc7XG5pbXBvcnQgX2FwcGx5Um91dGVyTWlkZGxld2FyZSBmcm9tICcuL2FwcGx5Um91dGVyTWlkZGxld2FyZSc7XG5leHBvcnQgeyBfYXBwbHlSb3V0ZXJNaWRkbGV3YXJlIGFzIGFwcGx5Um91dGVyTWlkZGxld2FyZSB9O1xuXG4vKiBoaXN0b3JpZXMgKi9cblxuaW1wb3J0IF9icm93c2VySGlzdG9yeSBmcm9tICcuL2Jyb3dzZXJIaXN0b3J5JztcbmV4cG9ydCB7IF9icm93c2VySGlzdG9yeSBhcyBicm93c2VySGlzdG9yeSB9O1xuaW1wb3J0IF9oYXNoSGlzdG9yeSBmcm9tICcuL2hhc2hIaXN0b3J5JztcbmV4cG9ydCB7IF9oYXNoSGlzdG9yeSBhcyBoYXNoSGlzdG9yeSB9O1xuaW1wb3J0IF9jcmVhdGVNZW1vcnlIaXN0b3J5IGZyb20gJy4vY3JlYXRlTWVtb3J5SGlzdG9yeSc7XG5leHBvcnQgeyBfY3JlYXRlTWVtb3J5SGlzdG9yeSBhcyBjcmVhdGVNZW1vcnlIaXN0b3J5IH07Il19