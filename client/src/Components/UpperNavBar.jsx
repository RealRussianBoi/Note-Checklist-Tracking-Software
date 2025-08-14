//General Use imports
import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

//MUI Imports
import { Link } from "@mui/material";

function UpperNavBar() {
  return (
    <div
      style={{
        width: '100%',
        height: '60px',
        boxSizing: 'border-box',
        padding: '0 20px',
        backgroundColor: '#1976d2',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        zIndex: 1000
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}>
        <Link
          component={RouterLink}
          to="/home"
          underline="none"
          sx={{ color: 'white' }}
        >
          📝 NoteTrack
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '20px', fontSize: '16px' }}>
        <Link component={RouterLink} to="/home" underline="none" sx={{ color: 'white' }}>
          Home
        </Link>
        <Link component={RouterLink} to="/notes/add" underline="none" sx={{ color: 'white' }}>
          Notes
        </Link>
      </div>
    </div>
  );
}

export default UpperNavBar;