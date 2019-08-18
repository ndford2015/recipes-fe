import React from 'react';
import logo from './logo.svg';
import './App.css';
import { RecipeBuilder } from './recipe-builder/recipe-builder';

const App: React.FC = () => {
  return (
    <div className="App">
      <RecipeBuilder/>
    </div>
  );
}

export default App;
