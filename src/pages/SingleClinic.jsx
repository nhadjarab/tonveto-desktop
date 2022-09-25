import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import { CustomToolbar } from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import {
  Paper,
  Typography,
  Stack,
  Grid,
  CircularProgress,
  Box,
  Rating,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import KeyIcon from "@mui/icons-material/Key";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import FlagIcon from "@mui/icons-material/Flag";
import LocationCityIcon from "@mui/icons-material/LocationCity";

const vetColumns = [
  { field: "first_name", headerName: "Prénom", flex: 1 },
  { field: "last_name", headerName: "Nom", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phone_number", headerName: "Tel", flex: 1 },
  { field: "birth_date", headerName: "Date de Naissance", flex: 1 },
  { field: "bank_details", headerName: "Bank Details", flex: 1 },
  { field: "balance", headerName: "Balance", flex: 1 },
  { field: "is_approved", headerName: "Approuvé", flex: 1 },
  { field: "profile_complete", headerName: "Profile Complet", flex: 1 },
];

const SingleClinic = () => {
  const { clinicId } = useParams();
  const { apiUrl } = useEnv();
  const { user } = useAuth();
  const [row, setRow] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchVet = async () => {
      try {
        const res = await fetch(`${apiUrl}/clinic/${clinicId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
            logged_in_id: user.userId,
          },
          signal,
        });

        const data = await res.json();
        if (res.status === 200) {
          console.log(data);
          const vets = data.clinic.vets.map((vet) => ({
            ...vet.vet,
          }));
          setRow({ ...data, clinic: { ...data.clinic, vets } });
        } else {
          setError("Something went wrong, please try again");
        }
      } catch (err) {
        console.error(err);
        if (err.name === "AbortError") return;
        setError("Something went wrong, please try again");
      }
    };
    fetchVet();
    return () => controller.abort();
  }, [clinicId]);

  if (!row)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <div>
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
                  <b>{row.clinic.address + ", " + row.clinic.zip_code}</b>
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
                  Ville : <b>{row.clinic.city}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <DoneOutlineIcon />
                <Typography variant="body2">
                  Approuvé :{" "}
                  <b>{row.clinic.owner.is_approved ? "Oui" : "Non"}</b>
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ padding: 2, marginBottom: 4 }}>
        <Box align="center">
          <Typography variant="h4">
            Propriétaire :{" "}
            {row.clinic.owner.first_name.toUpperCase() +
              " " +
              row.clinic.owner.last_name.toUpperCase()}
          </Typography>
        </Box>
        <Grid container maxWidth="md" sx={{ margin: "25px auto" }}>
          <Grid item xs={6}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1}>
                <KeyIcon />
                <Typography variant="body2">
                  {" "}
                  ID : <b>{row.clinic.owner.id}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <EmailIcon />
                <Typography variant="body2">
                  Email : <b>{row.clinic.owner.email}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <PhoneIcon />
                <Typography variant="body2">
                  Tel : <b>{row.clinic.owner.phone_number}</b>
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1}>
                <CalendarMonthIcon />
                <Typography variant="body2">
                  Né le : <b>{row.clinic.owner.birth_date}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <DoneOutlineIcon />
                <Typography variant="body2">
                  Profile :{" "}
                  <b>
                    {row.clinic.owner.profile_complete
                      ? "complet"
                      : "incomplet"}
                  </b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <PersonIcon />
                <Typography variant="body2">
                  Type : <b>{row.clinic.owner.type}</b>
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h4" align="center">
        Membre du staff
      </Typography>
      <div
        style={{
          height: 450,
          width: "100%",
          marginTop: "15px",
          marginBottom: "15px",
        }}
      >
        <DataGrid
          rows={row.clinic.vets}
          columns={vetColumns}
          loading={row == null}
          pageSize={10}
          rowsPerPageOptions={[10]}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </div>
    </div>
  );
};

export default SingleClinic;
