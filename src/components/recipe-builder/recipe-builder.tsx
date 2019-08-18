import React from 'react';
import { Card, Container, Header, Label, Icon } from 'semantic-ui-react';
import { IRecipeBuilderState, IRecipeBuilderProps } from './interfaces';
import { STYLE_OPTIONS, BASE_OPTIONS } from './constants';
import { autobind } from 'core-decorators'
import { IIngredientResponse, IIngredient, IRecipe } from '../../api/interfaces';
import { getRelatedIngredients, getRecipesByIds } from '../../api';
import './recipe-builder.css';
import { IngredientsContainer } from './cards/ingredient-cards';
import { RecipesContainer } from './cards/recipe-cards';
export class RecipeBuilder extends React.PureComponent<IRecipeBuilderProps, IRecipeBuilderState> {
  constructor(props:IRecipeBuilderProps) {
    super(props);
    this.state = {
      selectedIngredients: [],
      ingredientChoices: [],
      highlightedRecipes: [],
      recipeChoices: [],
      selectedBase: '',
      selectedMealStyle: '',
      isLoading: false,
    }
  }

  @autobind
  public setStyle(style: string): void {
    this.setState({selectedMealStyle: style})
  }

  @autobind
  public async setBase(base: string): Promise<void> {
    this.setState({selectedBase: base}, () => this.selectIngredient(base));
  }

  @autobind async selectIngredient(ingredient: string): Promise<void> {
    const selectedIngredients: string[] = [...this.state.selectedIngredients, ingredient]; 
    this.setState({selectedIngredients});
    this.reloadRelatedIngredients(selectedIngredients);
    window.scrollTo(0, 0);
  }
  
  @autobind
  public getBaseOptions(): JSX.Element[] {
    return BASE_OPTIONS[this.state.selectedMealStyle].map((option: IIngredient) => {
      const onClick: () => void = () => this.setBase(option.name);
      return <Card centered onClick={onClick} content={option}/>
    })
  }

  @autobind 
  public async getRecipeHighlights() {
    const selectedChoices: string[] = this.state.recipeChoices.length <= 5 ? this.state.recipeChoices : this.state.recipeChoices.slice(0,2);
    const highlightedRecipes: IRecipe[] = await getRecipesByIds(selectedChoices);
    this.setState({highlightedRecipes, isLoading: false});
  }

  @autobind
  public getIngredientCards(): JSX.Element[] {
    return this.state.ingredientChoices.map((ingredient: IIngredient) => {
      const onClick: () => void = () => this.selectIngredient(ingredient.name);
      return <Card centered onClick={onClick} content={ingredient.name}/>
    })
  }


  @autobind
  public getSelectedIngredientLabels(): JSX.Element[] {
    return this.state.selectedIngredients.map((ingr: string, index: number) => {
      const onClick: () => void = () => this.removeIngredient(index);
      return <Label>{ingr}<Icon name='delete' onClick={onClick}/></Label>
    })
  }

  @autobind 
  public async reloadRelatedIngredients(selectedIngredients: string[]): Promise<void> {
    this.setState({isLoading: true});
    const relatedIngredientResponse: IIngredientResponse = await getRelatedIngredients(selectedIngredients);
    this.setState(
      {
        ingredientChoices: relatedIngredientResponse.ingredients,
        recipeChoices: relatedIngredientResponse.recipeIds
      },
      () => this.getRecipeHighlights()
    )
  }

  @autobind
  public removeIngredient(removeIndex: number): void {
    this.setState({selectedIngredients: this.state.selectedIngredients.filter((_, i: number) => i !== removeIndex)}, async () => {
      if (!this.state.selectedIngredients.length) {
        this.clearSelection();
      } else {
        this.reloadRelatedIngredients(this.state.selectedIngredients);
      }
    });
  }

  @autobind
  public clearSelection() {
    this.setState({
      selectedBase: '',
      selectedMealStyle: ''
    })
  }

  public render(): JSX.Element {
    return (
    <Container>
      <Header centered size={"large"}>Recipe Builder</Header>
      {this.state.selectedIngredients.length > 0 && <div>{`Selected Ingredients: `}{this.getSelectedIngredientLabels()}</div>}
     {!(this.state.selectedBase || this.state.selectedMealStyle) && 
        <IngredientsContainer selectIngredient={this.setStyle} ingredients={STYLE_OPTIONS} />}
      {(this.state.selectedMealStyle && !this.state.selectedBase) && 
        <IngredientsContainer selectIngredient={this.setBase} ingredients={BASE_OPTIONS[this.state.selectedMealStyle]} />}
      {(this.state.selectedMealStyle && this.state.selectedBase) && 
        <RecipesContainer isLoading={this.state.isLoading} recipes={this.state.highlightedRecipes}/>}
      {(this.state.selectedMealStyle && this.state.selectedBase && this.state.recipeChoices.length > 5) && 
        <IngredientsContainer isLoading={this.state.isLoading} prelimsSelected selectIngredient={this.selectIngredient} ingredients={this.state.ingredientChoices} />}
    </Container>
  );
  }
}
