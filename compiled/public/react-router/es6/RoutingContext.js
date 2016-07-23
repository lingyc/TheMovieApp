'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RouterContext = require('./RouterContext');

var _RouterContext2 = _interopRequireDefault(_RouterContext);

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RoutingContext = _react2.default.createClass({
  displayName: 'RoutingContext',
  componentWillMount: function componentWillMount() {
    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, '`RoutingContext` has been renamed to `RouterContext`. Please use `import { RouterContext } from \'react-router\'`. http://tiny.cc/router-routercontext') : void 0;
  },
  render: function render() {
    return _react2.default.createElement(_RouterContext2.default, this.props);
  }
});

exports.default = RoutingContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L1JvdXRpbmdDb250ZXh0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSSxpQkFBaUIsZ0JBQU0sV0FBTixDQUFrQjtBQUNyQyxlQUFhLGdCQUR3QjtBQUVyQyxzQkFBb0IsU0FBUyxrQkFBVCxHQUE4QjtBQUNoRCxZQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLFlBQXpCLEdBQXdDLDZCQUFRLEtBQVIsRUFBZSx3SkFBZixDQUF4QyxHQUFtTixLQUFLLENBQXhOO0FBQ0QsR0FKb0M7QUFLckMsVUFBUSxTQUFTLE1BQVQsR0FBa0I7QUFDeEIsV0FBTyxnQkFBTSxhQUFOLDBCQUFtQyxLQUFLLEtBQXhDLENBQVA7QUFDRDtBQVBvQyxDQUFsQixDQUFyQjs7a0JBVWUsYyIsImZpbGUiOiJSb3V0aW5nQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUm91dGVyQ29udGV4dCBmcm9tICcuL1JvdXRlckNvbnRleHQnO1xuaW1wb3J0IHdhcm5pbmcgZnJvbSAnLi9yb3V0ZXJXYXJuaW5nJztcblxudmFyIFJvdXRpbmdDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1JvdXRpbmdDb250ZXh0JyxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdgUm91dGluZ0NvbnRleHRgIGhhcyBiZWVuIHJlbmFtZWQgdG8gYFJvdXRlckNvbnRleHRgLiBQbGVhc2UgdXNlIGBpbXBvcnQgeyBSb3V0ZXJDb250ZXh0IH0gZnJvbSBcXCdyZWFjdC1yb3V0ZXJcXCdgLiBodHRwOi8vdGlueS5jYy9yb3V0ZXItcm91dGVyY29udGV4dCcpIDogdm9pZCAwO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZXJDb250ZXh0LCB0aGlzLnByb3BzKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFJvdXRpbmdDb250ZXh0OyJdfQ==