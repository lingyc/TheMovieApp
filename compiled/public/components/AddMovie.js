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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FkZE1vdmllLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFXLFNBQVgsUUFBVyxDQUFDLEtBQUQ7QUFBQSxROzs7QUFHYjtBQUFBO0FBQUEsUUFBSyxXQUFVLFVBQWY7QUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLGVBQWY7QUFDRSx1Q0FBTyxNQUFLLE1BQVosRUFBbUIsSUFBRyxvQkFBdEIsRUFBMkMsTUFBSyxlQUFoRCxFQUFnRSxhQUFZLGFBQTVFLEdBREY7QUFFRSx1Q0FBTyxNQUFLLE1BQVosRUFBbUIsSUFBRyxvQkFBdEIsRUFBMkMsTUFBSyxlQUFoRCxFQUFnRSxhQUFZLGFBQTVFLEdBRkY7QUFHRSx1Q0FBTyxNQUFLLE1BQVosRUFBbUIsSUFBRyxxQkFBdEIsRUFBNEMsTUFBSyxlQUFqRCxFQUFpRSxhQUFZLGlCQUE3RSxHQUhGO0FBSUUsdUNBQU8sTUFBSyxNQUFaLEVBQW1CLElBQUcsbUJBQXRCLEVBQTBDLE1BQUssZUFBL0MsRUFBK0QsYUFBWSxvQkFBM0UsR0FKRjtBQUtFLHVDQUFPLE1BQUssTUFBWixFQUFtQixJQUFHLGFBQXRCLEVBQW9DLE1BQUssWUFBekMsRUFBc0QsYUFBWSxhQUFsRSxHQUxGO0FBTUU7QUFBQTtBQUFBLFlBQVEsU0FBUyxNQUFNLFFBQXZCO0FBQUE7QUFBQSxTQU5GO0FBT0U7QUFBQTtBQUFBLFlBQVEsU0FBUyxNQUFNLFNBQXZCO0FBQUE7QUFBQTtBQVBGO0FBREY7QUFIYTtBQUFBLENBQWY7O0FBZ0JBLE9BQU8sUUFBUCxHQUFrQixRQUFsQiIsImZpbGUiOiJBZGRNb3ZpZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBBZGRNb3ZpZSA9IChwcm9wcykgPT4gKFxuICAvL3VzaW5nIHJhdGluZyBhcyBhIHRleHQsIGFzIG51bWJlciB3aWxsIGhhdmVcbiAgLy9kcmFnIG1lbnVcbiAgPGRpdiBjbGFzc05hbWU9J2FkZE1vdmllJz5cbiAgICA8ZGl2IGNsYXNzTmFtZT0nYWRkTW92aWVJbnB1dCc+XG4gICAgICA8aW5wdXQgdHlwZT0ndGV4dCcgaWQ9J2FkZE1vdmllSW5wdXRUaXRsZScgbmFtZT0nYWRkTW92aWVJbnB1dCcgcGxhY2Vob2xkZXI9J21vdmllIHRpdGxlJy8+XG4gICAgICA8aW5wdXQgdHlwZT0ndGV4dCcgaWQ9J2FkZE1vdmllSW5wdXRHZW5yZScgbmFtZT0nYWRkTW92aWVJbnB1dCcgcGxhY2Vob2xkZXI9J21vdmllIGdlbnJlJy8+XG4gICAgICA8aW5wdXQgdHlwZT0ndGV4dCcgaWQ9J2FkZE1vdmllSW5wdXRQb3N0ZXInIG5hbWU9J2FkZE1vdmllSW5wdXQnIHBsYWNlaG9sZGVyPSdtb3ZpZSBwb3N0ZXJVUkwnLz5cbiAgICAgIDxpbnB1dCB0eXBlPSd0ZXh0JyBpZD0nYWRkTW92aWVJbnB1dERhdGUnIG5hbWU9J2FkZE1vdmllSW5wdXQnIHBsYWNlaG9sZGVyPSdtb3ZpZSByZWxlYXNlIGRhdGUnLz5cbiAgICAgIDxpbnB1dCB0eXBlPSd0ZXh0JyBpZD0ncmF0aW5nU2NvcmUnIG5hbWU9J21vdmllVGl0bGUnIHBsYWNlaG9sZGVyPSd5b3VyIHJhdGluZycvPlxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtwcm9wcy5hZGRNb3ZpZX0+IGFkZCBtb3ZpZSA8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gb25DbGljaz17cHJvcHMucmF0ZU1vdmllfT4gcmF0ZSBtb3ZpZSA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4pXG5cbndpbmRvdy5BZGRNb3ZpZSA9IEFkZE1vdmllO1xuIl19