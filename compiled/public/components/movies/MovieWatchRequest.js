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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZVdhdGNoUmVxdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0saUI7OztBQUVKLDZCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxxR0FDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYTtBQUNaLGNBQVEsS0FESTtBQUVaLGVBQVMsRUFGRztBQUdYLHVCQUFpQixFQUhOO0FBSVosbUJBQVksRUFKQTtBQUtYLGVBQVMsRUFMRTtBQU1YLG1CQUFhLEtBTkY7QUFPWCwwQkFBb0I7QUFQVCxLQUFiO0FBRmlCO0FBV2xCOzs7O29DQUVlO0FBQUE7OztBQUVkLFFBQUUsR0FBRixDQUFNLE1BQU0sZ0JBQVosRUFDQyxJQURELENBQ00sbUJBQVc7QUFDZixnQkFBUSxHQUFSLENBQVksc0JBQVosRUFBb0MsT0FBcEM7QUFDQSxZQUFJLGFBQWEsRUFBRSxJQUFGLENBQU8sT0FBUCxDQUFqQjtBQUNBLGVBQUssUUFBTCxDQUFjO0FBQ1osbUJBQVMsVUFERztBQUVaLDJCQUFpQjtBQUZMLFNBQWQ7QUFJRCxPQVJEO0FBU0Q7OztrQ0FFYTs7QUFFWixXQUFLLFFBQUwsQ0FBYztBQUNaLGdCQUFRLENBQUMsS0FBSyxLQUFMLENBQVcsTUFEUjtBQUVaLHFCQUFhOztBQUZELE9BQWQ7QUFLQSxXQUFLLGFBQUw7QUFDRDs7OzhCQUVTLEssRUFBTztBQUNmLFdBQUssUUFBTCxDQUFjO0FBQ1osaUJBQVMsTUFBTSxNQUFOLENBQWE7QUFEVixPQUFkO0FBR0Q7OzttQ0FFYztBQUFBOzs7Ozs7O0FBTWIsVUFBSSxLQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLE1BQTNCLEVBQW1DO0FBQ2pDLFlBQUksYUFBYTtBQUNmLHNCQUFZLE9BREc7QUFFZixpQkFBTyxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEtBRlQ7QUFHZixtQkFBUyxLQUFLLEtBQUwsQ0FBVyxLQUFYLENB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QUFTLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFoRDtBQUErRSxpQkFBSyxLQUFMLENBQVcsV0FBWixHQUEyQiw0QkFBM0IsR0FBMEQ7QUFBeEksV0FERjtBQUVFO0FBQUE7QUFBQSxjQUFNLFdBQVUsZ0JBQWhCO0FBQW1DLGlCQUFLLEtBQUwsQ0FBVyxXQUFaLEdBQTJCLDRCQUEzQixHQUEwRDtBQUE1RjtBQUZGLFNBREY7QUFNRDtBQUNGOzs7O0VBcEs2QixNQUFNLFM7O0FBMEt0QyxJQUFJLDBCQUEwQixTQUExQix1QkFBMEIsQ0FBQyxLQUFELEVBQVc7O0FBRXZDLFNBQVE7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBO0FBQU8sWUFBTTtBQUFiLEtBQUo7QUFBK0I7QUFBQTtBQUFBLFFBQUcsV0FBVSxxREFBYixFQUFtRSxTQUFTO0FBQUEsaUJBQU0sTUFBTSxlQUFOLENBQXNCLE1BQU0sTUFBNUIsQ0FBTjtBQUFBLFNBQTVFO0FBQXVIO0FBQUE7QUFBQSxVQUFHLFNBQU0sZ0JBQVQ7QUFBQTtBQUFBO0FBQXZIO0FBQS9CLEdBQVI7QUFDRCxDQUhEOztBQUtBLElBQUkseUJBQXlCLFNBQXpCLHNCQUF5QixDQUFDLEtBQUQsRUFBVztBQUN0QyxTQUFRO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQTtBQUFPLFlBQU07QUFBYixLQUFKO0FBQStCO0FBQUE7QUFBQSxRQUFHLFdBQVUscURBQWIsRUFBbUUsU0FBUztBQUFBLGlCQUFNLE1BQU0sa0JBQU4sQ0FBeUIsTUFBTSxNQUEvQixDQUFOO0FBQUEsU0FBNUU7QUFBMEg7QUFBQTtBQUFBLFVBQUcsU0FBTSxnQkFBVDtBQUFBO0FBQUE7QUFBMUg7QUFBL0IsR0FBUjtBQUNELENBRkQ7O0FBS0EsT0FBTyxpQkFBUCxHQUEyQixpQkFBM0IiLCJmaWxlIjoiTW92aWVXYXRjaFJlcXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNb3ZpZVdhdGNoUmVxdWVzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgIFx0XHRhY3RpdmU6IGZhbHNlLFxuICAgXHRcdGZyaWVuZHM6IFtdLFxuICAgICAgZmlsdGVyZWRGcmllbmRzOiBbXSxcbiAgIFx0XHRmcmllbmRTdGFzaDpbXSxcbiAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgcmVxdWVzdFNlbnQ6IGZhbHNlLFxuICAgICAgbm9SZXF1ZXN0ZWVXYXJuaW5nOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBnZXRGcmllbmRMaXN0KCkge1xuICBcdC8vc2VuZCBnZXQgcmVxdWVzdCB0byByZXRyaXZlIGZyaWVuZHMgYW5kIHNldCB0byB0aGlzLnN0YXRlLmZyaWVuZHNcbiAgICAkLmdldChVcmwgKyAnL2dldEZyaWVuZExpc3QnKVxuICAgIC50aGVuKGZyaWVuZHMgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgZnJpZW5kcyk7XG4gICAgICB2YXIgdW5pcUZyaWVuZCA9IF8udW5pcShmcmllbmRzKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmcmllbmRzOiB1bmlxRnJpZW5kLFxuICAgICAgICBmaWx0ZXJlZEZyaWVuZHM6IHVuaXFGcmllbmRcbiAgICAgIH0pO1xuICAgIH0pXG4gIH1cblxuICBoYW5kbGVDbGljaygpIHtcbiAgXHQvL3dpbGwgdHVybiB0aGlzLnN0YXRlLmFjdGl2ZSB0byB0cnVlIGFuZCByZXJlbmRlciB0aGUgdmlld1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYWN0aXZlOiAhdGhpcy5zdGF0ZS5hY3RpdmUsXG4gICAgICByZXF1ZXN0U2VudDogZmFsc2VcblxuICAgIH0pXG4gICAgdGhpcy5nZXRGcmllbmRMaXN0KCk7XG4gIH1cblxuICBoYW5kbGVNc2coZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1lc3NhZ2U6IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVTdWJtaXQoKSB7XG4gIFx0Ly93aWxsIHNlbmQgb3V0IGEgd2F0Y2ggcmVxdWVzdCBmb3IgdGhpcy5wcm9wcy5tb3ZpZSB0byBmcmllbmRzIGluIHRoZSBzdGFzaFxuICBcdC8vd2lsbCBkaXNwbGF5IGEgbWVzc2FnZSBzYXlpbmcgdGhlIHJlcXVlc3QgaXMgbWFkZVxuICBcdC8vc2V0IHRoaXMuc3RhdGUuYWN0aXZlIHRvIGZhbHNlXG4gICAgLy9zZXQgdGhlIHN0YXNoIHRvIGVtcHR5XG4gIFx0Ly9zaG93IHNlbmQgYW5vdGhlciByZXF1ZXN0IGJ1dHRvblxuICAgIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmxlbmd0aCkge1xuICAgICAgdmFyIHJlcXVlc3RPYmogPSB7XG4gICAgICAgIHJlcXVlc3RUeXA6ICd3YXRjaCcsXG4gICAgICAgIG1vdmllOiB0aGlzLnByb3BzLm1vdmllLnRpdGxlLFxuICAgICAgICBtb3ZpZWlkOiB0aGlzLnByb3BzLm1vdmllLmlkLFxuICAgICAgICBtZXNzYWdlOiB0aGlzLnN0YXRlLm1lc3NhZ2UsXG4gICAgICAgIHJlcXVlc3RlZTogdGhpcy5zdGF0ZS5mcmllbmRTdGFzaFxuICAgICAgfTtcblxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFdhdGNoUmVxdWVzdCcsIHJlcXVlc3RPYmopXG4gICAgICAuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgZnJpZW5kU3Rhc2g6IFtdLFxuICAgICAgICAgIGZpbHRlcjogJycsXG4gICAgICAgICAgbWVzc2FnZTogJycsXG4gICAgICAgICAgcmVxdWVzdFNlbnQ6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbm9SZXF1ZXN0ZWVXYXJuaW5nOiB0cnVlXG4gICAgICB9KVxuICAgIH1cblxuICB9XG5cbiAgaGFuZGxlRmlsdGVyKGV2ZW50KSB7XG4gIFx0Ly9GaWx0ZXIgYSBwYXJ0aWN1bGFyIGZyaWVuZCBpbiB0aGUgZnJpZW5kIGxpc3RcblxuICAgIHZhciBmaWx0ZXJlZEZyaWVuZHMgPSBbXTtcbiAgICB0aGlzLnN0YXRlLmZyaWVuZHMuZm9yRWFjaChmcmllbmQgPT4ge1xuICAgICAgaWYgKGZyaWVuZC5pbmRleE9mKGV2ZW50LnRhcmdldC52YWx1ZSkgPiAtMSApIHtcbiAgICAgICAgZmlsdGVyZWRGcmllbmRzLnB1c2goZnJpZW5kKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIFxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsdGVyZWRGcmllbmRzOiBmaWx0ZXJlZEZyaWVuZHNcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUFkZEZyaWVuZChmcmllbmQpIHtcbiAgICAvL2FkZCBmcmllbmQgdG8gc3Rhc2hcbiAgICBjb25zb2xlLmxvZygnY2FsbGluZyBoYW5kbGVBZGRGcmllbmQnKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5pbmRleE9mKGZyaWVuZCkgPCAwKSB7XG4gICAgICB2YXIgc3Rhc2hDb3B5ID0gdGhpcy5zdGF0ZS5mcmllbmRTdGFzaDtcbiAgICAgIHN0YXNoQ29weS51bnNoaWZ0KGZyaWVuZCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZnJpZW5kU3Rhc2g6IHN0YXNoQ29weVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlUmVtb3ZlRnJpZW5kKGZyaWVuZCkge1xuICAgIC8vcmVtb3ZlIGZyaWVuZCBmcm9tIHN0YXNoXG4gICAgdmFyIGlkeCA9IHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2guaW5kZXhPZihmcmllbmQpXG4gICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZnJpZW5kU3Rhc2g6IFtdXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN0YXNoQ29weSA9IHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2g7XG4gICAgICBzdGFzaENvcHkuc3BsaWNlKGlkeCwgMSk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZnJpZW5kU3Rhc2g6IHN0YXNoQ29weVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgc3Rhc2ggPSBcbiAgICAgICAgICAoPGRpdiBjbGFzc05hbWU9XCJNb3ZpZVdhdGNoUmVxdWVzdEZyaWVuZFN0YXNoIGNvbCBzNlwiPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZyaWVuZFN0YXNoXCIgbmFtZT1cImZyaWVuZFN0YXNoXCIgbXVsdGlwbGU+XG4gICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLm1hcChmcmllbmQgPT4gPFdhdGNoUmVxdWVzdFN0YXNoRW50cnkgZnJpZW5kPXtmcmllbmR9IGhhbmRsZVJlbW92ZUZyaWVuZD17dGhpcy5oYW5kbGVSZW1vdmVGcmllbmQuYmluZCh0aGlzKX0vPil9XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvZGl2PilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdmFyIHN0YXNoID0gXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTW92aWVXYXRjaFJlcXVlc3RGcmllbmRTdGFzaCBjb2wgczZcIj5cbiAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZnJpZW5kU3Rhc2hcIiBuYW1lPVwiZnJpZW5kU3Rhc2hcIiBtdWx0aXBsZT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj5wbGVhc2Ugc2VsZWN0IGEgZnJpZW5kPC9kaXY+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4oXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0aXZlV2F0Y2hSZXF1ZXN0XCI+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJmaWx0ZXIgZnJpZW5kc1wiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUZpbHRlci5iaW5kKHRoaXMpfS8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTW92aWVXYXRjaFJlcXVlc3RGcmllbmRMaXN0IGNvbCBzNlwiPlxuICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZnJpZW5kTGlzdFwiIG5hbWU9XCJmcmllbmRzTGlzdFwiIG11bHRpcGxlPlxuICAgICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS5maWx0ZXJlZEZyaWVuZHMubGVuZ3RoID09PSAwKSA/IDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj4nbm8gZnJpZW5kIG1hdGNoIGlzIGZvdW5kJzwvZGl2PiA6ICcnfVxuICAgICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmZpbHRlcmVkRnJpZW5kcy5tYXAoZnJpZW5kID0+IDxXYXRjaFJlcXVlc3RGcmllbmRFbnRyeSBmcmllbmQ9e2ZyaWVuZH0gaGFuZGxlQWRkRnJpZW5kPXt0aGlzLmhhbmRsZUFkZEZyaWVuZC5iaW5kKHRoaXMpfS8+KX1cbiAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7c3Rhc2h9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cIm1lc3NhZ2VCb3hcIiBjb2xzPVwiNDBcIiByb3dzPVwiNVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU1zZy5iaW5kKHRoaXMpfSBwbGFjZWhvbGRlcj1cIkFkZCBhIG1lc3NhZ2VcIiBtYXhsZW5ndGg9XCIyNTVcIj48L3RleHRhcmVhPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwid2F0Y2hSZXF1ZXN0XCIgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKX0+c2VuZCB3YXRjaCByZXF1ZXN0PC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJjbG9zZVdhdGNoUmVxdWVzdFwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKX0+Y2xvc2Ugd2F0Y2ggcmVxdWVzdDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIndhdGNoUmVxdWVzdEJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKX0+eyh0aGlzLnN0YXRlLnJlcXVlc3RTZW50KSA/ICdzZW5kIGFub3RoZXIgd2F0Y2ggcmVxdWVzdCcgOiAnc2VuZCBhIHdhdGNoIHJlcXVlc3QnfTwvYnV0dG9uPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nc2VudCB1cGRhdGVNc2cnPnsodGhpcy5zdGF0ZS5yZXF1ZXN0U2VudCkgPyAneW91ciByZXF1ZXN0IGhhcyBiZWVuIHNlbnQnIDogJyd9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbiAgfVxufVxuXG5cblxuXG52YXIgV2F0Y2hSZXF1ZXN0RnJpZW5kRW50cnkgPSAocHJvcHMpID0+IHtcblxuICByZXR1cm4gKDxsaT48c3Bhbj57cHJvcHMuZnJpZW5kfTwvc3Bhbj48YSBjbGFzc05hbWU9XCJidG4tZmxvYXRpbmcgYnRuLXNtYWxsIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodCByZWRcIiBvbkNsaWNrPXsoKSA9PiBwcm9wcy5oYW5kbGVBZGRGcmllbmQocHJvcHMuZnJpZW5kKX0+PGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPis8L2k+PC9hPjwvbGk+KVxufTtcblxudmFyIFdhdGNoUmVxdWVzdFN0YXNoRW50cnkgPSAocHJvcHMpID0+IHtcbiAgcmV0dXJuICg8bGk+PHNwYW4+e3Byb3BzLmZyaWVuZH08L3NwYW4+PGEgY2xhc3NOYW1lPVwiYnRuLWZsb2F0aW5nIGJ0bi1zbWFsbCB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgcmVkXCIgb25DbGljaz17KCkgPT4gcHJvcHMuaGFuZGxlUmVtb3ZlRnJpZW5kKHByb3BzLmZyaWVuZCl9PjxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj4tPC9pPjwvYT48L2xpPilcbn07XG5cblxud2luZG93Lk1vdmllV2F0Y2hSZXF1ZXN0ID0gTW92aWVXYXRjaFJlcXVlc3Q7XG5cblxuXG4iXX0=