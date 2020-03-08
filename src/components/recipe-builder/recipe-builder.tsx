import React, { ChangeEvent } from 'react';
import { Container, Header, Menu, MenuItemProps } from 'semantic-ui-react';
import { IRecipeBuilderState, IRecipeBuilderProps } from './interfaces';
import { STYLE_OPTIONS, CHOOSE_MEAL_STYLE, CHOOSE_MEAL_BASE, SELECT_INGREDIENTS, SELECTION_STEP, TAB_ID } from './constants';
import { autobind } from 'core-decorators'
import { IIngredientResponse, IIngredient, IRecipe } from '../../api/interfaces';
import { getRelatedIngredients, getRecipesByIds, getTopIngredients, getIngredientsByType, getRandomRecipes } from '../../api';
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
      searchString: '',
      highlightedRecipes: [],
      recipeChoices: [],
      selectedMealStyle: '',
      isLoading: false,
      selectionStep: SELECTION_STEP.CHOOSE_CUISINE_STYLE,
      activeTab: TAB_ID.RECIPE_BUILDER
    }
  }

  @autobind
  public async setStyle(style: string): Promise<void> {
    const styleOptions: IIngredient[] = await getIngredientsByType(style);
    this.setState({ingredientChoices: styleOptions, selectionStep: SELECTION_STEP.CHOOSE_BASE})
  }

  public componentDidMount(): void {
    this.setInitialIngredientsAndRecipes();
  }
  
  public async setInitialIngredientsAndRecipes(): Promise<void> {
    this.setState({isLoading: true})
    const topIngredients: IIngredient[] = await getTopIngredients();
    const topRecipes: IRecipe[] = await getRandomRecipes(100);
    this.setState({ingredientChoices: topIngredients, isLoading: false, highlightedRecipes: topRecipes});
  }

  @autobind 
  async selectIngredient(ingredient: string): Promise<void> {
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
    const highlightedRecipes: IRecipe[] = await getRecipesByIds(this.state.recipeChoices);
    this.setState({highlightedRecipes, isLoading: false});
  }

  @autobind 
  public async reloadRelatedIngredients(selectedIngredients: string[]): Promise<void> {
    this.setState({isLoading: true});
    const relatedIngredientResponse: IIngredientResponse = await getRelatedIngredients(selectedIngredients);
    this.setState(
      {
        ingredientChoices: relatedIngredientResponse.ingredients,
        recipeChoices: relatedIngredientResponse.recipeIds,
        searchString: ''
      },
      () => this.getRecipeHighlights()
    )
  }

  @autobind
  public removeIngredient(removeIndex: number): void {
    this.setState({selectedIngredients: this.state.selectedIngredients.filter((_, i: number) => i !== removeIndex)}, async () => {
      if (!this.state.selectedIngredients.length) {
        this.resetRecipeBuilder();
      } else {
        this.reloadRelatedIngredients(this.state.selectedIngredients);
      }
    });
  }

  public resetRecipeBuilder(): void {
    this.clearSelection();
    this.setInitialIngredientsAndRecipes();
  }

  @autobind
  public clearSelection() {
    this.setState({
      selectionStep: SELECTION_STEP.CHOOSE_CUISINE_STYLE,
      selectedMealStyle: '',
      selectedIngredients: [],
      highlightedRecipes: []
    })
  }

  
  @autobind
  public handleMenuItemClick(e: any, { name }: MenuItemProps): void {
    this.setState({activeTab: name as TAB_ID}, async () => this.resetRecipeBuilder());
  }

  @autobind 
  public getIngredientSelector(): JSX.Element | null {
    return (
      <div className="app-container">
        <IngredientsContainer 
          headerText={SELECT_INGREDIENTS} 
          isLoading={this.state.isLoading} 
          selectedIngredients={this.state.selectedIngredients}
          removeIngredient={this.removeIngredient}
          selectIngredient={this.selectIngredient} 
          ingredients={this.state.ingredientChoices} 
          onSearch={this.handleSearchChange}
          searchValue={this.state.searchString}
        />
        <RecipesContainer isLoading={this.state.isLoading} recipes={this.state.highlightedRecipes}/>
      </div>
    );
  }

  @autobind handleSearchChange(e: ChangeEvent<HTMLInputElement>): void {
    this.setState({searchString: e.target.value});
  }

  public render(): JSX.Element {
    return (
    <Container>
      <Header textAlign="left" size={"large"}>{this.state.activeTab}</Header>
      {this.getIngredientSelector()}
    </Container>
  );
  }
}
