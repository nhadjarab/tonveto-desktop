import {
  Paper,
  Typography,
  Stack,
  Grid,
  Avatar,
  Box,
  Rating,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import KeyIcon from "@mui/icons-material/Key";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

const UserInfo = ({ row, rating }) => {
  return (
    <Paper sx={{ padding: 2, marginBottom: 4 }}>
      <Box align="center">
        <Avatar
          sx={{
            width: 80,
            height: 80,
            backgroundColor: "#222f3e",
            mb: "10px",
          }}
        >
          {row.first_name[0]?.toUpperCase() || "?"}
        </Avatar>
        <Typography variant="h4">
          {row.first_name.toUpperCase() + " " + row.last_name.toUpperCase()}
        </Typography>
        {rating != null && (
          <Rating name="read-only" value={rating} readOnly precision={0.1} />
        )}
      </Box>
      <Grid container maxWidth="md" sx={{ margin: "25px auto" }}>
        <Grid item xs={6}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <KeyIcon />
              <Typography variant="body2">
                {" "}
                ID : <b>{row.id}</b>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <EmailIcon />
              <Typography variant="body2">
                Email : <b>{row.email}</b>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <PhoneIcon />
              <Typography variant="body2">
                Tel : <b>{row.phone_number}</b>
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <CalendarMonthIcon />
              <Typography variant="body2">
                Né le : <b>{row.birth_date}</b>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <DoneOutlineIcon />
              <Typography variant="body2">
                Profile :{" "}
                <b>{row.profile_complete ? "complet" : "incomplet"}</b>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <PersonIcon />
              <Typography variant="body2">
                Type : <b>{row.type}</b>
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserInfo;
