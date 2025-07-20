//General Use Imports
import { useEffect, useState, } from 'react'

//Custom Components
import NewNote from '../../Components/NewNote';
import NewChecklist from '../../Components/NewChecklist';
import EmptyCard from '../../Components/EmptyCard';
import LoadingAndFinalizationAlert from '../../Components/LoadingAndFinalizationAlert';

function Homepage() {
    const [finalizationController, setFinalizationController] = useState({
        visible: true,
        disableFields: true,
        loading: true,
        severity: 'error',
        finalResultText: '',
    });

    useEffect(() => {
        
    }, []);

    return (
        <div 
            className='universal-page-styles'
            style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                border: '2px dashed black',
                borderRadius: '8px',
                padding: '20px',
                marginTop: '45px',
            }}
        >
            <LoadingAndFinalizationAlert
                visible={finalizationController.visible}
                loading={finalizationController.loading}
                severity={finalizationController.severity}
                finalResultText={finalizationController.finalResultText}
            />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    justifyContent: 'center'
                }}
            >
                <NewNote/>
                <NewChecklist/>
                <EmptyCard/>
            </div>
        </div>
    );
}

export default Homepage;