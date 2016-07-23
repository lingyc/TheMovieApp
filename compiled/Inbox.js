'use strict';

var Inbox = function Inbox(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'h2',
      { className: 'nh' },
      'Inbox'
    ),
    'List of people who\'ve sent you requests:',
    React.createElement('br', null),
    props.pplWhoWantToBeFriends.map(function (friend) {
      return React.createElement(InboxEntry, { accept: props.accept, decline: props.decline,
        inboxName: friend[0], requestType: friend[1], requestMovie: friend[2] });
    }),
    'Request Responses:',
    props.responsesAnswered.map(function (unit) {
      return React.createElement(Responses, { responsesInfo: unit.requestee, responseAnswer: unit.response, responseType: unit.requestTyp });
    })
  );
};

window.Inbox = Inbox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL0luYm94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxRQUFRLFNBQVIsS0FBUSxDQUFDLEtBQUQ7QUFBQSxTQUVWO0FBQUE7QUFBQTtBQUNEO0FBQUE7QUFBQSxRQUFJLFdBQVUsSUFBZDtBQUFBO0FBQUEsS0FEQztBQUFBO0FBR3VDLG1DQUh2QztBQU1ELFVBQU0scUJBQU4sQ0FBNEIsR0FBNUIsQ0FBZ0MsVUFBUyxNQUFULEVBQWdCO0FBQUUsYUFBUSxvQkFBQyxVQUFELElBQVksUUFBUSxNQUFNLE1BQTFCLEVBQWtDLFNBQVMsTUFBTSxPQUFqRDtBQUN6RCxtQkFBVyxPQUFPLENBQVAsQ0FEOEMsRUFDbkMsYUFBYSxPQUFPLENBQVAsQ0FEc0IsRUFDWCxjQUFjLE9BQU8sQ0FBUCxDQURILEdBQVI7QUFDMkIsS0FEN0UsQ0FOQztBQUFBO0FBVUQsVUFBTSxpQkFBTixDQUF3QixHQUF4QixDQUE0QixVQUFTLElBQVQsRUFBYztBQUFFLGFBQU8sb0JBQUMsU0FBRCxJQUFXLGVBQWUsS0FBSyxTQUEvQixFQUEwQyxnQkFBZ0IsS0FBSyxRQUEvRCxFQUF5RSxjQUFjLEtBQUssVUFBNUYsR0FBUDtBQUFrSCxLQUE5SjtBQVZDLEdBRlU7QUFBQSxDQUFaOztBQW1CQSxPQUFPLEtBQVAsR0FBZSxLQUFmIiwiZmlsZSI6IkluYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEluYm94ID0gKHByb3BzKSA9PiAoXG4gXG4gIDxkaXY+XG4gPGgyIGNsYXNzTmFtZT0nbmgnPkluYm94PC9oMj5cblxuIExpc3Qgb2YgcGVvcGxlIHdobyd2ZSBzZW50IHlvdSByZXF1ZXN0czo8YnIvPlxuXG5cbntwcm9wcy5wcGxXaG9XYW50VG9CZUZyaWVuZHMubWFwKGZ1bmN0aW9uKGZyaWVuZCl7IHJldHVybiAoPEluYm94RW50cnkgYWNjZXB0PXtwcm9wcy5hY2NlcHR9IGRlY2xpbmU9e3Byb3BzLmRlY2xpbmV9IFxuICBpbmJveE5hbWU9e2ZyaWVuZFswXX0gcmVxdWVzdFR5cGU9e2ZyaWVuZFsxXX0gcmVxdWVzdE1vdmllPXtmcmllbmRbMl19IC8+ICl9KX1cblxuUmVxdWVzdCBSZXNwb25zZXM6XG57cHJvcHMucmVzcG9uc2VzQW5zd2VyZWQubWFwKGZ1bmN0aW9uKHVuaXQpeyByZXR1cm4gPFJlc3BvbnNlcyByZXNwb25zZXNJbmZvPXt1bml0LnJlcXVlc3RlZX0gcmVzcG9uc2VBbnN3ZXI9e3VuaXQucmVzcG9uc2V9IHJlc3BvbnNlVHlwZT17dW5pdC5yZXF1ZXN0VHlwfSAvPn0pfVxuXG48L2Rpdj5cblxuXG4pO1xuXG53aW5kb3cuSW5ib3ggPSBJbmJveDtcbiJdfQ==