import { useEffect, useState } from "react";
import { Loading, Table } from "../components";
import { Typography, Link } from "@mui/material";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      const response = await window.server.getSubscriptions();
      setLoading(false);
      setSubscriptions(response);
    };
    fetchSubscriptions();
  }, []);
  const columns = [
    { field: "name", headerName: "Nom", flex: 1 },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "price", headerName: "Prix", flex: 1 },
    { field: "description", headerName: "Description", flex: 3 },
    { field: "startDate", headerName: "Début", flex: 1 },
    { field: "endDate", headerName: "Fin", flex: 1 },
    {
      field: "Facture",
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
        # Liste Des Abonnements
      </Typography>
      <Table columns={columns} rows={subscriptions} error={error} />
    </div>
  );
};

export default Subscriptions;
