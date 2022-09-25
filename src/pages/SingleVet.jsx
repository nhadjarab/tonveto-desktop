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

const clinicColumns = [
  { field: "name", headerName: "Nom", flex: 1 },
  { field: "country", headerName: "Pays", flex: 1 },
  { field: "address", headerName: "Adresse", flex: 1 },
  { field: "zip_code", headerName: "Code Postal", flex: 1 },
  { field: "phone_number", headerName: "Tel", flex: 1 },
  { field: "is_approved", headerName: "Approuvé", flex: 1 },
];
const appointmentsColumns = [
  { field: "date", headerName: "Date", flex: 1 },
  { field: "pet_name", headerName: "Pet Name", flex: 1 },
  { field: "breed", headerName: "Race", flex: 1 },
  { field: "sex", headerName: "Sexe", flex: 1 },
  { field: "user_name", headerName: "User", flex: 1 },
  { field: "user_email", headerName: "User Email", flex: 1 },
];

const SingleVet = () => {
  const { vetId } = useParams();
  const { apiUrl } = useEnv();
  const { user } = useAuth();
  const [row, setRow] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchVet = async () => {
      try {
        const res = await fetch(`${apiUrl}/vet/${vetId}`, {
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
          const appointments = data.vetProfile.appointments.map(
            (appointement) => ({
              id: appointement.id,
              pet_name: appointement.pet.name,
              breed: appointement.pet.breed,
              sex: appointement.pet.sex,
              user_name:
                appointement.user.first_name +
                " " +
                appointement.user.last_name,
              user_email: appointement.user.email,
              date: appointement.date + " à " + appointement.time,
            })
          );
          const clinics = data.vetProfile.clinics.map((clinic) => ({
            ...clinic.clinic,
          }));
          setRow({
            ...data,
            vetProfile: { ...data.vetProfile, appointments, clinics },
          });
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
  }, [vetId]);

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
          <Typography variant="h4">
            {row.vetProfile.first_name.toUpperCase() +
              " " +
              row.vetProfile.last_name.toUpperCase()}
          </Typography>
          <Rating
            name="read-only"
            value={row?.vetRating?._avg?.rating || 0}
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
                  ID : <b>{row.vetProfile.id}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <EmailIcon />
                <Typography variant="body2">
                  Email : <b>{row.vetProfile.email}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <PhoneIcon />
                <Typography variant="body2">
                  Tel : <b>{row.vetProfile.phone_number}</b>
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1}>
                <CalendarMonthIcon />
                <Typography variant="body2">
                  Né le : <b>{row.vetProfile.birth_date}</b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <DoneOutlineIcon />
                <Typography variant="body2">
                  Profile :{" "}
                  <b>
                    {row.vetProfile.profile_complete ? "complet" : "incomplet"}
                  </b>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <PersonIcon />
                <Typography variant="body2">
                  Type : <b>{row.vetProfile.type}</b>
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
      <Typography variant="h4" align="center">
        Spécialités
      </Typography>
      <Grid container spacing={3} sx={{ marginTop: 1, marginBottom: 8 }}>
        {row.vetProfile.specialities.map((speciality) => (
          <Grid xs={4} item key={speciality.id}>
            <Paper align="center" sx={{ padding: 2 }}>
              <Typography variant="h2" fontWeight="bold">
                {speciality.price}€
              </Typography>
              <Typography variant="h5" fontWeight="semi-bold">
                {speciality.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h4" align="center">
        Appointments
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
          rows={row.vetProfile.appointments}
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
      <Typography variant="h4" align="center">
        Cliniques
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
          rows={row.vetProfile.clinics}
          columns={clinicColumns}
          loading={row == null}
          pageSize={10}
          rowsPerPageOptions={[10]}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </div>
      <Typography variant="h4" align="center">
        Ratings
      </Typography>
      <Paper sx={{ maxHeight: "800px", overflowY: "auto" }}>
        {row.vetProfile.CommentVet.map((comment) => (
          <Box key={comment.id} sx={{ padding: 2 }}>
            <Typography variant="body1">
              {comment.owner.first_name || comment.owner.last_name
                ? comment.owner.first_name.toUpperCase() +
                  " " +
                  comment.owner.last_name.toUpperCase()
                : comment.owner.email}
            </Typography>
            <Rating
              name="read-only"
              value={comment?.rating?.rating || 0}
              readOnly
              precision={0.1}
            />
            <Typography varinat="body2" color="text.secondary">
              {comment.text}
            </Typography>
          </Box>
        ))}
      </Paper>
    </div>
  );
};

export default SingleVet;
