import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import { CustomToolbar } from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import { Typography, Alert } from "@mui/material";

const columns = [
  { field: "first_name", headerName: "Prénom", flex: 1 },
  { field: "last_name", headerName: "Nom", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phone_number", headerName: "Tel", flex: 1 },
  { field: "birth_date", headerName: "Date de Naissance", flex: 1 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "profile_complete", headerName: "Profile Complet", flex: 1 },
];

const Home = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { apiUrl } = useEnv();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${apiUrl}/getAllUsers`, {
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
    setLoading(true);
    fetchUsers();
    setLoading(false);
    return () => controller.abort();
  }, []);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Liste Des Utilisateurs
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
          onRowClick={(params, event, details) => {
            console.log(params.id);
            navigate(`/users/${params.id}`);
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

export default Home;
