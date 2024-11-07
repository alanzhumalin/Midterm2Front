// Event listener for user input in the search box
document.getElementById('searchBox').addEventListener('input', async (event) => {
    const searchQuery = event.target.value;

    // Only fetch movies if the search query length is greater than 2 characters
    if (searchQuery.length > 2) {
        const movies = await fetchMovies(searchQuery);
        displayMovies(movies.results);
    }
});

// Event listener for sorting options change
document.getElementById('sortOptions').addEventListener('change', async () => {
    const searchQuery = document.getElementById('searchBox').value;

    // Only fetch movies if the search query length is greater than 2 characters
    if (searchQuery.length > 2) {
        const movies = await fetchMovies(searchQuery);
        const sortedMovies = sortMovies(movies.results); // Sort movies based on selected option
        displayMovies(sortedMovies);
    }
});

// Function to sort movies based on the selected sorting option
function sortMovies(movies) {
    const sortOption = document.getElementById('sortOptions').value;

    // Sorting logic based on the selected option
    if (sortOption === "popularity.desc") {
        return movies.sort((a, b) => b.popularity - a.popularity);
    } else if (sortOption === "release_date.desc") {
        return movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (sortOption === "vote_average.desc") {
        return movies.sort((a, b) => b.vote_average - a.vote_average);
    }

    return movies; // Return unsorted movies if no sorting option matched
}

// Function to display the movies on the page
function displayMovies(movies) {
    const grid = document.getElementById('moviesGrid');

    // Display message if no movies are found
    if (movies.length === 0) {
        grid.innerHTML = "<p>No movies found. Try a different search.</p>";
        return;
    }

    // Generate HTML for each movie and display in the grid
    const movieElements = movies.map(movie => {
        const posterPath = movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : 'path/to/placeholder-image.jpg'; 

        return `
            <div class="movie" onclick="showMovieDetails(${movie.id})">
                <img src="${posterPath}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>Released: ${movie.release_date}</p>
                <button onclick="addToWatchlist(event, ${movie.id}, '${movie.title}', '${movie.poster_path}')">
                    Add to Watchlist
                </button>
            </div>
        `;
    }).join('');
    
    grid.innerHTML = movieElements; // Inject movie elements into the grid
}

// Function to show detailed movie information in a modal
async function showMovieDetails(movieId) {
    const movieDetails = await fetchMovieDetails(movieId);
    const modal = document.getElementById('movieModal');
    
    // Populate the modal with the movie details
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>${movieDetails.title}</h2>
            <p><strong>Rating:</strong> ${movieDetails.vote_average} / 10</p>
            <p><strong>Runtime:</strong> ${movieDetails.runtime} minutes</p>
            <p><strong>Synopsis:</strong> ${movieDetails.overview}</p>
        </div>
    `;
    
    modal.style.display = 'block'; // Show the modal
}

// Function to close the movie details modal
function closeModal() {
    document.getElementById('movieModal').style.display = 'none';
}

// Function to handle movie selection from suggestions
function selectMovie(movieId) {
    showMovieDetails(movieId);
    document.getElementById('suggestions').style.display = 'none'; // Hide suggestions after selection
}

// Function to add a movie to the watchlist
function addToWatchlist(event, movieId, title, posterPath) {
    event.stopPropagation(); // Prevent triggering other click events

    // Retrieve the current watchlist from localStorage or initialize an empty array
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    
    // Add the movie to the watchlist if it isn't already in it
    if (!watchlist.some(movie => movie.id === movieId)) {
        watchlist.push({ id: movieId, title, posterPath });
        localStorage.setItem('watchlist', JSON.stringify(watchlist)); // Save the updated watchlist to localStorage
        displayWatchlist(); // Refresh the watchlist display
        alert(`${title} has been added to your watchlist!`);
    } else {
        alert(`${title} is already in your watchlist.`);
    }
}

// Function to display the watchlist
function displayWatchlist() {
    const watchlistContainer = document.getElementById('watchlist');
    
    // Retrieve the current watchlist from localStorage or initialize an empty array
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    // Display a message if the watchlist is empty
    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = "<p>Your watchlist is empty.</p>";
        return;
    }

    // Generate HTML for each movie in the watchlist
    watchlistContainer.innerHTML = watchlist.map(movie => `
        <div class="movie">
            <img src="https://image.tmdb.org/t/p/w200${movie.posterPath}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="removeFromWatchlist(${movie.id})">Remove</button>
        </div>
    `).join('');
}

// Function to remove a movie from the watchlist
function removeFromWatchlist(movieId) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    
    // Remove the selected movie from the watchlist
    watchlist = watchlist.filter(movie => movie.id !== movieId);
    
    // Save the updated watchlist back to localStorage
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    
    // Refresh the watchlist display
    displayWatchlist();
}

// Initialize the watchlist display when the page loads
displayWatchlist();

// Event listener to close the modal when clicked outside
window.onclick = function(event) {
    const modal = document.getElementById('movieModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Event listener for input in the search box to display suggestions
document.getElementById('searchBox').addEventListener('input', async (event) => {
    const searchQuery = event.target.value;
    const suggestionsBox = document.getElementById('suggestions');
    
    // Clear previous suggestions and hide the suggestions box
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';

    // Fetch and display movie suggestions if the search query length is greater than 2
    if (searchQuery.length > 2) {
        const movies = await fetchMovies(searchQuery);
        
        // Get top 5 movie suggestions
        const filteredMovies = movies.results.slice(0, 5);
        
        filteredMovies.forEach(movie => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.textContent = movie.title;
            
            // Add event listener to select movie when clicked
            suggestionItem.addEventListener('click', () => {
                document.getElementById('searchBox').value = movie.title; 
                suggestionsBox.innerHTML = ''; // Clear suggestions
                suggestionsBox.style.display = 'none'; // Hide suggestions box
                displayMovies([movie]); // Display selected movie
            });

            suggestionsBox.appendChild(suggestionItem); // Add suggestion item to the suggestions box
        });

        // Show the suggestions box if there are suggestions
        if (filteredMovies.length > 0) {
            suggestionsBox.style.display = 'block';
        }
    }
});

// Function to fetch movies based on a search query
async function fetchMovies(query) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${apiKey}`);
    const data = await response.json();
    return data;
}

// Event listener to hide suggestions when clicking outside the search box or suggestions box
const searchBox = document.getElementById('searchBox');
const suggestions = document.getElementById('suggestions');
const buttons = document.querySelectorAll('button'); 

document.addEventListener('click', function(event) {
    if (!searchBox.contains(event.target) && !suggestions.contains(event.target) && !Array.from(buttons).includes(event.target)) {
        suggestions.style.display = 'none'; // Hide suggestions if clicked outside
    }
});

// Event listener to show suggestions box when typing in the search box
searchBox.addEventListener('input', function() {
    suggestions.style.display = 'block'; // Show suggestions when typing
});
