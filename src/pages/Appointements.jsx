import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import { CustomToolbar } from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import { Typography, Alert } from "@mui/material";

const columns = [

  { field: "user_name", headerName: "User", flex: 1 },
  { field: "user_email", headerName: "User Email", flex: 1 },
  { field: "pet_name", headerName: "Pet Name", flex: 1 },
  { field: "breed", headerName: "Race", flex: 1 },
  { field: "sex", headerName: "Sexe", flex: 1 },
  { field: "vet_name", headerName: "Vet", flex: 1 },
  { field: "vet_email", headerName: "Vet Email", flex: 1 },
  // { field: "balance", headerName: "Balance", flex: 1 },
  // { field: "type", headerName: "Type", flex: 1 },
  // { field: "is_approved", headerName: "Approuvé", flex: 1 },
  // { field: "profile_complete", headerName: "Profile Complet", flex: 1 },
];

const Appointements = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { apiUrl } = useEnv();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${apiUrl}/getAllAppointments`, {
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
          const appointements = data.map((appointement) => ({
            id: appointement.id,
            user_name: appointement.user.first_name + " " + appointement.user.last_name,
            user_email: appointement.user.email,
            pet_name : appointement.pet.name,
            breed : appointement.pet.breed,
            sex : appointement.pet.sex,
            vet_name : appointement.vet.first_name  + " " + appointement.vet.last_name,
            vet_email: appointement.vet.email,
          }));
          setRows(appointements);
        } else {
          setError("Something went wrong, please try again");
        }
      } catch (err) {
        console.error(err);
        if (err.name === "AbortError") return;
        setError("Something went wrong, please try again");
      }
    };
    setLoading(true);
    fetchUsers();
    setLoading(false);
    return () => controller.abort();
  }, []);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Liste Des Rendez vous
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
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

export default Appointements;
