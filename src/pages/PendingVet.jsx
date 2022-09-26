import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import { CustomToolbar } from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import { Typography, Alert, Button, LinearProgress } from "@mui/material";

const PendingVet = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { apiUrl } = useEnv();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const PendingVets = async () => {
      try {
        const res = await fetch(`${apiUrl}/getAllVetApplications`, {
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
    PendingVets();
    setLoading(false);
    return () => controller.abort();
  }, []);

  const handleApprove = async (event, cellValues) => {
    const vetId = cellValues.row.id;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/approveVet/${vetId}`, {
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
        setRows((prevRows) => prevRows.filter((row) => row.id !== vetId));
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
    { field: "first_name", headerName: "Prénom", flex: 1 },
    { field: "last_name", headerName: "Nom", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone_number", headerName: "Tel", flex: 1 },
    { field: "birth_date", headerName: "Date de Naissance", flex: 1 },
    { field: "bank_details", headerName: "Bank Details", flex: 1 },
    { field: "balance", headerName: "Balance", flex: 1 },
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
        Pending Vet Applications
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

export default PendingVet;