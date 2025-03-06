import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";

dotenv.config();

// Configure express API.
const api = express();
const router = express.Router();
const API_KEY = process.env.RECIPE_API_KEY;

// Endpoint to search for recipes.
router.get('/recipe', async (req, res) => {
    res.status(200).send("hello");
    const json = req.query.preferences;
    const recipePreferences = JSON.parse(json);
    if(!recipePreferences){ // if the request body is empty, return an error/status 400.
        return res.status(400).json({ error: "Invalid Recipe Parameters" });
    }

    try {
        const cuisine = recipePreferences.cuisine;
        // combine the arrays for diet, intolerances, and ingredients, into a comma separated string (required by Spoonacular)
        const diet = recipePreferences.diet.join();
        const intolerances = recipePreferences.intolerances.join();
        const ingredients = recipePreferences.ingredients.join();

        // create a query-params string with the recipe data.
        const queryString = new URLSearchParams({
            cuisine: cuisine,
            diet: diet,
            intolerances: intolerances,
            includeIngredients: ingredients,
            apiKey: API_KEY,
            number: 15,
        });

        // fetch the Spoonacular API with the query params above.
        const response = await fetch('https://api.spoonacular.com/recipes/complexSearch?' + queryString.toString());
        const data = await response.json();

        console.log(data);

        if(response.status !== 200){
            return res.status(404).json({ error: "Error fetching recipes with given preferences" });
        }

        // return back to frontend.
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error Handling Recipe Request" });
    }
});

api.use("/api/", router);
export const handler = serverless(api);