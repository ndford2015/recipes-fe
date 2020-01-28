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
              <Card href={recipe.url} target="_blank" id={recipe.id}>
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
      <React.Fragment>
      <Header textAlign="left" size="medium">{'Select a recipe!'}</Header>  
      <Grid  stretched  columns={2}>
      {this.props.isLoading ? <Loader inline active/> : this.getRecipeCards()}
      </Grid>
      </React.Fragment>
  );
  }
}