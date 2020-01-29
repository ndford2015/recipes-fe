import { IIngredient, IRecipe } from "../../../api/interfaces";
import { SearchProps } from "semantic-ui-react";
import { ChangeEvent } from "react";

export interface IIngredientsContainerProps {
    ingredients: IIngredient[];
    isLoading?: boolean;
    headerText?: string;
    // specify whether to have 'larger' cards
    large?: boolean;
    searchValue?: string | undefined;
    selectedIngredients: string[];
    removeIngredient(ingredientIndex: number): void;
    onSearch?(event: ChangeEvent<HTMLInputElement>): void;
    selectIngredient(ingredient: string): void;
}

export interface IRecipesContainerProps {
    isLoading?: boolean;
    recipes: IRecipe[];
}
