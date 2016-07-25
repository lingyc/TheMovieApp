"use strict";

var GroceryListEntry = function GroceryListEntry() {
  return React.createElement(
    "div",
    { "class": "groceryListEntry" },
    React.createElement(
      "form",
      null,
      React.createElement("input", { type: "text", name: "groceryItem", placeholder: "item" }),
      React.createElement("input", { type: "text", name: "quantity", placeholder: "Quantity" })
    )
  );
};

window.GroceryListEntry = GroceryListEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0dyb2NlcnlMaXN0RW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLG1CQUFtQixTQUFuQixnQkFBbUI7QUFBQSxTQUNyQjtBQUFBO0FBQUEsTUFBSyxTQUFNLGtCQUFYO0FBQ0U7QUFBQTtBQUFBO0FBQ0UscUNBQU8sTUFBSyxNQUFaLEVBQW1CLE1BQUssYUFBeEIsRUFBc0MsYUFBWSxNQUFsRCxHQURGO0FBRUUscUNBQU8sTUFBSyxNQUFaLEVBQW1CLE1BQUssVUFBeEIsRUFBbUMsYUFBWSxVQUEvQztBQUZGO0FBREYsR0FEcUI7QUFBQSxDQUF2Qjs7QUFTQSxPQUFPLGdCQUFQLEdBQTBCLGdCQUExQiIsImZpbGUiOiJHcm9jZXJ5TGlzdEVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IEdyb2NlcnlMaXN0RW50cnkgPSAoKSA9PiAoXG4gIDxkaXYgY2xhc3M9XCJncm9jZXJ5TGlzdEVudHJ5XCI+XG4gICAgPGZvcm0+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZ3JvY2VyeUl0ZW1cIiBwbGFjZWhvbGRlcj1cIml0ZW1cIj48L2lucHV0PlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInF1YW50aXR5XCIgcGxhY2Vob2xkZXI9XCJRdWFudGl0eVwiPjwvaW5wdXQ+XG4gICAgPC9mb3JtPlxuICA8L2Rpdj5cbik7XG5cbndpbmRvdy5Hcm9jZXJ5TGlzdEVudHJ5ID0gR3JvY2VyeUxpc3RFbnRyeTsiXX0=