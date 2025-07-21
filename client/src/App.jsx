// General Use Imports
import './App.css'
import './index.css'
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom'

// Custom Page Imports
import Homepage from './Pages/Default/Homepage'
import UnkownURL from './Pages/Default/UnkownURL'

//Custom Component Imports
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
          <Route path="/home" element={ <Homepage />} />

          <Route path="/notes/add" element={ <ManageNotes pageType="Add"/>} />
          <Route path="/notes/edit" element={ <ManageNotes pageType="Edit"/>} />

          {/* Redirects all unknown URL's to this page. */}
          <Route path="*" element={ <UnkownURL />} />
        </Routes>
      </div>

    </Router>
  )
}

export default App