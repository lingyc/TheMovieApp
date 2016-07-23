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

var _PropTypes = require('./PropTypes');

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

function _objectWithoutProperties(obj, keys) {
  var target = {};for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
  }return target;
}

var _React$PropTypes = _react2.default.PropTypes;
var bool = _React$PropTypes.bool;
var object = _React$PropTypes.object;
var string = _React$PropTypes.string;
var func = _React$PropTypes.func;
var oneOfType = _React$PropTypes.oneOfType;

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

// TODO: De-duplicate against hasAnyProperties in createTransitionManager.
function isEmptyObject(object) {
  for (var p in object) {
    if (Object.prototype.hasOwnProperty.call(object, p)) return false;
  }return true;
}

function createLocationDescriptor(to, _ref) {
  var query = _ref.query;
  var hash = _ref.hash;
  var state = _ref.state;

  if (query || hash || state) {
    return { pathname: to, query: query, hash: hash, state: state };
  }

  return to;
}

/**
 * A <Link> is used to create an <a> element that links to a route.
 * When that route is active, the link gets the value of its
 * activeClassName prop.
 *
 * For example, assuming you have the following route:
 *
 *   <Route path="/posts/:postID" component={Post} />
 *
 * You could use the following component to link to that route:
 *
 *   <Link to={`/posts/${post.id}`} />
 *
 * Links may pass along location state and/or query string parameters
 * in the state/query props, respectively.
 *
 *   <Link ... query={{ show: true }} state={{ the: 'state' }} />
 */
var Link = _react2.default.createClass({
  displayName: 'Link',

  contextTypes: {
    router: _PropTypes.routerShape
  },

  propTypes: {
    to: oneOfType([string, object]).isRequired,
    query: object,
    hash: string,
    state: object,
    activeStyle: object,
    activeClassName: string,
    onlyActiveOnIndex: bool.isRequired,
    onClick: func,
    target: string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      onlyActiveOnIndex: false,
      style: {}
    };
  },
  handleClick: function handleClick(event) {
    if (this.props.onClick) this.props.onClick(event);

    if (event.defaultPrevented) return;

    !this.context.router ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, '<Link>s rendered outside of a router context cannot navigate.') : (0, _invariant2.default)(false) : void 0;

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) return;

    // If target prop is set (e.g. to "_blank"), let browser handle link.
    /* istanbul ignore if: untestable with Karma */
    if (this.props.target) return;

    event.preventDefault();

    var _props = this.props;
    var to = _props.to;
    var query = _props.query;
    var hash = _props.hash;
    var state = _props.state;

    var location = createLocationDescriptor(to, { query: query, hash: hash, state: state });

    this.context.router.push(location);
  },
  render: function render() {
    var _props2 = this.props;
    var to = _props2.to;
    var query = _props2.query;
    var hash = _props2.hash;
    var state = _props2.state;
    var activeClassName = _props2.activeClassName;
    var activeStyle = _props2.activeStyle;
    var onlyActiveOnIndex = _props2.onlyActiveOnIndex;

    var props = _objectWithoutProperties(_props2, ['to', 'query', 'hash', 'state', 'activeClassName', 'activeStyle', 'onlyActiveOnIndex']);

    process.env.NODE_ENV !== 'production' ? (0, _routerWarning2.default)(!(query || hash || state), 'the `query`, `hash`, and `state` props on `<Link>` are deprecated, use `<Link to={{ pathname, query, hash, state }}/>. http://tiny.cc/router-isActivedeprecated') : void 0;

    // Ignore if rendered outside the context of router, simplifies unit testing.
    var router = this.context.router;

    if (router) {
      var location = createLocationDescriptor(to, { query: query, hash: hash, state: state });
      props.href = router.createHref(location);

      if (activeClassName || activeStyle != null && !isEmptyObject(activeStyle)) {
        if (router.isActive(location, onlyActiveOnIndex)) {
          if (activeClassName) {
            if (props.className) {
              props.className += ' ' + activeClassName;
            } else {
              props.className = activeClassName;
            }
          }

          if (activeStyle) props.style = _extends({}, props.style, activeStyle);
        }
      }
    }

    return _react2.default.createElement('a', _extends({}, props, { onClick: this.handleClick }));
  }
});

