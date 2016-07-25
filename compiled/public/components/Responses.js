"use strict";

var Responses = function Responses(props) {
  console.log(props);
  if (props.movie !== null) {
    return React.createElement(
      "div",
      { className: "Reponses" },
      React.createElement(
        "h3",
        null,
        props.responsesInfo,
        " said ",
        props.responseAnswer,
        " to your ",
        props.responseType,
        " request to watch ",
        props.movie,
        "!",
        React.createElement(
          "button",
          { onClick: function onClick() {
              return props.remove(props.responsesInfo, props.self, props.movie);
            } },
          "Got it"
        )
      )
    );
  } else {
    return React.createElement(
      "div",
      { className: "Reponses" },
      React.createElement(
        "h3",
        null,
        props.responsesInfo,
        " said ",
        props.responseAnswer,
        " to your ",
        props.responseType,
        " request!",
        React.createElement(
          "button",
          { onClick: function onClick() {
              return props.remove(props.responsesInfo, props.self, null);
            } },
          "Got it"
        )
      )
    );
  }
};

window.Responses = Responses;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1Jlc3BvbnNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxTQUFaLFNBQVksQ0FBQyxLQUFELEVBQVc7QUFDekIsVUFBUSxHQUFSLENBQVksS0FBWjtBQUNBLE1BQUksTUFBTSxLQUFOLEtBQWdCLElBQXBCLEVBQTBCO0FBQ3hCLFdBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxVQUFmO0FBQ0U7QUFBQTtBQUFBO0FBQUssY0FBTSxhQUFYO0FBQUE7QUFBZ0MsY0FBTSxjQUF0QztBQUFBO0FBQStELGNBQU0sWUFBckU7QUFBQTtBQUFxRyxjQUFNLEtBQTNHO0FBQUE7QUFDRTtBQUFBO0FBQUEsWUFBUSxTQUFTO0FBQUEscUJBQUksTUFBTSxNQUFOLENBQWEsTUFBTSxhQUFuQixFQUFrQyxNQUFNLElBQXhDLEVBQThDLE1BQU0sS0FBcEQsQ0FBSjtBQUFBLGFBQWpCO0FBQUE7QUFBQTtBQURGO0FBREYsS0FERjtBQU9ELEdBUkQsTUFRTztBQUNMLFdBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxVQUFmO0FBQ0U7QUFBQTtBQUFBO0FBQUssY0FBTSxhQUFYO0FBQUE7QUFBZ0MsY0FBTSxjQUF0QztBQUFBO0FBQStELGNBQU0sWUFBckU7QUFBQTtBQUNFO0FBQUE7QUFBQSxZQUFRLFNBQVM7QUFBQSxxQkFBSSxNQUFNLE1BQU4sQ0FBYSxNQUFNLGFBQW5CLEVBQWtDLE1BQU0sSUFBeEMsRUFBOEMsSUFBOUMsQ0FBSjtBQUFBLGFBQWpCO0FBQUE7QUFBQTtBQURGO0FBREYsS0FERjtBQU9EO0FBQ0YsQ0FuQkQ7O0FBcUJBLE9BQU8sU0FBUCxHQUFtQixTQUFuQiIsImZpbGUiOiJSZXNwb25zZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUmVzcG9uc2VzID0gKHByb3BzKSA9PiB7XG4gIGNvbnNvbGUubG9nKHByb3BzKVxuICBpZiAocHJvcHMubW92aWUgIT09IG51bGwpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJSZXBvbnNlc1wiPlxuICAgICAgICA8aDM+e3Byb3BzLnJlc3BvbnNlc0luZm99IHNhaWQge3Byb3BzLnJlc3BvbnNlQW5zd2VyfSB0byB5b3VyIHtwcm9wcy5yZXNwb25zZVR5cGV9IHJlcXVlc3QgdG8gd2F0Y2gge3Byb3BzLm1vdmllfSEgIFxuICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCk9PnByb3BzLnJlbW92ZShwcm9wcy5yZXNwb25zZXNJbmZvLCBwcm9wcy5zZWxmLCBwcm9wcy5tb3ZpZSl9PkdvdCBpdDwvYnV0dG9uPlxuICAgICAgICA8L2gzPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlJlcG9uc2VzXCI+XG4gICAgICAgIDxoMz57cHJvcHMucmVzcG9uc2VzSW5mb30gc2FpZCB7cHJvcHMucmVzcG9uc2VBbnN3ZXJ9IHRvIHlvdXIge3Byb3BzLnJlc3BvbnNlVHlwZX0gcmVxdWVzdCEgXG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKT0+cHJvcHMucmVtb3ZlKHByb3BzLnJlc3BvbnNlc0luZm8sIHByb3BzLnNlbGYsIG51bGwpfT5Hb3QgaXQ8L2J1dHRvbj5cbiAgICAgICAgPC9oMz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn07XG5cbndpbmRvdy5SZXNwb25zZXMgPSBSZXNwb25zZXM7Il19