"use strict";

var StarRatingComponent = function StarRatingComponent(_ref) {
	var onStarClick = _ref.onStarClick;
	return React.createElement(
		"div",
		{ className: "star-rating col-sm-10" },
		React.createElement("input", { type: "radio", name: "rating", value: "1", onChange: onStarClick }),
		React.createElement("i", null),
		React.createElement("input", { type: "radio", name: "rating", value: "2", onChange: onStarClick }),
		React.createElement("i", null),
		React.createElement("input", { type: "radio", name: "rating", value: "3", onChange: onStarClick }),
		React.createElement("i", null),
		React.createElement("input", { type: "radio", name: "rating", value: "4", onChange: onStarClick }),
		React.createElement("i", null),
		React.createElement("input", { type: "radio", name: "rating", value: "5", onChange: onStarClick }),
		React.createElement("i", null)
	);
};

window.StarRatingComponent = StarRatingComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9saWIvU3RhclJhdGluZ0NvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksc0JBQXNCLFNBQXRCLG1CQUFzQjtBQUFBLEtBQUUsV0FBRixRQUFFLFdBQUY7QUFBQSxRQUN6QjtBQUFBO0FBQUEsSUFBSyxXQUFVLHVCQUFmO0FBQ0UsaUNBQU8sTUFBSyxPQUFaLEVBQW9CLE1BQUssUUFBekIsRUFBa0MsT0FBTSxHQUF4QyxFQUE0QyxVQUFVLFdBQXRELEdBREY7QUFDc0UsZ0NBRHRFO0FBRUUsaUNBQU8sTUFBSyxPQUFaLEVBQW9CLE1BQUssUUFBekIsRUFBa0MsT0FBTSxHQUF4QyxFQUE0QyxVQUFVLFdBQXRELEdBRkY7QUFFc0UsZ0NBRnRFO0FBR0UsaUNBQU8sTUFBSyxPQUFaLEVBQW9CLE1BQUssUUFBekIsRUFBa0MsT0FBTSxHQUF4QyxFQUE0QyxVQUFVLFdBQXRELEdBSEY7QUFHc0UsZ0NBSHRFO0FBSUUsaUNBQU8sTUFBSyxPQUFaLEVBQW9CLE1BQUssUUFBekIsRUFBa0MsT0FBTSxHQUF4QyxFQUE0QyxVQUFVLFdBQXRELEdBSkY7QUFJc0UsZ0NBSnRFO0FBS0UsaUNBQU8sTUFBSyxPQUFaLEVBQW9CLE1BQUssUUFBekIsRUFBa0MsT0FBTSxHQUF4QyxFQUE0QyxVQUFVLFdBQXRELEdBTEY7QUFLc0U7QUFMdEUsRUFEeUI7QUFBQSxDQUExQjs7QUFVQSxPQUFPLG1CQUFQLEdBQTZCLG1CQUE3QiIsImZpbGUiOiJTdGFyUmF0aW5nQ29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFN0YXJSYXRpbmdDb21wb25lbnQgPSAoe29uU3RhckNsaWNrfSkgPT4gKFxuXHQ8ZGl2IGNsYXNzTmFtZT1cInN0YXItcmF0aW5nIGNvbC1zbS0xMFwiPlxuXHQgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicmF0aW5nXCIgdmFsdWU9XCIxXCIgb25DaGFuZ2U9e29uU3RhckNsaWNrfS8+PGk+PC9pPlxuXHQgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicmF0aW5nXCIgdmFsdWU9XCIyXCIgb25DaGFuZ2U9e29uU3RhckNsaWNrfS8+PGk+PC9pPlxuXHQgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicmF0aW5nXCIgdmFsdWU9XCIzXCIgb25DaGFuZ2U9e29uU3RhckNsaWNrfS8+PGk+PC9pPlxuXHQgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicmF0aW5nXCIgdmFsdWU9XCI0XCIgb25DaGFuZ2U9e29uU3RhckNsaWNrfS8+PGk+PC9pPlxuXHQgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwicmF0aW5nXCIgdmFsdWU9XCI1XCIgb25DaGFuZ2U9e29uU3RhckNsaWNrfS8+PGk+PC9pPlxuXHQ8L2Rpdj5cbilcblxud2luZG93LlN0YXJSYXRpbmdDb21wb25lbnQgPSBTdGFyUmF0aW5nQ29tcG9uZW50OyJdfQ==