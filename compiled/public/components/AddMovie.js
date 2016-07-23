'use strict';

var AddMovie = function AddMovie(props) {
  return(
    //using rating as a text, as number will have
    //drag menu
    React.createElement(
      'div',
      { className: 'addMovie' },
      React.createElement(
        'div',
        { className: 'addMovieInput' },
        React.createElement('input', { type: 'text', id: 'addMovieInputTitle', name: 'addMovieInput', placeholder: 'movie title' }),
        React.createElement('input', { type: 'text', id: 'addMovieInputGenre', name: 'addMovieInput', placeholder: 'movie genre' }),
        React.createElement('input', { type: 'text', id: 'addMovieInputPoster', name: 'addMovieInput', placeholder: 'movie posterURL' }),
        React.createElement('input', { type: 'text', id: 'addMovieInputDate', name: 'addMovieInput', placeholder: 'movie release date' }),
        React.createElement('input', { type: 'text', id: 'ratingScore', name: 'movieTitle', placeholder: 'your rating' }),
        React.createElement(
          'button',
          { onClick: props.addMovie },
          ' add movie '
        ),
        React.createElement(
          'button',
          { onClick: props.rateMovie },
          ' rate movie '
        )
      )
    )
  );
};

window.AddMovie = AddMovie;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FkZE1vdmllLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFNBQVgsUUFBVyxDQUFDLEtBQUQ7QUFBQSxRQUNiO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFBQSxRQUFLLFdBQVUsVUFBZjtBQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsZUFBZjtBQUNFLHVDQUFPLE1BQUssTUFBWixFQUFtQixJQUFHLG9CQUF0QixFQUEyQyxNQUFLLGVBQWhELEVBQWdFLGFBQVksYUFBNUUsR0FERjtBQUVFLHVDQUFPLE1BQUssTUFBWixFQUFtQixJQUFHLG9CQUF0QixFQUEyQyxNQUFLLGVBQWhELEVBQWdFLGFBQVksYUFBNUUsR0FGRjtBQUdFLHVDQUFPLE1BQUssTUFBWixFQUFtQixJQUFHLHFCQUF0QixFQUE0QyxNQUFLLGVBQWpELEVBQWlFLGFBQVksaUJBQTdFLEdBSEY7QUFJRSx1Q0FBTyxNQUFLLE1BQVosRUFBbUIsSUFBRyxtQkFBdEIsRUFBMEMsTUFBSyxlQUEvQyxFQUErRCxhQUFZLG9CQUEzRSxHQUpGO0FBS0UsdUNBQU8sTUFBSyxNQUFaLEVBQW1CLElBQUcsYUFBdEIsRUFBb0MsTUFBSyxZQUF6QyxFQUFzRCxhQUFZLGFBQWxFLEdBTEY7QUFNRTtBQUFBO0FBQUEsWUFBUSxTQUFTLE1BQU0sUUFBdkI7QUFBQTtBQUFBLFNBTkY7QUFPRTtBQUFBO0FBQUEsWUFBUSxTQUFTLE1BQU0sU0FBdkI7QUFBQTtBQUFBO0FBUEY7QUFERjtBQUhhO0FBQUEsQ0FBZjs7QUFnQkEsT0FBTyxRQUFQLEdBQWtCLFFBQWxCIiwiZmlsZSI6IkFkZE1vdmllLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEFkZE1vdmllID0gKHByb3BzKSA9PiAoXG4gIC8vdXNpbmcgcmF0aW5nIGFzIGEgdGV4dCwgYXMgbnVtYmVyIHdpbGwgaGF2ZVxuICAvL2RyYWcgbWVudVxuICA8ZGl2IGNsYXNzTmFtZT0nYWRkTW92aWUnPlxuICAgIDxkaXYgY2xhc3NOYW1lPSdhZGRNb3ZpZUlucHV0Jz5cbiAgICAgIDxpbnB1dCB0eXBlPSd0ZXh0JyBpZD0nYWRkTW92aWVJbnB1dFRpdGxlJyBuYW1lPSdhZGRNb3ZpZUlucHV0JyBwbGFjZWhvbGRlcj0nbW92aWUgdGl0bGUnLz5cbiAgICAgIDxpbnB1dCB0eXBlPSd0ZXh0JyBpZD0nYWRkTW92aWVJbnB1dEdlbnJlJyBuYW1lPSdhZGRNb3ZpZUlucHV0JyBwbGFjZWhvbGRlcj0nbW92aWUgZ2VucmUnLz5cbiAgICAgIDxpbnB1dCB0eXBlPSd0ZXh0JyBpZD0nYWRkTW92aWVJbnB1dFBvc3RlcicgbmFtZT0nYWRkTW92aWVJbnB1dCcgcGxhY2Vob2xkZXI9J21vdmllIHBvc3RlclVSTCcvPlxuICAgICAgPGlucHV0IHR5cGU9J3RleHQnIGlkPSdhZGRNb3ZpZUlucHV0RGF0ZScgbmFtZT0nYWRkTW92aWVJbnB1dCcgcGxhY2Vob2xkZXI9J21vdmllIHJlbGVhc2UgZGF0ZScvPlxuICAgICAgPGlucHV0IHR5cGU9J3RleHQnIGlkPSdyYXRpbmdTY29yZScgbmFtZT0nbW92aWVUaXRsZScgcGxhY2Vob2xkZXI9J3lvdXIgcmF0aW5nJy8+XG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9e3Byb3BzLmFkZE1vdmllfT4gYWRkIG1vdmllIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtwcm9wcy5yYXRlTW92aWV9PiByYXRlIG1vdmllIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbilcblxud2luZG93LkFkZE1vdmllID0gQWRkTW92aWU7XG4iXX0=