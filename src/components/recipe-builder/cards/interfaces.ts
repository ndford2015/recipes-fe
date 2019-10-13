import { IIngredient, IRecipe } from "../../../api/interfaces";

export interface IIngredientsContainerProps {
    ingredients: IIngredient[];
    isLoading?: boolean;
    headerText?: string;
    // specify whether to have 'larger' cards
    large?: boolean;
    selectIngredient(ingredient: string): void;
}

export interface IRecipesContainerProps {
    isLoading?: boolean;
    recipes: IRecipe[];
}
