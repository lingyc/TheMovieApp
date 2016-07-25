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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBOztJQUVNLEs7OztBQUNKLGlCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSx5RkFDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGdCQUFVO0FBREMsS0FBYjtBQUhpQjtBQU1sQjs7Ozs2QkFFUTs7QUFLUCxVQUFJLE9BQU8sSUFBWDtBQUNKLFVBQUksUUFBTSxLQUFLLEtBQUwsQ0FBVyxxQkFBWCxDQUFpQyxNQUFqQyxLQUEwQyxDQUExQyxHQUE0QyxnQkFBNUMsR0FBNkQsRUFBdkU7QUFDQSxVQUFJLFNBQU8sS0FBSyxLQUFMLENBQVcsaUJBQVgsQ0FBNkIsTUFBN0IsS0FBc0MsQ0FBdEMsR0FBeUMsWUFBekMsR0FBc0QsRUFBakU7O0FBRUksYUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsWUFBSSxXQUFVLElBQWQ7QUFBQTtBQUFBLFNBREY7QUFBQTtBQUdpQyx1Q0FIakM7QUFJSSxhQUpKO0FBQUE7QUFJVyx1Q0FKWDtBQUtHLGFBQUssS0FBTCxDQUFXLHFCQUFYLENBQWlDLEdBQWpDLENBQXFDO0FBQUEsaUJBQ3BDLG9CQUFDLFVBQUQ7QUFDRSxvQkFBUSxLQUFLLEtBQUwsQ0FBVyxNQURyQjtBQUVFLHFCQUFTLEtBQUssS0FBTCxDQUFXLE9BRnRCO0FBR0UsdUJBQVcsT0FBTyxDQUFQLENBSGI7QUFJRSx5QkFBYSxPQUFPLENBQVAsQ0FKZjtBQUtFLDBCQUFjLE9BQU8sQ0FBUCxDQUxoQjtBQU1FLHlCQUFhLE9BQU8sQ0FBUDtBQU5mLFlBRG9DO0FBQUEsU0FBckMsQ0FMSDtBQUFBO0FBZW1CLHVDQWZuQjtBQWdCRyxjQWhCSDtBQWtCRyxhQUFLLEtBQUwsQ0FBVyxpQkFBWCxDQUE2QixHQUE3QixDQUFpQyxVQUFDLElBQUQ7QUFBQSxpQkFDaEMsb0JBQUMsU0FBRDtBQUNFLDJCQUFlLEtBQUssU0FEdEI7QUFFRSw0QkFBZ0IsS0FBSyxRQUZ2QjtBQUdFLDBCQUFjLEtBQUssVUFIckI7QUFJRSxtQkFBTyxLQUFLLEtBSmQ7QUFLRSxrQkFBTSxLQUFLLFNBTGI7QUFNRSxvQkFBUSxLQUFLLEtBQUwsQ0FBVztBQU5yQixZQURnQztBQUFBLFNBQWpDO0FBbEJILE9BREY7QUErQkQ7Ozs7RUFqRGlCLE1BQU0sUzs7QUFvRDFCLE9BQU8sS0FBUCxHQUFlLEtBQWYiLCJmaWxlIjoiSW5ib3guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB2YXIgSW5ib3ggPSAocHJvcHMpID0+IChcbiBcbi8vICAgPGRpdj5cbi8vICA8aDIgY2xhc3NOYW1lPSduaCc+SW5ib3g8L2gyPlxuXG4vLyAgTGlzdCBvZiBwZW9wbGUgd2hvJ3ZlIHNlbnQgeW91IHJlcXVlc3RzOjxici8+XG5cblxuLy8ge3Byb3BzLnBwbFdob1dhbnRUb0JlRnJpZW5kcy5tYXAoZnVuY3Rpb24oZnJpZW5kKXsgcmV0dXJuICg8SW5ib3hFbnRyeSBhY2NlcHQ9e3Byb3BzLmFjY2VwdH0gZGVjbGluZT17cHJvcHMuZGVjbGluZX0gXG4vLyAgIGluYm94TmFtZT17ZnJpZW5kWzBdfSByZXF1ZXN0VHlwZT17ZnJpZW5kWzFdfSByZXF1ZXN0TW92aWU9e2ZyaWVuZFsyXX0gLz4gKX0pfVxuXG4vLyBSZXF1ZXN0IFJlc3BvbnNlczpcbi8vIHtwcm9wcy5yZXNwb25zZXNBbnN3ZXJlZC5tYXAoZnVuY3Rpb24odW5pdCl7IHJldHVybiA8UmVzcG9uc2VzIFxuLy8gICByZXNwb25zZXNJbmZvPXt1bml0LnJlcXVlc3RlZX0gXG4vLyAgIHJlc3BvbnNlQW5zd2VyPXt1bml0LnJlc3BvbnNlfSBcbi8vICAgcmVzcG9uc2VUeXBlPXt1bml0LnJlcXVlc3RUeXB9IFxuLy8gICBzZWxmPXt1bml0LnJlcXVlc3Rvcn1cbi8vICAgcmVtb3ZlPXtwcm9wcy5yZW1vdmV9XG4vLyAvPn0pfVxuXG4vLyA8L2Rpdj5cblxuXG4vLyApO1xuXG5jbGFzcyBJbmJveCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHJlcXVlc3RzOiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcblxuXG5cblxuICAgIGxldCB0aGF0ID0gdGhpcztcbnZhciBlbXB0eT10aGlzLnByb3BzLnBwbFdob1dhbnRUb0JlRnJpZW5kcy5sZW5ndGg9PT0wP1wiTm8gcmVxdWVzdHMgOihcIjpcIlwiO1xudmFyIGVtcHR5Mj10aGlzLnByb3BzLnJlc3BvbnNlc0Fuc3dlcmVkLmxlbmd0aD09PTA/IFwiTm8gbmV3cyA6KFwiOlwiXCI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGgyIGNsYXNzTmFtZT0nbmgnPkluYm94PC9oMj5cblxuICAgICAgICBQZW9wbGUgd2hvJ3ZlIHNlbnQgeW91IHJlcXVlc3RzPGJyLz5cbiAgICAgICAgIHtlbXB0eX0gPGJyLz5cbiAgICAgICAge3RoaXMucHJvcHMucHBsV2hvV2FudFRvQmVGcmllbmRzLm1hcChmcmllbmQgPT5cbiAgICAgICAgICA8SW5ib3hFbnRyeVxuICAgICAgICAgICAgYWNjZXB0PXt0aGF0LnByb3BzLmFjY2VwdH1cbiAgICAgICAgICAgIGRlY2xpbmU9e3RoYXQucHJvcHMuZGVjbGluZX1cbiAgICAgICAgICAgIGluYm94TmFtZT17ZnJpZW5kWzBdfVxuICAgICAgICAgICAgcmVxdWVzdFR5cGU9e2ZyaWVuZFsxXX1cbiAgICAgICAgICAgIHJlcXVlc3RNb3ZpZT17ZnJpZW5kWzJdfVxuICAgICAgICAgICAgbWVzc2FnZUluZm89e2ZyaWVuZFszXX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgICBSZXF1ZXN0IFJlc3BvbnNlczxici8+XG4gICAgICAgIHtlbXB0eTJ9XG5cbiAgICAgICAge3RoaXMucHJvcHMucmVzcG9uc2VzQW5zd2VyZWQubWFwKCh1bml0KSA9PlxuICAgICAgICAgIDxSZXNwb25zZXNcbiAgICAgICAgICAgIHJlc3BvbnNlc0luZm89e3VuaXQucmVxdWVzdGVlfSBcbiAgICAgICAgICAgIHJlc3BvbnNlQW5zd2VyPXt1bml0LnJlc3BvbnNlfSBcbiAgICAgICAgICAgIHJlc3BvbnNlVHlwZT17dW5pdC5yZXF1ZXN0VHlwfSBcbiAgICAgICAgICAgIG1vdmllPXt1bml0Lm1vdmllfVxuICAgICAgICAgICAgc2VsZj17dW5pdC5yZXF1ZXN0b3J9XG4gICAgICAgICAgICByZW1vdmU9e3RoYXQucHJvcHMucmVtb3ZlfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbndpbmRvdy5JbmJveCA9IEluYm94O1xuIl19