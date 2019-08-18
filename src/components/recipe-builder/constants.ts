import { IBaseOptions } from "./interfaces";
import { IIngredient } from "../../api/interfaces";

export const STYLE_VEGETARIAN: string = "vegetarian";
export const STYLE_MEAT: string = "meat";
export const STYLE_FISH: string = "fish";
export const STYLE_OPTIONS: IIngredient[] = [{name: STYLE_FISH}, {name: STYLE_MEAT}, {name: STYLE_VEGETARIAN}];

export const BASE_OPTIONS: IBaseOptions = {
    [STYLE_MEAT]: [{name: 'Chicken'}, {name: 'Steak'}, {name: 'Pork'}],
    [STYLE_FISH]: [{name: 'Scallops'}, {name: 'Oysters'}, {name: 'Blue Fish'}],
    [STYLE_VEGETARIAN]: [{name: 'Tofu'}, {name: 'Lentils'}, {name: 'Pinto Beans'}]
}