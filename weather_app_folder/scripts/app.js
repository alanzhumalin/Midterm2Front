const apiKey = '8ef010ef3d0d242136943787a5c3eaf6';
let isCelsius = true; // Initialize a variable to store the temperature unit state (Celsius by default)

// Event listener for input changes to fetch city suggestions
document.getElementById('cityInput').addEventListener('input', fetchCitySuggestions);
// Event listener for input change to fetch weather data when a city is selected
document.getElementById('cityInput').addEventListener('change', (e) => fetchWeather(e.target.value));
// Event listener for geolocation button click to fetch weather by current location
document.getElementById('geoButton').addEventListener('click', fetchWeatherByGeolocation);
// Event listener to toggle temperature units (Celsius/Fahrenheit)
document.getElementById('unitToggle').addEventListener('click', toggleUnits);

// Toggle the temperature unit and fetch updated weather data
function toggleUnits() {
    isCelsius = !isCelsius; // Switch the unit state
    const city = document.getElementById('cityInput').value; // Get the current city input
    if (city) fetchWeather(city); // Fetch weather in the new unit if a city is selected
}

// Fetch city suggestions based on input
async function fetchCitySuggestions(e) {
    const input = e.target.value.toLowerCase(); // Get user input in lowercase
    if (input.length < 1) return; // Only fetch suggestions if input length is sufficient

    // API request to find cities matching the input
    const url = `https://api.openweathermap.org/data/2.5/find?q=${input}&type=like&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Filter results for exact matches on city names
    const filteredCities = data.list.filter(city => city.name.toLowerCase().includes(input));
    
    displaySuggestions(filteredCities); // Show filtered city suggestions
}

// Display city suggestions under the input field
function displaySuggestions(cities) {
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = ''; // Clear previous suggestions
    
    // If no cities are found, display a message
    if (cities.length === 0) {
        const noResults = document.createElement('div');
        noResults.innerText = 'No cities found';
        suggestions.appendChild(noResults);
    }
    
    // For each city, create a suggestion div
    cities.forEach(city => {
        const suggestion = document.createElement('div');
        suggestion.innerText = city.name;
        suggestion.onclick = () => { // When clicked, update input and fetch weather
            document.getElementById('cityInput').value = city.name;
            fetchWeather(city.name);
            suggestions.innerHTML = ''; // Clear suggestions after selection
        };
        suggestions.appendChild(suggestion);
    });
}

// Fetch weather data for a specified city
async function fetchWeather(city) {
    const unit = isCelsius ? 'metric' : 'imperial'; // Determine unit based on state
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    displayCurrentWeather(data); // Display current weather details
    fetchForecast(data.coord.lat, data.coord.lon); // Fetch forecast using coordinates

    const mainContent = document.querySelector('.main__content');
    mainContent.style.height = 'auto'; // Adjust content height if needed
}

// Display current weather data in the main content
function displayCurrentWeather(data) {
    document.getElementById('currentWeather').innerHTML = `
        <h2 style = "font-size: 20px">${data.name}</h2>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
        <p>Temperature: ${data.main.temp}°${isCelsius ? 'C' : 'F'}</p>
        <p>Condition: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} ${isCelsius ? 'm/s' : 'mph'}</p>
    `;
}

// Fetch forecast data based on latitude and longitude
async function fetchForecast(lat, lon) {
    const unit = isCelsius ? 'metric' : 'imperial'; // Use selected unit for the forecast
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    displayForecast(data.list); // Display forecast data
}

// Display forecast data for the next few days
function displayForecast(data) {
    const forecastSection = document.getElementById('forecast');
    forecastSection.innerHTML = ''; // Clear previous forecast data
    
    // Filter to show only data from noon (to represent daily weather)
    const dailyData = data.filter(entry => entry.dt_txt.includes("12:00:00"));
    
    dailyData.slice(0, 5).forEach(day => { // Display forecast for the next 5 days
        const dayEl = document.createElement('div');
        dayEl.className = 'forecast-day';
        
        dayEl.innerHTML = `
            <p>${new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'long' })}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
            <p>High: ${day.main.temp_max}°${isCelsius ? 'C' : 'F'}</p>
            <p>Low: ${day.main.temp_min}°${isCelsius ? 'C' : 'F'}</p>
            <p>${day.weather[0].description}</p>
        `;
        forecastSection.appendChild(dayEl); // Append each day’s forecast to the section
    });

    const mainContent = document.querySelector('.main__content');
    mainContent.style.height = 'auto'; // Adjust content height for forecast
}

// Fetch weather data for the user's current location
function fetchWeatherByGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherForLocation(latitude, longitude); // Use location coordinates
        });
    } else {
        alert("Geolocation is not supported by this browser."); // Alert if not supported
    }
}

// Fetch weather using latitude and longitude and display it
async function fetchWeatherForLocation(lat, lon) {
    const unit = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    const cityInput = document.getElementById('cityInput');
    cityInput.value = data.name; // Update input field with city name

    displayCurrentWeather(data); // Show current weather for location
    fetchForecast(lat, lon); // Fetch and display forecast for location

    const mainContent = document.querySelector('.main__content');
    mainContent.style.height = 'auto'; // Adjust content height
}
