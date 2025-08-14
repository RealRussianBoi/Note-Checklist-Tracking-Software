// General Use Imports
import './App.css'
import './index.css'
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

// MUI Imports
import { useMediaQuery as useMuiMediaQuery, useTheme as useMuiTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

// Custom Page Imports
import Homepage from './Pages/Default/Homepage'
import UnkownURL from './Pages/Default/UnkownURL'

// Custom Component Imports
import UpperNavBar from './Components/UpperNavBar'
import ManageNotes from './Pages/Notes/ManageNotes'

function App() {
  return (
    <Router>
      <UpperNavBar />
      <div
        className='page-responsive-width'
        style={{
          height: 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Routes>
          {/* redirect root to /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/home" element={<Homepage />} />

          <Route path="/notes/add" element={<ManageNotes pageType="Add" />} />
          <Route path="/notes/edit" element={<ManageNotes pageType="Edit" />} />

          {/* catch-all */}
          <Route path="*" element={<UnkownURL />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App