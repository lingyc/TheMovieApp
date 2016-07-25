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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXlCTSxLOzs7QUFDSixpQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEseUZBQ1gsS0FEVzs7QUFHakIsVUFBSyxLQUFMLEdBQWE7QUFDWCxnQkFBVTtBQURDLEtBQWI7QUFIaUI7QUFNbEI7Ozs7NkJBRVE7O0FBS1AsVUFBSSxPQUFPLElBQVg7QUFDQSxVQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcscUJBQVgsQ0FBaUMsTUFBakMsS0FBNEMsQ0FBNUMsR0FBZ0QscUJBQWhELEdBQXdFLEVBQXBGO0FBQ0EsVUFBSSxTQUFTLEtBQUssS0FBTCxDQUFXLGlCQUFYLENBQTZCLE1BQTdCLEtBQXdDLENBQXhDLEdBQTRDLHNCQUE1QyxHQUFxRSxFQUFsRjs7QUFFQSxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUseUJBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFFBQWY7QUFBQTtBQUFBLFNBREY7QUFHRTtBQUFBO0FBQUEsWUFBSyxXQUFVLG1CQUFmO0FBQUE7QUFBQSxTQUhGO0FBSUU7QUFBQTtBQUFBLFlBQUssV0FBVSxXQUFmO0FBQTRCO0FBQTVCLFNBSkY7QUFLRyxhQUFLLEtBQUwsQ0FBVyxxQkFBWCxDQUFpQyxHQUFqQyxDQUFxQztBQUFBLGlCQUNwQyxvQkFBQyxVQUFEO0FBQ0Usb0JBQVEsS0FBSyxLQUFMLENBQVcsTUFEckI7QUFFRSxxQkFBUyxLQUFLLEtBQUwsQ0FBVyxPQUZ0QjtBQUdFLHVCQUFXLE9BQU8sQ0FBUCxDQUhiO0FBSUUseUJBQWEsT0FBTyxDQUFQLENBSmY7QUFLRSwwQkFBYyxPQUFPLENBQVAsQ0FMaEI7QUFNRSx5QkFBYSxPQUFPLENBQVA7QUFOZixZQURvQztBQUFBLFNBQXJDLENBTEg7QUFnQkU7QUFBQTtBQUFBLFlBQUssV0FBVSxtQkFBZjtBQUFBO0FBQUEsU0FoQkY7QUFpQkU7QUFBQTtBQUFBLFlBQUssV0FBVSxXQUFmO0FBQTRCO0FBQTVCLFNBakJGO0FBa0JHLGFBQUssS0FBTCxDQUFXLGlCQUFYLENBQTZCLEdBQTdCLENBQWlDLFVBQUMsSUFBRDtBQUFBLGlCQUNoQyxvQkFBQyxTQUFEO0FBQ0UsMkJBQWUsS0FBSyxTQUR0QjtBQUVFLDRCQUFnQixLQUFLLFFBRnZCO0FBR0UsMEJBQWMsS0FBSyxVQUhyQjtBQUlFLG1CQUFPLEtBQUssS0FKZDtBQUtFLGtCQUFNLEtBQUssU0FMYjtBQU1FLG9CQUFRLEtBQUssS0FBTCxDQUFXO0FBTnJCLFlBRGdDO0FBQUEsU0FBakM7QUFsQkgsT0FERjtBQStCRDs7OztFQWpEaUIsTUFBTSxTOztBQW9EMUIsT0FBTyxLQUFQLEdBQWUsS0FBZiIsImZpbGUiOiJJbmJveC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHZhciBJbmJveCA9IChwcm9wcykgPT4gKFxuIFxuLy8gICA8ZGl2PlxuLy8gIDxoMiBjbGFzc05hbWU9J25oJz5JbmJveDwvaDI+XG5cbi8vICBMaXN0IG9mIHBlb3BsZSB3aG8ndmUgc2VudCB5b3UgcmVxdWVzdHM6PGJyLz5cblxuXG4vLyB7cHJvcHMucHBsV2hvV2FudFRvQmVGcmllbmRzLm1hcChmdW5jdGlvbihmcmllbmQpeyByZXR1cm4gKDxJbmJveEVudHJ5IGFjY2VwdD17cHJvcHMuYWNjZXB0fSBkZWNsaW5lPXtwcm9wcy5kZWNsaW5lfSBcbi8vICAgaW5ib3hOYW1lPXtmcmllbmRbMF19IHJlcXVlc3RUeXBlPXtmcmllbmRbMV19IHJlcXVlc3RNb3ZpZT17ZnJpZW5kWzJdfSAvPiApfSl9XG5cbi8vIFJlcXVlc3QgUmVzcG9uc2VzOlxuLy8ge3Byb3BzLnJlc3BvbnNlc0Fuc3dlcmVkLm1hcChmdW5jdGlvbih1bml0KXsgcmV0dXJuIDxSZXNwb25zZXMgXG4vLyAgIHJlc3BvbnNlc0luZm89e3VuaXQucmVxdWVzdGVlfSBcbi8vICAgcmVzcG9uc2VBbnN3ZXI9e3VuaXQucmVzcG9uc2V9IFxuLy8gICByZXNwb25zZVR5cGU9e3VuaXQucmVxdWVzdFR5cH0gXG4vLyAgIHNlbGY9e3VuaXQucmVxdWVzdG9yfVxuLy8gICByZW1vdmU9e3Byb3BzLnJlbW92ZX1cbi8vIC8+fSl9XG5cbi8vIDwvZGl2PlxuXG5cbi8vICk7XG5cbmNsYXNzIEluYm94IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcmVxdWVzdHM6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuXG5cblxuXG4gICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgIHZhciBlbXB0eSA9IHRoaXMucHJvcHMucHBsV2hvV2FudFRvQmVGcmllbmRzLmxlbmd0aCA9PT0gMCA/IFwiTm8gcGVuZGluZyByZXF1ZXN0c1wiIDogXCJcIjtcbiAgICB2YXIgZW1wdHkyID0gdGhpcy5wcm9wcy5yZXNwb25zZXNBbnN3ZXJlZC5sZW5ndGggPT09IDAgPyBcIk5vIHJlcXVlc3QgcmVzcG9uc2VzXCIgOiBcIlwiO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdub3RpZmljYXRpb24gY29sbGVjdGlvbic+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInPkluYm94PC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb25MYWJsZVwiPnlvdXIgcGVuZGluZyByZXF1ZXN0czwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPntlbXB0eX08L2Rpdj5cbiAgICAgICAge3RoaXMucHJvcHMucHBsV2hvV2FudFRvQmVGcmllbmRzLm1hcChmcmllbmQgPT5cbiAgICAgICAgICA8SW5ib3hFbnRyeVxuICAgICAgICAgICAgYWNjZXB0PXt0aGF0LnByb3BzLmFjY2VwdH1cbiAgICAgICAgICAgIGRlY2xpbmU9e3RoYXQucHJvcHMuZGVjbGluZX1cbiAgICAgICAgICAgIGluYm94TmFtZT17ZnJpZW5kWzBdfVxuICAgICAgICAgICAgcmVxdWVzdFR5cGU9e2ZyaWVuZFsxXX1cbiAgICAgICAgICAgIHJlcXVlc3RNb3ZpZT17ZnJpZW5kWzJdfVxuICAgICAgICAgICAgbWVzc2FnZUluZm89e2ZyaWVuZFszXX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uTGFibGVcIj5yZXF1ZXN0IHJlc3BvbnNlczwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPntlbXB0eTJ9PC9kaXY+XG4gICAgICAgIHt0aGlzLnByb3BzLnJlc3BvbnNlc0Fuc3dlcmVkLm1hcCgodW5pdCkgPT5cbiAgICAgICAgICA8UmVzcG9uc2VzXG4gICAgICAgICAgICByZXNwb25zZXNJbmZvPXt1bml0LnJlcXVlc3RlZX0gXG4gICAgICAgICAgICByZXNwb25zZUFuc3dlcj17dW5pdC5yZXNwb25zZX0gXG4gICAgICAgICAgICByZXNwb25zZVR5cGU9e3VuaXQucmVxdWVzdFR5cH0gXG4gICAgICAgICAgICBtb3ZpZT17dW5pdC5tb3ZpZX1cbiAgICAgICAgICAgIHNlbGY9e3VuaXQucmVxdWVzdG9yfVxuICAgICAgICAgICAgcmVtb3ZlPXt0aGF0LnByb3BzLnJlbW92ZX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG53aW5kb3cuSW5ib3ggPSBJbmJveDtcbiJdfQ==