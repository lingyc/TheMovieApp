"use strict";

var Responses = function Responses(props) {
  console.log(props);
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
            return props.remove(props.responsesInfo, props.self);
          } },
        "Got it"
      )
    )
  );
};

window.Responses = Responses;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL1Jlc3BvbnNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxTQUFaLFNBQVksQ0FBQyxLQUFELEVBQVc7QUFDM0IsVUFBUSxHQUFSLENBQVksS0FBWjtBQUNFLFNBRUE7QUFBQTtBQUFBLE1BQUssV0FBVSxVQUFmO0FBQ0U7QUFBQTtBQUFBO0FBQUssWUFBTSxhQUFYO0FBQUE7QUFBZ0MsWUFBTSxjQUF0QztBQUFBO0FBQStELFlBQU0sWUFBckU7QUFBQTtBQUNFO0FBQUE7QUFBQSxVQUFRLFNBQVM7QUFBQSxtQkFBSSxNQUFNLE1BQU4sQ0FBYSxNQUFNLGFBQW5CLEVBQWtDLE1BQU0sSUFBeEMsQ0FBSjtBQUFBLFdBQWpCO0FBQUE7QUFBQTtBQURGO0FBREYsR0FGQTtBQU9BLENBVEY7O0FBV0EsT0FBTyxTQUFQLEdBQW1CLFNBQW5CIiwiZmlsZSI6IlJlc3BvbnNlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZXNwb25zZXMgPSAocHJvcHMpID0+IHtcbmNvbnNvbGUubG9nKHByb3BzKVxuICByZXR1cm4gKFxuXG4gIDxkaXYgY2xhc3NOYW1lPVwiUmVwb25zZXNcIj5cbiAgICA8aDM+e3Byb3BzLnJlc3BvbnNlc0luZm99IHNhaWQge3Byb3BzLnJlc3BvbnNlQW5zd2VyfSB0byB5b3VyIHtwcm9wcy5yZXNwb25zZVR5cGV9IHJlcXVlc3QhIFxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKT0+cHJvcHMucmVtb3ZlKHByb3BzLnJlc3BvbnNlc0luZm8sIHByb3BzLnNlbGYpfT5Hb3QgaXQ8L2J1dHRvbj5cbiAgICA8L2gzPlxuICA8L2Rpdj5cbil9O1xuXG53aW5kb3cuUmVzcG9uc2VzID0gUmVzcG9uc2VzOyJdfQ==