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
              { className: "individual" },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxzQjs7O0FBQ0osa0NBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDBHQUNYLEtBRFc7O0FBRWpCLFVBQUssS0FBTCxHQUFhO0FBQ1gsY0FBUSxNQUFNO0FBREgsS0FBYjtBQUZpQjtBQUtsQjs7Ozt3Q0FFbUI7QUFDbEIsY0FBUSxHQUFSLENBQVksS0FBSyxLQUFqQjtBQUNEOzs7a0NBRWE7QUFDWixjQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0E7QUFDQTtBQUNEOzs7NkJBRVE7QUFDUDtBQUNBO0FBQ0E7QUFDQSxVQUFJLFNBQVMsS0FBSyxLQUFMLENBQVcsTUFBeEI7QUFDQSxVQUFJLE9BQU8sSUFBWDtBQUNBLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxxQkFBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZjtBQUNFLHVDQUFLLFdBQVUsaUJBQWYsRUFBaUMsS0FBSyxxQ0FBdEM7QUFERixTQURGO0FBSUU7QUFBQTtBQUFBLFlBQUssSUFBRyxRQUFSLEVBQWlCLFdBQVUseUJBQTNCO0FBQ0U7QUFBQTtBQUFBLGNBQUssV0FBVSxLQUFmO0FBQ0U7QUFBQTtBQUFBLGdCQUFLLFdBQVUscUJBQWY7QUFBQTtBQUFBLGFBREY7QUFFRTtBQUFBO0FBQUEsZ0JBQUcsV0FBVSxZQUFiO0FBQTBCO0FBQUE7QUFBQSxrQkFBSyxXQUFVLFlBQWYsRUFBNEIsU0FBUyxLQUFLLEtBQUwsQ0FBVyxHQUFoRDtBQUFzRCx1QkFBTztBQUE3RDtBQUExQjtBQUZGLFdBREY7QUFLRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGNBQWY7QUFBZ0MsbUJBQU8sTUFBUCxLQUFrQixJQUFuQixHQUEyQixPQUFPLGNBQVAsR0FBd0IseUJBQW5ELEdBQStFLE9BQU8sY0FBUCxHQUF3QixhQUF4QixHQUF3QyxPQUFPO0FBQTdKLFdBTEY7QUFNRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGNBQWY7QUFBZ0MsbUJBQU8sS0FBUCxLQUFpQixJQUFsQixHQUEwQixPQUFPLGNBQVAsR0FBd0IsOEJBQWxELEdBQW1GLE9BQU8sY0FBUCxHQUF3QixnQkFBeEIsR0FBMkMsT0FBTztBQUFwSztBQU5GO0FBSkYsT0FERjtBQWVEOzs7O0VBdkNrQyxNQUFNLFM7O0FBMkMzQyxPQUFPLHNCQUFQLEdBQWdDLHNCQUFoQyIsImZpbGUiOiJTaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2luZ2xlTW92aWVSYXRpbmdFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICByYXRpbmc6IHByb3BzLnJhdGluZ1xuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMpXG4gICAgLy8gdGhpcy5wcm9wcy5mb2YoKTtcbiAgICAvLyB0aGlzLnByb3BzLmNoYW5nZSgnc2luZ2xlRnJpZW5kJywgdGhpcy5zdGF0ZS5yYXRpbmcuZnJpZW5kVXNlck5hbWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vbm90ZSwgb24gY2xpY2sgb2YgcG9ydHJhaXQsIG5hbWUsIHJldmlld1xuICAgIC8vc2hvdWxkIGJlIGFibGUgdG8gc2VlIGFsbCB0aGUgbW92aWVzIHJldmlld2VkIGJ5IGZyaWVuZFxuICAgIC8vb24gc2VuZCB3YXRjaCByZXF1ZXN0IGNsaWNrLCBzaG91bGQgc2VuZCBhIHdhdGNoIHJlcXVlc3RcbiAgICBsZXQgcmF0aW5nID0gdGhpcy5zdGF0ZS5yYXRpbmc7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbGxlY3Rpb24taXRlbSByb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wgczNcIj5cbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT0ncHJvZmlsZXRodW1uYWlsJyBzcmM9eydodHRwczovL3Vuc3BsYXNoLml0LzE3MC8xNzAvP3JhbmRvbSd9Lz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgaWQ9XCJGcmllbmRcIiBjbGFzc05hbWU9XCJNb3ZpZUVudHJ5RnJpZW5kIGNvbCBzOVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9wXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpcmVuZENvbXBhdGFiaWxpdHlcIj50YXN0ZSBjb21wYXRhYmlsaXR5IHdpdGggbWU6IDkwJTwvZGl2PlxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPSdpbmRpdmlkdWFsJz48ZGl2IGNsYXNzTmFtZT1cImZyaWVuZE5hbWVcIiBvbkNsaWNrPXt0aGF0LnByb3BzLmZvZn0+e3JhdGluZy5mcmllbmRVc2VyTmFtZX08L2Rpdj48L2E+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmllbmRSZXZpZXdcIj57KHJhdGluZy5yZXZpZXcgPT09IG51bGwpID8gcmF0aW5nLmZyaWVuZFVzZXJOYW1lICsgJyBkaWQgbm90IGxlYXZlIGEgcmV2aWV3JyA6IHJhdGluZy5mcmllbmRVc2VyTmFtZSArIFwiJ3MgcmV2aWV3OiBcIiArIHJhdGluZy5yZXZpZXd9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmllbmRSYXRpbmdcIj57KHJhdGluZy5zY29yZSA9PT0gbnVsbCkgPyByYXRpbmcuZnJpZW5kVXNlck5hbWUgKyAnIGhhdmUgbm90IHJhdGUgdGhlIG1vdmllIHlldCcgOiByYXRpbmcuZnJpZW5kVXNlck5hbWUgKyBcIidzIHJhdGluZyBpczogXCIgKyByYXRpbmcuc2NvcmV9PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG59XG5cbndpbmRvdy5TaW5nbGVNb3ZpZVJhdGluZ0VudHJ5ID0gU2luZ2xlTW92aWVSYXRpbmdFbnRyeTtcblxuIl19