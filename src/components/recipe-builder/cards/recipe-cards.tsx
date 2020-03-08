import React from 'react';
import { Card, Grid, Header, Loader } from 'semantic-ui-react';
import { IRecipesContainerProps } from './interfaces';
import { autobind } from 'core-decorators'
import '../recipe-builder.css';
import { IRecipe } from '../../../api/interfaces';
export class RecipesContainer extends React.PureComponent<IRecipesContainerProps> {

    @autobind
    public getRecipeCards(): JSX.Element[] {
      return this.props.recipes.map((recipe: IRecipe) => {
          return (
              <Card className="recipe-card" href={recipe.url} target="_blank" id={recipe.id}>
                <Card.Content>
                    <Card.Header>{recipe.name}</Card.Header>
                    <Card.Description><div className={"recipe-card-content"}>{recipe.description}</div></Card.Description>
                </Card.Content>
              </Card>
          )
        })
    }

  public render(): JSX.Element | null {

    if (!this.props.recipes.length) {
      return null;
    }
    
    return (
      <div className="recipes-container">
        <Header textAlign="center" size="medium">{'Select a Recipe!'}</Header>  
        {this.props.isLoading ? <Loader inline active/> :
        (<div className="recipe-cards">
          {this.getRecipeCards()}
        </div>)}
      </div>
  );
  }
}