import { IIngredient, IRecipe } from "../../../api/interfaces";

export interface IIngredientsContainerProps {
    ingredients: IIngredient[];
    prelimsSelected?: boolean;
    isLoading?: boolean;
    headerText?: string;
    selectIngredient(ingredient: string): void;
}

export interface IRecipesContainerProps {
    isLoading?: boolean;
    recipes: IRecipe[];
}
