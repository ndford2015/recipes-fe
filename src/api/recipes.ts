
import { BASE_URL } from "./constants";
import { formatIntoQueryString } from "./utils";
import { IRecipe } from "./interfaces";

export function getRecipesByIds(ids: string[]): Promise<IRecipe[]> {
    const url: string = `${BASE_URL}/recipes/${formatIntoQueryString(ids, "id")}`
    return fetch(url).then((response) => response.json());
}

export function getRandomRecipes(numRecipes: number): Promise<IRecipe[]> {
    const url: string = `${BASE_URL}/recipes/?numRecipes=${numRecipes}`;
    return fetch(url).then((response) => response.json());
}