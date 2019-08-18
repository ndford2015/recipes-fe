export interface IIngredientResponse {
    ingredients: IIngredient[],
    recipeIds: string[]
}

export interface IIngredient {
    name: string;
}

export interface IRecipe {
    id: string, 
    name: string, 
    url: string,
    description: string
}
