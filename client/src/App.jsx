// General Use Imports
import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'

// Custom Imports
import Homepage from './Pages/Homepage'

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path="/home" element={<Homepage />} />
      </Routes>
      </div>
    </Router>
  )
}

export default App