import React from 'react';
import { Card, Grid, Header, Loader } from 'semantic-ui-react';
import { IIngredientsContainerProps } from './interfaces';
import { autobind } from 'core-decorators'
import '../recipe-builder.css';
import { IIngredient } from '../../../api/interfaces';
import { toPascalCase } from '../utils';
export class IngredientsContainer extends React.PureComponent<IIngredientsContainerProps> {

  @autobind
  public getIngredientCards(): JSX.Element[] {
    return this.props.ingredients.map((ingredient: IIngredient) => {
        const selectIngredient: () => void = () => this.props.selectIngredient(ingredient.name.toLowerCase());
        return <Card centered onClick={selectIngredient} title={toPascalCase(ingredient.name)} content={this.getCardContent(toPascalCase(ingredient.name))}/>
    })
  }

  public getCardContent(content: string): JSX.Element {
      return <div className="card-content">{content}</div>
  }

  public render(): JSX.Element {
    return (
      <React.Fragment>
      {this.props.prelimsSelected && <Header dividing size="medium">{'...or select more ingredients!'}</Header>}
      <Grid doubling stackable={false} columns={3}>
      {this.props.isLoading ? <Loader active/> : this.getIngredientCards()}
      </Grid>
      </React.Fragment>
  );
  }
}