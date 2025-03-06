import request from "supertest";
import { handler } from "../netlify/functions/api.js";

describe("Recipe API", () => {
    test("Should return Recipe data when given query parameters.", async () => {
        const preferences = JSON.stringify({
             cuisine: 'American',
             diet: [],
             intolerances: [],
             ingredients: ['Lettuce'] 
        });
        const res = await request(handler).get(`/recipe?preferences=${preferences}`);
        console.log(res.statusCode);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("results");
    });

    test("Should return an error if preferences are missing", async () => {
        const res = await request(handler).get(`/recipe`);
        console.log(res.statusCode);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid Recipe Parameters");
    });
})