"use strict";

var Responses = function Responses(props) {
  console.log('props.movie', props.movie);
  if (props.movie !== null) {
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
          props.responsesInfo,
          " said ",
          props.responseAnswer,
          " to your ",
          props.responseType,
          " request to watch ",
          props.movie,
          "!",
          React.createElement(
            "a",
            { className: "waves-effect waves-light btn", onClick: function onClick() {
                return props.remove(props.responsesInfo, props.self, props.movie);
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
          props.responsesInfo,
          " said ",
          props.responseAnswer,
          " to your ",
          props.responseType,
          " request!"
        ),
        React.createElement(
          "a",
          { className: "waves-effect waves-light btn", onClick: function onClick() {
              return props.remove(props.responsesInfo, props.self, null);
            } },
          "Got it"
        )
      )
    );
  }
};

window.Responses = Responses;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1Jlc3BvbnNlcy5qcyJdLCJuYW1lcyI6WyJSZXNwb25zZXMiLCJwcm9wcyIsImNvbnNvbGUiLCJsb2ciLCJtb3ZpZSIsInJlc3BvbnNlc0luZm8iLCJyZXNwb25zZUFuc3dlciIsInJlc3BvbnNlVHlwZSIsInJlbW92ZSIsInNlbGYiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsWUFBWSxTQUFaQSxTQUFZLENBQUNDLEtBQUQsRUFBVztBQUN6QkMsVUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJGLE1BQU1HLEtBQWpDO0FBQ0EsTUFBSUgsTUFBTUcsS0FBTixLQUFnQixJQUFwQixFQUEwQjtBQUN4QixXQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsOEJBQWY7QUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLFFBQWY7QUFDRSxxQ0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREYsT0FERjtBQUlFO0FBQUE7QUFBQSxVQUFLLFdBQVUsaUJBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFBOEJILGdCQUFNSSxhQUFwQztBQUFBO0FBQXlESixnQkFBTUssY0FBL0Q7QUFBQTtBQUF3RkwsZ0JBQU1NLFlBQTlGO0FBQUE7QUFBOEhOLGdCQUFNRyxLQUFwSTtBQUFBO0FBQ0E7QUFBQTtBQUFBLGNBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTO0FBQUEsdUJBQUlILE1BQU1PLE1BQU4sQ0FBYVAsTUFBTUksYUFBbkIsRUFBa0NKLE1BQU1RLElBQXhDLEVBQThDUixNQUFNRyxLQUFwRCxDQUFKO0FBQUEsZUFBckQ7QUFBQTtBQUFBO0FBREE7QUFERjtBQUpGLEtBREY7QUFZRCxHQWJELE1BYU87QUFDTCxXQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsOEJBQWY7QUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLFFBQWY7QUFDRSxxQ0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREYsT0FERjtBQUtFO0FBQUE7QUFBQSxVQUFLLFdBQVUsaUJBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFBOEJILGdCQUFNSSxhQUFwQztBQUFBO0FBQXlESixnQkFBTUssY0FBL0Q7QUFBQTtBQUF3RkwsZ0JBQU1NLFlBQTlGO0FBQUE7QUFBQSxTQURGO0FBRUU7QUFBQTtBQUFBLFlBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTO0FBQUEscUJBQUlOLE1BQU1PLE1BQU4sQ0FBYVAsTUFBTUksYUFBbkIsRUFBa0NKLE1BQU1RLElBQXhDLEVBQThDLElBQTlDLENBQUo7QUFBQSxhQUFyRDtBQUFBO0FBQUE7QUFGRjtBQUxGLEtBREY7QUFZRDtBQUNGLENBN0JEOztBQStCQUMsT0FBT1YsU0FBUCxHQUFtQkEsU0FBbkIiLCJmaWxlIjoiUmVzcG9uc2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFJlc3BvbnNlcyA9IChwcm9wcykgPT4ge1xuICBjb25zb2xlLmxvZygncHJvcHMubW92aWUnLCBwcm9wcy5tb3ZpZSlcbiAgaWYgKHByb3BzLm1vdmllICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUmVwb25zZXMgY29sbGVjdGlvbi1pdGVtIHJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzM1wiPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSdwcm9maWxldGh1bW5haWwnIHNyYz17J2h0dHBzOi8vdW5zcGxhc2guaXQvMTcwLzE3MC8/cmFuZG9tJ30vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXNwb25zZSBjb2wgczlcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3BvbnNlTXNnXCI+e3Byb3BzLnJlc3BvbnNlc0luZm99IHNhaWQge3Byb3BzLnJlc3BvbnNlQW5zd2VyfSB0byB5b3VyIHtwcm9wcy5yZXNwb25zZVR5cGV9IHJlcXVlc3QgdG8gd2F0Y2gge3Byb3BzLm1vdmllfSEgIFxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKT0+cHJvcHMucmVtb3ZlKHByb3BzLnJlc3BvbnNlc0luZm8sIHByb3BzLnNlbGYsIHByb3BzLm1vdmllKX0+R290IGl0PC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJSZXBvbnNlcyBjb2xsZWN0aW9uLWl0ZW0gcm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzcG9uc2UgY29sIHM5XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXNwb25zZU1zZ1wiPntwcm9wcy5yZXNwb25zZXNJbmZvfSBzYWlkIHtwcm9wcy5yZXNwb25zZUFuc3dlcn0gdG8geW91ciB7cHJvcHMucmVzcG9uc2VUeXBlfSByZXF1ZXN0ITwvZGl2PlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKT0+cHJvcHMucmVtb3ZlKHByb3BzLnJlc3BvbnNlc0luZm8sIHByb3BzLnNlbGYsIG51bGwpfT5Hb3QgaXQ8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufTtcblxud2luZG93LlJlc3BvbnNlcyA9IFJlc3BvbnNlczsiXX0=