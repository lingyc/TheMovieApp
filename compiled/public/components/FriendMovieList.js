'use strict';

var FriendMovieList = function FriendMovieList(props) {
  return(
    //have a nav bar and button
    //depending on query on click
    //map the recommended movies
    React.createElement(
      'div',
      { className: 'friendMovieList' },
      'Movie Title: ',
      React.createElement('input', { type: 'text',
        id: 'movieInput',
        name: 'movieInput',
        placeholder: 'Insert Movie Title'
      }),
      React.createElement(
        'button',
        { onClick: function onClick() {
            props.getMovies(document.getElementById('movieInput'));
          } },
        'Get Movie'
      ),
      React.createElement(
        'div',
        null,
        React.createElement(FriendMovieListEntry, null)
      )
    )
  );
};

window.FriendMovieList = FriendMovieList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZE1vdmllTGlzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksa0JBQWtCLFNBQWxCLGVBQWtCLENBQUMsS0FBRDtBQUFBLFE7Ozs7QUFJcEI7QUFBQTtBQUFBLFFBQUssV0FBVSxpQkFBZjtBQUFBO0FBRWUscUNBQU8sTUFBTSxNQUFiO0FBQ2IsWUFBRyxZQURVO0FBRWIsY0FBSyxZQUZRO0FBR2IscUJBQVk7QUFIQyxRQUZmO0FBT0U7QUFBQTtBQUFBLFVBQVEsU0FBUyxtQkFDZjtBQUFDLGtCQUFNLFNBQU4sQ0FBZ0IsU0FBUyxjQUFULENBQXdCLFlBQXhCLENBQWhCO0FBQXVELFdBRDFEO0FBQUE7QUFBQSxPQVBGO0FBU0U7QUFBQTtBQUFBO0FBQ0UsNEJBQUMsb0JBQUQ7QUFERjtBQVRGO0FBSm9CO0FBQUEsQ0FBdEI7O0FBb0JBLE9BQU8sZUFBUCxHQUF5QixlQUF6QiIsImZpbGUiOiJGcmllbmRNb3ZpZUxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgRnJpZW5kTW92aWVMaXN0ID0gKHByb3BzKSA9PiAoXG4gIC8vaGF2ZSBhIG5hdiBiYXIgYW5kIGJ1dHRvblxuICAvL2RlcGVuZGluZyBvbiBxdWVyeSBvbiBjbGlja1xuICAvL21hcCB0aGUgcmVjb21tZW5kZWQgbW92aWVzXG4gIDxkaXYgY2xhc3NOYW1lPSdmcmllbmRNb3ZpZUxpc3QnPlxuXG4gICAgTW92aWUgVGl0bGU6IDxpbnB1dCB0eXBlID0ndGV4dCcgXG4gICAgaWQ9J21vdmllSW5wdXQnIFxuICAgIG5hbWU9J21vdmllSW5wdXQnXG4gICAgcGxhY2Vob2xkZXI9J0luc2VydCBNb3ZpZSBUaXRsZSdcbiAgICAgLz5cbiAgICA8YnV0dG9uIG9uQ2xpY2s9e2Z1bmN0aW9uKClcbiAgICAgIHtwcm9wcy5nZXRNb3ZpZXMoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllSW5wdXQnKSl9fT5HZXQgTW92aWU8L2J1dHRvbj5cbiAgICA8ZGl2PlxuICAgICAgPEZyaWVuZE1vdmllTGlzdEVudHJ5IC8+XG4gICAgPC9kaXY+XG5cbiAgPC9kaXY+XG4pO1xuXG53aW5kb3cuRnJpZW5kTW92aWVMaXN0ID0gRnJpZW5kTW92aWVMaXN0OyJdfQ==