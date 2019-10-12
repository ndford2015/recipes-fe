import { IIngredient, IRecipe } from "../../api/interfaces";
import { SELECTION_STEP } from "./constants";

export interface IRecipeBuilderState {
    selectedIngredients: string[];
    ingredientChoices: IIngredient[];
    recipeChoices: string[];
    highlightedRecipes: IRecipe[];
    selectedMealStyle: string;
    selectionStep: SELECTION_STEP;
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