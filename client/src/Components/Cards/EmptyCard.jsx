//MUI Imports
import { Card, Typography, Box, CardActionArea } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function EmptyCard() {
  return (
    <Card
      sx={{
        width: 250,
        height: 180,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "2px dashed #374049ff",
        backgroundColor: 'lightgray',
        cursor: 'auto'
      }}
    >
      {/* <CardActionArea
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" textAlign={'center'}>
          Future Notes & Checklists will appear here!
        </Typography>
      </CardActionArea> */}
    </Card>
  );
}

export default EmptyCard;