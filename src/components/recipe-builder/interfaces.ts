import { IIngredient, IRecipe } from "../../api/interfaces";

export interface IRecipeBuilderState {
    selectedIngredients: string[];
    ingredientChoices: IIngredient[];
    recipeChoices: string[];
    highlightedRecipes: IRecipe[];
    selectedBase: string;
    selectedMealStyle: string;
    isLoading: boolean;
}

export interface IRecipeBuilderProps {
}

export interface IBaseOptions {
    [baseName: string]: IIngredient[]
}

export interface ISelectedIngredientsProps {
    selectedIngredients: string[];
    removeIngredient(ingredientIndex: number): void;
}