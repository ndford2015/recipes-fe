import React from 'react';
import { Label, Icon } from 'semantic-ui-react';
import { autobind } from 'core-decorators'
import { ISelectedIngredientsProps } from './interfaces';
export class SelectedIngredients extends React.PureComponent<ISelectedIngredientsProps> {

    @autobind
    public getSelectedIngredientLabels(): JSX.Element[] {
      return this.props.selectedIngredients.map((ingr: string, index: number) => {
        const onClick: () => void = () => this.props.removeIngredient(index);
        return <Label>{ingr}<Icon name='delete' onClick={onClick}/></Label>
      })
    }

  public render(): JSX.Element | null {
    const selectedIngredients: string | JSX.Element[] = this.props.selectedIngredients.length 
      ? this.getSelectedIngredientLabels()
      : 'No ingredients selected yet, choose some below!'
    return (<div className="selected-ingredients"><h5>{'Selected Ingredients: '}</h5>{selectedIngredients}</div>);
  }
}