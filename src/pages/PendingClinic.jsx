import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import { CustomToolbar } from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import { Typography, Alert, Button, LinearProgress } from "@mui/material";

const PendingClinic = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { apiUrl } = useEnv();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchPendingClinics = async () => {
      try {
        const res = await fetch(`${apiUrl}/getAllClinicApplications`, {
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
    fetchPendingClinics();
    setLoading(false);
    return () => controller.abort();
  }, []);

  const handleApprove = async (event, cellValues) => {
    const clinicId = cellValues.row.id;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/approveClinic/${clinicId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
          logged_in_id: user.userId,
        },
      });

      const data = await res.json();
      console.log(data);
      if (res.status === 200) {
        setRows((prevRows) => prevRows.filter((row) => row.id !== clinicId));
      } else {
        setError("Something went wrong, please try again");
      }
    } catch (err) {
      console.error(err);
      if (err.name === "AbortError") return;
      setError("Something went wrong, please try again");
    }
    setLoading(false);
  };

  const columns = [
    { field: "name", headerName: "Nom", flex: 2 },
    { field: "country", headerName: "Pays", flex: 1 },
    { field: "city", headerName: "Ville", flex: 1 },
    { field: "address", headerName: "Adresse", flex: 1 },
    { field: "zip_code", headerName: "Code Postal", flex: 1 },
    { field: "phone_number", headerName: "Tel", flex: 1 },
    {
      field: "Actions",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: "5px" }}
              onClick={(event) => {
                handleApprove(event, cellValues);
              }}
            >
              Approuver
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Pending Clinic Applications
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <div style={{ height: 450, width: "100%" }}>
        {loading && <LinearProgress />}
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

export default PendingClinic;
