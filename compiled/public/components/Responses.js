"use strict";

var Responses = function Responses(_ref) {
  var movie = _ref.movie;
  var responsesInfo = _ref.responsesInfo;
  var responseAnswer = _ref.responseAnswer;
  var responseType = _ref.responseType;
  var remove = _ref.remove;
  var self = _ref.self;

  console.log('props.movie', movie);
  if (movie !== null) {
    return React.createElement(
      "div",
      { className: "Reponses collection-item row" },
      React.createElement(
        "div",
        { className: "col s3" },
        React.createElement("img", { className: "profilethumnail", src: 'https://unsplash.it/170/170/?random' })
      ),
      React.createElement(
        "div",
        { className: "response col s9" },
        React.createElement(
          "div",
          { className: "responseMsg" },
          responsesInfo,
          " said ",
          responseAnswer,
          " to your ",
          responseType,
          " request to watch ",
          movie,
          "!",
          React.createElement(
            "a",
            { className: "waves-effect waves-light btn", onClick: function onClick() {
                return remove(responsesInfo, self, movie);
              } },
            "Got it"
          )
        )
      )
    );
  } else {
    return React.createElement(
      "div",
      { className: "Reponses collection-item row" },
      React.createElement(
        "div",
        { className: "col s3" },
        React.createElement("img", { className: "profilethumnail", src: 'https://unsplash.it/170/170/?random' })
      ),
      React.createElement(
        "div",
        { className: "response col s9" },
        React.createElement(
          "div",
          { className: "responseMsg" },
          responsesInfo,
          " said ",
          responseAnswer,
          " to your ",
          responseType,
          " request!"
        ),
        React.createElement(
          "a",
          { className: "waves-effect waves-light btn", onClick: function onClick() {
              return remove(responsesInfo, self, null);
            } },
          "Got it"
        )
      )
    );
  }
};

window.Responses = Responses;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1Jlc3BvbnNlcy5qcyJdLCJuYW1lcyI6WyJSZXNwb25zZXMiLCJtb3ZpZSIsInJlc3BvbnNlc0luZm8iLCJyZXNwb25zZUFuc3dlciIsInJlc3BvbnNlVHlwZSIsInJlbW92ZSIsInNlbGYiLCJjb25zb2xlIiwibG9nIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFlBQVksU0FBWkEsU0FBWSxPQUF3RTtBQUFBLE1BQXRFQyxLQUFzRSxRQUF0RUEsS0FBc0U7QUFBQSxNQUEvREMsYUFBK0QsUUFBL0RBLGFBQStEO0FBQUEsTUFBaERDLGNBQWdELFFBQWhEQSxjQUFnRDtBQUFBLE1BQWhDQyxZQUFnQyxRQUFoQ0EsWUFBZ0M7QUFBQSxNQUFsQkMsTUFBa0IsUUFBbEJBLE1BQWtCO0FBQUEsTUFBVkMsSUFBVSxRQUFWQSxJQUFVOztBQUN4RkMsVUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJQLEtBQTNCO0FBQ0EsTUFBSUEsVUFBVSxJQUFkLEVBQW9CO0FBQ2xCLFdBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSw4QkFBZjtBQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsUUFBZjtBQUNFLHFDQUFLLFdBQVUsaUJBQWYsRUFBaUMsS0FBSyxxQ0FBdEM7QUFERixPQURGO0FBSUU7QUFBQTtBQUFBLFVBQUssV0FBVSxpQkFBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsYUFBZjtBQUE4QkMsdUJBQTlCO0FBQUE7QUFBbURDLHdCQUFuRDtBQUFBO0FBQTRFQyxzQkFBNUU7QUFBQTtBQUE0R0gsZUFBNUc7QUFBQTtBQUNBO0FBQUE7QUFBQSxjQUFHLFdBQVUsOEJBQWIsRUFBNEMsU0FBUztBQUFBLHVCQUFJSSxPQUFPSCxhQUFQLEVBQXNCSSxJQUF0QixFQUE0QkwsS0FBNUIsQ0FBSjtBQUFBLGVBQXJEO0FBQUE7QUFBQTtBQURBO0FBREY7QUFKRixLQURGO0FBWUQsR0FiRCxNQWFPO0FBQ0wsV0FDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLDhCQUFmO0FBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxRQUFmO0FBQ0UscUNBQUssV0FBVSxpQkFBZixFQUFpQyxLQUFLLHFDQUF0QztBQURGLE9BREY7QUFLRTtBQUFBO0FBQUEsVUFBSyxXQUFVLGlCQUFmO0FBQ0U7QUFBQTtBQUFBLFlBQUssV0FBVSxhQUFmO0FBQThCQyx1QkFBOUI7QUFBQTtBQUFtREMsd0JBQW5EO0FBQUE7QUFBNEVDLHNCQUE1RTtBQUFBO0FBQUEsU0FERjtBQUVFO0FBQUE7QUFBQSxZQUFHLFdBQVUsOEJBQWIsRUFBNEMsU0FBUztBQUFBLHFCQUFJQyxPQUFPSCxhQUFQLEVBQXNCSSxJQUF0QixFQUE0QixJQUE1QixDQUFKO0FBQUEsYUFBckQ7QUFBQTtBQUFBO0FBRkY7QUFMRixLQURGO0FBWUQ7QUFDRixDQTdCRDs7QUErQkFHLE9BQU9ULFNBQVAsR0FBbUJBLFNBQW5CIiwiZmlsZSI6IlJlc3BvbnNlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFJlc3BvbnNlcyA9ICh7bW92aWUsIHJlc3BvbnNlc0luZm8sIHJlc3BvbnNlQW5zd2VyLCByZXNwb25zZVR5cGUsIHJlbW92ZSwgc2VsZn0pID0+IHtcclxuICBjb25zb2xlLmxvZygncHJvcHMubW92aWUnLCBtb3ZpZSlcclxuICBpZiAobW92aWUgIT09IG51bGwpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUmVwb25zZXMgY29sbGVjdGlvbi1pdGVtIHJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XHJcbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT0ncHJvZmlsZXRodW1uYWlsJyBzcmM9eydodHRwczovL3Vuc3BsYXNoLml0LzE3MC8xNzAvP3JhbmRvbSd9Lz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3BvbnNlIGNvbCBzOVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXNwb25zZU1zZ1wiPntyZXNwb25zZXNJbmZvfSBzYWlkIHtyZXNwb25zZUFuc3dlcn0gdG8geW91ciB7cmVzcG9uc2VUeXBlfSByZXF1ZXN0IHRvIHdhdGNoIHttb3ZpZX0hICBcclxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKT0+cmVtb3ZlKHJlc3BvbnNlc0luZm8sIHNlbGYsIG1vdmllKX0+R290IGl0PC9hPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKVxyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlJlcG9uc2VzIGNvbGxlY3Rpb24taXRlbSByb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzM1wiPlxyXG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzcG9uc2UgY29sIHM5XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3BvbnNlTXNnXCI+e3Jlc3BvbnNlc0luZm99IHNhaWQge3Jlc3BvbnNlQW5zd2VyfSB0byB5b3VyIHtyZXNwb25zZVR5cGV9IHJlcXVlc3QhPC9kaXY+XHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCk9PnJlbW92ZShyZXNwb25zZXNJbmZvLCBzZWxmLCBudWxsKX0+R290IGl0PC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG5cclxud2luZG93LlJlc3BvbnNlcyA9IFJlc3BvbnNlczsiXX0=