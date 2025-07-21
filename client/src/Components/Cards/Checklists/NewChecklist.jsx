//MUI Imports
import { Card, Typography, Box, CardActionArea } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function NewChecklist() {
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
        border: "2px dashed #1976d2",
        color: "#1976d2",
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
        onClick={() => {window.location.href='/checklists/add'}}
      >
        <AddIcon sx={{ fontSize: 48 }} />
        <Typography variant="subtitle1" fontWeight="bold" textAlign={'center'}>
          Create New Checklist
        </Typography>
      </CardActionArea>
    </Card>
  );
}

export default NewChecklist;