'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovieWatchRequest = function (_React$Component) {
  _inherits(MovieWatchRequest, _React$Component);

  function MovieWatchRequest(props) {
    _classCallCheck(this, MovieWatchRequest);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MovieWatchRequest).call(this, props));

    _this.state = {
      active: false,
      friends: [],
      filteredFriends: [],
      friendStash: [],
      message: '',
      requestSent: false,
      noRequesteeWarning: false
    };
    return _this;
  }

  _createClass(MovieWatchRequest, [{
    key: 'getFriendList',
    value: function getFriendList() {
      var _this2 = this;

      //send get request to retrive friends and set to this.state.friends
      $.get(Url + '/getFriendList').then(function (friends) {
        console.log('response from server', friends);
        var uniqFriend = _.uniq(friends);
        _this2.setState({
          friends: uniqFriend,
          filteredFriends: uniqFriend
        });
      });
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {
      //will turn this.state.active to true and rerender the view
      this.setState({
        active: !this.state.active,
        requestSent: false

      });
      this.getFriendList();
    }
  }, {
    key: 'handleMsg',
    value: function handleMsg(event) {
      this.setState({
        message: event.target.value
      });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit() {
      var _this3 = this;

      //will send out a watch request for this.props.movie to friends in the stash
      //will display a message saying the request is made
      //set this.state.active to false
      //set the stash to empty
      //show send another request button
      if (this.state.friendStash.length) {
        var requestObj = {
          requestTyp: 'watch',
          movie: this.props.movie.title,
          movieid: this.props.movie.id,
          message: this.state.message,
          requestee: this.state.friendStash
        };

        $.post(Url + '/sendWatchRequest', requestObj).done(function (response) {
          _this3.setState({
            active: false,
            friendStash: [],
            filter: '',
            message: '',
            requestSent: true
          });
        });
      } else {
        this.setState({
          noRequesteeWarning: true
        });
      }
    }
  }, {
    key: 'handleFilter',
    value: function handleFilter(event) {
      //Filter a particular friend in the friend list

      var filteredFriends = [];
      this.state.friends.forEach(function (friend) {
        if (friend.indexOf(event.target.value) > -1) {
          filteredFriends.push(friend);
        }
      });

      this.setState({
        filteredFriends: filteredFriends
      });
    }
  }, {
    key: 'handleAddFriend',
    value: function handleAddFriend(friend) {
      //add friend to stash
      console.log('calling handleAddFriend');
      if (this.state.friendStash.indexOf(friend) < 0) {
        var stashCopy = this.state.friendStash;
        stashCopy.unshift(friend);
        this.setState({
          friendStash: stashCopy
        });
      }
    }
  }, {
    key: 'handleRemoveFriend',
    value: function handleRemoveFriend(friend) {
      //remove friend from stash
      var idx = this.state.friendStash.indexOf(friend);
      if (this.state.friendStash.length === 1) {
        this.setState({
          friendStash: []
        });
      } else {
        var stashCopy = this.state.friendStash;
        stashCopy.splice(idx, 1);
        this.setState({
          friendStash: stashCopy
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      if (this.state.active) {
        if (this.state.friendStash.length > 0) {
          var stash = React.createElement(
            'div',
            { className: 'MovieWatchRequestFriendStash col s6' },
            React.createElement(
              'ul',
              { className: 'friendStash', name: 'friendStash', multiple: true },
              this.state.friendStash.map(function (friend) {
                return React.createElement(WatchRequestStashEntry, { friend: friend, handleRemoveFriend: _this4.handleRemoveFriend.bind(_this4) });
              })
            )
          );
        } else if (this.state.friendStash.length === 0) {
          var stash = React.createElement(
            'div',
            { className: 'MovieWatchRequestFriendStash col s6' },
            React.createElement(
              'ul',
              { className: 'friendStash', name: 'friendStash', multiple: true },
              React.createElement(
                'div',
                { className: 'errorMsg' },
                'please select a friend'
              )
            )
          );
        }

        return React.createElement(
          'div',
          { className: 'activeWatchRequest' },
          React.createElement('input', { type: 'text', placeholder: 'filter friends', onChange: this.handleFilter.bind(this) }),
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'MovieWatchRequestFriendList col s6' },
              React.createElement(
                'ul',
                { className: 'friendList', name: 'friendsList', multiple: true },
                this.state.filteredFriends.length === 0 ? React.createElement(
                  'div',
                  { className: 'errorMsg' },
                  '\'no friend match is found\''
                ) : '',
                this.state.filteredFriends.map(function (friend) {
                  return React.createElement(WatchRequestFriendEntry, { friend: friend, handleAddFriend: _this4.handleAddFriend.bind(_this4) });
                })
              )
            ),
            stash
          ),
          React.createElement('textarea', { className: 'messageBox', cols: '40', rows: '5', onChange: this.handleMsg.bind(this), placeholder: 'Add a message', maxlength: '255' }),
          React.createElement(
            'button',
            { className: 'watchRequest', onClick: this.handleSubmit.bind(this) },
            'send watch request'
          ),
          React.createElement(
            'button',
            { className: 'closeWatchRequest', onClick: this.handleClick.bind(this) },
            'close watch request'
          )
        );
      } else {
        return React.createElement(
          'div',
          null,
          React.createElement(
            'button',
            { className: 'watchRequestButton', onClick: this.handleClick.bind(this) },
            this.state.requestSent ? 'send another watch request' : 'send a watch request'
          ),
          React.createElement(
            'span',
            { className: 'sent updateMsg' },
            this.state.requestSent ? 'your request has been sent' : ''
          )
        );
      }
    }
  }]);

  return MovieWatchRequest;
}(React.Component);

var WatchRequestFriendEntry = function WatchRequestFriendEntry(props) {

  return React.createElement(
    'li',
    null,
    React.createElement(
      'span',
      null,
      props.friend
    ),
    React.createElement(
      'a',
      { className: 'btn-floating btn-small waves-effect waves-light red', onClick: function onClick() {
          return props.handleAddFriend(props.friend);
        } },
      React.createElement(
        'i',
        { 'class': 'material-icons' },
        '+'
      )
    )
  );
};

var WatchRequestStashEntry = function WatchRequestStashEntry(props) {
  return React.createElement(
    'li',
    null,
    React.createElement(
      'span',
      null,
      props.friend
    ),
    React.createElement(
      'a',
      { className: 'btn-floating btn-small waves-effect waves-light red', onClick: function onClick() {
          return props.handleRemoveFriend(props.friend);
        } },
      React.createElement(
        'i',
        { 'class': 'material-icons' },
        '-'
      )
    )
  );
};

window.MovieWatchRequest = MovieWatchRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZVdhdGNoUmVxdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0saUI7OztBQUVKLDZCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxxR0FDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYTtBQUNaLGNBQVEsS0FESTtBQUVaLGVBQVMsRUFGRztBQUdYLHVCQUFpQixFQUhOO0FBSVosbUJBQVksRUFKQTtBQUtYLGVBQVMsRUFMRTtBQU1YLG1CQUFhLEtBTkY7QUFPWCwwQkFBb0I7QUFQVCxLQUFiO0FBRmlCO0FBV2xCOzs7O29DQUVlO0FBQUE7O0FBQ2Y7QUFDQyxRQUFFLEdBQUYsQ0FBTSxNQUFNLGdCQUFaLEVBQ0MsSUFERCxDQUNNLG1CQUFXO0FBQ2YsZ0JBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW9DLE9BQXBDO0FBQ0EsWUFBSSxhQUFhLEVBQUUsSUFBRixDQUFPLE9BQVAsQ0FBakI7QUFDQSxlQUFLLFFBQUwsQ0FBYztBQUNaLG1CQUFTLFVBREc7QUFFWiwyQkFBaUI7QUFGTCxTQUFkO0FBSUQsT0FSRDtBQVNEOzs7a0NBRWE7QUFDYjtBQUNDLFdBQUssUUFBTCxDQUFjO0FBQ1osZ0JBQVEsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxNQURSO0FBRVoscUJBQWE7O0FBRkQsT0FBZDtBQUtBLFdBQUssYUFBTDtBQUNEOzs7OEJBRVMsSyxFQUFPO0FBQ2YsV0FBSyxRQUFMLENBQWM7QUFDWixpQkFBUyxNQUFNLE1BQU4sQ0FBYTtBQURWLE9BQWQ7QUFHRDs7O21DQUVjO0FBQUE7O0FBQ2Q7QUFDQTtBQUNBO0FBQ0M7QUFDRDtBQUNDLFVBQUksS0FBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixNQUEzQixFQUFtQztBQUNqQyxZQUFJLGFBQWE7QUFDZixzQkFBWSxPQURHO0FBRWYsaUJBQU8sS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixLQUZUO0FBR2Ys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cXVlc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICBcdFx0YWN0aXZlOiBmYWxzZSxcbiAgIFx0XHRmcmllbmRzOiBbXSxcbiAgICAgIGZpbHRlcmVkRnJpZW5kczogW10sXG4gICBcdFx0ZnJpZW5kU3Rhc2g6W10sXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICAgIHJlcXVlc3RTZW50OiBmYWxzZSxcbiAgICAgIG5vUmVxdWVzdGVlV2FybmluZzogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgZ2V0RnJpZW5kTGlzdCgpIHtcbiAgXHQvL3NlbmQgZ2V0IHJlcXVlc3QgdG8gcmV0cml2ZSBmcmllbmRzIGFuZCBzZXQgdG8gdGhpcy5zdGF0ZS5mcmllbmRzXG4gICAgJC5nZXQoVXJsICsgJy9nZXRGcmllbmRMaXN0JylcbiAgICAudGhlbihmcmllbmRzID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlcicsIGZyaWVuZHMpO1xuICAgICAgdmFyIHVuaXFGcmllbmQgPSBfLnVuaXEoZnJpZW5kcyk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZnJpZW5kczogdW5pcUZyaWVuZCxcbiAgICAgICAgZmlsdGVyZWRGcmllbmRzOiB1bmlxRnJpZW5kXG4gICAgICB9KTtcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlQ2xpY2soKSB7XG4gIFx0Ly93aWxsIHR1cm4gdGhpcy5zdGF0ZS5hY3RpdmUgdG8gdHJ1ZSBhbmQgcmVyZW5kZXIgdGhlIHZpZXdcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGFjdGl2ZTogIXRoaXMuc3RhdGUuYWN0aXZlLFxuICAgICAgcmVxdWVzdFNlbnQ6IGZhbHNlXG5cbiAgICB9KVxuICAgIHRoaXMuZ2V0RnJpZW5kTGlzdCgpO1xuICB9XG5cbiAgaGFuZGxlTXNnKGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtZXNzYWdlOiBldmVudC50YXJnZXQudmFsdWVcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlU3VibWl0KCkge1xuICBcdC8vd2lsbCBzZW5kIG91dCBhIHdhdGNoIHJlcXVlc3QgZm9yIHRoaXMucHJvcHMubW92aWUgdG8gZnJpZW5kcyBpbiB0aGUgc3Rhc2hcbiAgXHQvL3dpbGwgZGlzcGxheSBhIG1lc3NhZ2Ugc2F5aW5nIHRoZSByZXF1ZXN0IGlzIG1hZGVcbiAgXHQvL3NldCB0aGlzLnN0YXRlLmFjdGl2ZSB0byBmYWxzZVxuICAgIC8vc2V0IHRoZSBzdGFzaCB0byBlbXB0eVxuICBcdC8vc2hvdyBzZW5kIGFub3RoZXIgcmVxdWVzdCBidXR0b25cbiAgICBpZiAodGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5sZW5ndGgpIHtcbiAgICAgIHZhciByZXF1ZXN0T2JqID0ge1xuICAgICAgICByZXF1ZXN0VHlwOiAnd2F0Y2gnLFxuICAgICAgICBtb3ZpZTogdGhpcy5wcm9wcy5tb3ZpZS50aXRsZSxcbiAgICAgICAgbW92aWVpZDogdGhpcy5wcm9wcy5tb3ZpZS5pZCxcbiAgICAgICAgbWVzc2FnZTogdGhpcy5zdGF0ZS5tZXNzYWdlLFxuICAgICAgICByZXF1ZXN0ZWU6IHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2hcbiAgICAgIH07XG5cbiAgICAgICQucG9zdChVcmwgKyAnL3NlbmRXYXRjaFJlcXVlc3QnLCByZXF1ZXN0T2JqKVxuICAgICAgLmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgICAgIGZyaWVuZFN0YXNoOiBbXSxcbiAgICAgICAgICBmaWx0ZXI6ICcnLFxuICAgICAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgICAgIHJlcXVlc3RTZW50OiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG5vUmVxdWVzdGVlV2FybmluZzogdHJ1ZVxuICAgICAgfSlcbiAgICB9XG5cbiAgfVxuXG4gIGhhbmRsZUZpbHRlcihldmVudCkge1xuICBcdC8vRmlsdGVyIGEgcGFydGljdWxhciBmcmllbmQgaW4gdGhlIGZyaWVuZCBsaXN0XG5cbiAgICB2YXIgZmlsdGVyZWRGcmllbmRzID0gW107XG4gICAgdGhpcy5zdGF0ZS5mcmllbmRzLmZvckVhY2goZnJpZW5kID0+IHtcbiAgICAgIGlmIChmcmllbmQuaW5kZXhPZihldmVudC50YXJnZXQudmFsdWUpID4gLTEgKSB7XG4gICAgICAgIGZpbHRlcmVkRnJpZW5kcy5wdXNoKGZyaWVuZCk7XG4gICAgICB9XG4gICAgfSlcbiAgICBcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbHRlcmVkRnJpZW5kczogZmlsdGVyZWRGcmllbmRzXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVBZGRGcmllbmQoZnJpZW5kKSB7XG4gICAgLy9hZGQgZnJpZW5kIHRvIHN0YXNoXG4gICAgY29uc29sZS5sb2coJ2NhbGxpbmcgaGFuZGxlQWRkRnJpZW5kJyk7XG4gICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2guaW5kZXhPZihmcmllbmQpIDwgMCkge1xuICAgICAgdmFyIHN0YXNoQ29weSA9IHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2g7XG4gICAgICBzdGFzaENvcHkudW5zaGlmdChmcmllbmQpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZyaWVuZFN0YXNoOiBzdGFzaENvcHlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVJlbW92ZUZyaWVuZChmcmllbmQpIHtcbiAgICAvL3JlbW92ZSBmcmllbmQgZnJvbSBzdGFzaFxuICAgIHZhciBpZHggPSB0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmluZGV4T2YoZnJpZW5kKVxuICAgIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZyaWVuZFN0YXNoOiBbXVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFzaENvcHkgPSB0aGlzLnN0YXRlLmZyaWVuZFN0YXNoO1xuICAgICAgc3Rhc2hDb3B5LnNwbGljZShpZHgsIDEpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZyaWVuZFN0YXNoOiBzdGFzaENvcHlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIHN0YXNoID0gXG4gICAgICAgICAgKDxkaXYgY2xhc3NOYW1lPVwiTW92aWVXYXRjaFJlcXVlc3RGcmllbmRTdGFzaCBjb2wgczZcIj5cbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJmcmllbmRTdGFzaFwiIG5hbWU9XCJmcmllbmRTdGFzaFwiIG11bHRpcGxlPlxuICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5tYXAoZnJpZW5kID0+IDxXYXRjaFJlcXVlc3RTdGFzaEVudHJ5IGZyaWVuZD17ZnJpZW5kfSBoYW5kbGVSZW1vdmVGcmllbmQ9e3RoaXMuaGFuZGxlUmVtb3ZlRnJpZW5kLmJpbmQodGhpcyl9Lz4pfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L2Rpdj4pXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHZhciBzdGFzaCA9IFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIk1vdmllV2F0Y2hSZXF1ZXN0RnJpZW5kU3Rhc2ggY29sIHM2XCI+XG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZyaWVuZFN0YXNoXCIgbmFtZT1cImZyaWVuZFN0YXNoXCIgbXVsdGlwbGU+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+cGxlYXNlIHNlbGVjdCBhIGZyaWVuZDwvZGl2PlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdGl2ZVdhdGNoUmVxdWVzdFwiPlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiZmlsdGVyIGZyaWVuZHNcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVGaWx0ZXIuYmluZCh0aGlzKX0vPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIk1vdmllV2F0Y2hSZXF1ZXN0RnJpZW5kTGlzdCBjb2wgczZcIj5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZyaWVuZExpc3RcIiBuYW1lPVwiZnJpZW5kc0xpc3RcIiBtdWx0aXBsZT5cbiAgICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUuZmlsdGVyZWRGcmllbmRzLmxlbmd0aCA9PT0gMCkgPyA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+J25vIGZyaWVuZCBtYXRjaCBpcyBmb3VuZCc8L2Rpdj4gOiAnJ31cbiAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5maWx0ZXJlZEZyaWVuZHMubWFwKGZyaWVuZCA9PiA8V2F0Y2hSZXF1ZXN0RnJpZW5kRW50cnkgZnJpZW5kPXtmcmllbmR9IGhhbmRsZUFkZEZyaWVuZD17dGhpcy5oYW5kbGVBZGRGcmllbmQuYmluZCh0aGlzKX0vPil9XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAge3N0YXNofVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJtZXNzYWdlQm94XCIgY29scz1cIjQwXCIgcm93cz1cIjVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVNc2cuYmluZCh0aGlzKX0gcGxhY2Vob2xkZXI9XCJBZGQgYSBtZXNzYWdlXCIgbWF4bGVuZ3RoPVwiMjU1XCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIndhdGNoUmVxdWVzdFwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyl9PnNlbmQgd2F0Y2ggcmVxdWVzdDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiY2xvc2VXYXRjaFJlcXVlc3RcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyl9PmNsb3NlIHdhdGNoIHJlcXVlc3Q8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ3YXRjaFJlcXVlc3RCdXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyl9PnsodGhpcy5zdGF0ZS5yZXF1ZXN0U2VudCkgPyAnc2VuZCBhbm90aGVyIHdhdGNoIHJlcXVlc3QnIDogJ3NlbmQgYSB3YXRjaCByZXF1ZXN0J308L2J1dHRvbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3NlbnQgdXBkYXRlTXNnJz57KHRoaXMuc3RhdGUucmVxdWVzdFNlbnQpID8gJ3lvdXIgcmVxdWVzdCBoYXMgYmVlbiBzZW50JyA6ICcnfTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICB9XG4gIH1cbn1cblxuXG5cblxudmFyIFdhdGNoUmVxdWVzdEZyaWVuZEVudHJ5ID0gKHByb3BzKSA9PiB7XG5cbiAgcmV0dXJuICg8bGk+PHNwYW4+e3Byb3BzLmZyaWVuZH08L3NwYW4+PGEgY2xhc3NOYW1lPVwiYnRuLWZsb2F0aW5nIGJ0bi1zbWFsbCB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgcmVkXCIgb25DbGljaz17KCkgPT4gcHJvcHMuaGFuZGxlQWRkRnJpZW5kKHByb3BzLmZyaWVuZCl9PjxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj4rPC9pPjwvYT48L2xpPilcbn07XG5cbnZhciBXYXRjaFJlcXVlc3RTdGFzaEVudHJ5ID0gKHByb3BzKSA9PiB7XG4gIHJldHVybiAoPGxpPjxzcGFuPntwcm9wcy5mcmllbmR9PC9zcGFuPjxhIGNsYXNzTmFtZT1cImJ0bi1mbG9hdGluZyBidG4tc21hbGwgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IHJlZFwiIG9uQ2xpY2s9eygpID0+IHByb3BzLmhhbmRsZVJlbW92ZUZyaWVuZChwcm9wcy5mcmllbmQpfT48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+LTwvaT48L2E+PC9saT4pXG59O1xuXG5cbndpbmRvdy5Nb3ZpZVdhdGNoUmVxdWVzdCA9IE1vdmllV2F0Y2hSZXF1ZXN0O1xuXG5cblxuIl19