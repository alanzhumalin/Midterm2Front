const apiKey = 'd320d175cc0f4564a5f526f1985fb144';  // This is our API key
const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}`;  // This is the URL to search for recipes

// This function will fetch recipes based on the search query
async function fetchRecipes(query) {
    const response = await fetch(`${apiUrl}&query=${query}&addRecipeInformation=true&number=10`);  // Fetch recipes from the API
    const data = await response.json();  // Get data from the response
    console.log('Fetched recipes:', data);  // Show data in the console
    return data.results;  // Return the list of recipes
}

// This function will fetch details of a specific recipe by its ID
async function fetchRecipeDetails(recipeId) {
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);  // Fetch recipe details
    const data = await response.json();  // Get data from the response
    return data;  // Return the recipe details
}

// Listen for typing in the search input field
document.getElementById('search-input').addEventListener('input', async (event) => {
    const query = event.target.value;  // Get the search input value
    console.log('Search input value:', query);  // Log the search input value

    // If the query is longer than 2 characters, search for recipes
    if (query.length > 2) {
        const recipes = await fetchRecipes(query);  // Get recipes from the API
        displaySuggestions(recipes);  // Show suggestions to the user
        displayRecipes(recipes);  // Display the recipes
    } else {
        clearSuggestions();  // Clear suggestions if the input is too short
    }
});

// This function will show the suggestions based on the search query
function displaySuggestions(recipes) {
    const suggestions = document.getElementById('search-suggestions');  // Get the suggestions container
    suggestions.innerHTML = recipes.map(recipe => `
        <div class="suggestion-item" onclick="selectRecipe('${recipe.title}')">${recipe.title}</div>
    `).join('');  // Display the recipe titles as suggestions
}

// This function will clear the suggestions
function clearSuggestions() {
    document.getElementById('search-suggestions').innerHTML = '';  // Clear the suggestions container
}

// This function will select a recipe when clicked from the suggestions
function selectRecipe(title) {
    document.getElementById('search-input').value = title;  // Set the input field to the selected recipe title
    clearSuggestions();  // Clear suggestions
    fetchRecipes(title).then(recipes => {
        if (recipes && recipes.length > 0) {  // If recipes are found
            displayRecipes(recipes);  // Display the recipes
            showRecipeDetails(recipes[0].id);  // Show details of the first recipe
        }
    });
}

// This function will display the list of recipes
function displayRecipes(recipes) {
    console.log('recipes:', recipes);  // Log the recipes
    const container = document.getElementById('recipe-results');  // Get the container to display the recipes
    const mainContent = document.getElementById('main-content');  // Get the main content section

    // If there are recipes, display them
    if (recipes.length > 0) {
        container.innerHTML = recipes.map(recipe => `
            <div class="recipe-card" onclick="showRecipeDetails(${recipe.id})">
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <p>${recipe.summary || ''}</p>
                <p>Preparation time: ${recipe.readyInMinutes} mins</p>
            </div>
        `).join('');
    } else {
        mainContent.style.display = 'flex';  // Show the main content section if no recipes found
        container.innerHTML = '';  // Clear the container
    }
}

// This function will show detailed information for a specific recipe
async function showRecipeDetails(recipeId) {
    const recipe = await fetchRecipeDetails(recipeId);  // Get the details of the recipe

    console.log('Fetched recipe details:', recipe);  // Log the recipe details

    const modal = document.getElementById('recipe-modal');  // Get the modal to show the details
    modal.style.display = 'block';  // Show the modal

    // Display the recipe details in the modal
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}" />
            <h3>Ingredients</h3>
            <ul>
                ${recipe.extendedIngredients ? recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('') : '<li>No ingredients found</li>'}
            </ul>
            <h3>Instructions</h3>
            <p>${recipe.instructions || 'No instructions available.'}</p>
            <h3>Nutritional Information</h3>
            <ul>
                <li>Calories: ${recipe.nutrition ? (recipe.nutrition.nutrients.find(nut => nut.title === 'Calories') ? recipe.nutrition.nutrients.find(nut => nut.title === 'Calories').amount : 'N/A') : 'N/A'} kcal</li>
                <li>Protein: ${recipe.nutrition ? (recipe.nutrition.nutrients.find(nut => nut.title === 'Protein') ? recipe.nutrition.nutrients.find(nut => nut.title === 'Protein').amount : 'N/A') : 'N/A'} g</li>
                <li>Fat: ${recipe.nutrition ? (recipe.nutrition.nutrients.find(nut => nut.title === 'Fat') ? recipe.nutrition.nutrients.find(nut => nut.title === 'Fat').amount : 'N/A') : 'N/A'} g</li>
            </ul>
            <button onclick="addToFavorites(${recipe.id})">Add to Favorites</button>
        </div>
    `;
}

// This function will close the modal when clicked
function closeModal() {
    const modal = document.getElementById('recipe-modal');
    modal.style.display = 'none';  // Hide the modal
}

// This function will add a recipe to favorites
function addToFavorites(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];  // Get the current favorites from localStorage
    if (!favorites.includes(recipeId)) {  // If the recipe is not already in favorites
        favorites.push(recipeId);  // Add the recipe to the list
        localStorage.setItem('favorites', JSON.stringify(favorites));  // Save the updated list to localStorage
        alert('Recipe added to favorites!');  // Notify the user
    } else {
        alert('Recipe already in favorites!');  // Notify the user if the recipe is already in favorites
    }
}
