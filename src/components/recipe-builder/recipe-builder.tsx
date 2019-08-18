import React from 'react';
import { Card, Container, Header, Label, Icon } from 'semantic-ui-react';
import { IRecipeBuilderState, IRecipeBuilderProps } from './interfaces';
import { STYLE_OPTIONS, BASE_OPTIONS, CHOOSE_MEAL_STYLE, CHOOSE_MEAL_BASE, SELECT_INGREDIENTS } from './constants';
import { autobind } from 'core-decorators'
import { IIngredientResponse, IIngredient, IRecipe } from '../../api/interfaces';
import { getRelatedIngredients, getRecipesByIds, getTopIngredients } from '../../api';
import './recipe-builder.css';
import { IngredientsContainer } from './cards/ingredient-cards';
import { RecipesContainer } from './cards/recipe-cards';
import { SelectedIngredients } from './selected-ingredients';
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

  public componentDidMount(): void {
    this.setInitialIngredients();
  }
  
  public async setInitialIngredients(): Promise<void> {
    this.setState({isLoading: true})
    const topIngredients: IIngredient[] = await getTopIngredients();
    this.setState({ingredientChoices: topIngredients, isLoading: false});
  }

  @autobind async selectIngredient(ingredient: string): Promise<void> {
    const selectedIngredients: string[] = [...this.state.selectedIngredients, ingredient]; 
    this.setState({selectedIngredients, selectedBase: 'null', selectedMealStyle: 'null'});
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
        this.setInitialIngredients();
      } else {
        this.reloadRelatedIngredients(this.state.selectedIngredients);
      }
    });
  }

  @autobind
  public clearSelection() {
    this.setState({
      selectedBase: '',
      selectedMealStyle: '',
      highlightedRecipes: []
    })
  }

  public render(): JSX.Element {
    return (
    <Container>
      <Header centered size={"large"}>Recipe Builder</Header>
      <SelectedIngredients selectedIngredients={this.state.selectedIngredients} removeIngredient={this.removeIngredient}/>
     {!(this.state.selectedBase || this.state.selectedMealStyle) && 
        <IngredientsContainer headerText={CHOOSE_MEAL_STYLE} selectIngredient={this.setStyle} ingredients={STYLE_OPTIONS} />}
      {(this.state.selectedMealStyle && !this.state.selectedBase) && 
        <IngredientsContainer headerText={CHOOSE_MEAL_BASE} selectIngredient={this.setBase} ingredients={BASE_OPTIONS[this.state.selectedMealStyle]} />}
      {(this.state.highlightedRecipes.length > 0) && 
        <RecipesContainer isLoading={this.state.isLoading} recipes={this.state.highlightedRecipes}/>}
      {(this.state.ingredientChoices.length && (!this.state.selectedIngredients.length || this.state.recipeChoices.length > 5)) && 
        <IngredientsContainer headerText={SELECT_INGREDIENTS} isLoading={this.state.isLoading} prelimsSelected selectIngredient={this.selectIngredient} ingredients={this.state.ingredientChoices} />}
    </Container>
  );
  }
}

// this.state.selectedMealStyle && this.state.selectedBase && this.state.recipeChoices.length > 5