'use strict';

var CreateMovieList = function CreateMovieList(props) {
  return (
    //using rating as a text, as number will have
    //drag menu

    React.createElement(
      'div',
      { className: 'showMovieRatedList' },
      React.createElement(
        'p',
        null,
        'Rated Movie 1 ----> 5'
      ),
      React.createElement(
        'p',
        null,
        'Rated Movie 2 ----> 3'
      )
    )
  );
};

window.CreateMovieList = CreateMovieList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0NyZWF0ZU1vdmllTGlzdEVudHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxrQkFBa0IsU0FBbEIsZUFBa0IsQ0FBQyxLQUFEO0FBQUE7QUFDcEI7QUFDQTs7QUFFQTtBQUFBO0FBQUEsUUFBSyxXQUFVLG9CQUFmO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQURGO0FBRUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUZGO0FBSm9CO0FBQUEsQ0FBdEI7O0FBV0EsT0FBTyxlQUFQLEdBQXlCLGVBQXpCIiwiZmlsZSI6IkNyZWF0ZU1vdmllTGlzdEVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIENyZWF0ZU1vdmllTGlzdCA9IChwcm9wcykgPT4gKFxuICAvL3VzaW5nIHJhdGluZyBhcyBhIHRleHQsIGFzIG51bWJlciB3aWxsIGhhdmVcbiAgLy9kcmFnIG1lbnVcblxuICA8ZGl2IGNsYXNzTmFtZT0nc2hvd01vdmllUmF0ZWRMaXN0Jz5cbiAgICA8cD5SYXRlZCBNb3ZpZSAxIC0tLS0+IDU8L3A+XG4gICAgPHA+UmF0ZWQgTW92aWUgMiAtLS0tPiAzPC9wPlxuICA8L2Rpdj5cblxuKTtcblxud2luZG93LkNyZWF0ZU1vdmllTGlzdCA9IENyZWF0ZU1vdmllTGlzdDtcbiJdfQ==