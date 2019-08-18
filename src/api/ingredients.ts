import { BASE_URL } from "./constants";
import { IIngredientResponse, IIngredient } from "./interfaces";
import { formatIntoQueryString } from "./utils";

export function getRelatedIngredients(selectedIngredients: string[]): Promise<IIngredientResponse> {
    const url: string = `${BASE_URL}/ingredients/related/${formatIntoQueryString(selectedIngredients, 'name')}` 
    return fetch(url).then((response) => response.json());
}

export function getTopIngredients(): Promise<IIngredient[]> {
    const url: string = `${BASE_URL}/ingredients/top/`;
    return fetch(url).then((response) => response.json());
}