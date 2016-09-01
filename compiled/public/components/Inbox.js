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

    var _this = _possibleConstructorReturn(this, (Inbox.__proto__ || Object.getPrototypeOf(Inbox)).call(this, props));

    _this.state = {
      requests: null
    };
    return _this;
  }

  _createClass(Inbox, [{
    key: "render",
    value: function render() {

      var that = this;
      var empty = this.props.pplWhoWantToBeFriends.length === 0 ? "No pending requests" : "";
      var empty2 = this.props.responsesAnswered.length === 0 ? "No request responses" : "";

      return React.createElement(
        "div",
        { className: "notification collection" },
        React.createElement(
          "div",
          { className: "header" },
          "Inbox"
        ),
        React.createElement(
          "div",
          { className: "notificationLable" },
          "your pending requests"
        ),
        React.createElement(
          "div",
          { className: "updateMsg" },
          empty
        ),
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
        React.createElement(
          "div",
          { className: "notificationLable" },
          "request responses"
        ),
        React.createElement(
          "div",
          { className: "updateMsg" },
          empty2
        ),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94LmpzIl0sIm5hbWVzIjpbIkluYm94IiwicHJvcHMiLCJzdGF0ZSIsInJlcXVlc3RzIiwidGhhdCIsImVtcHR5IiwicHBsV2hvV2FudFRvQmVGcmllbmRzIiwibGVuZ3RoIiwiZW1wdHkyIiwicmVzcG9uc2VzQW5zd2VyZWQiLCJtYXAiLCJhY2NlcHQiLCJkZWNsaW5lIiwiZnJpZW5kIiwidW5pdCIsInJlcXVlc3RlZSIsInJlc3BvbnNlIiwicmVxdWVzdFR5cCIsIm1vdmllIiwicmVxdWVzdG9yIiwicmVtb3ZlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBOztJQUVNQSxLOzs7QUFDSixpQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsZ0JBQVU7QUFEQyxLQUFiO0FBSGlCO0FBTWxCOzs7OzZCQUVROztBQUtQLFVBQUlDLE9BQU8sSUFBWDtBQUNBLFVBQUlDLFFBQVEsS0FBS0osS0FBTCxDQUFXSyxxQkFBWCxDQUFpQ0MsTUFBakMsS0FBNEMsQ0FBNUMsR0FBZ0QscUJBQWhELEdBQXdFLEVBQXBGO0FBQ0EsVUFBSUMsU0FBUyxLQUFLUCxLQUFMLENBQVdRLGlCQUFYLENBQTZCRixNQUE3QixLQUF3QyxDQUF4QyxHQUE0QyxzQkFBNUMsR0FBcUUsRUFBbEY7O0FBRUEsYUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLHlCQUFmO0FBQ0U7QUFBQTtBQUFBLFlBQUssV0FBVSxRQUFmO0FBQUE7QUFBQSxTQURGO0FBR0U7QUFBQTtBQUFBLFlBQUssV0FBVSxtQkFBZjtBQUFBO0FBQUEsU0FIRjtBQUlFO0FBQUE7QUFBQSxZQUFLLFdBQVUsV0FBZjtBQUE0QkY7QUFBNUIsU0FKRjtBQUtHLGFBQUtKLEtBQUwsQ0FBV0sscUJBQVgsQ0FBaUNJLEdBQWpDLENBQXFDO0FBQUEsaUJBQ3BDLG9CQUFDLFVBQUQ7QUFDRSxvQkFBUU4sS0FBS0gsS0FBTCxDQUFXVSxNQURyQjtBQUVFLHFCQUFTUCxLQUFLSCxLQUFMLENBQVdXLE9BRnRCO0FBR0UsdUJBQVdDLE9BQU8sQ0FBUCxDQUhiO0FBSUUseUJBQWFBLE9BQU8sQ0FBUCxDQUpmO0FBS0UsMEJBQWNBLE9BQU8sQ0FBUCxDQUxoQjtBQU1FLHlCQUFhQSxPQUFPLENBQVA7QUFOZixZQURvQztBQUFBLFNBQXJDLENBTEg7QUFnQkU7QUFBQTtBQUFBLFlBQUssV0FBVSxtQkFBZjtBQUFBO0FBQUEsU0FoQkY7QUFpQkU7QUFBQTtBQUFBLFlBQUssV0FBVSxXQUFmO0FBQTRCTDtBQUE1QixTQWpCRjtBQWtCRyxhQUFLUCxLQUFMLENBQVdRLGlCQUFYLENBQTZCQyxHQUE3QixDQUFpQyxVQUFDSSxJQUFEO0FBQUEsaUJBQ2hDLG9CQUFDLFNBQUQ7QUFDRSwyQkFBZUEsS0FBS0MsU0FEdEI7QUFFRSw0QkFBZ0JELEtBQUtFLFFBRnZCO0FBR0UsMEJBQWNGLEtBQUtHLFVBSHJCO0FBSUUsbUJBQU9ILEtBQUtJLEtBSmQ7QUFLRSxrQkFBTUosS0FBS0ssU0FMYjtBQU1FLG9CQUFRZixLQUFLSCxLQUFMLENBQVdtQjtBQU5yQixZQURnQztBQUFBLFNBQWpDO0FBbEJILE9BREY7QUErQkQ7Ozs7RUFqRGlCQyxNQUFNQyxTOztBQW9EMUJDLE9BQU92QixLQUFQLEdBQWVBLEtBQWYiLCJmaWxlIjoiSW5ib3guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB2YXIgSW5ib3ggPSAocHJvcHMpID0+IChcbiBcbi8vICAgPGRpdj5cbi8vICA8aDIgY2xhc3NOYW1lPSduaCc+SW5ib3g8L2gyPlxuXG4vLyAgTGlzdCBvZiBwZW9wbGUgd2hvJ3ZlIHNlbnQgeW91IHJlcXVlc3RzOjxici8+XG5cblxuLy8ge3Byb3BzLnBwbFdob1dhbnRUb0JlRnJpZW5kcy5tYXAoZnVuY3Rpb24oZnJpZW5kKXsgcmV0dXJuICg8SW5ib3hFbnRyeSBhY2NlcHQ9e3Byb3BzLmFjY2VwdH0gZGVjbGluZT17cHJvcHMuZGVjbGluZX0gXG4vLyAgIGluYm94TmFtZT17ZnJpZW5kWzBdfSByZXF1ZXN0VHlwZT17ZnJpZW5kWzFdfSByZXF1ZXN0TW92aWU9e2ZyaWVuZFsyXX0gLz4gKX0pfVxuXG4vLyBSZXF1ZXN0IFJlc3BvbnNlczpcbi8vIHtwcm9wcy5yZXNwb25zZXNBbnN3ZXJlZC5tYXAoZnVuY3Rpb24odW5pdCl7IHJldHVybiA8UmVzcG9uc2VzIFxuLy8gICByZXNwb25zZXNJbmZvPXt1bml0LnJlcXVlc3RlZX0gXG4vLyAgIHJlc3BvbnNlQW5zd2VyPXt1bml0LnJlc3BvbnNlfSBcbi8vICAgcmVzcG9uc2VUeXBlPXt1bml0LnJlcXVlc3RUeXB9IFxuLy8gICBzZWxmPXt1bml0LnJlcXVlc3Rvcn1cbi8vICAgcmVtb3ZlPXtwcm9wcy5yZW1vdmV9XG4vLyAvPn0pfVxuXG4vLyA8L2Rpdj5cblxuXG4vLyApO1xuXG5jbGFzcyBJbmJveCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHJlcXVlc3RzOiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcblxuXG5cblxuICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICB2YXIgZW1wdHkgPSB0aGlzLnByb3BzLnBwbFdob1dhbnRUb0JlRnJpZW5kcy5sZW5ndGggPT09IDAgPyBcIk5vIHBlbmRpbmcgcmVxdWVzdHNcIiA6IFwiXCI7XG4gICAgdmFyIGVtcHR5MiA9IHRoaXMucHJvcHMucmVzcG9uc2VzQW5zd2VyZWQubGVuZ3RoID09PSAwID8gXCJObyByZXF1ZXN0IHJlc3BvbnNlc1wiIDogXCJcIjtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbm90aWZpY2F0aW9uIGNvbGxlY3Rpb24nPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJz5JbmJveDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uTGFibGVcIj55b3VyIHBlbmRpbmcgcmVxdWVzdHM8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj57ZW1wdHl9PC9kaXY+XG4gICAgICAgIHt0aGlzLnByb3BzLnBwbFdob1dhbnRUb0JlRnJpZW5kcy5tYXAoZnJpZW5kID0+XG4gICAgICAgICAgPEluYm94RW50cnlcbiAgICAgICAgICAgIGFjY2VwdD17dGhhdC5wcm9wcy5hY2NlcHR9XG4gICAgICAgICAgICBkZWNsaW5lPXt0aGF0LnByb3BzLmRlY2xpbmV9XG4gICAgICAgICAgICBpbmJveE5hbWU9e2ZyaWVuZFswXX1cbiAgICAgICAgICAgIHJlcXVlc3RUeXBlPXtmcmllbmRbMV19XG4gICAgICAgICAgICByZXF1ZXN0TW92aWU9e2ZyaWVuZFsyXX1cbiAgICAgICAgICAgIG1lc3NhZ2VJbmZvPXtmcmllbmRbM119XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbkxhYmxlXCI+cmVxdWVzdCByZXNwb25zZXM8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj57ZW1wdHkyfTwvZGl2PlxuICAgICAgICB7dGhpcy5wcm9wcy5yZXNwb25zZXNBbnN3ZXJlZC5tYXAoKHVuaXQpID0+XG4gICAgICAgICAgPFJlc3BvbnNlc1xuICAgICAgICAgICAgcmVzcG9uc2VzSW5mbz17dW5pdC5yZXF1ZXN0ZWV9IFxuICAgICAgICAgICAgcmVzcG9uc2VBbnN3ZXI9e3VuaXQucmVzcG9uc2V9IFxuICAgICAgICAgICAgcmVzcG9uc2VUeXBlPXt1bml0LnJlcXVlc3RUeXB9IFxuICAgICAgICAgICAgbW92aWU9e3VuaXQubW92aWV9XG4gICAgICAgICAgICBzZWxmPXt1bml0LnJlcXVlc3Rvcn1cbiAgICAgICAgICAgIHJlbW92ZT17dGhhdC5wcm9wcy5yZW1vdmV9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxud2luZG93LkluYm94ID0gSW5ib3g7XG4iXX0=