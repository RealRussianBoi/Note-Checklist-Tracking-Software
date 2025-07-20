//General Use imports
import { useEffect } from "react";

//MUI Imports
import { Autocomplete } from "@mui/material";

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
                <a 
                    href="/home"
                    style={{
                        textDecoration: 'none',
                        color: 'white',
                    }}
                >
                📝 NoteTrack
                </a>
            </div>

            <div style={{ display: 'flex', gap: '20px', fontSize: '16px' }}>
                <a href="/home" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
                <a href="/checklist" style={{ color: 'white', textDecoration: 'none' }}>Checklist</a>
                <a href="/notes" style={{ color: 'white', textDecoration: 'none' }}>Notes</a>
            </div>
        </div>
    );
}

export default UpperNavBar;