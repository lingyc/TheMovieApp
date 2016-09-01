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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzIl0sIm5hbWVzIjpbIlNpbmdsZU1vdmllUmF0aW5nRW50cnkiLCJwcm9wcyIsInN0YXRlIiwicmF0aW5nIiwiY29uc29sZSIsImxvZyIsImJ1ZGR5IiwidGhhdCIsImZvZiIsImZyaWVuZFVzZXJOYW1lIiwicmV2aWV3Iiwic2NvcmUiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxzQjs7O0FBQ0osa0NBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxnSkFDWEEsS0FEVzs7QUFFakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGNBQVFGLE1BQU1FO0FBREgsS0FBYjtBQUZpQjtBQUtsQjs7Ozt3Q0FFbUI7QUFDbEJDLGNBQVFDLEdBQVIsQ0FBWSxLQUFLSixLQUFqQjtBQUNEOzs7Z0NBRVdLLEssRUFBTztBQUNqQkYsY0FBUUMsR0FBUixDQUFZLElBQVo7QUFDQTtBQUNBO0FBQ0Q7Ozs2QkFFUTtBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQUlGLFNBQVMsS0FBS0QsS0FBTCxDQUFXQyxNQUF4QjtBQUNBLFVBQUlJLE9BQU8sSUFBWDtBQUNBLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxxQkFBZixFQUFxQyxTQUFTO0FBQUEsbUJBQUtILFFBQVFDLEdBQVIsQ0FBWUUsS0FBS04sS0FBakIsQ0FBTDtBQUFBLFdBQTlDO0FBQ0U7QUFBQTtBQUFBLFlBQUssV0FBVSxRQUFmO0FBQ0UsdUNBQUssV0FBVSxpQkFBZixFQUFpQyxLQUFLLHFDQUF0QztBQURGLFNBREY7QUFJRTtBQUFBO0FBQUEsWUFBSyxJQUFHLFFBQVIsRUFBaUIsV0FBVSx5QkFBM0I7QUFDRTtBQUFBO0FBQUEsY0FBSyxXQUFVLEtBQWY7QUFDRTtBQUFBO0FBQUEsZ0JBQUcsV0FBVSxrQ0FBYjtBQUFnRDtBQUFBO0FBQUEsa0JBQUssV0FBVSxZQUFmLEVBQTRCLFNBQVNNLEtBQUtOLEtBQUwsQ0FBV08sR0FBaEQ7QUFBc0RMLHVCQUFPTTtBQUE3RDtBQUFoRDtBQURGLFdBREY7QUFJRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGNBQWY7QUFBZ0NOLG1CQUFPTyxNQUFQLEtBQWtCLElBQW5CLEdBQTJCUCxPQUFPTSxjQUFQLEdBQXdCLHlCQUFuRCxHQUErRU4sT0FBT00sY0FBUCxHQUF3QixhQUF4QixHQUF3Q04sT0FBT087QUFBN0osV0FKRjtBQUtFO0FBQUE7QUFBQSxjQUFLLFdBQVUsY0FBZjtBQUFnQ1AsbUJBQU9RLEtBQVAsS0FBaUIsSUFBbEIsR0FBMEJSLE9BQU9NLGNBQVAsR0FBd0IsOEJBQWxELEdBQW1GTixPQUFPTSxjQUFQLEdBQXdCLGdCQUF4QixHQUEyQ04sT0FBT1E7QUFBcEs7QUFMRjtBQUpGLE9BREY7QUFjRDs7OztFQXRDa0NDLE1BQU1DLFM7O0FBMEMzQ0MsT0FBT2Qsc0JBQVAsR0FBZ0NBLHNCQUFoQyIsImZpbGUiOiJTaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2luZ2xlTW92aWVSYXRpbmdFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICByYXRpbmc6IHByb3BzLnJhdGluZ1xuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGJ1ZGR5KSB7XG4gICAgY29uc29sZS5sb2codGhpcylcbiAgICAvLyB0aGlzLnByb3BzLmZvZihidWRkeSk7XG4gICAgLy8gdGhpcy5wcm9wcy5jaGFuZ2UoJ3NpbmdsZUZyaWVuZCcsIHRoaXMuc3RhdGUucmF0aW5nLmZyaWVuZFVzZXJOYW1lKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvL25vdGUsIG9uIGNsaWNrIG9mIHBvcnRyYWl0LCBuYW1lLCByZXZpZXdcbiAgICAvL3Nob3VsZCBiZSBhYmxlIHRvIHNlZSBhbGwgdGhlIG1vdmllcyByZXZpZXdlZCBieSBmcmllbmRcbiAgICAvL29uIHNlbmQgd2F0Y2ggcmVxdWVzdCBjbGljaywgc2hvdWxkIHNlbmQgYSB3YXRjaCByZXF1ZXN0XG4gICAgbGV0IHJhdGluZyA9IHRoaXMuc3RhdGUucmF0aW5nO1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xsZWN0aW9uLWl0ZW0gcm93XCIgb25DbGljaz17KCk9PiBjb25zb2xlLmxvZyh0aGF0LnByb3BzKX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwiRnJpZW5kXCIgY2xhc3NOYW1lPVwiTW92aWVFbnRyeUZyaWVuZCBjb2wgczlcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvcFwiPlxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPSdmcmllbmRFbnRyeUluZGl2aWR1YWwgaW5kaXZpZHVhbCc+PGRpdiBjbGFzc05hbWU9XCJmcmllbmROYW1lXCIgb25DbGljaz17dGhhdC5wcm9wcy5mb2Z9PntyYXRpbmcuZnJpZW5kVXNlck5hbWV9PC9kaXY+PC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJpZW5kUmV2aWV3XCI+eyhyYXRpbmcucmV2aWV3ID09PSBudWxsKSA/IHJhdGluZy5mcmllbmRVc2VyTmFtZSArICcgZGlkIG5vdCBsZWF2ZSBhIHJldmlldycgOiByYXRpbmcuZnJpZW5kVXNlck5hbWUgKyBcIidzIHJldmlldzogXCIgKyByYXRpbmcucmV2aWV3fTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJpZW5kUmF0aW5nXCI+eyhyYXRpbmcuc2NvcmUgPT09IG51bGwpID8gcmF0aW5nLmZyaWVuZFVzZXJOYW1lICsgJyBoYXZlIG5vdCByYXRlIHRoZSBtb3ZpZSB5ZXQnIDogcmF0aW5nLmZyaWVuZFVzZXJOYW1lICsgXCIncyByYXRpbmcgaXM6IFwiICsgcmF0aW5nLnNjb3JlfTwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxufVxuXG53aW5kb3cuU2luZ2xlTW92aWVSYXRpbmdFbnRyeSA9IFNpbmdsZU1vdmllUmF0aW5nRW50cnk7XG5cbiJdfQ==