"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// var Inbox = (props) => (

//   <div>
//  <h2 className='nh'>Inbox</h2>

//  List of people who've sent you requests:<br/>

// {props.pplWhoWantToBeFriends.map(function(friend){ return (<InboxEntry accept={props.accept} decline={props.decline}
//   inboxName={friend[0]} requestType={friend[1]} requestMovie={friend[2]} /> )})}

// Request Responses:
// {props.responsesAnswered.map(function(unit){ return <Responses
//   responsesInfo={unit.requestee}
//   responseAnswer={unit.response}
//   responseType={unit.requestTyp}
//   self={unit.requestor}
//   remove={props.remove}
// />})}

// </div>

// );

var Inbox = function (_React$Component) {
  _inherits(Inbox, _React$Component);

  function Inbox(props) {
    _classCallCheck(this, Inbox);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Inbox).call(this, props));

    _this.state = {
      requests: null
    };
    return _this;
  }

  _createClass(Inbox, [{
    key: "render",
    value: function render() {

      var that = this;
      var empty = this.props.pplWhoWantToBeFriends.length === 0 ? "No requests :(" : "";
      var empty2 = this.props.responsesAnswered.length === 0 ? "No news :(" : "";

      return React.createElement(
        "div",
        null,
        React.createElement(
          "h2",
          { className: "nh" },
          "Inbox"
        ),
        "People who've sent you requests",
        React.createElement("br", null),
        empty,
        " ",
        React.createElement("br", null),
        this.props.pplWhoWantToBeFriends.map(function (friend) {
          return React.createElement(InboxEntry, {
            accept: that.props.accept,
            decline: that.props.decline,
            inboxName: friend[0],
            requestType: friend[1],
            requestMovie: friend[2],
            messageInfo: friend[3]
          });
        }),
        "Request Responses",
        React.createElement("br", null),
        empty2,
        this.props.responsesAnswered.map(function (unit) {
          return React.createElement(Responses, {
            responsesInfo: unit.requestee,
            responseAnswer: unit.response,
            responseType: unit.requestTyp,
            movie: unit.movie,
            self: unit.requestor,
            remove: that.props.remove
          });
        })
      );
    }
  }]);

  return Inbox;
}(React.Component);

