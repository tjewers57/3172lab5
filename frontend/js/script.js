// Handles communication with the backend API and displaying Recipe results.
const handleForm = async (recipePreferences) => {
    try {
        // fetch from the backend API with the user's recipe preferences.
        const preferences = JSON.stringify(recipePreferences);    
        const response = await fetch(`/api/recipe?preferences=${preferences}`);
        const data = await response.json();

        // clear the recipe container before adding new recipes.
        const recipeContainer = document.getElementById('recipeContainer');
        recipeContainer.innerHTML = '';

        // if no recipes were found with the user's selected preferences, return a message letting them know.
        if(data.results.length === 0){
            const emptyMsg = document.createElement('h2');
            emptyMsg.innerText = "Sorry! No Recipes found with the given preferences.";
            recipeContainer.append(emptyMsg);
        }

        // create a container for each recipe returned from the API, with the recipe name and image.
        for(const recipe of data.results){
            const newRecipe = document.createElement('div');
            newRecipe.setAttribute('class', 'recipe');
            const recipeImage = document.createElement('img');
            recipeImage.setAttribute('src', recipe.image);
            recipeImage.setAttribute('alt', recipe.title);
            const recipeTitle = document.createElement('h3');
            recipeTitle.innerText = recipe.title;

            newRecipe.append(recipeImage);
            newRecipe.append(recipeTitle);
            recipeContainer.append(newRecipe);
        }
    } catch (error) {
        console.log(error);
    }
}

// handles the adding of individual ingredients to the ingredients list.
const addIngredient = (ingredient) => {
    const ingredientContainer = document.getElementById('ingredientContainer');
    const ingredientItem = document.createElement('li');
    ingredientItem.innerText = ingredient;

    // users can delete ingredients from the list after they've added them.
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Remove Ingredient';
    deleteButton.addEventListener('click', (event) => {
        event.target.parentNode.remove();
    })
    deleteButton.setAttribute('class', 'removeIngredient');

    ingredientItem.append(deleteButton);
    ingredientContainer.append(ingredientItem);
}

// event listener for the recipe form.
document.getElementById('recipeForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const cuisine = document.getElementById('cuisine').value;
    const diet = Array.from(document.getElementById('diet').selectedOptions).map(({ value }) => value);
    const intolerances = Array.from(document.getElementById('intolerances').selectedOptions).map(({ value }) => value);
    const ingredients = Array.from(document.getElementById('ingredientContainer').getElementsByTagName("li"))
    .map(({ innerText }) => innerText.replace('Remove Ingredient', '')); // innerText grabs the text of all descendants, so we need to remove the text from the remove button.

    const preferences = {
        cuisine: cuisine,
        diet: diet,
        intolerances: intolerances,
        ingredients: ingredients
    }
    handleForm(preferences);
});

// event listener for the add ingredient button.
document.getElementById('addIngredient').addEventListener('click', (event) => {
    event.preventDefault();
    const ingredient = document.getElementById('ingredients')
    if(!ingredient.value) {
        return;
    }
    addIngredient(ingredient.value);
    ingredient.value = '';
});

// this snippet is sourced from https://codepen.io/gmkhussain/pen/ozwwPw
// this allows clicking multiple items in an html select (with the multiple property set) without needing to hold the 'ctrl' key.
const multiSelectWithoutCtrl = () => {
    let options = [].slice.call(document.querySelectorAll(`option`));
    options.forEach(function (element) {
        element.addEventListener("mousedown", 
            function (e) {
                e.preventDefault();
                element.parentElement.focus();
                this.selected = !this.selected;
                return false;
            }, false );
    });
  }
  
  multiSelectWithoutCtrl();