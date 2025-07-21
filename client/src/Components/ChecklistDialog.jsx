//General Use Imports
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

//MUI Imports
import {
Alert,
CircularProgress,
Dialog,
DialogTitle,
DialogContent,
DialogActions,
Button,
TextField,
Checkbox,
List,
ListItem,
IconButton,
Box,
Typography,
FormControl,
FormHelperText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LoadingAndFinalizationAlert from './LoadingAndFinalizationAlert';

function ChecklistDialog({ open, onClose, onSubmit, content }) {
    const [id, setId] = useState();
    const [title, setTitle] = useState('');
    const [items, setItems] = useState([{text: '', checked: false}]);
    const [errors, setErrors] = useState({ title: '', items: '' });
    const [finalizationController, setFinalizationController] = useState({
        visible: true,
        disableFields: true,
        loading: true,
        severity: 'error',
        finalResultText: '',
    });

    useEffect(() => { //Loads content into our hooks when provided.
        if (open) {
            if (content) {
                console.log(content);
                
                setTimeout(() => { //Timeout to make loading animations look pretty.
                    const { title, items, id, } = content;
                    setTitle(title || '');
                    setId(id);
                    const parsedItems = items.map((i) => ({...i, text: i.content}));
                    setItems(parsedItems || []);
                    setFinalizationController((prev) => ({...prev, visible: false, disableFields: false, }));
                }, 500);
            } else {
                setTitle('');
                setItems([{ text: '', checked: false }]);
                setFinalizationController((p) => ({
                    ...p,
                    visible: false,
                    disableFields: false,
                }));
            }
            
            setErrors({ title: '', items: '' });
        }
    }, [open, content]);

    const handleAddItem = () => { //Adds a row to checklist.
        setItems((prev) => [...prev, { text: '', checked: false }]);
    };

    const handleItemChange = (index, text) => {
        const newItems = [...items];
        newItems[index].text = text;
        setItems(newItems);
    };

    const handleItemToggle = (index) => {
        const newItems = [...items];
        newItems[index].checked = !newItems[index].checked;
        setItems(newItems);
    };

    const handleItemDelete = (index) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { title: '', items: '' };

        if (!title.trim()) {
            newErrors.title = 'Checklist title is required';
            valid = false;
        }

        if (items.length === 0 || items.some(item => !item.text.trim())) {
            newErrors.items = 'All checklist items must have text';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => { //Saves checklist to server.
        if (!validateForm()) return;

        try {
            setFinalizationController({
                visible: true,
                disableFields: true,
                loading: true,
                severity: 'error',
                finalResultText: '',
            });

            const endpoint = !!content ? "edit" : "add";
            const response = await fetch(`http://localhost:5000/checklists/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    title,
                    items: items.map(item => ({
                        text: item.text,
                        checked: item.checked || false,
                    })),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create checklist');
            }

            setFinalizationController((prev) => ({...prev, loading: false, severity: 'success', finalResultText: "Checklist Saved"}));

            // After successful API call
            onSubmit({ title, items });

            setTimeout(() => {
                handleCancel();
            }, 1000);
        } catch (error) {
            console.error('Checklist creation failed:', error.message);
            setErrors(prev => ({
                ...prev,
                api: error.message,
            }));
            setFinalizationController({
                visible: true,
                disableFields: false,
                loading: false,
                severity: 'error',
                finalResultText: `${error.message}`,
            });
        }
    };

    const handleCancel = () => { //Clears fields and closes dialog.
        setTitle('');
        setItems([]);
        setErrors({ title: '', items: '' });
        onClose();
        setFinalizationController((p) => ({
            ...p,
            visible: true,
            disableFields: true,
            loading: true,
        }));
    };

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                }}
            >
                Checklist "{title}"
                <LoadingAndFinalizationAlert
                    visible={finalizationController.visible}
                    loading={finalizationController.loading}
                    severity={finalizationController.severity}
                    finalResultText={finalizationController.finalResultText}
                />
            </DialogTitle>

            <DialogContent dividers>
                <FormControl fullWidth margin="normal" error={!!errors.title}>
                <TextField
                    label="Checklist Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="standard"
                    disabled={finalizationController.disableFields}
                />
                    {errors.title && <FormHelperText>{errors.title}</FormHelperText>}
                </FormControl>

                <Typography variant="subtitle1" sx={{ mt: 2, color: finalizationController.disableFields ? 'grey' : '' }}>
                    Checklist Items
                </Typography>

                <FormControl fullWidth error={!!errors.items}>
                    <List>
                        {items.map((item, index) => (
                            <ListItem key={index} disableGutters>
                                <Checkbox
                                    checked={item.checked}
                                    onChange={() => handleItemToggle(index)}
                                    disabled={finalizationController.disableFields}
                                />
                                <TextField
                                    value={item.text}
                                    onChange={(e) => handleItemChange(index, e.target.value)}
                                    disabled={finalizationController.disableFields}
                                    fullWidth
                                    variant="standard"
                                    placeholder={`Item ${index + 1}`}
                                />
                                <Box ml="auto">
                                    <IconButton onClick={() => handleItemDelete(index)} disabled={finalizationController.disableFields}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                    {errors.items && <FormHelperText>{errors.items}</FormHelperText>}
                </FormControl>

                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddItem}
                    >
                        Add Item
                    </Button>
                </Box>


            </DialogContent>

            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="secondary" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ChecklistDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    content: PropTypes.object,
};

export default ChecklistDialog;