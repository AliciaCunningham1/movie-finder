const apiKey = 'f75cb9c0';

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('searchInput').value.trim();
    if (query === '') return;
    searchMovies(query);
});

function searchMovies(query) {
    fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.Search) {
                displaySearchResults(data.Search);
            } else {
                displaySearchResults(null);
            }
        })
        .catch(error => console.error('Error fetching movies:', error));
}

function displaySearchResults(movies) {
    const searchResults = document.getElementById('results');
    searchResults.innerHTML = '';

    if (movies) {
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'col';
            movieCard.innerHTML = `
                <div class="card h-100">
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" class="card-img-top" alt="${movie.Title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.Title}</h5>
                        <p class="card-text">${movie.Year}</p>
                        <button class="btn btn-success" onclick="saveToFavorites('${movie.imdbID}')">Save to Favorites</button>
                    </div>
                </div>
            `;
            searchResults.appendChild(movieCard);
        });
    } else {
        searchResults.innerHTML = `
            <div class="alert alert-warning" role="alert">
                No movies found. Try another search.
            </div>
        `;
    }
}

function saveToFavorites(imdbID) {
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(movie => {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
                favorites.push(movie);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                displayFavorites();
            }
        })
        .catch(error => console.error('Error saving favorite:', error));
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesContainer = document.getElementById('favorites');
    favoritesContainer.innerHTML = '';

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="alert alert-secondary" role="alert">
                No favorites saved yet.
            </div>
        `;
        return;
    }

    favorites.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'col';
        movieCard.innerHTML = `
            <div class="card h-100">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" class="card-img-top" alt="${movie.Title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <p class="card-text">${movie.Year}</p>
                    <button class="btn btn-danger" onclick="removeFromFavorites('${movie.imdbID}')">Remove from Favorites</button>
                </div>
            </div>
        `;
        favoritesContainer.appendChild(movieCard);
    });
}

function removeFromFavorites(imdbID) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

displayFavorites();
