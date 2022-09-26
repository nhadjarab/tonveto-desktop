import { useState, useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import { CustomToolbar } from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import {
  Typography,
  Alert,
  CircularProgress,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const columns = [
  { field: "name", headerName: "Nom", flex: 2 },
  { field: "country", headerName: "Pays", flex: 1 },
  { field: "city", headerName: "Ville", flex: 1 },
  { field: "address", headerName: "Adresse", flex: 1 },
  { field: "zip_code", headerName: "Code Postal", flex: 1 },
  { field: "phone_number", headerName: "Tel", flex: 1 },
  { field: "is_approved", headerName: "Approuvé", flex: 1 },
];

const Clinics = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { apiUrl } = useEnv();
  const navigate = useNavigate();
  const numberOfClinics = useMemo(() => {
    return rows.length;
  }, [rows.length]);

  const approvedClinicsPercentage = useMemo(() => {
    if (rows.length == 0) return "0%";
    return (
      Math.round(
        (rows.filter((row) => row.is_approved).length * 100) / rows.length
      ) + "%"
    );
  }, [rows.length]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/getAllClinics`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
            logged_in_id: user.userId,
          },
          signal,
        });

        const data = await res.json();
        setLoading(false);
        if (res.status === 200) {
          setRows(data);
        } else {
          setError("Something went wrong, please try again");
        }
      } catch (err) {
        console.error(err);
        if (err.name === "AbortError") return;
        setError("Something went wrong, please try again");
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, []);
  if (loading)
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
      <Grid container spacing={3} sx={{ marginBottom: 8 }}>
        <Grid xs={6} item>
          <Paper align="center" sx={{ padding: 2, color: "#222f3e" }}>
            <Typography variant="h2" fontWeight="bold">
              {numberOfClinics}
            </Typography>
            <Typography variant="h5" fontWeight="semi-bold">
              Nombre De Cliniques
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={6} item>
          <Paper align="center" sx={{ padding: 2, color: "#222f3e" }}>
            <Typography variant="h2" fontWeight="bold">
              {approvedClinicsPercentage}
            </Typography>
            <Typography variant="h5" fontWeight="semi-bold">
              Taux De Clinique Approuvée
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Typography variant="h4" sx={{ mb: 4 }}>
        # Liste Des Cliniques
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
          onRowClick={(params, event, details) => {
            console.log(params.id);
            navigate(`/clinics/${params.id}`);
          }}
          rows={rows}
          columns={columns}
          loading={loading}
          pageSize={20}
          rowsPerPageOptions={[20]}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </div>
    </div>
  );
};

export default Clinics;
