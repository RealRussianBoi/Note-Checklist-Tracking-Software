//General Use Imports
import { useEffect, useState, } from 'react'

//Custom Components
import NewNote from '../../Components/Cards/Notes/NewNote';
import NewChecklist from '../../Components/Cards/Checklists/NewChecklist';
import EmptyCard from '../../Components/Cards/EmptyCard';
import LoadingAndFinalizationAlert from '../../Components/LoadingAndFinalizationAlert';
import NoteCard from '../../Components/Cards/Notes/NoteCard'
import CardInfoDialog from '../../Components/CardInfoDialog';
import ChecklistDialog from '../../Components/ChecklistDialog';
import ChecklistCard from '../../Components/Cards/Checklists/ChecklistCard';

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
    const [checklistDialog, setChecklistDialog] = useState({
        open: false,
        content: null,
    });

    useEffect(() => { //Fetches notes and checklists to populate Homepage.
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/combined/get');
                const data = await response.json();

                if (!response.ok) {
                throw new Error(data.error || 'Unknown server error');
                }

                setData(data.data);
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

    const acceptNewCard = (card) => { //Inserts a new card into the array of cards.
        setData((p) => ({...card, ...p}));
    };

    const renderCards = () => { //Populates Homepage with Cards for Note & Checklists.
        
        if (data.length === 0) {
            return (
                <EmptyCard/>
            );
        }

        return data.map((d) => {
            const key = `${d.type}-${d.id ?? index}`;
            return d.type === "note" ? (
                <NoteCard
                    key={key}
                    created_at={d.created_at}
                    id={d.id}
                    title={d.title}
                    onInfoClick={() => handleInfoClick(d)}
                />
            ) : (
                <ChecklistCard
                    key={key}
                    id={d.id}
                    title={d.title}
                    created_at={d.created_at}
                    updated_at={d.updated_at}
                    items={d.items}
                    onInfoClick={() => handleInfoClick(d)}
                    onClick={openEditChecklist} // <<< Important!
                />
            );
        });
    };

    const openNewChecklist = () => { //Opens a new checklist, displaying its items.
        setChecklistDialog({
            open: true,
            content: null,
        });
    };

    const openEditChecklist = (checklistData) => { //Opens a checklist for editing.
        setChecklistDialog({
            open: true,
            content: checklistData,
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
                    type={infoDialog.data.type}
                    created_at={infoDialog.data.created_at}
                    updated_at={infoDialog.data.updated_at}
                    id={infoDialog.data.id}
                    title={infoDialog.data.title}
                />
            )}

            <ChecklistDialog
                open={checklistDialog.open}
                content={checklistDialog.content}
                onClose={() => setChecklistDialog({ open: false, content: null })}
                onSubmit={(items) => console.log("Submitted:", items)}
            />

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
                <NewChecklist onClick={openNewChecklist}/>
                {renderCards()}
            </div>
        </div>
    );
}

export default Homepage;