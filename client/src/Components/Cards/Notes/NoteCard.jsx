// General Use Imports
import PropTypes from "prop-types";

// MUI Imports
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  CardHeader,
  IconButton,
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import NotesIcon from '@mui/icons-material/TextSnippet';

function NoteCard({
  created_at,
  id,
  title,
  onInfoClick,
  onDeleteClick,
}) {
  return (
    <Card
      onClick={() => {window.location.href=`/notes/edit?id=${id}`}}
      sx={{
        width: 250,
        height: 180,
        cursor: "pointer",
        border: "2px solid #1976d2",
        color: "#1976d2",
        display: "flex",
        flexDirection: "column",
        position: 'relative', // for positioning the trash icon
        justifyContent: "space-between",
        "&:hover": {
          backgroundColor: "#f0f8ff",
        },
      }}
    >
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(id);
        }}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          zIndex: 1,
        }}
      >
        <DeleteIcon />
      </IconButton>

      {/* Centered Notes Icon */}
      <CardHeader
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 0,
        }}
        avatar={
          <NotesIcon sx={{ fontSize: 36, color: "#1976d2" }} />
        }
        title={<><Typography variant="subtitle2">Type: Note</Typography></>}
      />

      {/* Title Content */}
      <CardContent
        sx={{
          paddingTop: 1,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          textAlign="center"
          noWrap
        >
          {title}
        </Typography>
      </CardContent>

      {/* Info Icon */}
      <CardActions
        sx={{
          justifyContent: "space-between",
          paddingTop: 0,
        }}
      >
        <Typography variant="subtitle2">
          Created At: {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }).format(new Date(created_at))}
        </Typography>

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick();
          }}
        >
          <InfoIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

NoteCard.propTypes = {
  created_at: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  onInfoClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default NoteCard;