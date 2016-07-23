"use strict";

var MovieDisplay = function MovieDisplay(_ref) {
  var movie = _ref.movie;
  return(
    //removed the below poster query because
    //no access to media-imdb
    //one way to have the thumbnails is to download the 
    //image into our database with the url, then serve it up
    // <img src={movie.Poster} alt=""></img>
    !movie ? React.createElement(
      "div",
      { className: "movie-display" },
      "Please search a movie"
    ) : React.createElement(
      "div",
      { className: "movie-display" },
      React.createElement(
        "h3",
        null,
        movie.Title
      ),
      React.createElement(
        "p",
        null,
        movie.Plot
      ),
      React.createElement(
        "p",
        null,
        "IMDB Rating: ",
        movie.imdbRating
      ),
      React.createElement(
        "p",
        null,
        "Rotten Tomato Rating: ",
        movie.tomatoRating
      )
    )
  );
};

window.MovieDisplay = MovieDisplay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZURpc3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGVBQWUsU0FBZixZQUFlO0FBQUEsTUFBRSxLQUFGLFFBQUUsS0FBRjtBQUFBLFFBQ2pCO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUMsS0FBRCxHQUFTO0FBQUE7QUFBQSxRQUFLLFdBQVUsZUFBZjtBQUFBO0FBQUEsS0FBVCxHQUNBO0FBQUE7QUFBQSxRQUFLLFdBQVUsZUFBZjtBQUNFO0FBQUE7QUFBQTtBQUFLLGNBQU07QUFBWCxPQURGO0FBRUU7QUFBQTtBQUFBO0FBQUksY0FBTTtBQUFWLE9BRkY7QUFHRTtBQUFBO0FBQUE7QUFBQTtBQUFpQixjQUFNO0FBQXZCLE9BSEY7QUFJRTtBQUFBO0FBQUE7QUFBQTtBQUEwQixjQUFNO0FBQWhDO0FBSkY7QUFQaUI7QUFBQSxDQUFuQjs7QUFlQSxPQUFPLFlBQVAsR0FBc0IsWUFBdEIiLCJmaWxlIjoiTW92aWVEaXNwbGF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IE1vdmllRGlzcGxheSA9ICh7bW92aWV9KSA9PiAoXG4gIC8vcmVtb3ZlZCB0aGUgYmVsb3cgcG9zdGVyIHF1ZXJ5IGJlY2F1c2VcbiAgLy9ubyBhY2Nlc3MgdG8gbWVkaWEtaW1kYlxuICAvL29uZSB3YXkgdG8gaGF2ZSB0aGUgdGh1bWJuYWlscyBpcyB0byBkb3dubG9hZCB0aGUgXG4gIC8vaW1hZ2UgaW50byBvdXIgZGF0YWJhc2Ugd2l0aCB0aGUgdXJsLCB0aGVuIHNlcnZlIGl0IHVwXG4gIC8vIDxpbWcgc3JjPXttb3ZpZS5Qb3N0ZXJ9IGFsdD1cIlwiPjwvaW1nPlxuICAhbW92aWUgPyA8ZGl2IGNsYXNzTmFtZT1cIm1vdmllLWRpc3BsYXlcIj5QbGVhc2Ugc2VhcmNoIGEgbW92aWU8L2Rpdj4gOlxuICA8ZGl2IGNsYXNzTmFtZT1cIm1vdmllLWRpc3BsYXlcIj5cbiAgICA8aDM+e21vdmllLlRpdGxlfTwvaDM+XG4gICAgPHA+e21vdmllLlBsb3R9PC9wPlxuICAgIDxwPklNREIgUmF0aW5nOiB7bW92aWUuaW1kYlJhdGluZ308L3A+XG4gICAgPHA+Um90dGVuIFRvbWF0byBSYXRpbmc6IHttb3ZpZS50b21hdG9SYXRpbmd9PC9wPlxuICA8L2Rpdj5cbik7XG5cbndpbmRvdy5Nb3ZpZURpc3BsYXkgPSBNb3ZpZURpc3BsYXk7Il19