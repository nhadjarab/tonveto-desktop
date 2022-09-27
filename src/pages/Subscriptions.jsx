import { useEffect, useState } from "react";
import { Loading, Table } from "../components";
import { Typography, Link, Button, LinearProgress } from "@mui/material";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
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

  const handleCancel = async (_event, cellValues) => {
    const subscriptionId = cellValues.row.id;
    setLoadingCancel(true);
    const response = await window.server.CancelSubscription(subscriptionId);
    console.log(response);
    setSubscriptions((prev) =>
      prev.map((subscription) => {
        if (subscription.id !== subscriptionId) return subscription;
        return { ...subscription, status: "canceled" };
      })
    );
    setLoadingCancel(false);
  };

  const columns = [
    { field: "customer", headerName: "Client", flex: 2 },
    { field: "status", headerName: "Etat", flex: 1 },
    { field: "billing", headerName: "Facturation", flex: 1 },
    { field: "product", headerName: "Produit", flex: 1 },
    { field: "created", headerName: "Début", flex: 1 },
    {
      field: "Actions",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div>
            {cellValues.row.status !== "canceled" && (
              <Button
                variant="outlined"
                color="error"
                sx={{ mr: "5px" }}
                onClick={(event) => {
                  handleCancel(event, cellValues);
                }}
              >
                Annuler
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 4 }}>
        # Liste Des Abonnements
      </Typography>
      {loadingCancel && <LinearProgress />}
      <Table columns={columns} rows={subscriptions} error={error} />
    </div>
  );
};

export default Subscriptions;
