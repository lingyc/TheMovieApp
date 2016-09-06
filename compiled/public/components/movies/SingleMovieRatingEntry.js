"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleMovieRatingEntry = function (_React$Component) {
  _inherits(SingleMovieRatingEntry, _React$Component);

  function SingleMovieRatingEntry(props) {
    _classCallCheck(this, SingleMovieRatingEntry);

    var _this = _possibleConstructorReturn(this, (SingleMovieRatingEntry.__proto__ || Object.getPrototypeOf(SingleMovieRatingEntry)).call(this, props));

    _this.state = {
      rating: props.rating
    };
    return _this;
  }

  _createClass(SingleMovieRatingEntry, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log(this.props);
    }
  }, {
    key: "handleClick",
    value: function handleClick(buddy) {
      console.log(this);
      // this.props.fof(buddy);
      // this.props.change('singleFriend', this.state.rating.friendUserName);
    }
  }, {
    key: "render",
    value: function render() {
      //note, on click of portrait, name, review
      //should be able to see all the movies reviewed by friend
      //on send watch request click, should send a watch request
      var rating = this.state.rating;
      var that = this;
      return React.createElement(
        "div",
        { className: "collection-item row", onClick: function onClick() {
            return console.log(that.props);
          } },
        React.createElement(
          "div",
          { className: "col s3" },
          React.createElement("img", { className: "profilethumnail", src: 'https://unsplash.it/170/170/?random' })
        ),
        React.createElement(
          "div",
          { id: "Friend", className: "MovieEntryFriend col s9" },
          React.createElement(
            "div",
            { className: "top" },
            React.createElement(
              "a",
              { className: "friendEntryIndividual individual" },
              React.createElement(
                "div",
                { className: "friendName", onClick: that.props.fof },
                rating.friendUserName
              )
            )
          ),
          React.createElement(
            "div",
            { className: "friendReview" },
            rating.review === null ? rating.friendUserName + ' did not leave a review' : rating.friendUserName + "'s review: " + rating.review
          ),
          React.createElement(
            "div",
            { className: "friendRating" },
            rating.score === null ? rating.friendUserName + ' have not rate the movie yet' : rating.friendUserName + "'s rating is: " + rating.score
          )
        )
      );
    }
  }]);

  return SingleMovieRatingEntry;
}(React.Component);

