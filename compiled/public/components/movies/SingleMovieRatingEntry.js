"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleMovieRatingEntry = function (_React$Component) {
  _inherits(SingleMovieRatingEntry, _React$Component);

  function SingleMovieRatingEntry(props) {
    _classCallCheck(this, SingleMovieRatingEntry);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SingleMovieRatingEntry).call(this, props));

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
    value: function handleClick() {
      console.log(this);
      // this.props.fof();
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
        { className: "collection-item row" },
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
              "div",
              { className: "firendCompatability" },
              "taste compatability with me: 90%"
            ),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxzQjs7O0FBQ0osa0NBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDBHQUNYLEtBRFc7O0FBRWpCLFVBQUssS0FBTCxHQUFhO0FBQ1gsY0FBUSxNQUFNO0FBREgsS0FBYjtBQUZpQjtBQUtsQjs7Ozt3Q0FFbUI7QUFDbEIsY0FBUSxHQUFSLENBQVksS0FBSyxLQUFqQjtBQUNEOzs7a0NBRWE7QUFDWixjQUFRLEdBQVIsQ0FBWSxJQUFaOzs7QUFHRDs7OzZCQUVROzs7O0FBSVAsVUFBSSxTQUFTLEtBQUssS0FBTCxDQUFXLE1BQXhCO0FBQ0EsVUFBSSxPQUFPLElBQVg7QUFDQSxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUscUJBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFFBQWY7QUFDRSx1Q0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREYsU0FERjtBQUlFO0FBQUE7QUFBQSxZQUFLLElBQUcsUUFBUixFQUFpQixXQUFVLHlCQUEzQjtBQUNFO0FBQUE7QUFBQSxjQUFLLFdBQVUsS0FBZjtBQUNFO0FBQUE7QUFBQSxnQkFBSyxXQUFVLHFCQUFmO0FBQUE7QUFBQSxhQURGO0FBRUU7QUFBQTtBQUFBLGdCQUFHLFdBQVUsa0NBQWI7QUFBZ0Q7QUFBQTtBQUFBLGtCQUFLLFdBQVUsWUFBZixFQUE0QixTQUFTLEtBQUssS0FBTCxDQUFXLEdBQWhEO0FBQXNELHVCQUFPO0FBQTdEO0FBQWhEO0FBRkYsV0FERjtBQUtFO0FBQUE7QUFBQSxjQUFLLFdBQVUsY0FBZjtBQUFnQyxtQkFBTyxNQUFQLEtBQWtCLElBQW5CLEdBQTJCLE9BQU8sY0FBUCxHQUF3Qix5QkFBbkQsR0FBK0UsT0FBTyxjQUFQLEdBQXdCLGFBQXhCLEdBQXdDLE9BQU87QUFBN0osV0FMRjtBQU1FO0FBQUE7QUFBQSxjQUFLLFdBQVUsY0FBZjtBQUFnQyxtQkFBTyxLQUFQLEtBQWlCLElBQWxCLEdBQTBCLE9BQU8sY0FBUCxHQUF3Qiw4QkFBbEQsR0FBbUYsT0FBTyxjQUFQLEdBQXdCLGdCQUF4QixHQUEyQyxPQUFPO0FBQXBLO0FBTkY7QUFKRixPQURGO0FBZUQ7Ozs7RUF2Q2tDLE1BQU0sUzs7QUEyQzNDLE9BQU8sc0JBQVAsR0FBZ0Msc0JBQWhDIiwiZmlsZSI6IlNpbmdsZU1vdmllUmF0aW5nRW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTaW5nbGVNb3ZpZVJhdGluZ0VudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHJhdGluZzogcHJvcHMucmF0aW5nXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soKSB7XG4gICAgY29uc29sZS5sb2codGhpcylcbiAgICAvLyB0aGlzLnByb3BzLmZvZigpO1xuICAgIC8vIHRoaXMucHJvcHMuY2hhbmdlKCdzaW5nbGVGcmllbmQnLCB0aGlzLnN0YXRlLnJhdGluZy5mcmllbmRVc2VyTmFtZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgLy9ub3RlLCBvbiBjbGljayBvZiBwb3J0cmFpdCwgbmFtZSwgcmV2aWV3XG4gICAgLy9zaG91bGQgYmUgYWJsZSB0byBzZWUgYWxsIHRoZSBtb3ZpZXMgcmV2aWV3ZWQgYnkgZnJpZW5kXG4gICAgLy9vbiBzZW5kIHdhdGNoIHJlcXVlc3QgY2xpY2ssIHNob3VsZCBzZW5kIGEgd2F0Y2ggcmVxdWVzdFxuICAgIGxldCByYXRpbmcgPSB0aGlzLnN0YXRlLnJhdGluZztcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sbGVjdGlvbi1pdGVtIHJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzM1wiPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSdwcm9maWxldGh1bW5haWwnIHNyYz17J2h0dHBzOi8vdW5zcGxhc2guaXQvMTcwLzE3MC8/cmFuZG9tJ30vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cIkZyaWVuZFwiIGNsYXNzTmFtZT1cIk1vdmllRW50cnlGcmllbmQgY29sIHM5XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0b3BcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlyZW5kQ29tcGF0YWJpbGl0eVwiPnRhc3RlIGNvbXBhdGFiaWxpdHkgd2l0aCBtZTogOTAlPC9kaXY+XG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9J2ZyaWVuZEVudHJ5SW5kaXZpZHVhbCBpbmRpdmlkdWFsJz48ZGl2IGNsYXNzTmFtZT1cImZyaWVuZE5hbWVcIiBvbkNsaWNrPXt0aGF0LnByb3BzLmZvZn0+e3JhdGluZy5mcmllbmRVc2VyTmFtZX08L2Rpdj48L2E+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmllbmRSZXZpZXdcIj57KHJhdGluZy5yZXZpZXcgPT09IG51bGwpID8gcmF0aW5nLmZyaWVuZFVzZXJOYW1lICsgJyBkaWQgbm90IGxlYXZlIGEgcmV2aWV3JyA6IHJhdGluZy5mcmllbmRVc2VyTmFtZSArIFwiJ3MgcmV2aWV3OiBcIiArIHJhdGluZy5yZXZpZXd9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmllbmRSYXRpbmdcIj57KHJhdGluZy5zY29yZSA9PT0gbnVsbCkgPyByYXRpbmcuZnJpZW5kVXNlck5hbWUgKyAnIGhhdmUgbm90IHJhdGUgdGhlIG1vdmllIHlldCcgOiByYXRpbmcuZnJpZW5kVXNlck5hbWUgKyBcIidzIHJhdGluZyBpczogXCIgKyByYXRpbmcuc2NvcmV9PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG59XG5cbndpbmRvdy5TaW5nbGVNb3ZpZVJhdGluZ0VudHJ5ID0gU2luZ2xlTW92aWVSYXRpbmdFbnRyeTtcblxuIl19