(function() {
    'use strict';
    const $search = $('button')
    const movies = [];

    const renderMovies = function() {
      $('#listings').empty();

      for (const movie of movies) {
        const $col = $('<div>').addClass('col s6');
        const $card = $('<div>').addClass('card hoverable');
        const $content = $('<div>').addClass('card-content center');
        const $title = $('<h6>').addClass('card-title truncate');

        $title.attr({
          'data-position': 'top',
          'data-tooltip': movie.title
        });

        $title.tooltip({
          delay: 50
        }).text(movie.title);

        const $poster = $('<img>').addClass('poster');

        $poster.attr({
          src: movie.poster,
          alt: `${movie.poster} Poster`
        });

        $content.append($title, $poster);
        $card.append($content);

        const $action = $('<div>').addClass('card-action center');
        const $plot = $('<a>');

        $plot.addClass('waves-effect waves-light btn modal-trigger');
        $plot.attr('href', `#${movie.id}`);
        $plot.text('Plot Synopsis');

        $action.append($plot);
        $card.append($action);

        const $modal = $('<div>').addClass('modal').attr('id', movie.id);
        const $modalContent = $('<div>').addClass('modal-content');
        const $modalHeader = $('<h4>').text(movie.title);
        const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
        const $modalText = $('<p>').text(movie.plot);

        $modalContent.append($modalHeader, $movieYear, $modalText);
        $modal.append($modalContent);

        $col.append($card, $modal);

        $('#listings').append($col);

        $('.modal-trigger').leanModal();
      }
    };
    $search.click(function(event) {
        event.preventDefault();
        movies.splice(0, movies.length);
        const text = $('#search').val();
        const searchText = 'http://omdbapi.com/?s=' + text.replace(' ', '%20');
        $.getJSON(searchText, function(data) {
            data.Search.map(function(element) {
              let movie = {
                id: element.imdbID,
                poster: element.Poster,
                title: element.Title,
                year: element.Year,
                plot: 'plot'
              };
              movies.push(movie);
            });

            for (let i = 0; i < movies.length; i++) {
              let movieID = movies[i].id;
              let searchID = 'http://www.omdbapi.com/?i=' + movieID + '&plot=full';
              $.getJSON(searchID, function(data) {
                  movies[i].plot = data.Plot;
                  renderMovies();
                });
            }
        });
    });

})();
