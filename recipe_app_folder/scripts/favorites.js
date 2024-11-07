// This is the key to use the Spoonacular API
const apiKey = 'd320d175cc0f4564a5f526f1985fb144'; 
const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}`;

// This function gets information about a recipe using the recipe's ID.
async function fetchRecipeDetails(recipeId) {
    // We send a request to the API to get the recipe details
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
    const data = await response.json(); // Turn the response into a JSON object
    console.log('Data: ' + data); // Print the recipe information to the console
    return data; // Return the recipe information
}

// This function shows the list of favorite recipes saved in the browser.
async function loadFavorites() {
    const container = document.getElementById('recipe-results'); // The place where we will show the recipes
    const mainText = document.getElementById('main__text'); // The place to show a message if there are no favorites
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Get the favorites from storage, or empty array if none

    // Check if there are any favorites
    if (favorites.length === 0) {
        mainText.style.display = 'block'; // Show the message
        mainText.innerHTML = '<p>No favorites added yet!</p>'; // Show a message when there are no favorites
        container.innerHTML = ''; 
    } else {
        mainText.style.display = 'none'; // Hide the message if there are favorites

        // Get the details of each favorite recipe
        const recipes = await Promise.all(favorites.map(id => fetchRecipeDetails(id)));
        displayFavorites(recipes, container); // Show the recipes on the page
    }
}

// This function shows the recipes on the page.
function displayFavorites(recipes, container) {
    console.log('Recipes: ' + recipes); // Print the list of recipes
    console.log('Container: ' + container); // Print the container where we show the recipes

    // Create HTML for each recipe and show it in the container
    container.innerHTML = recipes.map(recipe => `
        <div class="recipe-card" onclick="showRecipeDetails(${recipe.id})">
            <img src="${recipe.image}" alt="${recipe.title}"> <!-- Show recipe image -->
            <h3>${recipe.title}</h3> <!-- Show recipe title -->
            <p>Ready in ${recipe.readyInMinutes} minutes</p> <!-- Show time to cook -->
            <!-- Button to remove recipe from favorites -->
            <button onclick="removeFromFavorites(${recipe.id})">Remove from Favorites</button>
        </div>
    `).join(''); // Join all recipes into one HTML string
}

// This function removes a recipe from the favorites list.
function removeFromFavorites(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Get the current favorites
    favorites = favorites.filter(id => id !== recipeId); // Remove the recipe with this ID
    localStorage.setItem('favorites', JSON.stringify(favorites)); // Save the updated favorites back to storage
    loadFavorites(); // Reload favorites to show the updated list
}

// Wait until the page is loaded, then run the loadFavorites function.
document.addEventListener('DOMContentLoaded', loadFavorites);
