import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import { CustomToolbar } from "../components";
import { Typography, Alert, Link, CircularProgress, Box } from "@mui/material";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      const response = await window.server.getInvoices();
      setLoading(false);
      setInvoices(response);
    };
    fetchInvoices();
  }, []);
  const columns = [
    { field: "name", headerName: "Nom", flex: 1 },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "phone", headerName: "Tel", flex: 1 },
    { field: "price", headerName: "Prix", flex: 1 },
    { field: "description", headerName: "Description", flex: 3 },
    { field: "startDate", headerName: "Début", flex: 1 },
    { field: "endDate", headerName: "Fin", flex: 1 },
    {
      field: "PDF",
      flex: 1,
      renderCell: (cellValues) => (
        <Link href={cellValues.row.pdf} download>
          Télécharger
        </Link>
      ),
    },
  ];
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
      <Typography variant="h4" sx={{ mb: 4 }}>
        # Liste Des Factures
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
          rows={invoices}
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

export default Invoices;
