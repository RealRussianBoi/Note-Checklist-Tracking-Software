//General Use Imports
import { useEffect, useState, } from 'react'

//Custom Components
import NewNote from '../../Components/Cards/Notes/NewNote';
import NewChecklist from '../../Components/Cards/Checklists/NewChecklist';
import EmptyCard from '../../Components/Cards/EmptyCard';
import LoadingAndFinalizationAlert from '../../Components/LoadingAndFinalizationAlert';
import NoteCard from '../../Components/Cards/Notes/NoteCard'
import CardInfoDialog from '../../Components/CardInfoDialog';

function Homepage() {
    const [finalizationController, setFinalizationController] = useState({
        visible: true,
        disableFields: true,
        loading: true,
        severity: 'error',
        finalResultText: 'ss',
    });
    const [data, setData] = useState([]);
    const [infoDialog, setInfoDialog] = useState({
        open: false,
        data: null,
    });

    const handleInfoClick = (noteData) => { //Opens the CardInfoDialog component.
        setInfoDialog({
            open: true,
            data: noteData,
        });
    };

    const handleCloseDialog = () => { //Closes the CardInfoDialog component.
        setInfoDialog({
            open: false,
            data: null,
        });
    };

    useEffect(() => { //Fetches notes and checklists to populate Homepage.
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/combined/get');
                const data = await response.json();

                if (!response.ok) {
                throw new Error(data.error || 'Unknown server error');
                }

                setData(data.data);
                console.log(data.data);
                
                setFinalizationController((prev) => ({...prev, visible: false, disableFields: false, }));
            } catch (error) {
                setFinalizationController({
                    visible: true,
                    disableFields: true,
                    loading: false,
                    severity: 'error',
                    finalResultText: `${error.message}`,
                });
            }
        };
        
        //This timeout is to make the loading animation visible. Otherwise it will be very fast.
        setTimeout(() => {
            fetchData();
        }, 500);
    }, []);

    const renderCards = () => { //Populates Homepage with Cards for Note & Checklists.
        
        if (data.length === 0) {
            return (
                <EmptyCard/>
            )
        }

        return data.map((d) => {
            const key = `${d.type}-${d.id ?? index}`;
            return d.type === "note" ? (
                <NoteCard
                    key={key}
                    content={d.content}
                    created_at={d.created_at}
                    id={d.id}
                    title={d.title}
                    onInfoClick={() => handleInfoClick(d)}
                />
            ) : (
                <EmptyCard/>
            );
        });
    };

    return (
        <div 
            style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderRadius: '8px',
                padding: '20px',
                marginTop: '45px',
                boxSizing: 'border-box',
                width: '100%',
            }}
        >
            <LoadingAndFinalizationAlert
                visible={finalizationController.visible}
                loading={finalizationController.loading}
                severity={finalizationController.severity}
                finalResultText={finalizationController.finalResultText}
            />

            {infoDialog.data && (
                <CardInfoDialog
                    open={infoDialog.open}
                    onClose={handleCloseDialog}
                    created_at={infoDialog.data.created_at}
                    updated_at={infoDialog.data.updated_at}
                    id={infoDialog.data.id}
                    title={infoDialog.data.title}
                />
            )}

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '10px',
                    justifyContent: 'center'
                }}
            >
                <NewNote/>
                <NewChecklist/>
                {renderCards()}
            </div>
        </div>
    );
}

export default Homepage;