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
import ChecklistIcon from '@mui/icons-material/Checklist';

function ChecklistCard({
    created_at,
    updated_at,
    id,
    title,
    items,
    onInfoClick,
    onClick,
}) {
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
        justifyContent: "space-between",
        "&:hover": {
          backgroundColor: "#f0f8ff",
        },
      }}
    >
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
};


export default ChecklistCard;