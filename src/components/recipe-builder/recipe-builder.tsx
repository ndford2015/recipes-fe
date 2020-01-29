import React, { ChangeEvent } from 'react';
import { Container, Header, Menu, MenuItemProps } from 'semantic-ui-react';
import { IRecipeBuilderState, IRecipeBuilderProps } from './interfaces';
import { STYLE_OPTIONS, CHOOSE_MEAL_STYLE, CHOOSE_MEAL_BASE, SELECT_INGREDIENTS, SELECTION_STEP, TAB_ID } from './constants';
import { autobind } from 'core-decorators'
import { IIngredientResponse, IIngredient, IRecipe } from '../../api/interfaces';
import { getRelatedIngredients, getRecipesByIds, getTopIngredients, getIngredientsByType } from '../../api';
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
    this.setInitialIngredients();
  }
  
  public async setInitialIngredients(): Promise<void> {
    this.setState({isLoading: true})
    const topIngredients: IIngredient[] = await getTopIngredients();
    this.setState({ingredientChoices: topIngredients, isLoading: false});
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
    this.setInitialIngredients();
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
  public getSelectionStep(): JSX.Element | null {
    switch(this.state.selectionStep) {
      case SELECTION_STEP.CHOOSE_CUISINE_STYLE:
        return <IngredientsContainer 
                  large 
                  headerText={CHOOSE_MEAL_STYLE} 
                  selectIngredient={this.setStyle} 
                  ingredients={STYLE_OPTIONS} 
                />;
      case SELECTION_STEP.CHOOSE_BASE:
        return <IngredientsContainer headerText={CHOOSE_MEAL_BASE} selectIngredient={this.selectIngredient} ingredients={this.state.ingredientChoices} />;
      case SELECTION_STEP.SELECT_INGREDIENTS:
        return this.getIngredientSelector();
      default:
        return null;
    }
  }
  
  @autobind
  public handleMenuItemClick(e: any, { name }: MenuItemProps): void {
    this.setState({activeTab: name as TAB_ID}, async () => this.resetRecipeBuilder());
  }

  @autobind 
  public getIngredientSelector(): JSX.Element | null {
    const ingredients: JSX.Element | null = (!this.state.selectedIngredients.length || this.state.recipeChoices.length > 5)
      ? <IngredientsContainer 
          headerText={SELECT_INGREDIENTS} 
          isLoading={this.state.isLoading} 
          selectIngredient={this.selectIngredient} 
          ingredients={this.state.ingredientChoices} 
          onSearch={this.handleSearchChange}
          searchValue={this.state.searchString}
        />
      : null
    return (
      <React.Fragment>
        <RecipesContainer isLoading={this.state.isLoading} recipes={this.state.highlightedRecipes}/>
        {ingredients}
      </React.Fragment>
    );
  }

  @autobind 
  getActiveTab(): JSX.Element | null {
    switch(this.state.activeTab) {
      case TAB_ID.RECIPE_BUILDER:
        return this.getSelectionStep();
      case TAB_ID.INGREDIENT_SELECTOR:
        return this.getIngredientSelector();
      default:
        return null;
    }
  }

  @autobind
  public getMenu(): JSX.Element {
    return (
    <Menu tabular>
      <Menu.Item 
        active={this.state.activeTab === TAB_ID.RECIPE_BUILDER} 
        name={TAB_ID.RECIPE_BUILDER}
        onClick={this.handleMenuItemClick}
        />
      <Menu.Item 
        name={TAB_ID.INGREDIENT_SELECTOR}
        active={this.state.activeTab === TAB_ID.INGREDIENT_SELECTOR}
        onClick={this.handleMenuItemClick}
        />
    </Menu>)
  }

  @autobind handleSearchChange(e: ChangeEvent<HTMLInputElement>): void {
    this.setState({searchString: e.target.value});
  }

  public render(): JSX.Element {
    return (
    <Container>
      <Header textAlign="left" size={"large"}>{this.state.activeTab}</Header>
      {this.getMenu()}
      <SelectedIngredients selectedIngredients={this.state.selectedIngredients} removeIngredient={this.removeIngredient}/>
      {this.getActiveTab()}
    </Container>
  );
  }
}
