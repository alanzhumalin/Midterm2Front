const apiKey = '224f91c60c535266d682bee21dbd4bfb';

const apiUrl = 'https://api.themoviedb.org/3/';

// Function to fetch movies based on the user's search query
async function fetchMovies(searchQuery) {
    // Construct the full endpoint URL with the search query and API key
    const endpoint = `${apiUrl}search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}`;

    // Fetch the data from the API
    const response = await fetch(endpoint);

    // Parse the response as JSON and return it
    return response.json();
}

// Function to fetch details of a specific movie by its ID
async function fetchMovieDetails(movieId) {
    // Construct the full endpoint URL with the movie ID and API key
    const endpoint = `${apiUrl}movie/${movieId}?api_key=${apiKey}`;

    // Fetch the data from the API
    const response = await fetch(endpoint);

    // Parse the response as JSON and return it
    return response.json();
}
