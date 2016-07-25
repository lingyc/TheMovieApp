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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxzQjs7O0FBQ0osa0NBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDBHQUNYLEtBRFc7O0FBRWpCLFVBQUssS0FBTCxHQUFhO0FBQ1gsY0FBUSxNQUFNO0FBREgsS0FBYjtBQUZpQjtBQUtsQjs7Ozt3Q0FFbUI7QUFDbEIsY0FBUSxHQUFSLENBQVksS0FBSyxLQUFqQjtBQUNEOzs7Z0NBRVcsSyxFQUFPO0FBQ2pCLGNBQVEsR0FBUixDQUFZLElBQVo7OztBQUdEOzs7NkJBRVE7Ozs7QUFJUCxVQUFJLFNBQVMsS0FBSyxLQUFMLENBQVcsTUFBeEI7QUFDQSxVQUFJLE9BQU8sSUFBWDtBQUNBLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxxQkFBZixFQUFxQyxTQUFTO0FBQUEsbUJBQUssUUFBUSxHQUFSLENBQVksS0FBSyxLQUFqQixDQUFMO0FBQUEsV0FBOUM7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFFBQWY7QUFDRSx1Q0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREYsU0FERjtBQUlFO0FBQUE7QUFBQSxZQUFLLElBQUcsUUFBUixFQUFpQixXQUFVLHlCQUEzQjtBQUNFO0FBQUE7QUFBQSxjQUFLLFdBQVUsS0FBZjtBQUNFO0FBQUE7QUFBQSxnQkFBSyxXQUFVLHFCQUFmO0FBQUE7QUFBQSxhQURGO0FBRUU7QUFBQTtBQUFBLGdCQUFHLFdBQVUsa0NBQWI7QUFBZ0Q7QUFBQTtBQUFBLGtCQUFLLFdBQVUsWUFBZixFQUE0QixTQUFTLEtBQUssS0FBTCxDQUFXLEdBQWhEO0FBQXNELHVCQUFPO0FBQTdEO0FBQWhEO0FBRkYsV0FERjtBQUtFO0FBQUE7QUFBQSxjQUFLLFdBQVUsY0FBZjtBQUFnQyxtQkFBTyxNQUFQLEtBQWtCLElBQW5CLEdBQTJCLE9BQU8sY0FBUCxHQUF3Qix5QkFBbkQsR0FBK0UsT0FBTyxjQUFQLEdBQXdCLGFBQXhCLEdBQXdDLE9BQU87QUFBN0osV0FMRjtBQU1FO0FBQUE7QUFBQSxjQUFLLFdBQVUsY0FBZjtBQUFnQyxtQkFBTyxLQUFQLEtBQWlCLElBQWxCLEdBQTBCLE9BQU8sY0FBUCxHQUF3Qiw4QkFBbEQsR0FBbUYsT0FBTyxjQUFQLEdBQXdCLGdCQUF4QixHQUEyQyxPQUFPO0FBQXBLO0FBTkY7QUFKRixPQURGO0FBZUQ7Ozs7RUF2Q2tDLE1BQU0sUzs7QUEyQzNDLE9BQU8sc0JBQVAsR0FBZ0Msc0JBQWhDIiwiZmlsZSI6IlNpbmdsZU1vdmllUmF0aW5nRW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTaW5nbGVNb3ZpZVJhdGluZ0VudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHJhdGluZzogcHJvcHMucmF0aW5nXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soYnVkZHkpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzKVxuICAgIC8vIHRoaXMucHJvcHMuZm9mKGJ1ZGR5KTtcbiAgICAvLyB0aGlzLnByb3BzLmNoYW5nZSgnc2luZ2xlRnJpZW5kJywgdGhpcy5zdGF0ZS5yYXRpbmcuZnJpZW5kVXNlck5hbWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vbm90ZSwgb24gY2xpY2sgb2YgcG9ydHJhaXQsIG5hbWUsIHJldmlld1xuICAgIC8vc2hvdWxkIGJlIGFibGUgdG8gc2VlIGFsbCB0aGUgbW92aWVzIHJldmlld2VkIGJ5IGZyaWVuZFxuICAgIC8vb24gc2VuZCB3YXRjaCByZXF1ZXN0IGNsaWNrLCBzaG91bGQgc2VuZCBhIHdhdGNoIHJlcXVlc3RcbiAgICBsZXQgcmF0aW5nID0gdGhpcy5zdGF0ZS5yYXRpbmc7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbGxlY3Rpb24taXRlbSByb3dcIiBvbkNsaWNrPXsoKT0+IGNvbnNvbGUubG9nKHRoYXQucHJvcHMpfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wgczNcIj5cbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT0ncHJvZmlsZXRodW1uYWlsJyBzcmM9eydodHRwczovL3Vuc3BsYXNoLml0LzE3MC8xNzAvP3JhbmRvbSd9Lz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgaWQ9XCJGcmllbmRcIiBjbGFzc05hbWU9XCJNb3ZpZUVudHJ5RnJpZW5kIGNvbCBzOVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9wXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpcmVuZENvbXBhdGFiaWxpdHlcIj50YXN0ZSBjb21wYXRhYmlsaXR5IHdpdGggbWU6IDkwJTwvZGl2PlxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPSdmcmllbmRFbnRyeUluZGl2aWR1YWwgaW5kaXZpZHVhbCc+PGRpdiBjbGFzc05hbWU9XCJmcmllbmROYW1lXCIgb25DbGljaz17dGhhdC5wcm9wcy5mb2Z9PntyYXRpbmcuZnJpZW5kVXNlck5hbWV9PC9kaXY+PC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJpZW5kUmV2aWV3XCI+eyhyYXRpbmcucmV2aWV3ID09PSBudWxsKSA/IHJhdGluZy5mcmllbmRVc2VyTmFtZSArICcgZGlkIG5vdCBsZWF2ZSBhIHJldmlldycgOiByYXRpbmcuZnJpZW5kVXNlck5hbWUgKyBcIidzIHJldmlldzogXCIgKyByYXRpbmcucmV2aWV3fTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJpZW5kUmF0aW5nXCI+eyhyYXRpbmcuc2NvcmUgPT09IG51bGwpID8gcmF0aW5nLmZyaWVuZFVzZXJOYW1lICsgJyBoYXZlIG5vdCByYXRlIHRoZSBtb3ZpZSB5ZXQnIDogcmF0aW5nLmZyaWVuZFVzZXJOYW1lICsgXCIncyByYXRpbmcgaXM6IFwiICsgcmF0aW5nLnNjb3JlfTwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxufVxuXG53aW5kb3cuU2luZ2xlTW92aWVSYXRpbmdFbnRyeSA9IFNpbmdsZU1vdmllUmF0aW5nRW50cnk7XG5cbiJdfQ==