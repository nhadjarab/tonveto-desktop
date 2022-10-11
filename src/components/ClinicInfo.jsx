import { Paper, Typography, Stack, Grid, Box, Rating } from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import KeyIcon from "@mui/icons-material/Key";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import FlagIcon from "@mui/icons-material/Flag";
import LocationCityIcon from "@mui/icons-material/LocationCity";


const ClinicInfo = ({row}) => {
  return (
    <Paper sx={{ padding: 2, marginBottom: 4 }}>
        <Box align="center">
          <Typography variant="h4">{row.clinic.name.toUpperCase()}</Typography>
          <Rating
            name="read-only"
            value={row?.clinicRating?._avg?.rating || 0}
            readOnly
            precision={0.1}
          />
        </Box>
        <Grid container maxWidth="md" sx={{ margin: "25px auto" }}>
          <Grid item xs={6}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1}>
                <KeyIcon />
                <Typography variant="body2">
                  {" "}
                  Clinique ID : <b>{row.clinic.id}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <EmailIcon />
                <Typography variant="body2">
                  Adresse :{" "}
                  <b>{row.clinic.address}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <PhoneIcon />
                <Typography variant="body2">
                  Tel : <b>{row.clinic.phone_number}</b>
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1}>
                <FlagIcon />
                <Typography variant="body2">
                  Pays : <b>{row.clinic.country}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <LocationCityIcon />
                <Typography variant="body2">
                  Ville : <b>{row.clinic.city + ", " + row.clinic.zip_code}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <DoneOutlineIcon />
                <Typography variant="body2">
                  Approuvée :{" "}
                  <b>{row.clinic.owner.is_approved ? "Oui" : "Non"}</b>
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
  )
}

export default ClinicInfo