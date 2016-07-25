'use strict';

var CreateMovie = function CreateMovie(props) {
  return(
    //using rating as a text, as number will have
    //drag menu

    React.createElement(
      'div',
      { className: 'createMovie' },
      React.createElement(
        'div',
        { className: 'createMovieInput' },
        'Movie Title: ',
        React.createElement('input', { type: 'text',
          id: 'createMovieInput',
          name: 'createMovieInput',
          placeHolder: 'Insert Move to Rate'
        }),
        'Rating: ',
        React.createElement('input', { type: 'text',
          id: 'createMovieRating',
          name: 'createMovieRating',
          placeHolder: 'Insert Rating'
        })
      ),
      React.createElement(
        'div',
        { className: 'showMovieRated' },
        React.createElement(CreateMovieList, null)
      )
    )
  );
};

window.CreateMovie = CreateMovie;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0NyZWF0ZU1vdmllTGlzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxTQUFkLFdBQWMsQ0FBQyxLQUFEO0FBQUEsUTs7OztBQUloQjtBQUFBO0FBQUEsUUFBSyxXQUFVLGFBQWY7QUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLGtCQUFmO0FBQUE7QUFDZSx1Q0FBTyxNQUFLLE1BQVo7QUFDYixjQUFHLGtCQURVO0FBRWIsZ0JBQUssa0JBRlE7QUFHYix1QkFBWTtBQUhDLFVBRGY7QUFBQTtBQU9VLHVDQUFPLE1BQUssTUFBWjtBQUNSLGNBQUcsbUJBREs7QUFFUixnQkFBSyxtQkFGRztBQUdSLHVCQUFZO0FBSEo7QUFQVixPQURGO0FBZUU7QUFBQTtBQUFBLFVBQUssV0FBVSxnQkFBZjtBQUNFLDRCQUFDLGVBQUQ7QUFERjtBQWZGO0FBSmdCO0FBQUEsQ0FBbEI7O0FBMkJBLE9BQU8sV0FBUCxHQUFxQixXQUFyQiIsImZpbGUiOiJDcmVhdGVNb3ZpZUxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQ3JlYXRlTW92aWUgPSAocHJvcHMpID0+IChcbiAgLy91c2luZyByYXRpbmcgYXMgYSB0ZXh0LCBhcyBudW1iZXIgd2lsbCBoYXZlXG4gIC8vZHJhZyBtZW51XG5cbiAgPGRpdiBjbGFzc05hbWU9J2NyZWF0ZU1vdmllJz5cbiAgICA8ZGl2IGNsYXNzTmFtZT0nY3JlYXRlTW92aWVJbnB1dCc+XG4gICAgICBNb3ZpZSBUaXRsZTogPGlucHV0IHR5cGU9J3RleHQnXG4gICAgICBpZD0nY3JlYXRlTW92aWVJbnB1dCdcbiAgICAgIG5hbWU9J2NyZWF0ZU1vdmllSW5wdXQnXG4gICAgICBwbGFjZUhvbGRlcj0nSW5zZXJ0IE1vdmUgdG8gUmF0ZSdcbiAgICAgIC8+XG5cbiAgICAgIFJhdGluZzogPGlucHV0IHR5cGU9J3RleHQnXG4gICAgICBpZD0nY3JlYXRlTW92aWVSYXRpbmcnXG4gICAgICBuYW1lPSdjcmVhdGVNb3ZpZVJhdGluZydcbiAgICAgIHBsYWNlSG9sZGVyPSdJbnNlcnQgUmF0aW5nJ1xuICAgICAgLz5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3NOYW1lPSdzaG93TW92aWVSYXRlZCc+XG4gICAgICA8Q3JlYXRlTW92aWVMaXN0IC8+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuXG5cbilcblxud2luZG93LkNyZWF0ZU1vdmllID0gQ3JlYXRlTW92aWU7XG4iXX0=