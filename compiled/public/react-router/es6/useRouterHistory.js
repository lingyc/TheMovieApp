'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useRouterHistory;

var _useQueries = require('history/lib/useQueries');

var _useQueries2 = _interopRequireDefault(_useQueries);

var _useBasename = require('history/lib/useBasename');

var _useBasename2 = _interopRequireDefault(_useBasename);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useRouterHistory(createHistory) {
  return function (options) {
    var history = (0, _useQueries2.default)((0, _useBasename2.default)(createHistory))(options);
    history.__v2_compatible__ = true;
    return history;
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L3VzZVJvdXRlckhpc3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBR3dCLGdCOztBQUh4Qjs7OztBQUNBOzs7Ozs7QUFFZSxTQUFTLGdCQUFULENBQTBCLGFBQTFCLEVBQXlDO0FBQ3RELFNBQU8sVUFBVSxPQUFWLEVBQW1CO0FBQ3hCLFFBQUksVUFBVSwwQkFBVywyQkFBWSxhQUFaLENBQVgsRUFBdUMsT0FBdkMsQ0FBZDtBQUNBLFlBQVEsaUJBQVIsR0FBNEIsSUFBNUI7QUFDQSxXQUFPLE9BQVA7QUFDRCxHQUpEO0FBS0QiLCJmaWxlIjoidXNlUm91dGVySGlzdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1c2VRdWVyaWVzIGZyb20gJ2hpc3RvcnkvbGliL3VzZVF1ZXJpZXMnO1xuaW1wb3J0IHVzZUJhc2VuYW1lIGZyb20gJ2hpc3RvcnkvbGliL3VzZUJhc2VuYW1lJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlUm91dGVySGlzdG9yeShjcmVhdGVIaXN0b3J5KSB7XG4gIHJldHVybiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBoaXN0b3J5ID0gdXNlUXVlcmllcyh1c2VCYXNlbmFtZShjcmVhdGVIaXN0b3J5KSkob3B0aW9ucyk7XG4gICAgaGlzdG9yeS5fX3YyX2NvbXBhdGlibGVfXyA9IHRydWU7XG4gICAgcmV0dXJuIGhpc3Rvcnk7XG4gIH07XG59Il19