exports.default = Link;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L0xpbmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFQQSxJQUFJLFdBQVcsT0FBTyxNQUFQLElBQWlCLFVBQVUsTUFBVixFQUFrQjtBQUFFLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLEdBQXRDLEVBQTJDO0FBQUUsUUFBSSxTQUFTLFVBQVUsQ0FBVixDQUFiLENBQTJCLEtBQUssSUFBSSxHQUFULElBQWdCLE1BQWhCLEVBQXdCO0FBQUUsVUFBSSxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBcUMsTUFBckMsRUFBNkMsR0FBN0MsQ0FBSixFQUF1RDtBQUFFLGVBQU8sR0FBUCxJQUFjLE9BQU8sR0FBUCxDQUFkO0FBQTRCO0FBQUU7QUFBRSxHQUFDLE9BQU8sTUFBUDtBQUFnQixDQUFoUTs7QUFFQSxTQUFTLHdCQUFULENBQWtDLEdBQWxDLEVBQXVDLElBQXZDLEVBQTZDO0FBQUUsTUFBSSxTQUFTLEVBQWIsQ0FBaUIsS0FBSyxJQUFJLENBQVQsSUFBYyxHQUFkLEVBQW1CO0FBQUUsUUFBSSxLQUFLLE9BQUwsQ0FBYSxDQUFiLEtBQW1CLENBQXZCLEVBQTBCLFNBQVUsSUFBSSxDQUFDLE9BQU8sU0FBUCxDQUFpQixjQUFqQixDQUFnQyxJQUFoQyxDQUFxQyxHQUFyQyxFQUEwQyxDQUExQyxDQUFMLEVBQW1ELFNBQVUsT0FBTyxDQUFQLElBQVksSUFBSSxDQUFKLENBQVo7QUFBcUIsR0FBQyxPQUFPLE1BQVA7QUFBZ0I7O0FBTzVOLElBQUksbUJBQW1CLGdCQUFNLFNBQTdCO0FBQ0EsSUFBSSxPQUFPLGlCQUFpQixJQUE1QjtBQUNBLElBQUksU0FBUyxpQkFBaUIsTUFBOUI7QUFDQSxJQUFJLFNBQVMsaUJBQWlCLE1BQTlCO0FBQ0EsSUFBSSxPQUFPLGlC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b0JBQU0sU0FBTixHQUFrQixlQUFsQjtBQUNEO0FBQ0Y7O0FBRUQsY0FBSSxXQUFKLEVBQWlCLE1BQU0sS0FBTixHQUFjLFNBQVMsRUFBVCxFQUFhLE1BQU0sS0FBbkIsRUFBMEIsV0FBMUIsQ0FBZDtBQUNsQjtBQUNGO0FBQ0Y7O0FBRUQsV0FBTyxnQkFBTSxhQUFOLENBQW9CLEdBQXBCLEVBQXlCLFNBQVMsRUFBVCxFQUFhLEtBQWIsRUFBb0IsRUFBRSxTQUFTLEtBQUssV0FBaEIsRUFBcEIsQ0FBekIsQ0FBUDtBQUNEO0FBekYwQixDQUFsQixDQUFYOztrQkE0RmUsSSIsImZpbGUiOiJMaW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKG9iaiwga2V5cykgeyB2YXIgdGFyZ2V0ID0ge307IGZvciAodmFyIGkgaW4gb2JqKSB7IGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGNvbnRpbnVlOyB0YXJnZXRbaV0gPSBvYmpbaV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHdhcm5pbmcgZnJvbSAnLi9yb3V0ZXJXYXJuaW5nJztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcbmltcG9ydCB7IHJvdXRlclNoYXBlIH0gZnJvbSAnLi9Qcm9wVHlwZXMnO1xuXG52YXIgX1JlYWN0JFByb3BUeXBlcyA9IFJlYWN0LlByb3BUeXBlcztcbnZhciBib29sID0gX1JlYWN0JFByb3BUeXBlcy5ib29sO1xudmFyIG9iamVjdCA9IF9SZWFjdCRQcm9wVHlwZXMub2JqZWN0O1xudmFyIHN0cmluZyA9IF9SZWFjdCRQcm9wVHlwZXMuc3RyaW5nO1xudmFyIGZ1bmMgPSBfUmVhY3QkUHJvcFR5cGVzLmZ1bmM7XG52YXIgb25lT2ZUeXBlID0gX1JlYWN0JFByb3BUeXBlcy5vbmVPZlR5cGU7XG5cblxuZnVuY3Rpb24gaXNMZWZ0Q2xpY2tFdmVudChldmVudCkge1xuICByZXR1cm4gZXZlbnQuYnV0dG9uID09PSAwO1xufVxuXG5mdW5jdGlvbiBpc01vZGlmaWVkRXZlbnQoZXZlbnQpIHtcbiAgcmV0dXJuICEhKGV2ZW50Lm1ldGFLZXkgfHwgZXZlbnQuYWx0S2V5IHx8IGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQuc2hpZnRLZXkpO1xufVxuXG4vLyBUT0RPOiBEZS1kdXBsaWNhdGUgYWdhaW5zdCBoYXNBbnlQcm9wZXJ0aWVzIGluIGNyZWF0ZVRyYW5zaXRpb25NYW5hZ2VyLlxuZnVuY3Rpb24gaXNFbXB0eU9iamVjdChvYmplY3QpIHtcbiAgZm9yICh2YXIgcCBpbiBvYmplY3QpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcCkpIHJldHVybiBmYWxzZTtcbiAgfXJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMb2NhdGlvbkRlc2NyaXB0b3IodG8sIF9yZWYpIHtcbiAgdmFyIHF1ZXJ5ID0gX3JlZi5xdWVyeTtcbiAgdmFyIGhhc2ggPSBfcmVmLmhhc2g7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGU7XG5cbiAgaWYgKHF1ZXJ5IHx8IGhhc2ggfHwgc3RhdGUpIHtcbiAgICByZXR1cm4geyBwYXRobmFtZTogdG8sIHF1ZXJ5OiBxdWVyeSwgaGFzaDogaGFzaCwgc3RhdGU6IHN0YXRlIH07XG4gIH1cblxuICByZXR1cm4gdG87XG59XG5cbi8qKlxuICogQSA8TGluaz4gaXMgdXNlZCB0byBjcmVhdGUgYW4gPGE+IGVsZW1lbnQgdGhhdCBsaW5rcyB0byBhIHJvdXRlLlxuICogV2hlbiB0aGF0IHJvdXRlIGlzIGFjdGl2ZSwgdGhlIGxpbmsgZ2V0cyB0aGUgdmFsdWUgb2YgaXRzXG4gKiBhY3RpdmVDbGFzc05hbWUgcHJvcC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgYXNzdW1pbmcgeW91IGhhdmUgdGhlIGZvbGxvd2luZyByb3V0ZTpcbiAqXG4gKiAgIDxSb3V0ZSBwYXRoPVwiL3Bvc3RzLzpwb3N0SURcIiBjb21wb25lbnQ9e1Bvc3R9IC8+XG4gKlxuICogWW91IGNvdWxkIHVzZSB0aGUgZm9sbG93aW5nIGNvbXBvbmVudCB0byBsaW5rIHRvIHRoYXQgcm91dGU6XG4gKlxuICogICA8TGluayB0bz17YC9wb3N0cy8ke3Bvc3QuaWR9YH0gLz5cbiAqXG4gKiBMaW5rcyBtYXkgcGFzcyBhbG9uZyBsb2NhdGlvbiBzdGF0ZSBhbmQvb3IgcXVlcnkgc3RyaW5nIHBhcmFtZXRlcnNcbiAqIGluIHRoZSBzdGF0ZS9xdWVyeSBwcm9wcywgcmVzcGVjdGl2ZWx5LlxuICpcbiAqICAgPExpbmsgLi4uIHF1ZXJ5PXt7IHNob3c6IHRydWUgfX0gc3RhdGU9e3sgdGhlOiAnc3RhdGUnIH19IC8+XG4gKi9cbnZhciBMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0xpbmsnLFxuXG5cbiAgY29udGV4dFR5cGVzOiB7XG4gICAgcm91dGVyOiByb3V0ZXJTaGFwZVxuICB9LFxuXG4gIHByb3BUeXBlczoge1xuICAgIHRvOiBvbmVPZlR5cGUoW3N0cmluZywgb2JqZWN0XSkuaXNSZXF1aXJlZCxcbiAgICBxdWVyeTogb2JqZWN0LFxuICAgIGhhc2g6IHN0cmluZyxcbiAgICBzdGF0ZTogb2JqZWN0LFxuICAgIGFjdGl2ZVN0eWxlOiBvYmplY3QsXG4gICAgYWN0aXZlQ2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgb25seUFjdGl2ZU9uSW5kZXg6IGJvb2wuaXNSZXF1aXJlZCxcbiAgICBvbkNsaWNrOiBmdW5jLFxuICAgIHRhcmdldDogc3RyaW5nXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9ubHlBY3RpdmVPbkluZGV4OiBmYWxzZSxcbiAgICAgIHN0eWxlOiB7fVxuICAgIH07XG4gIH0sXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGlmICh0aGlzLnByb3BzLm9uQ2xpY2spIHRoaXMucHJvcHMub25DbGljayhldmVudCk7XG5cbiAgICBpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuXG4gICAgIXRoaXMuY29udGV4dC5yb3V0ZXIgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnPExpbms+cyByZW5kZXJlZCBvdXRzaWRlIG9mIGEgcm91dGVyIGNvbnRleHQgY2Fubm90IG5hdmlnYXRlLicpIDogaW52YXJpYW50KGZhbHNlKSA6IHZvaWQgMDtcblxuICAgIGlmIChpc01vZGlmaWVkRXZlbnQoZXZlbnQpIHx8ICFpc0xlZnRDbGlja0V2ZW50KGV2ZW50KSkgcmV0dXJuO1xuXG4gICAgLy8gSWYgdGFyZ2V0IHByb3AgaXMgc2V0IChlLmcuIHRvIFwiX2JsYW5rXCIpLCBsZXQgYnJvd3NlciBoYW5kbGUgbGluay5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWY6IHVudGVzdGFibGUgd2l0aCBLYXJtYSAqL1xuICAgIGlmICh0aGlzLnByb3BzLnRhcmdldCkgcmV0dXJuO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciBfcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHZhciB0byA9IF9wcm9wcy50bztcbiAgICB2YXIgcXVlcnkgPSBfcHJvcHMucXVlcnk7XG4gICAgdmFyIGhhc2ggPSBfcHJvcHMuaGFzaDtcbiAgICB2YXIgc3RhdGUgPSBfcHJvcHMuc3RhdGU7XG5cbiAgICB2YXIgbG9jYXRpb24gPSBjcmVhdGVMb2NhdGlvbkRlc2NyaXB0b3IodG8sIHsgcXVlcnk6IHF1ZXJ5LCBoYXNoOiBoYXNoLCBzdGF0ZTogc3RhdGUgfSk7XG5cbiAgICB0aGlzLmNvbnRleHQucm91dGVyLnB1c2gobG9jYXRpb24pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgX3Byb3BzMiA9IHRoaXMucHJvcHM7XG4gICAgdmFyIHRvID0gX3Byb3BzMi50bztcbiAgICB2YXIgcXVlcnkgPSBfcHJvcHMyLnF1ZXJ5O1xuICAgIHZhciBoYXNoID0gX3Byb3BzMi5oYXNoO1xuICAgIHZhciBzdGF0ZSA9IF9wcm9wczIuc3RhdGU7XG4gICAgdmFyIGFjdGl2ZUNsYXNzTmFtZSA9IF9wcm9wczIuYWN0aXZlQ2xhc3NOYW1lO1xuICAgIHZhciBhY3RpdmVTdHlsZSA9IF9wcm9wczIuYWN0aXZlU3R5bGU7XG4gICAgdmFyIG9ubHlBY3RpdmVPbkluZGV4ID0gX3Byb3BzMi5vbmx5QWN0aXZlT25JbmRleDtcblxuICAgIHZhciBwcm9wcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfcHJvcHMyLCBbJ3RvJywgJ3F1ZXJ5JywgJ2hhc2gnLCAnc3RhdGUnLCAnYWN0aXZlQ2xhc3NOYW1lJywgJ2FjdGl2ZVN0eWxlJywgJ29ubHlBY3RpdmVPbkluZGV4J10pO1xuXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoIShxdWVyeSB8fCBoYXNoIHx8IHN0YXRlKSwgJ3RoZSBgcXVlcnlgLCBgaGFzaGAsIGFuZCBgc3RhdGVgIHByb3BzIG9uIGA8TGluaz5gIGFyZSBkZXByZWNhdGVkLCB1c2UgYDxMaW5rIHRvPXt7IHBhdGhuYW1lLCBxdWVyeSwgaGFzaCwgc3RhdGUgfX0vPi4gaHR0cDovL3RpbnkuY2Mvcm91dGVyLWlzQWN0aXZlZGVwcmVjYXRlZCcpIDogdm9pZCAwO1xuXG4gICAgLy8gSWdub3JlIGlmIHJlbmRlcmVkIG91dHNpZGUgdGhlIGNvbnRleHQgb2Ygcm91dGVyLCBzaW1wbGlmaWVzIHVuaXQgdGVzdGluZy5cbiAgICB2YXIgcm91dGVyID0gdGhpcy5jb250ZXh0LnJvdXRlcjtcblxuXG4gICAgaWYgKHJvdXRlcikge1xuICAgICAgdmFyIGxvY2F0aW9uID0gY3JlYXRlTG9jYXRpb25EZXNjcmlwdG9yKHRvLCB7IHF1ZXJ5OiBxdWVyeSwgaGFzaDogaGFzaCwgc3RhdGU6IHN0YXRlIH0pO1xuICAgICAgcHJvcHMuaHJlZiA9IHJvdXRlci5jcmVhdGVIcmVmKGxvY2F0aW9uKTtcblxuICAgICAgaWYgKGFjdGl2ZUNsYXNzTmFtZSB8fCBhY3RpdmVTdHlsZSAhPSBudWxsICYmICFpc0VtcHR5T2JqZWN0KGFjdGl2ZVN0eWxlKSkge1xuICAgICAgICBpZiAocm91dGVyLmlzQWN0aXZlKGxvY2F0aW9uLCBvbmx5QWN0aXZlT25JbmRleCkpIHtcbiAgICAgICAgICBpZiAoYWN0aXZlQ2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBpZiAocHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgIHByb3BzLmNsYXNzTmFtZSArPSAnICcgKyBhY3RpdmVDbGFzc05hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwcm9wcy5jbGFzc05hbWUgPSBhY3RpdmVDbGFzc05hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGFjdGl2ZVN0eWxlKSBwcm9wcy5zdHlsZSA9IF9leHRlbmRzKHt9LCBwcm9wcy5zdHlsZSwgYWN0aXZlU3R5bGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2EnLCBfZXh0ZW5kcyh7fSwgcHJvcHMsIHsgb25DbGljazogdGhpcy5oYW5kbGVDbGljayB9KSk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMaW5rOyJdfQ==