'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovieWatchRequest = function (_React$Component) {
  _inherits(MovieWatchRequest, _React$Component);

  function MovieWatchRequest(props) {
    _classCallCheck(this, MovieWatchRequest);

    var _this = _possibleConstructorReturn(this, (MovieWatchRequest.__proto__ || Object.getPrototypeOf(MovieWatchRequest)).call(this, props));

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
      console.log('should be all friends to choose from', this.state.filteredFriends);
      //add friend to stash
      console.log('calling handleAddFriend');
      var newFilteredFriends = this.state.filteredFriends;
      newFilteredFriends.splice(newFilteredFriends.indexOf(friend), 1);
      if (this.state.friendStash.indexOf(friend) < 0) {
        var stashCopy = this.state.friendStash;
        stashCopy.unshift(friend);
        this.setState({
          friendStash: stashCopy,
          filteredFriends: newFilteredFriends
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
        console.log('im trying to remove', friend);
        var stashCopy = this.state.friendStash;
        stashCopy.splice(idx, 1);
        this.setState({
          friendStash: stashCopy
        });
      }

      var newFilteredFriends = this.state.filteredFriends.concat([friend]);
      this.setState({
        filteredFriends: newFilteredFriends
      });
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
                'Please Select A Friend'
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
            'Send Watch Request'
          ),
          React.createElement(
            'button',
            { className: 'closeWatchRequest', onClick: this.handleClick.bind(this) },
            'Close Watch Request'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZVdhdGNoUmVxdWVzdC5qcyJdLCJuYW1lcyI6WyJNb3ZpZVdhdGNoUmVxdWVzdCIsInByb3BzIiwic3RhdGUiLCJhY3RpdmUiLCJmcmllbmRzIiwiZmlsdGVyZWRGcmllbmRzIiwiZnJpZW5kU3Rhc2giLCJtZXNzYWdlIiwicmVxdWVzdFNlbnQiLCJub1JlcXVlc3RlZVdhcm5pbmciLCIkIiwiZ2V0IiwiVXJsIiwidGhlbiIsImNvbnNvbGUiLCJsb2ciLCJ1bmlxRnJpZW5kIiwiXyIsInVuaXEiLCJzZXRTdGF0ZSIsImdldEZyaWVuZExpc3QiLCJldmVudCIsInRhcmdldCIsInZhbHVlIiwibGVuZ3RoIiwicmVxdWVzdE9iaiIsInJlcXVlc3RUeXAiLCJtb3ZpZSIsInRpdGxlIiwibW92aWVpZCIsImlkIiwicmVxdWVzdGVlIiwicG9zdCIsImRvbmUiLCJmaWx0ZXIiLCJmb3JFYWNoIiwiZnJpZW5kIiwiaW5kZXhPZiIsInB1c2giLCJuZXdGaWx0ZXJlZEZyaWVuZHMiLCJzcGxpY2UiLCJzdGFzaENvcHkiLCJ1bnNoaWZ0IiwiaWR4IiwiY29uY2F0Iiwic3Rhc2giLCJtYXAiLCJoYW5kbGVSZW1vdmVGcmllbmQiLCJiaW5kIiwiaGFuZGxlRmlsdGVyIiwiaGFuZGxlQWRkRnJpZW5kIiwiaGFuZGxlTXNnIiwiaGFuZGxlU3VibWl0IiwiaGFuZGxlQ2xpY2siLCJSZWFjdCIsIkNvbXBvbmVudCIsIldhdGNoUmVxdWVzdEZyaWVuZEVudHJ5IiwiV2F0Y2hSZXF1ZXN0U3Rhc2hFbnRyeSIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxpQjs7O0FBRUosNkJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxzSUFDWEEsS0FEVzs7QUFFakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1pDLGNBQVEsS0FESTtBQUVaQyxlQUFTLEVBRkc7QUFHWEMsdUJBQWlCLEVBSE47QUFJWkMs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QUF6QkEsc0JBQXlCLENBQUN4RCxLQUFELEVBQVc7QUFDdEMsU0FBUTtBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUE7QUFBT0EsWUFBTW1DO0FBQWIsS0FBSjtBQUErQjtBQUFBO0FBQUEsUUFBRyxXQUFVLHFEQUFiLEVBQW1FLFNBQVM7QUFBQSxpQkFBTW5DLE1BQU04QyxrQkFBTixDQUF5QjlDLE1BQU1tQyxNQUEvQixDQUFOO0FBQUEsU0FBNUU7QUFBMEg7QUFBQTtBQUFBLFVBQUcsU0FBTSxnQkFBVDtBQUFBO0FBQUE7QUFBMUg7QUFBL0IsR0FBUjtBQUNELENBRkQ7O0FBS0FzQixPQUFPMUQsaUJBQVAsR0FBMkJBLGlCQUEzQiIsImZpbGUiOiJNb3ZpZVdhdGNoUmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1vdmllV2F0Y2hSZXF1ZXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgIFx0XHRhY3RpdmU6IGZhbHNlLFxyXG4gICBcdFx0ZnJpZW5kczogW10sXHJcbiAgICAgIGZpbHRlcmVkRnJpZW5kczogW10sXHJcbiAgIFx0XHRmcmllbmRTdGFzaDpbXSxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgIHJlcXVlc3RTZW50OiBmYWxzZSxcclxuICAgICAgbm9SZXF1ZXN0ZWVXYXJuaW5nOiBmYWxzZVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldEZyaWVuZExpc3QoKSB7XHJcbiAgXHQvL3NlbmQgZ2V0IHJlcXVlc3QgdG8gcmV0cml2ZSBmcmllbmRzIGFuZCBzZXQgdG8gdGhpcy5zdGF0ZS5mcmllbmRzXHJcbiAgICAkLmdldChVcmwgKyAnL2dldEZyaWVuZExpc3QnKVxyXG4gICAgLnRoZW4oZnJpZW5kcyA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlcicsIGZyaWVuZHMpO1xyXG4gICAgICB2YXIgdW5pcUZyaWVuZCA9IF8udW5pcShmcmllbmRzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZnJpZW5kczogdW5pcUZyaWVuZCxcclxuICAgICAgICBmaWx0ZXJlZEZyaWVuZHM6IHVuaXFGcmllbmRcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2xpY2soKSB7XHJcbiAgXHQvL3dpbGwgdHVybiB0aGlzLnN0YXRlLmFjdGl2ZSB0byB0cnVlIGFuZCByZXJlbmRlciB0aGUgdmlld1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGFjdGl2ZTogIXRoaXMuc3RhdGUuYWN0aXZlLFxyXG4gICAgICByZXF1ZXN0U2VudDogZmFsc2VcclxuXHJcbiAgICB9KVxyXG4gICAgdGhpcy5nZXRGcmllbmRMaXN0KCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVNc2coZXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBtZXNzYWdlOiBldmVudC50YXJnZXQudmFsdWVcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBoYW5kbGVTdWJtaXQoKSB7XHJcbiAgXHQvL3dpbGwgc2VuZCBvdXQgYSB3YXRjaCByZXF1ZXN0IGZvciB0aGlzLnByb3BzLm1vdmllIHRvIGZyaWVuZHMgaW4gdGhlIHN0YXNoXHJcbiAgXHQvL3dpbGwgZGlzcGxheSBhIG1lc3NhZ2Ugc2F5aW5nIHRoZSByZXF1ZXN0IGlzIG1hZGVcclxuICBcdC8vc2V0IHRoaXMuc3RhdGUuYWN0aXZlIHRvIGZhbHNlXHJcbiAgICAvL3NldCB0aGUgc3Rhc2ggdG8gZW1wdHlcclxuICBcdC8vc2hvdyBzZW5kIGFub3RoZXIgcmVxdWVzdCBidXR0b25cclxuICAgIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmxlbmd0aCkge1xyXG4gICAgICB2YXIgcmVxdWVzdE9iaiA9IHtcclxuICAgICAgICByZXF1ZXN0VHlwOiAnd2F0Y2gnLFxyXG4gICAgICAgIG1vdmllOiB0aGlzLnByb3BzLm1vdmllLnRpdGxlLFxyXG4gICAgICAgIG1vdmllaWQ6IHRoaXMucHJvcHMubW92aWUuaWQsXHJcbiAgICAgICAgbWVzc2FnZTogdGhpcy5zdGF0ZS5tZXNzYWdlLFxyXG4gICAgICAgIHJlcXVlc3RlZTogdGhpcy5zdGF0ZS5mcmllbmRTdGFzaFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFdhdGNoUmVxdWVzdCcsIHJlcXVlc3RPYmopXHJcbiAgICAgIC5kb25lKHJlc3BvbnNlID0+IHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXHJcbiAgICAgICAgICBmcmllbmRTdGFzaDogW10sXHJcbiAgICAgICAgICBmaWx0ZXI6ICcnLFxyXG4gICAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgICByZXF1ZXN0U2VudDogdHJ1ZVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbm9SZXF1ZXN0ZWVXYXJuaW5nOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgaGFuZGxlRmlsdGVyKGV2ZW50KSB7XHJcbiAgXHQvL0ZpbHRlciBhIHBhcnRpY3VsYXIgZnJpZW5kIGluIHRoZSBmcmllbmQgbGlzdFxyXG5cclxuICAgIHZhciBmaWx0ZXJlZEZyaWVuZHMgPSBbXTtcclxuICAgIHRoaXMuc3RhdGUuZnJpZW5kcy5mb3JFYWNoKGZyaWVuZCA9PiB7XHJcbiAgICAgIGlmIChmcmllbmQuaW5kZXhPZihldmVudC50YXJnZXQudmFsdWUpID4gLTEgKSB7XHJcbiAgICAgICAgZmlsdGVyZWRGcmllbmRzLnB1c2goZnJpZW5kKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIFxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGZpbHRlcmVkRnJpZW5kczogZmlsdGVyZWRGcmllbmRzXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUFkZEZyaWVuZChmcmllbmQpIHtcclxuICAgIGNvbnNvbGUubG9nKCdzaG91bGQgYmUgYWxsIGZyaWVuZHMgdG8gY2hvb3NlIGZyb20nLCB0aGlzLnN0YXRlLmZpbHRlcmVkRnJpZW5kcylcclxuICAgIC8vYWRkIGZyaWVuZCB0byBzdGFzaFxyXG4gICAgY29uc29sZS5sb2coJ2NhbGxpbmcgaGFuZGxlQWRkRnJpZW5kJyk7XHJcbiAgICB2YXIgbmV3RmlsdGVyZWRGcmllbmRzPXRoaXMuc3RhdGUuZmlsdGVyZWRGcmllbmRzO1xyXG4gICAgbmV3RmlsdGVyZWRGcmllbmRzLnNwbGljZShuZXdGaWx0ZXJlZEZyaWVuZHMuaW5kZXhPZihmcmllbmQpLDEpO1xyXG4gICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2guaW5kZXhPZihmcmllbmQpIDwgMCkge1xyXG4gICAgICB2YXIgc3Rhc2hDb3B5ID0gdGhpcy5zdGF0ZS5mcmllbmRTdGFzaDtcclxuICAgICAgc3Rhc2hDb3B5LnVuc2hpZnQoZnJpZW5kKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZnJpZW5kU3Rhc2g6IHN0YXNoQ29weSxcclxuICAgICAgICBmaWx0ZXJlZEZyaWVuZHM6bmV3RmlsdGVyZWRGcmllbmRzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlUmVtb3ZlRnJpZW5kKGZyaWVuZCkge1xyXG4gICAgLy9yZW1vdmUgZnJpZW5kIGZyb20gc3Rhc2hcclxuICAgIHZhciBpZHggPSB0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmluZGV4T2YoZnJpZW5kKVxyXG4gICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGZyaWVuZFN0YXNoOiBbXVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdpbSB0cnlpbmcgdG8gcmVtb3ZlJywgZnJpZW5kKTtcclxuICAgICAgdmFyIHN0YXNoQ29weSA9IHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2g7XHJcbiAgICAgIHN0YXNoQ29weS5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZnJpZW5kU3Rhc2g6IHN0YXNoQ29weVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbmV3RmlsdGVyZWRGcmllbmRzPXRoaXMuc3RhdGUuZmlsdGVyZWRGcmllbmRzLmNvbmNhdChbZnJpZW5kXSk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgZmlsdGVyZWRGcmllbmRzOiBuZXdGaWx0ZXJlZEZyaWVuZHNcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmUpIHtcclxuICAgICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHZhciBzdGFzaCA9IFxyXG4gICAgICAgICAgKDxkaXYgY2xhc3NOYW1lPVwiTW92aWVXYXRjaFJlcXVlc3RGcmllbmRTdGFzaCBjb2wgczZcIj5cclxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZyaWVuZFN0YXNoXCIgbmFtZT1cImZyaWVuZFN0YXNoXCIgbXVsdGlwbGU+XHJcbiAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubWFwKGZyaWVuZCA9PiA8V2F0Y2hSZXF1ZXN0U3Rhc2hFbnRyeSBmcmllbmQ9e2ZyaWVuZH0gaGFuZGxlUmVtb3ZlRnJpZW5kPXt0aGlzLmhhbmRsZVJlbW92ZUZyaWVuZC5iaW5kKHRoaXMpfS8+KX1cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvZGl2PilcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHZhciBzdGFzaCA9IFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTW92aWVXYXRjaFJlcXVlc3RGcmllbmRTdGFzaCBjb2wgczZcIj5cclxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJmcmllbmRTdGFzaFwiIG5hbWU9XCJmcmllbmRTdGFzaFwiIG11bHRpcGxlPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+UGxlYXNlIFNlbGVjdCBBIEZyaWVuZDwvZGl2PlxyXG4gICAgICAgICAgPC91bD5cclxuICAgICAgICA8L2Rpdj47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybihcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdGl2ZVdhdGNoUmVxdWVzdFwiPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJmaWx0ZXIgZnJpZW5kc1wiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUZpbHRlci5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIk1vdmllV2F0Y2hSZXF1ZXN0RnJpZW5kTGlzdCBjb2wgczZcIj5cclxuICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZnJpZW5kTGlzdFwiIG5hbWU9XCJmcmllbmRzTGlzdFwiIG11bHRpcGxlPlxyXG4gICAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLmZpbHRlcmVkRnJpZW5kcy5sZW5ndGggPT09IDApID8gPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPidubyBmcmllbmQgbWF0Y2ggaXMgZm91bmQnPC9kaXY+IDogJyd9XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5maWx0ZXJlZEZyaWVuZHMubWFwKGZyaWVuZCA9PiA8V2F0Y2hSZXF1ZXN0RnJpZW5kRW50cnkgZnJpZW5kPXtmcmllbmR9IGhhbmRsZUFkZEZyaWVuZD17dGhpcy5oYW5kbGVBZGRGcmllbmQuYmluZCh0aGlzKX0vPil9XHJcbiAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICB7c3Rhc2h9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJtZXNzYWdlQm94XCIgY29scz1cIjQwXCIgcm93cz1cIjVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVNc2cuYmluZCh0aGlzKX0gcGxhY2Vob2xkZXI9XCJBZGQgYSBtZXNzYWdlXCIgbWF4bGVuZ3RoPVwiMjU1XCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwid2F0Y2hSZXF1ZXN0XCIgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKX0+U2VuZCBXYXRjaCBSZXF1ZXN0PC9idXR0b24+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImNsb3NlV2F0Y2hSZXF1ZXN0XCIgb25DbGljaz17dGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpfT5DbG9zZSBXYXRjaCBSZXF1ZXN0PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwid2F0Y2hSZXF1ZXN0QnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpfT57KHRoaXMuc3RhdGUucmVxdWVzdFNlbnQpID8gJ3NlbmQgYW5vdGhlciB3YXRjaCByZXF1ZXN0JyA6ICdzZW5kIGEgd2F0Y2ggcmVxdWVzdCd9PC9idXR0b24+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3NlbnQgdXBkYXRlTXNnJz57KHRoaXMuc3RhdGUucmVxdWVzdFNlbnQpID8gJ3lvdXIgcmVxdWVzdCBoYXMgYmVlbiBzZW50JyA6ICcnfTwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG52YXIgV2F0Y2hSZXF1ZXN0RnJpZW5kRW50cnkgPSAocHJvcHMpID0+IHtcclxuXHJcbiAgcmV0dXJuICg8bGk+PHNwYW4+e3Byb3BzLmZyaWVuZH08L3NwYW4+PGEgY2xhc3NOYW1lPVwiYnRuLWZsb2F0aW5nIGJ0bi1zbWFsbCB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgcmVkXCIgb25DbGljaz17KCkgPT4gcHJvcHMuaGFuZGxlQWRkRnJpZW5kKHByb3BzLmZyaWVuZCl9PjxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj4rPC9pPjwvYT48L2xpPilcclxufTtcclxuXHJcbnZhciBXYXRjaFJlcXVlc3RTdGFzaEVudHJ5ID0gKHByb3BzKSA9PiB7XHJcbiAgcmV0dXJuICg8bGk+PHNwYW4+e3Byb3BzLmZyaWVuZH08L3NwYW4+PGEgY2xhc3NOYW1lPVwiYnRuLWZsb2F0aW5nIGJ0bi1zbWFsbCB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgcmVkXCIgb25DbGljaz17KCkgPT4gcHJvcHMuaGFuZGxlUmVtb3ZlRnJpZW5kKHByb3BzLmZyaWVuZCl9PjxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj4tPC9pPjwvYT48L2xpPilcclxufTtcclxuXHJcblxyXG53aW5kb3cuTW92aWVXYXRjaFJlcXVlc3QgPSBNb3ZpZVdhdGNoUmVxdWVzdDtcclxuXHJcblxyXG5cclxuIl19