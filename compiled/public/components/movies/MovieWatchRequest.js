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
      friendStash: [],
      filter: '',
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
      $.get('http://127.0.0.1:3000/getFriendList').then(function (friends) {
        console.log('response from server', friends);
        _this2.setState({
          friends: friends
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

        $.post('http://127.0.0.1:3000/sendWatchRequest', requestObj).done(function (response) {
          console.log('request send');
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
    value: function handleFilter() {
      //Filter a particular friend in the friend list

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
      console.log('calling handleRemoveFriend', this.state.friendStash);
      var idx = this.state.friendStash.indexOf(friend);
      if (this.state.friendStash.length === 1) {
        this.setState({
          friendStash: []
        });
      } else {
        this.setState({
          friendStash: this.state.friendStash.splice(idx, 1)
        });
      }
      console.log('stash after remove', this.state.friendStash);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      if (this.state.active) {
        if (this.state.friendStash.length > 0) {
          var stash = React.createElement(
            'div',
            { className: 'MovieWatchRequestFriendStash' },
            React.createElement(
              'ul',
              { className: 'friendStash', name: 'friendStash', multiple: true },
              this.state.friendStash.map(function (friend) {
                return React.createElement(WatchRequestStashEntry, { friend: friend, handleRemoveFriend: _this4.handleRemoveFriend.bind(_this4) });
              })
            )
          );
        } else if (this.state.friendStash.length === 0) {
          var stash = 'please select your friend';
        }

        return React.createElement(
          'div',
          { className: 'activeWatchRequest' },
          React.createElement(
            'div',
            { className: 'MovieWatchRequestFriendList' },
            React.createElement('input', { type: 'text', value: this.state.filter, placeholder: 'filter friends', onChange: this.handleFilter.bind(this) }),
            React.createElement(
              'ul',
              { className: 'friendList', name: 'friendsList', multiple: true },
              this.state.friends.map(function (friend) {
                return React.createElement(WatchRequestFriendEntry, { friend: friend, handleAddFriend: _this4.handleAddFriend.bind(_this4) });
              })
            )
          ),
          stash,
          React.createElement('input', { className: 'messageBox', onChange: this.handleMsg.bind(this), placeholder: 'add a message' }),
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
            { onClick: this.handleClick.bind(this) },
            'send watch request'
          ),
          React.createElement(
            'div',
            null,
            this.state.requestSent === true ? 'your request has been sent' : ''
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
    props.friend,
    React.createElement(
      'button',
      { onClick: function onClick() {
          return props.handleAddFriend(props.friend);
        } },
      'add'
    )
  );
};

var WatchRequestStashEntry = function WatchRequestStashEntry(props) {
  return React.createElement(
    'li',
    null,
    props.friend,
    React.createElement(
      'button',
      { onClick: function onClick() {
          return props.handleRemoveFriend(props.friend);
        } },
      'remove'
    )
  );
};

window.MovieWatchRequest = MovieWatchRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZVdhdGNoUmVxdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0saUI7OztBQUVKLDZCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxxR0FDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYTtBQUNaLGNBQVEsS0FESTtBQUVaLGVBQVMsRUFGRztBQUdaLG1CQUFZLEVBSEE7QUFJWCxjQUFRLEVBSkc7QUFLWCxlQUFTLEVBTEU7QUFNWCxtQkFBYSxLQU5GO0FBT1gsMEJBQW9CO0FBUFQsS0FBYjtBQUZpQjtBQVdsQjs7OztvQ0FFZTtBQUFBOzs7QUFFZCxRQUFFLEdBQUYsQ0FBTSxxQ0FBTixFQUNDLElBREQsQ0FDTSxtQkFBVztBQUNmLGdCQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxPQUFwQztBQUNBLGVBQUssUUFBTCxDQUFjO0FBQ1osbUJBQVM7QUFERyxTQUFkO0FBR0QsT0FORDtBQU9EOzs7a0NBRWE7O0FBRVosV0FBSyxRQUFMLENBQWM7QUFDWixnQkFBUSxDQUFDLEtBQUssS0FBTCxDQUFXLE1BRFI7QUFFWixxQkFBYTs7QUFGRCxPQUFkO0FBS0EsV0FBSyxhQUFMO0FBQ0Q7Ozs4QkFFUyxLLEVBQU87QUFDZixXQUFLLFFBQUwsQ0FBYztBQUNaLGlCQUFTLE1BQU0sTUFBTixDQUFhO0FBRFYsT0FBZDtBQUdEOzs7bUNBRWM7QUFBQTs7Ozs7OztBQU1iLFVBQUksS0FBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixNQUEzQixFQUFtQztBQUNqQyxZQUFJLGFBQWE7QUFDZixzQkFBWSxPQURHO0FBRWYsaUJBQU8sS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixLQUZUO0FBR2YsbUJBQVMsS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixFQUhYO0FBSWYsbUJBQVMsS0FBSyxLQUFMLENBQVcsT0FKTDtBQUtmLHFCQUFXLEtBQUssS0FBTCxDQUFX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TjtBQUFBLFNBQWpCO0FBQUE7QUFBQTtBQUFsQixHQUFSO0FBQ0QsQ0FGRDs7QUFLQSxPQUFPLGlCQUFQLEdBQTJCLGlCQUEzQiIsImZpbGUiOiJNb3ZpZVdhdGNoUmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1vdmllV2F0Y2hSZXF1ZXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgXHRcdGFjdGl2ZTogZmFsc2UsXG4gICBcdFx0ZnJpZW5kczogW10sXG4gICBcdFx0ZnJpZW5kU3Rhc2g6W10sXG4gICAgICBmaWx0ZXI6ICcnLFxuICAgICAgbWVzc2FnZTogJycsXG4gICAgICByZXF1ZXN0U2VudDogZmFsc2UsXG4gICAgICBub1JlcXVlc3RlZVdhcm5pbmc6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBnZXRGcmllbmRMaXN0KCkge1xuICBcdC8vc2VuZCBnZXQgcmVxdWVzdCB0byByZXRyaXZlIGZyaWVuZHMgYW5kIHNldCB0byB0aGlzLnN0YXRlLmZyaWVuZHNcbiAgICAkLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL2dldEZyaWVuZExpc3QnKVxuICAgIC50aGVuKGZyaWVuZHMgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgZnJpZW5kcyk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZnJpZW5kczogZnJpZW5kc1xuICAgICAgfSk7XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKCkge1xuICBcdC8vd2lsbCB0dXJuIHRoaXMuc3RhdGUuYWN0aXZlIHRvIHRydWUgYW5kIHJlcmVuZGVyIHRoZSB2aWV3XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBhY3RpdmU6ICF0aGlzLnN0YXRlLmFjdGl2ZSxcbiAgICAgIHJlcXVlc3RTZW50OiBmYWxzZVxuXG4gICAgfSlcbiAgICB0aGlzLmdldEZyaWVuZExpc3QoKTtcbiAgfVxuXG4gIGhhbmRsZU1zZyhldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbWVzc2FnZTogZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVN1Ym1pdCgpIHtcbiAgXHQvL3dpbGwgc2VuZCBvdXQgYSB3YXRjaCByZXF1ZXN0IGZvciB0aGlzLnByb3BzLm1vdmllIHRvIGZyaWVuZHMgaW4gdGhlIHN0YXNoXG4gIFx0Ly93aWxsIGRpc3BsYXkgYSBtZXNzYWdlIHNheWluZyB0aGUgcmVxdWVzdCBpcyBtYWRlXG4gIFx0Ly9zZXQgdGhpcy5zdGF0ZS5hY3RpdmUgdG8gZmFsc2VcbiAgICAvL3NldCB0aGUgc3Rhc2ggdG8gZW1wdHlcbiAgXHQvL3Nob3cgc2VuZCBhbm90aGVyIHJlcXVlc3QgYnV0dG9uXG4gICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubGVuZ3RoKSB7XG4gICAgICB2YXIgcmVxdWVzdE9iaiA9IHtcbiAgICAgICAgcmVxdWVzdFR5cDogJ3dhdGNoJyxcbiAgICAgICAgbW92aWU6IHRoaXMucHJvcHMubW92aWUudGl0bGUsXG4gICAgICAgIG1vdmllaWQ6IHRoaXMucHJvcHMubW92aWUuaWQsXG4gICAgICAgIG1lc3NhZ2U6IHRoaXMuc3RhdGUubWVzc2FnZSxcbiAgICAgICAgcmVxdWVzdGVlOiB0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLFxuICAgICAgfTtcblxuICAgICAgJC5wb3N0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvc2VuZFdhdGNoUmVxdWVzdCcsIHJlcXVlc3RPYmopXG4gICAgICAuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXF1ZXN0IHNlbmQnKVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgICAgIGZyaWVuZFN0YXNoOiBbXSxcbiAgICAgICAgICBmaWx0ZXI6ICcnLFxuICAgICAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgICAgIHJlcXVlc3RTZW50OiB0cnVlLFxuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBub1JlcXVlc3RlZVdhcm5pbmc6IHRydWVcbiAgICAgIH0pXG4gICAgfVxuXG4gIH1cblxuICBoYW5kbGVGaWx0ZXIoKSB7XG4gIFx0Ly9GaWx0ZXIgYSBwYXJ0aWN1bGFyIGZyaWVuZCBpbiB0aGUgZnJpZW5kIGxpc3RcblxuICB9XG5cbiAgaGFuZGxlQWRkRnJpZW5kKGZyaWVuZCkge1xuICAgIC8vYWRkIGZyaWVuZCB0byBzdGFzaFxuICAgIGNvbnNvbGUubG9nKCdjYWxsaW5nIGhhbmRsZUFkZEZyaWVuZCcpO1xuICAgIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmluZGV4T2YoZnJpZW5kKSA8IDApIHtcbiAgICAgIHZhciBzdGFzaENvcHkgPSB0aGlzLnN0YXRlLmZyaWVuZFN0YXNoO1xuICAgICAgc3Rhc2hDb3B5LnVuc2hpZnQoZnJpZW5kKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmcmllbmRTdGFzaDogc3Rhc2hDb3B5XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVSZW1vdmVGcmllbmQoZnJpZW5kKSB7XG4gICAgLy9yZW1vdmUgZnJpZW5kIGZyb20gc3Rhc2hcbiAgICBjb25zb2xlLmxvZygnY2FsbGluZyBoYW5kbGVSZW1vdmVGcmllbmQnLCB0aGlzLnN0YXRlLmZyaWVuZFN0YXNoKTtcbiAgICB2YXIgaWR4ID0gdGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5pbmRleE9mKGZyaWVuZClcbiAgICBpZiAodGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmcmllbmRTdGFzaDogW11cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZnJpZW5kU3Rhc2g6IHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2guc3BsaWNlKGlkeCwgMSlcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnc3Rhc2ggYWZ0ZXIgcmVtb3ZlJywgdGhpcy5zdGF0ZS5mcmllbmRTdGFzaClcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIHN0YXNoID0gXG4gICAgICAgICAgKDxkaXYgY2xhc3NOYW1lPVwiTW92aWVXYXRjaFJlcXVlc3RGcmllbmRTdGFzaFwiPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZyaWVuZFN0YXNoXCIgbmFtZT1cImZyaWVuZFN0YXNoXCIgbXVsdGlwbGU+XG4gICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLm1hcChmcmllbmQgPT4gPFdhdGNoUmVxdWVzdFN0YXNoRW50cnkgZnJpZW5kPXtmcmllbmR9IGhhbmRsZVJlbW92ZUZyaWVuZD17dGhpcy5oYW5kbGVSZW1vdmVGcmllbmQuYmluZCh0aGlzKX0vPil9XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvZGl2PilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdmFyIHN0YXNoID0gJ3BsZWFzZSBzZWxlY3QgeW91ciBmcmllbmQnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4oXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0aXZlV2F0Y2hSZXF1ZXN0XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJNb3ZpZVdhdGNoUmVxdWVzdEZyaWVuZExpc3RcIj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHZhbHVlPXt0aGlzLnN0YXRlLmZpbHRlcn0gcGxhY2Vob2xkZXI9XCJmaWx0ZXIgZnJpZW5kc1wiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUZpbHRlci5iaW5kKHRoaXMpfS8+XG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZnJpZW5kTGlzdFwiIG5hbWU9XCJmcmllbmRzTGlzdFwiIG11bHRpcGxlPlxuICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5mcmllbmRzLm1hcChmcmllbmQgPT4gPFdhdGNoUmVxdWVzdEZyaWVuZEVudHJ5IGZyaWVuZD17ZnJpZW5kfSBoYW5kbGVBZGRGcmllbmQ9e3RoaXMuaGFuZGxlQWRkRnJpZW5kLmJpbmQodGhpcyl9Lz4pfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHtzdGFzaH1cbiAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwibWVzc2FnZUJveFwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU1zZy5iaW5kKHRoaXMpfSBwbGFjZWhvbGRlcj1cImFkZCBhIG1lc3NhZ2VcIi8+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ3YXRjaFJlcXVlc3RcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpfT5zZW5kIHdhdGNoIHJlcXVlc3Q8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImNsb3NlV2F0Y2hSZXF1ZXN0XCIgb25DbGljaz17dGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpfT5jbG9zZSB3YXRjaCByZXF1ZXN0PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpfT5zZW5kIHdhdGNoIHJlcXVlc3Q8L2J1dHRvbj5cbiAgICAgICAgICA8ZGl2PnsodGhpcy5zdGF0ZS5yZXF1ZXN0U2VudCA9PT0gdHJ1ZSkgPyAneW91ciByZXF1ZXN0IGhhcyBiZWVuIHNlbnQnIDogJyd9PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxuICB9XG59XG5cblxuXG5cbnZhciBXYXRjaFJlcXVlc3RGcmllbmRFbnRyeSA9IChwcm9wcykgPT4ge1xuICByZXR1cm4gKDxsaT57cHJvcHMuZnJpZW5kfTxidXR0b24gb25DbGljaz17KCkgPT4gcHJvcHMuaGFuZGxlQWRkRnJpZW5kKHByb3BzLmZyaWVuZCl9PmFkZDwvYnV0dG9uPjwvbGk+KVxufTtcblxudmFyIFdhdGNoUmVxdWVzdFN0YXNoRW50cnkgPSAocHJvcHMpID0+IHtcbiAgcmV0dXJuICg8bGk+e3Byb3BzLmZyaWVuZH08YnV0dG9uIG9uQ2xpY2s9eygpID0+IHByb3BzLmhhbmRsZVJlbW92ZUZyaWVuZChwcm9wcy5mcmllbmQpfT5yZW1vdmU8L2J1dHRvbj48L2xpPilcbn07XG5cblxud2luZG93Lk1vdmllV2F0Y2hSZXF1ZXN0ID0gTW92aWVXYXRjaFJlcXVlc3Q7XG5cblxuXG4iXX0=