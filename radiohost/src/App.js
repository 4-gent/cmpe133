import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Main from './main'
import Login from './routes/login'

function App() {
  return (
    // Router component to enable routing in the application
    <Router>
      <Routes>
        {/* Route component to define a route */}
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;
