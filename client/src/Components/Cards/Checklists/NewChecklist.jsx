//General Use Imports
import PropTypes from "prop-types";

//MUI Imports
import { Card, Typography, Box, CardActionArea } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function NewChecklist({
  onClick
}) {
  return (
    <Card
      sx={{
        width: 250,
        height: 180,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        border: "2px dashed #9aa615ff",
        color: "#acb414ff",
        "&:hover": {
          backgroundColor: "#f0f8ff",
        },
      }}
    >
      <CardActionArea
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
        onClick={() => {onClick()}}
      >
        <AddIcon sx={{ fontSize: 48 }} />
        <Typography variant="subtitle1" fontWeight="bold" textAlign={'center'}>
          Create New Checklist
        </Typography>
      </CardActionArea>
    </Card>
  );
}

NewChecklist.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default NewChecklist;