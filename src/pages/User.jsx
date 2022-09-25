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
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import KeyIcon from "@mui/icons-material/Key";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

const petColumns = [
  { field: "name", headerName: "Nom", flex: 1 },
  { field: "species", headerName: "Espèce", flex: 1 },
  { field: "breed", headerName: "Race", flex: 1 },
  { field: "sex", headerName: "Sexe", flex: 1 },
  { field: "crossbreed", headerName: "Croisé", flex: 1 },
  { field: "sterilised", headerName: "Sterilisé", flex: 1 },
  { field: "birth_date", headerName: "Date de Naissance", flex: 1 },
];
const appointmentsColumns = [
  { field: "date", headerName: "Date", flex: 1 },
  { field: "pet_name", headerName: "Pet Name", flex: 1 },
//   { field: "breed", headerName: "Race", flex: 1 },
//   { field: "sex", headerName: "Sexe", flex: 1 },
  { field: "vet_name", headerName: "Vet", flex: 1 },
//   { field: "vet_email", headerName: "Vet Email", flex: 1 },
  { field: "clinic", headerName: "Clinique", flex: 2 },
  { field: "full_address", headerName: "Adresse Compléte", flex: 2 },
];

const User = () => {
  const { userId } = useParams();
  const { apiUrl } = useEnv();
  const { user } = useAuth();
  const [row, setRow] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
            logged_in_id: user.userId,
          },
          signal,
        });

        const data = await res.json();
        console.log(data);
        if (res.status === 200) {
          const appointments = data.appointments.map((appointement) => ({
            id: appointement.id,
            pet_name: appointement.pet.name,
            breed: appointement.pet.breed,
            sex: appointement.pet.sex,
            vet_name:
              appointement.vet.first_name + " " + appointement.vet.last_name,
            vet_email: appointement.vet.email,
            date: appointement.date + " à " + appointement.time,
            clinic : appointement.clinic.name,
            full_address : appointement.clinic.country + " " + appointement.clinic.city + " " + appointement.clinic.address + " "
          }));
          setRow({ ...data, appointments });
        } else {
          setError("Something went wrong, please try again");
        }
      } catch (err) {
        console.error(err);
        if (err.name === "AbortError") return;
        setError("Something went wrong, please try again");
      }
    };
    fetchUser();
    return () => controller.abort();
  }, [userId]);

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
        <Typography variant="h4" align="center">
          {row.first_name.toUpperCase() + " " + row.last_name.toUpperCase()}
        </Typography>
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

      <Typography variant="h4">
        {row.first_name.toUpperCase() + "'S PETS"}
      </Typography>
      <div style={{ height: 450, width: "100%", marginTop: "15px",marginBottom: "15px" }}>
        <DataGrid
          rows={row.pets}
          columns={petColumns}
          loading={row == null}
          pageSize={10}
          rowsPerPageOptions={[10]}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </div>
      <Typography variant="h4">
        {row.first_name.toUpperCase() + "'S APPOINTEMENTS"}
      </Typography>
      <div style={{ height: 450, width: "100%", marginTop: "15px" }}>
        <DataGrid
          rows={row.appointments}
          columns={appointmentsColumns}
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

export default User;
