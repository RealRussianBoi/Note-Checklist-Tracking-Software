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
    Box,
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import ChecklistIcon from '@mui/icons-material/Checklist';

function ChecklistCard({
  created_at,
  updated_at,
  id,
  title,
  items = [],
  onInfoClick,
  onClick,
  onDeleteClick,
}) {
  const allChecked = items.length > 0 && items.every(i => !!i.checked);
  const complete = allChecked ? "Complete" : "Incomplete";
  return (
    <Card
      onClick={() => onClick({ id, title, items, created_at, updated_at, type: 'checklist' })}
      sx={{
        width: 250,
        height: 180,
        cursor: "pointer",
        border: "2px solid #9aa615ff",
        color: "#acb414ff",
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
          <ChecklistIcon sx={{ fontSize: 36, color: "#acb414ff" }} />
        }
        title={<><Typography variant="subtitle2">Type: Checklist</Typography></>}
        subheader={<><Typography variant="caption" color="#acb414ff">Status: {complete}</Typography></>}
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
          Updated At: {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }).format(new Date(updated_at))}
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

ChecklistCard.propTypes = {
  created_at: PropTypes.string.isRequired,
  updated_at: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    checked: PropTypes.bool,
  })).isRequired,
  onInfoClick: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};


export default ChecklistCard;