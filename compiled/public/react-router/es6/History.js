'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var _InternalPropTypes = require('./InternalPropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A mixin that adds the "history" instance variable to components.
 */
var History = {

  contextTypes: {
    history: _InternalPropTypes.history
  },

  componentWillMount: function componentWillMount() {
    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(false, 'the `History` mixin is deprecated, please access `context.router` with your own `contextTypes`. http://tiny.cc/router-historymixin') : void 0;
    this.history = this.context.history;
  }
};

exports.default = History;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L0hpc3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOzs7QUFHQSxJQUFJLFVBQVU7O0FBRVosZ0JBQWM7QUFDWjtBQURZLEdBRkY7O0FBTVosc0JBQW9CLFNBQVMsa0JBQVQsR0FBOEI7QUFDaEQsWUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3Qyw2QkFBUSxLQUFSLEVBQWUsb0lBQWYsQ0FBeEMsR0FBK0wsS0FBSyxDQUFwTTtBQUNBLFNBQUssT0FBTCxHQUFlLEtBQUssT0FBTCxDQUFhLE9BQTVCO0FBQ0Q7QUFUVyxDQUFkOztrQkFZZSxPIiwiZmlsZSI6Ikhpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgd2FybmluZyBmcm9tICcuL3JvdXRlcldhcm5pbmcnO1xuaW1wb3J0IHsgaGlzdG9yeSB9IGZyb20gJy4vSW50ZXJuYWxQcm9wVHlwZXMnO1xuXG4vKipcbiAqIEEgbWl4aW4gdGhhdCBhZGRzIHRoZSBcImhpc3RvcnlcIiBpbnN0YW5jZSB2YXJpYWJsZSB0byBjb21wb25lbnRzLlxuICovXG52YXIgSGlzdG9yeSA9IHtcblxuICBjb250ZXh0VHlwZXM6IHtcbiAgICBoaXN0b3J5OiBoaXN0b3J5XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICd0aGUgYEhpc3RvcnlgIG1peGluIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSBhY2Nlc3MgYGNvbnRleHQucm91dGVyYCB3aXRoIHlvdXIgb3duIGBjb250ZXh0VHlwZXNgLiBodHRwOi8vdGlueS5jYy9yb3V0ZXItaGlzdG9yeW1peGluJykgOiB2b2lkIDA7XG4gICAgdGhpcy5oaXN0b3J5ID0gdGhpcy5jb250ZXh0Lmhpc3Rvcnk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEhpc3Rvcnk7Il19