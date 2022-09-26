import { Typography, Box } from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const Empty = ({ msg }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        marginTop:2
      }}
    >
      <HourglassEmptyIcon sx={{ fontSize: 100 }} />
      <Typography variant="h6" color="text.secondary">
        {msg}
      </Typography>
    </Box>
  );
};

export default Empty;
