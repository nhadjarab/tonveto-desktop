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
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EuroIcon from "@mui/icons-material/Euro";
import BadgeIcon from '@mui/icons-material/Badge';

const UserInfo = ({ row, rating, vet }) => {
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
          {row.first_name[0]?.toUpperCase() || "A"}
        </Avatar>
        <Typography variant="h4">
          {row.first_name?.toUpperCase() + row.last_name?.toUpperCase()
            ? row.first_name?.toUpperCase() + " " + row.last_name?.toUpperCase()
            : "Admin"}
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
              <BadgeIcon />
              <Typography variant="body2">
                Numéro ordinal : <b>{row.identification_order}</b>
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
                Téléphone : <b>{row.phone_number}</b>
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <CalendarMonthIcon />
              <Typography variant="body2">
                Date de naissance :{" "}
                <b>
                  {new Date(row.birth_date).getFullYear() +
                    "-" +
                    (new Date(row.birth_date).getMonth() + 1) +
                    "-" +
                    new Date(row.birth_date).getDate()}
                </b>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <DoneOutlineIcon />
              <Typography variant="body2">
                Profil : <b>{row.profile_complete ? "complet" : "incomplet"}</b>
              </Typography>
            </Stack>
            {vet && (
              <Stack direction="row" spacing={1}>
                <AccountBalanceIcon />
                <Typography variant="body2">
                  RIB : <b>{row.bank_details}</b>
                </Typography>
              </Stack>
            )}
            {vet && (
              <Stack direction="row" spacing={1}>
                <EuroIcon />
                <Typography variant="body2">
                  SOLDE : <b>{row.balance}</b>
                </Typography>
              </Stack>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserInfo;
