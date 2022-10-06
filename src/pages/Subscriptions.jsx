import { useEffect, useState } from "react";
import { Loading, Table, TonventoTabs } from "../components";
import { Typography, Button, LinearProgress } from "@mui/material";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [canceledSubscriptions, setCanceledSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      const response = await window.server.getSubscriptions();
      const canceled = await window.server.getCanceledSubscriptions();
      setSubscriptions(response);
      setCanceledSubscriptions(canceled);
      setLoading(false);
    };

    fetchSubscriptions();
  }, []);

  const handlePause = async (_event, cellValues) => {
    const subscriptionId = cellValues.row.id;
    setLoadingCancel(true);
    const response = await window.server.pauseSubscription(subscriptionId);

    setSubscriptions((prev) =>
      prev.map((subscription) => {
        if (subscription.id !== subscriptionId) return subscription;
        return { ...subscription, status: response };
      })
    );
    setLoadingCancel(false);
  };
  const handleCancel = async (_event, cellValues) => {
    const subscriptionId = cellValues.row.id;
    setLoadingCancel(true);
    await window.server.cancelSubscription(subscriptionId);
    const subscription = subscriptions.find((sub) => sub.id === subscriptionId);
    setCanceledSubscriptions((prev) => [
      { ...subscription, status: "canceled" },
      ...prev,
    ]);
    setSubscriptions((prev) =>
      prev.filter((subscription) => subscription.id !== subscriptionId)
    );
    setLoadingCancel(false);
  };
  const handleReactivate = async (_event, cellValues) => {
    const subscriptionId = cellValues.row.id;
    setLoadingCancel(true);
    const response = await window.server.reactivateSubscription(subscriptionId);
    console.log(response);
    setSubscriptions((prev) =>
      prev.map((subscription) => {
        if (subscription.id !== subscriptionId) return subscription;
        return { ...subscription, status: "active" };
      })
    );
    setLoadingCancel(false);
  };

  const columns = [
    { field: "client", headerName: "Client", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "status", headerName: "Etat", flex: 2 },
    { field: "billing", headerName: "Facturation", flex: 1 },
    { field: "product", headerName: "Produit", flex: 2 },
    { field: "created", headerName: "Début", flex: 1 },
    {
      field: "Actions",
      flex: 2,
      renderCell: (cellValues) => {
        return (
          <div>
            {cellValues.row.status === "active" ? (
              <>
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
                <Button
                  variant="outlined"
                  color="warning"
                  sx={{ mr: "5px" }}
                  onClick={(event) => {
                    handlePause(event, cellValues);
                  }}
                >
                  Pause
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                color="success"
                sx={{ mr: "5px" }}
                onClick={(event) => {
                  handleReactivate(event, cellValues);
                }}
              >
                Réactiver
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const canceledColumns = [
    { field: "client", headerName: "Client", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "status", headerName: "Etat", flex: 1 },
    { field: "billing", headerName: "Facturation", flex: 1 },
    { field: "product", headerName: "Produit", flex: 2 },
    { field: "created", headerName: "Début", flex: 1 },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 4 }}>
        # Liste des abonnements
      </Typography>
      {loadingCancel && <LinearProgress />}
      <TonventoTabs
        tabsTiles={["Active", "Annulée"]}
        tabsContents={[
          <Table columns={columns} rows={subscriptions} error={error} />,
          <Table
            columns={canceledColumns}
            rows={canceledSubscriptions}
            error={error}
          />,
        ]}
      />
    </div>
  );
};

export default Subscriptions;
