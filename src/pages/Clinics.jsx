import { useState, useEffect, useMemo } from "react";
import { Loading, KPICard, Table } from "../components";
import { useAuth } from "../context/AuthProvider";
import { useEnv } from "../hooks/EnvHook";
import { Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const columns = [
  { field: "name", headerName: "Nom", flex: 2 },
  { field: "address", headerName: "Adresse", flex: 1 },
  { field: "city", headerName: "Ville", flex: 1 },
  { field: "zip_code", headerName: "Code Postal", flex: 1 },
  { field: "country", headerName: "Pays", flex: 1 },
  { field: "phone_number", headerName: "Téléphone", flex: 1 },
  { field: "is_approved", headerName: "Approuvée", flex: 1 },
];

const Clinics = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { apiUrl } = useEnv();
  const navigate = useNavigate();
  
  const numberOfClinics = useMemo(() => {
    return rows.length;
  }, [rows.length]);

  const approvedClinicsPercentage = useMemo(() => {
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
        const res = await fetch(`${apiUrl}/getAllClinics`, {
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
        <Grid xs={6} item>
          <KPICard title="Nombre de cliniques" value={numberOfClinics} />
        </Grid>
        <Grid xs={6} item>
          <KPICard
            title="Taux de clinique approuvées"
            value={approvedClinicsPercentage}
          />
        </Grid>
      </Grid>
      <Typography variant="h4" sx={{ mb: 4 }}>
        # Liste des cliniques
      </Typography>
      <Table
        columns={columns}
        rows={rows}
        error={error}
        onRowClick={(params, event, details) => {
          console.log(params.id);
          navigate(`/clinics/${params.id}`);
        }}
      />
    </div>
  );
};

export default Clinics;
