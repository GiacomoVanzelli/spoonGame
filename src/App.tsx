// App.tsx

import React from 'react';
import FoodQuizGame from './components/FoodQuizGame';
import './css/App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <FoodQuizGame />
    </div>
  );
};

export default App;