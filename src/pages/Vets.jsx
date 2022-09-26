import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loading, KPICard, Table } from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import { Typography, Grid } from "@mui/material";

const columns = [
  { field: "first_name", headerName: "Prénom", flex: 1 },
  { field: "last_name", headerName: "Nom", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phone_number", headerName: "Tel", flex: 1 },
  { field: "birth_date", headerName: "Date de Naissance", flex: 1 },
  { field: "bank_details", headerName: "Bank Details", flex: 1 },
  { field: "balance", headerName: "Balance", flex: 1 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "is_approved", headerName: "Approuvé", flex: 1 },
  { field: "profile_complete", headerName: "Profile Complet", flex: 1 },
];

const Vets = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { apiUrl } = useEnv();
  const navigate = useNavigate();

  const numberOfVets = useMemo(() => {
    return rows.length;
  }, [rows.length]);

  const completProfilePercentage = useMemo(() => {
    if (rows.length == 0) return "0%";
    return (
      Math.round(
        (rows.filter((row) => !row.profile_complete).length * 100) / rows.length
      ) + "%"
    );
  }, [rows.length]);

  const approvedProfilePercentage = useMemo(() => {
    if (rows.length == 0) return "0%";
    return (
      Math.round(
        (rows.filter((row) => row.is_approved).length * 100) / rows.length
      ) + "%"
    );
  }, [rows.length]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/getAllVets`, {
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
    fetchUsers();
    return () => controller.abort();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <Grid container spacing={3} sx={{ marginBottom: 8 }}>
        <Grid xs={4} item>
          <KPICard title="Nombre De Vétérinaire" value={numberOfVets} />
        </Grid>
        <Grid xs={4} item>
          <KPICard
            title="Taux De Profile Incomplet"
            value={completProfilePercentage}
          />
        </Grid>
        <Grid xs={4} item>
          <KPICard
            title="Taux De Profile Approuvé"
            value={approvedProfilePercentage}
          />
        </Grid>
      </Grid>
      <Typography variant="h4" sx={{ mb: 4 }}>
        # Liste Des Vétérinaires
      </Typography>
      <Table
        columns={columns}
        rows={rows}
        error={error}
        onRowClick={(params, event, details) => {
          console.log(params.id);
          navigate(`/vets/${params.id}`);
        }}
      />
    </div>
  );
};

export default Vets;
