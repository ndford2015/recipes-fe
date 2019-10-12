import React from 'react';
import { Card, Container, Header, Label, Icon } from 'semantic-ui-react';
import { IRecipeBuilderState, IRecipeBuilderProps } from './interfaces';
import { STYLE_OPTIONS, BASE_OPTIONS, CHOOSE_MEAL_STYLE, CHOOSE_MEAL_BASE, SELECT_INGREDIENTS, SELECTION_STEP } from './constants';
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
      selectedMealStyle: '',
      isLoading: false,
      selectionStep: SELECTION_STEP.CHOOSE_CUISINE_STYLE
    }
  }

  @autobind
  public setStyle(style: string): void {
    this.setState({selectedMealStyle: style, selectionStep: SELECTION_STEP.CHOOSE_BASE})
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
    if (this.state.selectionStep !== SELECTION_STEP.SELECT_INGREDIENTS) {
      this.setState({selectionStep: SELECTION_STEP.SELECT_INGREDIENTS});
    }
    this.setState({selectedIngredients});
    this.reloadRelatedIngredients(selectedIngredients);
    window.scrollTo(0, 0);
  }
 
  @autobind 
  public async getRecipeHighlights() {
    const selectedChoices: string[] = this.state.recipeChoices.length <= 5 ? this.state.recipeChoices : this.state.recipeChoices.slice(0,2);
    const highlightedRecipes: IRecipe[] = await getRecipesByIds(selectedChoices);
    this.setState({highlightedRecipes, isLoading: false});
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
      selectionStep: SELECTION_STEP.CHOOSE_CUISINE_STYLE,
      selectedMealStyle: '',
      highlightedRecipes: []
    })
  }

  @autobind
  public getSelectionStep(): JSX.Element | null {
    switch(this.state.selectionStep) {
      case SELECTION_STEP.CHOOSE_CUISINE_STYLE:
        return <IngredientsContainer headerText={CHOOSE_MEAL_STYLE} selectIngredient={this.setStyle} ingredients={STYLE_OPTIONS} />;
      case SELECTION_STEP.CHOOSE_BASE:
        return <IngredientsContainer headerText={CHOOSE_MEAL_BASE} selectIngredient={this.selectIngredient} ingredients={BASE_OPTIONS[this.state.selectedMealStyle]} />;
      default:
        return null;
    }
  }

  public render(): JSX.Element {
    return (
    <Container>
      <Header centered size={"large"}>Recipe Builder</Header>
      <SelectedIngredients selectedIngredients={this.state.selectedIngredients} removeIngredient={this.removeIngredient}/>
      {this.getSelectionStep()}
      <RecipesContainer isLoading={this.state.isLoading} recipes={this.state.highlightedRecipes}/>
      {(this.state.ingredientChoices.length && (!this.state.selectedIngredients.length || this.state.recipeChoices.length > 5)) && 
        <IngredientsContainer headerText={SELECT_INGREDIENTS} isLoading={this.state.isLoading} prelimsSelected selectIngredient={this.selectIngredient} ingredients={this.state.ingredientChoices} />}
    </Container>
  );
  }
}

// this.state.selectedMealStyle && this.state.selectedBase && this.state.recipeChoices.length > 5