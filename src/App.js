import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import IDCreation from './components/IDCreation';
import IDDisplay from './components/IDDisplay';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<IDCreation />} />
          <Route path="/id" element={<IDDisplay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;