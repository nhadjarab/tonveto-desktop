import { useState, useEffect } from "react";
import { Loading, Table } from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import { Typography, Button, LinearProgress } from "@mui/material";

const PendingVet = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingApprouve, setLoadingApprove] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { apiUrl } = useEnv();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const PendingVets = async () => {
      setLoading(true);
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
        setLoading(false);
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

    PendingVets();

    return () => controller.abort();
  }, []);

  const handleApprove = async (event, cellValues) => {
    const vetId = cellValues.row.id;
    setLoadingApprove(true);
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
    setLoadingApprove(false);
  };

  const columns = [
    { field: "first_name", headerName: "Prénom", flex: 1 },
    { field: "last_name", headerName: "Nom", flex: 1 },
    { field: "birth_date", headerName: "Date de naissance", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone_number", headerName: "Téléphone", flex: 1 },
    { field: "bank_details", headerName: "RIB", flex: 1 },
    {
      field: "Actions",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div>
            <Button
              variant="outlined"
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

  if (loading) return <Loading />;

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 4 }}>
        # Liste des vétérinaires en attente
      </Typography>
      {loadingApprouve && <LinearProgress />}
      <Table columns={columns} rows={rows} error={error} />
    </div>
  );
};

export default PendingVet;
