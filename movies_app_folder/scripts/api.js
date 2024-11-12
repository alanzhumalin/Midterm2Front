// My API
const apiKey = '224f91c60c535266d682bee21dbd4bfb';
// The url of the API
const apiUrl = 'https://api.themoviedb.org/3/';

// Async function to fetch movies based on the user's typed text
async function fetchMovies(searchQuery) {
    // Construct the full endpoint URL with the search query and API key
    const endpoint = `${apiUrl}search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}`;

    // Fetching  data from the url of the API
    const response = await fetch(endpoint);

    // Parsing the data as JSON and return it
    return response.json();
}

// Async function to fetch details of a selected movie by its primary ID
async function fetchMovieDetails(movieId) {
    // Construct the full endpoint URL with the movie ID and API key
    const endpoint = `${apiUrl}movie/${movieId}?api_key=${apiKey}`;

    // Fetching  data from the url of the API
    const response = await fetch(endpoint);

    // Parsing the data as JSON and return it
    return response.json();
}
