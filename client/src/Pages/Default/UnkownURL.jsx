//MUI Imports
import { Button, Typography } from '@mui/material';

// Assets
import pageNotFoundPNG from '../../assets/pageNotFound.png'

function UnkownURL() {
    return (
        <div
            className='universal-page-styles'
            style={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start', // Align vertically
                alignItems: 'center', // Align horizontally
                gap: '10px',
            }}
        >
            <img
                src={pageNotFoundPNG}
                alt="Page Not Found"
                style={{ 
                    width: '400px',
                    height: 'auto',
                    marginTop: '5px',
                }}
            />

            <Typography textAlign={'center'}>
                This page isn't available. Sorry about that. <br/> Try searching for something else.
            </Typography>

            <Button
                variant="contained"
                href='/home'
                sx={{
                    borderRadius: '8px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                Return To Homepage
            </Button>
        </div>
    );
}

export default UnkownURL;