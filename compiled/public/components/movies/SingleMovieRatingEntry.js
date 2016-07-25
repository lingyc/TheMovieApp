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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxzQjs7O0FBQ0osa0NBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDBHQUNYLEtBRFc7O0FBRWpCLFVBQUssS0FBTCxHQUFhO0FBQ1gsY0FBUSxNQUFNO0FBREgsS0FBYjtBQUZpQjtBQUtsQjs7Ozt3Q0FFbUI7QUFDbEIsY0FBUSxHQUFSLENBQVksS0FBSyxLQUFqQjtBQUNEOzs7a0NBRWE7QUFDWixjQUFRLEdBQVIsQ0FBWSxJQUFaOzs7QUFHRDs7OzZCQUVROzs7O0FBSVAsVUFBSSxTQUFTLEtBQUssS0FBTCxDQUFXLE1BQXhCO0FBQ0EsVUFBSSxPQUFPLElBQVg7QUFDQSxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUscUJBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFFBQWY7QUFDRSx1Q0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREYsU0FERjtBQUlFO0FBQUE7QUFBQSxZQUFLLElBQUcsUUFBUixFQUFpQixXQUFVLHlCQUEzQjtBQUNFO0FBQUE7QUFBQSxjQUFLLFdBQVUsS0FBZjtBQUNFO0FBQUE7QUFBQSxnQkFBSyxXQUFVLHFCQUFmO0FBQUE7QUFBQSxhQURGO0FBRUU7QUFBQTtBQUFBLGdCQUFHLFdBQVUsWUFBYjtBQUEwQjtBQUFBO0FBQUEsa0JBQUssV0FBVSxZQUFmLEVBQTRCLFNBQVMsS0FBSyxLQUFMLENBQVcsR0FBaEQ7QUFBc0QsdUJBQU87QUFBN0Q7QUFBMUI7QUFGRixXQURGO0FBS0U7QUFBQTtBQUFBLGNBQUssV0FBVSxjQUFmO0FBQWdDLG1CQUFPLE1BQVAsS0FBa0IsSUFBbkIsR0FBMkIsT0FBTyxjQUFQLEdBQXdCLHlCQUFuRCxHQUErRSxPQUFPLGNBQVAsR0FBd0IsYUFBeEIsR0FBd0MsT0FBTztBQUE3SixXQUxGO0FBTUU7QUFBQTtBQUFBLGNBQUssV0FBVSxjQUFmO0FBQWdDLG1CQUFPLEtBQVAsS0FBaUIsSUFBbEIsR0FBMEIsT0FBTyxjQUFQLEdBQXdCLDhCQUFsRCxHQUFtRixPQUFPLGNBQVAsR0FBd0IsZ0JBQXhCLEdBQTJDLE9BQU87QUFBcEs7QUFORjtBQUpGLE9BREY7QUFlRDs7OztFQXZDa0MsTUFBTSxTOztBQTJDM0MsT0FBTyxzQkFBUCxHQUFnQyxzQkFBaEMiLCJmaWxlIjoiU2luZ2xlTW92aWVSYXRpbmdFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNpbmdsZU1vdmllUmF0aW5nRW50cnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcmF0aW5nOiBwcm9wcy5yYXRpbmdcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5wcm9wcyk7XG4gIH1cblxuICBoYW5kbGVDbGljaygpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzKVxuICAgIC8vIHRoaXMucHJvcHMuZm9mKCk7XG4gICAgLy8gdGhpcy5wcm9wcy5jaGFuZ2UoJ3NpbmdsZUZyaWVuZCcsIHRoaXMuc3RhdGUucmF0aW5nLmZyaWVuZFVzZXJOYW1lKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvL25vdGUsIG9uIGNsaWNrIG9mIHBvcnRyYWl0LCBuYW1lLCByZXZpZXdcbiAgICAvL3Nob3VsZCBiZSBhYmxlIHRvIHNlZSBhbGwgdGhlIG1vdmllcyByZXZpZXdlZCBieSBmcmllbmRcbiAgICAvL29uIHNlbmQgd2F0Y2ggcmVxdWVzdCBjbGljaywgc2hvdWxkIHNlbmQgYSB3YXRjaCByZXF1ZXN0XG4gICAgbGV0IHJhdGluZyA9IHRoaXMuc3RhdGUucmF0aW5nO1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xsZWN0aW9uLWl0ZW0gcm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwiRnJpZW5kXCIgY2xhc3NOYW1lPVwiTW92aWVFbnRyeUZyaWVuZCBjb2wgczlcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvcFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXJlbmRDb21wYXRhYmlsaXR5XCI+dGFzdGUgY29tcGF0YWJpbGl0eSB3aXRoIG1lOiA5MCU8L2Rpdj5cbiAgICAgICAgICAgIDxhIGNsYXNzTmFtZT0naW5kaXZpZHVhbCc+PGRpdiBjbGFzc05hbWU9XCJmcmllbmROYW1lXCIgb25DbGljaz17dGhhdC5wcm9wcy5mb2Z9PntyYXRpbmcuZnJpZW5kVXNlck5hbWV9PC9kaXY+PC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJpZW5kUmV2aWV3XCI+eyhyYXRpbmcucmV2aWV3ID09PSBudWxsKSA/IHJhdGluZy5mcmllbmRVc2VyTmFtZSArICcgZGlkIG5vdCBsZWF2ZSBhIHJldmlldycgOiByYXRpbmcuZnJpZW5kVXNlck5hbWUgKyBcIidzIHJldmlldzogXCIgKyByYXRpbmcucmV2aWV3fTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJpZW5kUmF0aW5nXCI+eyhyYXRpbmcuc2NvcmUgPT09IG51bGwpID8gcmF0aW5nLmZyaWVuZFVzZXJOYW1lICsgJyBoYXZlIG5vdCByYXRlIHRoZSBtb3ZpZSB5ZXQnIDogcmF0aW5nLmZyaWVuZFVzZXJOYW1lICsgXCIncyByYXRpbmcgaXM6IFwiICsgcmF0aW5nLnNjb3JlfTwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxufVxuXG53aW5kb3cuU2luZ2xlTW92aWVSYXRpbmdFbnRyeSA9IFNpbmdsZU1vdmllUmF0aW5nRW50cnk7XG5cbiJdfQ==