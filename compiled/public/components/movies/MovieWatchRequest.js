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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZVdhdGNoUmVxdWVzdC5qcyJdLCJuYW1lcyI6WyJNb3ZpZVdhdGNoUmVxdWVzdCIsInByb3BzIiwic3RhdGUiLCJhY3RpdmUiLCJmcmllbmRzIiwiZmlsdGVyZWRGcmllbmRzIiwiZnJpZW5kU3Rhc2giLCJtZXNzYWdlIiwicmVxdWVzdFNlbnQiLCJub1JlcXVlc3RlZVdhcm5pbmciLCIkIiwiZ2V0IiwiVXJsIiwidGhlbiIsImNvbnNvbGUiLCJsb2ciLCJ1bmlxRnJpZW5kIiwiXyIsInVuaXEiLCJzZXRTdGF0ZSIsImdldEZyaWVuZExpc3QiLCJldmVudCIsInRhcmdldCIsInZhbHVlIiwibGVuZ3RoIiwicmVxdWVzdE9iaiIsInJlcXVlc3RUeXAiLCJtb3ZpZSIsInRpdGxlIiwibW92aWVpZCIsImlkIiwicmVxdWVzdGVlIiwicG9zdCIsImRvbmUiLCJmaWx0ZXIiLCJmb3JFYWNoIiwiZnJpZW5kIiwiaW5kZXhPZiIsInB1c2giLCJzdGFzaENvcHkiLCJ1bnNoaWZ0IiwiaWR4Iiwic3BsaWNlIiwic3Rhc2giLCJtYXAiLCJoYW5kbGVSZW1vdmVGcmllbmQiLCJiaW5kIiwiaGFuZGxlRmlsdGVyIiwiaGFuZGxlQWRkRnJpZW5kIiwiaGFuZGxlTXNnIiwiaGFuZGxlU3VibWl0IiwiaGFuZGxlQ2xpY2siLCJSZWFjdCIsIkNvbXBvbmVudCIsIldhdGNoUmVxdWVzdEZyaWVuZEVudHJ5IiwiV2F0Y2hSZXF1ZXN0U3Rhc2hFbnRyeSIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxpQjs7O0FBRUosNkJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxzSUFDWEEsS0FEVzs7QUFFakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1pDLGNBQVEsS0FESTtBQUVaQyxlQUFTLEVBRkc7QUFHWEMsdUJBQWlCLEVBSE47QUFJWkMsbUJBQVksRUFKQTtBQUtYQyxlQUFTLEVBTEU7QUFN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QixDQUFoRDtBQUErRSxpQkFBSzVDLEtBQUwsQ0FBV00sV0FBWixHQUEyQiw0QkFBM0IsR0FBMEQ7QUFBeEksV0FERjtBQUVFO0FBQUE7QUFBQSxjQUFNLFdBQVUsZ0JBQWhCO0FBQW1DLGlCQUFLTixLQUFMLENBQVdNLFdBQVosR0FBMkIsNEJBQTNCLEdBQTBEO0FBQTVGO0FBRkYsU0FERjtBQU1EO0FBQ0Y7Ozs7RUFwSzZCNEMsTUFBTUMsUzs7QUEwS3RDLElBQUlDLDBCQUEwQixTQUExQkEsdUJBQTBCLENBQUNyRCxLQUFELEVBQVc7O0FBRXZDLFNBQVE7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBO0FBQU9BLFlBQU1tQztBQUFiLEtBQUo7QUFBK0I7QUFBQTtBQUFBLFFBQUcsV0FBVSxxREFBYixFQUFtRSxTQUFTO0FBQUEsaUJBQU1uQyxNQUFNK0MsZUFBTixDQUFzQi9DLE1BQU1tQyxNQUE1QixDQUFOO0FBQUEsU0FBNUU7QUFBdUg7QUFBQTtBQUFBLFVBQUcsU0FBTSxnQkFBVDtBQUFBO0FBQUE7QUFBdkg7QUFBL0IsR0FBUjtBQUNELENBSEQ7O0FBS0EsSUFBSW1CLHlCQUF5QixTQUF6QkEsc0JBQXlCLENBQUN0RCxLQUFELEVBQVc7QUFDdEMsU0FBUTtBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUE7QUFBT0EsWUFBTW1DO0FBQWIsS0FBSjtBQUErQjtBQUFBO0FBQUEsUUFBRyxXQUFVLHFEQUFiLEVBQW1FLFNBQVM7QUFBQSxpQkFBTW5DLE1BQU00QyxrQkFBTixDQUF5QjVDLE1BQU1tQyxNQUEvQixDQUFOO0FBQUEsU0FBNUU7QUFBMEg7QUFBQTtBQUFBLFVBQUcsU0FBTSxnQkFBVDtBQUFBO0FBQUE7QUFBMUg7QUFBL0IsR0FBUjtBQUNELENBRkQ7O0FBS0FvQixPQUFPeEQsaUJBQVAsR0FBMkJBLGlCQUEzQiIsImZpbGUiOiJNb3ZpZVdhdGNoUmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1vdmllV2F0Y2hSZXF1ZXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgXHRcdGFjdGl2ZTogZmFsc2UsXG4gICBcdFx0ZnJpZW5kczogW10sXG4gICAgICBmaWx0ZXJlZEZyaWVuZHM6IFtdLFxuICAgXHRcdGZyaWVuZFN0YXNoOltdLFxuICAgICAgbWVzc2FnZTogJycsXG4gICAgICByZXF1ZXN0U2VudDogZmFsc2UsXG4gICAgICBub1JlcXVlc3RlZVdhcm5pbmc6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIGdldEZyaWVuZExpc3QoKSB7XG4gIFx0Ly9zZW5kIGdldCByZXF1ZXN0IHRvIHJldHJpdmUgZnJpZW5kcyBhbmQgc2V0IHRvIHRoaXMuc3RhdGUuZnJpZW5kc1xuICAgICQuZ2V0KFVybCArICcvZ2V0RnJpZW5kTGlzdCcpXG4gICAgLnRoZW4oZnJpZW5kcyA9PiB7XG4gICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCBmcmllbmRzKTtcbiAgICAgIHZhciB1bmlxRnJpZW5kID0gXy51bmlxKGZyaWVuZHMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZyaWVuZHM6IHVuaXFGcmllbmQsXG4gICAgICAgIGZpbHRlcmVkRnJpZW5kczogdW5pcUZyaWVuZFxuICAgICAgfSk7XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKCkge1xuICBcdC8vd2lsbCB0dXJuIHRoaXMuc3RhdGUuYWN0aXZlIHRvIHRydWUgYW5kIHJlcmVuZGVyIHRoZSB2aWV3XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBhY3RpdmU6ICF0aGlzLnN0YXRlLmFjdGl2ZSxcbiAgICAgIHJlcXVlc3RTZW50OiBmYWxzZVxuXG4gICAgfSlcbiAgICB0aGlzLmdldEZyaWVuZExpc3QoKTtcbiAgfVxuXG4gIGhhbmRsZU1zZyhldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbWVzc2FnZTogZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVN1Ym1pdCgpIHtcbiAgXHQvL3dpbGwgc2VuZCBvdXQgYSB3YXRjaCByZXF1ZXN0IGZvciB0aGlzLnByb3BzLm1vdmllIHRvIGZyaWVuZHMgaW4gdGhlIHN0YXNoXG4gIFx0Ly93aWxsIGRpc3BsYXkgYSBtZXNzYWdlIHNheWluZyB0aGUgcmVxdWVzdCBpcyBtYWRlXG4gIFx0Ly9zZXQgdGhpcy5zdGF0ZS5hY3RpdmUgdG8gZmFsc2VcbiAgICAvL3NldCB0aGUgc3Rhc2ggdG8gZW1wdHlcbiAgXHQvL3Nob3cgc2VuZCBhbm90aGVyIHJlcXVlc3QgYnV0dG9uXG4gICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubGVuZ3RoKSB7XG4gICAgICB2YXIgcmVxdWVzdE9iaiA9IHtcbiAgICAgICAgcmVxdWVzdFR5cDogJ3dhdGNoJyxcbiAgICAgICAgbW92aWU6IHRoaXMucHJvcHMubW92aWUudGl0bGUsXG4gICAgICAgIG1vdmllaWQ6IHRoaXMucHJvcHMubW92aWUuaWQsXG4gICAgICAgIG1lc3NhZ2U6IHRoaXMuc3RhdGUubWVzc2FnZSxcbiAgICAgICAgcmVxdWVzdGVlOiB0aGlzLnN0YXRlLmZyaWVuZFN0YXNoXG4gICAgICB9O1xuXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kV2F0Y2hSZXF1ZXN0JywgcmVxdWVzdE9iailcbiAgICAgIC5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgICBmcmllbmRTdGFzaDogW10sXG4gICAgICAgICAgZmlsdGVyOiAnJyxcbiAgICAgICAgICBtZXNzYWdlOiAnJyxcbiAgICAgICAgICByZXF1ZXN0U2VudDogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBub1JlcXVlc3RlZVdhcm5pbmc6IHRydWVcbiAgICAgIH0pXG4gICAgfVxuXG4gIH1cblxuICBoYW5kbGVGaWx0ZXIoZXZlbnQpIHtcbiAgXHQvL0ZpbHRlciBhIHBhcnRpY3VsYXIgZnJpZW5kIGluIHRoZSBmcmllbmQgbGlzdFxuXG4gICAgdmFyIGZpbHRlcmVkRnJpZW5kcyA9IFtdO1xuICAgIHRoaXMuc3RhdGUuZnJpZW5kcy5mb3JFYWNoKGZyaWVuZCA9PiB7XG4gICAgICBpZiAoZnJpZW5kLmluZGV4T2YoZXZlbnQudGFyZ2V0LnZhbHVlKSA+IC0xICkge1xuICAgICAgICBmaWx0ZXJlZEZyaWVuZHMucHVzaChmcmllbmQpO1xuICAgICAgfVxuICAgIH0pXG4gICAgXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmaWx0ZXJlZEZyaWVuZHM6IGZpbHRlcmVkRnJpZW5kc1xuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlQWRkRnJpZW5kKGZyaWVuZCkge1xuICAgIC8vYWRkIGZyaWVuZCB0byBzdGFzaFxuICAgIGNvbnNvbGUubG9nKCdjYWxsaW5nIGhhbmRsZUFkZEZyaWVuZCcpO1xuICAgIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmluZGV4T2YoZnJpZW5kKSA8IDApIHtcbiAgICAgIHZhciBzdGFzaENvcHkgPSB0aGlzLnN0YXRlLmZyaWVuZFN0YXNoO1xuICAgICAgc3Rhc2hDb3B5LnVuc2hpZnQoZnJpZW5kKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmcmllbmRTdGFzaDogc3Rhc2hDb3B5XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVSZW1vdmVGcmllbmQoZnJpZW5kKSB7XG4gICAgLy9yZW1vdmUgZnJpZW5kIGZyb20gc3Rhc2hcbiAgICB2YXIgaWR4ID0gdGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5pbmRleE9mKGZyaWVuZClcbiAgICBpZiAodGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmcmllbmRTdGFzaDogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3Rhc2hDb3B5ID0gdGhpcy5zdGF0ZS5mcmllbmRTdGFzaDtcbiAgICAgIHN0YXNoQ29weS5zcGxpY2UoaWR4LCAxKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmcmllbmRTdGFzaDogc3Rhc2hDb3B5XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBzdGFzaCA9IFxuICAgICAgICAgICg8ZGl2IGNsYXNzTmFtZT1cIk1vdmllV2F0Y2hSZXF1ZXN0RnJpZW5kU3Rhc2ggY29sIHM2XCI+XG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZnJpZW5kU3Rhc2hcIiBuYW1lPVwiZnJpZW5kU3Rhc2hcIiBtdWx0aXBsZT5cbiAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubWFwKGZyaWVuZCA9PiA8V2F0Y2hSZXF1ZXN0U3Rhc2hFbnRyeSBmcmllbmQ9e2ZyaWVuZH0gaGFuZGxlUmVtb3ZlRnJpZW5kPXt0aGlzLmhhbmRsZVJlbW92ZUZyaWVuZC5iaW5kKHRoaXMpfS8+KX1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9kaXY+KVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB2YXIgc3Rhc2ggPSBcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJNb3ZpZVdhdGNoUmVxdWVzdEZyaWVuZFN0YXNoIGNvbCBzNlwiPlxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJmcmllbmRTdGFzaFwiIG5hbWU9XCJmcmllbmRTdGFzaFwiIG11bHRpcGxlPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPnBsZWFzZSBzZWxlY3QgYSBmcmllbmQ8L2Rpdj5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj47XG4gICAgICB9XG5cbiAgICAgIHJldHVybihcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3RpdmVXYXRjaFJlcXVlc3RcIj5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cImZpbHRlciBmcmllbmRzXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlRmlsdGVyLmJpbmQodGhpcyl9Lz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJNb3ZpZVdhdGNoUmVxdWVzdEZyaWVuZExpc3QgY29sIHM2XCI+XG4gICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJmcmllbmRMaXN0XCIgbmFtZT1cImZyaWVuZHNMaXN0XCIgbXVsdGlwbGU+XG4gICAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLmZpbHRlcmVkRnJpZW5kcy5sZW5ndGggPT09IDApID8gPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPidubyBmcmllbmQgbWF0Y2ggaXMgZm91bmQnPC9kaXY+IDogJyd9XG4gICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZmlsdGVyZWRGcmllbmRzLm1hcChmcmllbmQgPT4gPFdhdGNoUmVxdWVzdEZyaWVuZEVudHJ5IGZyaWVuZD17ZnJpZW5kfSBoYW5kbGVBZGRGcmllbmQ9e3RoaXMuaGFuZGxlQWRkRnJpZW5kLmJpbmQodGhpcyl9Lz4pfVxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHtzdGFzaH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwibWVzc2FnZUJveFwiIGNvbHM9XCI0MFwiIHJvd3M9XCI1XCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlTXNnLmJpbmQodGhpcyl9IHBsYWNlaG9sZGVyPVwiQWRkIGEgbWVzc2FnZVwiIG1heGxlbmd0aD1cIjI1NVwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ3YXRjaFJlcXVlc3RcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpfT5zZW5kIHdhdGNoIHJlcXVlc3Q8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImNsb3NlV2F0Y2hSZXF1ZXN0XCIgb25DbGljaz17dGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpfT5jbG9zZSB3YXRjaCByZXF1ZXN0PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwid2F0Y2hSZXF1ZXN0QnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpfT57KHRoaXMuc3RhdGUucmVxdWVzdFNlbnQpID8gJ3NlbmQgYW5vdGhlciB3YXRjaCByZXF1ZXN0JyA6ICdzZW5kIGEgd2F0Y2ggcmVxdWVzdCd9PC9idXR0b24+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdzZW50IHVwZGF0ZU1zZyc+eyh0aGlzLnN0YXRlLnJlcXVlc3RTZW50KSA/ICd5b3VyIHJlcXVlc3QgaGFzIGJlZW4gc2VudCcgOiAnJ308L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxuICB9XG59XG5cblxuXG5cbnZhciBXYXRjaFJlcXVlc3RGcmllbmRFbnRyeSA9IChwcm9wcykgPT4ge1xuXG4gIHJldHVybiAoPGxpPjxzcGFuPntwcm9wcy5mcmllbmR9PC9zcGFuPjxhIGNsYXNzTmFtZT1cImJ0bi1mbG9hdGluZyBidG4tc21hbGwgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IHJlZFwiIG9uQ2xpY2s9eygpID0+IHByb3BzLmhhbmRsZUFkZEZyaWVuZChwcm9wcy5mcmllbmQpfT48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+KzwvaT48L2E+PC9saT4pXG59O1xuXG52YXIgV2F0Y2hSZXF1ZXN0U3Rhc2hFbnRyeSA9IChwcm9wcykgPT4ge1xuICByZXR1cm4gKDxsaT48c3Bhbj57cHJvcHMuZnJpZW5kfTwvc3Bhbj48YSBjbGFzc05hbWU9XCJidG4tZmxvYXRpbmcgYnRuLXNtYWxsIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodCByZWRcIiBvbkNsaWNrPXsoKSA9PiBwcm9wcy5oYW5kbGVSZW1vdmVGcmllbmQocHJvcHMuZnJpZW5kKX0+PGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPi08L2k+PC9hPjwvbGk+KVxufTtcblxuXG53aW5kb3cuTW92aWVXYXRjaFJlcXVlc3QgPSBNb3ZpZVdhdGNoUmVxdWVzdDtcblxuXG5cbiJdfQ==