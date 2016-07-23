"use strict";

var Responses = function Responses(props) {

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
      " request! ",
      React.createElement(
        "button",
        null,
        "Got it"
      )
    )
  );
};

window.Responses = Responses;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL1Jlc3BvbnNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksWUFBWSxTQUFaLFNBQVksQ0FBQyxLQUFELEVBQVc7O0FBRXpCLFNBQ0E7QUFBQTtBQUFBLE1BQUssV0FBVSxVQUFmO0FBQ0U7QUFBQTtBQUFBO0FBQUssWUFBTSxhQUFYO0FBQUE7QUFBZ0MsWUFBTSxjQUF0QztBQUFBO0FBQStELFlBQU0sWUFBckU7QUFBQTtBQUE0RjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQTVGO0FBREYsR0FEQTtBQUlBLENBTkY7O0FBUUEsT0FBTyxTQUFQLEdBQW1CLFNBQW5CIiwiZmlsZSI6IlJlc3BvbnNlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZXNwb25zZXMgPSAocHJvcHMpID0+IHtcblx0XG4gIHJldHVybiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiUmVwb25zZXNcIj5cbiAgICA8aDM+e3Byb3BzLnJlc3BvbnNlc0luZm99IHNhaWQge3Byb3BzLnJlc3BvbnNlQW5zd2VyfSB0byB5b3VyIHtwcm9wcy5yZXNwb25zZVR5cGV9IHJlcXVlc3QhIDxidXR0b24+R290IGl0PC9idXR0b24+PC9oMz5cbiAgPC9kaXY+XG4pfTtcblxud2luZG93LlJlc3BvbnNlcyA9IFJlc3BvbnNlczsiXX0=