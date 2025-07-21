// General Use Imports
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

// Editor.js Imports
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';

// MUI Imports
import {
  Button,
  Typography,
  TextField,
  FormHelperText,
  Alert,
  Snackbar,
  Slide,
} from '@mui/material';

//Custom Components
import LoadingAndFinalizationAlert from '../../Components/LoadingAndFinalizationAlert';
import FinalizationDialog from '../../Components/FinalizationDialog';

function ManageNotes({ pageType = "Add" }) {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('id');

  const [content, setContent] = useState('');

  const [title, setTitle] = useState('');
  const [note, setNote] = useState(null);

  const [titleError, setTitleError] = useState('');
  const [noteError, setNoteError] = useState('');

  const [finalizationController, setFinalizationController] = useState({
    visible: pageType !== "Add",
    disableFields: pageType !== "Add",
    loading: true,
    severity: 'error',
    finalResultText: 'ss',
  });

  const [finalDialog, setFinalDialog] = useState({
    open: false,
    loadingText: 'Saving Notes...',
    severity: 'info',
    severityText: '',
  });
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center',
    text: "",
    Transition: Slide,
  });

  useEffect(() => { //Creates Editor Instance.
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        holder: editorRef.current,
        autofocus: true,
        tools: {
          header: Header,
          list: List,
        },
        placeholder: 'Write something here...',
        data: content ? content : undefined,
        onChange: async () => {
          const v = await editorInstance.current.save();
          console.log(v);
          updateNotes(v);
        },
      });
    }

    return () => {
      if (editorInstance.current?.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [pageType, content]);

  useEffect(() => { //Fetch note during Edit pageType.
    const fetchData = async () => {
      if (pageType === "Edit") {
        try {
          const response = await fetch(`http://localhost:5000/notes/get/${noteId}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch note.');
          }

          const parsedContent = JSON.parse(data.content);

          console.log(parsedContent);
          
          setTitle(data.title);
          setNote(parsedContent);
          setContent(parsedContent);

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
      }
    };

    setTimeout(() => { //Sets a timeout for prettier loading animations.
      fetchData();
    }, 500);
  }, []);

  useEffect(() => { //Triggers snackbar when an error is found.
    const bool = titleError || noteError;

    setSnackbarState((p) => ({
      ...p,
      open: bool,
    }));
  }, [titleError, noteError]);

  const updateTitle = (v) => { //Updates title and titleError hooks.
    setTitle(v);

    if (v == '') {
      setTitleError("Title is required");
      return;
    }

    setTitleError('');
  };

  const updateNotes = (v) => { //Updates note and noteError hooks.
    setNote(v);    

    if (!v || !Array.isArray(v.blocks) || v.blocks.length === 0) {
      setNoteError("Note content is required");
      return;
    }

    setNoteError('');
  };

  const onSubmit = async () => { //Ssaves Notes to batabase.
    let valid = true;

    // Validation checks
    if (!title.trim()) {
      setTitleError('Title is required');
      valid = false;
    } else {
      setTitleError('');
    }

    const savedContent = await editorInstance.current.save();
    if (!savedContent?.blocks?.length) {
      setNoteError('Note content is required');
      valid = false;
    } else {
      setNoteError('');
      setNote(savedContent);
    }

    if (!valid) return;

    const submission = async () => {
      try {
        setFinalDialog(
          {
            ...finalDialog, 
            open: true, 
            severity: 'info', 
            loadingText: `Saving Notes...`,
          }
        );
        
        const response = await fetch(`http://localhost:5000/notes/${pageType.toLowerCase()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: noteId, title, content: savedContent }),
        });

        if (response.ok) {
          setFinalDialog({
            ...finalDialog, 
            open: true, 
            severity: "success", 
            severityText: `Notes saved successfully!`
          });
          setTimeout(() => {
            window.location.href = '/home';
          }, 1000);
        } else {
          setFinalDialog({
            ...finalDialog,
            open: true,
            severity: "error",
            severityText: `Failed to save notes.`,
          });
        }
      } catch (error) {
        console.error(error.message);
        
        setFinalDialog({
          ...finalDialog,
          open: true,
          severity: "error",
          severityText: `Failed to save notes.`,
        });
      }
    }

     submission();
  };

  return (
    <div className='universal-page-styles' style={{ padding: '20px', paddingTop: '0px', marginTop: '45px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: '65px',
          border: '1px dotted black',
          borderTop: 'none',
          borderRadius: '6px',
          padding: '10px',
          backgroundColor: 'white',
          marginBottom: '40px',
          zIndex: 10,
        }}
      >
        <Typography variant='h5' fontWeight={"bold"}>
          {pageType === "Add" ? "Adding Note" : "Updating Note"}
        </Typography>

        <TextField
          variant='standard'
          label='Enter Title Here'
          value={title}
          onChange={(e) => updateTitle(e.target.value)}
          disabled={finalizationController.disableFields}
          error={!!titleError}
          helperText={titleError || `${title.length}/200`}
          slotProps={{ htmlInput: { maxLength: 200 } }}
          sx={{
            width: '50%'
          }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant='contained'
            color='secondary'
            onClick={onSubmit}
            disabled={finalizationController.disableFields}
            sx={{ minWidth: 120 }}
          >
            Save
          </Button>

          <Button
            variant='contained'
            color='primary'
            href='/home'
            disabled={finalizationController.disableFields}
            sx={{ minWidth: 80 }}
          >
            Cancel
          </Button>
        </div>
      </div>

      <LoadingAndFinalizationAlert
          visible={finalizationController.visible}
          loading={finalizationController.loading}
          severity={finalizationController.severity}
          finalResultText={finalizationController.finalResultText}
      />

      <div
        ref={editorRef}
        hidden={finalizationController.disableFields}
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
          minHeight: '300px',
          overflow: 'auto',
          backgroundColor: 'white',
        }}
      />

      {noteError && (
        <FormHelperText error sx={{ mt: 1, ml: 1 }}>
          {noteError}
        </FormHelperText>
      )}

      <FinalizationDialog 
        onClose={() => setFinalDialog((prev) => ({ ...prev, open: false }))}
        open={finalDialog.open}
        loadingResultText={finalDialog.loadingText}
        severity={finalDialog.severity}
        finalResultText={finalDialog.severityText}
      />

      <Snackbar
        anchorOrigin={{ vertical: snackbarState.vertical, horizontal: snackbarState.horizontal }}
        open={snackbarState.open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            return;
          }
        }}
        message={snackbarState.text}
      >
        <Alert
          severity='error'
        >
          <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
            {titleError && <li>{titleError}</li>}
            {noteError && <li>{noteError}</li>}
          </ul>
        </Alert>
      </Snackbar>

    </div>
  );
}

ManageNotes.propTypes = {
  pageType: PropTypes.oneOf(["Add", "Edit"]).isRequired,
};

export default ManageNotes;