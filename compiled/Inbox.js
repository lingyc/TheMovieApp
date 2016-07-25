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
        { onClick: function onClick() {
            return console.log(that.props);
          } },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL0luYm94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXlCTSxLOzs7QUFDSixpQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEseUZBQ1gsS0FEVzs7QUFHakIsVUFBSyxLQUFMLEdBQWE7QUFDWCxnQkFBVTtBQURDLEtBQWI7QUFIaUI7QUFNbEI7Ozs7NkJBRVE7O0FBS1AsVUFBSSxPQUFPLElBQVg7QUFDSixVQUFJLFFBQU0sS0FBSyxLQUFMLENBQVcscUJBQVgsQ0FBaUMsTUFBakMsS0FBMEMsQ0FBMUMsR0FBNEMsZ0JBQTVDLEdBQTZELEVBQXZFO0FBQ0EsVUFBSSxTQUFPLEtBQUssS0FBTCxDQUFXLGlCQUFYLENBQTZCLE1BQTdCLEtBQXNDLENBQXRDLEdBQXlDLFlBQXpDLEdBQXNELEVBQWpFOztBQUVJLGFBQ0U7QUFBQTtBQUFBLFVBQUssU0FBUztBQUFBLG1CQUFJLFFBQVEsR0FBUixDQUFZLEtBQUssS0FBakIsQ0FBSjtBQUFBLFdBQWQ7QUFDRTtBQUFBO0FBQUEsWUFBSSxXQUFVLElBQWQ7QUFBQTtBQUFBLFNBREY7QUFBQTtBQUdpQyx1Q0FIakM7QUFJSSxhQUpKO0FBQUE7QUFJVyx1Q0FKWDtBQUtHLGFBQUssS0FBTCxDQUFXLHFCQUFYLENBQWlDLEdBQWpDLENBQXFDO0FBQUEsaUJBQ3BDLG9CQUFDLFVBQUQ7QUFDRSxvQkFBUSxLQUFLLEtBQUwsQ0FBVyxNQURyQjtBQUVFLHFCQUFTLEtBQUssS0FBTCxDQUFXLE9BRnRCO0FBR0UsdUJBQVcsT0FBTyxDQUFQLENBSGI7QUFJRSx5QkFBYSxPQUFPLENBQVAsQ0FKZjtBQUtFLDBCQUFjLE9BQU8sQ0FBUCxDQUxoQjtBQU1FLHlCQUFhLE9BQU8sQ0FBUDtBQU5mLFlBRG9DO0FBQUEsU0FBckMsQ0FMSDtBQUFBO0FBZW1CLHVDQWZuQjtBQWdCRyxjQWhCSDtBQWtCRyxhQUFLLEtBQUwsQ0FBVyxpQkFBWCxDQUE2QixHQUE3QixDQUFpQyxVQUFDLElBQUQ7QUFBQSxpQkFDaEMsb0JBQUMsU0FBRDtBQUNFLDJCQUFlLEtBQUssU0FEdEI7QUFFRSw0QkFBZ0IsS0FBSyxRQUZ2QjtBQUdFLDBCQUFjLEtBQUssVUFIckI7QUFJRSxrQkFBTSxLQUFLLFNBSmI7QUFLRSxvQkFBUSxLQUFLLEtBQUwsQ0FBVztBQUxyQixZQURnQztBQUFBLFNBQWpDO0FBbEJILE9BREY7QUE4QkQ7Ozs7RUFoRGlCLE1BQU0sUzs7QUFtRDFCLE9BQU8sS0FBUCxHQUFlLEtBQWYiLCJmaWxlIjoiSW5ib3guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB2YXIgSW5ib3ggPSAocHJvcHMpID0+IChcbiBcbi8vICAgPGRpdj5cbi8vICA8aDIgY2xhc3NOYW1lPSduaCc+SW5ib3g8L2gyPlxuXG4vLyAgTGlzdCBvZiBwZW9wbGUgd2hvJ3ZlIHNlbnQgeW91IHJlcXVlc3RzOjxici8+XG5cblxuLy8ge3Byb3BzLnBwbFdob1dhbnRUb0JlRnJpZW5kcy5tYXAoZnVuY3Rpb24oZnJpZW5kKXsgcmV0dXJuICg8SW5ib3hFbnRyeSBhY2NlcHQ9e3Byb3BzLmFjY2VwdH0gZGVjbGluZT17cHJvcHMuZGVjbGluZX0gXG4vLyAgIGluYm94TmFtZT17ZnJpZW5kWzBdfSByZXF1ZXN0VHlwZT17ZnJpZW5kWzFdfSByZXF1ZXN0TW92aWU9e2ZyaWVuZFsyXX0gLz4gKX0pfVxuXG4vLyBSZXF1ZXN0IFJlc3BvbnNlczpcbi8vIHtwcm9wcy5yZXNwb25zZXNBbnN3ZXJlZC5tYXAoZnVuY3Rpb24odW5pdCl7IHJldHVybiA8UmVzcG9uc2VzIFxuLy8gICByZXNwb25zZXNJbmZvPXt1bml0LnJlcXVlc3RlZX0gXG4vLyAgIHJlc3BvbnNlQW5zd2VyPXt1bml0LnJlc3BvbnNlfSBcbi8vICAgcmVzcG9uc2VUeXBlPXt1bml0LnJlcXVlc3RUeXB9IFxuLy8gICBzZWxmPXt1bml0LnJlcXVlc3Rvcn1cbi8vICAgcmVtb3ZlPXtwcm9wcy5yZW1vdmV9XG4vLyAvPn0pfVxuXG4vLyA8L2Rpdj5cblxuXG4vLyApO1xuXG5jbGFzcyBJbmJveCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHJlcXVlc3RzOiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcblxuXG5cblxuICAgIGxldCB0aGF0ID0gdGhpcztcbnZhciBlbXB0eT10aGlzLnByb3BzLnBwbFdob1dhbnRUb0JlRnJpZW5kcy5sZW5ndGg9PT0wP1wiTm8gcmVxdWVzdHMgOihcIjpcIlwiO1xudmFyIGVtcHR5Mj10aGlzLnByb3BzLnJlc3BvbnNlc0Fuc3dlcmVkLmxlbmd0aD09PTA/IFwiTm8gbmV3cyA6KFwiOlwiXCI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBvbkNsaWNrPXsoKT0+Y29uc29sZS5sb2codGhhdC5wcm9wcyl9PlxuICAgICAgICA8aDIgY2xhc3NOYW1lPSduaCc+SW5ib3g8L2gyPlxuXG4gICAgICAgIFBlb3BsZSB3aG8ndmUgc2VudCB5b3UgcmVxdWVzdHM8YnIvPlxuICAgICAgICAge2VtcHR5fSA8YnIvPlxuICAgICAgICB7dGhpcy5wcm9wcy5wcGxXaG9XYW50VG9CZUZyaWVuZHMubWFwKGZyaWVuZCA9PlxuICAgICAgICAgIDxJbmJveEVudHJ5XG4gICAgICAgICAgICBhY2NlcHQ9e3RoYXQucHJvcHMuYWNjZXB0fVxuICAgICAgICAgICAgZGVjbGluZT17dGhhdC5wcm9wcy5kZWNsaW5lfVxuICAgICAgICAgICAgaW5ib3hOYW1lPXtmcmllbmRbMF19XG4gICAgICAgICAgICByZXF1ZXN0VHlwZT17ZnJpZW5kWzFdfVxuICAgICAgICAgICAgcmVxdWVzdE1vdmllPXtmcmllbmRbMl19XG4gICAgICAgICAgICBtZXNzYWdlSW5mbz17ZnJpZW5kWzNdfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICAgIFJlcXVlc3QgUmVzcG9uc2VzPGJyLz5cbiAgICAgICAge2VtcHR5Mn1cblxuICAgICAgICB7dGhpcy5wcm9wcy5yZXNwb25zZXNBbnN3ZXJlZC5tYXAoKHVuaXQpID0+XG4gICAgICAgICAgPFJlc3BvbnNlc1xuICAgICAgICAgICAgcmVzcG9uc2VzSW5mbz17dW5pdC5yZXF1ZXN0ZWV9IFxuICAgICAgICAgICAgcmVzcG9uc2VBbnN3ZXI9e3VuaXQucmVzcG9uc2V9IFxuICAgICAgICAgICAgcmVzcG9uc2VUeXBlPXt1bml0LnJlcXVlc3RUeXB9IFxuICAgICAgICAgICAgc2VsZj17dW5pdC5yZXF1ZXN0b3J9XG4gICAgICAgICAgICByZW1vdmU9e3RoYXQucHJvcHMucmVtb3ZlfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbndpbmRvdy5JbmJveCA9IEluYm94O1xuIl19