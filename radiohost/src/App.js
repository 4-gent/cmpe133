import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Main from './main'
import Login from './routes/login'
import Registration from './routes/register'

function App() {
  return (
    // Router component to enable routing in the application
    <Router>
      <Routes>
        {/* Route component to define a route */}
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </Router>
  );
}

export default App;
