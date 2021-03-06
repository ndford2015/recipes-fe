import { IBaseOptions } from "./interfaces";
import { IIngredient } from "../../api/interfaces";

// TODO: add vegetarian support
export const STYLE_VEGETARIAN: string = "vegetarian";
export const STYLE_MEAT: string = "meat";
export const STYLE_FISH: string = "fish";
export const STYLE_OPTIONS: IIngredient[] = [{name: STYLE_FISH}, {name: STYLE_MEAT}];

export const BASE_OPTIONS: IBaseOptions = {
    [STYLE_MEAT]: [{name: 'Chicken'}, {name: 'Steak'}, {name: 'Pork'}],
    [STYLE_FISH]: [{name: 'Scallops'}, {name: 'Oysters'}, {name: 'Blue Fish'}],
    [STYLE_VEGETARIAN]: [{name: 'Tofu'}, {name: 'Lentils'}, {name: 'Pinto Beans'}]
}

export const CHOOSE_MEAL_STYLE: string = 'Start by choosing a meal style!';
export const CHOOSE_MEAL_BASE: string = 'Now choose a base!';
export const SELECT_INGREDIENTS: string = 'Select some Ingredients!';

export enum SELECTION_STEP {
    CHOOSE_BASE,
    CHOOSE_CUISINE_STYLE,
    SELECT_INGREDIENTS
}

export enum TAB_ID {
    RECIPE_BUILDER = 'Cupboard Creations',
    INGREDIENT_SELECTOR = 'Ingredient Selector'
}