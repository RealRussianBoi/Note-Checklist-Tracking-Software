// General Use Imports
import './App.css'
import './index.css'
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react';

//MUI Imports
import { useMediaQuery as useMuiMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Custom Page Imports
import Homepage from './Pages/Default/Homepage'
import UnkownURL from './Pages/Default/UnkownURL'

//Custom Component Imports
import UpperNavBar from './Components/UpperNavBar'
import ManageNotes from './Pages/Notes/ManageNotes'

function App() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // THIS IS FOR TESTING PURPOSES ↓↓↓
  const muiThemeForBreakpoints = useMuiTheme();
  const breakpoints = {
    xs: useMuiMediaQuery(muiThemeForBreakpoints.breakpoints.only('xs')),
    sm: useMuiMediaQuery(muiThemeForBreakpoints.breakpoints.only('sm')),
    md: useMuiMediaQuery(muiThemeForBreakpoints.breakpoints.only('md')),
    lg: useMuiMediaQuery(muiThemeForBreakpoints.breakpoints.only('lg')),
    xl: useMuiMediaQuery(muiThemeForBreakpoints.breakpoints.only('xl')),
  };

  useEffect(() => {
    const active = Object.entries(breakpoints).find(([, matches]) => matches);
    if (active) {
      console.log(`Current MUI Breakpoint: ${active[0]}. IsMobile: ${isMobile}. Screen width: ${window.innerWidth}px`);
    }
  }, [breakpoints.xs, breakpoints.sm, breakpoints.md, breakpoints.lg, breakpoints.xl]);
  // THIS IS FOR TESTING PURPOSES ↑↑↑

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