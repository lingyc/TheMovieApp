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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94LmpzIl0sIm5hbWVzIjpbIkluYm94IiwicHJvcHMiLCJzdGF0ZSIsInJlcXVlc3RzIiwidGhhdCIsImVtcHR5IiwicHBsV2hvV2FudFRvQmVGcmllbmRzIiwibGVuZ3RoIiwiZW1wdHkyIiwicmVzcG9uc2VzQW5zd2VyZWQiLCJtYXAiLCJhY2NlcHQiLCJkZWNsaW5lIiwiZnJpZW5kIiwidW5pdCIsInJlcXVlc3RlZSIsInJlc3BvbnNlIiwicmVxdWVzdFR5cCIsIm1vdmllIiwicmVxdWVzdG9yIiwicmVtb3ZlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBOztJQUVNQSxLOzs7QUFDSixpQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsZ0JBQVU7QUFEQyxLQUFiO0FBSGlCO0FBTWxCOzs7OzZCQUVROztBQUtQLFVBQUlDLE9BQU8sSUFBWDtBQUNBLFVBQUlDLFFBQVEsS0FBS0osS0FBTCxDQUFXSyxxQkFBWCxDQUFpQ0MsTUFBakMsS0FBNEMsQ0FBNUMsR0FBZ0QscUJBQWhELEdBQXdFLEVBQXBGO0FBQ0EsVUFBSUMsU0FBUyxLQUFLUCxLQUFMLENBQVdRLGlCQUFYLENBQTZCRixNQUE3QixLQUF3QyxDQUF4QyxHQUE0QyxzQkFBNUMsR0FBcUUsRUFBbEY7O0FBRUEsYUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLHlCQUFmO0FBQ0U7QUFBQTtBQUFBLFlBQUssV0FBVSxRQUFmO0FBQUE7QUFBQSxTQURGO0FBR0U7QUFBQTtBQUFBLFlBQUssV0FBVSxtQkFBZjtBQUFBO0FBQUEsU0FIRjtBQUlFO0FBQUE7QUFBQSxZQUFLLFdBQVUsV0FBZjtBQUE0QkY7QUFBNUIsU0FKRjtBQUtHLGFBQUtKLEtBQUwsQ0FBV0sscUJBQVgsQ0FBaUNJLEdBQWpDLENBQXFDO0FBQUEsaUJBQ3BDLG9CQUFDLFVBQUQ7QUFDRSxvQkFBUU4sS0FBS0gsS0FBTCxDQUFXVSxNQURyQjtBQUVFLHFCQUFTUCxLQUFLSCxLQUFMLENBQVdXLE9BRnRCO0FBR0UsdUJBQVdDLE9BQU8sQ0FBUCxDQUhiO0FBSUUseUJBQWFBLE9BQU8sQ0FBUCxDQUpmO0FBS0UsMEJBQWNBLE9BQU8sQ0FBUCxDQUxoQjtBQU1FLHlCQUFhQSxPQUFPLENBQVA7QUFOZixZQURvQztBQUFBLFNBQXJDLENBTEg7QUFnQkU7QUFBQTtBQUFBLFlBQUssV0FBVSxtQkFBZjtBQUFBO0FBQUEsU0FoQkY7QUFpQkU7QUFBQTtBQUFBLFlBQUssV0FBVSxXQUFmO0FBQTRCTDtBQUE1QixTQWpCRjtBQWtCRyxhQUFLUCxLQUFMLENBQVdRLGlCQUFYLENBQTZCQyxHQUE3QixDQUFpQyxVQUFDSSxJQUFEO0FBQUEsaUJBQ2hDLG9CQUFDLFNBQUQ7QUFDRSwyQkFBZUEsS0FBS0MsU0FEdEI7QUFFRSw0QkFBZ0JELEtBQUtFLFFBRnZCO0FBR0UsMEJBQWNGLEtBQUtHLFVBSHJCO0FBSUUsbUJBQU9ILEtBQUtJLEtBSmQ7QUFLRSxrQkFBTUosS0FBS0ssU0FMYjtBQU1FLG9CQUFRZixLQUFLSCxLQUFMLENBQVdtQjtBQU5yQixZQURnQztBQUFBLFNBQWpDO0FBbEJILE9BREY7QUErQkQ7Ozs7RUFqRGlCQyxNQUFNQyxTOztBQW9EMUJDLE9BQU92QixLQUFQLEdBQWVBLEtBQWYiLCJmaWxlIjoiSW5ib3guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB2YXIgSW5ib3ggPSAocHJvcHMpID0+IChcclxuIFxyXG4vLyAgIDxkaXY+XHJcbi8vICA8aDIgY2xhc3NOYW1lPSduaCc+SW5ib3g8L2gyPlxyXG5cclxuLy8gIExpc3Qgb2YgcGVvcGxlIHdobyd2ZSBzZW50IHlvdSByZXF1ZXN0czo8YnIvPlxyXG5cclxuXHJcbi8vIHtwcm9wcy5wcGxXaG9XYW50VG9CZUZyaWVuZHMubWFwKGZ1bmN0aW9uKGZyaWVuZCl7IHJldHVybiAoPEluYm94RW50cnkgYWNjZXB0PXtwcm9wcy5hY2NlcHR9IGRlY2xpbmU9e3Byb3BzLmRlY2xpbmV9IFxyXG4vLyAgIGluYm94TmFtZT17ZnJpZW5kWzBdfSByZXF1ZXN0VHlwZT17ZnJpZW5kWzFdfSByZXF1ZXN0TW92aWU9e2ZyaWVuZFsyXX0gLz4gKX0pfVxyXG5cclxuLy8gUmVxdWVzdCBSZXNwb25zZXM6XHJcbi8vIHtwcm9wcy5yZXNwb25zZXNBbnN3ZXJlZC5tYXAoZnVuY3Rpb24odW5pdCl7IHJldHVybiA8UmVzcG9uc2VzIFxyXG4vLyAgIHJlc3BvbnNlc0luZm89e3VuaXQucmVxdWVzdGVlfSBcclxuLy8gICByZXNwb25zZUFuc3dlcj17dW5pdC5yZXNwb25zZX0gXHJcbi8vICAgcmVzcG9uc2VUeXBlPXt1bml0LnJlcXVlc3RUeXB9IFxyXG4vLyAgIHNlbGY9e3VuaXQucmVxdWVzdG9yfVxyXG4vLyAgIHJlbW92ZT17cHJvcHMucmVtb3ZlfVxyXG4vLyAvPn0pfVxyXG5cclxuLy8gPC9kaXY+XHJcblxyXG5cclxuLy8gKTtcclxuXHJcbmNsYXNzIEluYm94IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHJlcXVlc3RzOiBudWxsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG5cclxuXHJcblxyXG5cclxuICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgIHZhciBlbXB0eSA9IHRoaXMucHJvcHMucHBsV2hvV2FudFRvQmVGcmllbmRzLmxlbmd0aCA9PT0gMCA/IFwiTm8gcGVuZGluZyByZXF1ZXN0c1wiIDogXCJcIjtcclxuICAgIHZhciBlbXB0eTIgPSB0aGlzLnByb3BzLnJlc3BvbnNlc0Fuc3dlcmVkLmxlbmd0aCA9PT0gMCA/IFwiTm8gcmVxdWVzdCByZXNwb25zZXNcIiA6IFwiXCI7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9J25vdGlmaWNhdGlvbiBjb2xsZWN0aW9uJz5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJz5JbmJveDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbkxhYmxlXCI+eW91ciBwZW5kaW5nIHJlcXVlc3RzPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj57ZW1wdHl9PC9kaXY+XHJcbiAgICAgICAge3RoaXMucHJvcHMucHBsV2hvV2FudFRvQmVGcmllbmRzLm1hcChmcmllbmQgPT5cclxuICAgICAgICAgIDxJbmJveEVudHJ5XHJcbiAgICAgICAgICAgIGFjY2VwdD17dGhhdC5wcm9wcy5hY2NlcHR9XHJcbiAgICAgICAgICAgIGRlY2xpbmU9e3RoYXQucHJvcHMuZGVjbGluZX1cclxuICAgICAgICAgICAgaW5ib3hOYW1lPXtmcmllbmRbMF19XHJcbiAgICAgICAgICAgIHJlcXVlc3RUeXBlPXtmcmllbmRbMV19XHJcbiAgICAgICAgICAgIHJlcXVlc3RNb3ZpZT17ZnJpZW5kWzJdfVxyXG4gICAgICAgICAgICBtZXNzYWdlSW5mbz17ZnJpZW5kWzNdfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICApfVxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbkxhYmxlXCI+cmVxdWVzdCByZXNwb25zZXM8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPntlbXB0eTJ9PC9kaXY+XHJcbiAgICAgICAge3RoaXMucHJvcHMucmVzcG9uc2VzQW5zd2VyZWQubWFwKCh1bml0KSA9PlxyXG4gICAgICAgICAgPFJlc3BvbnNlc1xyXG4gICAgICAgICAgICByZXNwb25zZXNJbmZvPXt1bml0LnJlcXVlc3RlZX0gXHJcbiAgICAgICAgICAgIHJlc3BvbnNlQW5zd2VyPXt1bml0LnJlc3BvbnNlfSBcclxuICAgICAgICAgICAgcmVzcG9uc2VUeXBlPXt1bml0LnJlcXVlc3RUeXB9IFxyXG4gICAgICAgICAgICBtb3ZpZT17dW5pdC5tb3ZpZX1cclxuICAgICAgICAgICAgc2VsZj17dW5pdC5yZXF1ZXN0b3J9XHJcbiAgICAgICAgICAgIHJlbW92ZT17dGhhdC5wcm9wcy5yZW1vdmV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5JbmJveCA9IEluYm94O1xyXG4iXX0=