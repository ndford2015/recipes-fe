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

  public render(): JSX.Element {
    return (
      <React.Fragment>
      <Header dividing size="medium">{'Select a recipe!'}</Header>  
      <Grid  stretched centered columns={2}>
      {this.props.isLoading ? <Loader inline active/> : this.getRecipeCards()}
      </Grid>
      </React.Fragment>
  );
  }
}