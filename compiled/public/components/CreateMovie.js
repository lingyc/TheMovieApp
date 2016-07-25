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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0NyZWF0ZU1vdmllLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxjQUFjLFNBQWQsV0FBYyxDQUFDLEtBQUQ7QUFBQSxROzs7O0FBSWhCO0FBQUE7QUFBQSxRQUFLLFdBQVUsYUFBZjtBQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsa0JBQWY7QUFBQTtBQUNlLHVDQUFPLE1BQUssTUFBWjtBQUNiLGNBQUcsa0JBRFU7QUFFYixnQkFBSyxrQkFGUTtBQUdiLHVCQUFZO0FBSEMsVUFEZjtBQUFBO0FBT1UsdUNBQU8sTUFBSyxNQUFaO0FBQ1IsY0FBRyxtQkFESztBQUVSLGdCQUFLLG1CQUZHO0FBR1IsdUJBQVk7QUFISjtBQVBWLE9BREY7QUFlRTtBQUFBO0FBQUEsVUFBSyxXQUFVLGdCQUFmO0FBQ0UsNEJBQUMsZUFBRDtBQURGO0FBZkY7QUFKZ0I7QUFBQSxDQUFsQjs7QUEyQkEsT0FBTyxXQUFQLEdBQXFCLFdBQXJCIiwiZmlsZSI6IkNyZWF0ZU1vdmllLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIENyZWF0ZU1vdmllID0gKHByb3BzKSA9PiAoXG4gIC8vdXNpbmcgcmF0aW5nIGFzIGEgdGV4dCwgYXMgbnVtYmVyIHdpbGwgaGF2ZVxuICAvL2RyYWcgbWVudVxuXG4gIDxkaXYgY2xhc3NOYW1lPSdjcmVhdGVNb3ZpZSc+XG4gICAgPGRpdiBjbGFzc05hbWU9J2NyZWF0ZU1vdmllSW5wdXQnPlxuICAgICAgTW92aWUgVGl0bGU6IDxpbnB1dCB0eXBlPSd0ZXh0J1xuICAgICAgaWQ9J2NyZWF0ZU1vdmllSW5wdXQnXG4gICAgICBuYW1lPSdjcmVhdGVNb3ZpZUlucHV0J1xuICAgICAgcGxhY2VIb2xkZXI9J0luc2VydCBNb3ZlIHRvIFJhdGUnXG4gICAgICAvPlxuXG4gICAgICBSYXRpbmc6IDxpbnB1dCB0eXBlPSd0ZXh0J1xuICAgICAgaWQ9J2NyZWF0ZU1vdmllUmF0aW5nJ1xuICAgICAgbmFtZT0nY3JlYXRlTW92aWVSYXRpbmcnXG4gICAgICBwbGFjZUhvbGRlcj0nSW5zZXJ0IFJhdGluZydcbiAgICAgIC8+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzTmFtZT0nc2hvd01vdmllUmF0ZWQnPlxuICAgICAgPENyZWF0ZU1vdmllTGlzdCAvPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cblxuXG4pXG5cbndpbmRvdy5DcmVhdGVNb3ZpZSA9IENyZWF0ZU1vdmllO1xuIl19