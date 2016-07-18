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

window.searchMovie = searchMovie