import { Typography, Paper } from "@mui/material";

const KPICard = ({ title, value }) => {
  return (
    <Paper align="center" sx={{ padding: 2, color: "#222f3e" }}>
      <Typography variant="h2" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="h5" fontWeight="semi-bold">
        {title}
      </Typography>
    </Paper>
  );
};

export default KPICard;