window.Inbox = Inbox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXlCTSxLOzs7QUFDSixpQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEseUZBQ1gsS0FEVzs7QUFHakIsVUFBSyxLQUFMLEdBQWE7QUFDWCxnQkFBVTtBQURDLEtBQWI7QUFIaUI7QUFNbEI7Ozs7NkJBRVE7O0FBS1AsVUFBSSxPQUFPLElBQVg7QUFDSixVQUFJLFFBQU0sS0FBSyxLQUFMLENBQVcscUJBQVgsQ0FBaUMsTUFBakMsS0FBMEMsQ0FBMUMsR0FBNEMsZ0JBQTVDLEdBQTZELEVBQXZFO0FBQ0EsVUFBSSxTQUFPLEtBQUssS0FBTCxDQUFXLGlCQUFYLENBQTZCLE1BQTdCLEtBQXNDLENBQXRDLEdBQXlDLFlBQXpDLEdBQXNELEVBQWpFOztBQUVJLGFBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQUksV0FBVSxJQUFkO0FBQUE7QUFBQSxTQURGO0FBQUE7QUFHaUMsdUNBSGpDO0FBSUksYUFKSjtBQUFBO0FBSVcsdUNBSlg7QUFLRyxhQUFLLEtBQUwsQ0FBVyxxQkFBWCxDQUFpQyxHQUFqQyxDQUFxQztBQUFBLGlCQUNwQyxvQkFBQyxVQUFEO0FBQ0Usb0JBQVEsS0FBSyxLQUFMLENBQVcsTUFEckI7QUFFRSxxQkFBUyxLQUFLLEtBQUwsQ0FBVyxPQUZ0QjtBQUdFLHVCQUFXLE9BQU8sQ0FBUCxDQUhiO0FBSUUseUJBQWEsT0FBTyxDQUFQLENBSmY7QUFLRSwwQkFBYyxPQUFPLENBQVAsQ0FMaEI7QUFNRSx5QkFBYSxPQUFPLENBQVA7QUFOZixZQURvQztBQUFBLFNBQXJDLENBTEg7QUFBQTtBQWVtQix1Q0FmbkI7QUFnQkcsY0FoQkg7QUFrQkcsYUFBSyxLQUFMLENBQVcsaUJBQVgsQ0FBNkIsR0FBN0IsQ0FBaUMsVUFBQyxJQUFEO0FBQUEsaUJBQ2hDLG9CQUFDLFNBQUQ7QUFDRSwyQkFBZSxLQUFLLFNBRHRCO0FBRUUsNEJBQWdCLEtBQUssUUFGdkI7QUFHRSwwQkFBYyxLQUFLLFVBSHJCO0FBSUUsbUJBQU8sS0FBSyxLQUpkO0FBS0Usa0JBQU0sS0FBSyxTQUxiO0FBTUUsb0JBQVEsS0FBSyxLQUFMLENBQVc7QUFOckIsWUFEZ0M7QUFBQSxTQUFqQztBQWxCSCxPQURGO0FBK0JEOzs7O0VBakRpQixNQUFNLFM7O0FBb0QxQixPQUFPLEtBQVAsR0FBZSxLQUFmIiwiZmlsZSI6IkluYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdmFyIEluYm94ID0gKHByb3BzKSA9PiAoXG4gXG4vLyAgIDxkaXY+XG4vLyAgPGgyIGNsYXNzTmFtZT0nbmgnPkluYm94PC9oMj5cblxuLy8gIExpc3Qgb2YgcGVvcGxlIHdobyd2ZSBzZW50IHlvdSByZXF1ZXN0czo8YnIvPlxuXG5cbi8vIHtwcm9wcy5wcGxXaG9XYW50VG9CZUZyaWVuZHMubWFwKGZ1bmN0aW9uKGZyaWVuZCl7IHJldHVybiAoPEluYm94RW50cnkgYWNjZXB0PXtwcm9wcy5hY2NlcHR9IGRlY2xpbmU9e3Byb3BzLmRlY2xpbmV9IFxuLy8gICBpbmJveE5hbWU9e2ZyaWVuZFswXX0gcmVxdWVzdFR5cGU9e2ZyaWVuZFsxXX0gcmVxdWVzdE1vdmllPXtmcmllbmRbMl19IC8+ICl9KX1cblxuLy8gUmVxdWVzdCBSZXNwb25zZXM6XG4vLyB7cHJvcHMucmVzcG9uc2VzQW5zd2VyZWQubWFwKGZ1bmN0aW9uKHVuaXQpeyByZXR1cm4gPFJlc3BvbnNlcyBcbi8vICAgcmVzcG9uc2VzSW5mbz17dW5pdC5yZXF1ZXN0ZWV9IFxuLy8gICByZXNwb25zZUFuc3dlcj17dW5pdC5yZXNwb25zZX0gXG4vLyAgIHJlc3BvbnNlVHlwZT17dW5pdC5yZXF1ZXN0VHlwfSBcbi8vICAgc2VsZj17dW5pdC5yZXF1ZXN0b3J9XG4vLyAgIHJlbW92ZT17cHJvcHMucmVtb3ZlfVxuLy8gLz59KX1cblxuLy8gPC9kaXY+XG5cblxuLy8gKTtcblxuY2xhc3MgSW5ib3ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICByZXF1ZXN0czogbnVsbFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG5cblxuXG5cbiAgICBsZXQgdGhhdCA9IHRoaXM7XG52YXIgZW1wdHk9dGhpcy5wcm9wcy5wcGxXaG9XYW50VG9CZUZyaWVuZHMubGVuZ3RoPT09MD9cIk5vIHJlcXVlc3RzIDooXCI6XCJcIjtcbnZhciBlbXB0eTI9dGhpcy5wcm9wcy5yZXNwb25zZXNBbnN3ZXJlZC5sZW5ndGg9PT0wPyBcIk5vIG5ld3MgOihcIjpcIlwiO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxoMiBjbGFzc05hbWU9J25oJz5JbmJveDwvaDI+XG5cbiAgICAgICAgUGVvcGxlIHdobyd2ZSBzZW50IHlvdSByZXF1ZXN0czxici8+XG4gICAgICAgICB7ZW1wdHl9IDxici8+XG4gICAgICAgIHt0aGlzLnByb3BzLnBwbFdob1dhbnRUb0JlRnJpZW5kcy5tYXAoZnJpZW5kID0+XG4gICAgICAgICAgPEluYm94RW50cnlcbiAgICAgICAgICAgIGFjY2VwdD17dGhhdC5wcm9wcy5hY2NlcHR9XG4gICAgICAgICAgICBkZWNsaW5lPXt0aGF0LnByb3BzLmRlY2xpbmV9XG4gICAgICAgICAgICBpbmJveE5hbWU9e2ZyaWVuZFswXX1cbiAgICAgICAgICAgIHJlcXVlc3RUeXBlPXtmcmllbmRbMV19XG4gICAgICAgICAgICByZXF1ZXN0TW92aWU9e2ZyaWVuZFsyXX1cbiAgICAgICAgICAgIG1lc3NhZ2VJbmZvPXtmcmllbmRbM119XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgICAgUmVxdWVzdCBSZXNwb25zZXM8YnIvPlxuICAgICAgICB7ZW1wdHkyfVxuXG4gICAgICAgIHt0aGlzLnByb3BzLnJlc3BvbnNlc0Fuc3dlcmVkLm1hcCgodW5pdCkgPT5cbiAgICAgICAgICA8UmVzcG9uc2VzXG4gICAgICAgICAgICByZXNwb25zZXNJbmZvPXt1bml0LnJlcXVlc3RlZX0gXG4gICAgICAgICAgICByZXNwb25zZUFuc3dlcj17dW5pdC5yZXNwb25zZX0gXG4gICAgICAgICAgICByZXNwb25zZVR5cGU9e3VuaXQucmVxdWVzdFR5cH0gXG4gICAgICAgICAgICBtb3ZpZT17dW5pdC5tb3ZpZX1cbiAgICAgICAgICAgIHNlbGY9e3VuaXQucmVxdWVzdG9yfVxuICAgICAgICAgICAgcmVtb3ZlPXt0aGF0LnByb3BzLnJlbW92ZX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG53aW5kb3cuSW5ib3ggPSBJbmJveDtcbiJdfQ==