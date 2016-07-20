var searchMovie = (options, callback) => {
  
  $.get('http://www.omdbapi.com', {
    t: options.query,
    tomatoes: true
  })
  .done((movie) => {
    if (callback) {
      callback(movie);
    }
  })
  .fail(({response}) => {
    response.error.errors.forEach((err) =>
      console.error(err)
    );
  });
};


var getRecentReleases = (options, callback) => {
  
  $.get('https://api.themoviedb.org/3/discover/movie/', options)
  .done((recentMovies) => {
    var recentMoviesParsed = recentMovies.results.map(recentMovie => {
      return movieObj = {
        title: recentMovie.title,
        genre: genres[recentMovie.genre_ids[0]],
        poster: 'https://image.tmdb.org/t/p/w185/' + recentMovie.poster_path,
        release_date: recentMovie.release_date
      }
    });


    if (callback) {
      callback(recentMoviesParsed);
    }
  })
  .fail(({response}) => {
    response.error.errors.forEach((err) =>
      console.error(err)
    );
  });
};


var genres = {
   12: "Adventure",
   14: "Fantasy",
   16: "Animation",
   18: "Drama",
   27: "Horror",
   28: "Action",
   35: "Comedy",
   36: "History",
   37: "Western",
   53: "Thriller",
   80: "Crime",
   99: "Documentary",
   878: "Science Fiction",
   9648: "Mystery",
   10402: "Music",
   10749: "Romance",
   10751: "Family",
   10752: "War",
   10769: "Foreign",
   10770: "TV Movie"
 };

window.getRecentReleases = getRecentReleases;
window.searchMovie = searchMovie

