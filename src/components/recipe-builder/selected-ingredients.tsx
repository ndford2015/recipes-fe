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
    if (!this.props.selectedIngredients.length) {
      return null;
    }
    return (<div className="selected-ingredients">{'Selected Ingredients: '}{this.getSelectedIngredientLabels()}</div>);
  }
}