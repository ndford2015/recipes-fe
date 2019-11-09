import React from 'react';
import { Card, Grid, Header, Loader, Input } from 'semantic-ui-react';
import { IIngredientsContainerProps } from './interfaces';
import { autobind } from 'core-decorators'
import '../recipe-builder.css';
import { IIngredient } from '../../../api/interfaces';
import { toPascalCase } from '../utils';
export class IngredientsContainer extends React.PureComponent<IIngredientsContainerProps> {

  @autobind
  public getIngredientCards(): JSX.Element[] {
    const filteredIngredients: IIngredient[] = this.props.ingredients.filter((ingredient: IIngredient) => ingredient.name.includes(this.props.searchValue || ''))
    return filteredIngredients.map((ingredient: IIngredient) => {
        const largeClass: string = this.props.large ? 'large-card' : '';
        const selectIngredient: () => void = () => this.props.selectIngredient(ingredient.name.toLowerCase());
        return <Card className={`ingredient-card ${largeClass}`}
                  centered 
                  onClick={selectIngredient} 
                  title={toPascalCase(ingredient.name)} 
                  content={this.getCardContent(toPascalCase(ingredient.name))}
                />
    })
  }

  @autobind
  public getCardContent(content: string): JSX.Element {
      return <div className="card-content">{content}</div>
  }

  public render(): JSX.Element | null {
    if (!this.props.ingredients.length) {
      return null;
    }
    return (
      <div className="ingredients-container">
        {<Header size="medium">{this.props.headerText}</Header>}
        {this.props.onSearch && 
            <Input className="search-bar" placeholder="Filter ingredients..." icon="search" onChange={this.props.onSearch} />}
        <Grid doubling stackable={false} columns={3}>
        
        {this.props.isLoading ? <Loader active/> : this.getIngredientCards()}
        </Grid>
      </div>
  );
  }
}