import { useEffect, useState } from "react";
import { Loading, Table } from "../components";
import { Typography, Link } from "@mui/material";

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
    { field: "client", headerName: "Client", flex: 2 },
    { field: "email", headerName: "Email", flex: 2 },
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

  if (loading) return <Loading />;

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 4 }}>
        # Liste Des Factures
      </Typography>
      <Table columns={columns} rows={invoices} error={error} />
    </div>
  );
};

export default Invoices;
