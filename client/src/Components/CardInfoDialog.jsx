// General Use Imports
import PropTypes from "prop-types";

// MUI Imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";

function CardInfoDialog({
  open,
  onClose,
  created_at,
  updated_at,
  id,
  title,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Note Details</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body1"><strong>Title:</strong> {title}</Typography>
          <Typography variant="body1">
            <strong>Created At:</strong>{" "}
            {new Date(created_at).toLocaleString()}
          </Typography>
          <Typography variant="body1">
            <strong>Updated At:</strong>{" "}
            {updated_at ? new Date(updated_at).toLocaleString() : 'N/A'}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CardInfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  created_at: PropTypes.string.isRequired,
  updated_at: PropTypes.string,
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default CardInfoDialog;