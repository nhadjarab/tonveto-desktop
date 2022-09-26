import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

const columns = [
  { field: "first_name", headerName: "Prénom", flex: 1 },
  { field: "last_name", headerName: "Nom", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phone_number", headerName: "Tel", flex: 1 },
  { field: "birth_date", headerName: "Date de Naissance", flex: 1 },
  { field: "bank_details", headerName: "Bank Details", flex: 1 },
  { field: "balance", headerName: "Balance", flex: 1 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "is_approved", headerName: "Approuvé", flex: 1 },
  { field: "profile_complete", headerName: "Profile Complet", flex: 1 },
];

const Vets = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { apiUrl } = useEnv();
  const navigate = useNavigate();

  const numberOfVets = useMemo(() => {
    return rows.length;
  }, [rows.length]);

  const completProfilePercentage = useMemo(() => {
    if (rows.length == 0) return "0%";
    return (
      Math.round(
        (rows.filter((row) => !row.profile_complete).length * 100) / rows.length
      ) + "%"
    );
  }, [rows.length]);

  const approvedProfilePercentage = useMemo(() => {
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
        const res = await fetch(`${apiUrl}/getAllVets`, {
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
        <Grid xs={4} item>
          <Paper align="center" sx={{ padding: 2, color: "#222f3e" }}>
            <Typography variant="h2" fontWeight="bold">
              {numberOfVets}
            </Typography>
            <Typography variant="h5" fontWeight="semi-bold">
              Nombre De Vétérinaire
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={4} item>
          <Paper align="center" sx={{ padding: 2, color: "#222f3e" }}>
            <Typography variant="h2" fontWeight="bold">
              {completProfilePercentage}
            </Typography>
            <Typography variant="h5" fontWeight="semi-bold">
              Taux De Profile Incomplet
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={4} item>
          <Paper align="center" sx={{ padding: 2, color: "#222f3e" }}>
            <Typography variant="h2" fontWeight="bold">
              {approvedProfilePercentage}
            </Typography>
            <Typography variant="h5" fontWeight="semi-bold">
              Taux De Profile Approuvé
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Typography variant="h4" sx={{ mb: 4 }}>
        # Liste Des Vétérinaires
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
          onRowClick={(params, event, details) => {
            console.log(params.id);
            navigate(`/vets/${params.id}`);
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

export default Vets;