window.SingleMovieRatingEntry = SingleMovieRatingEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzIl0sIm5hbWVzIjpbIlNpbmdsZU1vdmllUmF0aW5nRW50cnkiLCJwcm9wcyIsInN0YXRlIiwicmF0aW5nIiwiY29uc29sZSIsImxvZyIsImJ1ZGR5IiwidGhhdCIsImZvZiIsImZyaWVuZFVzZXJOYW1lIiwicmV2aWV3Iiwic2NvcmUiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxzQjs7O0FBQ0osa0NBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxnSkFDWEEsS0FEVzs7QUFFakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGNBQVFGLE1BQU1FO0FBREgsS0FBYjtBQUZpQjtBQUtsQjs7Ozt3Q0FFbUI7QUFDbEJDLGNBQVFDLEdBQVIsQ0FBWSxLQUFLSixLQUFqQjtBQUNEOzs7Z0NBRVdLLEssRUFBTztBQUNqQkYsY0FBUUMsR0FBUixDQUFZLElBQVo7QUFDQTtBQUNBO0FBQ0Q7Ozs2QkFFUTtBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQUlGLFNBQVMsS0FBS0QsS0FBTCxDQUFXQyxNQUF4QjtBQUNBLFVBQUlJLE9BQU8sSUFBWDtBQUNBLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxxQkFBZixFQUFxQyxTQUFTO0FBQUEsbUJBQUtILFFBQVFDLEdBQVIsQ0FBWUUsS0FBS04sS0FBakIsQ0FBTDtBQUFBLFdBQTlDO0FBQ0U7QUFBQTtBQUFBLFlBQUssV0FBVSxRQUFmO0FBQ0UsdUNBQUssV0FBVSxpQkFBZixFQUFpQyxLQUFLLHFDQUF0QztBQURGLFNBREY7QUFJRTtBQUFBO0FBQUEsWUFBSyxJQUFHLFFBQVIsRUFBaUIsV0FBVSx5QkFBM0I7QUFDRTtBQUFBO0FBQUEsY0FBSyxXQUFVLEtBQWY7QUFDRTtBQUFBO0FBQUEsZ0JBQUcsV0FBVSxrQ0FBYjtBQUFnRDtBQUFBO0FBQUEsa0JBQUssV0FBVSxZQUFmLEVBQTRCLFNBQVNNLEtBQUtOLEtBQUwsQ0FBV08sR0FBaEQ7QUFBc0RMLHVCQUFPTTtBQUE3RDtBQUFoRDtBQURGLFdBREY7QUFJRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGNBQWY7QUFBZ0NOLG1CQUFPTyxNQUFQLEtBQWtCLElBQW5CLEdBQTJCUCxPQUFPTSxjQUFQLEdBQXdCLHlCQUFuRCxHQUErRU4sT0FBT00sY0FBUCxHQUF3QixhQUF4QixHQUF3Q04sT0FBT087QUFBN0osV0FKRjtBQUtFO0FBQUE7QUFBQSxjQUFLLFdBQVUsY0FBZjtBQUFnQ1AsbUJBQU9RLEtBQVAsS0FBaUIsSUFBbEIsR0FBMEJSLE9BQU9NLGNBQVAsR0FBd0IsOEJBQWxELEdBQW1GTixPQUFPTSxjQUFQLEdBQXdCLGdCQUF4QixHQUEyQ04sT0FBT1E7QUFBcEs7QUFMRjtBQUpGLE9BREY7QUFjRDs7OztFQXRDa0NDLE1BQU1DLFM7O0FBMEMzQ0MsT0FBT2Qsc0JBQVAsR0FBZ0NBLHNCQUFoQyIsImZpbGUiOiJTaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2luZ2xlTW92aWVSYXRpbmdFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHJhdGluZzogcHJvcHMucmF0aW5nXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNsaWNrKGJ1ZGR5KSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzKVxyXG4gICAgLy8gdGhpcy5wcm9wcy5mb2YoYnVkZHkpO1xyXG4gICAgLy8gdGhpcy5wcm9wcy5jaGFuZ2UoJ3NpbmdsZUZyaWVuZCcsIHRoaXMuc3RhdGUucmF0aW5nLmZyaWVuZFVzZXJOYW1lKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIC8vbm90ZSwgb24gY2xpY2sgb2YgcG9ydHJhaXQsIG5hbWUsIHJldmlld1xyXG4gICAgLy9zaG91bGQgYmUgYWJsZSB0byBzZWUgYWxsIHRoZSBtb3ZpZXMgcmV2aWV3ZWQgYnkgZnJpZW5kXHJcbiAgICAvL29uIHNlbmQgd2F0Y2ggcmVxdWVzdCBjbGljaywgc2hvdWxkIHNlbmQgYSB3YXRjaCByZXF1ZXN0XHJcbiAgICBsZXQgcmF0aW5nID0gdGhpcy5zdGF0ZS5yYXRpbmc7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbGxlY3Rpb24taXRlbSByb3dcIiBvbkNsaWNrPXsoKT0+IGNvbnNvbGUubG9nKHRoYXQucHJvcHMpfT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzM1wiPlxyXG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBpZD1cIkZyaWVuZFwiIGNsYXNzTmFtZT1cIk1vdmllRW50cnlGcmllbmQgY29sIHM5XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvcFwiPlxyXG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9J2ZyaWVuZEVudHJ5SW5kaXZpZHVhbCBpbmRpdmlkdWFsJz48ZGl2IGNsYXNzTmFtZT1cImZyaWVuZE5hbWVcIiBvbkNsaWNrPXt0aGF0LnByb3BzLmZvZn0+e3JhdGluZy5mcmllbmRVc2VyTmFtZX08L2Rpdj48L2E+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJpZW5kUmV2aWV3XCI+eyhyYXRpbmcucmV2aWV3ID09PSBudWxsKSA/IHJhdGluZy5mcmllbmRVc2VyTmFtZSArICcgZGlkIG5vdCBsZWF2ZSBhIHJldmlldycgOiByYXRpbmcuZnJpZW5kVXNlck5hbWUgKyBcIidzIHJldmlldzogXCIgKyByYXRpbmcucmV2aWV3fTwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmllbmRSYXRpbmdcIj57KHJhdGluZy5zY29yZSA9PT0gbnVsbCkgPyByYXRpbmcuZnJpZW5kVXNlck5hbWUgKyAnIGhhdmUgbm90IHJhdGUgdGhlIG1vdmllIHlldCcgOiByYXRpbmcuZnJpZW5kVXNlck5hbWUgKyBcIidzIHJhdGluZyBpczogXCIgKyByYXRpbmcuc2NvcmV9PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcblxyXG59XHJcblxyXG53aW5kb3cuU2luZ2xlTW92aWVSYXRpbmdFbnRyeSA9IFNpbmdsZU1vdmllUmF0aW5nRW50cnk7XHJcblxyXG4iXX0=